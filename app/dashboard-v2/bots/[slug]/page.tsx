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
  ChevronRight,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { TokenIcon } from '@token-icons/react';
import { getDemoBotBySlug } from '@/lib/demoMarketplace';
import type { DemoBot } from '@/lib/demoMarketplace';
import { botsApi } from '@/lib/api/botsApi';
import type { BotConfig, Trade as BotTrade } from '@/lib/trading/types';
import { LoadingScreen } from '@/components/dashboard-v2/LoadingScreen';
import { formatNumber, formatDateTime } from '@/lib/formatters';
import type {
  MasterBotData,
  BotStats,
  OpenPosition,
  Trade as ApiTrade,
  EquityPoint,
} from '@/types/api';
import { Pagination } from '@/components/dashboard-v2/Pagination';
import { FilterDropdown } from '@/components/dashboard-v2/FilterDropdown';

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

interface OrderBookEntry {
  price: number;
  size: string;
  total: number;
}

/**
 * Generate ticker data from real DemoBot stats.
 * BACKEND MIGRATION: Pull from real-time API.
 */
function getTickerData(bot: DemoBot | null | undefined) {
  if (!bot) return [];
  return [
    { icon: Flame, label: `${bot.stats.copiers} copiers`, value: 'total', color: 'text-green-400' },
    { icon: TrendingUp, label: `+${bot.stats.return1y}% ROI`, value: '1 year', color: 'text-green-400' },
    { icon: DollarSign, label: `+${bot.stats.return30d}%`, value: '30d return', color: 'text-green-400' },
    { icon: Star, label: `+${bot.stats.return7d}%`, value: '7d return', color: 'text-yellow-400' },
    { icon: Target, label: `${bot.stats.winRate}% win rate`, value: '', color: 'text-accent-400' },
    { icon: Trophy, label: `Sharpe ${bot.stats.sharpeRatio}`, value: '', color: 'text-yellow-400' },
    { icon: Rocket, label: `Max DD ${bot.stats.maxDD}%`, value: '', color: 'text-red-400' },
  ];
}

// Top wins/losses: populated from real trade data in masterBotData.recentTrades

// Bot data is loaded dynamically from demoMarketplace via getDemoBotBySlug()

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
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(23);
  const [memUsage, setMemUsage] = useState(30);
  const [apiLatency, setApiLatency] = useState(12);
  const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }>({ asks: [], bids: [] });
  const [equityPeriod, setEquityPeriod] = useState<'1D' | '7D' | '30D' | '90D' | 'ALL'>('ALL');

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Trade history pagination & filters
  const [tradeHistoryPage, setTradeHistoryPage] = useState(1);
  const tradesPerPage = 10;
  const [tradeFilterPair, setTradeFilterPair] = useState<string>('all');
  const [tradeFilterSide, setTradeFilterSide] = useState<'all' | 'LONG' | 'SHORT'>('all');
  const [tradeFilterResult, setTradeFilterResult] = useState<'all' | 'wins' | 'losses'>('all');
  const [tradeSortBy, setTradeSortBy] = useState<'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'size-high' | 'size-low' | 'duration'>('newest');

  // Expanded trades for accordion
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  const toggleTradeExpanded = (tradeId: string) => {
    setExpandedTrades(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tradeId)) {
        newSet.delete(tradeId);
      } else {
        newSet.add(tradeId);
      }
      return newSet;
    });
  };

  // Convert DemoBot to MasterBotData format
  const convertDemoBotToMasterData = (demoBot: DemoBot): MasterBotData => {
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
      activePositions: 0, // Will be overridden with real data
      maxPositions: completeConfig.maxConcurrentPositions,
      stats: {
        ...demoBot.stats,
        winRate: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        profitFactor: 0,
        sharpeRatio: demoBot.stats.sharpeRatio || 2.5,
        maxDrawdown: Math.abs(demoBot.stats.maxDD || 0),
        averageWin: 0,
        averageLoss: 0,
        bestTrade: 0,
        worstTrade: 0,
        totalVolume: 0,
        averageHoldTime: '0h',
        winStreak: 0,
        recoveryFactor: 0,
        avgTradeSize: 0,
      },
      openPositions: [] as OpenPosition[],
      recentTrades: [] as ApiTrade[],
    } as unknown as MasterBotData;
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
        masterData.openPositions = (aggStats.masterBotStats.positions || []) as unknown as OpenPosition[];
        masterData.recentTrades = (aggStats.masterBotStats.trades || []) as unknown as ApiTrade[];

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

          // Convert Trade[] to add botName and realistic metrics
          const recentTrades: ApiTrade[] = trades.map((t: BotTrade) => {
            // Calculate realistic metrics if not present
            const feeRate = 0.04;
            const posSize = t.positionSize || 0;
            const openFee = t.openFee ?? (posSize * feeRate / 100);
            const closeFee = t.closeFee ?? (posSize * feeRate / 100);
            const totalFees = t.totalFees ?? (openFee + closeFee);
            const netPnl = t.netPnl ?? (t.pnl - totalFees);
            const slippage = t.slippage ?? 0;

            return {
              ...t,
              botName: aggStats.masterBotStats.name,
              openFee,
              closeFee,
              totalFees,
              netPnl,
              slippage,
            } as ApiTrade;
          });

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
      days.push({ date: date.toLocaleDateString(), level, profit: formatNumber(profit) });
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
      data.push(parseFloat(formatNumber(cumulative)));
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
        size: formatNumber(Math.random() * 2, 4),
        total: 0
      }));
      const bids = Array.from({ length: 15 }, (_, i) => ({
        price: basePrice - (i + 1) * 10,
        size: formatNumber(Math.random() * 2, 4),
        total: 0
      }));
      setOrderBook({ asks: asks.reverse(), bids });
    };
    updateOrderBook();
    const interval = setInterval(updateOrderBook, 300); // Very fast updates - 300ms
    return () => clearInterval(interval);
  }, []);

  // Chart options with Cloudbright colors
  // Primary: #4F46E5, Accent: #06B6D4, Dark-700: #334155
  const performanceChartOptions = {
    series: [{ name: 'PnL', data: performanceData }],
    chart: { type: 'area' as const, height: 280, background: 'transparent', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 3, colors: ['#10B981'] },
    fill: {
      type: 'gradient' as const,
      gradient: {
        opacityFrom: 0.35,
        opacityTo: 0.05,
        colorStops: [
          { offset: 0, color: '#10B981', opacity: 0.35 },
          { offset: 50, color: '#10B981', opacity: 0.15 },
          { offset: 100, color: '#10B981', opacity: 0.02 }
        ]
      }
    },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => '$' + formatNumber(val, 0)
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
    colors: ['#6B7FFF', '#4A90E2', '#8B5CF6']
  };

  const pairDistributionChartOptions = {
    series: [40, 35, 15, 5, 3, 2],
    chart: { type: 'donut' as const, height: 280, background: 'transparent' },
    labels: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT', 'AVAX/USDT', 'Other'],
    colors: ['#6B7FFF', '#4A90E2', '#8B5CF6', '#5865F2', '#6BA3FF', '#7C8FFF'],
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
      labels: { style: { colors: '#94a3b8', fontSize: '10px' }, formatter: (val: number) => formatNumber(val, 0) }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' }, formatter: (val: number) => formatNumber(val, 1) } },
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
        formatter: (val: number) => '$' + formatNumber(val, 0)
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
    colors: ['#6B7FFF', '#4A90E2', '#8B5CF6', '#5865F2', '#6BA3FF', '#7C8FFF', '#A78BFA', '#C4B5FD', '#818CF8', '#6366F1']
  };

  const predictionChartOptions = {
    series: [
      { name: 'Predicted', data: Array.from({ length: 30 }, () => parseFloat(formatNumber((Math.random() * 4) - 1))) },
      { name: 'Actual', data: Array.from({ length: 30 }, () => parseFloat(formatNumber((Math.random() * 4) - 1))) }
    ],
    chart: { type: 'line' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#6B7FFF', '#8B5CF6'],
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => formatNumber(val, 1) + '%'
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
        return parseFloat(formatNumber(value));
      })
    })),
    chart: { type: 'line' as const, height: 300, background: 'transparent', toolbar: { show: false } },
    stroke: { curve: 'smooth' as const, width: 1 },
    legend: { show: false },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (val: number) => formatNumber(val, 0) + '%'
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
        return parseFloat(formatNumber(Math.min(value, 0)));
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
        formatter: (val: number) => formatNumber(val, 1) + '%'
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
    return <LoadingScreen />;
  }

  // Show error state
  if (error || !masterBotData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-transparent flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Bot Not Found</h1>
          <p className="text-gray-700 dark:text-dark-300 mb-8">{error || `The bot "${slug}" doesn't exist.`}</p>
          <Link
            href="/dashboard-v2/bots"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-gray-900 dark:text-white hover:shadow-xl hover:shadow-primary-500/50 transition-all inline-block"
          >
            Back to Bots
          </Link>
        </motion.div>
      </div>
    );
  }

  // Trade history: unique pairs, filtering, sorting
  const masterUniquePairs = Array.from(new Set((masterBotData?.recentTrades || []).map(t => t.pair)));
  const filteredMasterTrades = (masterBotData?.recentTrades || [])
    .filter(trade => {
      if (tradeFilterPair !== 'all' && trade.pair !== tradeFilterPair) return false;
      if (tradeFilterSide !== 'all' && trade.side !== tradeFilterSide) return false;
      if (tradeFilterResult === 'wins' && trade.pnl <= 0) return false;
      if (tradeFilterResult === 'losses' && trade.pnl >= 0) return false;
      return true;
    })
    .sort((a, b) => {
      switch (tradeSortBy) {
        case 'oldest': return new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime();
        case 'pnl-high': return b.pnl - a.pnl;
        case 'pnl-low': return a.pnl - b.pnl;
        case 'size-high': return b.positionSize - a.positionSize;
        case 'size-low': return a.positionSize - b.positionSize;
        case 'duration': {
          const parseDur = (d: string) => {
            let mins = 0;
            const hm = d.match(/(\d+)h/); if (hm) mins += parseInt(hm[1]) * 60;
            const mm = d.match(/(\d+)m/); if (mm) mins += parseInt(mm[1]);
            return mins;
          };
          return parseDur(b.duration) - parseDur(a.duration);
        }
        default: return new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent text-slate-200">
      <div className="max-w-[2000px] mx-auto p-3">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] mb-3"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#152033] dark:to-dark-900 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
          {/* Mobile: stacked centered layout | Desktop: horizontal layout */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            {/* Mobile: avatar centered on its own row */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-4 sm:flex-1">
              {masterBotData.icon.startsWith('/') ? (
                <img src={masterBotData.icon} alt={masterBotData.name} className="w-16 h-16 sm:w-16 sm:h-16 object-contain mb-2 sm:mb-0" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center text-2xl mb-2 sm:mb-0">
                  {masterBotData.icon}
                </div>
              )}
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white text-center sm:text-left">{masterBotData.name}</h1>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-semibold font-mono">LIVE • 99.8% UPTIME</span>
                </div>
                <p className="text-gray-600 dark:text-slate-400 mb-2 text-sm text-center sm:text-left">
                  {masterBotData.description}
                </p>
                <div className="flex items-center gap-3 text-xs flex-wrap font-mono">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-accent-400" />
                    <span className="text-accent-400">{formatNumber(masterBotData.totalCopiers, 0)}</span>
                    <span className="text-gray-500 dark:text-slate-400">copiers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-accent-400" />
                    <span className="text-accent-400">#3</span>
                    <span className="text-gray-500 dark:text-slate-400">Global</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard-v2/bots/${slug}/copy`}
                  className="mt-4 px-6 py-2.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary-500/30"
                >
                  <Rocket className="w-4 h-4" />
                  Copy This Bot
                </Link>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap p-1.5">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 font-medium rounded-lg sm:rounded-md text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white sm:shadow-lg sm:shadow-primary-500/30'
                      : 'bg-gray-200 dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 sm:bg-transparent sm:dark:bg-transparent sm:border-0 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

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
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Invested */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400 mb-0.5 sm:mb-1">Total Invested</div>
                    <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-2">
                      ${formatNumber(masterBotData.totalInvestedByAll, 0)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">
                      By all copiers
                    </div>
                  </div>
                </div>

                {/* Aggregate P&L */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-green-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500/20 border border-green-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                      </div>
                      <div className="text-[10px] sm:text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                        +{formatNumber(masterBotData.aggregateProfitPercent, 1)}%
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400 mb-0.5 sm:mb-1">Aggregate P&L</div>
                    <div className="text-base sm:text-2xl font-semibold text-green-400 mb-0.5 sm:mb-2">
                      +${formatNumber(masterBotData.aggregateProfit, 0)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">
                      Total profit (all copiers)
                    </div>
                  </div>
                </div>

                {/* Win Rate */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Target className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400 mb-0.5 sm:mb-1">Win Rate</div>
                    <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-2">
                      {formatNumber(masterBotData.stats.winRate, 1)}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">
                      {masterBotData.stats.winningTrades}W / {masterBotData.stats.losingTrades}L
                    </div>
                  </div>
                </div>

                {/* Active Positions */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Layers className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                      </div>
                      <div className="text-[10px] sm:text-xs font-medium text-primary-400 bg-primary-500/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                        Max {masterBotData.maxPositions}
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400 mb-0.5 sm:mb-1">Active Positions</div>
                    <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-2">
                      {masterBotData.activePositions} / {masterBotData.maxPositions}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">
                      Currently open
                    </div>
                  </div>
                </div>
              </div>

              {/* Equity Curve */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Aggregate Equity Curve</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Total portfolio value from all copiers</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {(['1D', '7D', '30D', '90D', 'ALL'] as const).map(period => (
                      <button
                        key={period}
                        onClick={() => setEquityPeriod(period)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          equityPeriod === period
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-dark-400 hover:bg-gray-300 dark:hover:bg-dark-700'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-h-[400px]">
                <Chart
                  options={{
                    chart: {
                      type: 'area' as const,
                      toolbar: { show: false },
                      background: 'transparent',
                      zoom: { enabled: false },
                    },
                    theme: { mode: isDark ? 'dark' as const : 'light' as const },
                    dataLabels: { enabled: false },
                    stroke: {
                      curve: 'smooth' as const,
                      width: 3,
                      colors: ['#10B981'],
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.7,
                        opacityTo: 0.1,
                        colorStops: [
                          { offset: 0, color: '#10B981', opacity: 0.7 },
                          { offset: 50, color: '#10B981', opacity: 0.4 },
                          { offset: 100, color: '#10B981', opacity: 0.1 }
                        ]
                      },
                    },
                    grid: {
                      borderColor: isDark ? '#1e293b' : '#e5e7eb',
                      strokeDashArray: 0,
                      xaxis: { lines: { show: false } },
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        style: { colors: '#64748b', fontSize: '12px' },
                        datetimeUTC: false,
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: '#64748b', fontSize: '12px' },
                        formatter: (val: number) => `$${formatNumber(val, 0)}`,
                      },
                    },
                    tooltip: {
                      theme: 'dark',
                      x: {
                        formatter: (val: number) => {
                          return formatDateTime(val);
                        }
                      },
                      y: {
                        formatter: (val: number) => `$${formatNumber(val)}`,
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
                  height="100%"
                />
                </div>
                </div>
              </div>

              {/* Performance Statistics */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Trading Statistics</h2>
                    <p className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400">Comprehensive performance metrics</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  <MasterStatCard
                    icon={<BarChart3 className="w-4 h-4 text-primary-400" />}
                    label="Total Trades"
                    value={masterBotData.stats.totalTrades.toString()}
                    subtitle={`${formatNumber(masterBotData.stats.totalTrades / Math.max(masterBotData.recentTrades.length > 0 ? 30 : 1, 1), 1)}/day`}
                    subtitleColor="text-primary-400"
                  />
                  <MasterStatCard
                    icon={<Clock className="w-4 h-4 text-primary-400" />}
                    label="Avg Hold Time"
                    value="2.4h"
                    subtitle="Swing trading"
                    subtitleColor="text-primary-400"
                  />
                  <MasterStatCard
                    icon={<Target className="w-4 h-4 text-primary-400" />}
                    label="Win/Loss Ratio"
                    value={`${formatNumber(masterBotData.stats.winningTrades / Math.max(masterBotData.stats.losingTrades, 1))}:1`}
                    subtitle={`${masterBotData.stats.winningTrades}W / ${masterBotData.stats.losingTrades}L`}
                    subtitleColor="text-primary-400"
                  />
                  <MasterStatCard
                    icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                    label="Average Win"
                    value={`+$${formatNumber(masterBotData.stats.averageWin, 0)}`}
                    subtitle={`${formatNumber((masterBotData.stats.averageWin / Math.max(masterBotData.totalInvestedByAll || 1, 1)) * 100)}% of capital`}
                    valueColor="text-green-400"
                    subtitleColor="text-green-400"
                  />
                  <MasterStatCard
                    icon={<TrendingDown className="w-4 h-4 text-red-400" />}
                    label="Average Loss"
                    value={`$${formatNumber(masterBotData.stats.averageLoss, 0)}`}
                    subtitle={`${formatNumber((Math.abs(masterBotData.stats.averageLoss) / Math.max(masterBotData.totalInvestedByAll || 1, 1)) * 100)}% of capital`}
                    valueColor="text-red-400"
                    subtitleColor="text-red-400"
                  />
                  <MasterStatCard
                    icon={<Zap className="w-4 h-4 text-primary-400" />}
                    label="Profit Factor"
                    value={formatNumber(masterBotData.stats.profitFactor)}
                    subtitle={
                      masterBotData.stats.profitFactor >= 2 ? 'Excellent' :
                      masterBotData.stats.profitFactor >= 1.5 ? 'Good' :
                      masterBotData.stats.profitFactor >= 1 ? 'Profitable' :
                      'Needs improvement'
                    }
                    valueColor="text-primary-400"
                    subtitleColor={
                      masterBotData.stats.profitFactor >= 2 ? 'text-green-400' :
                      masterBotData.stats.profitFactor >= 1.5 ? 'text-yellow-400' :
                      masterBotData.stats.profitFactor >= 1 ? 'text-amber-400' :
                      'text-red-400'
                    }
                  />
                  <MasterStatCard
                    icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                    label="Max Drawdown"
                    value={`${formatNumber(masterBotData.stats.maxDrawdown, 1)}%`}
                    subtitle={
                      masterBotData.stats.maxDrawdown < 5 ? 'Very safe' :
                      masterBotData.stats.maxDrawdown < 10 ? 'Safe' :
                      masterBotData.stats.maxDrawdown < 20 ? 'Moderate risk' :
                      'High risk'
                    }
                    valueColor="text-red-400"
                    subtitleColor={
                      masterBotData.stats.maxDrawdown < 5 ? 'text-green-400' :
                      masterBotData.stats.maxDrawdown < 10 ? 'text-yellow-400' :
                      masterBotData.stats.maxDrawdown < 20 ? 'text-amber-400' :
                      'text-red-400'
                    }
                  />
                  <MasterStatCard
                    icon={<DollarSign className="w-4 h-4 text-primary-400" />}
                    label="Total Volume"
                    value={`$${formatNumber(masterBotData.stats.totalVolume / 1000, 0)}K`}
                    subtitle={`${formatNumber(masterBotData.stats.totalVolume / Math.max(masterBotData.totalInvestedByAll || 1, 1), 1)}× turnover`}
                    subtitleColor="text-primary-400"
                  />
                  <MasterStatCard
                    icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                    label="Best Trade"
                    value={`+$${formatNumber(masterBotData.stats.bestTrade, 0)}`}
                    subtitle={`${formatNumber((masterBotData.stats.bestTrade / Math.max(masterBotData.totalInvestedByAll || 1, 1)) * 100)}% gain`}
                    valueColor="text-green-400"
                    subtitleColor="text-green-400"
                  />
                  <MasterStatCard
                    icon={<TrendingDown className="w-4 h-4 text-red-400" />}
                    label="Worst Trade"
                    value={`$${formatNumber(masterBotData.stats.worstTrade || 0, 0)}`}
                    subtitle={`${formatNumber((Math.abs(masterBotData.stats.worstTrade || 0) / Math.max(masterBotData.totalInvestedByAll || 1, 1)) * 100)}% loss`}
                    valueColor="text-red-400"
                    subtitleColor="text-red-400"
                  />
                  <MasterStatCard
                    icon={<Zap className="w-4 h-4 text-primary-400" />}
                    label="Best Streak"
                    value={`${masterBotData.stats.winStreak || 0} W`}
                    subtitle={
                      (masterBotData.stats.winStreak || 0) >= 10 ? 'Exceptional streak' :
                      (masterBotData.stats.winStreak || 0) >= 7 ? 'Strong streak' :
                      (masterBotData.stats.winStreak || 0) >= 5 ? 'Above average' :
                      (masterBotData.stats.winStreak || 0) >= 3 ? 'Moderate streak' :
                      'Early stage'
                    }
                    valueColor="text-green-400"
                    subtitleColor="text-green-400"
                  />
                  <MasterStatCard
                    icon={<Trophy className="w-4 h-4 text-yellow-400" />}
                    label="Sharpe Ratio"
                    value={formatNumber(masterBotData.stats.sharpeRatio || 0)}
                    subtitle={
                      (masterBotData.stats.sharpeRatio || 0) >= 3 ? 'Excellent' :
                      (masterBotData.stats.sharpeRatio || 0) >= 2 ? 'Very good' :
                      (masterBotData.stats.sharpeRatio || 0) >= 1 ? 'Good' :
                      'Below average'
                    }
                    valueColor="text-yellow-400"
                    subtitleColor={
                      (masterBotData.stats.sharpeRatio || 0) >= 3 ? 'text-green-400' :
                      (masterBotData.stats.sharpeRatio || 0) >= 2 ? 'text-yellow-400' :
                      (masterBotData.stats.sharpeRatio || 0) >= 1 ? 'text-amber-400' :
                      'text-red-400'
                    }
                  />
                </div>
                </div>
              </div>

              {/* Open Positions (Live Grid) */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Open Positions (Live)</h2>
                      <p className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400">{masterBotData.openPositions.length} active position{masterBotData.openPositions.length !== 1 ? 's' : ''} • Real-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-green-400 font-semibold">LIVE</span>
                  </div>
                </div>

                {masterBotData.openPositions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-dark-600" />
                    </div>
                    <p className="text-gray-600 dark:text-dark-400">No open positions</p>
                    <p className="text-xs text-dark-500 mt-1">Bot is analyzing markets...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {masterBotData.openPositions.map((position) => (
                      <div
                        key={position.id}
                        className="relative p-3 rounded-lg border border-gray-200 dark:border-dark-700 bg-gray-100 dark:bg-dark-900/30 overflow-hidden hover:border-primary-500/50 transition-all"
                      >
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                              position.side === 'LONG'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {position.side} ×{position.leverage}
                            </div>
                            <span className="text-base font-normal text-gray-900 dark:text-white">{position.pair}</span>
                            {/* SL/TP — inline on sm+ */}
                            <div className="hidden sm:flex items-center gap-1.5 ml-2">
                              <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded flex items-center gap-1.5">
                                <div className="text-[9px] text-gray-600 dark:text-dark-400">SL</div>
                                <div className="font-mono text-[10px] text-red-400 font-normal">
                                  ${formatNumber(position.stopLoss, 0)}
                                </div>
                              </div>
                              <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded flex items-center gap-1.5">
                                <div className="text-[9px] text-gray-600 dark:text-dark-400">TP</div>
                                <div className="font-mono text-[10px] text-green-400 font-normal">
                                  ${formatNumber(position.takeProfit, 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-dark-400">
                            <Clock className="w-3 h-3" />
                            {position.duration}
                          </div>
                          {/* SL/TP — separate row on mobile */}
                          <div className="flex sm:hidden items-center gap-1.5 w-full">
                            <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded flex items-center gap-1.5">
                              <div className="text-[9px] text-gray-600 dark:text-dark-400">SL</div>
                              <div className="font-mono text-[10px] text-red-400 font-normal">
                                ${formatNumber(position.stopLoss, 0)}
                              </div>
                            </div>
                            <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded flex items-center gap-1.5">
                              <div className="text-[9px] text-gray-600 dark:text-dark-400">TP</div>
                              <div className="font-mono text-[10px] text-green-400 font-normal">
                                ${formatNumber(position.takeProfit, 0)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                            <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Entry Price</div>
                            <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">
                              ${formatNumber(position.entryPrice)}
                            </div>
                          </div>
                          <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                            <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5 flex items-center gap-1">
                              Current Price
                              {position.pnl >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-green-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                            </div>
                            <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">
                              ${formatNumber(position.currentPrice)}
                            </div>
                          </div>
                          <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                            <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Position Size</div>
                            <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">
                              ${formatNumber(position.positionSize)}
                            </div>
                          </div>
                          <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                            <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Amount</div>
                            <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">
                              {formatNumber(position.amount, 8)}
                            </div>
                          </div>
                          <div className={`col-span-2 sm:col-span-1 rounded-lg px-2.5 py-2 ${position.pnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">P&L</div>
                            <div className={`font-mono text-sm font-normal ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {position.pnl >= 0 ? '+' : ''}${formatNumber(Math.abs(position.pnl))} <span className="text-[10px] opacity-70">({position.pnl >= 0 ? '+' : ''}{formatNumber(position.pnlPercent)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* Recent Trades (Detailed Grid) */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Trade History</h2>
                      <p className="text-[10px] sm:text-sm text-gray-600 dark:text-dark-400">{filteredMasterTrades.length} of {masterBotData.recentTrades.length} trades</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap w-full sm:w-auto">
                    <FilterDropdown
                      value={tradeFilterPair}
                      onChange={(v) => { setTradeFilterPair(v); setTradeHistoryPage(1); }}
                      options={[
                        { value: 'all', label: 'All Pairs' },
                        ...masterUniquePairs.map(pair => ({ value: pair, label: pair })),
                      ]}
                    />
                    <FilterDropdown
                      value={tradeFilterSide}
                      onChange={(v) => { setTradeFilterSide(v as 'all' | 'LONG' | 'SHORT'); setTradeHistoryPage(1); }}
                      options={[
                        { value: 'all', label: 'All Sides' },
                        { value: 'LONG', label: 'Long Only' },
                        { value: 'SHORT', label: 'Short Only' },
                      ]}
                    />
                    <FilterDropdown
                      value={tradeFilterResult}
                      onChange={(v) => { setTradeFilterResult(v as 'all' | 'wins' | 'losses'); setTradeHistoryPage(1); }}
                      options={[
                        { value: 'all', label: 'All Results' },
                        { value: 'wins', label: 'Wins Only' },
                        { value: 'losses', label: 'Losses Only' },
                      ]}
                    />
                    <FilterDropdown
                      value={tradeSortBy}
                      onChange={(v) => { setTradeSortBy(v as typeof tradeSortBy); setTradeHistoryPage(1); }}
                      options={[
                        { value: 'newest', label: 'Newest First' },
                        { value: 'oldest', label: 'Oldest First' },
                        { value: 'pnl-high', label: 'Highest P&L' },
                        { value: 'pnl-low', label: 'Lowest P&L' },
                        { value: 'size-high', label: 'Largest Size' },
                        { value: 'size-low', label: 'Smallest Size' },
                        { value: 'duration', label: 'Longest Duration' },
                      ]}
                    />
                  </div>
                </div>

                {filteredMasterTrades.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-dark-600" />
                    </div>
                    <p className="text-gray-600 dark:text-dark-400">
                      {masterBotData.recentTrades.length === 0 ? 'No trades yet' : 'No trades match filters'}
                    </p>
                    <p className="text-xs text-dark-500 mt-1">
                      {masterBotData.recentTrades.length === 0 ? 'Trades will appear here' : 'Try adjusting your filters'}
                    </p>
                  </div>
                ) : (
                  <>
                  <div className="space-y-2">
                    {filteredMasterTrades.slice(
                      (tradeHistoryPage - 1) * tradesPerPage,
                      tradeHistoryPage * tradesPerPage
                    ).map((trade) => {
                      const isExpanded = expandedTrades.has(trade.id);
                      return (
                        <div key={trade.id} className="rounded-lg border border-gray-200 dark:border-dark-700 bg-gray-100 dark:bg-dark-900/30 overflow-hidden">
                          {/* Compact Header - Always Visible */}
                          <div
                            className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-800/70 transition-colors"
                            onClick={() => toggleTradeExpanded(trade.id)}
                          >
                            {/* Row 1: Pair & Side + Arrow */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-base font-normal text-gray-900 dark:text-white">{trade.pair}</span>
                                <div className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                                  trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {trade.side === 'LONG' ? '↑' : '↓'} {trade.side}×{trade.leverage}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* P&L — inline on sm+ */}
                                <div className="hidden sm:block text-right">
                                  <div className={`text-sm font-normal ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.pnl >= 0 ? '+' : ''}${formatNumber(trade.pnl)}
                                  </div>
                                  <div className={`text-[10px] font-normal opacity-70 ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.pnl >= 0 ? '+' : ''}{formatNumber(trade.pnlPercent)}%
                                  </div>
                                </div>
                                {/* Timestamp — inline on sm+ */}
                                <div className="hidden sm:block text-right">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 whitespace-nowrap">
                                    {formatDateTime(new Date(trade.closedAt).getTime())}
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight className="w-3 h-3 text-gray-600 dark:text-dark-400" />
                                </motion.div>
                              </div>
                            </div>
                            {/* Row 2: P&L + Date — mobile only */}
                            <div className="flex sm:hidden items-center justify-between mt-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`text-sm font-normal ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {trade.pnl >= 0 ? '+' : ''}${formatNumber(trade.pnl)}
                                </div>
                                <div className={`text-[10px] font-normal opacity-70 ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {trade.pnl >= 0 ? '+' : ''}{formatNumber(trade.pnlPercent)}%
                                </div>
                              </div>
                              <div className="text-[10px] text-gray-600 dark:text-dark-400">
                                {formatDateTime(new Date(trade.closedAt).getTime())}
                              </div>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? 'auto' : 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-0 border-t border-gray-200 dark:border-dark-700/50">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                                <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Entry Price</div>
                                  <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">${formatNumber(trade.entryPrice)}</div>
                                </div>
                                <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Exit Price</div>
                                  <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">${formatNumber(trade.exitPrice)}</div>
                                </div>
                                <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Position Size</div>
                                  <div className="font-mono text-sm text-gray-900 dark:text-white font-normal">${formatNumber(trade.positionSize, 0)}</div>
                                </div>
                                <div className="bg-gray-100 dark:bg-dark-900/50 rounded-lg px-2.5 py-2">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Duration</div>
                                  <div className="text-sm text-gray-900 dark:text-white font-normal">{trade.duration}</div>
                                </div>
                                <div className="col-span-2 sm:col-span-1 bg-red-500/10 rounded-lg px-2.5 py-2">
                                  <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-0.5">Total Fees</div>
                                  <div className="font-mono text-sm text-red-400 font-normal">-${formatNumber(trade.totalFees)}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                  <Pagination
                    currentPage={tradeHistoryPage}
                    totalItems={filteredMasterTrades.length}
                    itemsPerPage={tradesPerPage}
                    onPageChange={setTradeHistoryPage}
                    className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-700"
                  />
                  </>
                )}
                </div>
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
                  <div className="h-full rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                    <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Users className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Copiers Growth</h2>
                          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Total copiers over time (30 days)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-medium text-green-400">+18.7%</div>
                        <div className="text-xs text-gray-600 dark:text-dark-400">vs last month</div>
                      </div>
                    </div>
                    <Chart
                      options={{
                        chart: {
                          type: 'area' as const,
                          height: 270,
                          toolbar: { show: false },
                          background: 'transparent',
                          zoom: { enabled: false },
                          sparkline: { enabled: false },
                        },
                        theme: { mode: 'dark' as const },
                        dataLabels: { enabled: false },
                        stroke: {
                          curve: 'smooth' as const,
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
                            formatter: (val: number) => formatNumber(val, 0) + ' copiers',
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
                </div>

                {/* Right: Stats Cards */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {/* Avg Investment */}
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 border border-gray-200 dark:border-dark-700 rounded-xl p-5 hover:border-primary-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Avg Investment</div>
                          <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">
                            ${formatNumber(masterBotData.totalInvestedByAll / masterBotData.totalCopiers, 0)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-dark-400">Total AUM</div>
                        <div className="text-base font-normal text-green-400">${formatNumber(masterBotData.totalInvestedByAll / 1000000, 1)}M</div>
                      </div>
                    </div>
                  </div>

                  {/* New Copiers 24h */}
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 border border-gray-200 dark:border-dark-700 rounded-xl p-5 hover:border-primary-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">New (24h)</div>
                          <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">+234</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-normal text-primary-400">Record</div>
                        <div className="text-xs text-gray-600 dark:text-dark-400 mt-0.5">All-time high</div>
                      </div>
                    </div>
                  </div>

                  {/* Sharpe Ratio */}
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 border border-gray-200 dark:border-dark-700 rounded-xl p-5 hover:border-primary-500/50 transition-all flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Sharpe Ratio</div>
                          <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">{masterBotData.stats.sharpeRatio}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-normal text-yellow-400">{masterBotData.stats.maxDrawdown < 10 ? 'Low Risk' : 'Moderate'}</div>
                        <div className="text-xs text-gray-600 dark:text-dark-400 mt-0.5">risk level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section: Geography Chart + Trading Pairs Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geography Donut Chart */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Copier Geography</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Distribution by country</p>
                    </div>
                  </div>
                  <Chart
                    options={{
                      chart: {
                        type: 'donut' as const,
                        background: 'transparent',
                        dropShadow: {
                          enabled: false,
                        },
                      },
                      theme: { mode: 'dark' as const },
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
                                formatter: () => formatNumber(masterBotData.totalCopiers, 0),
                              },
                              total: {
                                show: true,
                                label: 'Total Copiers',
                                fontSize: '11px',
                                color: '#64748b',
                                formatter: () => formatNumber(masterBotData.totalCopiers, 0),
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
                </div>

                {/* Trading Pairs Distribution */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <PieChart className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Trading Pairs</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Volume distribution (30d)</p>
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
                          <span className="text-sm font-normal text-gray-900 dark:text-white">{pair.name}</span>
                        </div>

                        {/* Horizontal Bar */}
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-dark-800 rounded-lg overflow-hidden relative">
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
                            <span className="text-sm font-medium text-gray-900 dark:text-white">${pair.volume}M</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Leaderboard + Top Copiers + Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Global Leaderboard */}
                <div className="lg:col-span-6 rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Leaderboard</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Global ranking</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                    <div>
                      <div className="text-5xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">#3</div>
                      <div className="text-sm text-gray-600 dark:text-dark-400 mt-1">Out of 1,284 bots</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-dark-400">Change</div>
                      <div className="text-3xl font-medium text-green-400">↑ 2</div>
                      <div className="text-xs text-gray-500 dark:text-dark-500">This week</div>
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
                            : 'hover:bg-gray-100 dark:bg-dark-800/50'
                        }`}
                      >
                        <span className={leaderBot.highlight ? 'text-gray-900 dark:text-white font-normal' : 'text-gray-500 dark:text-slate-400'}>
                          #{leaderBot.rank} {leaderBot.name}
                        </span>
                        <span className={leaderBot.highlight ? 'text-yellow-400 font-normal font-mono' : 'text-gray-400 dark:text-slate-500 font-mono'}>
                          {leaderBot.roi}
                        </span>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Top Copiers */}
                <div className="lg:col-span-6 rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Medal className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Top Copiers</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Best performers</p>
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
                      <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-dark-800/50 rounded-lg p-3 hover:bg-gray-200 dark:bg-dark-800/70 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${copier.gradient} flex items-center justify-center text-gray-900 dark:text-white font-medium shadow-lg`}>
                            {copier.rank}
                          </div>
                          <div>
                            <div className="text-sm font-normal text-gray-900 dark:text-white">{copier.name}</div>
                            <div className="text-xs text-gray-600 dark:text-dark-400">{copier.roi} ROI</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-green-400 font-mono">{copier.profit}</div>
                      </div>
                    ))}
                  </div>
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
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Activity Heatmap</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Last 30 days trading activity</p>
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
                </div>

                {/* Terminal */}
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-black rounded-[calc(1rem-1px)] overflow-hidden">
                  <div className="bg-gray-50 dark:bg-dark-900 px-3 py-2 border-b border-gray-200 dark:border-dark-700 flex items-center gap-2">
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
              </div>

              {/* Trading Hours & Days */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Best Trading Hours</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Optimal time periods (UTC)</p>
                    </div>
                  </div>
                  <Chart options={tradingHoursChartOptions} series={tradingHoursChartOptions.series} type="bar" height={250} />
                  </div>
                </div>

                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Day of Week Performance</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Weekly trading patterns</p>
                    </div>
                  </div>
                  <Chart options={dayOfWeekChartOptions} series={dayOfWeekChartOptions.series} type="bar" height={250} />
                  </div>
                </div>
              </div>

              {/* Market Conditions */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <CloudSun className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Market Conditions</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Performance across different market states</p>
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
                      <div key={idx} className="bg-gray-100 dark:bg-dark-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-normal text-${condition.color}-400 flex items-center gap-2`}>
                            <IconComponent className="w-4 h-4" />
                            {condition.label}
                          </span>
                          <span className="text-xs text-slate-500">{condition.time}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-1">{condition.return}</div>
                        <div className="text-xs text-slate-400">Avg daily return</div>
                        <div className="mt-2 text-xs text-green-400">Win Rate: {condition.winRate}</div>
                      </div>
                    );
                  })}
                </div>
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
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">SORTINO RATIO</div>
                    <div className="text-xl sm:text-2xl font-medium text-primary-400 mb-2">3.12</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Downside: 2.1%</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">CALMAR RATIO</div>
                    <div className="text-xl sm:text-2xl font-medium text-primary-400 mb-2">2.87</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Return/MaxDD</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">OMEGA RATIO</div>
                    <div className="text-xl sm:text-2xl font-medium text-primary-400 mb-2">2.34</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Threshold: 0%</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-accent-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">TREYNOR RATIO</div>
                    <div className="text-xl sm:text-2xl font-medium text-accent-400 mb-2">1.89</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Beta-adjusted</div>
                  </div>
                </div>
              </div>

              {/* Risk/Reward Scatter */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <BarChart className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Risk/Reward Analysis</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">All trades performance scatter</p>
                  </div>
                </div>
                <Chart options={riskRewardScatterOptions} series={riskRewardScatterOptions.series} type="scatter" height={300} />
                </div>
              </div>

              {/* Consecutive Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">MAX WIN STREAK</div>
                    <div className="text-3xl font-medium text-primary-400 mb-2">47</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Consecutive wins</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-red-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">MAX LOSS STREAK</div>
                    <div className="text-3xl font-medium text-red-400 mb-2">3</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Consecutive losses</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-accent-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">AVG HOLD TIME</div>
                    <div className="text-3xl font-medium text-accent-400 mb-2">4.2h</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Per trade</div>
                  </div>
                </div>
              </div>

              {/* Order Book - Full Width */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Order Book - BTC/USDT</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Real-time market depth</p>
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
                    <div className="grid grid-cols-3 gap-4 mb-2 text-xs text-slate-400 font-medium font-mono px-2 pb-2 border-b border-gray-200 dark:border-dark-700">
                      <div>PRICE (USDT)</div>
                      <div className="text-right">SIZE (BTC)</div>
                      <div className="text-right">TOTAL (USDT)</div>
                    </div>
                    <div className="space-y-0.5">
                      {orderBook.asks.map((ask, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 py-1.5 px-2 bg-gradient-to-r from-transparent to-red-500/10 hover:to-red-500/20 transition-colors font-mono text-xs rounded">
                          <div className="text-red-400 font-normal">{formatNumber(ask.price)}</div>
                          <div className="text-right text-gray-900 dark:text-white">{ask.size}</div>
                          <div className="text-right text-slate-400">{formatNumber(ask.price * parseFloat(ask.size))}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bids (Buy Orders) */}
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-2 text-xs text-slate-400 font-medium font-mono px-2 pb-2 border-b border-gray-200 dark:border-dark-700">
                      <div>PRICE (USDT)</div>
                      <div className="text-right">SIZE (BTC)</div>
                      <div className="text-right">TOTAL (USDT)</div>
                    </div>
                    <div className="space-y-0.5">
                      {orderBook.bids.map((bid, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 py-1.5 px-2 bg-gradient-to-r from-transparent to-green-500/10 hover:to-green-500/20 transition-colors font-mono text-xs rounded">
                          <div className="text-green-400 font-normal">{formatNumber(bid.price)}</div>
                          <div className="text-right text-gray-900 dark:text-white">{bid.size}</div>
                          <div className="text-right text-slate-400">{formatNumber(bid.price * parseFloat(bid.size))}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Price Separator */}
                <div className="text-center py-4 my-4 bg-gray-100 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700">
                  <div className="text-3xl font-medium text-gray-900 dark:text-white font-mono">{orderBook.bids[0]?.price ? formatNumber(orderBook.bids[0].price) : '51,234.50'}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">CURRENT MARKET PRICE</div>
                  <div className="text-sm text-green-400 font-mono mt-1">+2.45% ↗</div>
                </div>
                </div>
              </div>

              {/* Neural Network Visualization */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Neural Network Architecture</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">LSTM + XGBoost Ensemble</p>
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
                          } flex items-center justify-center text-xs font-semibold text-gray-900 dark:text-white shadow-lg ${node === '...' ? '' : 'animate-pulse'}`}
                        >
                          {node}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'ACCURACY', value: '94.2%', color: 'text-primary-400' },
                    { label: 'PRECISION', value: '91.8%', color: 'text-primary-400' },
                    { label: 'RECALL', value: '89.3%', color: 'text-primary-400' },
                    { label: 'F1 SCORE', value: '90.5%', color: 'text-primary-400' },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-dark-800/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1 font-mono">{metric.label}</div>
                      <div className={`text-xl sm:text-2xl font-medium font-mono ${metric.color}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>
                </div>
              </div>

              {/* Fees & Correlation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Fee & Cost Breakdown</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Total operational costs</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Fees Paid', value: '$2,134.56', color: 'text-gray-900 dark:text-white' },
                      { label: 'Exchange Fees', value: '$1,234.00', color: 'text-primary-400' },
                      { label: 'Performance Fees (20%)', value: '$16,912.40', color: 'text-primary-400' },
                      { label: 'Network Fees', value: '$123.16', color: 'text-primary-400' },
                      { label: 'Slippage Cost', value: '$776.00', color: 'text-primary-400' },
                    ].map((fee, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-dark-800/50 rounded-lg p-3">
                        <span className="text-sm text-slate-400">{fee.label}</span>
                        <span className={`text-sm font-medium font-mono ${fee.color}`}>{fee.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-normal text-gray-900 dark:text-white">Net Profit After Fees</span>
                        <span className="text-lg font-medium text-green-400 font-mono">+$65,516.44</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                      <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Correlation Matrix</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Trading pairs correlation</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center overflow-x-auto">
                    <div className="flex gap-1 sm:gap-2">
                      <div className="flex flex-col gap-1 sm:gap-2 mr-1 sm:mr-3">
                        <div className="h-9 sm:h-14"></div>
                        {['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'].map((pair, idx) => (
                          <div key={idx} className="w-9 h-9 sm:w-14 sm:h-14 bg-gray-200 dark:bg-dark-800 text-gray-700 dark:text-slate-400 text-[10px] sm:text-xs flex items-center justify-center border border-gray-300 dark:border-dark-700 rounded font-medium">
                            {pair}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-3">
                          {['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'].map((pair, idx) => (
                            <div key={idx} className="w-9 h-9 sm:w-14 sm:h-14 bg-gray-200 dark:bg-dark-800 text-gray-700 dark:text-slate-400 text-[10px] sm:text-xs flex items-center justify-center border border-gray-300 dark:border-dark-700 rounded font-medium">
                              {pair}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-2">
                          {[1.0, 0.87, 0.72, 0.54, 0.63].map((_, i) => (
                            <div key={i} className="flex gap-1 sm:gap-2">
                              {[1.0, 0.87, 0.72, 0.54, 0.63].map((corr, j) => {
                                const value = i === j ? 1.0 : (Math.random() * 0.6 + 0.2);
                                const color = value > 0.8 ? 'bg-green-500' :
                                             value > 0.6 ? 'bg-green-400' :
                                             value > 0.4 ? 'bg-yellow-500' :
                                             'bg-orange-400';
                                return (
                                  <div key={j} className={`w-9 h-9 sm:w-14 sm:h-14 ${color} text-white text-[10px] sm:text-sm flex items-center justify-center font-medium border border-gray-300 dark:border-dark-700 rounded transition-all hover:scale-110 cursor-pointer`}>
                                    {formatNumber(value)}
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
              </div>

              {/* Feature Importance & Predictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <BarChart className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Feature Importance</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Top 10 ML features</p>
                    </div>
                  </div>
                  <Chart options={featureImportanceChartOptions} series={featureImportanceChartOptions.series} type="bar" height={350} />
                  </div>
                </div>

                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Target className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Model Predictions</h2>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Vs actual returns</p>
                    </div>
                  </div>
                  <Chart options={predictionChartOptions} series={predictionChartOptions.series} type="line" height={300} />
                  </div>
                </div>
              </div>

              {/* Greeks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'DELTA (Δ)', value: '0.74', desc: 'Directional exposure', color: 'text-primary-400', border: 'hover:border-primary-500/50' },
                  { label: 'GAMMA (Γ)', value: '0.12', desc: 'Delta sensitivity', color: 'text-primary-400', border: 'hover:border-primary-500/50' },
                  { label: 'THETA (Θ)', value: '-0.08', desc: 'Time decay', color: 'text-primary-400', border: 'hover:border-primary-500/50' },
                ].map((greek, idx) => (
                  <div key={idx} className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                    <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 ${greek.border} transition-all`}>
                      <h3 className="text-sm font-medium mb-4 text-gray-900 dark:text-white">{greek.label}</h3>
                      <div className={`text-4xl font-semibold mb-2 ${greek.color}`}>{greek.value}</div>
                      <div className="text-xs text-gray-600 dark:text-dark-400">{greek.desc}</div>
                    </div>
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
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">VAR (95%)</div>
                    <div className="text-xl sm:text-2xl font-medium text-red-400 mb-2">-$1,234</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Daily VaR</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-red-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">CVAR (95%)</div>
                    <div className="text-xl sm:text-2xl font-medium text-red-400 mb-2">-$1,567</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Conditional VaR</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">BETA (vs BTC)</div>
                    <div className="text-xl sm:text-2xl font-medium text-primary-400 mb-2">0.74</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Market correlation</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all">
                    <div className="text-xs text-slate-400 mb-2">ALPHA</div>
                    <div className="text-xl sm:text-2xl font-medium text-green-400 mb-2">+12.4%</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Excess return</div>
                  </div>
                </div>
              </div>

              {/* Monte Carlo Simulation */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Monte Carlo Simulation</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">1000 runs, 30 days projection</p>
                  </div>
                </div>
                <Chart options={monteCarloChartOptions} series={monteCarloChartOptions.series} type="line" height={300} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'EXPECTED', value: '+12.4%', color: 'text-green-400' },
                    { label: 'BEST (95%)', value: '+24.7%', color: 'text-accent-400' },
                    { label: 'WORST (5%)', value: '-3.2%', color: 'text-red-400' },
                    { label: 'STD DEV', value: '8.3%', color: 'text-primary-400' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1 font-mono">{stat.label}</div>
                      <div className={`text-xl font-medium font-mono ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                </div>
              </div>

              {/* Underwater Chart */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">Underwater Chart</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Drawdown over time</p>
                  </div>
                </div>
                <Chart options={underwaterChartOptions} series={underwaterChartOptions.series} type="area" height={250} />
                </div>
              </div>

              {/* System Health */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-xl font-medium text-gray-900 dark:text-white">System Health Monitoring</h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">Real-time system status</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">CPU USAGE</span>
                      <span className="text-accent-400 font-mono">{cpuUsage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-500 to-primary-500 transition-all" style={{ width: `${cpuUsage}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">MEMORY</span>
                      <span className="text-green-400 font-mono">{formatNumber(memUsage * 0.04, 1)}GB / 4GB</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${memUsage}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">API LATENCY</span>
                      <span className={`font-mono ${apiLatency < 15 ? 'text-green-400' : 'text-yellow-400'}`}>{apiLatency}ms</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all" style={{ width: `${apiLatency}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 font-mono">UPTIME</span>
                      <span className="text-accent-400 font-mono">23d 14h 32m</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-100 dark:bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">EXCHANGES</div>
                      <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white font-mono">8/8</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">WEBSOCKETS</div>
                      <div className="text-xl sm:text-2xl font-medium text-green-400 font-mono">24/24</div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>


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

      {/* Fixed Bottom CTA Bar — offset by sidebar width on desktop */}
      <div className="fixed bottom-[60px] lg:bottom-0 left-0 right-0 lg:left-64 z-50 border-t border-gray-200 dark:border-dark-700/50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            {masterBotData.icon.startsWith('/') ? (
              <img src={masterBotData.icon} alt={masterBotData.name} className="w-8 h-8 object-contain flex-shrink-0" />
            ) : (
              <span className="text-lg flex-shrink-0">{masterBotData.icon}</span>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{masterBotData.name}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400 font-mono">
                from ${masterBotData.minInvestment} &middot; {masterBotData.reservationDays || masterBotData.lockInDays || 30}d reservation
              </div>
            </div>
            <div className="flex-shrink-0 text-right pl-3 border-l border-gray-200 dark:border-dark-700">
              <div className="text-xs text-gray-500 dark:text-slate-400">Est. 30d ROI</div>
              <div className="text-sm font-bold text-green-400">+{masterBotData.stats.return30d || 0}%</div>
            </div>
          </div>
          <Link
            href={`/dashboard-v2/bots/${slug}/copy`}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 whitespace-nowrap"
          >
            <Rocket className="w-4 h-4" />
            Copy This Bot
          </Link>
        </div>
      </div>
    </div>
  );
}

interface MasterStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  valueColor?: string;
}

function MasterStatCard({ icon, label, value, subtitle, subtitleColor = 'text-green-400', valueColor = 'text-gray-900 dark:text-white' }: MasterStatCardProps) {
  return (
    <div className="p-2.5 sm:p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700/50 hover:border-primary-500/30 transition-all">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        {icon}
        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400">{label}</div>
      </div>
      <div className={`text-sm sm:text-xl font-medium ${valueColor}`}>{value}</div>
      <div className={`hidden sm:block text-xs ${subtitleColor} mt-1`}>{subtitle}</div>
    </div>
  );
}
