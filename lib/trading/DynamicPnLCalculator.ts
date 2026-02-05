/**
 * Dynamic P&L Calculator
 *
 * Calculates mathematically correct P&L ranges that converge to daily target
 * while maintaining visual realism through controlled variance injection.
 *
 * Key formula with leverage:
 * Base P&L% = (dailyTarget / tradesPerDay / winRate) / avgLeverage
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
   * Calculate optimal P&L range for next trade
   *
   * Formula breakdown:
   * 1. avgLeverage = (leverageMin + leverageMax) / 2
   * 2. baseWinPnL = (dailyTarget / tradesPerDay / winRate) / avgLeverage
   * 3. baseLossPnL = baseWinPnL * (winRate / (1 - winRate)) × 0.7 (asymmetric R:R)
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

    // Step 1: Calculate average leverage
    const avgLeverage = (leverageMin + leverageMax) / 2;

    // Step 2: Calculate base P&L dynamically
    // NOTE: Deprecated winPnLMin/Max are IGNORED because they were manually tuned
    // and don't account for tradesPerDay changes. Always calculate dynamically.

    // Formula: baseWinPnL = (dailyTarget / #trades / winRate)
    // This ensures Expected Daily converges to Daily Target
    const baseWinPnLPercent = (dailyTargetPercent / tradesPerDay / winRate);

    // Calculate base loss P&L (using risk-reward ratio)
    // winRate × avgWin = (1 - winRate) × avgLoss
    // avgLoss = avgWin × (winRate / (1 - winRate)) × asymmetryFactor
    // asymmetryFactor = 0.7 means wins are slightly bigger than losses on average
    const asymmetryFactor = 0.7;
    const baseLossPnLPercent = baseWinPnLPercent * (winRate / (1 - winRate)) * asymmetryFactor;

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
    winMin = Math.max(0.1, winMin);
    winMax = Math.max(winMin * 1.2, winMax);
    lossMin = Math.max(0.05, lossMin);
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
