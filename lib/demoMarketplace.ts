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
  // 1. Bybit Market Maker - ULTRA-FAST & SAFE (Min DD)
  {
    id: 'bybit-market-maker',
    slug: 'bybit-market-maker',
    name: 'Bybit Market Maker',
    icon: '/bots/BybitMarketMakerBot.png',
    risk: 'low',
    strategy: 'Ultra-high frequency market making with minimal drawdown - 250 trades/day',
    description: 'Lightning-fast market maker with 12 concurrent micro-positions. Extreme safety: 2-3x floating leverage, -3% max DD. Strategy: capture tiny spreads at high volume on BTC/ETH/BNB. 58% win rate with tight 0.3-1.2% wins vs 0.15-0.6% losses.',
    verified: true,
    trending: true,
    ageMonths: 24,
    tags: ['Market Making', 'Ultra-Fast', 'Min DD', 'Multi-Pair', 'Bybit'],
    config: {
      name: 'Bybit Market Maker',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
      leverages: [2, 2, 3], // Floating leverage: mostly 2x, occasionally 3x
      winRate: 0.58,
      dailyTargetPercent: 2.5, // Increased from 0.9% for realistic trade sizes
      investedCapital: 5000,
      tradesPerDay: 250,
      minPositionSize: 100,
      maxPositionSize: 250,
      // NOTE: winPnLMin/Max REMOVED - now calculated dynamically based on dailyTarget/trades/winRate
      // This ensures proper convergence regardless of tradesPerDay changes
      minDuration: 30000, // 30 sec
      maxDuration: 180000, // 3 min
      maxConcurrentPositions: 12,
      openFrequency: 0.65,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.9,
      reviews: 2145,
      copiers: 5830,
      minInvestment: 1000,
      return7d: 4.8,
      return30d: 21.4,
      return90d: 68.2,
      return1y: 248.5,
      winRate: 58.1,
      maxDD: -3.1,
      sharpeRatio: 4.2,
    },
    performanceData: generatePerformanceData(0.9, 30, 0.12),
  },

  // 2. Bitfinex Leverage x10 - SLOW MEGA LEVERAGE
  {
    id: 'bitfinex-leverage-x10',
    slug: 'bitfinex-leverage-x10',
    name: 'Bitfinex Leverage x10 Futures Bot',
    icon: '/bots/BitfinexLeveragex10FuturesBot.png',
    risk: 'high',
    strategy: 'Slow, calculated entries with 10-15x leverage - only 8 trades/day',
    description: 'Institutional-grade patience strategy: employs advanced technical confluence to identify high-probability setups before executing with 10-15x dynamic leverage. Single-position concentration with asymmetric risk-reward (1:5 ratio). Operates on BTC/ETH majors. Win probability 54% compensated by 6:1 average R:R. Drawdown tolerance: -35%. Designed for sophisticated traders who understand position sizing and volatility cycles.',
    verified: true,
    trending: false,
    ageMonths: 11,
    tags: ['High Leverage', 'Slow Trading', 'Futures', 'Confluence', 'Bitfinex'],
    config: {
      name: 'Bitfinex Leverage x10',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT'],
      leverages: [10, 12, 15], // Dynamic leverage based on conviction
      winRate: 0.54,
      dailyTargetPercent: 4.5,
      investedCapital: 8000,
      tradesPerDay: 8,
      minPositionSize: 1200,
      maxPositionSize: 2000,
      minDuration: 600000, // 10 min
      maxDuration: 3600000, // 1 hour
      maxConcurrentPositions: 1,
      openFrequency: 0.15,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.3,
      reviews: 687,
      copiers: 1840,
      minInvestment: 2500,
      return7d: 18.2,
      return30d: 78.4,
      return90d: 224.8,
      return1y: 782.5,
      winRate: 54.2,
      maxDD: -35.4,
      sharpeRatio: 1.8,
    },
    performanceData: generatePerformanceData(4.5, 30, 1.8),
  },

  // 3. Kraken Breakout Trader - MAX DRAWDOWN HUNTER
  {
    id: 'kraken-breakout-trader',
    slug: 'kraken-breakout-trader',
    name: 'Kraken Breakout Trader',
    icon: '/bots/KrakenBreakoutTraderBot.png',
    risk: 'high',
    strategy: 'Extreme volatility breakout hunter with 18-25x leverage - max drawdown strategy',
    description: 'Volatility harvesting system designed for maximum capital efficiency. Utilizes momentum cascade detection with 18-25x adaptive leverage scaling based on volatility regime. Single-position concentration maximizes R:R asymmetry. Operates on XRP/ADA/DOGE altcoins during explosive breakout phases. Win rate 52% offset by 10:1 best-case R:R. Drawdown ceiling: -55%. Not suitable for weak hands. Requires understanding of Kelly criterion and tail risk management.',
    verified: true,
    trending: true,
    ageMonths: 8,
    tags: ['Breakout', 'Max DD', 'High Risk', 'Altcoins', 'Kraken'],
    config: {
      name: 'Kraken Breakout Trader',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['XRP/USDT', 'ADA/USDT', 'DOGE/USDT'],
      leverages: [18, 20, 22, 25], // Escalating leverage on conviction
      winRate: 0.52,
      dailyTargetPercent: 8.5,
      investedCapital: 10000,
      tradesPerDay: 45,
      minPositionSize: 1800,
      maxPositionSize: 2800,
      minDuration: 45000, // 45 sec
      maxDuration: 300000, // 5 min
      maxConcurrentPositions: 1,
      openFrequency: 0.35,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.1,
      reviews: 423,
      copiers: 982,
      minInvestment: 5000,
      return7d: 32.5,
      return30d: 142.8,
      return90d: 398.4,
      return1y: 1284.6,
      winRate: 52.4,
      maxDD: -55.2,
      sharpeRatio: 1.4,
    },
    performanceData: generatePerformanceData(8.5, 30, 3.5),
  },

  // 4. OKX Grid Trading - MIN DD ALTERNATIVE (Grinder)
  {
    id: 'okx-grid-trading',
    slug: 'okx-grid-trading',
    name: 'OKX Grid Trading Bot',
    icon: '/bots/OKXGridTradingBot.png',
    risk: 'low',
    strategy: 'High-frequency grid trading with minimal drawdown - 180 trades/day',
    description: 'Systematic mean-reversion engine employing 10-layer grid architecture. Deploys 3-4x dynamic leverage with position pyramiding across BTC/ETH/SOL. Win rate 56% through statistical arbitrage of microstructure inefficiencies. Maximum drawdown -5% enforced via strict position sizing. Annual volatility <12%. Ideal for capital preservation with consistent yield generation. Compound annual growth rate: 284%.',
    verified: true,
    trending: false,
    ageMonths: 16,
    tags: ['Grid Trading', 'Min DD', 'Low Risk', 'Multi-Pair', 'OKX'],
    config: {
      name: 'OKX Grid Trading Bot',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
      leverages: [3, 3, 4], // Conservative range leverage
      winRate: 0.56,
      dailyTargetPercent: 1.2,
      investedCapital: 6000,
      tradesPerDay: 180,
      minPositionSize: 150,
      maxPositionSize: 320,
      minDuration: 60000, // 1 min
      maxDuration: 240000, // 4 min
      maxConcurrentPositions: 10,
      openFrequency: 0.55,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.7,
      reviews: 1834,
      copiers: 4240,
      minInvestment: 1200,
      return7d: 5.8,
      return30d: 25.2,
      return90d: 76.8,
      return1y: 284.2,
      winRate: 56.3,
      maxDD: -5.1,
      sharpeRatio: 3.8,
    },
    performanceData: generatePerformanceData(1.2, 30, 0.15),
  },

  // 5. KuCoin Flash Arbitrage - FASTEST STRATEGY
  {
    id: 'kucoin-flash-arbitrage',
    slug: 'kucoin-flash-arbitrage',
    name: 'KuCoin Flash Arbitrage Bot',
    icon: '/bots/KuCoinFlashArbitrageBot.png',
    risk: 'low',
    strategy: 'Lightning-speed arbitrage - 320 trades/day, fastest bot in marketplace',
    description: 'High-frequency market-making algorithm optimized for latency arbitrage. Executes 320 trades daily across 8 concurrent micro-positions on BTC/ETH/LTC/MATIC. Leverages 2-3x with sub-second holding periods. Exploits cross-exchange price dislocations and funding rate differentials. Win probability 57% with tight 0.25-1.4% profit targets. Maximum drawdown -4.3%. Requires institutional-grade execution infrastructure. Sharpe ratio 3.9 indicates exceptional risk-adjusted returns.',
    verified: true,
    trending: true,
    ageMonths: 12,
    tags: ['Arbitrage', 'Ultra-Fast', 'Min DD', 'Multi-Pair', 'KuCoin'],
    config: {
      name: 'KuCoin Flash Arbitrage',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT', 'LTC/USDT', 'MATIC/USDT'],
      leverages: [2, 2, 3], // Minimal leverage for safety
      winRate: 0.57,
      dailyTargetPercent: 1.1,
      investedCapital: 4800,
      tradesPerDay: 320,
      minPositionSize: 80,
      maxPositionSize: 180,
      minDuration: 15000, // 15 sec
      maxDuration: 90000, // 1.5 min
      maxConcurrentPositions: 8,
      openFrequency: 0.7,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.6,
      reviews: 956,
      copiers: 3120,
      minInvestment: 800,
      return7d: 5.1,
      return30d: 22.8,
      return90d: 71.4,
      return1y: 268.5,
      winRate: 57.2,
      maxDD: -4.3,
      sharpeRatio: 3.9,
    },
    performanceData: generatePerformanceData(1.1, 30, 0.14),
  },

  // 6. Binance Altcoin Scalper - MEDIUM RISK
  {
    id: 'binance-altcoin-scalper',
    slug: 'binance-altcoin-scalper',
    name: 'Binance Altcoin Scalper Bot',
    icon: '/bots/BinanceAltcoinScalperBot.png',
    risk: 'medium',
    strategy: 'Medium-frequency altcoin scalping with 5-8x leverage - 95 trades/day',
    description: 'Momentum-driven scalping framework targeting altcoin volatility expansion phases. Operates with 5-8x adaptive leverage across ETH/BNB/AVAX/LINK. Maintains 3 concurrent positions with dynamic risk allocation. Win rate 55% balanced by 3:1 average risk-reward ratio. Profit range 1.5-7% per trade creates volatile equity curve for maximum compounding. Drawdown tolerance -18%. Daily target 3.2%. Optimal for intermediate traders seeking active portfolio growth.',
    verified: true,
    trending: true,
    ageMonths: 14,
    tags: ['Scalping', 'Medium Risk', 'Altcoins', 'Binance'],
    config: {
      name: 'Binance Altcoin Scalper',
      tradingPair: 'ETH/USDT',
      tradingPairs: ['ETH/USDT', 'BNB/USDT', 'AVAX/USDT', 'LINK/USDT'],
      leverages: [5, 6, 7, 8], // Medium leverage range
      winRate: 0.55,
      dailyTargetPercent: 3.2,
      investedCapital: 6500,
      tradesPerDay: 95,
      minPositionSize: 420,
      maxPositionSize: 780,
      minDuration: 90000, // 1.5 min
      maxDuration: 420000, // 7 min
      maxConcurrentPositions: 3,
      openFrequency: 0.42,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.5,
      reviews: 1248,
      copiers: 2890,
      minInvestment: 1500,
      return7d: 13.2,
      return30d: 56.8,
      return90d: 168.4,
      return1y: 584.2,
      winRate: 55.3,
      maxDD: -18.4,
      sharpeRatio: 2.2,
    },
    performanceData: generatePerformanceData(3.2, 30, 0.85),
  },

  // 7. Poloniex Futures x5 Copy Bot - MEDIUM RISK
  {
    id: 'poloniex-futures-x5',
    slug: 'poloniex-futures-x5',
    name: 'Poloniex Futures x5 Copy Bot',
    icon: '/bots/PoloniexFuturesx5CopyBot.png',
    risk: 'medium',
    strategy: 'Futures trading with 4-7x leverage - 62 trades/day, 4 concurrent positions',
    description: 'Balanced perpetual futures framework employing 4-7x variable leverage allocation. Operates 4 concurrent positions across BTC/ETH/SOL with dynamic hedging. Win rate 54% enhanced by 4:1 average R:R through selective trade filtering. P&L variance 1.2-6.8% creates realistic equity fluctuations. Drawdown cap -22%. Daily yield target 2.8%. Designed for traders seeking moderate leverage exposure without excessive tail risk. Sharpe 2.0 demonstrates strong risk-adjusted performance.',
    verified: true,
    trending: false,
    ageMonths: 13,
    tags: ['Futures', 'Medium Risk', 'Multi-Pair', 'Poloniex'],
    config: {
      name: 'Poloniex Futures x5',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
      leverages: [4, 5, 6, 7], // Medium leverage range
      winRate: 0.54,
      dailyTargetPercent: 2.8,
      investedCapital: 5800,
      tradesPerDay: 62,
      minPositionSize: 380,
      maxPositionSize: 720,
      minDuration: 120000, // 2 min
      maxDuration: 480000, // 8 min
      maxConcurrentPositions: 4,
      openFrequency: 0.38,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.4,
      reviews: 892,
      copiers: 2340,
      minInvestment: 1200,
      return7d: 11.8,
      return30d: 49.2,
      return90d: 144.8,
      return1y: 498.6,
      winRate: 54.1,
      maxDD: -22.3,
      sharpeRatio: 2.0,
    },
    performanceData: generatePerformanceData(2.8, 30, 0.78),
  },

  // 8. Crypto.com News Reactive Bot - HIGH RISK (Event-Driven)
  {
    id: 'cryptocom-news-reactive',
    slug: 'cryptocom-news-reactive',
    name: 'Crypto.com News Reactive Bot',
    icon: '/bots/CryptocomNewsReactiveBot.png',
    risk: 'high',
    strategy: 'Event-driven news trading with 12-18x leverage - spiky returns, low frequency',
    description: 'Catalyst-driven alpha extraction system designed for macroeconomic and sentiment-based volatility events. Deploys 12-18x adaptive leverage calibrated to event magnitude and implied volatility. Low frequency (28 trades/day) reflects selective entry criteria requiring multiple confluence factors. Operates on BTC/ETH during Federal Reserve announcements, CPI releases, and black swan events. Win rate 51% compensated by extreme 8:1 best-case R:R asymmetry. Drawdown tolerance -42% accommodates event-risk tail distribution. Requires sophisticated understanding of market microstructure during news flow.',
    verified: true,
    trending: true,
    ageMonths: 9,
    tags: ['News Trading', 'High Risk', 'Event-Driven', 'Macro', 'Crypto.com'],
    config: {
      name: 'Crypto.com News Reactive',
      tradingPair: 'BTC/USDT',
      tradingPairs: ['BTC/USDT', 'ETH/USDT'],
      leverages: [12, 15, 18], // Event-driven leverage scaling
      winRate: 0.51,
      dailyTargetPercent: 6.2,
      investedCapital: 7500,
      tradesPerDay: 28,
      minPositionSize: 980,
      maxPositionSize: 1680,
      minDuration: 180000, // 3 min
      maxDuration: 600000, // 10 min
      maxConcurrentPositions: 2,
      openFrequency: 0.25,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.2,
      reviews: 534,
      copiers: 1420,
      minInvestment: 3000,
      return7d: 24.8,
      return30d: 98.4,
      return90d: 284.2,
      return1y: 968.5,
      winRate: 51.3,
      maxDD: -42.1,
      sharpeRatio: 1.6,
    },
    performanceData: generatePerformanceData(6.2, 30, 2.4),
  },

  // 9. Huobi Mean Reversion Bot - HIGH RISK (Counter-Trend)
  {
    id: 'huobi-mean-reversion',
    slug: 'huobi-mean-reversion',
    name: 'Huobi Mean Reversion Bot',
    icon: '/bots/HuobiMeanReversionBot.png',
    risk: 'high',
    strategy: 'Counter-trend mean reversion with 10-15x leverage - fights the trend',
    description: 'Statistical arbitrage system exploiting mean-reversion anomalies through contrarian positioning. Employs 10-15x leverage with Bollinger Band extremes and RSI divergence confirmation. Fades parabolic moves on ETH/BNB/MATIC altcoins. Two concurrent positions maintain portfolio heat at manageable levels. Win rate 53% offset by 5:1 R:R on reversion completions. Extreme P&L variance 3.5-14% generates highly volatile but profitable equity curve. Drawdown ceiling -48%. Designed for traders with deep understanding of volatility cycles and regression to mean principles.',
    verified: true,
    trending: false,
    ageMonths: 10,
    tags: ['Mean Reversion', 'High Risk', 'Counter-Trend', 'Altcoins', 'Huobi'],
    config: {
      name: 'Huobi Mean Reversion',
      tradingPair: 'ETH/USDT',
      tradingPairs: ['ETH/USDT', 'BNB/USDT', 'MATIC/USDT'],
      leverages: [10, 12, 15], // Counter-trend leverage
      winRate: 0.53,
      dailyTargetPercent: 5.8,
      investedCapital: 8200,
      tradesPerDay: 75,
      minPositionSize: 880,
      maxPositionSize: 1520,
      minDuration: 30000, // 30 sec
      maxDuration: 150000, // 2.5 min
      maxConcurrentPositions: 2,
      openFrequency: 0.45,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.0,
      reviews: 387,
      copiers: 1124,
      minInvestment: 3500,
      return7d: 22.4,
      return30d: 94.8,
      return90d: 268.4,
      return1y: 892.5,
      winRate: 53.2,
      maxDD: -48.6,
      sharpeRatio: 1.5,
    },
    performanceData: generatePerformanceData(5.8, 30, 2.8),
  },

  // 10. Binance BNB Bollinger Bands Bot - MEDIUM RISK (Technical)
  {
    id: 'binance-bnb-bollinger',
    slug: 'binance-bnb-bollinger',
    name: 'Binance BNB Bollinger Bands Bot',
    icon: '/bots/BinanceBNBBollingerBandsBot.png',
    risk: 'medium',
    strategy: 'Technical indicator trading using Bollinger Bands with 6-10x leverage',
    description: 'Quantitative technical analysis framework centered on Bollinger Band volatility compression/expansion cycles. Deploys 6-10x leverage scaling with band width. Operates on BNB/CAKE/TRX Binance ecosystem tokens. Three concurrent positions enable portfolio diversification while maintaining focused exposure. Win rate 56% through high-confidence band touch entries. P&L distribution 1.8-8.5% creates natural equity variance for realistic compounding. Drawdown limit -25%. Daily yield 3.5%. Ideal for technically-oriented traders who respect statistical edges in volatility mean-reversion.',
    verified: true,
    trending: false,
    ageMonths: 15,
    tags: ['Technical Analysis', 'Medium Risk', 'Bollinger Bands', 'BSC', 'Binance'],
    config: {
      name: 'Binance BNB Bollinger',
      tradingPair: 'BNB/USDT',
      tradingPairs: ['BNB/USDT', 'CAKE/USDT', 'TRX/USDT'],
      leverages: [6, 7, 8, 10], // Technical leverage scaling
      winRate: 0.56,
      dailyTargetPercent: 3.5,
      investedCapital: 6200,
      tradesPerDay: 52,
      minPositionSize: 480,
      maxPositionSize: 860,
      minDuration: 150000, // 2.5 min
      maxDuration: 540000, // 9 min
      maxConcurrentPositions: 3,
      openFrequency: 0.35,
      allowedSides: 'BOTH',
    },
    stats: {
      rating: 4.3,
      reviews: 724,
      copiers: 2180,
      minInvestment: 1800,
      return7d: 14.8,
      return30d: 62.4,
      return90d: 184.2,
      return1y: 642.8,
      winRate: 56.1,
      maxDD: -25.4,
      sharpeRatio: 1.9,
    },
    performanceData: generatePerformanceData(3.5, 30, 1.1),
  },
];

/**
 * Generate REAL performance data from bot's trade history
 * Like analytics equity curve - only shows data from first trade onwards
 * @param botId - Bot ID to get trades from
 * @param maxPoints - Max number of points to generate (default 30)
 */
export function generateRealPerformanceData(botId: string, maxPoints: number = 30): number[] {
  if (typeof window === 'undefined') {
    // SSR fallback
    return generatePerformanceData(1.0, maxPoints, 0.3);
  }

  try {
    const { botManager } = require('./BotManager');
    const bot = botManager.getBot(botId);

    if (!bot) {
      console.warn(`[PerformanceData] Bot ${botId} not found, using mock data`);
      return generatePerformanceData(1.0, maxPoints, 0.3);
    }

    const stats = bot.getStats();
    const config = bot.getConfig();
    const trades = stats.trades;

    if (trades.length === 0) {
      // No trades yet, return starting point
      return [0];
    }

    // Sort trades by closedAt (oldest first)
    const sortedTrades = [...trades].sort((a, b) =>
      new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime()
    );

    // Get first trade timestamp
    const firstTradeTime = new Date(sortedTrades[0].closedAt).getTime();
    const lastTradeTime = new Date(sortedTrades[sortedTrades.length - 1].closedAt).getTime();
    const now = Date.now();

    // Calculate time span (from first trade to now)
    const totalSpan = now - firstTradeTime;
    const pointInterval = totalSpan / maxPoints;

    // Generate points at regular intervals
    const dataPoints: number[] = [];
    let cumulativePnL = 0;
    let tradeIndex = 0;

    // Start from 0 (before first trade)
    dataPoints.push(0);

    for (let i = 1; i < maxPoints; i++) {
      const pointTime = firstTradeTime + (i * pointInterval);

      // Add all trades that happened before this point
      while (tradeIndex < sortedTrades.length &&
             new Date(sortedTrades[tradeIndex].closedAt).getTime() <= pointTime) {
        const tradePnL = sortedTrades[tradeIndex].pnl;
        cumulativePnL += isFinite(tradePnL) && !isNaN(tradePnL) ? tradePnL : 0;
        tradeIndex++;
      }

      // Convert to percentage of invested capital
      const percentReturn = config.investedCapital > 0
        ? (cumulativePnL / config.investedCapital) * 100
        : 0;

      dataPoints.push(isFinite(percentReturn) && !isNaN(percentReturn) ? percentReturn : 0);
    }

    // Add final point with all trades
    while (tradeIndex < sortedTrades.length) {
      const tradePnL = sortedTrades[tradeIndex].pnl;
      cumulativePnL += isFinite(tradePnL) && !isNaN(tradePnL) ? tradePnL : 0;
      tradeIndex++;
    }
    const finalPercent = config.investedCapital > 0
      ? (cumulativePnL / config.investedCapital) * 100
      : 0;
    dataPoints.push(isFinite(finalPercent) && !isNaN(finalPercent) ? finalPercent : 0);

    return dataPoints;
  } catch (error) {
    console.error('[PerformanceData] Error generating real data:', error);
    return generatePerformanceData(1.0, maxPoints, 0.3);
  }
}

/**
 * Generate simulated performance data for charts (fallback)
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
 * Get all demo bots with real performance data when available
 */
export function getAllDemoBots(): DemoBot[] {
  if (typeof window === 'undefined') {
    // SSR - return as is
    return DEMO_BOTS;
  }

  try {
    const { botManager } = require('./BotManager');

    // Map bots and try to get real performance data
    return DEMO_BOTS.map(demoBot => {
      const masterBot = botManager.getBot(demoBot.id);

      if (!masterBot) {
        // Bot not running, use mock data
        return demoBot;
      }

      // Bot is running, get real stats and performance data
      const realStats = masterBot.getStats();
      const realConfig = masterBot.getConfig();
      const realPerformanceData = generateRealPerformanceData(demoBot.id, 30);

      // Calculate real returns from performance data
      const return30d = realPerformanceData.length > 0
        ? realPerformanceData[realPerformanceData.length - 1]
        : demoBot.stats.return30d;

      return {
        ...demoBot,
        performanceData: realPerformanceData,
        stats: {
          ...demoBot.stats,
          return30d: isFinite(return30d) ? return30d : demoBot.stats.return30d,
          winRate: realStats.winRate,
          copiers: demoBot.stats.copiers, // Keep mock copiers count
        },
      };
    });
  } catch (error) {
    console.error('[getAllDemoBots] Error loading real data:', error);
    return DEMO_BOTS;
  }
}
