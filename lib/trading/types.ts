// ============================================================================
// Trading Bot Types
// ============================================================================

export interface Position {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  amount: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  duration: string;
  shouldWin: boolean;        // Pre-determined outcome
  targetPnL: number;         // Target P&L percent
  stopLossPnL: number;       // Stop loss P&L percent
  scheduledCloseAt?: number; // Timestamp when position should close (for staggered closing)
  pnlRange?: {               // Dynamic P&L range from calculator
    mode: 'tight' | 'wide';
    baseExpected: number;
  };

  // NEW FIELDS (ADAPTIVE_CONVERGENCE_SYSTEM):
  binancePrice?: number;              // Last known Binance price (cached, for reference)
  priceSource?: 'simulated' | 'binance' | 'coingecko';  // Indicates which source currentPrice came from
  favorabilityScore?: number;         // 0-1 range (from Technical Analysis)
  convergenceLayer?: number;          // 0-6 (dominant layer for UI display)
  _version?: 'v1' | 'v2';            // Data version (v1: old, v2: ADAPTIVE_CONVERGENCE_SYSTEM)
}

export interface Trade {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  amount: number;
  positionSize: number;
  pnl: number;
  pnlPercent: number;
  duration: string;
  closedAt: string;
  expectedOutcome: 'WIN' | 'LOSS';
  actualOutcome: 'WIN' | 'LOSS';
  hadSlippage: boolean;
  slippageAmount?: number;

  // NEW FIELDS (ADAPTIVE_CONVERGENCE_SYSTEM):
  priceSource?: 'simulated' | 'binance' | 'coingecko';  // Price source used
  favorabilityScore?: number;                            // Entry favorability (0-1, binary for SimpleTrendDetector)
  technicalIndicators?: {                                // SimpleTrendDetector snapshot (Day 3)
    trend: 'up' | 'down' | 'flat';                       // Only trend (ma20, ma50, rsi, atr removed - not needed)
    // NOTE: Full TA engine (MA/RSI/ATR) was replaced with SimpleTrendDetector
    // These fields are optional and undefined when not calculated
  };
}

export interface BotConfig {
  // Basic Info
  name: string;
  tradingPair: string;                  // Primary trading pair (deprecated, use tradingPairs)
  tradingPairs?: string[];              // Multiple trading pairs (e.g., ['BTC/USDT', 'ETH/USDT']). Overrides tradingPair if set
  investedCapital: number;
  createdAt?: number;                   // Unix timestamp when bot was created. Optional for backwards compatibility

  // Trading Parameters
  leverage?: number;                    // Fixed leverage (1-125). Deprecated, use leverages
  leverages?: number[];                 // Multiple leverages (e.g., [3, 5, 10]). Bot randomly picks one for each trade
  allowedSides?: 'LONG' | 'SHORT' | 'BOTH'; // Which sides to trade. Default: 'BOTH'

  // Performance Targets
  winRate: number;                      // Target win rate (0-1)
  dailyTargetPercent: number;           // Daily profit target %
  tradesPerDay: number;                 // Target trades per day

  // Position Sizing
  minPositionSize: number;              // Min position size in $
  maxPositionSize: number;              // Max position size in $

  // P&L Ranges (% per trade) - DEPRECATED: Now calculated dynamically
  winPnLMin?: number;                   // Min win % (DEPRECATED - ignored by bot)
  winPnLMax?: number;                   // Max win % (DEPRECATED - ignored by bot)
  lossPnLMin?: number;                  // Min loss % (DEPRECATED - ignored by bot)
  lossPnLMax?: number;                  // Max loss % (DEPRECATED - ignored by bot)

  // Duration Control
  minDuration: number;                  // Min position hold time (ms)
  maxDuration: number;                  // Max position hold time (ms)

  // Position Management
  maxConcurrentPositions: number;       // Max open positions (1-10)
  openFrequency: number;                // Chance to open position (0-1). Default: 0.7
  cooldownMs?: number;                  // Cooldown between position opens (ms). Default: 5000 (5 sec)

  // Risk Management
  maxSlippage?: number;                 // Max allowed slippage %. Default: 0.5
  maxTradesHistory?: number;            // Max trades to keep. Default: 100

  // Advanced Risk Management
  staggeredClosing?: {                  // Prevent simultaneous position closures
    enabled: boolean;                   // Enable/disable staggered closing
    maxClosuresInWindow: number;        // Max closures allowed in window (1-5)
    windowDurationSec: number;          // Window duration in seconds (15-60)
    minDelayBetweenSec: number;         // Min delay between closures (1-30)
    maxDelayBetweenSec: number;         // Max delay between closures (5-60)
  };
  pnlVariance?: {                       // P&L variance distribution control
    tightModePercent: number;           // % of positions in tight mode (0-100)
  };

  // Preset System (ADAPTIVE_CONVERGENCE_SYSTEM)
  character?: 'conservative' | 'moderate' | 'aggressive';  // Bot personality profile
  realismMode?: 'smooth' | 'realistic' | 'volatile';      // Visual realism level
  convergenceMode?: 'natural' | 'assisted' | 'guaranteed'; // Target guarantee level
  volatility?: 'low' | 'medium' | 'high';                  // Market volatility override
}

export interface BotStats {
  id: string;
  name: string;
  totalPnL: number;
  winRate: number;
  tradesCount: number;
  winsCount: number;
  lossesCount: number;
  avgWin: number;
  avgLoss: number;
  positions: Position[];
  trades: Trade[];
}

export interface BotPersonality {
  aggression: number;      // 0-1: affects position size
  patience: number;        // 0-1: affects hold time
  riskTolerance: number;   // 0-1: affects SL distance
}
