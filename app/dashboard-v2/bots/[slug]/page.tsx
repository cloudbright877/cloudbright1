'use client';

import { useState, useEffect, useMemo, use } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Target,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Calendar,
  Layers,
  Trophy,
  Medal,
  MessageSquare,
  PieChart,
  Award,
  Flame,
  Zap,
  Brain,
  AlertTriangle,
  Clock,
  Globe,
  Star,
  BarChart,
  TrendingUpIcon,
  Hash,
  Eye,
  BookOpen,
  Rocket,
  CloudSun,
  ArrowRight,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { TokenIcon } from '@token-icons/react';
import { getDemoBotBySlug } from '@/lib/demoMarketplace';
import type { DemoBot } from '@/lib/demoMarketplace';
import { CopyBotModal } from '@/components/dashboard-v2/CopyBotModal';
import { botsApi } from '@/lib/api/botsApi';
import type { BotConfig } from '@/lib/trading/types';
import type {
  MasterBotData,
  BotStats,
  OpenPosition,
  Trade as ApiTrade,
  EquityPoint,
} from '@/types/api';

// Dynamic import of ApexCharts with ssr disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Type definitions (local for gamification features)
interface Trade {
  pair: string;
  entry: number;
  exit: number;
  profit: number;
  roi: number;
  date: string;
}

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

// Live ticker data
const tickerData = [
  { icon: Flame, label: '+234 new copiers', value: 'in last 24h', color: 'text-green-400' },
  { icon: Zap, label: '1,247 active traders', value: 'copying now', color: 'text-accent-400' },
  { icon: TrendingUp, label: '+284.5% ROI', value: 'all-time', color: 'text-green-400' },
  { icon: Trophy, label: '#3 Global Rank', value: '', color: 'text-yellow-400' },
  { icon: DollarSign, label: '$84,562', value: 'total PnL', color: 'text-green-400' },
  { icon: Star, label: '4.8/5', value: 'from 237 reviews', color: 'text-yellow-400' },
  { icon: Target, label: '87.3% win rate', value: '', color: 'text-accent-400' },
  { icon: Rocket, label: '99.8% uptime', value: '', color: 'text-purple-400' },
];

// Top winning trades data
const topWinsData: Trade[] = [
  { pair: 'BTC/USDT', entry: 48234.50, exit: 51456.20, profit: 2845.67, roi: 5.9, date: '2024-01-15' },
  { pair: 'ETH/USDT', entry: 2634.20, exit: 2891.30, profit: 2234.89, roi: 4.8, date: '2024-01-18' },
  { pair: 'SOL/USDT', entry: 94.45, exit: 102.75, profit: 1876.43, roi: 4.2, date: '2024-01-20' },
  { pair: 'BTC/USDT', entry: 49123.00, exit: 52456.50, profit: 1654.32, roi: 3.8, date: '2024-01-22' },
  { pair: 'ETH/USDT', entry: 2712.10, exit: 2987.40, profit: 1543.21, roi: 3.5, date: '2024-01-24' },
];

// Top losing trades data
const topLossesData: Trade[] = [
  { pair: 'DOGE/USDT', entry: 0.0891, exit: 0.0845, profit: -234.56, roi: -2.6, date: '2024-01-12' },
  { pair: 'XRP/USDT', entry: 0.6234, exit: 0.6051, profit: -189.23, roi: -1.9, date: '2024-01-16' },
  { pair: 'ADA/USDT', entry: 0.5423, exit: 0.5312, profit: -145.67, roi: -1.3, date: '2024-01-19' },
  { pair: 'MATIC/USDT', entry: 0.8934, exit: 0.8712, profit: -112.34, roi: -1.1, date: '2024-01-21' },
  { pair: 'DOGE/USDT', entry: 0.0876, exit: 0.0854, profit: -98.45, roi: -0.9, date: '2024-01-23' },
];

// Reviews data
const reviewsData: Review[] = [
  { name: 'John D.', rating: 5, text: 'Amazing bot! Consistent profits every day. Highly recommend for serious traders.', date: '2 days ago', verified: true },
  { name: 'Sarah M.', rating: 5, text: 'Been copying for 3 months now. Up 42% total. Best decision I made!', date: '5 days ago', verified: true },
  { name: 'Mike R.', rating: 4, text: 'Very good performance. Had a few losing days but overall very profitable.', date: '1 week ago', verified: false },
  { name: 'Lisa K.', rating: 5, text: 'Love the transparency and consistent results. Customer service is excellent too.', date: '1 week ago', verified: true },
  { name: 'Tom H.', rating: 5, text: 'Started with $5k, now at $7.2k after 2 months. Incredible!', date: '2 weeks ago', verified: true },
];

// Bot data structure
interface Bot {
  id: number;
  slug: string;
  name: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
  strategy: string;
  description: string;
  stats: {
    return7d: number;
    return30d: number;
    return90d: number;
    return1y: number;
    winRate: number;
    maxDD: number;
    sharpeRatio: number;
    copiers: number;
    rating: number;
    reviews: number;
    minInvestment: number;
  };
  tags: string[];
  trending: boolean;
  verified: boolean;
  ageMonths: number;
}

const mockBots: Bot[] = [
  {
    id: 1,
    slug: 'alphabot',
    name: 'AlphaBot Pro',
    icon: 'AB',
    risk: 'low',
    strategy: 'Scalping',
    description: 'Consistent low-risk profits with AI-powered scalping',
    stats: {
      return7d: 2.8,
      return30d: 12.3,
      return90d: 38.7,
      return1y: 187.5,
      winRate: 87,
      maxDD: -4.2,
      sharpeRatio: 2.8,
      copiers: 1247,
      rating: 4.9,
      reviews: 234,
      minInvestment: 500,
    },
    tags: ['BTC', 'ETH', 'Scalping', 'AI'],
    trending: true,
    verified: true,
    ageMonths: 18,
  },
  {
    id: 2,
    slug: 'protrader',
    name: 'ProTrader Elite',
    icon: 'PT',
    risk: 'medium',
    strategy: 'Swing Trading',
    description: 'Balanced growth with momentum strategies',
    stats: {
      return7d: 4.2,
      return30d: 18.7,
      return90d: 52.3,
      return1y: 234.8,
      winRate: 82,
      maxDD: -8.5,
      sharpeRatio: 2.3,
      copiers: 892,
      rating: 4.7,
      reviews: 187,
      minInvestment: 1000,
    },
    tags: ['ETH', 'Swing', 'Momentum'],
    trending: false,
    verified: true,
    ageMonths: 14,
  },
  {
    id: 3,
    slug: 'sigmabot',
    name: 'SigmaBot',
    icon: 'Σ',
    risk: 'high',
    strategy: 'Aggressive',
    description: 'Aggressive returns for risk-takers',
    stats: {
      return7d: 8.4,
      return30d: 28.4,
      return90d: 87.2,
      return1y: 412.5,
      winRate: 76,
      maxDD: -15.3,
      sharpeRatio: 1.8,
      copiers: 543,
      rating: 4.5,
      reviews: 145,
      minInvestment: 2500,
    },
    tags: ['Multi-asset', 'Aggressive', 'Volatility'],
    trending: false,
    verified: true,
    ageMonths: 10,
  },
  {
    id: 4,
    slug: 'momentumx',
    name: 'MomentumX',
    icon: 'MX',
    risk: 'high',
    strategy: 'Momentum',
    description: 'Captures market momentum swings',
    stats: {
      return7d: 9.2,
      return30d: 35.2,
      return90d: 94.8,
      return1y: 485.3,
      winRate: 72,
      maxDD: -18.9,
      sharpeRatio: 1.6,
      copiers: 234,
      rating: 4.3,
      reviews: 98,
      minInvestment: 5000,
    },
    tags: ['Momentum', 'High-frequency', 'New'],
    trending: true,
    verified: false,
    ageMonths: 4,
  },
  {
    id: 5,
    slug: 'gridbot',
    name: 'GridBot',
    icon: 'GB',
    risk: 'low',
    strategy: 'Grid Trading',
    description: 'Profits from ranging markets',
    stats: {
      return7d: 1.8,
      return30d: 7.8,
      return90d: 24.2,
      return1y: 98.7,
      winRate: 89,
      maxDD: -2.1,
      sharpeRatio: 3.2,
      copiers: 678,
      rating: 4.8,
      reviews: 203,
      minInvestment: 500,
    },
    tags: ['Range-trading', 'Sideways', 'Conservative'],
    trending: false,
    verified: true,
    ageMonths: 22,
  },
  {
    id: 6,
    slug: 'thetagang',
    name: 'ThetaGang',
    icon: 'Θ',
    risk: 'medium',
    strategy: 'Options',
    description: 'Options strategies for steady income',
    stats: {
      return7d: 3.2,
      return30d: 14.2,
      return90d: 42.8,
      return1y: 178.4,
      winRate: 84,
      maxDD: -6.7,
      sharpeRatio: 2.5,
      copiers: 445,
      rating: 4.6,
      reviews: 156,
      minInvestment: 3000,
    },
    tags: ['Options', 'Theta decay', 'Income'],
    trending: false,
    verified: true,
    ageMonths: 16,
  },
  {
    id: 7,
    slug: 'dca-master',
    name: 'DCA Master',
    icon: 'DC',
    risk: 'low',
    strategy: 'DCA',
    description: 'Dollar-cost averaging for long-term growth',
    stats: {
      return7d: 1.2,
      return30d: 5.4,
      return90d: 18.7,
      return1y: 84.2,
      winRate: 92,
      maxDD: -1.5,
      sharpeRatio: 3.5,
      copiers: 1024,
      rating: 4.9,
      reviews: 287,
      minInvestment: 100,
    },
    tags: ['DCA', 'Long-term', 'Beginner-friendly'],
    trending: false,
    verified: true,
    ageMonths: 28,
  },
  {
    id: 8,
    slug: 'arbitrage-pro',
    name: 'Arbitrage Pro',
    icon: 'AR',
    risk: 'low',
    strategy: 'Arbitrage',
    description: 'Risk-free profits from price differences',
    stats: {
      return7d: 2.1,
      return30d: 9.2,
      return90d: 28.4,
      return1y: 118.7,
      winRate: 94,
      maxDD: -0.8,
      sharpeRatio: 4.1,
      copiers: 856,
      rating: 4.8,
      reviews: 198,
      minInvestment: 2000,
    },
    tags: ['Arbitrage', 'CEX-DEX', 'Low-risk'],
    trending: true,
    verified: true,
    ageMonths: 12,
  },
];

// Terminal logs
const terminalLogs = [
  '[SYSTEM] AlphaBot v3.2.1 initialized',
  '[INFO] Connected to 8 exchanges (Binance, OKX, Bybit, Coinbase, Kraken, KuCoin, Gate.io, Huobi)',
  '[INFO] Neural network model loaded: accuracy 94.3%',
  '[INFO] Risk parameters: max drawdown 8%, position size 3.5%',
  '[TRADE] 🟢 BUY 0.05 BTC/USDT @ $51,234.50 | Binance',
  '[INFO] Order filled in 12ms | Slippage: 0.02%',
  '[ML] Prediction confidence: 87.4% BULLISH',
  '[TRADE] 🟢 SELL 0.05 BTC/USDT @ $51,456.20 | Binance',
  '[INFO] Profit: +$11.09 (+0.04%) | Total: $51,456.20',
  '[ARBITRAGE] Opportunity detected: BTC/USDT (Binance↔Bybit) | Spread: 0.18%',
  '[TRADE] 🟡 BUY 1.2 ETH/USDT @ $2,834.15 | OKX',
  '[SYSTEM] Portfolio rebalancing: 45% BTC, 30% ETH, 15% SOL, 10% stables',
  '[WARNING] High volatility detected on BTC/USDT | IV: 78.3%',
  '[RISK] Greeks updated: Delta +0.65, Gamma +0.12, Theta -0.08',
  '[TRADE] 🔴 STOP-LOSS triggered: SOL/USDT @ $102.34 | Loss: -$8.45',
  '[INFO] Risk management: portfolio exposure reduced to 85%',
  '[ML] Feature importance updated: Volume(32%), RSI(24%), MA(18%)',
  '[TRADE] 🟢 BUY 50 SOL/USDT @ $101.89 | Bybit',
  '[ARBITRAGE] Executed triangular arb: BTC→ETH→USDT | Profit: +$23.67',
  '[INFO] Today\'s stats: 47 trades, 89.4% win rate, +$1,234.56 PnL',
  '[SYSTEM] Monte Carlo simulation complete: 95% VaR = $2,145.33',
  '[TRADE] 🟢 BUY 0.03 BTC/USDT @ $51,287.90 | Coinbase',
  '[INFO] Correlation matrix updated: BTC-ETH 0.87, BTC-SOL 0.72',
  '[ML] Neural network retrained on 10,000 new samples',
  '[TRADE] 🟢 SELL 1.2 ETH/USDT @ $2,867.45 | OKX | Profit: +$39.96',
  '[SYSTEM] System health: CPU 34%, RAM 2.1GB, Latency 8ms',
  '[INFO] Order book depth analyzed: bid liquidity $2.4M, ask $2.1M',
  '[TRADE] 🟡 Limit order placed: 0.1 BTC @ $50,800 | Kraken',
  '[WARNING] Exchange API rate limit: 85% capacity on Binance',
  '[INFO] Smart routing: order split across 3 exchanges for best price',
];

export default function CopyTradesPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params Promise in Next.js 14+ using React.use()
  const { slug } = use(params);

  // State management
  const [masterBotData, setMasterBotData] = useState<MasterBotData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('main');
  const [modalOpen, setModalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(23);
  const [memUsage, setMemUsage] = useState(30);
  const [apiLatency, setApiLatency] = useState(12);
  const [orderBook, setOrderBook] = useState<{ asks: any[], bids: any[] }>({ asks: [], bids: [] });
  const [equityPeriod, setEquityPeriod] = useState<'1D' | '7D' | '30D' | '90D' | 'ALL'>('ALL');

  // Convert DemoBot to MasterBotData format
  const convertDemoBotToMasterData = (demoBot: DemoBot): any => {
    const config = demoBot.config;

    // Fill missing config fields with defaults
    const completeConfig: BotConfig = {
      ...config,
      minDuration: config.minDuration || 30000,
      maxDuration: config.maxDuration || 300000,
      maxConcurrentPositions: config.maxConcurrentPositions || 5,
      openFrequency: config.openFrequency || 0.7,
      allowedSides: config.allowedSides || 'BOTH',
      maxSlippage: config.maxSlippage || 0.5,
      maxTradesHistory: config.maxTradesHistory || 100,
    };

    return {
      ...demoBot,
      config: completeConfig,
      totalCopiers: 0, // Will be overridden with real data
      aggregateProfit: 0, // Will be overridden with real data
      aggregateProfitPercent: 0,
      totalInvestedByAll: 0, // Will be overridden with real data
      rating: demoBot.stats.rating,
      reviews: demoBot.stats.reviews,
      activePositions: 0, // Will be overridden with real data
      maxPositions: completeConfig.maxConcurrentPositions,
      stats: {
        ...demoBot.stats, // Preserve original stats for UI display
        winRate: 0, // Will be overridden with real data
        totalTrades: 0, // Will be overridden with real data
        winningTrades: 0, // Will be overridden with real data
        losingTrades: 0, // Will be overridden with real data
        profitFactor: 0, // Will be overridden with real data
        sharpeRatio: demoBot.stats.sharpeRatio || 2.5,
        maxDrawdown: Math.abs(demoBot.stats.maxDD || 0),
        averageWin: 0, // Will be overridden with real data
        averageLoss: 0, // Will be overridden with real data
        bestTrade: 0, // Will be overridden with real data
        totalVolume: 0, // Will be overridden with real data
      },
      openPositions: [],
      recentTrades: [],
    };
  };

  // Load Master Bot Data on mount
  useEffect(() => {
    const fetchBotData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[DemoBot] Fetching bot data for slug:', slug);

        // Initialize master bots
        await botsApi.initializeMasterBots();

        const demoBot = getDemoBotBySlug(slug);

        if (!demoBot) {
          setError(`Bot "${slug}" not found`);
          console.error('[DemoBot] Bot not found:', slug);
          return;
        }

        // Get aggregated stats from botsApi
        const aggStats = await botsApi.getMasterBotStats(demoBot.id);

        const masterData = convertDemoBotToMasterData(demoBot);

        // Override with real data from botsApi
        masterData.totalCopiers = aggStats.totalCopiers;
        masterData.totalInvestedByAll = aggStats.totalInvested;
        masterData.aggregateProfit = aggStats.masterBotStats.totalPnL;
        masterData.openPositions = aggStats.masterBotStats.positions || [];
        masterData.recentTrades = aggStats.masterBotStats.trades || [];

        // Replace mocked stats with real data
        masterData.activePositions = aggStats.masterBotStats.positions.length;
        masterData.stats.winRate = aggStats.masterBotStats.winRate;
        masterData.stats.winningTrades = aggStats.masterBotStats.winsCount;
        masterData.stats.losingTrades = aggStats.masterBotStats.lossesCount;
        masterData.stats.totalTrades = aggStats.masterBotStats.tradesCount;
        masterData.stats.averageWin = aggStats.masterBotStats.avgWin;
        masterData.stats.averageLoss = aggStats.masterBotStats.avgLoss;

        // Calculate profit factor from real data
        const totalWins = aggStats.masterBotStats.avgWin * aggStats.masterBotStats.winsCount;
        const totalLosses = Math.abs(aggStats.masterBotStats.avgLoss) * aggStats.masterBotStats.lossesCount;
        masterData.stats.profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

        // Find best trade from real trades
        const trades = aggStats.masterBotStats.trades || [];
        masterData.stats.bestTrade = trades.length > 0
          ? Math.max(...trades.map(t => t.pnl))
          : 0;

        // Calculate total volume from real trades
        masterData.stats.totalVolume = trades.reduce((sum, t) => sum + (t.positionSize || 0), 0);

        setMasterBotData(masterData);
        console.log('[DemoBot] Successfully loaded bot:', demoBot.name);
        console.log('[DemoBot] Real copiers:', aggStats.totalCopiers, 'Total invested:', aggStats.totalInvested);
      } catch (err) {
        console.error('[DemoBot] Failed to fetch bot data:', err);
        setError('Failed to load bot data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBotData();
  }, [slug]);

  // Update stats in real-time
  useEffect(() => {
    if (!masterBotData) return; // Wait for initial data

    const updateInterval = setInterval(async () => {
      try {
        const demoBot = getDemoBotBySlug(slug);
        if (!demoBot) {
          console.warn('[DemoBot] Real-time: Bot not found');
          return;
        }

        // Get fresh aggregated stats
        const aggStats = await botsApi.getMasterBotStats(demoBot.id);
        console.log('[DemoBot] Real-time update:', {
          totalCopiers: aggStats.totalCopiers,
          totalInvested: aggStats.totalInvested,
          totalPnL: aggStats.masterBotStats.totalPnL,
          tradesCount: aggStats.masterBotStats.tradesCount,
          positionsCount: aggStats.masterBotStats.positions.length,
        });

        // Update masterBotData with fresh data
        setMasterBotData(prev => {
          if (!prev) return prev;

          // Calculate real-time stats
          const trades = aggStats.masterBotStats.trades || [];
          const totalWins = aggStats.masterBotStats.avgWin * aggStats.masterBotStats.winsCount;
          const totalLosses = Math.abs(aggStats.masterBotStats.avgLoss) * aggStats.masterBotStats.lossesCount;
          const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;
          const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
          const totalVolume = trades.reduce((sum, t) => sum + (t.positionSize || 0), 0);

          // Convert Position[] to OpenPosition[] (convert openedAt from number to string)
          const openPositions: OpenPosition[] = (aggStats.masterBotStats.positions || []).map(pos => ({
            ...pos,
            openedAt: pos.duration, // Use duration as openedAt string (already formatted)
          }));

          // Convert Trade[] to add botName field
          const recentTrades = trades.map(t => ({
            ...t,
            botName: aggStats.masterBotStats.name,
          }));

          return {
            ...prev,
            totalCopiers: aggStats.totalCopiers,
            totalInvestedByAll: aggStats.totalInvested,
            aggregateProfit: aggStats.masterBotStats.totalPnL,
            activePositions: aggStats.masterBotStats.positions.length,
            openPositions,
            recentTrades,
            stats: {
              ...prev.stats,
              winRate: aggStats.masterBotStats.winRate,
              totalTrades: aggStats.masterBotStats.tradesCount,
              winningTrades: aggStats.masterBotStats.winsCount,
              losingTrades: aggStats.masterBotStats.lossesCount,
              averageWin: aggStats.masterBotStats.avgWin,
              averageLoss: aggStats.masterBotStats.avgLoss,
              profitFactor,
              bestTrade,
              totalVolume,
              avgTradeSize: aggStats.masterBotStats.positions.length > 0
                ? aggStats.masterBotStats.positions.reduce((sum, p) => sum + p.positionSize, 0) / aggStats.masterBotStats.positions.length
                : prev.stats.avgTradeSize,
            },
          };
        });
      } catch (err) {
        console.error('[DemoBot] Failed to update stats:', err);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(updateInterval);
  }, [slug, masterBotData]); // Depend on both slug and masterBotData

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const profit = Math.random() * 1000;
      let level = 0;
      if (profit > 200) level = 1;
      if (profit > 400) level = 2;
      if (profit > 600) level = 3;
      if (profit > 800) level = 4;
      days.push({ date: date.toLocaleDateString(), level, profit: profit.toFixed(2) });
    }
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, []);

  // Generate performance chart data
  const performanceData = useMemo(() => {
    const days = 30;
    const data = [];
    let cumulative = 0;
    for (let i = 0; i < days; i++) {
      cumulative += (Math.random() * 2000) + 1000;
      data.push(parseFloat(cumulative.toFixed(2)));
    }
    return data;
  }, []);

  // Build Equity Curve from real trades (Aggregate from all copiers)
  const equityCurveData = useMemo(() => {
    if (!masterBotData) return [];

    // Get all trades
    const allTrades = [...(masterBotData.recentTrades || [])];

    // Sort by closed time
    const sortedTrades = allTrades.sort((a, b) =>
      new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime()
    );

    // Filter by period
    const now = Date.now();
    let cutoffTime = 0;
    if (equityPeriod === '1D') cutoffTime = now - 1 * 24 * 60 * 60 * 1000;
    else if (equityPeriod === '7D') cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
    else if (equityPeriod === '30D') cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
    else if (equityPeriod === '90D') cutoffTime = now - 90 * 24 * 60 * 60 * 1000;

    const filteredTrades = equityPeriod === 'ALL'
      ? sortedTrades
      : sortedTrades.filter(t => new Date(t.closedAt).getTime() >= cutoffTime);

    // If no trades after filtering, return empty curve
    if (filteredTrades.length === 0) {
      return [];
    }

    // Build aggregate equity curve from ALL copiers' investments
    // Start with total invested by all copiers
    const totalInvested = masterBotData.totalInvestedByAll || 0;

    // Use minInvestment as a baseline (master bot capital not exposed in API)
    const baselineCapital = masterBotData.minInvestment || 1000;

    // Calculate scaling ratio (how much copiers invested vs baseline)
    const ratio = totalInvested / baselineCapital;

    let cumulative = totalInvested;

    // Start from first filtered trade (no empty space on left)
    const firstTradeTime = new Date(filteredTrades[0].closedAt).getTime();
    const curve: { timestamp: number; value: number }[] = [{
      timestamp: firstTradeTime - 60000, // 1 min before first trade
      value: totalInvested
    }];

    // Add points for each trade (scale master bot P&L to aggregate P&L)
    filteredTrades.forEach(trade => {
      // Scale master bot P&L to aggregate P&L from all copiers
      const aggregatePnL = trade.pnl * ratio;
      cumulative += aggregatePnL;
      curve.push({
        timestamp: new Date(trade.closedAt).getTime(),
        value: cumulative
      });
    });

    return curve;
  }, [masterBotData, equityPeriod]);

  // Terminal effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < terminalLogs.length) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setTerminalLines(prev => [...prev, `[${timestamp}] ${terminalLogs[index]}`]);
        index++;
      } else {
        setTerminalLines([]);
        index = 0;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // System health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 15);
      setMemUsage(Math.floor(Math.random() * 20) + 25);
      setApiLatency(Math.floor(Math.random() * 15) + 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Order book updates - very fast refresh
  useEffect(() => {
    const updateOrderBook = () => {
      const basePrice = 51234.50 + (Math.random() - 0.5) * 100; // Fluctuating base price
      const asks = Array.from({ length: 15 }, (_, i) => ({
        price: basePrice + (i + 1) * 10,
        size: (Math.random() * 2).toFixed(4),
        total: 0
      }));
      const bids = Array.from({ length: 15 }, (_, i) => ({
        price: basePrice - (i + 1) * 10,
        size: (Math.random() * 2).toFixed(4),
        total: 0
      }));
      setOrderBook({ asks: asks.reverse(), bids });
    };
    updateOrderBook();
    const interval = setInterval(updateOrderBook, 300); // Very fast updates - 300ms
    return () => clearInterval(interval);
  }, []);

  // Chart options with Celestian colors
  // Primary: #4F46E5, Accent: #06B6D4, Dark-700: #334155
  const performanceChartOptions = {
    series: [{ name: 'PnL', data: performanceData }],
    chart: { type: 'area' as const, height: 280, background: 'transparent', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 3, colors: ['#06B6D4'] },
    fill: {
      type: 'gradient' as const,
      gradient: {
        opacityFrom: 0.7,
        opacityTo: 0.1,
        colorStops: [
          { offset: 0, color: '#4F46E5', opacity: 0.7 },
          { offset: 50, color: '#06B6D4', opacity: 0.4 },
          { offset: 100, color: '#06B6D4', opacity: 0.1 }
        ]
      }
    },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => '$' + val.toLocaleString()
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const tradingHoursChartOptions = {
    series: [{ name: 'Profit', data: [12, 15, 18, 23, 28, 35, 42, 48, 52, 56, 58, 54, 48, 42, 38, 32, 28, 25, 22, 20, 18, 16, 14, 13] }],
    chart: { type: 'bar' as const, height: 250, background: 'transparent', toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
        colors: { ranges: [{ from: 0, to: 100, color: '#6B7FFF' }] }
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => i + ':00'),
      labels: { style: { colors: '#94a3b8', fontSize: '9px' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const dayOfWeekChartOptions = {
    series: [{ name: 'Avg Profit', data: [420, 380, 450, 520, 480, 290, 180] }],
    chart: { type: 'bar' as const, height: 250, background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true, distributed: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const },
    colors: ['#6B7FFF', '#4A90E2', '#8B5CF6', '#5865F2', '#6BA3FF', '#A78BFA', '#C4B5FD']
  };

  const copierLevelChartOptions = {
    series: [{ name: 'Copiers', data: [287, 512, 448] }],
    chart: { type: 'bar' as const, height: 250, background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true, distributed: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Beginner (< 3 months)', 'Intermediate (3-12 months)', 'Pro (12+ months)'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const },
    colors: ['#6366f1', '#4F46E5', '#06B6D4']
  };

  const pairDistributionChartOptions = {
    series: [40, 35, 15, 5, 3, 2],
    chart: { type: 'donut' as const, height: 280, background: 'transparent' },
    labels: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT', 'AVAX/USDT', 'Other'],
    colors: ['#4F46E5', '#06B6D4', '#6366f1', '#22d3ee', '#818cf8', '#67e8f9'],
    legend: { position: 'bottom' as const, labels: { colors: '#94a3b8' } },
    dataLabels: { enabled: true, style: { colors: ['#fff'] } },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: { show: true, label: 'Total Pairs', color: '#94a3b8' }
          }
        }
      }
    },
    tooltip: { theme: 'dark' as const }
  };

  const depthChartOptions = {
    series: [
      { name: 'Bids', data: Array.from({ length: 50 }, (_, i) => [51234.50 - i * 5, (i + 1) * 2]) },
      { name: 'Asks', data: Array.from({ length: 50 }, (_, i) => [51234.50 + i * 5, (i + 1) * 2]) }
    ],
    chart: { type: 'area' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' as const, width: 2 },
    colors: ['#10b981', '#ef4444'],
    fill: { type: 'gradient' as const, gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    xaxis: {
      type: 'numeric' as const,
      labels: { style: { colors: '#94a3b8', fontSize: '10px' }, formatter: (val: number) => val.toFixed(0) }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' }, formatter: (val: number) => val.toFixed(1) } },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const },
    legend: { show: true, position: 'top' as const, labels: { colors: '#94a3b8' } }
  };

  const waterfallChartOptions = {
    series: [{
      name: 'PnL',
      data: [
        { x: 'Starting Balance', y: 30000 },
        { x: 'Trading Profits', y: 54562 },
        { x: 'Fees', y: -1200 },
        { x: 'Slippage', y: -800 },
        { x: 'Net PnL', y: 52562 }
      ]
    }],
    chart: { type: 'bar' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        colors: {
          ranges: [
            { from: 0, to: 100000, color: '#10b981' },
            { from: -10000, to: 0, color: '#ef4444' }
          ]
        }
      }
    },
    dataLabels: { enabled: false },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => '$' + val.toLocaleString()
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const featureImportanceChartOptions = {
    series: [{
      data: [18, 15, 13, 11, 10, 9, 8, 7, 5, 4]
    }],
    chart: { type: 'bar' as const, height: 350, background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, distributed: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['RSI_14', 'MACD', 'Volume_24h', 'EMA_50', 'Bollinger_Width', 'ATR', 'Momentum', 'Volatility', 'Price_Change_1h', 'Order_Flow'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const },
    colors: ['#06B6D4', '#4F46E5', '#6366f1', '#22d3ee', '#f97316', '#eab308', '#84cc16', '#10b981', '#14b8a6', '#0ea5e9']
  };

  const predictionChartOptions = {
    series: [
      { name: 'Predicted', data: Array.from({ length: 30 }, () => parseFloat(((Math.random() * 4) - 1).toFixed(2))) },
      { name: 'Actual', data: Array.from({ length: 30 }, () => parseFloat(((Math.random() * 4) - 1).toFixed(2))) }
    ],
    chart: { type: 'line' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#06B6D4', '#10b981'],
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => val.toFixed(1) + '%'
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const },
    legend: { show: true, position: 'top' as const, labels: { colors: '#94a3b8' } }
  };

  const riskRewardScatterOptions = {
    series: [{
      name: 'Trades',
      data: Array.from({ length: 100 }, () => ({ x: (Math.random() * 5) + 0.5, y: (Math.random() * 10) - 2 }))
    }],
    chart: {
      type: 'scatter' as const,
      height: 300,
      background: 'transparent',
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.3,
        color: '#6B7FFF'
      }
    },
    xaxis: {
      title: { text: 'Risk (%)', style: { color: '#94a3b8', fontSize: '12px' } },
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    yaxis: {
      title: { text: 'Reward (%)', style: { color: '#94a3b8', fontSize: '12px' } },
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    colors: ['#6B7FFF'],
    markers: {
      colors: ['#6B7FFF'],
      size: 7,
      strokeColors: '#4A90E2',
      strokeWidth: 2,
      hover: {
        size: 9
      }
    },
    tooltip: { theme: 'dark' as const }
  };

  const monteCarloChartOptions = {
    series: Array.from({ length: 50 }, (_, i) => ({
      name: `Sim ${i + 1}`,
      data: Array.from({ length: 30 }, () => {
        let value = 100;
        for (let j = 0; j < 30; j++) {
          value *= (1 + (Math.random() * 0.04 - 0.01));
        }
        return parseFloat(value.toFixed(2));
      })
    })),
    chart: { type: 'line' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    stroke: { curve: 'smooth' as const, width: 1 },
    legend: { show: false },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => val.toFixed(0) + '%'
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const underwaterChartOptions = {
    series: [{
      name: 'Drawdown',
      data: Array.from({ length: 90 }, () => {
        const value = (Math.random() * 20) - 5;
        return parseFloat((Math.min(value, 0)).toFixed(2));
      })
    }],
    chart: { type: 'area' as const, height: 250, background: 'transparent', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2, colors: ['#ef4444'] },
    fill: {
      type: 'gradient' as const,
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
        colorStops: [
          { offset: 0, color: '#ef4444', opacity: 0.6 },
          { offset: 100, color: '#dc2626', opacity: 0.1 }
        ]
      }
    },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => val.toFixed(1) + '%'
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const tabs = [
    { id: 'main', icon: Target, label: 'MAIN' },
    { id: 'social', icon: Users, label: 'Social' },
    { id: 'performance', icon: TrendingUp, label: 'Performance' },
    { id: 'analytics', icon: Brain, label: 'Analytics' },
    { id: 'risk', icon: AlertTriangle, label: 'Risk' },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-primary-400 animate-spin" />
      </div>
    );
  }

  // Show error state
  if (error || !masterBotData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Bot Not Found</h1>
          <p className="text-dark-300 mb-8">{error || `The bot "${slug}" doesn't exist.`}</p>
          <Link
            href="/dashboard-v2/bots"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-xl hover:shadow-primary-500/50 transition-all inline-block"
          >
            Back to Bots
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-slate-200">
      {/* Live Ticker */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-dark-900/95 via-dark-800/85 to-dark-900/95 py-3 border-b border-dark-700/50">
        <div className="flex animate-[scroll_40s_linear_infinite]">
          {[...tickerData, ...tickerData].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex-none px-8 whitespace-nowrap flex items-center">
                <IconComponent className={`mr-2 w-4 h-4 ${item.color}`} />
                <span className={`font-mono font-semibold ${item.color}`}>{item.label}</span>
                {item.value && <span className="ml-1 text-slate-400 text-sm">{item.value}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-[2000px] mx-auto p-3">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 mb-3"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {masterBotData.icon.startsWith('/') ? (
                <img src={masterBotData.icon} alt={masterBotData.name} className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center text-2xl">
                  {masterBotData.icon}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-white">{masterBotData.name}</h1>
                  {masterBotData.verified && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      VERIFIED
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white">PRO</span>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white">ELITE</span>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-semibold font-mono">LIVE • 99.8% UPTIME</span>
                  </div>
                </div>
                <p className="text-slate-400 mb-2 max-w-3xl text-sm">
                  {masterBotData.description}
                </p>
                <div className="flex items-center gap-3 text-xs flex-wrap font-mono">
                  <div><span className="text-accent-400">API:</span> <span className="text-green-400">12ms</span></div>
                  <div><span className="text-accent-400">Execution:</span> <span className="text-green-400">8ms</span></div>
                  <div><span className="text-accent-400">Slippage:</span> <span className="text-green-400">0.03%</span></div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                    <span className="text-accent-400">{masterBotData.rating}</span>
                    <span className="text-slate-500">({masterBotData.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-accent-400" />
                    <span className="text-accent-400">{masterBotData.totalCopiers.toLocaleString()}</span>
                    <span className="text-slate-400">copiers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-accent-400" />
                    <span className="text-accent-400">#3</span>
                    <span className="text-slate-400">Global</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-accent-500 to-primary-600 hover:from-accent-600 hover:to-primary-700 shadow-lg hover:shadow-accent-500/50 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Copy This Bot
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl mb-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 border-b-3 transition-all font-semibold text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-accent-400 border-accent-500 bg-accent-500/10'
                      : 'text-slate-400 border-transparent hover:text-accent-400 hover:bg-accent-500/5'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab: MAIN - Real Performance Data */}
        <AnimatePresence mode="wait">
          {activeTab === 'main' && masterBotData && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Invested */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent-500/20 border border-accent-500/30 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent-400" />
                    </div>
                  </div>
                  <div className="text-sm text-dark-400 mb-1">Total Invested</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    ${masterBotData.totalInvestedByAll.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-dark-400">
                    By all copiers
                  </div>
                </div>

                {/* Aggregate P&L */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      +{masterBotData.aggregateProfitPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-sm text-dark-400 mb-1">Aggregate P&L</div>
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    +${masterBotData.aggregateProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-dark-400">
                    Total profit (all copiers)
                  </div>
                </div>

                {/* Win Rate */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                      {masterBotData.stats.totalTrades} trades
                    </div>
                  </div>
                  <div className="text-sm text-dark-400 mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {masterBotData.stats.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-dark-400">
                    {masterBotData.stats.winningTrades}W / {masterBotData.stats.losingTrades}L
                  </div>
                </div>

                {/* Active Positions */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                      <Layers className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                      Max {masterBotData.maxPositions}
                    </div>
                  </div>
                  <div className="text-sm text-dark-400 mb-1">Active Positions</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {masterBotData.activePositions} / {masterBotData.maxPositions}
                  </div>
                  <div className="text-xs text-dark-400">
                    Currently open
                  </div>
                </div>
              </div>

              {/* Equity Curve */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Aggregate Equity Curve</h2>
                      <p className="text-xs text-dark-400">Total portfolio value from all copiers</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(['1D', '7D', '30D', '90D', 'ALL'] as const).map(period => (
                      <button
                        key={period}
                        onClick={() => setEquityPeriod(period)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          equityPeriod === period
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <Chart
                  options={{
                    chart: {
                      type: 'area',
                      height: 300,
                      toolbar: { show: false },
                      background: 'transparent',
                      zoom: { enabled: false },
                    },
                    theme: { mode: 'dark' },
                    dataLabels: { enabled: false },
                    stroke: {
                      curve: 'smooth',
                      width: 3,
                      colors: ['#10B981'],
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.4,
                        opacityTo: 0.05,
                        stops: [0, 100],
                      },
                      colors: ['#10B981'],
                    },
                    grid: {
                      borderColor: '#1e293b',
                      strokeDashArray: 4,
                      xaxis: { lines: { show: false } },
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        style: { colors: '#64748b', fontSize: '12px' },
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: '#64748b', fontSize: '12px' },
                        formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
                      },
                    },
                    tooltip: {
                      theme: 'dark',
                      x: { format: 'dd MMM' },
                      y: {
                        formatter: (val: number) => `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                      },
                    },
                  }}
                  series={[
                    {
                      name: 'Portfolio Value',
                      data: equityCurveData.map(point => ({
                        x: point.timestamp,
                        y: point.value,
                      })),
                    },
                  ]}
                  type="area"
                  height={300}
                />
              </div>

              {/* Performance Statistics */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Performance Statistics</h2>
                    <p className="text-sm text-dark-400">Master bot trading metrics</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Total Trades</div>
                    <div className="text-xl font-bold text-white">{masterBotData.stats.totalTrades}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Profit Factor</div>
                    <div className="text-xl font-bold text-amber-400">{masterBotData.stats.profitFactor.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Avg Win</div>
                    <div className="text-xl font-bold text-green-400">+${masterBotData.stats.averageWin.toFixed(0)}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Avg Loss</div>
                    <div className="text-xl font-bold text-red-400">${masterBotData.stats.averageLoss.toFixed(0)}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Best Trade</div>
                    <div className="text-xl font-bold text-green-400">+${masterBotData.stats.bestTrade.toFixed(0)}</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                    <div className="text-xs text-dark-400 mb-1">Total Volume</div>
                    <div className="text-xl font-bold text-white">${(masterBotData.stats.totalVolume / 1000).toFixed(0)}k</div>
                  </div>
                </div>
              </div>

              {/* Open Positions (Live Grid) */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Open Positions (Live)</h2>
                      <p className="text-sm text-dark-400">{masterBotData.openPositions.length} active position{masterBotData.openPositions.length !== 1 ? 's' : ''} • Real-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    </div>
                    <span className="text-xs text-green-400 font-semibold">LIVE</span>
                  </div>
                </div>

                {masterBotData.openPositions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-dark-600" />
                    </div>
                    <p className="text-dark-400">No open positions</p>
                    <p className="text-xs text-dark-500 mt-1">Bot is analyzing markets...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {masterBotData.openPositions.map((position) => (
                      <div
                        key={position.id}
                        className="relative p-5 rounded-xl border border-dark-700 bg-dark-900/30 overflow-hidden hover:border-primary-500/50 transition-all"
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                              position.side === 'LONG'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {position.side} ×{position.leverage}
                            </div>
                            <span className="text-lg font-bold text-white">{position.pair}</span>
                            {/* SL/TP */}
                            <div className="flex items-center gap-2 ml-2">
                              <div className="px-2 py-1 bg-dark-800/50 border border-dark-700 rounded flex items-center gap-2">
                                <div className="text-[10px] text-dark-400">SL</div>
                                <div className="font-mono text-xs text-red-400 font-semibold">
                                  ${position.stopLoss.toFixed(0)}
                                </div>
                              </div>
                              <div className="px-2 py-1 bg-dark-800/50 border border-dark-700 rounded flex items-center gap-2">
                                <div className="text-[10px] text-dark-400">TP</div>
                                <div className="font-mono text-xs text-green-400 font-semibold">
                                  ${position.takeProfit.toFixed(0)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-dark-400">
                            <Clock className="w-4 h-4" />
                            {position.duration}
                          </div>
                        </div>

                        {/* Price Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <div className="text-xs text-dark-400 mb-1">Entry Price</div>
                            <div className="font-mono text-base text-white font-semibold">
                              ${position.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                              Current Price
                              {position.pnl >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                            </div>
                            <div className="font-mono text-base text-white font-semibold">
                              ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-400 mb-1">Position Size</div>
                            <div className="font-mono text-base text-white font-semibold">
                              ${position.positionSize.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-400 mb-1">Amount</div>
                            <div className="font-mono text-base text-white font-semibold">
                              {position.amount.toFixed(8)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-400 mb-1">P&L</div>
                            <div className={`font-mono text-base font-semibold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {position.pnl >= 0 ? '+' : ''}${Math.abs(position.pnl).toFixed(2)} <span className="text-xs opacity-70">({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Trades (Detailed Grid) */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-500/20 border border-accent-500/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Trade History</h2>
                      <p className="text-sm text-dark-400">{masterBotData.recentTrades.length} trades</p>
                    </div>
                  </div>
                </div>

                {masterBotData.recentTrades.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-dark-600" />
                    </div>
                    <p className="text-dark-400">No trades yet</p>
                    <p className="text-xs text-dark-500 mt-1">Trades will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {masterBotData.recentTrades.map((trade) => (
                      <div key={trade.id} className={`p-4 rounded-xl border ${
                        trade.pnl >= 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-white">{trade.pair}</span>
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${
                              trade.side === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {trade.side === 'LONG' ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownRight className="w-3 h-3 inline mr-1" />}
                              {trade.side}×{trade.leverage}
                            </div>
                          </div>
                          <div className="text-xs text-dark-400">
                            {new Date(trade.closedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <div className="text-xs text-dark-500 mb-1">P&L</div>
                            <div className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)} ({trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-500 mb-1">Position Size</div>
                            <div className="text-sm text-dark-300 font-mono">${trade.positionSize.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-500 mb-1">Duration</div>
                            <div className="text-sm text-dark-300">{trade.duration}</div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-500 mb-1">Entry → Exit</div>
                            <div className="text-xs text-dark-300 font-mono">${trade.entryPrice.toFixed(2)} → ${trade.exitPrice.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: Social - Charts & Advanced Grids */}
          {activeTab === 'social' && masterBotData && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Section: Copiers Growth Chart (8 cols) + Stats Cards (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Copiers Growth Chart */}
                <div className="lg:col-span-8">
                  <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Copiers Growth</h2>
                          <p className="text-xs text-dark-400">Total copiers over time (30 days)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">+18.7%</div>
                        <div className="text-xs text-dark-400">vs last month</div>
                      </div>
                    </div>
                    <Chart
                      options={{
                        chart: {
                          type: 'area',
                          height: 270,
                          toolbar: { show: false },
                          background: 'transparent',
                          zoom: { enabled: false },
                          sparkline: { enabled: false },
                        },
                        theme: { mode: 'dark' },
                        dataLabels: { enabled: false },
                        stroke: {
                          curve: 'smooth',
                          width: 2,
                          colors: ['#6B7FFF'],
                        },
                        fill: {
                          type: 'gradient',
                          gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.25,
                            opacityTo: 0.0,
                            stops: [0, 100],
                          },
                          colors: ['#6B7FFF'],
                        },
                        grid: {
                          show: false,
                        },
                        xaxis: {
                          categories: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
                          labels: {
                            style: { colors: '#475569', fontSize: '11px' },
                          },
                          axisBorder: { show: false },
                          axisTicks: { show: false },
                        },
                        yaxis: {
                          show: false,
                        },
                        tooltip: {
                          theme: 'dark',
                          x: { show: true },
                          y: {
                            formatter: (val: number) => val.toLocaleString() + ' copiers',
                          },
                          style: {
                            fontSize: '12px',
                          },
                        },
                        markers: {
                          size: 0,
                          hover: {
                            size: 5,
                            sizeOffset: 3,
                          },
                        },
                      }}
                      series={[
                        {
                          name: 'Total Copiers',
                          data: [950, 1015, 1078, 1124, 1165, 1205, 1247],
                        },
                      ]}
                      type="area"
                      height={270}
                    />
                  </div>
                </div>

                {/* Right: Stats Cards */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {/* Avg Investment */}
                  <div className="flex-1 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-green-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <div className="text-xs text-dark-400 mb-1">Avg Investment</div>
                          <div className="text-2xl font-bold text-white">
                            ${(masterBotData.totalInvestedByAll / masterBotData.totalCopiers).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-dark-400">Total AUM</div>
                        <div className="text-base font-semibold text-green-400">${(masterBotData.totalInvestedByAll / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  </div>

                  {/* New Copiers 24h */}
                  <div className="flex-1 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-blue-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs text-dark-400 mb-1">New (24h)</div>
                          <div className="text-2xl font-bold text-white">+234</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-400">Record</div>
                        <div className="text-xs text-dark-400 mt-0.5">All-time high</div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex-1 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-yellow-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-xs text-dark-400 mb-1">Rating</div>
                          <div className="text-2xl font-bold text-white">{masterBotData.rating}/5.0</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-yellow-400">{masterBotData.reviews}</div>
                        <div className="text-xs text-dark-400 mt-0.5">reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section: Geography Chart + Trading Pairs Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geography Donut Chart */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Copier Geography</h2>
                      <p className="text-xs text-dark-400">Distribution by country</p>
                    </div>
                  </div>
                  <Chart
                    options={{
                      chart: {
                        type: 'donut',
                        background: 'transparent',
                        dropShadow: {
                          enabled: false,
                        },
                      },
                      theme: { mode: 'dark' },
                      labels: ['🇺🇸 USA', '🇬🇧 UK', '🇩🇪 Germany', '🇯🇵 Japan', '🇸🇬 Singapore'],
                      colors: ['#6B7FFF', '#4A90E2', '#8B5CF6', '#5865F2', '#6BA3FF'],
                      legend: {
                        show: false,
                      },
                      dataLabels: {
                        enabled: true,
                        style: {
                          fontSize: '12px',
                          fontWeight: '600',
                          colors: ['#fff'],
                        },
                        dropShadow: {
                          enabled: false,
                        },
                      },
                      plotOptions: {
                        pie: {
                          expandOnClick: false,
                          donut: {
                            size: '65%',
                            labels: {
                              show: true,
                              name: {
                                show: true,
                                fontSize: '14px',
                                color: '#94a3b8',
                              },
                              value: {
                                show: true,
                                fontSize: '24px',
                                color: '#fff',
                                fontWeight: 'bold',
                                formatter: () => masterBotData.totalCopiers.toLocaleString(),
                              },
                              total: {
                                show: true,
                                label: 'Total Copiers',
                                fontSize: '11px',
                                color: '#64748b',
                                formatter: () => masterBotData.totalCopiers.toLocaleString(),
                              },
                            },
                          },
                        },
                      },
                      states: {
                        hover: {
                          filter: {
                            type: 'lighten',
                          },
                        },
                        active: {
                          filter: {
                            type: 'none',
                          },
                        },
                      },
                      stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent'],
                      },
                      tooltip: {
                        theme: 'dark',
                        y: {
                          formatter: (val: number) => `${val}%`,
                        },
                      },
                    }}
                    series={[27.4, 17.5, 15.0, 12.5, 9.9]}
                    type="donut"
                    height={300}
                  />
                </div>

                {/* Trading Pairs Distribution */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Trading Pairs</h2>
                      <p className="text-xs text-dark-400">Volume distribution (30d)</p>
                    </div>
                  </div>

                  {/* Trading Pairs Bar Chart */}
                  <div className="space-y-4">
                    {[
                      { name: 'BTC/USDT', volume: 45.2, color: '#6B7FFF' },
                      { name: 'ETH/USDT', volume: 32.8, color: '#4A90E2' },
                      { name: 'SOL/USDT', volume: 24.6, color: '#8B5CF6' },
                      { name: 'BNB/USDT', volume: 18.4, color: '#5865F2' },
                      { name: 'Others', volume: 12.7, color: '#6BA3FF' },
                    ].map((pair) => (
                      <div key={pair.name} className="flex items-center gap-3">
                        {/* Pair Name */}
                        <div className="w-24 flex-shrink-0">
                          <span className="text-sm font-semibold text-white">{pair.name}</span>
                        </div>

                        {/* Horizontal Bar */}
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1 h-10 bg-dark-800 rounded-lg overflow-hidden relative">
                            <div
                              className="h-full rounded-lg transition-all duration-500"
                              style={{
                                width: `${(pair.volume / 45.2) * 100}%`,
                                background: `linear-gradient(90deg, ${pair.color}dd, ${pair.color}88)`,
                              }}
                            />
                          </div>

                          {/* Volume Label */}
                          <div className="w-16 text-right">
                            <span className="text-sm font-bold text-white">${pair.volume}M</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Leaderboard + Top Copiers + Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Global Leaderboard */}
                <div className="lg:col-span-4 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                      <p className="text-xs text-dark-400">Global ranking</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                    <div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">#3</div>
                      <div className="text-sm text-dark-400 mt-1">Out of 1,284 bots</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-dark-400">Change</div>
                      <div className="text-3xl font-bold text-green-400">↑ 2</div>
                      <div className="text-xs text-dark-500">This week</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'TurboTrader AI', roi: '+312%', highlight: false },
                      { rank: 2, name: 'QuantumBot Pro', roi: '+298%', highlight: false },
                      { rank: 3, name: masterBotData.name, roi: '+284%', highlight: true },
                      { rank: 4, name: 'MegaProfit', roi: '+271%', highlight: false },
                      { rank: 5, name: 'AlphaGrid X', roi: '+265%', highlight: false },
                    ].map((leaderBot, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between py-2 px-3 rounded-lg transition-all ${
                          leaderBot.highlight
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-500'
                            : 'hover:bg-dark-800/50'
                        }`}
                      >
                        <span className={leaderBot.highlight ? 'text-white font-semibold' : 'text-slate-400'}>
                          #{leaderBot.rank} {leaderBot.name}
                        </span>
                        <span className={leaderBot.highlight ? 'text-yellow-400 font-semibold font-mono' : 'text-slate-500 font-mono'}>
                          {leaderBot.roi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Copiers */}
                <div className="lg:col-span-4 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <Medal className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Top Copiers</h2>
                      <p className="text-xs text-dark-400">Best performers</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: 'Mike_Trader', profit: '+$12,345', roi: '+247%', gradient: 'from-yellow-500 to-orange-500' },
                      { rank: 2, name: 'Sarah_K', profit: '+$9,876', roi: '+198%', gradient: 'from-gray-400 to-gray-500' },
                      { rank: 3, name: 'John_Crypto', profit: '+$8,234', roi: '+164%', gradient: 'from-amber-600 to-amber-700' },
                      { rank: 4, name: 'Emma_Invest', profit: '+$7,123', roi: '+142%', gradient: 'from-slate-500 to-slate-600' },
                      { rank: 5, name: 'Alex_Pro', profit: '+$6,789', roi: '+135%', gradient: 'from-slate-600 to-slate-700' },
                    ].map((copier, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-dark-800/50 rounded-lg p-3 hover:bg-dark-800/70 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${copier.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                            {copier.rank}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{copier.name}</div>
                            <div className="text-xs text-dark-400">{copier.roi} ROI</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-400 font-mono">{copier.profit}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Reviews */}
                <div className="lg:col-span-4 bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Reviews</h2>
                      <p className="text-xs text-dark-400">{masterBotData.reviews} total</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reviewsData.slice(0, 3).map((review, idx) => (
                      <div key={idx} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 hover:border-pink-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-semibold text-sm">
                              {review.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-white text-sm">{review.name}</span>
                                {review.verified && (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">✓</span>
                                )}
                              </div>
                              <div className="text-xs text-dark-500">{review.date}</div>
                            </div>
                          </div>
                          <div className="text-yellow-400 text-xs">
                            {'★'.repeat(review.rating)}
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm line-clamp-2">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Performance */}
          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* Heatmap & Terminal Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Activity Heatmap */}
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Activity Heatmap</h2>
                      <p className="text-xs text-dark-400">Last 90 days trading activity</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto flex-1 flex items-center justify-center">
                    <div className="flex gap-2">
                      {heatmapData.map((week, widx) => (
                        <div key={widx} className="flex flex-col gap-2">
                          {week.map((day, didx) => (
                            <div
                              key={didx}
                              className={`w-8 h-8 rounded-md cursor-pointer transition-all hover:scale-110 hover:shadow-lg ${
                                day.level === 0 ? 'bg-slate-700/20' :
                                day.level === 1 ? 'bg-blue-500/40' :
                                day.level === 2 ? 'bg-indigo-500/60' :
                                day.level === 3 ? 'bg-violet-500/80' :
                                'bg-purple-500'
                              }`}
                              title={`${day.date}: $${day.profit}`}
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-400 mt-4">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-slate-700/20 rounded-sm"></div>
                      <div className="w-4 h-4 bg-blue-500/40 rounded-sm"></div>
                      <div className="w-4 h-4 bg-indigo-500/60 rounded-sm"></div>
                      <div className="w-4 h-4 bg-violet-500/80 rounded-sm"></div>
                      <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>

                {/* Terminal */}
                <div className="bg-black border border-dark-700 rounded-2xl overflow-hidden">
                  <div className="bg-dark-900 px-3 py-2 border-b border-dark-700 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 text-xs font-mono ml-2">{masterBotData.name} Terminal v3.2.1</span>
                  </div>
                  <div className="p-3 h-80 overflow-y-auto font-mono text-xs leading-relaxed">
                    {terminalLines.map((line, idx) => {
                      const isError = line.includes('[ERROR]');
                      const isWarning = line.includes('[WARNING]');
                      const isInfo = line.includes('[TRADE]') || line.includes('[ARBITRAGE]') || line.includes('[ML]');
                      return (
                        <div
                          key={idx}
                          className={`animate-[fadeIn_0.3s_ease] ${
                            isError ? 'text-red-400' :
                            isWarning ? 'text-yellow-400' :
                            isInfo ? 'text-accent-400' :
                            'text-green-400'
                          }`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Trading Hours & Days */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Best Trading Hours</h2>
                      <p className="text-xs text-dark-400">Optimal time periods (UTC)</p>
                    </div>
                  </div>
                  <Chart options={tradingHoursChartOptions} series={tradingHoursChartOptions.series} type="bar" height={250} />
                </div>

                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Day of Week Performance</h2>
                      <p className="text-xs text-dark-400">Weekly trading patterns</p>
                    </div>
                  </div>
                  <Chart options={dayOfWeekChartOptions} series={dayOfWeekChartOptions.series} type="bar" height={250} />
                </div>
              </div>

              {/* Market Conditions */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                    <CloudSun className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Market Conditions</h2>
                    <p className="text-xs text-dark-400">Performance across different market states</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Bullish Market', icon: TrendingUp, time: '45% of time', return: '+4.2%', winRate: '92.3%', color: 'green' },
                    { label: 'Sideways Market', icon: Minus, time: '35% of time', return: '+2.1%', winRate: '84.7%', color: 'orange' },
                    { label: 'Bearish Market', icon: TrendingDown, time: '20% of time', return: '+0.8%', winRate: '78.1%', color: 'red' },
                  ].map((condition, idx) => {
                    const IconComponent = condition.icon;
                    return (
                      <div key={idx} className="bg-dark-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-semibold text-${condition.color}-400 flex items-center gap-2`}>
                            <IconComponent className="w-4 h-4" />
                            {condition.label}
                          </span>
                          <span className="text-xs text-slate-500">{condition.time}</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{condition.return}</div>
                        <div className="text-xs text-slate-400">Avg daily return</div>
                        <div className="mt-2 text-xs text-green-400">Win Rate: {condition.winRate}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* Advanced Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">SORTINO RATIO</div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">3.12</div>
                  <div className="text-xs text-dark-400">Downside: 2.1%</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">CALMAR RATIO</div>
                  <div className="text-2xl font-bold text-blue-400 mb-2">2.87</div>
                  <div className="text-xs text-dark-400">Return/MaxDD</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">OMEGA RATIO</div>
                  <div className="text-2xl font-bold text-green-400 mb-2">2.34</div>
                  <div className="text-xs text-dark-400">Threshold: 0%</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">TREYNOR RATIO</div>
                  <div className="text-2xl font-bold text-accent-400 mb-2">1.89</div>
                  <div className="text-xs text-dark-400">Beta-adjusted</div>
                </div>
              </div>

              {/* Risk/Reward Scatter */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Risk/Reward Analysis</h2>
                    <p className="text-xs text-dark-400">All trades performance scatter</p>
                  </div>
                </div>
                <Chart options={riskRewardScatterOptions} series={riskRewardScatterOptions.series} type="scatter" height={300} />
              </div>

              {/* Consecutive Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">MAX WIN STREAK</div>
                  <div className="text-3xl font-bold text-green-400 mb-2">47</div>
                  <div className="text-xs text-dark-400">Consecutive wins</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-red-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">MAX LOSS STREAK</div>
                  <div className="text-3xl font-bold text-red-400 mb-2">3</div>
                  <div className="text-xs text-dark-400">Consecutive losses</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">AVG HOLD TIME</div>
                  <div className="text-3xl font-bold text-accent-400 mb-2">4.2h</div>
                  <div className="text-xs text-dark-400">Per trade</div>
                </div>
              </div>

              {/* Order Book - Full Width */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Order Book - BTC/USDT</h2>
                      <p className="text-xs text-dark-400">Real-time market depth</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400 font-mono">LIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Asks (Sell Orders) */}
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-2 text-xs text-slate-400 font-semibold font-mono px-2 pb-2 border-b border-dark-700">
                      <div>PRICE (USDT)</div>
                      <div className="text-right">SIZE (BTC)</div>
                      <div className="text-right">TOTAL (USDT)</div>
                    </div>
                    <div className="space-y-0.5">
                      {orderBook.asks.map((ask, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 py-1.5 px-2 bg-gradient-to-r from-transparent to-red-500/10 hover:to-red-500/20 transition-colors font-mono text-xs rounded">
                          <div className="text-red-400 font-semibold">{ask.price.toFixed(2)}</div>
                          <div className="text-right text-white">{ask.size}</div>
                          <div className="text-right text-slate-400">{(ask.price * parseFloat(ask.size)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bids (Buy Orders) */}
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-2 text-xs text-slate-400 font-semibold font-mono px-2 pb-2 border-b border-dark-700">
                      <div>PRICE (USDT)</div>
                      <div className="text-right">SIZE (BTC)</div>
                      <div className="text-right">TOTAL (USDT)</div>
                    </div>
                    <div className="space-y-0.5">
                      {orderBook.bids.map((bid, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 py-1.5 px-2 bg-gradient-to-r from-transparent to-green-500/10 hover:to-green-500/20 transition-colors font-mono text-xs rounded">
                          <div className="text-green-400 font-semibold">{bid.price.toFixed(2)}</div>
                          <div className="text-right text-white">{bid.size}</div>
                          <div className="text-right text-slate-400">{(bid.price * parseFloat(bid.size)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Price Separator */}
                <div className="text-center py-4 my-4 bg-dark-800/50 rounded-lg border border-dark-700">
                  <div className="text-3xl font-bold text-white font-mono">{orderBook.bids[0]?.price.toFixed(2) || '51,234.50'}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">CURRENT MARKET PRICE</div>
                  <div className="text-sm text-green-400 font-mono mt-1">+2.45% ↗</div>
                </div>
              </div>

              {/* Neural Network Visualization */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Neural Network Architecture</h2>
                    <p className="text-xs text-dark-400">LSTM + XGBoost Ensemble</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-12 py-8">
                  {[
                    { label: 'INPUT (15)', nodes: ['I1', 'I2', 'I3', '...', 'I15'], color: 'from-accent-500 to-primary-600' },
                    { label: 'LSTM (64)', nodes: ['H1', 'H2', 'H3', '...', 'H64'], color: 'from-accent-500 to-primary-600' },
                    { label: 'DENSE (32)', nodes: ['D1', 'D2', '...', 'D32'], color: 'from-accent-500 to-primary-600' },
                    { label: 'OUTPUT (3)', nodes: ['BUY', 'HOLD', 'SELL'], color: 'from-green-500 to-emerald-600' },
                  ].map((layer, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="text-xs text-slate-400 mb-2 text-center font-mono">{layer.label}</div>
                      {layer.nodes.map((node, nidx) => (
                        <div
                          key={nidx}
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                            node === 'BUY' ? 'from-green-500 to-emerald-600' :
                            node === 'HOLD' ? 'from-gray-500 to-slate-600' :
                            node === 'SELL' ? 'from-red-500 to-rose-600' :
                            node === '...' ? 'w-auto h-auto bg-transparent' :
                            layer.color
                          } flex items-center justify-center text-xs font-semibold text-white shadow-lg ${node === '...' ? '' : 'animate-pulse'}`}
                        >
                          {node}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'ACCURACY', value: '94.2%', color: 'text-green-400' },
                    { label: 'PRECISION', value: '91.8%', color: 'text-blue-400' },
                    { label: 'RECALL', value: '89.3%', color: 'text-purple-400' },
                    { label: 'F1 SCORE', value: '90.5%', color: 'text-accent-400' },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-dark-800/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1 font-mono">{metric.label}</div>
                      <div className={`text-2xl font-bold font-mono ${metric.color}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees & Correlation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Fee & Cost Breakdown</h2>
                      <p className="text-xs text-dark-400">Total operational costs</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Fees Paid', value: '$2,134.56', color: 'text-white' },
                      { label: 'Exchange Fees', value: '$1,234.00', color: 'text-orange-400' },
                      { label: 'Performance Fees (20%)', value: '$16,912.40', color: 'text-purple-400' },
                      { label: 'Network Fees', value: '$123.16', color: 'text-accent-400' },
                      { label: 'Slippage Cost', value: '$776.00', color: 'text-yellow-400' },
                    ].map((fee, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-dark-800/50 rounded-lg p-3">
                        <span className="text-sm text-slate-400">{fee.label}</span>
                        <span className={`text-sm font-bold font-mono ${fee.color}`}>{fee.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-dark-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">Net Profit After Fees</span>
                        <span className="text-lg font-bold text-green-400 font-mono">+$65,516.44</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                      <Hash className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Correlation Matrix</h2>
                      <p className="text-xs text-dark-400">Trading pairs correlation</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-2 mr-3">
                        <div className="h-14"></div>
                        {['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'].map((pair, idx) => (
                          <div key={idx} className="w-14 h-14 bg-dark-800 text-slate-400 text-xs flex items-center justify-center border border-dark-700 rounded font-semibold">
                            {pair}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex gap-2 mb-3">
                          {['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'].map((pair, idx) => (
                            <div key={idx} className="w-14 h-14 bg-dark-800 text-slate-400 text-xs flex items-center justify-center border border-dark-700 rounded font-semibold">
                              {pair}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2">
                          {[1.0, 0.87, 0.72, 0.54, 0.63].map((_, i) => (
                            <div key={i} className="flex gap-2">
                              {[1.0, 0.87, 0.72, 0.54, 0.63].map((corr, j) => {
                                const value = i === j ? 1.0 : (Math.random() * 0.6 + 0.2);
                                const color = value > 0.8 ? 'bg-green-500' :
                                             value > 0.6 ? 'bg-green-400' :
                                             value > 0.4 ? 'bg-yellow-500' :
                                             'bg-orange-400';
                                return (
                                  <div key={j} className={`w-14 h-14 ${color} text-white text-sm flex items-center justify-center font-bold border border-dark-700 rounded transition-all hover:scale-110 cursor-pointer`}>
                                    {value.toFixed(2)}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Importance & Predictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Feature Importance</h2>
                      <p className="text-xs text-dark-400">Top 10 ML features</p>
                    </div>
                  </div>
                  <Chart options={featureImportanceChartOptions} series={featureImportanceChartOptions.series} type="bar" height={350} />
                </div>

                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Model Predictions</h2>
                      <p className="text-xs text-dark-400">Vs actual returns</p>
                    </div>
                  </div>
                  <Chart options={predictionChartOptions} series={predictionChartOptions.series} type="line" height={300} />
                </div>
              </div>

              {/* Greeks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'DELTA (Δ)', value: '0.74', desc: 'Directional exposure', color: 'text-accent-400', border: 'hover:border-accent-500/50' },
                  { label: 'GAMMA (Γ)', value: '0.12', desc: 'Delta sensitivity', color: 'text-purple-400', border: 'hover:border-purple-500/50' },
                  { label: 'THETA (Θ)', value: '-0.08', desc: 'Time decay', color: 'text-orange-400', border: 'hover:border-orange-500/50' },
                ].map((greek, idx) => (
                  <div key={idx} className={`bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 ${greek.border} transition-all`}>
                    <h3 className="text-sm font-semibold mb-4 text-white">{greek.label}</h3>
                    <div className={`text-4xl font-bold mb-2 ${greek.color}`}>{greek.value}</div>
                    <div className="text-xs text-dark-400">{greek.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tab: Risk */}
          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* VaR Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">VAR (95%)</div>
                  <div className="text-2xl font-bold text-orange-400 mb-2">-$1,234</div>
                  <div className="text-xs text-dark-400">Daily VaR</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-red-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">CVAR (95%)</div>
                  <div className="text-2xl font-bold text-red-400 mb-2">-$1,567</div>
                  <div className="text-xs text-dark-400">Conditional VaR</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">BETA (vs BTC)</div>
                  <div className="text-2xl font-bold text-accent-400 mb-2">0.74</div>
                  <div className="text-xs text-dark-400">Market correlation</div>
                </div>
                <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                  <div className="text-xs text-slate-400 mb-2">ALPHA</div>
                  <div className="text-2xl font-bold text-green-400 mb-2">+12.4%</div>
                  <div className="text-xs text-dark-400">Excess return</div>
                </div>
              </div>

              {/* Monte Carlo Simulation */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Monte Carlo Simulation</h2>
                    <p className="text-xs text-dark-400">1000 runs, 30 days projection</p>
                  </div>
                </div>
                <Chart options={monteCarloChartOptions} series={monteCarloChartOptions.series} type="line" height={300} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'EXPECTED', value: '+12.4%', color: 'text-green-400' },
                    { label: 'BEST (95%)', value: '+24.7%', color: 'text-accent-400' },
                    { label: 'WORST (5%)', value: '-3.2%', color: 'text-red-400' },
                    { label: 'STD DEV', value: '8.3%', color: 'text-orange-400' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1 font-mono">{stat.label}</div>
                      <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Underwater Chart */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Underwater Chart</h2>
                    <p className="text-xs text-dark-400">Drawdown over time</p>
                  </div>
                </div>
                <Chart options={underwaterChartOptions} series={underwaterChartOptions.series} type="area" height={250} />
              </div>

              {/* System Health */}
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">System Health Monitoring</h2>
                    <p className="text-xs text-dark-400">Real-time system status</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">CPU USAGE</span>
                      <span className="text-accent-400 font-mono">{cpuUsage}%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-500 to-primary-500 transition-all" style={{ width: `${cpuUsage}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">MEMORY</span>
                      <span className="text-green-400 font-mono">{(memUsage * 0.04).toFixed(1)}GB / 4GB</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${memUsage}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">API LATENCY</span>
                      <span className={`font-mono ${apiLatency < 15 ? 'text-green-400' : 'text-yellow-400'}`}>{apiLatency}ms</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all" style={{ width: `${apiLatency}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">UPTIME</span>
                      <span className="text-accent-400 font-mono">23d 14h 32m</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">EXCHANGES</div>
                      <div className="text-2xl font-bold text-white font-mono">8/8</div>
                    </div>
                    <div className="bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">WEBSOCKETS</div>
                      <div className="text-2xl font-bold text-green-400 font-mono">24/24</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Copy Modal */}
      {masterBotData && (
        <CopyBotModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          demoBot={masterBotData}
          userBalance={10000} // TODO: Get from user context
        />
      )}

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
