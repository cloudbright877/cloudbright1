import type { BotConfig } from './trading/types';

/**
 * Demo Marketplace Bots - 10 unique bots with different strategies
 */

export interface DemoBot {
  id: string;
  slug: string;
  name: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
  strategy: string;
  description: string;
  verified: boolean;
  trending: boolean;
  ageMonths: number;
  tags: string[];
  config: BotConfig;
  stats: {
    rating: number;
    reviews: number;
    copiers: number;
    minInvestment: number;
    return7d: number;
    return30d: number;
    return90d: number;
    return1y: number;
    winRate: number;
    maxDD: number;
    sharpeRatio: number;
  };
  performanceData: number[]; // 30-day performance data for chart
}

/**
 * 10 Pre-configured demo bots
 */
export const DEMO_BOTS: DemoBot[] = [
  // 1. Conservative BTC Scalper
  {
    id: 'demo-btc-scalper',
    slug: 'btc-scalper',
    name: 'BTC Scalper Pro',
    icon: '⚡',
    risk: 'low',
    strategy: 'High-frequency scalping on BTC/USDT with tight stop-losses',
    description: 'Conservative scalping strategy targeting small, consistent gains on Bitcoin. Uses 3x leverage with 75% win rate.',
    verified: true,
    trending: true,
    ageMonths: 18,
    tags: ['Scalping', 'Low Risk', 'BTC'],
    config: {
      name: 'BTC Scalper Pro',
      tradingPair: 'BTC/USDT',
      leverage: 3,
      winRate: 0.75,
      dailyTargetPercent: 1.5,
      investedCapital: 4000,
      tradesPerDay: 35,
      minPositionSize: 240,
      maxPositionSize: 560,
      winPnLMin: 0.8,
      winPnLMax: 1.8,
      lossPnLMin: 0.4,
      lossPnLMax: 0.9,
      minDuration: 120000, // 2 min
      maxDuration: 600000, // 10 min
      maxConcurrentPositions: 3,
      openFrequency: 0.3, // 30% chance to open per tick
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.8,
      reviews: 1247,
      copiers: 3420,
      minInvestment: 500,
      return7d: 8.2,
      return30d: 32.5,
      return90d: 94.3,
      return1y: 342.7,
      winRate: 75.2,
      maxDD: -8.4,
      sharpeRatio: 2.8,
    },
    performanceData: generatePerformanceData(1.5, 30, 0.3),
  },

  // 2. ETH Trend Follower
  {
    id: 'demo-eth-trend',
    slug: 'eth-trend-master',
    name: 'ETH Trend Master',
    icon: '📈',
    risk: 'medium',
    strategy: 'Momentum-based trend following on ETH/USDT',
    description: 'Captures medium-term trends in Ethereum price action. 5x leverage with optimized entry timing.',
    verified: true,
    trending: false,
    ageMonths: 14,
    tags: ['Trend Following', 'Medium Risk', 'ETH'],
    config: {
      name: 'ETH Trend Master',
      tradingPair: 'ETH/USDT',
      leverage: 5,
      winRate: 0.78,
      dailyTargetPercent: 2.8,
      investedCapital: 6000,
      tradesPerDay: 45,
      minPositionSize: 360,
      maxPositionSize: 840,
      winPnLMin: 1.2,
      winPnLMax: 2.5,
      lossPnLMin: 0.6,
      lossPnLMax: 1.2,
      minDuration: 180000, // 3 min
      maxDuration: 900000, // 15 min
      maxConcurrentPositions: 4,
      openFrequency: 0.35,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.7,
      reviews: 892,
      copiers: 2834,
      minInvestment: 1000,
      return7d: 12.4,
      return30d: 48.9,
      return90d: 138.2,
      return1y: 456.8,
      winRate: 78.1,
      maxDD: -12.3,
      sharpeRatio: 2.5,
    },
    performanceData: generatePerformanceData(2.8, 30, 0.5),
  },

  // 3. BNB Range Trader
  {
    id: 'demo-bnb-range',
    slug: 'bnb-range-king',
    name: 'BNB Range King',
    icon: '🎯',
    risk: 'low',
    strategy: 'Range-bound trading with support/resistance levels',
    description: 'Trades BNB/USDT within established price ranges. Conservative 3x leverage with high win rate.',
    verified: true,
    trending: false,
    ageMonths: 22,
    tags: ['Range Trading', 'Low Risk', 'BNB'],
    config: {
      name: 'BNB Range King',
      tradingPair: 'BNB/USDT',
      leverage: 3,
      winRate: 0.82,
      dailyTargetPercent: 1.3,
      investedCapital: 3500,
      tradesPerDay: 32,
      minPositionSize: 210,
      maxPositionSize: 490,
      winPnLMin: 0.7,
      winPnLMax: 1.5,
      lossPnLMin: 0.3,
      lossPnLMax: 0.7,
      minDuration: 240000, // 4 min
      maxDuration: 1200000, // 20 min
      maxConcurrentPositions: 5,
      openFrequency: 0.4,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.9,
      reviews: 1456,
      copiers: 4120,
      minInvestment: 500,
      return7d: 6.8,
      return30d: 28.4,
      return90d: 82.6,
      return1y: 298.5,
      winRate: 82.3,
      maxDD: -6.2,
      sharpeRatio: 3.1,
    },
    performanceData: generatePerformanceData(1.3, 30, 0.25),
  },

  // 4. SOL Breakout Hunter
  {
    id: 'demo-sol-breakout',
    slug: 'sol-breakout-hunter',
    name: 'SOL Breakout Hunter',
    icon: '🚀',
    risk: 'high',
    strategy: 'Aggressive breakout trading on volatile SOL moves',
    description: 'Capitalizes on Solana volatility with 10x leverage. Higher risk, higher reward strategy.',
    verified: true,
    trending: true,
    ageMonths: 9,
    tags: ['Breakout', 'High Risk', 'SOL'],
    config: {
      name: 'SOL Breakout Hunter',
      tradingPair: 'SOL/USDT',
      leverage: 10,
      winRate: 0.62,
      dailyTargetPercent: 6.5,
      investedCapital: 8500,
      tradesPerDay: 65,
      minPositionSize: 680,
      maxPositionSize: 1190,
      winPnLMin: 2.8,
      winPnLMax: 5.5,
      lossPnLMin: 1.4,
      lossPnLMax: 2.8,
      minDuration: 120000, // 2 min
      maxDuration: 600000, // 10 min
      maxConcurrentPositions: 5,
      openFrequency: 0.45,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.4,
      reviews: 623,
      copiers: 1890,
      minInvestment: 2000,
      return7d: 28.5,
      return30d: 112.3,
      return90d: 287.4,
      return1y: 892.6,
      winRate: 62.1,
      maxDD: -24.7,
      sharpeRatio: 1.9,
    },
    performanceData: generatePerformanceData(6.5, 30, 1.2),
  },

  // 5. Multi-Pair Arbitrage
  {
    id: 'demo-multi-arb',
    slug: 'multi-pair-arbitrage',
    name: 'Multi-Pair Arbitrage',
    icon: '⚖️',
    risk: 'low',
    strategy: 'Cross-pair arbitrage opportunities across major pairs',
    description: 'Exploits price differences between correlated pairs. Very low risk with steady returns.',
    verified: true,
    trending: false,
    ageMonths: 27,
    tags: ['Arbitrage', 'Low Risk', 'Multi-Pair'],
    config: {
      name: 'Multi-Pair Arbitrage',
      tradingPair: 'BTC/USDT',
      leverage: 3,
      winRate: 0.88,
      dailyTargetPercent: 0.9,
      investedCapital: 5000,
      tradesPerDay: 28,
      minPositionSize: 300,
      maxPositionSize: 700,
      winPnLMin: 0.5,
      winPnLMax: 1.2,
      lossPnLMin: 0.2,
      lossPnLMax: 0.5,
      minDuration: 240000, // 4 min
      maxDuration: 1200000, // 20 min
      maxConcurrentPositions: 5,
      openFrequency: 0.4,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.9,
      reviews: 1834,
      copiers: 5240,
      minInvestment: 1000,
      return7d: 5.2,
      return30d: 21.8,
      return90d: 68.4,
      return1y: 256.2,
      winRate: 88.4,
      maxDD: -4.1,
      sharpeRatio: 3.4,
    },
    performanceData: generatePerformanceData(0.9, 30, 0.15),
  },

  // 6. BTC Swing Trader
  {
    id: 'demo-btc-swing',
    slug: 'btc-swing-master',
    name: 'BTC Swing Master',
    icon: '🎢',
    risk: 'medium',
    strategy: 'Medium-term swing trading on BTC daily timeframes',
    description: 'Captures 2-5 day swings in Bitcoin price. Balanced risk with 5x leverage.',
    verified: true,
    trending: true,
    ageMonths: 16,
    tags: ['Swing Trading', 'Medium Risk', 'BTC'],
    config: {
      name: 'BTC Swing Master',
      tradingPair: 'BTC/USDT',
      leverage: 5,
      winRate: 0.72,
      dailyTargetPercent: 3.2,
      investedCapital: 7000,
      tradesPerDay: 50,
      minPositionSize: 420,
      maxPositionSize: 980,
      winPnLMin: 1.5,
      winPnLMax: 3.0,
      lossPnLMin: 0.8,
      lossPnLMax: 1.5,
      minDuration: 150000, // 2.5 min
      maxDuration: 800000, // 13.333333333333334 min
      maxConcurrentPositions: 4,
      openFrequency: 0.38,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.6,
      reviews: 1089,
      copiers: 3120,
      minInvestment: 1500,
      return7d: 14.8,
      return30d: 58.2,
      return90d: 162.5,
      return1y: 534.8,
      winRate: 72.4,
      maxDD: -15.8,
      sharpeRatio: 2.3,
    },
    performanceData: generatePerformanceData(3.2, 30, 0.6),
  },

  // 7. ETH Mean Reversion
  {
    id: 'demo-eth-reversion',
    slug: 'eth-mean-reversion',
    name: 'ETH Mean Reversion',
    icon: '↩️',
    risk: 'medium',
    strategy: 'Statistical mean reversion on ETH price deviations',
    description: 'Trades against extreme price moves in Ethereum. 5x leverage with mathematical edge.',
    verified: true,
    trending: false,
    ageMonths: 11,
    tags: ['Mean Reversion', 'Medium Risk', 'ETH'],
    config: {
      name: 'ETH Mean Reversion',
      tradingPair: 'ETH/USDT',
      leverage: 5,
      winRate: 0.76,
      dailyTargetPercent: 2.5,
      investedCapital: 5500,
      tradesPerDay: 42,
      minPositionSize: 330,
      maxPositionSize: 770,
      winPnLMin: 1.1,
      winPnLMax: 2.2,
      lossPnLMin: 0.5,
      lossPnLMax: 1.1,
      minDuration: 60000, // 1 min
      maxDuration: 300000, // 5 min
      maxConcurrentPositions: 6,
      openFrequency: 0.5,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.5,
      reviews: 734,
      copiers: 2340,
      minInvestment: 1000,
      return7d: 11.2,
      return30d: 44.6,
      return90d: 125.8,
      return1y: 412.3,
      winRate: 76.8,
      maxDD: -11.4,
      sharpeRatio: 2.4,
    },
    performanceData: generatePerformanceData(2.5, 30, 0.45),
  },

  // 8. BTC Grid Bot
  {
    id: 'demo-btc-grid',
    slug: 'btc-grid-pro',
    name: 'BTC Grid Pro',
    icon: '🔲',
    risk: 'low',
    strategy: 'Automated grid trading with dynamic price levels',
    description: 'Places buy and sell orders in a grid pattern. Conservative 3x leverage with consistent profits.',
    verified: true,
    trending: false,
    ageMonths: 20,
    tags: ['Grid Trading', 'Low Risk', 'BTC'],
    config: {
      name: 'BTC Grid Pro',
      tradingPair: 'BTC/USDT',
      leverage: 3,
      winRate: 0.79,
      dailyTargetPercent: 1.7,
      investedCapital: 4500,
      tradesPerDay: 38,
      minPositionSize: 270,
      maxPositionSize: 630,
      winPnLMin: 0.9,
      winPnLMax: 1.9,
      lossPnLMin: 0.4,
      lossPnLMax: 0.9,
      minDuration: 300000, // 5 min
      maxDuration: 1800000, // 30 min
      maxConcurrentPositions: 3,
      openFrequency: 0.25,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.7,
      reviews: 1124,
      copiers: 3680,
      minInvestment: 750,
      return7d: 7.4,
      return30d: 31.2,
      return90d: 89.7,
      return1y: 318.4,
      winRate: 79.2,
      maxDD: -7.8,
      sharpeRatio: 2.9,
    },
    performanceData: generatePerformanceData(1.7, 30, 0.3),
  },

  // 9. ETH Momentum Surge
  {
    id: 'demo-eth-momentum',
    slug: 'eth-momentum-surge',
    name: 'ETH Momentum Surge',
    icon: '💨',
    risk: 'high',
    strategy: 'Aggressive momentum trading during high volatility',
    description: 'Rides strong momentum waves in Ethereum. 10x leverage for maximum gains.',
    verified: true,
    trending: true,
    ageMonths: 7,
    tags: ['Momentum', 'High Risk', 'ETH'],
    config: {
      name: 'ETH Momentum Surge',
      tradingPair: 'ETH/USDT',
      leverage: 10,
      winRate: 0.58,
      dailyTargetPercent: 7.2,
      investedCapital: 9000,
      tradesPerDay: 70,
      minPositionSize: 720,
      maxPositionSize: 1260,
      winPnLMin: 3.2,
      winPnLMax: 6.0,
      lossPnLMin: 1.6,
      lossPnLMax: 3.2,
      minDuration: 200000, // 3.3333333333333335 min
      maxDuration: 1000000, // 16.666666666666668 min
      maxConcurrentPositions: 4,
      openFrequency: 0.35,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.3,
      reviews: 489,
      copiers: 1520,
      minInvestment: 2500,
      return7d: 32.8,
      return30d: 128.4,
      return90d: 324.6,
      return1y: 1024.7,
      winRate: 58.3,
      maxDD: -28.2,
      sharpeRatio: 1.7,
    },
    performanceData: generatePerformanceData(7.2, 30, 1.5),
  },

  // 10. All-Weather Diversified
  {
    id: 'demo-all-weather',
    slug: 'all-weather-diversified',
    name: 'All-Weather Diversified',
    icon: '🌐',
    risk: 'low',
    strategy: 'Diversified portfolio approach across multiple pairs',
    description: 'Balanced strategy trading BTC, ETH, BNB, and SOL. Ultra-stable with 3x leverage.',
    verified: true,
    trending: false,
    ageMonths: 24,
    tags: ['Diversified', 'Low Risk', 'Multi-Pair'],
    config: {
      name: 'All-Weather Diversified',
      tradingPair: 'BTC/USDT',
      leverage: 3,
      winRate: 0.84,
      dailyTargetPercent: 1.1,
      investedCapital: 4200,
      tradesPerDay: 30,
      minPositionSize: 252,
      maxPositionSize: 588,
      winPnLMin: 0.6,
      winPnLMax: 1.4,
      lossPnLMin: 0.3,
      lossPnLMax: 0.6,
      minDuration: 180000, // 3 min
      maxDuration: 900000, // 15 min
      maxConcurrentPositions: 5,
      openFrequency: 0.4,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.8,
      reviews: 1678,
      copiers: 4580,
      minInvestment: 800,
      return7d: 6.2,
      return30d: 26.8,
      return90d: 78.4,
      return1y: 284.6,
      winRate: 84.1,
      maxDD: -5.6,
      sharpeRatio: 3.2,
    },
    performanceData: generatePerformanceData(1.1, 30, 0.2),
  },
];

/**
 * Generate simulated performance data for charts
 * @param dailyTarget - Daily target percentage
 * @param days - Number of days to generate
 * @param volatility - Volatility factor (0-2)
 */
function generatePerformanceData(dailyTarget: number, days: number, volatility: number): number[] {
  const data: number[] = [0];
  let cumulative = 0;

  for (let i = 1; i < days; i++) {
    // Add some randomness around the daily target
    const variance = (Math.random() - 0.5) * 2 * volatility;
    const dailyReturn = dailyTarget + variance;
    cumulative += dailyReturn;
    data.push(cumulative);
  }

  return data;
}

/**
 * Get bot by slug
 */
export function getDemoBotBySlug(slug: string): DemoBot | undefined {
  return DEMO_BOTS.find(bot => bot.slug === slug);
}

/**
 * Get bot by ID
 */
export function getDemoBotById(id: string): DemoBot | undefined {
  return DEMO_BOTS.find(bot => bot.id === id);
}

/**
 * Get all demo bots
 */
export function getAllDemoBots(): DemoBot[] {
  return DEMO_BOTS;
}
