/**
 * Price Adjustment Engine
 *
 * Provides "controlled" prices for trading positions
 * - Uses real Binance prices as base
 * - Adds small adjustment (±0.02%) to guarantee outcomes
 * - Maintains realism while ensuring target win rate
 */

export interface LivePosition {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  openedAt: number;
  shouldWin: boolean;
  targetPnL: number;    // Target P&L percent (e.g., +0.3%)
  stopLossPnL: number;  // Stop loss percent (e.g., -0.2%)
}

export interface BinancePrices {
  [symbol: string]: {
    price: number;
    lastUpdate: number;
  };
}

export class PriceAdjustmentEngine {
  private maxDeviationPercent = 0.0002; // ±0.02% max deviation

  /**
   * Get adjusted price for a position
   * Nudges price towards target based on shouldWin
   */
  getAdjustedPrice(
    basePrices: BinancePrices,
    position: LivePosition
  ): number {
    const basePrice = basePrices[position.pair]?.price;

    if (!basePrice) {
      console.warn(`No base price for ${position.pair}`);
      return position.currentPrice; // Keep last known
    }

    const adjustment = this.calculateAdjustment(basePrice, position);
    const adjustedPrice = basePrice + adjustment;

    // Log for debugging (only first few times)
    if (Math.random() < 0.05) {
      console.log(
        `📊 ${position.pair}: Base $${basePrice.toFixed(2)} → ` +
        `Adjusted $${adjustedPrice.toFixed(2)} (${adjustment > 0 ? '+' : ''}${((adjustment / basePrice) * 100).toFixed(4)}%)`
      );
    }

    return adjustedPrice;
  }

  /**
   * Calculate price adjustment to guide position towards target
   */
  private calculateAdjustment(basePrice: number, position: LivePosition): number {
    const progress = this.calculateProgressToTarget(position);
    const maxAdjustment = basePrice * this.maxDeviationPercent;

    if (position.shouldWin) {
      // Winning trade: nudge price towards take profit
      return this.calculateWinningAdjustment(position, maxAdjustment, progress);
    } else {
      // Losing trade: nudge price towards stop loss
      return this.calculateLosingAdjustment(position, maxAdjustment, progress);
    }
  }

  /**
   * Calculate adjustment for winning trade
   * Slowly moves price in favorable direction
   */
  private calculateWinningAdjustment(
    position: LivePosition,
    maxAdjustment: number,
    progress: number
  ): number {
    // Direction: LONG = price up (+), SHORT = price down (-)
    const direction = position.side === 'LONG' ? 1 : -1;

    // Start small, increase as time passes
    const scaledAdjustment = maxAdjustment * progress * direction;

    return scaledAdjustment;
  }

  /**
   * Calculate adjustment for losing trade
   * Slowly moves price in unfavorable direction
   */
  private calculateLosingAdjustment(
    position: LivePosition,
    maxAdjustment: number,
    progress: number
  ): number {
    // Direction: opposite of winning (LONG = price down, SHORT = price up)
    const direction = position.side === 'LONG' ? -1 : 1;

    // Losing trades should reach SL faster (more aggressive adjustment)
    const scaledAdjustment = maxAdjustment * progress * direction * 1.2;

    return scaledAdjustment;
  }

  /**
   * Calculate how close position is to target closure
   * Returns 0 (just opened) to 1 (should close now)
   */
  private calculateProgressToTarget(position: LivePosition): number {
    const elapsed = Date.now() - position.openedAt;

    // Expected duration based on target P&L
    // Smaller targets = faster trades
    const targetMagnitude = Math.abs(position.targetPnL);
    const baseDuration = 60000; // 60 seconds base
    const durationMultiplier = targetMagnitude < 0.2 ? 0.5 : 1.0;
    const expectedDuration = baseDuration * durationMultiplier;

    // Progress: 0 → 1
    const progress = Math.min(elapsed / expectedDuration, 1);

    return progress;
  }

  /**
   * Check if position should be closed
   */
  shouldClosePosition(position: LivePosition): boolean {
    const currentPnL = position.pnlPercent;

    // Close if reached target
    if (position.shouldWin && currentPnL >= position.targetPnL) {
      console.log(`✅ Closing winning position: ${position.pair} at +${currentPnL.toFixed(3)}%`);
      return true;
    }

    // Close if hit stop loss
    if (!position.shouldWin && currentPnL <= position.stopLossPnL) {
      console.log(`❌ Closing losing position: ${position.pair} at ${currentPnL.toFixed(3)}%`);
      return true;
    }

    // Safety: force close after max duration (prevent hanging)
    const elapsed = Date.now() - position.openedAt;
    const maxDuration = 120000; // 2 minutes max

    if (elapsed > maxDuration) {
      console.warn(`⏱️ Force closing position ${position.pair} after ${elapsed / 1000}s`);
      return true;
    }

    return false;
  }

  /**
   * Set maximum deviation percentage
   * Higher = more control but less realistic
   * Lower = more realistic but less control
   */
  setMaxDeviation(percent: number): void {
    this.maxDeviationPercent = Math.max(0.00005, Math.min(percent, 0.001)); // 0.005% to 0.1%
    console.log(`🎛️ Max price deviation set to ±${(this.maxDeviationPercent * 100).toFixed(4)}%`);
  }
}

// Export singleton instance
export const priceAdjustmentEngine = new PriceAdjustmentEngine();
