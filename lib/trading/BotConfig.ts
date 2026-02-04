/**
 * Bot Configuration & Calculations
 *
 * Центральный файл для всех настроек, расчетов и контроллеров бота
 * Объединяет:
 * - P&L расчеты
 * - Daily Target контроллер
 * - Trading configuration
 */

// ============================================================================
// 1. P&L RANGE CALCULATOR
// ============================================================================

export interface PnLRanges {
  winPnLMin: number;
  winPnLMax: number;
  lossPnLMin: number;
  lossPnLMax: number;
  expectedPerTrade: number;
  avgWin: number;
  avgLoss: number;
}

export interface BotConfig {
  winRate: number;           // 0-1 (e.g., 0.85 = 85%)
  dailyTargetPercent: number; // e.g., 3.5 = 3.5% daily
  investedCapital: number;    // e.g., 5000 = $5000
  tradesPerDay: number;       // e.g., 50 trades/day
  minPositionSize: number;    // e.g., 300 = $300
  maxPositionSize: number;    // e.g., 700 = $700
}

/**
 * Calculate optimal P&L ranges for winning and losing trades
 *
 * Formula:
 * - Daily Target = avgWin × winRate × trades + avgLoss × (1-winRate) × trades
 * - Solving for avgWin: avgWin = (targetPerTrade + (1-WR) × avgLoss) / WR
 *
 * @param winRate - Win rate (0-1)
 * @param dailyTargetPercent - Daily target percentage
 * @param tradesPerDay - Expected trades per day (default: 50)
 * @returns PnLRanges with min/max values for wins and losses
 */
export function calculateOptimalPnLRanges(
  winRate: number,
  dailyTargetPercent: number,
  tradesPerDay: number = 50
): PnLRanges {
  const targetPerTrade = dailyTargetPercent / tradesPerDay;

  // 🎯 EDGE CASE 1: 0% Win Rate (all losses)
  if (winRate === 0) {
    const avgLoss = Math.abs(targetPerTrade);
    return {
      winPnLMin: 0.10,
      winPnLMax: 0.30,
      lossPnLMin: Math.max(0.10, avgLoss * 0.7),
      lossPnLMax: avgLoss * 1.3,
      expectedPerTrade: targetPerTrade,
      avgWin: 0,
      avgLoss: avgLoss,
    };
  }

  // 🎯 EDGE CASE 2: 100% Win Rate (all wins)
  if (winRate === 1) {
    const avgWin = targetPerTrade;
    const calculatedMin = Math.max(0.05, avgWin * 0.7);
    const calculatedMax = Math.max(avgWin * 1.3, calculatedMin + 0.01);

    return {
      winPnLMin: calculatedMin,
      winPnLMax: calculatedMax,
      lossPnLMin: 0.10,
      lossPnLMax: 0.20,
      expectedPerTrade: targetPerTrade,
      avgWin: avgWin,
      avgLoss: 0,
    };
  }

  // 🎯 NORMAL CASE: Scale avgLoss based on daily target
  // Higher daily target = need higher wins AND losses to balance
  const baseAvgLoss = Math.max(0.10, Math.abs(dailyTargetPercent) * 0.05);
  const avgLoss = Math.min(baseAvgLoss, 0.30); // Cap at 0.30%
  const avgWin = (targetPerTrade + (1 - winRate) * avgLoss) / winRate;

  return {
    winPnLMin: Math.max(0.10, avgWin * 0.7),
    winPnLMax: Math.max(avgWin * 1.3, 0.10),
    lossPnLMin: Math.max(0.05, avgLoss * 0.7),
    lossPnLMax: Math.max(avgLoss * 1.3, 0.10),
    expectedPerTrade: targetPerTrade,
    avgWin: Math.max(avgWin, 0),
    avgLoss,
  };
}

// ============================================================================
// 2. CONFIGURATION VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validate if bot configuration is realistic
 *
 * @param config - Bot configuration to validate
 * @returns Validation result with reason if invalid
 */
export function validateBotConfig(config: BotConfig): ValidationResult {
  const ranges = calculateOptimalPnLRanges(
    config.winRate,
    config.dailyTargetPercent,
    config.tradesPerDay
  );

  // Check for impossible configurations
  if (ranges.avgWin < 0) {
    return {
      isValid: false,
      reason: 'Negative average win - impossible to achieve target with this Win Rate',
    };
  }

  if (ranges.avgWin > 10) {
    return {
      isValid: false,
      reason: 'Average win too high (>10%) - unrealistic for high-frequency trading',
    };
  }

  if (ranges.avgLoss > 5) {
    return {
      isValid: false,
      reason: 'Average loss too high (>5%) - risk management violation',
    };
  }

  // Check Win Rate boundaries
  if (config.winRate < 0 || config.winRate > 1) {
    return {
      isValid: false,
      reason: 'Win Rate must be between 0% and 100%',
    };
  }

  // Check position sizes
  if (config.minPositionSize <= 0 || config.maxPositionSize <= 0) {
    return {
      isValid: false,
      reason: 'Position sizes must be positive',
    };
  }

  if (config.minPositionSize > config.maxPositionSize) {
    return {
      isValid: false,
      reason: 'Minimum position size cannot exceed maximum',
    };
  }

  return { isValid: true };
}

// ============================================================================
// 3. FORMATTING & LOGGING HELPERS
// ============================================================================

/**
 * Format P&L ranges for logging
 *
 * @param ranges - P&L ranges to format
 * @returns Formatted string for console output
 */
export function formatPnLRanges(ranges: PnLRanges): string {
  return (
    `Win ${ranges.winPnLMin.toFixed(2)}-${ranges.winPnLMax.toFixed(2)}%, ` +
    `Loss ${ranges.lossPnLMin.toFixed(2)}-${ranges.lossPnLMax.toFixed(2)}% ` +
    `(Avg Win: ${ranges.avgWin.toFixed(2)}%, Avg Loss: ${ranges.avgLoss.toFixed(2)}%)`
  );
}

/**
 * Format bot config for logging
 *
 * @param config - Bot configuration
 * @returns Formatted string
 */
export function formatBotConfig(config: BotConfig): string {
  return (
    `WR: ${(config.winRate * 100).toFixed(0)}%, ` +
    `Daily: ${config.dailyTargetPercent.toFixed(1)}%, ` +
    `Capital: $${config.investedCapital.toLocaleString()}, ` +
    `Trades/Day: ${config.tradesPerDay}, ` +
    `Position: $${config.minPositionSize}-${config.maxPositionSize}`
  );
}

// ============================================================================
// 4. PRESET CONFIGURATIONS
// ============================================================================

export const BOT_PRESETS: Record<string, BotConfig> = {
  conservative: {
    winRate: 0.75,
    dailyTargetPercent: 1.0,
    investedCapital: 5000,
    tradesPerDay: 30,
    minPositionSize: 300,
    maxPositionSize: 500,
  },
  balanced: {
    winRate: 0.65,
    dailyTargetPercent: 2.0,
    investedCapital: 5000,
    tradesPerDay: 50,
    minPositionSize: 300,
    maxPositionSize: 700,
  },
  aggressive: {
    winRate: 0.55,
    dailyTargetPercent: 5.0,
    investedCapital: 5000,
    tradesPerDay: 80,
    minPositionSize: 400,
    maxPositionSize: 1000,
  },
  test_high_wr: {
    winRate: 0.85,
    dailyTargetPercent: 3.5,
    investedCapital: 5000,
    tradesPerDay: 50,
    minPositionSize: 300,
    maxPositionSize: 700,
  },
};

// ============================================================================
// 5. TRADING CONFIG INTERFACE
// ============================================================================

export interface TradingConfig {
  // Core Config
  WIN_RATE: number;
  TARGET_DAILY_PNL_PERCENT: number;

  // P&L Ranges (calculated from WIN_RATE + TARGET_DAILY_PNL_PERCENT)
  WIN_PNL_MIN: number;
  WIN_PNL_MAX: number;
  LOSS_PNL_MIN: number;
  LOSS_PNL_MAX: number;

  // Position Sizing
  MIN_POSITION_SIZE: number;
  MAX_POSITION_SIZE: number;

  // Frequency
  TARGET_TRADES_PER_DAY: number;

  // Risk Management
  MAX_SLIPPAGE_PERCENT: number;
}

/**
 * Create trading config from bot config
 *
 * @param config - Bot configuration
 * @returns Trading configuration with calculated ranges
 */
export function createTradingConfig(config: BotConfig): TradingConfig {
  const ranges = calculateOptimalPnLRanges(
    config.winRate,
    config.dailyTargetPercent,
    config.tradesPerDay
  );

  return {
    WIN_RATE: config.winRate,
    TARGET_DAILY_PNL_PERCENT: config.dailyTargetPercent,
    WIN_PNL_MIN: ranges.winPnLMin,
    WIN_PNL_MAX: ranges.winPnLMax,
    LOSS_PNL_MIN: ranges.lossPnLMin,
    LOSS_PNL_MAX: ranges.lossPnLMax,
    MIN_POSITION_SIZE: config.minPositionSize,
    MAX_POSITION_SIZE: config.maxPositionSize,
    TARGET_TRADES_PER_DAY: config.tradesPerDay,
    MAX_SLIPPAGE_PERCENT: 0.1,
  };
}
