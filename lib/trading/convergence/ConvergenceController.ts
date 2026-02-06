/**
 * ConvergenceController - 6-Layer Adaptive Convergence System
 *
 * Goal: Minimize correction at close so trade history looks natural.
 * All layers reduce the gap between real P&L and target P&L.
 *
 * Layers:
 * 1. Position Sizing - adjust size based on progress
 * 2. Entry Timing - require trend match (uses SimpleTrendDetector)
 * 3. TP/SL Adjustment - adjust targets based on progress
 * 4. Early Exit - close winning positions early when ahead
 * 5. Frequency Control - adjust opening frequency
 * 6. Micro-steering - tiny P&L adjustments in final 10 trades
 */

export interface ConvergenceMetrics {
  dailyProgress: number;        // 0-200% (current P&L / target P&L * 100)
  tradesCompleted: number;      // Trades closed today
  tradesRemaining: number;      // Estimated remaining trades
  currentDailyPnL: number;      // $ P&L today
  targetDailyPnL: number;       // $ target for today
  microSteeringActive: boolean; // Layer 6 active?
  emergencyMode: boolean;       // Emergency threshold active?
}

export class ConvergenceController {
  private targetDailyPnLPercent: number;
  private investedCapital: number;
  private tradesPerDay: number;

  // Convergence state (persisted)
  private microSteeringHistory: Array<{ pnl: number; timestamp: number }> = [];

  constructor(
    targetDailyPnLPercent: number,
    investedCapital: number,
    tradesPerDay: number
  ) {
    this.targetDailyPnLPercent = targetDailyPnLPercent;
    this.investedCapital = investedCapital;
    this.tradesPerDay = tradesPerDay;
  }

  // ============================================================================
  // Layer 1: Position Sizing
  // ============================================================================

  /**
   * Adjust position size based on daily progress
   *
   * Bigger positions = each small correction has bigger $ impact
   *
   * Progress brackets (with smoothing):
   * - < 30%: 3.0x (behind: bigger positions, each correction counts more)
   * - 30-60%: 1.8x (slightly behind)
   * - 60-110%: 1.0x (on track, normal)
   * - 110-130%: 0.5x (ahead, protect gains)
   * - > 130%: 0.2x (way ahead, coast)
   */
  adjustPositionSize(baseSize: number, metrics: ConvergenceMetrics): number {
    const progress = metrics.dailyProgress;

    // Layer 1: Only REDUCE size when ahead, never increase when behind
    // Formula is already calibrated for normal sizes
    let multiplier: number;
    if (progress < 100) {
      multiplier = 1.0; // Normal size always
    } else if (progress < 120) {
      multiplier = 0.5; // Half size when target reached
    } else {
      multiplier = 0.2; // Micro-trades when far ahead
    }

    // Apply threshold smoothing (linear interpolation in ±5% zones)
    const smoothed = this.smoothTransition(progress, multiplier, [
      { boundary: 100, prev: 1.0, next: 0.5 },
      { boundary: 120, prev: 0.5, next: 0.2 },
    ]);

    return baseSize * smoothed;
  }

  // ============================================================================
  // Layer 2: Entry Timing (Favorability Threshold)
  // ============================================================================

  /**
   * Get dynamic favorability threshold
   *
   * SimpleTrendDetector returns binary score (1.0 = match, skip if not)
   * This method returns threshold to compare against
   *
   * Thresholds:
   * - Behind (< 30%): 1.0 (require trend match)
   * - Normal (30-110%): 1.0 (require trend match)
   * - Ahead (> 130%): 1.0 (require trend match) + random throttle
   * - Emergency (< 50 trades remaining AND progress < 80%): 0 (accept any)
   */
  getFavorabilityThreshold(metrics: ConvergenceMetrics): number {
    // Emergency mode: time running out, accept any trend
    if (metrics.tradesRemaining <= 50 && metrics.dailyProgress < 80) {
      return 0; // Accept any entry (trend match not required)
    }

    // Normal: always require trend match
    return 1.0;
  }

  /**
   * Additional throttle for ahead scenario
   * Returns probability to skip entry even if trend matches
   */
  getThrottleProbability(metrics: ConvergenceMetrics): number {
    if (metrics.dailyProgress > 130) {
      return 0.7; // 70% chance to skip (effective rate 30%)
    }
    return 0; // No throttle
  }

  // ============================================================================
  // Layer 3: TP/SL Adjustment
  // ============================================================================

  /**
   * Adjust TP/SL based on progress
   *
   * CRITICAL: Does NOT boost TP when behind (< 30%)
   * Reason: Layer 1 already 3.0x size - stacking = 6x correction magnitude
   *
   * Progress brackets:
   * - < 30%: 1.0x TP, 1.0x SL (normal, Layer 1 handles boost)
   * - 30-60%: 1.0x TP, 1.0x SL (normal)
   * - 60-110%: 1.0x TP, 1.0x SL (normal)
   * - 110-130%: 0.6x TP, 1.2x SL (smaller wins, wider SL)
   * - > 130%: 0.4x TP, 1.5x SL (quick small wins)
   */
  adjustTPSL(
    baseTP: number,
    baseSL: number,
    metrics: ConvergenceMetrics
  ): { tp: number; sl: number } {
    const progress = metrics.dailyProgress;

    let tpMult: number, slMult: number;

    if (progress < 30) {
      tpMult = 1.0;
      slMult = 1.0;
    } else if (progress < 60) {
      tpMult = 1.0;
      slMult = 1.0;
    } else if (progress < 80) {
      tpMult = 1.0;
      slMult = 1.0;
    } else if (progress < 100) {
      tpMult = 0.7; // Start reducing TP when approaching target
      slMult = 1.1;
    } else if (progress < 120) {
      tpMult = 0.4; // Micro-trades when target reached
      slMult = 1.3;
    } else {
      tpMult = 0.2; // Very small trades when far ahead
      slMult = 1.5;
    }

    // Smooth transitions
    const smoothTP = this.smoothTransition(progress, tpMult, [
      { boundary: 80, prev: 1.0, next: 0.7 },
      { boundary: 100, prev: 0.7, next: 0.4 },
      { boundary: 120, prev: 0.4, next: 0.2 },
    ]);

    const smoothSL = this.smoothTransition(progress, slMult, [
      { boundary: 80, prev: 1.0, next: 1.1 },
      { boundary: 100, prev: 1.1, next: 1.3 },
      { boundary: 120, prev: 1.3, next: 1.5 },
    ]);

    return {
      tp: baseTP * smoothTP,
      sl: baseSL * smoothSL,
    };
  }

  // ============================================================================
  // Layer 4: Early Exit
  // ============================================================================

  /**
   * Check if position should be closed early
   *
   * Close winning positions early when ahead and real P&L already positive
   * → correction = 0 (natural close)
   *
   * Progress brackets:
   * - < 120%: never close early
   * - 120-140%: 30% chance if real P&L > 0
   * - > 140%: 50% chance if real P&L > 0
   */
  shouldExitEarly(
    shouldWin: boolean,
    realPnLPercent: number,
    metrics: ConvergenceMetrics
  ): boolean {
    const progress = metrics.dailyProgress;

    // Only close winning positions early
    if (!shouldWin) return false;

    // Only if real P&L is already positive
    if (realPnLPercent <= 0) return false;

    // Progress-based probability
    let chance: number;
    if (progress < 120) {
      chance = 0;
    } else if (progress < 140) {
      chance = 0.3;
    } else {
      chance = 0.5;
    }

    return Math.random() < chance;
  }

  // ============================================================================
  // Layer 5: Frequency Control
  // ============================================================================

  /**
   * Get opening frequency multiplier
   *
   * More trades → each correction is smaller (spread across more trades)
   *
   * Progress brackets:
   * - < 30%: 0.9 (more candidates for Layer 2 to filter)
   * - 30-80%: 0.7 (slightly above normal)
   * - 80-120%: 0.6 (normal pace)
   * - 120-130%: 0.4 (slow down)
   * - > 130%: 0.2 (throttle)
   *
   * Exception: if progress < 30% but tradesRemaining <= 100, stay 0.6 (not enough runway)
   */
  getOpenFrequency(metrics: ConvergenceMetrics): number {
    const progress = metrics.dailyProgress;

    // Exception: low progress but not enough trades left to boost
    if (progress < 30 && metrics.tradesRemaining <= 100) {
      return 0.6;
    }

    let frequency: number;
    if (progress < 30) {
      frequency = 0.9;
    } else if (progress < 80) {
      frequency = 0.7;
    } else if (progress < 120) {
      frequency = 0.6;
    } else if (progress < 130) {
      frequency = 0.4;
    } else {
      frequency = 0.2;
    }

    // Smooth transitions
    const smoothed = this.smoothTransition(progress, frequency, [
      { boundary: 30, prev: 0.9, next: 0.7 },
      { boundary: 80, prev: 0.7, next: 0.6 },
      { boundary: 120, prev: 0.6, next: 0.4 },
      { boundary: 130, prev: 0.4, next: 0.2 },
    ]);

    return smoothed;
  }

  // ============================================================================
  // Layer 6: Micro-steering (last resort)
  // ============================================================================

  /**
   * Calculate micro P&L adjustment for final trades
   *
   * Constraints:
   * - Only if tradesRemaining <= 10
   * - Only if deviation > 10% from target
   * - Max 0.08% per trade (hard limit, within market noise)
   * - If needed > 1.0%: log warning, accept miss
   *
   * Returns adjustment in % (e.g., 0.05 = add 0.05% to P&L)
   */
  getMicroSteering(metrics: ConvergenceMetrics): number {
    // Only in final 10 trades
    if (metrics.tradesRemaining > 10) return 0;

    // Only if deviation > 10%
    const deviation = Math.abs(metrics.dailyProgress - 100);
    if (deviation < 10) return 0;

    // Calculate needed adjustment per trade
    const gap = metrics.targetDailyPnL - metrics.currentDailyPnL;
    const neededPerTrade = gap / metrics.tradesRemaining;

    // Convert to % (assume average position size)
    const avgPositionSize = metrics.targetDailyPnL / (this.tradesPerDay * 0.5); // rough estimate
    const neededPercent = (neededPerTrade / avgPositionSize) * 100;

    // Hard cap at 0.08%
    const capped = Math.max(-0.08, Math.min(0.08, neededPercent));

    // If needed > 1.0%, target unreachable
    if (Math.abs(neededPercent) > 1.0) {
      console.warn(
        `[ConvergenceController] Target unreachable: need ${neededPercent.toFixed(2)}% per trade, ` +
        `but capped at 0.08%. Accepting miss.`
      );
    }

    // Record micro-steering (for analysis)
    this.microSteeringHistory.push({
      pnl: capped,
      timestamp: Date.now(),
    });

    return capped;
  }

  // ============================================================================
  // Utility: Threshold Smoothing
  // ============================================================================

  /**
   * Smooth transition between progress brackets using linear interpolation
   *
   * Prevents visual jumps when progress crosses boundaries
   * Example: 29% → 31% smoothly transitions 3.0x → 2.8x → 1.8x
   *
   * @param progress - current progress %
   * @param currentValue - value for current bracket
   * @param transitions - array of {boundary, prev, next}
   */
  private smoothTransition(
    progress: number,
    currentValue: number,
    transitions: Array<{ boundary: number; prev: number; next: number }>
  ): number {
    const transitionZone = 5; // ±5% around boundary

    for (const t of transitions) {
      const distanceToBoundary = Math.abs(progress - t.boundary);

      if (distanceToBoundary < transitionZone) {
        // In transition zone - interpolate
        const isApproaching = progress < t.boundary;
        const lowerBound = t.boundary - transitionZone;
        const upperBound = t.boundary + transitionZone;

        if (isApproaching) {
          // Approaching from below: prev → next
          const ratio = (progress - lowerBound) / (transitionZone * 2);
          return t.prev + (t.next - t.prev) * ratio;
        } else {
          // Passed boundary: stay at next
          return t.next;
        }
      }
    }

    // Not in transition zone - return current value
    return currentValue;
  }

  // ============================================================================
  // StaggeredClosing Integration
  // ============================================================================

  /**
   * Check if staggered closing should be forced
   *
   * When Layer 4 (early exit) or Layer 6 (micro-steering) closes positions
   * in final 10 trades, force staggered closing to prevent batch closure
   * with identical corrections (visually suspicious)
   */
  shouldForceStagger(activeLayer: number, tradesRemaining: number): boolean {
    if (tradesRemaining > 10) return false;

    // Force stagger if Layer 4 or Layer 6 active
    return activeLayer === 4 || activeLayer === 6;
  }

  // ============================================================================
  // Active Layer Detection (for UI display)
  // ============================================================================

  /**
   * Get dominant layer number (for UI display)
   *
   * Returns layer that's currently having the most impact
   * All layers evaluate simultaneously, this just shows which is "active"
   */
  getActiveLayer(metrics: ConvergenceMetrics): number {
    // Layer 6: micro-steering (highest priority)
    if (metrics.tradesRemaining <= 10 && Math.abs(metrics.dailyProgress - 100) > 10) {
      return 6;
    }

    // Layer 4: early exit
    if (metrics.dailyProgress > 120) {
      return 4;
    }

    // Layer 5: frequency control
    if (metrics.dailyProgress < 30 || metrics.dailyProgress > 130) {
      return 5;
    }

    // Layer 3: TP/SL adjustment
    if (metrics.dailyProgress > 110) {
      return 3;
    }

    // Layer 1: position sizing
    if (metrics.dailyProgress < 60) {
      return 1;
    }

    // Layer 2: entry timing (always active, but low priority for display)
    return 2;
  }

  // ============================================================================
  // Metrics Calculation
  // ============================================================================

  /**
   * Calculate current convergence metrics
   */
  getMetrics(
    currentDailyPnL: number,
    tradesCompleted: number
  ): ConvergenceMetrics {
    const targetDailyPnL = (this.investedCapital * this.targetDailyPnLPercent) / 100;
    const dailyProgress = targetDailyPnL > 0 ? (currentDailyPnL / targetDailyPnL) * 100 : 0;
    const tradesRemaining = Math.max(0, this.tradesPerDay - tradesCompleted);

    const emergencyMode = tradesRemaining <= 50 && dailyProgress < 80;
    const microSteeringActive = tradesRemaining <= 10 && Math.abs(dailyProgress - 100) > 10;

    return {
      dailyProgress,
      tradesCompleted,
      tradesRemaining,
      currentDailyPnL,
      targetDailyPnL,
      microSteeringActive,
      emergencyMode,
    };
  }

  // ============================================================================
  // Daily Reset
  // ============================================================================

  /**
   * Reset convergence state for new day
   */
  resetDaily(): void {
    this.microSteeringHistory = [];
  }

  // ============================================================================
  // Persistence
  // ============================================================================

  save(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const state = {
        microSteeringHistory: this.microSteeringHistory,
      };

      localStorage.setItem(`convergence_${botId}`, JSON.stringify(state));
    } catch (error) {
      console.error(`[ConvergenceController] Error saving state:`, error);
    }
  }

  load(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(`convergence_${botId}`);
      if (data) {
        const state = JSON.parse(data);
        this.microSteeringHistory = state.microSteeringHistory || [];
      }
    } catch (error) {
      console.error(`[ConvergenceController] Error loading state:`, error);
    }
  }
}
