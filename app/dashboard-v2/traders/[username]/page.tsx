'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Mock data for trader profile
const traderData = {
  username: 'john_pro',
  displayName: 'John Pro',
  avatar: 'J',
  tier: '💎 Diamond',
  verified: true,
  joinedDate: 'Jan 2024',
  bio: '🚀 Full-time crypto trader since 2019\n📊 Specialist: BTC momentum strategies\n🎯 2026 Goal: $100k profit\n📍 Based in: Singapore',
  philosophy: 'Risk management > Everything else. I never risk more than 2% per trade. Patience pays.',

  stats: {
    totalProfit: 45678,
    totalProfitPercent: 187.3,
    monthlyAvg: 12.8,
    winRate: 84,
    rating: 4.8,
    reviews: 127,
    followers: 1247,
    copiers: 189,
    copiersAUM: 2400000,
    commissionEarned: 18450,
    copiersAvgProfit: 16.3,
    rank: 47,
    totalUsers: 15247,
  },

  activeBots: [
    {
      id: 1,
      slug: 'alphabot',
      name: 'AlphaBot Pro',
      icon: 'AB',
      risk: 'low',
      invested: 10000,
      profit: 2345,
      profitPercent: 23.45,
      runningDays: 45,
      trades: 127,
    },
    {
      id: 2,
      slug: 'protrader',
      name: 'ProTrader Elite',
      icon: 'PT',
      risk: 'medium',
      invested: 8000,
      profit: 1876,
      profitPercent: 23.45,
      runningDays: 32,
      trades: 89,
    },
    {
      id: 3,
      slug: 'sigmabot',
      name: 'SigmaBot',
      icon: 'Σ',
      risk: 'high',
      invested: 5000,
      profit: 543,
      profitPercent: 10.86,
      runningDays: 15,
      trades: 43,
    },
  ],

  performance: {
    allTime: 187.3,
    thisYear: 42.1,
    bestMonth: { month: 'Oct 2025', return: 34.7 },
    worstMonth: { month: 'May 2025', return: -8.2 },
    longestStreak: 47,
    maxDrawdown: -12.4,
    consistencyScore: 9.2,
  },
};

export default function TraderProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bots'>('overview');
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Performance chart
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
    grid: { borderColor: '#334155', strokeDashArray: 5 },
    tooltip: { theme: 'dark' as const }
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (risk === 'medium') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return '⚠️ Low';
    if (risk === 'medium') return '⚠️⚠️ Med';
    return '⚠️⚠️⚠️ High';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header / Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl mb-4">
              {traderData.avatar}
            </div>

            {/* Verified Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {traderData.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 border border-green-500/30 text-green-400">
                  ✓ VERIFIED
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                {traderData.tier}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Followers</div>
                <div className="text-lg font-bold text-white">{traderData.stats.followers.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Copiers</div>
                <div className="text-lg font-bold text-accent-400">{traderData.stats.copiers}</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Win Rate</div>
                <div className="text-lg font-bold text-green-400">{traderData.stats.winRate}%</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Rank</div>
                <div className="text-lg font-bold text-accent-400">#{traderData.stats.rank}</div>
              </div>
            </div>
          </div>

          {/* Right: Profile Info & Stats */}
          <div className="flex-1">
            {/* Name & Username */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-white mb-1">{traderData.displayName}</h1>
              <div className="flex items-center gap-3 text-dark-400">
                <span>@{traderData.username}</span>
                <span>•</span>
                <span>Joined {traderData.joinedDate}</span>
                <span>•</span>
                <span className="text-accent-400">#{traderData.stats.rank} / {traderData.stats.totalUsers.toLocaleString()}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-dark-200 whitespace-pre-line mb-3">{traderData.bio}</p>
              <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                <div className="text-xs text-dark-400 mb-1">Trading Philosophy:</div>
                <p className="text-sm text-dark-200 italic">"{traderData.philosophy}"</p>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
                <div className="text-xs text-dark-400 mb-1">Total Profit</div>
                <div className="text-2xl font-bold text-green-400">${traderData.stats.totalProfit.toLocaleString()}</div>
                <div className="text-xs text-green-400">+{traderData.stats.totalProfitPercent}%</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700 rounded-xl">
                <div className="text-xs text-dark-400 mb-1">Monthly Avg</div>
                <div className="text-2xl font-bold text-white">+{traderData.stats.monthlyAvg}%</div>
                <div className="text-xs text-dark-400">Last 12 months</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700 rounded-xl">
                <div className="text-xs text-dark-400 mb-1">Copiers AUM</div>
                <div className="text-2xl font-bold text-accent-400">${(traderData.stats.copiersAUM / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-dark-400">{traderData.stats.copiers} copiers</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl">
                <div className="text-xs text-dark-400 mb-1">Your Earnings</div>
                <div className="text-2xl font-bold text-gradient">${traderData.stats.commissionEarned.toLocaleString()}</div>
                <div className="text-xs text-dark-400">Commission/mo</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCopyModal(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all"
              >
                🚀 Copy Strategy
              </button>
              <button className="px-6 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white hover:border-dark-600 transition-all">
                👤 Follow
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'bots'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all
              ${activeTab === tab
                ? 'bg-primary-500/20 border-2 border-primary-500/30 text-white'
                : 'bg-dark-800/50 border-2 border-dark-700 text-dark-400 hover:text-white'
              }
            `}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'bots' && '🤖 Active Bots'}
          </button>
        ))}
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
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                📈 Portfolio Performance
                <span className="ml-3 text-sm text-green-400">+{traderData.performance.allTime}% ALL TIME</span>
              </h3>
              <Chart options={performanceChartOptions} series={performanceChartOptions.series} type="area" height={300} />
            </div>

            {/* Performance Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-white mb-4">📊 Key Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">This Year:</span>
                    <span className="text-sm font-bold text-green-400">+{traderData.performance.thisYear}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Best Month:</span>
                    <span className="text-sm font-bold text-white">{traderData.performance.bestMonth.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Return:</span>
                    <span className="text-sm font-bold text-green-400">+{traderData.performance.bestMonth.return}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-white mb-4">⚠️ Risk Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Max Drawdown:</span>
                    <span className="text-sm font-bold text-red-400">{traderData.performance.maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Worst Month:</span>
                    <span className="text-sm font-bold text-white">{traderData.performance.worstMonth.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Return:</span>
                    <span className="text-sm font-bold text-red-400">{traderData.performance.worstMonth.return}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-white mb-4">🎯 Consistency</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Score:</span>
                    <span className="text-sm font-bold text-gradient">{traderData.performance.consistencyScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Longest Streak:</span>
                    <span className="text-sm font-bold text-orange-400">{traderData.performance.longestStreak} days 🔥</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Copier Success:</span>
                    <span className="text-sm font-bold text-green-400">{traderData.stats.copiersAvgProfit}% avg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Allocation */}
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">💼 Current Portfolio Allocation</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {traderData.activeBots.map((bot) => (
                  <Link
                    key={bot.id}
                    href={`/dashboard-v2/bots/${bot.slug}`}
                    className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                        {bot.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white group-hover:text-gradient transition-all">{bot.name}</div>
                        <div className={`text-xs font-semibold border px-2 py-0.5 rounded inline-block ${getRiskColor(bot.risk)}`}>
                          {getRiskLabel(bot.risk)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-400">Invested:</span>
                        <span className="font-semibold text-white">${bot.invested.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Profit:</span>
                        <span className="font-semibold text-green-400">+${bot.profit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Running:</span>
                        <span className="text-dark-300">{bot.runningDays} days</span>
                      </div>
                    </div>
                  </Link>
                ))}
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
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-6">🤖 Active Bots ({traderData.activeBots.length})</h3>

            <div className="space-y-4">
              {traderData.activeBots.map((bot) => (
                <div key={bot.id} className="p-6 bg-dark-900/50 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                        {bot.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">{bot.name}</h4>
                        <div className={`text-xs font-semibold border px-2 py-1 rounded inline-block ${getRiskColor(bot.risk)}`}>
                          {getRiskLabel(bot.risk)} Risk
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Invested</div>
                        <div className="text-lg font-bold text-white">${bot.invested.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Profit</div>
                        <div className="text-lg font-bold text-green-400">+${bot.profit.toLocaleString()}</div>
                        <div className="text-xs text-green-400">+{bot.profitPercent}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Running</div>
                        <div className="text-lg font-bold text-white">{bot.runningDays}d</div>
                      </div>
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Trades</div>
                        <div className="text-lg font-bold text-white">{bot.trades}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Link
                        href={`/dashboard-v2/bots/${bot.slug}`}
                        className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all"
                      >
                        View Bot
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
            className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 max-w-lg w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Copy {traderData.displayName}'s Strategy</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-dark-300 mb-2">Investment Amount</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                <div className="text-xs text-dark-400 mb-2">Their Current Allocation:</div>
                <div className="space-y-2">
                  {traderData.activeBots.map((bot) => (
                    <div key={bot.id} className="flex justify-between text-sm">
                      <span className="text-white">{bot.name}</span>
                      <span className="text-dark-400">${bot.invested.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <div className="text-xs text-dark-400 mb-2">Expected Monthly Return</div>
                <div className="text-2xl font-bold text-green-400">+{traderData.stats.monthlyAvg}%</div>
                <div className="text-xs text-dark-400 mt-1">Based on their last 12 months</div>
              </div>

              <div className="flex items-start gap-2 text-xs text-dark-400">
                <input type="checkbox" className="mt-1" defaultChecked />
                <span>Auto-copy all their trades and rebalancing moves</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className="flex-1 px-4 py-3 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                Start Copying
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
