// ============================================================================
// MARKETPLACE MOCK DATA
// ============================================================================
// This file contains mock data for the marketplace pages
// Replace with real API calls when backend is ready

import type { MasterBotData, BotStats, OpenPosition, Trade, EquityPoint, BotListItem } from '@/types/api';

// Helper function to generate equity curve data
function generateEquityData(startValue: number, endValue: number, days: number = 90): EquityPoint[] {
  const data: EquityPoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < days; i++) {
    const progress = i / (days - 1);
    // Add some randomness to make it look realistic
    const randomFactor = 0.95 + Math.random() * 0.1;
    const value = startValue + (endValue - startValue) * progress * randomFactor;

    data.push({
      timestamp: now - (days - i) * dayMs,
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}

// Helper function to generate recent trades
function generateRecentTrades(botName: string, count: number = 30): Trade[] {
  const pairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'];
  const trades: Trade[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isWin = Math.random() > 0.25; // 75% win rate
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const side: 'LONG' | 'SHORT' = Math.random() > 0.5 ? 'LONG' : 'SHORT';
    const leverage = Math.floor(Math.random() * 5) + 1;
    const entryPrice = 50000 + Math.random() * 10000;
    const pnlPercent = isWin ? (Math.random() * 5 + 0.5) : -(Math.random() * 3 + 0.2);
    const amount = Math.random() * 0.1 + 0.01;
    const positionSize = entryPrice * amount * leverage;
    const pnl = positionSize * (pnlPercent / 100);
    const exitPrice = side === 'LONG'
      ? entryPrice * (1 + pnlPercent / 100 / leverage)
      : entryPrice * (1 - pnlPercent / 100 / leverage);

    const durationHours = Math.floor(Math.random() * 48) + 1;
    const durationMinutes = Math.floor(Math.random() * 60);

    trades.push({
      id: `trade-${botName}-${i}`,
      botName,
      pair,
      side,
      leverage,
      entryPrice: Math.round(entryPrice * 100) / 100,
      exitPrice: Math.round(exitPrice * 100) / 100,
      amount: Math.round(amount * 10000) / 10000,
      positionSize: Math.round(positionSize * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
      duration: `${durationHours}h ${durationMinutes}m`,
      closedAt: new Date(now - i * 3600000).toISOString(),
    });
  }

  return trades;
}

// Helper function to generate open positions
function generateOpenPositions(count: number = 3): OpenPosition[] {
  const pairs = ['BTC/USDT', 'ETH/USDT'];
  const positions: OpenPosition[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    const side: 'LONG' | 'SHORT' = i % 2 === 0 ? 'LONG' : 'SHORT';
    const leverage = 3;
    const entryPrice = pair === 'BTC/USDT' ? 51234.50 : 2845.30;
    const currentPrice = entryPrice * (1 + (Math.random() * 0.04 - 0.02));
    const amount = 0.05;
    const positionSize = entryPrice * amount * leverage;
    const priceDiff = side === 'LONG' ? (currentPrice - entryPrice) : (entryPrice - currentPrice);
    const pnlPercent = (priceDiff / entryPrice) * leverage * 100;
    const pnl = positionSize * (pnlPercent / 100);

    const hoursAgo = Math.floor(Math.random() * 12) + 1;
    const minutesAgo = Math.floor(Math.random() * 60);

    positions.push({
      id: `pos-${i}`,
      pair,
      side,
      leverage,
      entryPrice: Math.round(entryPrice * 100) / 100,
      currentPrice: Math.round(currentPrice * 100) / 100,
      amount: Math.round(amount * 10000) / 10000,
      positionSize: Math.round(positionSize * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
      stopLoss: Math.round(entryPrice * (side === 'LONG' ? 0.95 : 1.05) * 100) / 100,
      takeProfit: Math.round(entryPrice * (side === 'LONG' ? 1.10 : 0.90) * 100) / 100,
      openedAt: `${hoursAgo}h ${minutesAgo}m ago`,
      duration: `${hoursAgo}h ${minutesAgo}m`,
    });
  }

  return positions;
}

// Generate mock stats for a bot
function generateBotStats(winRate: number, sharpeRatio: number, maxDD: number): BotStats {
  const totalTrades = Math.floor(Math.random() * 500) + 300;
  const winningTrades = Math.floor(totalTrades * (winRate / 100));
  const losingTrades = totalTrades - winningTrades;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    averageWin: Math.round((Math.random() * 200 + 100) * 100) / 100,
    averageLoss: -Math.round((Math.random() * 100 + 50) * 100) / 100,
    profitFactor: Math.round((1 + Math.random() * 2) * 100) / 100,
    sharpeRatio,
    maxDrawdown: maxDD,
    totalVolume: Math.round((Math.random() * 500000 + 250000) * 100) / 100,
    averageHoldTime: `${Math.floor(Math.random() * 12) + 1}.${Math.floor(Math.random() * 9)}h`,
    bestTrade: Math.round((Math.random() * 1000 + 500) * 100) / 100,
    worstTrade: -Math.round((Math.random() * 500 + 200) * 100) / 100,
    winStreak: Math.floor(Math.random() * 15) + 5,
    recoveryFactor: Math.round((1 + Math.random() * 3) * 100) / 100,
    avgTradeSize: Math.round((Math.random() * 5000 + 1000) * 100) / 100,
  };
}

// ============================================================================
// MASTER BOTS DATA
// ============================================================================

export const masterBotsData: MasterBotData[] = [
  {
    // Basic Info
    id: 'alphabot-master',
    slug: 'alphabot',
    name: 'AlphaBot Pro',
    icon: 'AB',
    strategy: 'Scalping',
    description: 'Consistent low-risk profits with AI-powered scalping. Uses advanced machine learning algorithms to identify micro-trends and execute high-frequency trades with precision.',
    risk: 'low',
    verified: true,
    ageMonths: 18,

    // Aggregate Statistics
    totalCopiers: 1247,
    totalInvestedByAll: 2847320,
    totalValueByAll: 8040835,
    aggregateProfit: 5193515,
    aggregateProfitPercent: 182.5,
    todayPnL: 23847,

    // Master Account Performance
    stats: generateBotStats(87, 2.8, -4.2),
    tradingPairs: ['BTC/USDT', 'ETH/USDT'],
    maxPositions: 5,
    activePositions: 3,
    runningSince: '2024-08-01',
    runningDays: 545,

    // Current Trading State
    openPositions: generateOpenPositions(3),
    recentTrades: generateRecentTrades('AlphaBot Pro', 40),
    equityData: generateEquityData(100, 287.5, 90),

    // Additional Info
    minInvestment: 500,
    rating: 4.9,
    reviews: 234,
    tags: ['BTC', 'ETH', 'Scalping', 'AI'],
  },
  {
    id: 'protrader-master',
    slug: 'protrader',
    name: 'ProTrader Elite',
    icon: 'PT',
    strategy: 'Swing Trading',
    description: 'Balanced growth with momentum strategies. Captures medium-term trends using technical analysis and market sentiment indicators.',
    risk: 'medium',
    verified: true,
    ageMonths: 14,

    totalCopiers: 892,
    totalInvestedByAll: 1784000,
    totalValueByAll: 5969120,
    aggregateProfit: 4185120,
    aggregateProfitPercent: 234.6,
    todayPnL: 18923,

    stats: generateBotStats(82, 2.3, -8.5),
    tradingPairs: ['ETH/USDT', 'BNB/USDT'],
    maxPositions: 4,
    activePositions: 2,
    runningSince: '2024-10-01',
    runningDays: 485,

    openPositions: generateOpenPositions(2),
    recentTrades: generateRecentTrades('ProTrader Elite', 35),
    equityData: generateEquityData(100, 334.8, 90),

    minInvestment: 1000,
    rating: 4.7,
    reviews: 187,
    tags: ['ETH', 'Swing', 'Momentum'],
  },
  {
    id: 'sigmabot-master',
    slug: 'sigmabot',
    name: 'SigmaBot',
    icon: 'Σ',
    strategy: 'Aggressive',
    description: 'Aggressive returns for risk-takers. High leverage multi-asset trading with volatility-based entry signals.',
    risk: 'high',
    verified: true,
    ageMonths: 10,

    totalCopiers: 543,
    totalInvestedByAll: 1357500,
    totalValueByAll: 6950625,
    aggregateProfit: 5593125,
    aggregateProfitPercent: 412.1,
    todayPnL: 34562,

    stats: generateBotStats(76, 1.8, -15.3),
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    maxPositions: 6,
    activePositions: 4,
    runningSince: '2024-12-01',
    runningDays: 425,

    openPositions: generateOpenPositions(4),
    recentTrades: generateRecentTrades('SigmaBot', 45),
    equityData: generateEquityData(100, 512.5, 90),

    minInvestment: 2500,
    rating: 4.5,
    reviews: 145,
    tags: ['Multi-asset', 'Aggressive', 'Volatility'],
  },
  {
    id: 'momentumx-master',
    slug: 'momentumx',
    name: 'MomentumX',
    icon: 'MX',
    strategy: 'Momentum',
    description: 'Captures market momentum swings. High-frequency momentum trading with rapid position turnover.',
    risk: 'high',
    verified: false,
    ageMonths: 4,

    totalCopiers: 234,
    totalInvestedByAll: 1170000,
    totalValueByAll: 6846510,
    aggregateProfit: 5676510,
    aggregateProfitPercent: 485.3,
    todayPnL: 42130,

    stats: generateBotStats(72, 1.6, -18.9),
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'],
    maxPositions: 8,
    activePositions: 5,
    runningSince: '2025-08-01',
    runningDays: 185,

    openPositions: generateOpenPositions(5),
    recentTrades: generateRecentTrades('MomentumX', 50),
    equityData: generateEquityData(100, 585.3, 90),

    minInvestment: 5000,
    rating: 4.3,
    reviews: 98,
    tags: ['Momentum', 'High-frequency', 'New'],
  },
  {
    id: 'gridbot-master',
    slug: 'gridbot',
    name: 'GridBot',
    icon: 'GB',
    strategy: 'Grid Trading',
    description: 'Profits from ranging markets. Places buy and sell orders at regular intervals to profit from market oscillations.',
    risk: 'low',
    verified: true,
    ageMonths: 22,

    totalCopiers: 678,
    totalInvestedByAll: 339000,
    totalValueByAll: 673713,
    aggregateProfit: 334713,
    aggregateProfitPercent: 98.7,
    todayPnL: 5234,

    stats: generateBotStats(89, 3.2, -2.1),
    tradingPairs: ['BTC/USDT', 'ETH/USDT'],
    maxPositions: 10,
    activePositions: 7,
    runningSince: '2024-01-01',
    runningDays: 760,

    openPositions: generateOpenPositions(7),
    recentTrades: generateRecentTrades('GridBot', 60),
    equityData: generateEquityData(100, 198.7, 90),

    minInvestment: 500,
    rating: 4.8,
    reviews: 203,
    tags: ['Range-trading', 'Sideways', 'Conservative'],
  },
  {
    id: 'thetagang-master',
    slug: 'thetagang',
    name: 'ThetaGang',
    icon: 'Θ',
    strategy: 'Options',
    description: 'Options strategies for steady income. Sells options premium to generate consistent returns with controlled risk.',
    risk: 'medium',
    verified: true,
    ageMonths: 16,

    totalCopiers: 445,
    totalInvestedByAll: 1335000,
    totalValueByAll: 3716640,
    aggregateProfit: 2381640,
    aggregateProfitPercent: 178.4,
    todayPnL: 14562,

    stats: generateBotStats(84, 2.5, -6.7),
    tradingPairs: ['BTC/USDT', 'ETH/USDT'],
    maxPositions: 4,
    activePositions: 2,
    runningSince: '2024-06-01',
    runningDays: 610,

    openPositions: generateOpenPositions(2),
    recentTrades: generateRecentTrades('ThetaGang', 30),
    equityData: generateEquityData(100, 278.4, 90),

    minInvestment: 3000,
    rating: 4.6,
    reviews: 156,
    tags: ['Options', 'Theta decay', 'Income'],
  },
  {
    id: 'dca-master-master',
    slug: 'dca-master',
    name: 'DCA Master',
    icon: 'DC',
    strategy: 'DCA',
    description: 'Dollar-cost averaging for long-term growth. Systematic accumulation strategy for building positions over time.',
    risk: 'low',
    verified: true,
    ageMonths: 28,

    totalCopiers: 1024,
    totalInvestedByAll: 102400,
    totalValueByAll: 188621,
    aggregateProfit: 86221,
    aggregateProfitPercent: 84.2,
    todayPnL: 1234,

    stats: generateBotStats(92, 3.5, -1.5),
    tradingPairs: ['BTC/USDT'],
    maxPositions: 3,
    activePositions: 1,
    runningSince: '2023-10-01',
    runningDays: 850,

    openPositions: generateOpenPositions(1),
    recentTrades: generateRecentTrades('DCA Master', 25),
    equityData: generateEquityData(100, 184.2, 90),

    minInvestment: 100,
    rating: 4.9,
    reviews: 287,
    tags: ['DCA', 'Long-term', 'Beginner-friendly'],
  },
  {
    id: 'arbitrage-pro-master',
    slug: 'arbitrage-pro',
    name: 'Arbitrage Pro',
    icon: 'AR',
    strategy: 'Arbitrage',
    description: 'Risk-free profits from price differences. Exploits price discrepancies between centralized and decentralized exchanges.',
    risk: 'low',
    verified: true,
    ageMonths: 12,

    totalCopiers: 856,
    totalInvestedByAll: 1712000,
    totalValueByAll: 3743744,
    aggregateProfit: 2031744,
    aggregateProfitPercent: 118.7,
    todayPnL: 8923,

    stats: generateBotStats(94, 4.1, -0.8),
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'USDC/USDT'],
    maxPositions: 6,
    activePositions: 3,
    runningSince: '2024-11-01',
    runningDays: 455,

    openPositions: generateOpenPositions(3),
    recentTrades: generateRecentTrades('Arbitrage Pro', 55),
    equityData: generateEquityData(100, 218.7, 90),

    minInvestment: 2000,
    rating: 4.8,
    reviews: 198,
    tags: ['Arbitrage', 'CEX-DEX', 'Low-risk'],
  },
];

// Helper function to get all bots (for marketplace list)
export function getAllMasterBots(): MasterBotData[] {
  return masterBotsData;
}

// Helper function to get a single bot by slug
export function getMasterBotBySlug(slug: string): MasterBotData | undefined {
  return masterBotsData.find(bot => bot.slug === slug);
}

// Convert MasterBotData to simplified BotListItem for marketplace list view
export function getBotListItems(): BotListItem[] {
  return masterBotsData.map((bot, index) => ({
    id: index + 1,
    slug: bot.slug,
    name: bot.name,
    icon: bot.icon,
    risk: bot.risk,
    strategy: bot.strategy,
    description: bot.description,
    stats: {
      return7d: Math.round(bot.aggregateProfitPercent * 0.03 * 100) / 100,
      return30d: Math.round(bot.aggregateProfitPercent * 0.15 * 100) / 100,
      return90d: Math.round(bot.aggregateProfitPercent * 0.45 * 100) / 100,
      return1y: bot.aggregateProfitPercent,
      winRate: bot.stats.winRate,
      maxDD: bot.stats.maxDrawdown,
      sharpeRatio: bot.stats.sharpeRatio,
      copiers: bot.totalCopiers,
      rating: bot.rating,
      reviews: bot.reviews,
      minInvestment: bot.minInvestment,
    },
    tags: bot.tags,
    trending: index % 3 === 0, // Make every 3rd bot trending
    verified: bot.verified,
    ageMonths: bot.ageMonths,
    performanceData: bot.equityData.slice(-30).map(point => point.value),
  }));
}
