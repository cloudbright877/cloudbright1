/**
 * Dynamic P&L Calculator
 *
 * Calculates mathematically correct P&L ranges that converge to daily target
 * while maintaining visual realism through controlled variance injection.
 *
 * SIMPLIFIED FORMULA (v2.1.1):
 * perTradeTarget = dailyTarget / trades
 * denominator = winRate - (lossRate² / winRate) × asymmetry
 * baseWin = perTradeTarget / denominator
 * baseLoss = baseWin × (lossRate / winRate) × asymmetry
 *
 * This ensures:
 * - Convergence to daily target ✓
 * - Win Rate directly affects Expected Daily ✓
 * - Friction applied during execution (% of position) ✓
 * - Losses SMALLER than wins (asymmetry = 0.7) ✓
 * - Simple, predictable, manageable ✓
 *
 * Variance modes:
 * - Tight (80%): ±30% variance from base → smooth convergence
 * - Wide (20%): 2x-4x variance from base → visual "spikes" for realism
 */

export interface PnLRange {
  winMin: number;    // Min win % (per trade)
  winMax: number;    // Max win % (per trade)
  lossMin: number;   // Min loss % (per trade)
  lossMax: number;   // Max loss % (per trade)
  mode: 'tight' | 'wide';
  baseExpected: number; // Mathematical expectation
}

export interface CalibrationParams {
  dailyTargetPercent: number;  // e.g. 4.5%
  tradesPerDay: number;         // e.g. 8
  winRate: number;              // e.g. 0.54
  leverageMin: number;          // e.g. 10
  leverageMax: number;          // e.g. 15
  currentDailyPnL?: number;     // Current P&L% today (for correction)
  tradesRemainingToday?: number; // Trades left today (for correction)
  tightModePercent?: number;    // % of positions in tight mode (0-100), default: 80

  // Market friction configuration
  marketFriction?: {
    enabled: boolean;
    forceVolatility?: 'low' | 'medium' | 'high' | 'auto';
  };

  // NOTE: winPnLMin/Max, lossPnLMin/Max are DEPRECATED and IGNORED
  // They were manually tuned and don't scale with tradesPerDay
  // Kept here only for interface compatibility with old code
  winPnLMin?: number;
  winPnLMax?: number;
  lossPnLMin?: number;
  lossPnLMax?: number;
}

export class DynamicPnLCalculator {
  /**
   * Calculate average market friction per trade AS % OF POSITION SIZE
   * This needs to be converted to % of capital for formula
   *
   * Returns friction % of POSITION that will cost per trade
   */
  private calculateAvgFrictionPercent(params: CalibrationParams): number {
    if (!params.marketFriction?.enabled) {
      return 0; // Friction disabled
    }

    const volatility = params.marketFriction.forceVolatility ?? 'medium';

    // Realistic friction values based on volatility
    // Components: slippage (0.05-0.3%) + spread (0.01-0.1%) + funding (0-0.03%) + commission (0.04%)
    // These are % of POSITION SIZE, not capital
    switch (volatility) {
      case 'low':
        return 0.15; // Total: ~0.15% of position size
      case 'high':
        return 0.5; // Total: ~0.5% of position size
      case 'medium':
      case 'auto':
      default:
        return 0.3; // Total: ~0.3% of position size
    }
  }

  /**
   * Calculate optimal P&L range for next trade
   *
   * Formula breakdown (v2.0 - Simplified):
   * 1. friction = calculateAvgFriction()
   * 2. baseWinGross = (dailyTarget / (winRate × trades) + friction) / (1 - asymmetry)
   * 3. baseLoss = baseWinGross × (winRate / (1-winRate)) × asymmetry
   * 4. Apply variance based on mode (80% tight, 20% wide)
   * 5. Apply correction if currentDailyPnL exceeds target
   */
  calculatePnLRange(params: CalibrationParams): PnLRange {
    const {
      dailyTargetPercent,
      tradesPerDay,
      winRate,
      leverageMin,
      leverageMax,
      currentDailyPnL = 0,
      tradesRemainingToday = tradesPerDay,
      tightModePercent = 80,
      winPnLMin,
      winPnLMax,
      lossPnLMin,
      lossPnLMax,
    } = params;

    // Step 1: Calculate average friction per trade (if enabled)
    // Friction is % of POSITION SIZE, not capital
    // NOTE: This is NOT used in formula anymore - TradingBot compensates for friction
    // by multiplying pnlRange by capitalToPositionRatio which accounts for it
    const frictionPercentOfPosition = this.calculateAvgFrictionPercent(params);

    // Step 2: Calculate base P&L with SIMPLIFIED FORMULA (v2.1.1)
    // NOTE: Deprecated winPnLMin/Max are IGNORED because they were manually tuned
    // and don't account for tradesPerDay changes. Always calculate dynamically.

    // SIMPLE APPROACH: Start with per-trade target, then apply risk-reward ratio
    // This ensures convergence to daily target
    const perTradeTarget = dailyTargetPercent / tradesPerDay;

    // Apply risk-reward asymmetry: wins are bigger than losses
    // With WR=75% and asymmetry=0.7, we need:
    // Expected = WR × Win - LR × Loss = perTradeTarget
    // Loss = Win × (LR/WR) × asymmetry
    // Solving: perTradeTarget = WR × Win - LR × Win × (LR/WR) × asymmetry
    //          perTradeTarget = Win × (WR - LR × LR / WR × asymmetry)
    //          Win = perTradeTarget / (WR - LR² / WR × asymmetry)
    const asymmetryFactor = 0.7;
    const lossRate = 1 - winRate;

    const denominator = winRate - (lossRate * lossRate / winRate) * asymmetryFactor;
    const baseWinPnLGross = perTradeTarget / denominator;

    // Calculate base loss P&L
    const baseLossPnLPercent = baseWinPnLGross * (lossRate / winRate) * asymmetryFactor;

    const baseWinPnLPercent = baseWinPnLGross;

    // Step 4: Determine variance mode (using configured tight mode percentage)
    const isTightMode = Math.random() < (tightModePercent / 100);
    const mode: 'tight' | 'wide' = isTightMode ? 'tight' : 'wide';

    // Step 5: Apply variance
    let winMin: number, winMax: number, lossMin: number, lossMax: number;

    if (mode === 'tight') {
      // Tight mode: ±30% variance from base
      const winVariance = 0.3;
      winMin = baseWinPnLPercent * (1 - winVariance);
      winMax = baseWinPnLPercent * (1 + winVariance);

      const lossVariance = 0.3;
      lossMin = baseLossPnLPercent * (1 - lossVariance);
      lossMax = baseLossPnLPercent * (1 + lossVariance);
    } else {
      // Wide mode: 2x-4x variance for visual "spikes"
      const wideMultiplierMin = 2.0;
      const wideMultiplierMax = 4.0;
      const randomMultiplier = wideMultiplierMin + Math.random() * (wideMultiplierMax - wideMultiplierMin);

      winMin = baseWinPnLPercent * 0.8; // Slightly lower minimum
      winMax = baseWinPnLPercent * randomMultiplier;

      lossMin = baseLossPnLPercent * 0.6; // Can be smaller loss
      lossMax = baseLossPnLPercent * (1 + (randomMultiplier - 1) * 0.5); // Less extreme on loss side
    }

    // Step 6: Apply correction if daily P&L exceeds target (user's idea!)
    // Correction strength: 40-60% (chosen by user)
    const targetExcess = currentDailyPnL - dailyTargetPercent;
    if (targetExcess > dailyTargetPercent * 0.2 && tradesRemainingToday > 0) {
      // We're significantly ahead of target
      const correctionPerTrade = targetExcess / tradesRemainingToday;
      const correctionStrength = 0.5; // 50% correction (middle of 40-60%)

      // Reduce win ranges and increase loss ranges to "give back" some profit
      const winCorrection = correctionPerTrade * correctionStrength;
      winMin = Math.max(0.1, winMin - winCorrection);
      winMax = Math.max(0.2, winMax - winCorrection * 1.2);

      const lossCorrection = correctionPerTrade * correctionStrength * 0.5;
      lossMin = lossMin + lossCorrection * 0.5;
      lossMax = lossMax + lossCorrection;

      // P&L correction applied - logging removed for cleaner console
    }

    // Step 7: Ensure non-negative values and reasonable bounds
    // Minimum based on formula output, not hardcoded
    winMin = Math.max(baseWinPnLPercent * 0.1, winMin); // At least 10% of base
    winMax = Math.max(winMin * 1.2, winMax);
    lossMin = Math.max(baseLossPnLPercent * 0.1, lossMin); // At least 10% of base
    lossMax = Math.max(lossMin * 1.2, lossMax);

    return {
      winMin,
      winMax,
      lossMin,
      lossMax,
      mode,
      baseExpected: baseWinPnLPercent,
    };
  }

  /**
   * Calculate expected daily P&L given current configuration
   * Useful for debugging/validation
   */
  calculateExpectedDaily(params: CalibrationParams): {
    expectedDailyPnL: number;
    deviationFromTarget: number;
    convergenceScore: number; // 0-1, how close to target
  } {
    const { dailyTargetPercent, tradesPerDay, winRate } = params;

    // Simulate average P&L per trade
    const range = this.calculatePnLRange(params);
    const avgWin = (range.winMin + range.winMax) / 2;
    const avgLoss = (range.lossMin + range.lossMax) / 2;

    // Expected value per trade
    const expectedPerTrade = (winRate * avgWin) - ((1 - winRate) * avgLoss);

    // Expected daily P&L
    const expectedDailyPnL = expectedPerTrade * tradesPerDay;

    const deviationFromTarget = expectedDailyPnL - dailyTargetPercent;
    const convergenceScore = Math.max(0, 1 - Math.abs(deviationFromTarget) / dailyTargetPercent);

    return {
      expectedDailyPnL,
      deviationFromTarget,
      convergenceScore,
    };
  }

  /**
   * Validate that bot configuration will converge to daily target
   * Returns error message if misconfigured
   */
  validateConfiguration(params: CalibrationParams): string | null {
    const { expectedDailyPnL, deviationFromTarget, convergenceScore } =
      this.calculateExpectedDaily(params);

    // Allow ±10% deviation (user chose "hybrid approach")
    const maxAllowedDeviation = params.dailyTargetPercent * 0.1;

    if (Math.abs(deviationFromTarget) > maxAllowedDeviation) {
      return (
        `❌ Configuration invalid: Expected daily P&L ${expectedDailyPnL.toFixed(2)}% ` +
        `deviates ${deviationFromTarget.toFixed(2)}% from target ${params.dailyTargetPercent}%\n` +
        `Convergence score: ${(convergenceScore * 100).toFixed(1)}%`
      );
    }

    if (convergenceScore < 0.8) {
      return (
        `⚠️ Warning: Low convergence score ${(convergenceScore * 100).toFixed(1)}%\n` +
        `Expected daily: ${expectedDailyPnL.toFixed(2)}%, Target: ${params.dailyTargetPercent}%`
      );
    }

    return null; // Valid configuration
  }
}

// Singleton instance
export const dynamicPnLCalculator = new DynamicPnLCalculator();
