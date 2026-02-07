'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import {
  UserPlus,
  UserCheck,
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
  Zap
} from 'lucide-react';

// Social system imports
import type { TraderProfile } from '@/lib/social/types';
import { getTraderByUsername, seedSocialData } from '@/lib/social/mock-seed';
import { calculateTier } from '@/lib/social/tier-system';
import { isWhale } from '@/lib/social/whale-detector';
import { toggleFollow, isFollowing } from '@/lib/social/follow-system';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function TraderProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // Unwrap async params
  const { username } = use(params);

  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [isFollowingTrader, setIsFollowingTrader] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bots'>('overview');
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Load trader data
  useEffect(() => {
    seedSocialData();
    const traderData = getTraderByUsername(username);
    setTrader(traderData);

    if (traderData) {
      setIsFollowingTrader(isFollowing(traderData.userId));
    }
  }, [username]);

  const handleFollowToggle = () => {
    if (!trader) return;
    const newState = toggleFollow(trader.userId);
    setIsFollowingTrader(newState);
  };

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
        <div className="text-white text-xl">Trader not found</div>
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
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 mb-6 hover:border-primary-500/30 transition-all"
        >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl mb-4">
              {trader.avatar}
            </div>

            {/* Verified Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {trader.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  VERIFIED
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center gap-1">
                <Award className="w-3 h-3" />
                {trader.tier}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Followers</div>
                <div className="text-lg font-bold text-white">{trader.stats.followers.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Copiers</div>
                <div className="text-lg font-bold text-accent-400">{trader.stats.copiers}</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Win Rate</div>
                <div className="text-lg font-bold text-green-400">{trader.stats.winRate}%</div>
              </div>
              <div className="p-3 bg-dark-900/50 rounded-lg text-center">
                <div className="text-xs text-dark-400">Rank</div>
                <div className="text-lg font-bold text-accent-400">#{trader.stats.rank}</div>
              </div>
            </div>
          </div>

          {/* Right: Profile Info & Stats */}
          <div className="flex-1">
            {/* Name & Username */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-white mb-2">{trader.displayName}</h1>
              <div className="flex items-center gap-3 text-dark-400 text-sm flex-wrap">
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
              <p className="text-dark-200 whitespace-pre-line">{trader.bio}</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all">
                <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Total Profit
                </div>
                <div className="text-2xl font-bold text-green-400">${trader.stats.totalProfit.toLocaleString()}</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700 rounded-xl hover:border-primary-500/30 transition-all">
                <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Monthly Return
                </div>
                <div className="text-2xl font-bold text-white">+{trader.stats.monthlyReturn}%</div>
                <div className="text-xs text-dark-400">Avg per month</div>
              </div>

              <div className="p-4 bg-dark-900/50 border border-dark-700 rounded-xl hover:border-accent-500/30 transition-all">
                <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Copiers AUM
                </div>
                <div className="text-2xl font-bold text-accent-400">${(trader.stats.copiersAUM / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-dark-400">{trader.stats.copiers} copiers</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl hover:border-primary-500/40 transition-all">
                <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Win Rate
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{trader.stats.winRate}%</div>
                <div className="text-xs text-dark-400">Success rate</div>
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
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isFollowingTrader
                    ? 'bg-dark-900/50 border border-dark-700 text-dark-300 hover:border-dark-600'
                    : 'bg-dark-900/50 border border-primary-500/30 text-primary-400 hover:bg-primary-500/10'
                }`}
              >
                {isFollowingTrader ? (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Follow
                  </>
                )}
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
              px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2
              ${activeTab === tab
                ? 'bg-primary-500/20 border-2 border-primary-500/30 text-white'
                : 'bg-dark-800/50 border-2 border-dark-700 text-dark-400 hover:text-white hover:border-dark-600'
              }
            `}
          >
            {tab === 'overview' && (
              <>
                <BarChart3 className="w-4 h-4" />
                Overview
              </>
            )}
            {tab === 'bots' && (
              <>
                <Bot className="w-4 h-4" />
                Active Bots
              </>
            )}
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
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                Portfolio Performance
                <span className="ml-auto text-sm text-green-400">${trader.stats.totalProfit.toLocaleString()} Total Profit</span>
              </h3>
              <Chart options={performanceChartOptions} series={performanceChartOptions.series} type="area" height={300} />
            </div>

            {/* Performance Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-primary-500/30 transition-all">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  Trading Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Total Profit:</span>
                    <span className="text-sm font-bold text-green-400">${trader.stats.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Win Rate:</span>
                    <span className="text-sm font-bold text-white">{trader.stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Total Trades:</span>
                    <span className="text-sm font-bold text-white">{trader.stats.totalTrades}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-accent-500/30 transition-all">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-400" />
                  Social Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Followers:</span>
                    <span className="text-sm font-bold text-white">{trader.stats.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Copiers:</span>
                    <span className="text-sm font-bold text-primary-400">{trader.stats.copiers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Rank:</span>
                    <span className="text-sm font-bold text-accent-400">#{trader.stats.rank}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-green-500/30 transition-all">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Total Trades:</span>
                    <span className="text-sm font-bold text-white">{trader.stats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Copiers AUM:</span>
                    <span className="text-sm font-bold text-gradient">${(trader.stats.copiersAUM / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-400">Total Invested:</span>
                    <span className="text-sm font-bold text-primary-400">${(trader.stats.totalInvested / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Bots Summary */}
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-400" />
                Active Trading Bots
              </h3>
              <div className="text-center py-8">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">{trader.activeBotIds.length}</div>
                <div className="text-dark-400">Bots Currently Running</div>
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
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-400" />
              Active Bots ({trader.activeBotIds.length})
            </h3>

            <div className="space-y-4">
              {trader.activeBotIds.map((botId, index) => (
                <div key={botId} className="p-6 bg-dark-900/50 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        <Bot className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">Trading Bot {index + 1}</h4>
                        <div className="text-sm text-dark-400">Bot ID: {botId}</div>
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
            <h3 className="text-2xl font-bold text-white mb-4">Copy {trader.displayName}'s Strategy</h3>

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
                <div className="text-xs text-dark-400 mb-2">Active Bots:</div>
                <div className="text-sm text-white font-medium">
                  {trader.activeBotIds.length} Trading Bots Running
                </div>
              </div>

              <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <div className="text-xs text-dark-400 mb-2">Expected Monthly Return</div>
                <div className="text-2xl font-bold text-green-400">+{trader.stats.monthlyReturn}%</div>
                <div className="text-xs text-dark-400 mt-1">Average per month</div>
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
    </div>
  );
}
