'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Clock,
  Award,
  AlertTriangle,
  Zap,
  ArrowLeft,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { botManager } from '@/lib/BotManager';
import { priceService } from '@/lib/PriceService';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EquityPoint {
  timestamp: number;
  value: number;
}

interface AnalyticsTrade {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  pnl: number;
  pnlPercent: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  amount: number;
  positionSize: number;
  duration: string;
  closedAt: string;
  date: string;
  botName: string;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [equityData, setEquityData] = useState<EquityPoint[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [tradingStats, setTradingStats] = useState({
    avgHoldTime: '0h',
    winLossRatio: 0,
    wins: 0,
    losses: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    totalVolume: 0,
    bestStreak: 0,
    bestDay: 0,
    bestDayDate: '',
  });
  const [bestTrades, setBestTrades] = useState<AnalyticsTrade[]>([]);
  const [worstTrades, setWorstTrades] = useState<AnalyticsTrade[]>([]);
  const [assetDistribution, setAssetDistribution] = useState<{ pair: string; percentage: number; color: string }[]>([]);
  const [botsComparison, setBotsComparison] = useState<{ name: string; profit: number }[]>([]);

  useEffect(() => {
    // Load bots
    botManager.load();

    // Connect to price service
    priceService.connect();
    const unsubscribe = priceService.subscribe((prices) => {
      botManager.tick(prices);
    });

    // Update data every second
    const interval = setInterval(() => {
      const allStats = botManager.getAllStats();

      if (allStats.length === 0) {
        return;
      }

      // Calculate totals
      let invested = 0;
      let totalValue = 0;
      let totalPnL = 0;

      allStats.forEach(stats => {
        const bot = botManager.getBot(stats.id);
        const config = bot?.getConfig();
        if (config) {
          invested += config.investedCapital;
          const currentValue = config.investedCapital + stats.totalPnL;
          totalValue += currentValue;
          totalPnL += stats.totalPnL;
        }
      });

      setTotalInvested(invested);
      setTotalProfit(totalPnL);
      setTotalProfitPercent(invested > 0 ? (totalPnL / invested) * 100 : 0);

      // Aggregate stats
      const allTrades = allStats.flatMap(s => s.trades);
      const wins = allTrades.filter(t => t.pnl > 0);
      const losses = allTrades.filter(t => t.pnl <= 0);

      setTotalTrades(allTrades.length);
      setWinRate(allTrades.length > 0 ? (wins.length / allTrades.length) * 100 : 0);

      // Avg hold time
      let avgHoldTime = '0h';
      if (allTrades.length > 0) {
        const totalDurationMs = allTrades.reduce((sum, trade) => {
          const [value, unit] = trade.duration.split(/([a-z]+)/i).filter(Boolean);
          const numValue = parseFloat(value);
          let ms = 0;
          if (unit === 'h') ms = numValue * 60 * 60 * 1000;
          else if (unit === 'm') ms = numValue * 60 * 1000;
          else if (unit === 's') ms = numValue * 1000;
          return sum + ms;
        }, 0);
        const avgMs = totalDurationMs / allTrades.length;
        const avgHours = avgMs / (60 * 60 * 1000);
        const avgMinutes = avgMs / (60 * 1000);
        if (avgHours >= 1) avgHoldTime = `${avgHours.toFixed(1)}h`;
        else if (avgMinutes >= 1) avgHoldTime = `${avgMinutes.toFixed(0)}m`;
        else avgHoldTime = `${(avgMs / 1000).toFixed(0)}s`;
      }

      // Other stats
      const totalWins = wins.reduce((sum, t) => sum + t.pnl, 0);
      const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
      const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;
      const totalVolume = allTrades.reduce((sum, t) => sum + t.positionSize, 0);

      // Best streak
      let currentStreak = 0;
      let bestStreak = 0;
      allTrades.forEach(trade => {
        if (trade.pnl > 0) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      // Best day
      const tradesByDay = new Map<string, number>();
      allTrades.forEach(trade => {
        const dayKey = new Date(trade.closedAt).toISOString().split('T')[0];
        tradesByDay.set(dayKey, (tradesByDay.get(dayKey) || 0) + trade.pnl);
      });
      let bestDay = 0;
      let bestDayDate = '';
      tradesByDay.forEach((pnl, day) => {
        if (pnl > bestDay) {
          bestDay = pnl;
          bestDayDate = new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      });

      // Max Drawdown
      let maxDD = 0;
      if (allTrades.length > 0) {
        const sortedTrades = [...allTrades].sort((a, b) =>
          new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime()
        );
        let peak = invested;
        let cumulativePnL = 0;
        sortedTrades.forEach(trade => {
          cumulativePnL += trade.pnl;
          const currentValue = invested + cumulativePnL;
          peak = Math.max(peak, currentValue);
          const drawdown = ((currentValue - peak) / peak) * 100;
          maxDD = Math.min(maxDD, drawdown);
        });
      }
      setMaxDrawdown(maxDD);

      setTradingStats({
        avgHoldTime,
        winLossRatio: losses.length > 0 ? wins.length / losses.length : wins.length,
        wins: wins.length,
        losses: losses.length,
        avgWin: wins.length > 0 ? totalWins / wins.length : 0,
        avgLoss: losses.length > 0 ? totalLosses / losses.length : 0,
        profitFactor,
        totalVolume,
        bestStreak,
        bestDay,
        bestDayDate,
      });

      // Best/Worst trades
      const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
      };

      const tradesWithBotName = allStats.flatMap(stats =>
        stats.trades.map(trade => ({
          ...trade,
          botName: stats.name,
          date: formatTimeAgo(new Date(trade.closedAt)),
        }))
      );

      const sortedByPnl = [...tradesWithBotName].sort((a, b) => b.pnl - a.pnl);
      setBestTrades(sortedByPnl.slice(0, 5));
      setWorstTrades(sortedByPnl.slice(-5).reverse());

      // Asset distribution
      const pairCounts = new Map<string, number>();
      allTrades.forEach(trade => {
        pairCounts.set(trade.pair, (pairCounts.get(trade.pair) || 0) + 1);
      });
      const total = allTrades.length;
      const colors = ['#F59E0B', '#6366F1', '#EC4899', '#14B8A6', '#64748b'];
      const distribution = Array.from(pairCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pair, count], i) => ({
          pair,
          percentage: (count / total) * 100,
          color: colors[i] || '#64748b',
        }));
      setAssetDistribution(distribution);

      // Bots comparison
      const botsData = allStats.map(stats => ({
        name: stats.name,
        profit: stats.totalPnL,
      }));
      setBotsComparison(botsData);

      // Build portfolio equity curve
      const allTradesSorted = [...allTrades].sort((a, b) =>
        new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime()
      );

      const equityPoints: EquityPoint[] = [];
      const startValue = invested;

      // Starting point
      const oldestTimestamp = allTradesSorted.length > 0
        ? new Date(allTradesSorted[0].closedAt).getTime()
        : Date.now();
      equityPoints.push({
        timestamp: oldestTimestamp - 1000,
        value: startValue,
      });

      // Add point after each trade
      let cumulativePnL = 0;
      allTradesSorted.forEach(trade => {
        cumulativePnL += trade.pnl;
        equityPoints.push({
          timestamp: new Date(trade.closedAt).getTime(),
          value: startValue + cumulativePnL,
        });
      });

      // Current point
      equityPoints.push({
        timestamp: Date.now(),
        value: totalValue,
      });

      setEquityData(equityPoints);
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Filter equity data by time range
  const now = Date.now();
  let cutoffTime = 0;
  switch (timeRange) {
    case '7d': cutoffTime = now - (7 * 24 * 60 * 60 * 1000); break;
    case '30d': cutoffTime = now - (30 * 24 * 60 * 60 * 1000); break;
    case '90d': cutoffTime = now - (90 * 24 * 60 * 60 * 1000); break;
    case '1y': cutoffTime = now - (365 * 24 * 60 * 60 * 1000); break;
  }
  const filteredEquityData = equityData.filter(point => point.timestamp >= cutoffTime);
  const displayData = filteredEquityData.length > 0 ? filteredEquityData : equityData;

  // Portfolio performance chart
  const performanceChartOptions: any = {
    chart: {
      type: 'area',
      height: 400,
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
        datetimeUTC: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (val: number) => `$${val.toLocaleString('en-US')}`,
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (val: number) => {
          const date = new Date(val);
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      },
      y: {
        formatter: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
    },
  };

  const performanceSeries = [
    {
      name: 'Portfolio Value',
      data: displayData.map(point => ({ x: point.timestamp, y: point.value })),
    },
  ];

  // Asset distribution chart
  const assetDistributionOptions: any = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    theme: { mode: 'dark' },
    labels: assetDistribution.map(a => a.pair),
    colors: assetDistribution.map(a => a.color),
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', fontWeight: 'bold', colors: ['#fff'] },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: '#94a3b8',
            },
            value: {
              show: true,
              fontSize: '18px',
              color: '#fff',
              formatter: (val: string) => `${parseFloat(val).toFixed(0)}%`,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#94a3b8',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
  };

  const assetDistributionSeries = assetDistribution.map(a => a.percentage);

  // Bots comparison chart
  const botsComparisonOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
    },
    theme: { mode: 'dark' },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: botsComparison.map(b => b.name),
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (val: number) => `$${val.toLocaleString('en-US')}`,
      },
    },
    fill: {
      opacity: 1,
      colors: botsComparison.map((_, i) => ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][i % 5]),
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `$${val.toLocaleString('en-US')}`,
      },
    },
  };

  const botsComparisonSeries = [{
    name: 'Profit',
    data: botsComparison.map(b => b.profit),
  }];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Link
              href="/dashboard-v2"
              className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Portfolio Analytics</h1>
            <p className="text-dark-400">Comprehensive performance insights</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-primary-500/30'
                }`}
              >
                {range === '7d' ? '7D' : range === '30d' ? '30D' : range === '90d' ? '90D' : '1Y'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top Section: Performance Chart + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
          {/* Performance Chart - Left (8 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Portfolio Performance</h2>
                    <p className="text-xs text-dark-400">Total value over time</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(1)}%
                  </div>
                  <div className="text-xs text-dark-400">Total Return</div>
                </div>
              </div>
              <Chart
                options={performanceChartOptions}
                series={performanceSeries}
                type="area"
                height={270}
              />
            </div>
          </motion.div>

          {/* Stats Grid - Right (4 cols, vertical) */}
          <div className="lg:col-span-4 flex flex-col gap-2 h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-green-500/50 transition-all flex items-center">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Total Profit</div>
                      <div className="text-2xl font-bold text-white">
                        {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-semibold ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-dark-400 mt-0.5">Invested: ${totalInvested.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1"
            >
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-blue-500/50 transition-all flex items-center">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Win Rate</div>
                      <div className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-blue-400">{totalTrades}</div>
                    <div className="text-xs text-dark-400 mt-0.5">Total Trades</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex-1"
            >
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-xl p-5 hover:border-red-500/50 transition-all flex items-center">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Max Drawdown</div>
                      <div className="text-2xl font-bold text-white">{maxDrawdown.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-red-400">
                      {Math.abs(maxDrawdown) < 5 ? 'Very safe' : Math.abs(maxDrawdown) < 10 ? 'Safe' : 'Moderate'}
                    </div>
                    <div className="text-xs text-dark-400 mt-0.5">Peak to trough</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Asset Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-500/20 border border-accent-500/30 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Asset Distribution</h3>
                  <p className="text-xs text-dark-400">Trading pairs breakdown</p>
                </div>
              </div>
              {assetDistribution.length > 0 ? (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart
                      options={assetDistributionOptions}
                      series={assetDistributionSeries}
                      type="donut"
                      height={220}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {assetDistribution.slice(0, 4).map((asset, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-dark-900/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                        <span className="text-xs text-dark-300">{asset.pair} {asset.percentage.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-dark-400">
                  No trades yet
                </div>
              )}
            </div>
          </motion.div>

          {/* Trading Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-7"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Trading Statistics</h3>
                  <p className="text-xs text-dark-400">Performance metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 flex-1">
                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <div className="text-xs text-dark-400">Total Trades</div>
                  </div>
                  <div className="text-xl font-bold text-white">{totalTrades}</div>
                  <div className="text-xs text-blue-400 mt-1">All bots combined</div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <div className="text-xs text-dark-400">Avg Hold Time</div>
                  </div>
                  <div className="text-xl font-bold text-white">{tradingStats.avgHoldTime}</div>
                  <div className="text-xs text-purple-400 mt-1">
                    {tradingStats.avgHoldTime.includes('h') ? 'Swing trading' :
                     tradingStats.avgHoldTime.includes('m') && parseInt(tradingStats.avgHoldTime) > 10 ? 'Day trading' :
                     'Scalping'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <div className="text-xs text-dark-400">Win/Loss Ratio</div>
                  </div>
                  <div className="text-xl font-bold text-white">{tradingStats.winLossRatio.toFixed(2)}:1</div>
                  <div className="text-xs text-green-400 mt-1">{tradingStats.wins}W / {tradingStats.losses}L</div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div className="text-xs text-dark-400">Average Win</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">+${tradingStats.avgWin.toFixed(2)}</div>
                  <div className="text-xs text-green-400 mt-1">
                    {totalInvested > 0 ? `${((tradingStats.avgWin / totalInvested) * 100).toFixed(2)}% of capital` : 'N/A'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <div className="text-xs text-dark-400">Average Loss</div>
                  </div>
                  <div className="text-xl font-bold text-red-400">-${tradingStats.avgLoss.toFixed(2)}</div>
                  <div className="text-xs text-red-400 mt-1">
                    {totalInvested > 0 ? `${((tradingStats.avgLoss / totalInvested) * 100).toFixed(2)}% of capital` : 'N/A'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div className="text-xs text-dark-400">Profit Factor</div>
                  </div>
                  <div className="text-xl font-bold text-amber-400">{tradingStats.profitFactor.toFixed(2)}</div>
                  <div className={`text-xs mt-1 ${
                    tradingStats.profitFactor >= 2 ? 'text-green-400' :
                    tradingStats.profitFactor >= 1.5 ? 'text-yellow-400' :
                    tradingStats.profitFactor >= 1 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {tradingStats.profitFactor >= 2 ? 'Excellent' :
                     tradingStats.profitFactor >= 1.5 ? 'Good' :
                     tradingStats.profitFactor >= 1 ? 'Profitable' :
                     'Needs improvement'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <div className="text-xs text-dark-400">Total Volume</div>
                  </div>
                  <div className="text-xl font-bold text-white">${(tradingStats.totalVolume / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-cyan-400 mt-1">
                    {totalInvested > 0 ? `${(tradingStats.totalVolume / totalInvested).toFixed(1)}× capital turnover` : 'N/A'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <div className="text-xs text-dark-400">Best Streak</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">{tradingStats.bestStreak} W</div>
                  <div className="text-xs text-green-400 mt-1">
                    {tradingStats.bestStreak >= 10 ? 'Exceptional streak' :
                     tradingStats.bestStreak >= 7 ? 'Strong streak' :
                     tradingStats.bestStreak >= 5 ? 'Above average' :
                     tradingStats.bestStreak >= 3 ? 'Moderate streak' :
                     'Early stage'}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-green-400" />
                    <div className="text-xs text-dark-400">Best Day</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">+${tradingStats.bestDay.toFixed(0)}</div>
                  <div className="text-xs text-dark-400 mt-1">{tradingStats.bestDayDate || 'N/A'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Best Trades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-6"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5 hover:border-green-500/50 transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Top Winning Trades</h3>
                    <p className="text-xs text-dark-400">Best performers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                {bestTrades.length > 0 ? (
                  bestTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-dark-900/30 rounded-lg border border-dark-700/30 hover:border-green-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{trade.pair}</div>
                          <div className="text-xs text-dark-400">{trade.botName} • {trade.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">+${trade.pnl.toFixed(2)}</div>
                        <div className="text-xs text-green-400/60">+{trade.pnlPercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-400">No winning trades yet</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Worst Trades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-6"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5 hover:border-red-500/50 transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Recent Losing Trades</h3>
                    <p className="text-xs text-dark-400">Areas to improve</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                {worstTrades.length > 0 ? (
                  worstTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-dark-900/30 rounded-lg border border-dark-700/30 hover:border-red-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{trade.pair}</div>
                          <div className="text-xs text-dark-400">{trade.botName} • {trade.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-400">${trade.pnl.toFixed(2)}</div>
                        <div className="text-xs text-red-400/60">{trade.pnlPercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-400">No losing trades yet</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bots Comparison */}
          {botsComparison.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-12"
            >
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Bots Performance Comparison</h2>
                      <p className="text-sm text-dark-400">Total profit by each bot</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard-v2"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <Chart
                  options={botsComparisonOptions}
                  series={botsComparisonSeries}
                  type="bar"
                  height={350}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
