/**
 * Slow Growth Trading Strategy
 *
 * Profile: Conservative growth with high frequency
 * - Win Rate: 55% (just above random)
 * - Small profits/losses per trade
 * - High frequency: 40-60 trades per day
 * - Result: Slow but steady balance growth
 *
 * Example: $5000 → ~$5,100 per day (~2% daily)
 */

export interface SlowGrowthConfig {
  // Win rate control
  WIN_RATE: number;

  // P&L ranges per trade
  WIN_PNL_MIN: number;
  WIN_PNL_MAX: number;
  LOSS_PNL_MIN: number;
  LOSS_PNL_MAX: number;

  // Position settings
  MIN_POSITION_SIZE: number;
  MAX_POSITION_SIZE: number;

  // Frequency control
  TARGET_TRADES_PER_DAY: number;
  MIN_POSITION_DURATION: number; // ms
  MAX_POSITION_DURATION: number; // ms

  // Daily target
  TARGET_DAILY_PNL_PERCENT: number;
}

export const SLOW_GROWTH_PROFILE: SlowGrowthConfig = {
  // 55% win rate (slightly above random)
  WIN_RATE: 0.55,

  // Small wins: +0.10% to +0.25%
  WIN_PNL_MIN: 0.10,
  WIN_PNL_MAX: 0.25,

  // Small losses: -0.08% to -0.15%
  LOSS_PNL_MIN: 0.08,
  LOSS_PNL_MAX: 0.15,

  // Conservative position sizing
  MIN_POSITION_SIZE: 300,
  MAX_POSITION_SIZE: 700,

  // High frequency: 50 trades per day
  TARGET_TRADES_PER_DAY: 50,
  MIN_POSITION_DURATION: 30000,  // 30 seconds
  MAX_POSITION_DURATION: 90000,  // 90 seconds

  // Target: ~2% per day
  TARGET_DAILY_PNL_PERCENT: 2.0,
};

export class SlowGrowthStrategy {
  constructor(private config: SlowGrowthConfig = SLOW_GROWTH_PROFILE) {}

  /**
   * Determine if next trade should win
   * Uses configured win rate
   */
  shouldNextTradeWin(): boolean {
    return Math.random() < this.config.WIN_RATE;
  }

  /**
   * Generate target P&L for a trade
   */
  generateTargetPnL(shouldWin: boolean): { targetPnL: number; stopLossPnL: number } {
    if (shouldWin) {
      // Winning trade: achievable TP
      const targetPnL = this.randomInRange(
        this.config.WIN_PNL_MIN,
        this.config.WIN_PNL_MAX
      );

      // Farther SL (won't hit it)
      const stopLossPnL = -(this.config.LOSS_PNL_MAX + 0.05);

      return { targetPnL, stopLossPnL };
    } else {
      // Losing trade: will hit SL
      const stopLossPnL = -this.randomInRange(
        this.config.LOSS_PNL_MIN,
        this.config.LOSS_PNL_MAX
      );

      // Farther TP (won't reach it)
      const targetPnL = this.config.WIN_PNL_MAX + 0.15;

      return { targetPnL, stopLossPnL };
    }
  }

  /**
   * Generate position size
   */
  generatePositionSize(): number {
    return this.randomInRange(
      this.config.MIN_POSITION_SIZE,
      this.config.MAX_POSITION_SIZE
    );
  }

  /**
   * Get expected position duration
   */
  getExpectedDuration(): number {
    return this.randomInRange(
      this.config.MIN_POSITION_DURATION,
      this.config.MAX_POSITION_DURATION
    );
  }

  /**
   * Calculate delay before opening next position
   * Ensures we hit target trades per day
   */
  calculateOpenDelay(): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const avgDelayBetweenTrades = msPerDay / this.config.TARGET_TRADES_PER_DAY;

    // Add ±30% randomness
    const variance = avgDelayBetweenTrades * 0.3;
    return avgDelayBetweenTrades + (Math.random() - 0.5) * variance;
  }

  /**
   * Calculate expected daily return
   */
  calculateExpectedDailyReturn(capital: number): number {
    const avgWin = (this.config.WIN_PNL_MIN + this.config.WIN_PNL_MAX) / 2;
    const avgLoss = (this.config.LOSS_PNL_MIN + this.config.LOSS_PNL_MAX) / 2;

    // Expected value per trade
    const expectedPerTrade =
      this.config.WIN_RATE * avgWin - (1 - this.config.WIN_RATE) * avgLoss;

    // Daily return
    const dailyReturn = expectedPerTrade * this.config.TARGET_TRADES_PER_DAY;

    return (capital * dailyReturn) / 100;
  }

  /**
   * Get strategy statistics
   */
  getStats(): {
    winRate: number;
    avgWin: number;
    avgLoss: number;
    expectedPerTrade: number;
    expectedDaily: number;
    tradesPerDay: number;
  } {
    const avgWin = (this.config.WIN_PNL_MIN + this.config.WIN_PNL_MAX) / 2;
    const avgLoss = (this.config.LOSS_PNL_MIN + this.config.LOSS_PNL_MAX) / 2;
    const expectedPerTrade =
      this.config.WIN_RATE * avgWin - (1 - this.config.WIN_RATE) * avgLoss;
    const expectedDaily = expectedPerTrade * this.config.TARGET_TRADES_PER_DAY;

    return {
      winRate: this.config.WIN_RATE * 100,
      avgWin,
      avgLoss,
      expectedPerTrade,
      expectedDaily,
      tradesPerDay: this.config.TARGET_TRADES_PER_DAY,
    };
  }

  /**
   * Print strategy summary
   */
  printSummary(capital: number = 5000): void {
    const stats = this.getStats();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Slow Growth Strategy Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Win Rate:           ${stats.winRate.toFixed(1)}%`);
    console.log(`Avg Win:            +${stats.avgWin.toFixed(2)}%`);
    console.log(`Avg Loss:           -${stats.avgLoss.toFixed(2)}%`);
    console.log(`Expected/Trade:     ${stats.expectedPerTrade >= 0 ? '+' : ''}${stats.expectedPerTrade.toFixed(3)}%`);
    console.log(`Trades/Day:         ${stats.tradesPerDay}`);
    console.log(`Expected Daily:     +${stats.expectedDaily.toFixed(2)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Starting Capital:   $${capital.toLocaleString()}`);
    console.log(`Expected Day 1:     $${(capital * (1 + stats.expectedDaily / 100)).toLocaleString()}`);
    console.log(`Expected Day 7:     $${(capital * Math.pow(1 + stats.expectedDaily / 100, 7)).toLocaleString()}`);
    console.log(`Expected Day 30:    $${(capital * Math.pow(1 + stats.expectedDaily / 100, 30)).toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SlowGrowthConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🎛️ Strategy config updated:', newConfig);
  }

  /**
   * Get current configuration
   */
  getConfig(): SlowGrowthConfig {
    return { ...this.config };
  }

  // Helper: random number in range
  private randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

// Export singleton instance
export const slowGrowthStrategy = new SlowGrowthStrategy();

// Export preset profiles
export const STRATEGY_PRESETS = {
  // Ultra slow: 52% WR, 0.8% daily
  ultra_slow: {
    ...SLOW_GROWTH_PROFILE,
    WIN_RATE: 0.52,
    WIN_PNL_MIN: 0.08,
    WIN_PNL_MAX: 0.15,
    LOSS_PNL_MIN: 0.06,
    LOSS_PNL_MAX: 0.12,
    TARGET_TRADES_PER_DAY: 40,
    TARGET_DAILY_PNL_PERCENT: 0.8,
  },

  // Slow: 55% WR, 2% daily (default)
  slow: SLOW_GROWTH_PROFILE,

  // Medium: 60% WR, 3% daily
  medium: {
    ...SLOW_GROWTH_PROFILE,
    WIN_RATE: 0.60,
    WIN_PNL_MIN: 0.15,
    WIN_PNL_MAX: 0.35,
    LOSS_PNL_MIN: 0.10,
    LOSS_PNL_MAX: 0.20,
    TARGET_TRADES_PER_DAY: 60,
    TARGET_DAILY_PNL_PERCENT: 3.0,
  },

  // Fast: 68% WR, 5% daily
  fast: {
    ...SLOW_GROWTH_PROFILE,
    WIN_RATE: 0.68,
    WIN_PNL_MIN: 0.25,
    WIN_PNL_MAX: 0.50,
    LOSS_PNL_MIN: 0.15,
    LOSS_PNL_MAX: 0.30,
    MIN_POSITION_SIZE: 500,
    MAX_POSITION_SIZE: 1200,
    TARGET_TRADES_PER_DAY: 80,
    TARGET_DAILY_PNL_PERCENT: 5.0,
  },
};
