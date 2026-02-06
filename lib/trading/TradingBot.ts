// ============================================================================
// TradingBot - Core Trading Logic (React-free)
// ============================================================================

import { DailyTargetController } from './DailyTargetController';
import { dynamicPnLCalculator, type PnLRange } from './DynamicPnLCalculator';
import { marketFrictionSimulator, type FrictionComponents } from './MarketFrictionSimulator';
import { StaggeredClosingManager } from './StaggeredClosingManager';
import type { Position, Trade, BotConfig, BotStats, BotPersonality } from './types';
import { migrateRunningBot, migrateTrades } from './convergence/migration';

export class TradingBot {
  public id: string;
  public config: BotConfig;
  private positions: Position[] = [];
  private trades: Trade[] = [];
  private closedPositionIds: Set<string> = new Set();
  private dailyController: DailyTargetController;
  private staggeredClosingManager: StaggeredClosingManager; // Instance per bot
  private personality: BotPersonality;
  private lastOpenTime: number = 0; // Track last position open time for cooldown
  private lastResetDate: string = ''; // Tracks last daily reset (YYYY-MM-DD UTC)

  constructor(id: string, config: BotConfig) {
    this.id = id;

    // Set defaults for optional parameters
    this.config = {
      ...config,
      createdAt: config.createdAt || Date.now(), // Set creation time if not provided
      allowedSides: config.allowedSides || 'BOTH',
      maxSlippage: config.maxSlippage || 0.5,
      maxTradesHistory: config.maxTradesHistory || 100,
    };

    this.dailyController = new DailyTargetController(
      config.dailyTargetPercent,
      config.investedCapital
    );

    // Create instance of StaggeredClosingManager for this bot (with config if provided)
    const staggeredConfig = this.config.staggeredClosing;
    this.staggeredClosingManager = new StaggeredClosingManager(
      staggeredConfig && staggeredConfig.enabled ? staggeredConfig : undefined
    );

    // Generate unique personality for this bot
    this.personality = {
      aggression: Math.random(),
      patience: Math.random(),
      riskTolerance: Math.random(),
    };

    // Load state if exists
    this.load();
  }

  // ============================================================================
  // Main Loop - Called every second with current prices
  // ============================================================================

  tick(prices: Record<string, number>): void {
    // Check for daily reset first (before any trading logic)
    this.checkDailyReset();

    this.managePositions(prices);
    this.tryOpenNewPosition(prices);
  }

  // ============================================================================
  // Daily Reset Logic
  // ============================================================================

  /**
   * Check if a new day has started (UTC) and reset daily metrics
   * - Open positions stay open (their P&L doesn't count toward new day)
   * - Daily progress resets to 0
   * - Convergence metrics reset (will be implemented with ConvergenceController)
   * - No carry-over: missed target on Day 1 doesn't affect Day 2
   */
  private checkDailyReset(): void {
    // Get current UTC date as YYYY-MM-DD string
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // "2026-02-06"

    // If no reset date stored yet, initialize with current date
    if (!this.lastResetDate) {
      this.lastResetDate = currentDate;
      this.save();
      return;
    }

    // Check if date has changed
    if (currentDate !== this.lastResetDate) {
      console.log(`[TradingBot ${this.id}] Daily reset detected: ${this.lastResetDate} -> ${currentDate}`);

      // Reset daily controller (progress, trades count, realized P&L)
      this.dailyController = new DailyTargetController(
        this.config.dailyTargetPercent,
        this.config.investedCapital
      );
      this.dailyController.save(this.id);

      // TODO (Day 4-5): Reset ConvergenceController when implemented
      // this.convergenceController.resetDaily();

      // Update reset date
      this.lastResetDate = currentDate;

      // Persist changes
      this.save();

      console.log(`[TradingBot ${this.id}] Daily reset complete. Open positions: ${this.positions.length} (stay open)`);
    }
  }

  // ============================================================================
  // Position Management
  // ============================================================================

  private managePositions(prices: Record<string, number>): void {
    const remainingPositions: Position[] = [];
    const now = Date.now();

    this.positions.forEach((pos) => {
      // Update current price
      const symbol = pos.pair.replace('/', '');
      const currentPrice = prices[symbol];

      if (!currentPrice) {
        remainingPositions.push(pos);
        return;
      }

      pos.currentPrice = currentPrice;

      // Calculate P&L
      const priceChange = pos.side === 'LONG'
        ? currentPrice - pos.entryPrice
        : pos.entryPrice - currentPrice;
      const realPnl = (priceChange / pos.entryPrice) * pos.leverage * pos.positionSize;
      const realPnlPercent = (priceChange / pos.entryPrice) * pos.leverage * 100;

      pos.pnl = realPnl;
      pos.pnlPercent = realPnlPercent;

      // Calculate duration
      const duration = now - pos.openedAt;
      pos.duration = `${Math.floor(duration / 1000)}s`;

      // Apply personality to duration thresholds
      const patienceMultiplier = 0.7 + (this.personality.patience * 0.6); // 0.7-1.3
      const minDuration = this.config.minDuration * patienceMultiplier;
      const maxDuration = this.config.maxDuration;
      const midDuration = minDuration + (maxDuration - minDuration) * 0.5;

      let shouldClose = false;
      let needsSlippage = false;
      let slippageReason = '';

      // PRIORITY 1: Check if TP or SL reached
      if (realPnlPercent >= pos.targetPnL) {
        shouldClose = true;
        slippageReason = pos.shouldWin
          ? 'Natural win (TP reached)'
          : 'Unexpected win (TP reached)';
      } else if (realPnlPercent <= pos.stopLossPnL) {
        shouldClose = true;
        slippageReason = !pos.shouldWin
          ? 'Natural loss (SL reached)'
          : 'Unexpected loss (SL reached)';
      }
      // PRIORITY 2: Check minimum duration
      else if (duration < minDuration) {
        remainingPositions.push(pos);
        return;
      }
      // PRIORITY 3: MAX DURATION - Force close (must check before minDuration checks)
      else if (duration >= maxDuration) {
        shouldClose = true;
        needsSlippage = true;
        slippageReason = 'Max duration reached';
      }
      // PRIORITY 4: Early intervention if wrong direction or mid duration
      else if (duration >= minDuration) {
        const wrongDirection = pos.shouldWin ? realPnlPercent < 0 : realPnlPercent > 0;

        if (wrongDirection) {
          shouldClose = true;
          needsSlippage = true;
          slippageReason = 'Early slippage (wrong direction)';

          // If too far wrong, accept mismatch
          if (Math.abs(realPnlPercent) > 0.8) {
            const targetPnl = pos.shouldWin ? pos.targetPnL : pos.stopLossPnL;
            const slippageNeeded = Math.abs(targetPnl - realPnlPercent);

            if (slippageNeeded > this.config.maxSlippage!) {
              needsSlippage = false;
              slippageReason = 'Accept mismatch (slippage too high)';
            }
          }
        } else if (duration >= midDuration) {
          shouldClose = true;
          needsSlippage = true;
          slippageReason = 'Time-based slippage';
        }
      }

      if (shouldClose && !this.closedPositionIds.has(pos.id)) {
        // Check staggered closing (if enabled)
        const staggeredEnabled = this.config.staggeredClosing?.enabled ?? false; // Default: disabled (to avoid delaying TP/SL)

        if (staggeredEnabled) {
          if (pos.scheduledCloseAt) {
            // Already scheduled - check if time to close
            if (now >= pos.scheduledCloseAt) {
              // Time to close!
              this.closePosition(pos, needsSlippage, realPnlPercent);
            } else {
              // Wait for scheduled time
              remainingPositions.push(pos);
            }
          } else {
            // First time we want to close - check with StaggeredClosingManager
            const closingDecision = this.staggeredClosingManager.shouldClosePosition(pos.id);

            if (closingDecision.shouldClose && closingDecision.delayMs < 2000) {
              // Can close immediately (minimal delay)
              this.closePosition(pos, needsSlippage, realPnlPercent);
            } else {
              // Schedule for later to prevent congestion
              pos.scheduledCloseAt = now + closingDecision.delayMs;
              remainingPositions.push(pos);
              // Position scheduled - logging removed for cleaner console
            }
          }
        } else {
          // Staggered closing disabled - close immediately
          this.closePosition(pos, needsSlippage, realPnlPercent);
        }
      } else if (!shouldClose) {
        remainingPositions.push(pos);
      }
    });

    this.positions = remainingPositions;
  }

  // ============================================================================
  // Close Position with Slippage
  // ============================================================================

  private closePosition(pos: Position, needsSlippage: boolean, realPnlPercent: number): void {
    let exitPrice = pos.currentPrice;
    let finalPnlPercent = realPnlPercent;
    let hadSlippage = false;
    let slippageAmount = 0;

    if (needsSlippage) {
      const targetPnl = pos.shouldWin ? pos.targetPnL : pos.stopLossPnL;
      const gap = targetPnl - realPnlPercent;

      const priceChangePercent = (gap / pos.leverage) / 100;
      const slippage = pos.side === 'SHORT'
        ? -pos.currentPrice * priceChangePercent
        : pos.currentPrice * priceChangePercent;

      slippageAmount = Math.abs((slippage / pos.currentPrice) * 100);

      // SLIPPAGE LIMITS (v2.0): Check if slippage is realistic
      // Based on market volatility (from config or estimated)
      const frictionConfig = this.config.marketFriction;
      const volatility = frictionConfig?.forceVolatility ?? 'medium';

      // Realistic slippage thresholds
      const maxRealisticSlippage =
        volatility === 'low' ? 0.15 :
        volatility === 'high' ? 0.5 :
        0.3; // medium

      if (slippageAmount > maxRealisticSlippage) {
        // Slippage exceeds realistic threshold - cap it
        const cappedSlippage = Math.sign(slippage) * (pos.currentPrice * maxRealisticSlippage / 100);
        exitPrice = pos.currentPrice + cappedSlippage;
        slippageAmount = maxRealisticSlippage;

        console.warn(
          `[${this.config.name}] Slippage capped: required ${(Math.abs(slippage / pos.currentPrice) * 100).toFixed(2)}% ` +
          `→ applied ${maxRealisticSlippage}% (${volatility} volatility limit)`
        );
      } else {
        // Realistic slippage - apply fully
        exitPrice = pos.currentPrice + slippage;
      }

      hadSlippage = true;

      // Recalculate final P&L
      const priceChange = pos.side === 'LONG'
        ? exitPrice - pos.entryPrice
        : pos.entryPrice - exitPrice;
      finalPnlPercent = (priceChange / pos.entryPrice) * pos.leverage * 100;
    }

    // Apply market friction (realistic trading costs) if enabled
    const frictionEnabled = this.config.marketFriction?.enabled ?? false; // Default: disabled (to avoid breaking existing bots)
    let friction: FrictionComponents;

    if (frictionEnabled) {
      const forceVolatility = this.config.marketFriction?.forceVolatility;
      const volatility = forceVolatility && forceVolatility !== 'auto'
        ? forceVolatility
        : marketFrictionSimulator.estimateCurrentVolatility();

      friction = marketFrictionSimulator.calculateFriction({
        tradingPair: pos.pair,
        positionSizeUSD: pos.positionSize,
        leverage: pos.leverage,
        side: pos.side,
        volatility,
      });

      // Apply friction to P&L
      finalPnlPercent = marketFrictionSimulator.applyFrictionToPnL(finalPnlPercent, friction);
    } else {
      // Market friction disabled - use zero friction
      friction = {
        slippage: 0,
        spread: 0,
        fundingRate: 0,
        commission: 0,
        total: 0,
      };
    }

    const finalPnl = (pos.positionSize * finalPnlPercent) / 100;
    const isWin = finalPnl >= 0;
    const expectedWin = pos.shouldWin;

    // Mark as closed
    this.closedPositionIds.add(pos.id);

    // Record in StaggeredClosingManager
    this.staggeredClosingManager.recordClosure(pos.id, finalPnl);

    // Record in DailyTargetController
    this.dailyController.recordTrade(finalPnl);

    // Add to trade history
    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pair: pos.pair,
      side: pos.side,
      leverage: pos.leverage,
      entryPrice: pos.entryPrice,
      exitPrice,
      amount: pos.amount,
      positionSize: pos.positionSize,
      pnl: finalPnl,
      pnlPercent: finalPnlPercent,
      duration: pos.duration,
      closedAt: new Date().toISOString(),
      expectedOutcome: expectedWin ? 'WIN' : 'LOSS',
      actualOutcome: isWin ? 'WIN' : 'LOSS',
      hadSlippage,
      slippageAmount: hadSlippage ? slippageAmount : undefined,
      marketFriction: {
        slippage: friction.slippage,
        spread: friction.spread,
        fundingRate: friction.fundingRate,
        commission: friction.commission,
        total: friction.total,
      },
    };

    this.trades.unshift(trade);

    // Keep only last N trades (from config)
    const maxHistory = this.config.maxTradesHistory!;
    if (this.trades.length > maxHistory) {
      this.trades = this.trades.slice(0, maxHistory);
    }

    // Save state after trade (including daily controller and staggered manager)
    this.save();
    this.dailyController.save(this.id);
    this.staggeredClosingManager.save(this.id);
  }

  // ============================================================================
  // Open New Position
  // ============================================================================

  private tryOpenNewPosition(prices: Record<string, number>): void {
    // Limit concurrent positions (from config)
    if (this.positions.length >= this.config.maxConcurrentPositions) return;

    // Cooldown check: minimum 5 seconds between opens to prevent burst opening
    const now = Date.now();
    const cooldownMs = 5000; // 5 seconds
    if (now - this.lastOpenTime < cooldownMs) return;

    // Control frequency (from config)
    if (Math.random() > this.config.openFrequency) return;

    // Check if DailyTargetController allows opening
    if (!this.dailyController.shouldOpenPosition()) return;

    // Select trading pair (randomly from tradingPairs if set, otherwise use tradingPair)
    const availablePairs = this.config.tradingPairs && this.config.tradingPairs.length > 0
      ? this.config.tradingPairs
      : [this.config.tradingPair];

    const tradingPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    const symbol = tradingPair.replace('/', '');
    const price = prices[symbol];

    if (!price) return;

    // Determine leverage configuration for DynamicPnLCalculator
    let leverageMin: number, leverageMax: number;
    if (this.config.leverages && this.config.leverages.length > 0) {
      leverageMin = Math.min(...this.config.leverages);
      leverageMax = Math.max(...this.config.leverages);
    } else if (this.config.leverage) {
      leverageMin = leverageMax = this.config.leverage;
    } else {
      // Default [3, 5, 10]
      leverageMin = 3;
      leverageMax = 10;
    }

    // Calculate optimal P&L range using DynamicPnLCalculator
    const tightModePercent = this.config.pnlVariance?.tightModePercent ?? 80; // Default: 80%
    const pnlRange = dynamicPnLCalculator.calculatePnLRange({
      dailyTargetPercent: this.config.dailyTargetPercent,
      tradesPerDay: this.config.tradesPerDay,
      winRate: this.config.winRate,
      leverageMin,
      leverageMax,
      currentDailyPnL: this.dailyController.getCurrentDailyPnLPercent(),
      tradesRemainingToday: this.dailyController.getTradesRemaining(this.config.tradesPerDay),
      tightModePercent,
      marketFriction: this.config.marketFriction, // Pass friction config
      // NOTE: winPnLMin/Max are IGNORED by calculator (deprecated)
    });

    // Determine if this trade should win
    const shouldWin = Math.random() < this.config.winRate;

    // Calculate adaptive SL/TP based on DynamicPnLCalculator
    let targetPnL: number, stopLossPnL: number;

    if (shouldWin) {
      // Winning trade: Use win range from calculator
      targetPnL = pnlRange.winMin + Math.random() * (pnlRange.winMax - pnlRange.winMin);

      // SL distance based on win rate (higher WR = farther SL)
      const slDistanceMultiplier = 1 + (this.config.winRate * 7); // 1x-8x
      const riskMultiplier = 0.9 + (this.personality.riskTolerance * 0.2); // 0.9-1.1
      stopLossPnL = -(pnlRange.lossMax * slDistanceMultiplier * riskMultiplier);
    } else {
      // Losing trade: Use loss range from calculator
      stopLossPnL = -(pnlRange.lossMin + Math.random() * (pnlRange.lossMax - pnlRange.lossMin));

      // TP very far (unlikely to reach)
      const tpDistanceMultiplier = 2 + ((1 - this.config.winRate) * 2); // 2x-4x
      targetPnL = pnlRange.winMax * tpDistanceMultiplier + 0.5;
    }

    // Position size with personality influence
    const baseSize = this.config.minPositionSize +
      Math.random() * (this.config.maxPositionSize - this.config.minPositionSize);
    const personalityMultiplier = 0.8 + (this.personality.aggression * 0.4); // 0.8-1.2
    const positionSize = baseSize * personalityMultiplier;

    // Adjust based on daily progress
    const adjustedSize = this.dailyController.adjustPositionSize(positionSize);

    // Leverage: select from leverages array if set, otherwise use leverage, otherwise default random
    let leverage: number;
    if (this.config.leverages && this.config.leverages.length > 0) {
      // Random from leverages array
      leverage = this.config.leverages[Math.floor(Math.random() * this.config.leverages.length)];
    } else if (this.config.leverage) {
      // Fixed leverage
      leverage = this.config.leverage;
    } else {
      // Default random
      leverage = [3, 5, 10][Math.floor(Math.random() * 3)];
    }

    // Side: respect config allowedSides
    let side: 'LONG' | 'SHORT';
    if (this.config.allowedSides === 'LONG') {
      side = 'LONG';
    } else if (this.config.allowedSides === 'SHORT') {
      side = 'SHORT';
    } else {
      side = Math.random() > 0.5 ? 'LONG' : 'SHORT';
    }

    const amount = adjustedSize / price;

    // Calculate TP/SL price levels
    const tpPricePercent = targetPnL / (leverage * 100);
    const slPricePercent = Math.abs(stopLossPnL) / (leverage * 100);

    let takeProfit: number, stopLoss: number;

    if (side === 'LONG') {
      takeProfit = price * (1 + tpPricePercent);
      stopLoss = price * (1 - slPricePercent);
    } else {
      takeProfit = price * (1 - tpPricePercent);
      stopLoss = price * (1 + slPricePercent);
    }

    const newPosition: Position = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pair: tradingPair, // Use selected pair from tradingPairs or tradingPair
      side,
      leverage,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercent: 0,
      positionSize: adjustedSize,
      amount,
      stopLoss,
      takeProfit,
      openedAt: Date.now(),
      duration: '0s',
      shouldWin,
      targetPnL,
      stopLossPnL,
      pnlRange: {
        mode: pnlRange.mode,
        baseExpected: pnlRange.baseExpected,
      },
    };

    this.positions.push(newPosition);

    // Update last open time for cooldown
    this.lastOpenTime = now;

    // Save state after opening position
    this.save();
  }

  // ============================================================================
  // Public API
  // ============================================================================

  getStats(): BotStats {
    const wins = this.trades.filter(t => t.pnl > 0);
    const losses = this.trades.filter(t => t.pnl <= 0);

    const totalPnL = this.trades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = this.trades.length > 0
      ? (wins.length / this.trades.length) * 100
      : 0;

    const avgWin = wins.length > 0
      ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length
      : 0;

    const avgLoss = losses.length > 0
      ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length
      : 0;

    return {
      id: this.id,
      name: this.config.name,
      totalPnL,
      winRate,
      tradesCount: this.trades.length,
      winsCount: wins.length,
      lossesCount: losses.length,
      avgWin,
      avgLoss,
      // Deep clone positions to ensure React detects changes
      positions: this.positions.map(p => ({ ...p })),
      trades: [...this.trades].slice(0, 50), // Last 50 trades
    };
  }

  getPositions(): Position[] {
    return [...this.positions];
  }

  getTrades(): Trade[] {
    return [...this.trades];
  }

  getConfig(): BotConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<BotConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update DailyTargetController if target changed
    if (newConfig.dailyTargetPercent || newConfig.investedCapital) {
      this.dailyController.updateTarget(
        newConfig.dailyTargetPercent || this.config.dailyTargetPercent,
        newConfig.investedCapital || this.config.investedCapital
      );
    }

    // Save updated config
    this.save();
  }

  reset(): void {
    this.positions = [];
    this.trades = [];
    this.closedPositionIds.clear();
    this.dailyController.reset();
  }

  // ============================================================================
  // Persistence - Save/Load Runtime State
  // ============================================================================

  /**
   * Save runtime state to localStorage
   * Saves positions, trades, and closed position IDs
   */
  save(): void {
    if (typeof window === 'undefined') return;

    try {
      // Save positions
      localStorage.setItem(`bot_positions_${this.id}`, JSON.stringify(this.positions));

      // Save trades
      localStorage.setItem(`bot_trades_${this.id}`, JSON.stringify(this.trades));

      // Save closed position IDs
      localStorage.setItem(`bot_closed_${this.id}`, JSON.stringify(Array.from(this.closedPositionIds)));

      // Save personality (so bot behaves consistently)
      localStorage.setItem(`bot_personality_${this.id}`, JSON.stringify(this.personality));

      // Save daily controller
      this.dailyController.save(this.id);

      // Save last reset date
      localStorage.setItem(`bot_reset_date_${this.id}`, this.lastResetDate);
    } catch (error) {
      console.error(`[TradingBot ${this.id}] Error saving state:`, error);
    }
  }

  /**
   * Load runtime state from localStorage
   * Restores positions, trades, and closed position IDs
   */
  load(): void {
    if (typeof window === 'undefined') return;

    try {
      // Load positions
      const positionsData = localStorage.getItem(`bot_positions_${this.id}`);
      if (positionsData) {
        const loadedPositions = JSON.parse(positionsData) as Position[];

        // Check if migration is needed (v1 -> v2)
        const needsMigration = loadedPositions.some(
          pos => !pos._version || pos._version !== 'v2'
        );

        if (needsMigration && loadedPositions.length > 0) {
          // Migrate running bot (has open positions from v1)
          const { positions: migratedPositions, warning } = migrateRunningBot(
            this.id,
            loadedPositions
          );
          this.positions = migratedPositions;
          // Warning is already logged by migrateRunningBot()
        } else {
          // No migration needed (already v2 or no positions)
          this.positions = loadedPositions;
        }
      }

      // Load trades
      const tradesData = localStorage.getItem(`bot_trades_${this.id}`);
      if (tradesData) {
        const loadedTrades = JSON.parse(tradesData) as Trade[];
        // Migrate trades if needed (adds default values for missing fields)
        this.trades = migrateTrades(loadedTrades);
      }

      // Load closed position IDs
      const closedData = localStorage.getItem(`bot_closed_${this.id}`);
      if (closedData) {
        this.closedPositionIds = new Set(JSON.parse(closedData));
      }

      // Load personality
      const personalityData = localStorage.getItem(`bot_personality_${this.id}`);
      if (personalityData) {
        this.personality = JSON.parse(personalityData);
      }

      // Load daily controller
      this.dailyController.load(this.id);

      // Load last reset date
      const resetDateData = localStorage.getItem(`bot_reset_date_${this.id}`);
      if (resetDateData) {
        this.lastResetDate = resetDateData;
      }

      // Load staggered closing manager
      this.staggeredClosingManager.load(this.id);

      console.log(
        `[TradingBot ${this.id}] State loaded: ` +
        `${this.positions.length} positions, ${this.trades.length} trades`
      );
    } catch (error) {
      console.error(`[TradingBot ${this.id}] Error loading state:`, error);
    }
  }
}
