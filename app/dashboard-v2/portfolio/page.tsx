'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Bot,
  Shield,
  Zap,
  Activity,
  Plus,
  Clock,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Percent,
  Gauge,
  Filter,
  ArrowUpDown,
  GitCompare,
  Sliders,
  Power,
  AlertOctagon,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  Lock,
  PieChart,
  Coins,
  Bitcoin,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
  FileText,
  Settings,
} from 'lucide-react';
import MiniChart from '@/components/dashboard-v2/MiniChart';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ActiveBot {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  invested: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  startDate: string;
  trades: number;
  winRate: number;
  status: 'active' | 'paused';
  performanceData: number[];
}

const mockActiveBots: ActiveBot[] = [
  {
    id: '1',
    name: 'AlphaBot Pro',
    slug: 'alphabot',
    icon: <Shield className="w-6 h-6 text-green-400" />,
    invested: 5000,
    currentValue: 6847.50,
    profit: 1847.50,
    profitPercent: 36.95,
    dailyChange: 124.80,
    dailyChangePercent: 1.86,
    startDate: '2024-11-15',
    trades: 247,
    winRate: 73.2,
    status: 'active',
    performanceData: [5000, 5150, 5280, 5320, 5480, 5650, 5720, 5890, 6020, 6100, 6240, 6350, 6420, 6580, 6650, 6720, 6800, 6750, 6820, 6880, 6920, 6850, 6900, 6950, 7020, 7100, 7050, 6980, 7020, 6847.50],
  },
  {
    id: '2',
    name: 'ProTrader Elite',
    slug: 'protrader',
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    invested: 3000,
    currentValue: 3642.30,
    profit: 642.30,
    profitPercent: 21.41,
    dailyChange: -42.10,
    dailyChangePercent: -1.14,
    startDate: '2024-12-01',
    trades: 156,
    winRate: 68.5,
    status: 'active',
    performanceData: [3000, 3080, 3150, 3220, 3180, 3250, 3320, 3280, 3350, 3420, 3380, 3450, 3520, 3480, 3550, 3620, 3580, 3650, 3720, 3680, 3750, 3820, 3780, 3850, 3920, 3880, 3684, 3642.30],
  },
  {
    id: '3',
    name: 'SafeGrowth Bot',
    slug: 'safegrowth',
    icon: <Activity className="w-6 h-6 text-purple-400" />,
    invested: 2000,
    currentValue: 2284.50,
    profit: 284.50,
    profitPercent: 14.23,
    dailyChange: 18.40,
    dailyChangePercent: 0.81,
    startDate: '2024-12-10',
    trades: 89,
    winRate: 71.9,
    status: 'active',
    performanceData: [2000, 2020, 2050, 2080, 2070, 2090, 2110, 2130, 2150, 2140, 2160, 2180, 2200, 2220, 2210, 2230, 2250, 2240, 2260, 2266, 2284.50],
  },
];

// Risk metrics data
const riskMetrics = {
  sharpeRatio: 2.34,
  maxDrawdown: 12.5,
  volatility: 18.3,
  riskScore: 6.8,
};

// Portfolio alerts
const portfolioAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Performance Detected',
    message: 'ProTrader Elite has -1.14% daily change. Consider reviewing settings.',
    bot: 'ProTrader Elite',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    type: 'success',
    title: 'Milestone Reached',
    message: 'Your portfolio has reached $12,774 total value!',
    timestamp: Date.now() - 7200000,
  },
];

// Asset distribution by cryptocurrency
const assetDistribution = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.15, value: 6432.75, percentage: 50.3, change24h: 2.4 },
  { symbol: 'ETH', name: 'Ethereum', amount: 1.8, value: 4047.54, percentage: 31.7, change24h: -1.2 },
  { symbol: 'BNB', name: 'Binance Coin', amount: 8.5, value: 2419.25, percentage: 18.9, change24h: 0.8 },
  { symbol: 'SOL', name: 'Solana', amount: 25.0, value: 2456.25, percentage: 19.2, change24h: 3.1 },
];

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [botFilter, setBotFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [botSortBy, setBotSortBy] = useState<'profit' | 'roi' | 'winRate' | 'age'>('profit');
  const [allocationView, setAllocationView] = useState<'bots' | 'crypto'>('bots');

  // Risk Management States
  const [showRiskSettings, setShowRiskSettings] = useState(false);
  const [showAdvancedLimits, setShowAdvancedLimits] = useState(false);
  const [expandedBotSettings, setExpandedBotSettings] = useState<string | null>(null);
  const [maxDrawdownLimit, setMaxDrawdownLimit] = useState(20);
  const [dailyLossLimit, setDailyLossLimit] = useState(5);
  const [maxPositionSize, setMaxPositionSize] = useState(30);
  const [autoStopEnabled, setAutoStopEnabled] = useState(true);
  const [autoRebalanceEnabled, setAutoRebalanceEnabled] = useState(true);
  const [rebalanceThreshold, setRebalanceThreshold] = useState(10);
  const [trailingStopEnabled, setTrailingStopEnabled] = useState(false);
  const [trailingStopPercent, setTrailingStopPercent] = useState(8);
  const [maxConcurrentTrades, setMaxConcurrentTrades] = useState(10);
  const [emergencyStopActive, setEmergencyStopActive] = useState(false);

  const totalInvested = mockActiveBots.reduce((sum, bot) => sum + bot.invested, 0);
  const totalCurrentValue = mockActiveBots.reduce((sum, bot) => sum + bot.currentValue, 0);
  const totalPortfolioValue = totalCurrentValue; // Alias for clarity
  const totalProfit = totalCurrentValue - totalInvested;
  const totalProfitPercent = (totalProfit / totalInvested) * 100;
  const dailyChange = mockActiveBots.reduce((sum, bot) => sum + bot.dailyChange, 0);
  const dailyChangePercent = (dailyChange / totalCurrentValue) * 100;

  // Calculate dynamic values
  const biggestPosition = Math.max(...mockActiveBots.map(bot => (bot.currentValue / totalCurrentValue) * 100));
  const activeTrades = mockActiveBots.reduce((sum, bot) => sum + (bot.status === 'active' ? 1 : 0), 0);

  // Filter and sort bots
  const filteredBots = mockActiveBots
    .filter(bot => botFilter === 'all' || bot.status === botFilter)
    .sort((a, b) => {
      switch (botSortBy) {
        case 'profit':
          return b.profit - a.profit;
        case 'roi':
          return b.profitPercent - a.profitPercent;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'age':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        default:
          return 0;
      }
    });

  // Portfolio performance chart
  const performanceChartOptions: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      zoom: { enabled: false },
    },
    theme: { mode: 'dark' },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#4F46E5'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: '#4F46E5', opacity: 0.4 },
          { offset: 100, color: '#06B6D4', opacity: 0.1 },
        ],
      },
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4,
    },
    xaxis: {
      categories: timeRange === '7d'
        ? ['Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29']
        : timeRange === '30d'
        ? ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30']
        : timeRange === '90d'
        ? ['Nov', 'Dec', 'Jan']
        : ['Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Jan'],
      labels: { style: { colors: '#94A3B8', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '12px' },
        formatter: (val: number) => `$${val.toFixed(0)}`,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
    },
  };

  const performanceChartSeries = [
    {
      name: 'Portfolio Value',
      data: timeRange === '7d'
        ? [10000, 10250, 10420, 10180, 10650, 11240, 12774]
        : timeRange === '30d'
        ? [10000, 10350, 10820, 11150, 11480, 12120, 12774]
        : timeRange === '90d'
        ? [8500, 9800, 12774]
        : [6000, 7200, 8100, 8900, 9800, 11200, 12774],
    },
  ];

  // Asset allocation chart (by bots)
  const allocationChartOptions: any = {
    chart: {
      type: 'donut',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    theme: { mode: 'dark' },
    labels: mockActiveBots.map(bot => bot.name),
    colors: ['#6366F1', '#14B8A6', '#F59E0B'],
    stroke: {
      show: false,
      width: 0,
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: '#94A3B8',
        useSeriesColors: false,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 3,
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 6,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        expandOnClick: true,
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#E2E8F0',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#FFFFFF',
              offsetY: 10,
              formatter: (val: number) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Value',
              fontSize: '14px',
              fontWeight: 500,
              color: '#94A3B8',
              formatter: () => `$${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.15,
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.15,
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      },
    },
  };

  const allocationChartSeries = mockActiveBots.map(bot => bot.currentValue);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-primary-400" />
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              My Portfolio
            </h1>
          </div>
          <p className="text-dark-300">
            Track your active bots and overall performance
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/wallets/deposit"
              className="group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Deposit</div>
                  <div className="text-xs text-dark-400">Add funds</div>
                </div>
              </div>
            </Link>

            <Link
              href="/wallets/withdraw"
              className="group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Withdraw</div>
                  <div className="text-xs text-dark-400">Cash out</div>
                </div>
              </div>
            </Link>

            <button
              onClick={() => {}}
              className="group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                  <Repeat className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Rebalance</div>
                  <div className="text-xs text-dark-400">Optimize</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {}}
              className="group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 transition-all duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Export</div>
                  <div className="text-xs text-dark-400">Download report</div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Portfolio Overview Cards - Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Value - Main Card (3 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="lg:col-span-3 relative group bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:translate-x-16 group-hover:-translate-y-16 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                    <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary-400" />
                    </div>
                    <span className="font-medium">Total Portfolio Value</span>
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    ${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center gap-2 text-base font-semibold ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-5 h-5" />
                    {dailyChange >= 0 ? '+' : ''}{dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
                    <span className="text-xs text-dark-400 font-normal">today</span>
                  </div>
                </div>
                {/* Mini sparkline chart placeholder */}
                <div className="hidden xl:block w-32 h-20 bg-dark-900/50 rounded-lg border border-dark-700/50 p-2">
                  <div className="w-full h-full flex items-end gap-1">
                    {[40, 65, 55, 80, 75, 90, 85].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-sm" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Invested - Compact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.03, y: -6 }}
            className="lg:col-span-1 relative group bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-xs text-dark-400 mb-2 font-medium">Total Invested</div>
              <div className="text-2xl font-bold text-white mb-1">
                ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
              <div className="flex items-center gap-1 text-xs text-dark-400">
                <Bot className="w-3 h-3" />
                {mockActiveBots.length} bots
              </div>
            </div>
          </motion.div>

          {/* Total Profit - Compact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -6 }}
            className="lg:col-span-1 relative group bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-green-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-xs text-dark-400 mb-2 font-medium">Total Profit</div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                +${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-green-400 font-semibold">
                +{totalProfitPercent.toFixed(1)}% ROI
              </div>
            </div>
          </motion.div>

          {/* Active Bots - Compact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.03, y: -6 }}
            className="lg:col-span-1 relative group bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-xs text-dark-400 mb-2 font-medium">Active Bots</div>
              <div className="text-2xl font-bold text-white mb-1">
                {mockActiveBots.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-dark-400">
                <BarChart3 className="w-3 h-3" />
                {mockActiveBots.reduce((sum, bot) => sum + bot.trades, 0)} trades
              </div>
            </div>
          </motion.div>
        </div>

        {/* Risk Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Risk Metrics</h2>
                  <p className="text-xs text-dark-400">Portfolio risk assessment</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Sharpe Ratio - Featured Card (spans 2 columns) */}
              <div className="lg:col-span-2 relative group bg-dark-900/50 border border-dark-700/50 hover:border-green-500/50 rounded-xl p-5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-dark-300">Sharpe Ratio</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-green-500/20 text-green-400 font-semibold">Excellent</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-3">
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((riskMetrics.sharpeRatio / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-dark-400">Risk-adjusted return performance</div>
                </div>
              </div>

              {/* Max Drawdown - Compact Card */}
              <div className="lg:col-span-2 relative group bg-dark-900/50 border border-dark-700/50 hover:border-yellow-500/50 rounded-xl p-5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium text-dark-300">Max Drawdown</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 font-semibold">Moderate</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-3">
                    -{riskMetrics.maxDrawdown.toFixed(1)}%
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${riskMetrics.maxDrawdown}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-dark-400">Peak-to-trough decline</div>
                </div>
              </div>

              {/* Volatility - Compact Card */}
              <div className="lg:col-span-1 relative group bg-dark-900/50 border border-dark-700/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-3">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xs text-dark-400 mb-2">Volatility</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {riskMetrics.volatility.toFixed(1)}%
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(riskMetrics.volatility / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Risk Score - Compact Card */}
              <div className="lg:col-span-1 relative group bg-dark-900/50 border border-dark-700/50 hover:border-primary-500/50 rounded-xl p-4 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center mb-3">
                    <Gauge className="w-4 h-4 text-primary-400" />
                  </div>
                  <div className="text-xs text-dark-400 mb-2">Risk Score</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {riskMetrics.riskScore.toFixed(1)}/10
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      style={{ width: `${(riskMetrics.riskScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Chart + Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Portfolio Performance</h2>
              <div className="flex gap-2">
                {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <Chart
              options={performanceChartOptions}
              series={performanceChartSeries}
              type="area"
              height={350}
            />
          </motion.div>

          {/* Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-1 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Asset Allocation</h2>
                <p className="text-xs text-dark-400">By bot</p>
              </div>
            </div>

            <div className="relative">
              <Chart
                options={allocationChartOptions}
                series={allocationChartSeries}
                type="donut"
                height={320}
              />
            </div>
          </motion.div>
        </div>

        {/* Risk Management - Unified Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden">
            {/* Header - Always visible */}
            <button
              onClick={() => setShowRiskSettings(!showRiskSettings)}
              className="w-full p-6 flex items-center justify-between hover:bg-dark-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  emergencyStopActive
                    ? 'bg-red-500/20 border border-red-500/30'
                    : 'bg-purple-500/20 border border-purple-500/30'
                }`}>
                  {emergencyStopActive ? (
                    <Lock className="w-5 h-5 text-red-400" />
                  ) : (
                    <Sliders className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white">Risk Management</h2>
                  <p className="text-sm text-dark-400">
                    Current status & protection limits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {/* Current Risk Metrics Preview */}
                <div className="hidden lg:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-dark-500">Sharpe Ratio</div>
                    <div className="text-lg font-bold text-green-400">{riskMetrics.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-dark-500">Drawdown</div>
                    <div className="text-lg font-bold text-yellow-400">{riskMetrics.maxDrawdown}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-dark-500">Volatility</div>
                    <div className="text-lg font-bold text-blue-400">{riskMetrics.volatility}%</div>
                  </div>
                </div>
                {showRiskSettings ? (
                  <ChevronUp className="w-5 h-5 text-dark-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                )}
              </div>
            </button>

            {/* Expandable Settings Content */}
            {showRiskSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-dark-700"
              >
                <div className="p-6 space-y-8">
                  {/* Emergency Controls */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-red-400" />
                      Emergency Controls
                    </h3>
                    <button
                      onClick={() => setEmergencyStopActive(!emergencyStopActive)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        emergencyStopActive
                          ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                          : 'bg-dark-900/50 border-dark-700 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Power className={`w-6 h-6 ${emergencyStopActive ? 'text-red-400' : 'text-dark-400'}`} />
                        <div className="text-left">
                          <div className="text-sm font-bold text-white">Emergency Stop</div>
                          <div className="text-xs text-dark-400">Halt all trading immediately</div>
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${emergencyStopActive ? 'text-red-400' : 'text-dark-500'}`}>
                        {emergencyStopActive ? 'ACTIVE - All trading stopped' : 'Click to activate'}
                      </div>
                    </button>
                  </div>

                  {/* Portfolio Protection - Simplified */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Portfolio Protection
                    </h3>

                    {/* Main Protection - Max Portfolio Loss */}
                    <div className="p-6 bg-dark-900/50 border-2 border-red-500/30 rounded-xl hover:border-red-500/50 transition-colors mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <label className="text-base font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Maximum Portfolio Loss
                          </label>
                          <p className="text-xs text-dark-400 mt-1">
                            All trading will automatically stop when total portfolio drops by this amount
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${
                          riskMetrics.maxDrawdown < maxDrawdownLimit
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          -{maxDrawdownLimit}%
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-dark-400">Current Portfolio Loss</span>
                          <span className={`font-bold ${
                            riskMetrics.maxDrawdown < maxDrawdownLimit * 0.5
                              ? 'text-green-400'
                              : riskMetrics.maxDrawdown < maxDrawdownLimit * 0.8
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            -{riskMetrics.maxDrawdown}% (${(totalPortfolioValue * riskMetrics.maxDrawdown / 100).toFixed(0)})
                          </span>
                        </div>
                        <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all rounded-full ${
                              riskMetrics.maxDrawdown < maxDrawdownLimit * 0.5
                                ? 'bg-green-500'
                                : riskMetrics.maxDrawdown < maxDrawdownLimit * 0.8
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (riskMetrics.maxDrawdown / maxDrawdownLimit) * 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-green-400">Safe</span>
                          <span className="text-red-400">Limit: -{maxDrawdownLimit}% (${(totalPortfolioValue * maxDrawdownLimit / 100).toFixed(0)})</span>
                        </div>
                      </div>

                      {/* Slider Control */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setMaxDrawdownLimit(Math.max(5, maxDrawdownLimit - 5))}
                          className="w-10 h-10 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          -
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={maxDrawdownLimit}
                            onChange={(e) => setMaxDrawdownLimit(Number(e.target.value))}
                            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                          />
                          <div className="flex items-center justify-between text-xs mt-2">
                            <span className="text-dark-500">Conservative (-5%)</span>
                            <span className="text-dark-500">Moderate (-25%)</span>
                            <span className="text-dark-500">Aggressive (-50%)</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setMaxDrawdownLimit(Math.min(50, maxDrawdownLimit + 5))}
                          className="w-10 h-10 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Warning Message */}
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-200">
                          <strong>Important:</strong> When this limit is reached, all active bots will be stopped automatically
                          and you'll receive a notification. You can manually restart trading after reviewing your strategy.
                        </p>
                      </div>
                    </div>

                    {/* Advanced Settings - Collapsible */}
                    <div className="border border-dark-700/50 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setShowAdvancedLimits(!showAdvancedLimits)}
                        className="w-full p-4 bg-dark-900/30 hover:bg-dark-800/50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-dark-400" />
                          <span className="text-sm font-semibold text-dark-300">Advanced Protection Settings</span>
                          <span className="text-xs text-dark-500">(Optional)</span>
                        </div>
                        {showAdvancedLimits ? (
                          <ChevronUp className="w-4 h-4 text-dark-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-dark-400" />
                        )}
                      </button>

                      {showAdvancedLimits && (
                        <div className="p-4 bg-dark-900/20 border-t border-dark-700/50">
                          {/* Daily Loss Limit */}
                          <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <label className="text-sm font-semibold text-white flex items-center gap-2">
                                  <TrendingDown className="w-4 h-4 text-orange-400" />
                                  Daily Loss Limit
                                </label>
                                <p className="text-xs text-dark-400 mt-1">Additional protection: max loss allowed per day</p>
                              </div>
                              <div className="px-3 py-1 rounded-lg font-bold text-lg bg-orange-500/20 text-orange-400">
                                -{dailyLossLimit}%
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() => setDailyLossLimit(Math.max(1, dailyLossLimit - 1))}
                                className="w-8 h-8 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center text-white transition-colors"
                              >
                                -
                              </button>
                              <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={dailyLossLimit}
                                onChange={(e) => setDailyLossLimit(Number(e.target.value))}
                                className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                              />
                              <button
                                onClick={() => setDailyLossLimit(Math.min(20, dailyLossLimit + 1))}
                                className="w-8 h-8 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center text-white transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-dark-500">Min: 1%</span>
                              <div className={`font-medium ${dailyChangePercent < 0 && Math.abs(dailyChangePercent) > dailyLossLimit ? 'text-red-400' : 'text-green-400'}`}>
                                Today: {dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(1)}%
                              </div>
                              <span className="text-dark-500">Max: 20%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Automated Rules */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary-400" />
                      Automated Safety Rules
                    </h3>
                    <div className="space-y-4">
                      {/* Auto-Stop */}
                      <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-semibold text-white">Auto-Stop on Limit Breach</div>
                              <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                                autoStopEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {autoStopEnabled ? 'ENABLED' : 'DISABLED'}
                              </div>
                            </div>
                            <p className="text-xs text-dark-400">Automatically stop all bots when any limit is reached</p>
                          </div>
                          <button
                            onClick={() => setAutoStopEnabled(!autoStopEnabled)}
                            className={`ml-4 w-12 h-6 rounded-full transition-colors relative ${
                              autoStopEnabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              autoStopEnabled ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      </div>

                      {/* Auto-Rebalance - Improved with Visual Explanation */}
                      <div className="p-5 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Repeat className="w-4 h-4 text-purple-400" />
                              <div className="text-sm font-semibold text-white">Auto-Rebalance Portfolio</div>
                              <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                                autoRebalanceEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {autoRebalanceEnabled ? 'ENABLED' : 'DISABLED'}
                              </div>
                            </div>
                            <p className="text-xs text-dark-400">Restore target allocation when bots drift from their targets</p>
                          </div>
                          <button
                            onClick={() => setAutoRebalanceEnabled(!autoRebalanceEnabled)}
                            className={`ml-4 w-12 h-6 rounded-full transition-colors relative ${
                              autoRebalanceEnabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              autoRebalanceEnabled ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>

                        {autoRebalanceEnabled && (
                          <div className="mt-4 space-y-4">
                            {/* Threshold Slider */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-dark-400">Trigger when allocation drifts by</label>
                                <span className="text-sm font-bold text-purple-400">{rebalanceThreshold}%</span>
                              </div>
                              <input
                                type="range"
                                min="5"
                                max="30"
                                step="1"
                                value={rebalanceThreshold}
                                onChange={(e) => setRebalanceThreshold(Number(e.target.value))}
                                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                              />
                              <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                                <span>Frequent (5%)</span>
                                <span>Balanced (15%)</span>
                                <span>Rare (30%)</span>
                              </div>
                            </div>

                            {/* Visual Example */}
                            <div className="p-3 bg-dark-800/50 border border-purple-500/20 rounded-lg">
                              <div className="text-xs font-medium text-purple-300 mb-3">Example: Equal Distribution Strategy</div>

                              {/* Before Rebalance */}
                              <div className="mb-3">
                                <div className="text-xs text-dark-400 mb-1.5 flex items-center justify-between">
                                  <span>Current State (Drifted)</span>
                                  <span className="text-yellow-400">⚠️ Needs rebalancing</span>
                                </div>
                                <div className="flex gap-1 h-6 rounded overflow-hidden">
                                  <div className="bg-blue-500 flex items-center justify-center" style={{width: '45%'}}>
                                    <span className="text-[10px] font-bold text-white">Bot A 45%</span>
                                  </div>
                                  <div className="bg-purple-500 flex items-center justify-center" style={{width: '32%'}}>
                                    <span className="text-[10px] font-bold text-white">Bot B 32%</span>
                                  </div>
                                  <div className="bg-green-500 flex items-center justify-center" style={{width: '23%'}}>
                                    <span className="text-[10px] font-bold text-white">Bot C 23%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Arrow */}
                              <div className="flex justify-center my-2">
                                <ArrowDownRight className="w-4 h-4 text-purple-400" />
                              </div>

                              {/* After Rebalance */}
                              <div>
                                <div className="text-xs text-dark-400 mb-1.5 flex items-center justify-between">
                                  <span>After Rebalance</span>
                                  <span className="text-green-400">✓ Balanced</span>
                                </div>
                                <div className="flex gap-1 h-6 rounded overflow-hidden">
                                  <div className="bg-blue-500/80 flex items-center justify-center" style={{width: '33.3%'}}>
                                    <span className="text-[10px] font-bold text-white">33%</span>
                                  </div>
                                  <div className="bg-purple-500/80 flex items-center justify-center" style={{width: '33.3%'}}>
                                    <span className="text-[10px] font-bold text-white">33%</span>
                                  </div>
                                  <div className="bg-green-500/80 flex items-center justify-center" style={{width: '33.4%'}}>
                                    <span className="text-[10px] font-bold text-white">34%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Explanation */}
                              <div className="mt-3 text-[11px] text-dark-400 leading-relaxed">
                                Bot A drifted +12% from target → System will close some positions in Bot A
                                and redistribute funds to Bot B and C to restore equal distribution.
                              </div>
                            </div>

                            {/* Info Note */}
                            <div className="flex items-start gap-2 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                              <AlertTriangle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <p className="text-[11px] text-blue-200 leading-relaxed">
                                <strong>Note:</strong> Rebalancing will close profitable positions to maintain your target allocation.
                                Set higher threshold (20-30%) if you prefer to let winners run.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Trailing Stop */}
                      <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-semibold text-white">Trailing Stop-Loss</div>
                              <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                                trailingStopEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {trailingStopEnabled ? 'ENABLED' : 'DISABLED'}
                              </div>
                            </div>
                            <p className="text-xs text-dark-400">Protect profits with dynamic stop-loss</p>
                          </div>
                          <button
                            onClick={() => setTrailingStopEnabled(!trailingStopEnabled)}
                            className={`ml-4 w-12 h-6 rounded-full transition-colors relative ${
                              trailingStopEnabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              trailingStopEnabled ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                        {trailingStopEnabled && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs text-dark-400">Trailing Distance</label>
                              <span className="text-sm font-bold text-white">{trailingStopPercent}%</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="20"
                              step="0.5"
                              value={trailingStopPercent}
                              onChange={(e) => setTrailingStopPercent(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Settings
                    </button>
                    <button className="px-6 py-3 bg-dark-900 border border-dark-700 rounded-lg font-semibold text-dark-300 hover:text-white hover:border-dark-600 transition-all flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>


        {/* Secondary Grid - Pending Actions & Projected Returns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Pending Actions</h2>
                  <p className="text-xs text-dark-400">Review & approve</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">AlphaBot Pro Rebalance</div>
                      <div className="text-xs text-dark-400">Recommended allocation change</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-semibold">Recommended</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-xs font-semibold text-primary-400 hover:bg-primary-500/30 transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-xs font-semibold text-dark-300 hover:text-white transition-colors">
                    Decline
                  </button>
                </div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl hover:border-yellow-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">ProTrader Elite - Low Performance</div>
                      <div className="text-xs text-dark-400">Consider pausing or adjusting</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-semibold">Warning</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-xs font-semibold text-primary-400 hover:bg-primary-500/30 transition-colors">
                    Review Settings
                  </button>
                  <button className="flex-1 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-xs font-semibold text-dark-300 hover:text-white transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Projected Returns Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Projected Returns</h2>
                  <p className="text-xs text-dark-400">Based on current performance</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                <div className="text-xs text-dark-400 mb-2">7 Days</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-400">
                    +$456.80
                  </div>
                  <div className="text-sm text-green-400 font-semibold">
                    +3.6%
                  </div>
                </div>
                <div className="mt-3 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="text-xs text-dark-500 mt-2">78% confidence</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                <div className="text-xs text-dark-400 mb-2">30 Days</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-400">
                    +$1,842.30
                  </div>
                  <div className="text-sm text-green-400 font-semibold">
                    +14.4%
                  </div>
                </div>
                <div className="mt-3 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '64%' }} />
                </div>
                <div className="text-xs text-dark-500 mt-2">64% confidence</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700/50 rounded-xl">
                <div className="text-xs text-dark-400 mb-2">90 Days</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-400">
                    +$5,124.60
                  </div>
                  <div className="text-sm text-green-400 font-semibold">
                    +40.1%
                  </div>
                </div>
                <div className="mt-3 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '52%' }} />
                </div>
                <div className="text-xs text-dark-500 mt-2">52% confidence</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Bots - 2 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Active Bots</h2>
            <Link
              href="/dashboard-v2/bots"
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Bot
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl">
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-dark-400" />
                <span className="text-sm text-dark-400">Status:</span>
                <div className="flex gap-2">
                  {(['all', 'active', 'paused'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setBotFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        botFilter === status
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'bg-dark-900/50 text-dark-400 border border-dark-700/50 hover:border-primary-500/30'
                      }`}
                    >
                      {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Paused'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-6 w-px bg-dark-700" />

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-dark-400" />
                <span className="text-sm text-dark-400">Sort by:</span>
                <div className="flex gap-2">
                  {([
                    { key: 'profit', label: 'Profit' },
                    { key: 'roi', label: 'ROI' },
                    { key: 'winRate', label: 'Win Rate' },
                    { key: 'age', label: 'Age' },
                  ] as const).map(sort => (
                    <button
                      key={sort.key}
                      onClick={() => setBotSortBy(sort.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        botSortBy === sort.key
                          ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                          : 'bg-dark-900/50 text-dark-400 border border-dark-700/50 hover:border-accent-500/30'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredBots.map((bot, index) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-14 h-14 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl flex items-center justify-center shadow-md"
                        >
                          {bot.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {bot.name}
                            {bot.status === 'active' && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-dark-400 mt-1">
                            <Clock className="w-3 h-3" />
                            Running for {Math.floor((Date.now() - new Date(bot.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                          bot.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          <Activity className="w-3 h-3" />
                          {bot.status === 'active' ? 'Active' : 'Paused'}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedBotSettings(expandedBotSettings === bot.id ? null : bot.id);
                          }}
                          className="w-8 h-8 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg flex items-center justify-center text-dark-400 hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                      {/* Mini Chart */}
                      <div className="mb-6 bg-dark-900/50 rounded-xl p-4 border border-dark-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-dark-400 flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            30-Day Performance
                          </span>
                          <span className={`text-sm font-bold ${bot.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {bot.profit >= 0 ? '+' : ''}${bot.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <MiniChart
                          data={bot.performanceData}
                          color={bot.profit >= 0 ? '#10b981' : '#ef4444'}
                          height={80}
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                          <div className="text-xs text-blue-300 mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Invested
                          </div>
                          <div className="text-sm font-bold text-white">
                            ${bot.invested.toLocaleString()}
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
                          <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Current
                          </div>
                          <div className="text-sm font-bold text-white">
                            ${bot.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
                          <div className="text-xs text-green-300 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Profit
                          </div>
                          <div className="text-sm font-bold text-green-400">
                            +${bot.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-green-400/70">
                            +{bot.profitPercent}%
                          </div>
                        </div>

                        <div className={`bg-gradient-to-br rounded-xl p-4 border ${
                          bot.dailyChange >= 0
                            ? 'from-green-500/10 to-green-600/5 border-green-500/20'
                            : 'from-red-500/10 to-red-600/5 border-red-500/20'
                        }`}>
                          <div className={`text-xs mb-1 flex items-center gap-1 ${bot.dailyChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            <Activity className="w-3 h-3" />
                            24h Change
                          </div>
                          <div className={`text-sm font-bold ${bot.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {bot.dailyChange >= 0 ? '+' : ''}${Math.abs(bot.dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-xs ${bot.dailyChange >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                            {bot.dailyChangePercent >= 0 ? '+' : ''}{bot.dailyChangePercent}%
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
                          <div className="text-xs text-yellow-300 mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Win Rate
                          </div>
                          <div className="text-sm font-bold text-white">
                            {bot.winRate}%
                          </div>
                          <div className="text-xs text-dark-400">
                            {bot.trades} trades
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-6">
                        <Link
                          href={`/dashboard-v2/bots/${bot.slug}`}
                          className="flex-1 px-4 py-2.5 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg font-medium text-primary-400 hover:text-primary-300 transition-all text-center text-sm"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Pause/Resume logic
                          }}
                          className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                            bot.status === 'active'
                              ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                              : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400'
                          }`}
                        >
                          {bot.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                      </div>

                    {/* Bot Settings Panel - Collapsible */}
                    {expandedBotSettings === bot.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-dark-700"
                      >
                        <div className="p-6 bg-dark-900/30 space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Settings className="w-4 h-4 text-purple-400" />
                            <h4 className="text-sm font-bold text-white">Bot Settings</h4>
                            <span className="text-xs text-dark-500">Individual risk limits for this bot</span>
                          </div>

                          {/* Allocation */}
                          <div className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <label className="text-sm font-semibold text-white flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-blue-400" />
                                  Allocation
                                </label>
                                <p className="text-xs text-dark-400 mt-1">Funds allocated to this bot</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-white">${bot.invested.toLocaleString()}</div>
                                <div className="text-xs text-dark-400">{((bot.invested / totalPortfolioValue) * 100).toFixed(1)}% of portfolio</div>
                              </div>
                            </div>
                          </div>

                          {/* Max Loss */}
                          <div className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-semibold text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                Max Loss for This Bot
                              </label>
                              <span className="text-sm font-bold text-red-400">-10%</span>
                            </div>
                            <p className="text-xs text-dark-400 mb-3">Stop this bot when it loses this much</p>
                            <input
                              type="range"
                              min="5"
                              max="30"
                              defaultValue="10"
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                              <span>Conservative (-5%)</span>
                              <span>Moderate (-15%)</span>
                              <span>Aggressive (-30%)</span>
                            </div>
                          </div>

                          {/* Max Positions */}
                          <div className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-semibold text-white flex items-center gap-2">
                                <GitCompare className="w-4 h-4 text-purple-400" />
                                Max Open Positions
                              </label>
                              <span className="text-sm font-bold text-purple-400">3</span>
                            </div>
                            <p className="text-xs text-dark-400 mb-3">Maximum concurrent trades for this bot</p>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              defaultValue="3"
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                              <span>1</span>
                              <span>5</span>
                              <span>10</span>
                            </div>
                          </div>

                          {/* Position Size Limit */}
                          <div className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-semibold text-white flex items-center gap-2">
                                <Percent className="w-4 h-4 text-green-400" />
                                Max Position Size
                              </label>
                              <span className="text-sm font-bold text-green-400">40%</span>
                            </div>
                            <p className="text-xs text-dark-400 mb-3">Maximum % of bot allocation per position</p>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              defaultValue="40"
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                            <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                              <span>10%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>

                          {/* Save Button */}
                          <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Bot Settings
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
