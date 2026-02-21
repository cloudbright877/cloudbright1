'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import {
  User,
  Shield,
  TrendingUp,
  Award,
  Bot,
  Users,
  Copy,
  Check,
  X,
  Laptop,
  Smartphone,
  BarChart3,
  Target,
  Trophy,
  Calendar,
  DollarSign,
  Zap,
  Archive,
  Clock
} from 'lucide-react';

// Social system imports
import type { TraderProfile } from '@/lib/social/types';
import { getTraderByUsername, seedSocialData } from '@/lib/social/mock-seed';
import { calculateTier } from '@/lib/social/tier-system';
import { isWhale } from '@/lib/social/whale-detector';
import { getAvatarStyle } from '@/lib/social/tier-utils';

// User copies system
import { getClosedUserCopies } from '@/lib/userCopies';
import type { UserCopy } from '@/lib/userCopies';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function TraderProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // Unwrap async params
  const { username } = use(params);

  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bots' | 'archived'>('overview');
  const [showCopyModal, setShowCopyModal] = useState(false);
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

  // Load trader data
  useEffect(() => {
    seedSocialData();
    const traderData = getTraderByUsername(username);
    setTrader(traderData);

  }, [username]);

  // Performance chart - must be before early return to maintain hooks order
  const performanceData = useMemo(() => {
    const days = 365;
    const data = [];
    let cumulative = 10000;
    for (let i = 0; i < days; i++) {
      const change = (Math.random() * 300) + 50;
      cumulative += change;
      data.push(parseFloat(cumulative.toFixed(2)));
    }
    return data;
  }, []);

  // Show loading if trader not found
  if (!trader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Trader not found</div>
      </div>
    );
  }

  const performanceChartOptions = {
    series: [{ name: 'Portfolio Value', data: performanceData }],
    chart: { type: 'area' as const, height: 300, background: 'transparent', toolbar: { show: false } },
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
    grid: { borderColor: isDark ? '#1e293b' : '#e5e7eb', strokeDashArray: 5 },
    tooltip: { theme: isDark ? 'dark' as const : 'light' as const }
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (risk === 'medium') return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
  };

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return '⚠️ Low';
    if (risk === 'medium') return '⚠️⚠️ Med';
    return '⚠️⚠️⚠️ High';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-4 sm:p-6 lg:p-8 hover:border-primary-500/30 transition-all"
        >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-gray-900 dark:text-white shadow-2xl mb-4" style={getAvatarStyle(trader.displayName)}>
              {trader.avatar || trader.displayName[0]?.toUpperCase()}
            </div>

            {/* Verified Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {trader.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  VERIFIED
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center gap-1">
                <Award className="w-3 h-3" />
                {trader.tier}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-gray-600 dark:text-dark-400">Copiers</div>
                <div className="text-lg font-medium text-accent-400">{trader.stats.copiers}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-gray-600 dark:text-dark-400">Win Rate</div>
                <div className="text-lg font-medium text-green-400">{trader.stats.winRate}%</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg text-center col-span-2">
                <div className="text-xs text-gray-600 dark:text-dark-400">Invested</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">${trader.stats.totalInvested.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Right: Profile Info & Stats */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Name & Username */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2">{trader.displayName}</h1>
              <div className="flex items-center gap-3 text-gray-600 dark:text-dark-400 text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  @{trader.username}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(trader.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-accent-400 flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Rank #{trader.stats.rank}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-gray-800 dark:text-dark-200 whitespace-pre-line">{trader.bio}</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Total Profit
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-green-400">${trader.stats.totalProfit.toLocaleString()}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-primary-500/30 transition-all">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Monthly Return
                </div>
                <div className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">+{trader.stats.monthlyReturn}%</div>
                <div className="text-xs text-gray-600 dark:text-dark-400">Avg per month</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-accent-500/30 transition-all">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Copiers AUM
                </div>
                <div className="text-xl sm:text-2xl font-medium text-accent-400">${(trader.stats.copiersAUM / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-gray-600 dark:text-dark-400">{trader.stats.copiers} copiers</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl hover:border-primary-500/40 transition-all">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Win Rate
                </div>
                <div className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{trader.stats.winRate}%</div>
                <div className="text-xs text-gray-600 dark:text-dark-400">Success rate</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCopyModal(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copy Strategy
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap p-1.5">
          {([
            { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'bots', label: 'Active Bots', icon: <Bot className="w-4 h-4" /> },
            { key: 'archived', label: 'Archived Bots', icon: <Archive className="w-4 h-4" /> },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-3 font-medium rounded-lg sm:rounded-md text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                activeTab === key
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white sm:shadow-lg sm:shadow-primary-500/30'
                  : 'bg-gray-200 dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 sm:bg-transparent sm:dark:bg-transparent sm:border-0 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Performance Chart */}
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/30 transition-all">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                Portfolio Performance
                <span className="ml-auto text-sm text-green-400">${trader.stats.totalProfit.toLocaleString()} Total Profit</span>
              </h3>
              <Chart options={performanceChartOptions} series={performanceChartOptions.series} type="area" height={300} />
            </div>
            </div>

            {/* Performance Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="h-full rounded-xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(0.75rem-1px)] p-6 hover:border-primary-500/30 transition-all">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  Trading Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Total Profit:</span>
                    <span className="text-sm font-medium text-green-400">${trader.stats.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Win Rate:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trader.stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Total Trades:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trader.stats.totalTrades}</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="h-full rounded-xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(0.75rem-1px)] p-6 hover:border-primary-500/50 transition-all">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-400" />
                  Social Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Copiers:</span>
                    <span className="text-sm font-medium text-primary-400">{trader.stats.copiers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Copiers AUM:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${(trader.stats.copiersAUM / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Rank:</span>
                    <span className="text-sm font-medium text-accent-400">#{trader.stats.rank}</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="h-full rounded-xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(0.75rem-1px)] p-6 hover:border-primary-500/50 transition-all">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-400" />
                  Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Total Trades:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{trader.stats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-dark-400">Total Invested:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${trader.stats.totalInvested.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Active Bots Summary */}
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/30 transition-all">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-400" />
                Active Trading Bots
              </h3>
              <div className="text-center py-8">
                <div className="text-5xl font-semibold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">{trader.activeBotIds.length}</div>
                <div className="text-gray-600 dark:text-dark-400">Bots Currently Running</div>
              </div>
            </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bots' && (
          <motion.div
            key="bots"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-400" />
              Active Bots ({trader.activeBotIds.length})
            </h3>

            <div className="space-y-4">
              {trader.activeBotIds.map((botId, index) => (
                <div key={botId} className="p-6 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-white shadow-lg">
                        <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-1">Trading Bot {index + 1}</h4>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400 truncate max-w-[200px] sm:max-w-none">Bot ID: {botId}</div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard-v2/bots"
                      className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all flex items-center gap-2"
                    >
                      View Bots
                      <Zap className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'archived' && (
          <motion.div
            key="archived"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Archive className="w-5 h-5 text-primary-400" />
              Archived Bots
            </h3>

            {(() => {
              const closedCopies = getClosedUserCopies('user_default');

              if (closedCopies.length === 0) {
                return (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Archive className="w-8 h-8 text-dark-600" />
                    </div>
                    <p className="text-gray-600 dark:text-dark-400">No archived bots yet</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {closedCopies.map((copy) => {
                    const duration = copy.closedAt && copy.createdAt
                      ? Math.floor((copy.closedAt - copy.createdAt) / (1000 * 60 * 60 * 24))
                      : 0;
                    const effectiveReturn = copy.investedAmount > 0
                      ? ((copy.finalValue || copy.investedAmount) - copy.investedAmount) / copy.investedAmount * 100
                      : 0;
                    const lockInDays = copy.reservationDays || 30;

                    return (
                      <div key={copy.id} className="p-5 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                              <Archive className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">Bot Copy</h4>
                              <div className="text-xs text-gray-600 dark:text-dark-400">Master Bot: {copy.masterBotId}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Closed</div>
                            <div className="text-xs text-gray-500 dark:text-dark-500">
                              {copy.closedAt ? new Date(copy.closedAt).toLocaleDateString() : 'Unknown'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700/50">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Invested</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              ${copy.investedAmount.toLocaleString()}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700/50">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Final P&L</div>
                            <div className={`text-sm font-medium ${
                              (copy.finalPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {(copy.finalPnL || 0) >= 0 ? '+' : ''}${(copy.finalPnL || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700/50">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Duration</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {duration} days
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700/50">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Lock-in</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lockInDays} days
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-700/50">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600 dark:text-dark-400">Effective Return</div>
                            <div className={`text-sm font-medium ${
                              effectiveReturn >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {effectiveReturn >= 0 ? '+' : ''}{effectiveReturn.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Strategy Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-[calc(1rem-1px)] p-6 max-w-lg w-full">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">Copy {trader.displayName}'s Strategy</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-700 dark:text-dark-300 mb-2">Investment Amount</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-2">Active Bots:</div>
                <div className="text-sm text-gray-900 dark:text-white font-medium">
                  {trader.activeBotIds.length} Trading Bots Running
                </div>
              </div>

              <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-2">Expected Monthly Return</div>
                <div className="text-xl sm:text-2xl font-semibold text-green-400">+{trader.stats.monthlyReturn}%</div>
                <div className="text-xs text-gray-600 dark:text-dark-400 mt-1">Average per month</div>
              </div>

            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:text-white hover:border-gray-300 dark:border-dark-600 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-gray-900 dark:text-white hover:shadow-lg transition-all">
                Start Copying
              </button>
            </div>
            </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
}
