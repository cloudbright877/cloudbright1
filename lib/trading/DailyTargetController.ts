/**
 * Daily Target Controller
 *
 * Monitors and adjusts trading to hit daily P&L targets
 * - Tracks progress towards daily goal
 * - Adjusts trade frequency/size if falling behind
 * - Slows down if ahead of schedule
 * - Ensures realistic growth patterns
 */

export interface DailyProgress {
  targetPnL: number;        // Target daily P&L ($)
  currentPnL: number;       // Current P&L today ($)
  percentComplete: number;  // % of day elapsed (0-100)
  percentTarget: number;    // % of target achieved (0-100+)
  status: 'ahead' | 'on_track' | 'behind' | 'completed';
  recommendation: string;
}

export interface TradeAdjustment {
  shouldTrade: boolean;
  frequencyMultiplier: number; // 0.5 = half speed, 2.0 = double speed
  sizeMultiplier: number;      // Position size adjustment
  reason: string;
}

export class DailyTargetController {
  private startOfDay: number = this.getStartOfDay();
  private todaysTrades: Array<{ pnl: number; timestamp: number }> = [];

  constructor(
    private targetDailyPnLPercent: number,
    private investedCapital: number
  ) {}

  /**
   * Add a completed trade to today's log
   */
  recordTrade(pnl: number): void {
    const now = Date.now();

    // Reset if new day
    if (now >= this.startOfDay + 24 * 60 * 60 * 1000) {
      this.reset();
    }

    this.todaysTrades.push({ pnl, timestamp: now });

    // Progress tracking - logging removed for cleaner console
  }

  /**
   * Get current daily progress
   */
  getDailyProgress(): DailyProgress {
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    const elapsed = now - this.startOfDay;
    const percentComplete = Math.min((elapsed / msInDay) * 100, 100);

    const targetPnL = (this.investedCapital * this.targetDailyPnLPercent) / 100;
    const currentPnL = this.todaysTrades.reduce((sum, t) => sum + t.pnl, 0);
    const percentTarget = targetPnL > 0 ? (currentPnL / targetPnL) * 100 : 0;

    // Determine status
    let status: 'ahead' | 'on_track' | 'behind' | 'completed';
    let recommendation: string;

    if (currentPnL >= targetPnL) {
      status = 'completed';
      recommendation = 'Target reached! Consider reducing frequency.';
    } else if (percentTarget >= percentComplete + 20) {
      status = 'ahead';
      recommendation = 'Ahead of schedule. Can maintain current pace.';
    } else if (percentTarget >= percentComplete - 10) {
      status = 'on_track';
      recommendation = 'On track to hit target. Continue current strategy.';
    } else {
      status = 'behind';
      recommendation = 'Behind schedule. Consider increasing trade frequency.';
    }

    return {
      targetPnL,
      currentPnL,
      percentComplete,
      percentTarget,
      status,
      recommendation,
    };
  }

  /**
   * Get trade adjustment recommendation
   * Adjusts frequency/size based on progress
   */
  getTradeAdjustment(): TradeAdjustment {
    const progress = this.getDailyProgress();

    // Completed target: slow down significantly
    if (progress.status === 'completed') {
      return {
        shouldTrade: Math.random() < 0.3, // 30% chance to trade
        frequencyMultiplier: 0.3,
        sizeMultiplier: 0.5,
        reason: 'Daily target reached - reducing activity',
      };
    }

    // Ahead: maintain pace
    if (progress.status === 'ahead') {
      return {
        shouldTrade: true,
        frequencyMultiplier: 0.9,
        sizeMultiplier: 1.0,
        reason: 'Ahead of schedule - maintaining steady pace',
      };
    }

    // On track: normal operation
    if (progress.status === 'on_track') {
      return {
        shouldTrade: true,
        frequencyMultiplier: 1.0,
        sizeMultiplier: 1.0,
        reason: 'On track - normal operation',
      };
    }

    // Behind: speed up (but realistically)
    const gap = progress.percentComplete - progress.percentTarget;
    const urgency = Math.min(gap / 30, 1); // 0-1 based on how far behind

    return {
      shouldTrade: true,
      frequencyMultiplier: 1 + urgency * 0.5, // Up to 1.5x speed
      sizeMultiplier: 1 + urgency * 0.3,      // Up to 1.3x size
      reason: `Behind schedule - increasing activity (urgency: ${(urgency * 100).toFixed(0)}%)`,
    };
  }

  /**
   * Check if should open new position based on daily progress
   */
  shouldOpenPosition(): boolean {
    const adjustment = this.getTradeAdjustment();

    // Trade decision - logging removed for cleaner console

    return adjustment.shouldTrade;
  }

  /**
   * Calculate position size with adjustment
   */
  adjustPositionSize(baseSize: number): number {
    const adjustment = this.getTradeAdjustment();
    const adjusted = baseSize * adjustment.sizeMultiplier;

    // Size adjustment - logging removed for cleaner console

    return adjusted;
  }

  /**
   * Calculate delay before next trade with adjustment
   */
  adjustTradeDelay(baseDelay: number): number {
    const adjustment = this.getTradeAdjustment();
    const adjusted = baseDelay / adjustment.frequencyMultiplier;

    // Frequency adjustment - logging removed for cleaner console

    return adjusted;
  }

  /**
   * Get current daily P&L as percentage of invested capital
   * Used by DynamicPnLCalculator for auto-correction
   */
  getCurrentDailyPnLPercent(): number {
    const totalPnL = this.todaysTrades.reduce((sum, t) => sum + t.pnl, 0);
    return (totalPnL / this.investedCapital) * 100;
  }

  /**
   * Get estimated remaining trades today
   * Used by DynamicPnLCalculator to distribute corrections
   */
  getTradesRemaining(tradesPerDay: number = 8): number {
    const progress = this.getDailyProgress();
    const percentComplete = progress.percentComplete / 100; // 0-1

    // Expected total trades for the day based on current time
    const expectedTotalTrades = Math.ceil(tradesPerDay * (percentComplete + 0.5)); // Slightly optimistic

    // Actual trades so far
    const actualTrades = this.todaysTrades.length;

    // Remaining trades (at least 1 if not end of day)
    const remaining = Math.max(1, expectedTotalTrades - actualTrades);

    return remaining;
  }

  /**
   * Get statistics for today
   */
  getTodayStats(): {
    trades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPnL: number;
    avgWin: number;
    avgLoss: number;
  } {
    const trades = this.todaysTrades.length;
    const wins = this.todaysTrades.filter((t) => t.pnl > 0).length;
    const losses = trades - wins;
    const winRate = trades > 0 ? (wins / trades) * 100 : 0;
    const totalPnL = this.todaysTrades.reduce((sum, t) => sum + t.pnl, 0);

    const winningTrades = this.todaysTrades.filter((t) => t.pnl > 0);
    const losingTrades = this.todaysTrades.filter((t) => t.pnl <= 0);

    const avgWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
        : 0;

    const avgLoss =
      losingTrades.length > 0
        ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length
        : 0;

    return {
      trades,
      wins,
      losses,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
    };
  }

  /**
   * Print daily summary
   */
  printDailySummary(): void {
    const progress = this.getDailyProgress();
    const stats = this.getTodayStats();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📅 Daily Progress Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Day Progress:       ${progress.percentComplete.toFixed(1)}%`);
    console.log(`Target:             $${progress.targetPnL.toFixed(2)}`);
    console.log(`Current:            $${progress.currentPnL.toFixed(2)}`);
    console.log(`Achievement:        ${progress.percentTarget.toFixed(1)}%`);
    console.log(`Status:             ${progress.status.toUpperCase()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Trades Today:       ${stats.trades}`);
    console.log(`Win Rate:           ${stats.winRate.toFixed(1)}%`);
    console.log(`Wins / Losses:      ${stats.wins}W / ${stats.losses}L`);
    console.log(`Avg Win:            +$${stats.avgWin.toFixed(2)}`);
    console.log(`Avg Loss:           ${stats.avgLoss.toFixed(2)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💡 ${progress.recommendation}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Reset for new day
   */
  reset(): void {
    this.startOfDay = this.getStartOfDay();
    this.todaysTrades = [];
  }

  /**
   * Update target
   */
  updateTarget(newTargetPercent: number, newCapital?: number): void {
    this.targetDailyPnLPercent = newTargetPercent;
    if (newCapital) {
      this.investedCapital = newCapital;
    }
  }

  /**
   * Get start of current day (00:00:00 UTC)
   * CRITICAL: Must use UTC to match TradingBot.checkDailyReset() timezone
   */
  private getStartOfDay(): number {
    const now = new Date();
    // Use UTC date string, not local time (prevents timezone desync with TradingBot)
    const utcDateStr = now.toISOString().split('T')[0]; // "2026-02-06"
    return new Date(utcDateStr).getTime();
  }

  /**
   * Save state to localStorage
   * @param botId Bot ID for namespacing
   */
  save(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const state = {
        startOfDay: this.startOfDay,
        todaysTrades: this.todaysTrades,
        targetDailyPnLPercent: this.targetDailyPnLPercent,
        investedCapital: this.investedCapital,
      };

      localStorage.setItem(`bot_daily_${botId}`, JSON.stringify(state));
    } catch (error) {
      console.error(`[DailyTargetController] Error saving state:`, error);
    }
  }

  /**
   * Load state from localStorage
   * @param botId Bot ID for namespacing
   */
  load(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(`bot_daily_${botId}`);
      if (!data) return;

      const state = JSON.parse(data);

      // Check if loaded day is still today
      const now = Date.now();
      if (now >= state.startOfDay + 24 * 60 * 60 * 1000) {
        // Old data from previous day - don't load
        console.log(`[DailyTargetController] Skipping old data from previous day`);
        return;
      }

      this.startOfDay = state.startOfDay;
      this.todaysTrades = state.todaysTrades;
      this.targetDailyPnLPercent = state.targetDailyPnLPercent;
      this.investedCapital = state.investedCapital;

      console.log(
        `[DailyTargetController] State loaded: ${this.todaysTrades.length} trades today`
      );
    } catch (error) {
      console.error(`[DailyTargetController] Error loading state:`, error);
    }
  }
}

// Export singleton instance (can be replaced with bot-specific instances)
export const dailyTargetController = new DailyTargetController(2.0, 5000);
