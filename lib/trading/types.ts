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
}

export interface BotConfig {
  // Basic Info
  name: string;
  tradingPair: string;
  investedCapital: number;
  createdAt?: number;                   // Unix timestamp when bot was created. Optional for backwards compatibility

  // Trading Parameters
  leverage?: number;                    // Fixed leverage (1-125). Optional - defaults to random [3,5,10] if not set
  allowedSides?: 'LONG' | 'SHORT' | 'BOTH'; // Which sides to trade. Default: 'BOTH'

  // Performance Targets
  winRate: number;                      // Target win rate (0-1)
  dailyTargetPercent: number;           // Daily profit target %
  tradesPerDay: number;                 // Target trades per day

  // Position Sizing
  minPositionSize: number;              // Min position size in $
  maxPositionSize: number;              // Max position size in $

  // P&L Ranges (% per trade)
  winPnLMin: number;                    // Min win %
  winPnLMax: number;                    // Max win %
  lossPnLMin: number;                   // Min loss %
  lossPnLMax: number;                   // Max loss %

  // Duration Control
  minDuration: number;                  // Min position hold time (ms)
  maxDuration: number;                  // Max position hold time (ms)

  // Position Management
  maxConcurrentPositions: number;       // Max open positions (1-10)
  openFrequency: number;                // Chance to open position (0-1). Default: 0.7

  // Risk Management
  maxSlippage?: number;                 // Max allowed slippage %. Default: 0.5
  maxTradesHistory?: number;            // Max trades to keep. Default: 100
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
