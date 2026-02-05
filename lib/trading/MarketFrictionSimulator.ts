/**
 * Market Friction Simulator
 *
 * Adds realistic trading costs to P&L:
 * - Slippage: Price movement during order execution
 * - Spread: Bid-ask spread cost
 * - Funding rate: Perpetual futures funding (can be positive or negative)
 * - Commission: Exchange trading fees
 *
 * User selected: "Realistic (0.2-0.4%)" total friction level
 */

export interface FrictionComponents {
  slippage: number;      // % (usually negative)
  spread: number;        // % (always negative)
  fundingRate: number;   // % (can be ±)
  commission: number;    // % (always negative)
  total: number;         // Sum of all components
}

export interface FrictionParams {
  tradingPair: string;      // e.g. "BTC/USDT"
  positionSizeUSD: number;  // Position size in USD
  leverage: number;         // 1-125x
  side: 'LONG' | 'SHORT';  // Position side
  volatility?: 'low' | 'medium' | 'high'; // Market volatility
}

export class MarketFrictionSimulator {
  /**
   * Calculate total market friction for a trade
   *
   * Target range: 0.2-0.4% total (realistic retail conditions)
   */
  calculateFriction(params: FrictionParams): FrictionComponents {
    const { tradingPair, positionSizeUSD, leverage, side, volatility = 'medium' } = params;

    // 1. Slippage: depends on volatility and position size
    const slippage = this.calculateSlippage(volatility, positionSizeUSD);

    // 2. Spread: depends on trading pair liquidity
    const spread = this.calculateSpread(tradingPair);

    // 3. Funding rate: depends on market sentiment (perpetual futures)
    const fundingRate = this.calculateFundingRate(side);

    // 4. Commission: standard taker fee
    const commission = this.calculateCommission();

    const total = slippage + spread + fundingRate + commission;

    return {
      slippage,
      spread,
      fundingRate,
      commission,
      total,
    };
  }

  /**
   * Calculate slippage based on volatility and position size
   *
   * Higher volatility → more slippage
   * Larger position → more slippage
   *
   * Range: -0.05% to -0.3%
   */
  private calculateSlippage(volatility: 'low' | 'medium' | 'high', positionSizeUSD: number): number {
    // Base slippage by volatility
    const baseSlippage = {
      low: -0.05,
      medium: -0.12,
      high: -0.25,
    }[volatility];

    // Additional slippage for large positions (over $1000)
    const sizeFactor = Math.min(positionSizeUSD / 1000, 2.0); // Cap at 2x
    const sizeAdjustment = -0.02 * (sizeFactor - 1); // 0% to -2% additional

    // Random variance ±20%
    const variance = (Math.random() - 0.5) * 0.4;

    return (baseSlippage + sizeAdjustment) * (1 + variance);
  }

  /**
   * Calculate spread cost based on trading pair liquidity
   *
   * Major pairs (BTC/ETH) → tight spreads
   * Altcoins → wider spreads
   *
   * Range: -0.02% to -0.12%
   */
  private calculateSpread(tradingPair: string): number {
    // Determine pair type
    const isMajor = ['BTC', 'ETH'].some(coin => tradingPair.includes(coin));
    const isPopularAlt = ['BNB', 'SOL', 'AVAX', 'MATIC', 'LINK'].some(coin => tradingPair.includes(coin));

    let baseSpread: number;
    if (isMajor) {
      baseSpread = -0.03; // Tight spreads on BTC/ETH
    } else if (isPopularAlt) {
      baseSpread = -0.06; // Medium spreads on popular alts
    } else {
      baseSpread = -0.10; // Wide spreads on exotic pairs
    }

    // Random variance ±30%
    const variance = (Math.random() - 0.5) * 0.6;

    return baseSpread * (1 + variance);
  }

  /**
   * Calculate funding rate (perpetual futures only)
   *
   * Can be positive (you receive) or negative (you pay)
   * Typically ±0.01% per 8h funding period
   *
   * Range: -0.03% to +0.02%
   */
  private calculateFundingRate(side: 'LONG' | 'SHORT'): number {
    // Funding rate is typically paid by longs in bull markets
    // and by shorts in bear markets

    // Simulate current market bias (60% chance of bullish funding)
    const isBullishFunding = Math.random() < 0.6;

    let baseFundingRate: number;
    if (isBullishFunding) {
      // Longs pay, shorts receive
      baseFundingRate = side === 'LONG' ? -0.01 : +0.008;
    } else {
      // Shorts pay, longs receive
      baseFundingRate = side === 'LONG' ? +0.005 : -0.012;
    }

    // Random variance ±40%
    const variance = (Math.random() - 0.5) * 0.8;

    return baseFundingRate * (1 + variance);
  }

  /**
   * Calculate exchange commission (taker fee)
   *
   * Standard taker fee: -0.04% to -0.06%
   * (Maker fee would be lower, but we assume aggressive taker orders)
   */
  private calculateCommission(): number {
    // Base commission: -0.05%
    const baseCommission = -0.05;

    // Small random variance ±20%
    const variance = (Math.random() - 0.5) * 0.4;

    return baseCommission * (1 + variance);
  }

  /**
   * Apply friction to a P&L percentage
   *
   * Example: trade P&L = +5%, friction = -0.3%, final = +4.7%
   */
  applyFrictionToPnL(pnlPercent: number, friction: FrictionComponents): number {
    return pnlPercent + friction.total;
  }

  /**
   * Get human-readable friction summary
   */
  getFrictionSummary(friction: FrictionComponents): string {
    const formatPercent = (val: number) => (val >= 0 ? '+' : '') + val.toFixed(3) + '%';

    return (
      `Market Friction: ${formatPercent(friction.total)} ` +
      `(slippage: ${formatPercent(friction.slippage)}, ` +
      `spread: ${formatPercent(friction.spread)}, ` +
      `funding: ${formatPercent(friction.fundingRate)}, ` +
      `fee: ${formatPercent(friction.commission)})`
    );
  }

  /**
   * Simulate volatility based on time and market conditions
   *
   * Realistic simulation: higher volatility during certain hours
   */
  estimateCurrentVolatility(): 'low' | 'medium' | 'high' {
    const hour = new Date().getHours();

    // Higher volatility during US/EU trading hours (14:00-22:00 UTC)
    const isHighVolatilityHours = hour >= 14 && hour <= 22;

    if (isHighVolatilityHours) {
      // 60% medium, 30% high, 10% low during active hours
      const rand = Math.random();
      if (rand < 0.1) return 'low';
      if (rand < 0.7) return 'medium';
      return 'high';
    } else {
      // 70% low, 25% medium, 5% high during off-hours
      const rand = Math.random();
      if (rand < 0.7) return 'low';
      if (rand < 0.95) return 'medium';
      return 'high';
    }
  }
}

// Singleton instance
export const marketFrictionSimulator = new MarketFrictionSimulator();
