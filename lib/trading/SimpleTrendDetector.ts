/**
 * SimpleTrendDetector - Minimal trend detection for Layer 2 entry timing
 *
 * Purpose: Align trade entries with natural price movement to minimize corrections.
 * - Opens LONG when price is rising (uptrend)
 * - Opens SHORT when price is falling (downtrend)
 * - Result: Real price naturally moves toward TP, correction < 0.1%
 */

export type Trend = 'up' | 'down' | 'flat';

export class SimpleTrendDetector {
  private priceHistory: Map<string, number[]> = new Map();
  private readonly maxPrices = 20; // Keep last 20 prices

  /**
   * Update price for a symbol
   */
  updatePrice(symbol: string, price: number): void {
    const history = this.priceHistory.get(symbol) || [];
    history.push(price);

    // Keep only last 20 prices
    if (history.length > this.maxPrices) {
      history.shift();
    }

    this.priceHistory.set(symbol, history);
  }

  /**
   * Get current trend for a symbol
   * Uses last 10 prices to determine direction
   */
  getTrend(symbol: string): Trend {
    const prices = this.priceHistory.get(symbol);

    if (!prices || prices.length < 10) {
      return 'flat'; // Not enough data
    }

    const recent = prices.slice(-10);
    const change = (recent[recent.length - 1] - recent[0]) / recent[0];

    if (change > 0.001) return 'up';   // >0.1% rise = uptrend
    if (change < -0.001) return 'down'; // >0.1% drop = downtrend
    return 'flat';
  }

  /**
   * Check if trend matches the trade side (for Layer 2 filtering)
   * - LONG matches uptrend
   * - SHORT matches downtrend
   * - FLAT allows any side (no preferred direction)
   */
  doesTrendMatch(symbol: string, side: 'LONG' | 'SHORT'): boolean {
    const trend = this.getTrend(symbol);

    // Flat market: no preferred direction, allow any side
    if (trend === 'flat') return true;

    return (side === 'LONG' && trend === 'up') ||
           (side === 'SHORT' && trend === 'down');
  }

  /**
   * Get price history for a symbol (for testing/debugging)
   */
  getPriceHistory(symbol: string): number[] {
    return this.priceHistory.get(symbol) || [];
  }

  /**
   * Clear all price history
   */
  clear(): void {
    this.priceHistory.clear();
  }
}

// Singleton instance
export const trendDetector = new SimpleTrendDetector();
