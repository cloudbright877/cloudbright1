'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import {
  Fish,
  DollarSign,
  TrendingUp,
  Banknote,
  Bell,
  Shield,
  Trophy,
  ArrowRight,
  Gem,
  Award,
  Medal,
  Copy
} from 'lucide-react';

interface WhaleActivity {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  tier: string;
  verified: boolean;
  action: 'invested' | 'withdrew' | 'profit';
  amount: number;
  botName: string;
  botSlug: string;
  timestamp: number;
  totalInvested: number;
  totalProfit: number;
}

const mockWhaleActivities: WhaleActivity[] = [
  {
    id: '1',
    username: 'crypto_whale_47',
    displayName: 'Anonymous Whale',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    action: 'invested',
    amount: 50000,
    botName: 'ProTrader Elite',
    botSlug: 'protrader',
    timestamp: Date.now() - 1200000, // 20 min ago
    totalInvested: 847293,
    totalProfit: 284729,
  },
  {
    id: '2',
    username: 'whale_master',
    displayName: 'Marcus Zhang',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    action: 'profit',
    amount: 12847,
    botName: 'AlphaBot Pro',
    botSlug: 'alphabot',
    timestamp: Date.now() - 2400000, // 40 min ago
    totalInvested: 524893,
    totalProfit: 157468,
  },
  {
    id: '3',
    username: 'mega_investor',
    displayName: 'Sarah Thompson',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    action: 'invested',
    amount: 75000,
    botName: 'SafeGrowth Bot',
    botSlug: 'safegrowth',
    timestamp: Date.now() - 3600000, // 1 hour ago
    totalInvested: 692847,
    totalProfit: 184729,
  },
  {
    id: '4',
    username: 'crypto_king_88',
    displayName: 'Anonymous Whale',
    avatar: null,
    tier: 'Diamond',
    verified: false,
    action: 'invested',
    amount: 38500,
    botName: 'AlphaBot Pro',
    botSlug: 'alphabot',
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    totalInvested: 384729,
    totalProfit: 92847,
  },
  {
    id: '5',
    username: 'defi_whale',
    displayName: 'Alex Rodriguez',
    avatar: null,
    tier: 'Platinum',
    verified: true,
    action: 'profit',
    amount: 8492,
    botName: 'ProTrader Elite',
    botSlug: 'protrader',
    timestamp: Date.now() - 7200000, // 2 hours ago
    totalInvested: 284729,
    totalProfit: 67293,
  },
  {
    id: '6',
    username: 'smart_whale',
    displayName: 'Emily Chen',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    action: 'withdrew',
    amount: 42000,
    botName: 'TrendFollower',
    botSlug: 'trendfollower',
    timestamp: Date.now() - 9000000, // 2.5 hours ago
    totalInvested: 542847,
    totalProfit: 142847,
  },
  {
    id: '7',
    username: 'whale_watcher',
    displayName: 'Michael Torres',
    avatar: null,
    tier: 'Platinum',
    verified: true,
    action: 'invested',
    amount: 62500,
    botName: 'AlphaBot Pro',
    botSlug: 'alphabot',
    timestamp: Date.now() - 10800000, // 3 hours ago
    totalInvested: 384729,
    totalProfit: 94729,
  },
  {
    id: '8',
    username: 'anonymous_shark',
    displayName: 'Anonymous Whale',
    avatar: null,
    tier: 'Diamond',
    verified: false,
    action: 'profit',
    amount: 18247,
    botName: 'SafeGrowth Bot',
    botSlug: 'safegrowth',
    timestamp: Date.now() - 12600000, // 3.5 hours ago
    totalInvested: 642847,
    totalProfit: 184729,
  },
];

type FilterType = 'all' | 'invested' | 'profit' | 'withdrew';

export default function WhalesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [minAmount, setMinAmount] = useState(10000);

  const filteredActivities = mockWhaleActivities.filter(activity => {
    if (filter !== 'all' && activity.action !== filter) return false;
    if (activity.amount < minAmount) return false;
    return true;
  });

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'invested': return 'text-blue-400';
      case 'profit': return 'text-green-400';
      case 'withdrew': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'invested': return <DollarSign className="w-4 h-4" />;
      case 'profit': return <TrendingUp className="w-4 h-4" />;
      case 'withdrew': return <Banknote className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'invested': return 'invested';
      case 'profit': return 'earned profit of';
      case 'withdrew': return 'withdrew';
      default: return 'action';
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('Diamond')) return 'from-cyan-500 to-blue-500';
    if (tier.includes('Platinum')) return 'from-purple-500 to-pink-500';
    if (tier.includes('Gold')) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-400';
  };

  const getTierIcon = (tier: string) => {
    if (tier.includes('Diamond')) return <Gem className="w-3 h-3" />;
    if (tier.includes('Platinum')) return <Trophy className="w-3 h-3" />;
    if (tier.includes('Gold')) return <Award className="w-3 h-3" />;
    return <Medal className="w-3 h-3" />;
  };

  // Get unique whales
  const uniqueWhales = Array.from(
    new Map(mockWhaleActivities.map(activity => [activity.username, activity])).values()
  ).sort((a, b) => b.totalInvested - a.totalInvested);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Fish className="w-8 h-8 text-blue-400" />
            Whale Watching
          </h1>
          <p className="text-dark-300">
            Track and copy the biggest investors on Celestian
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Action Filter */}
                <div className="flex-1">
                  <div className="text-sm text-dark-400 mb-3">Activity Type</div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'all'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('invested')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        filter === 'invested'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Investments
                    </button>
                    <button
                      onClick={() => setFilter('profit')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        filter === 'profit'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Profits
                    </button>
                    <button
                      onClick={() => setFilter('withdrew')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        filter === 'withdrew'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Withdrawals
                    </button>
                  </div>
                </div>

                {/* Min Amount Filter */}
                <div className="md:w-48">
                  <div className="text-sm text-dark-400 mb-3">Min Amount</div>
                  <select
                    value={minAmount}
                    onChange={(e) => setMinAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 rounded-lg text-white hover:bg-dark-900 transition-colors"
                  >
                    <option value={5000}>$5,000+</option>
                    <option value={10000}>$10,000+</option>
                    <option value={25000}>$25,000+</option>
                    <option value={50000}>$50,000+</option>
                    <option value={100000}>$100,000+</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="text-sm text-dark-400">
              Showing {filteredActivities.length} whale activities
            </div>

            {/* Activities Feed */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${minAmount}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, y: -4 }}
                    className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-accent-500/0 group-hover:from-blue-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Link
                        href={`/dashboard-v2/traders/${activity.username}`}
                        className="group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(activity.tier)} flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          {activity.avatar ? (
                            <Image
                              src={activity.avatar}
                              alt={activity.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{activity.username[0].toUpperCase()}</span>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/dashboard-v2/traders/${activity.username}`}
                                className="font-semibold text-white hover:text-primary-400 transition-colors"
                              >
                                {activity.displayName}
                              </Link>
                              {activity.verified && (
                                <Shield className="w-4 h-4 text-accent-400" />
                              )}
                              <span className="text-xs text-dark-400 flex items-center gap-1">
                                {getTierIcon(activity.tier)}
                                {activity.tier}
                              </span>
                            </div>
                            <div className="text-sm text-dark-300">
                              <span className={`${getActionColor(activity.action)} flex items-center gap-1 inline-flex`}>
                                {getActionIcon(activity.action)} {getActionText(activity.action)}
                              </span>
                              {' '}
                              <span className="font-bold text-white">
                                ${activity.amount.toLocaleString()}
                              </span>
                              {' '}in{' '}
                              <Link
                                href={`/dashboard-v2/bots/${activity.botSlug}`}
                                className="text-primary-400 hover:text-primary-300 transition-colors"
                              >
                                {activity.botName}
                              </Link>
                            </div>
                          </div>
                          <div className="text-xs text-dark-500">
                            {timeAgo(activity.timestamp)}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dark-700">
                          <div>
                            <div className="text-xs text-dark-400">Total Invested</div>
                            <div className="text-sm font-bold text-white">
                              ${activity.totalInvested.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-dark-400">Total Profit</div>
                            <div className="text-sm font-bold text-green-400">
                              +${activity.totalProfit.toLocaleString()}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <Link
                              href={`/dashboard-v2/traders/${activity.username}`}
                              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Strategy
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-12 text-center"
              >
                <Fish className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No whale activities found</h3>
                <p className="text-dark-400">
                  Try adjusting your filters to see more activities
                </p>
              </motion.div>
            )}
          </div>

          {/* Top Whales Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top Whales
              </h2>
              <div className="space-y-4">
                {uniqueWhales.slice(0, 5).map((whale, index) => (
                  <motion.div
                    key={whale.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link
                      href={`/dashboard-v2/traders/${whale.username}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl hover:bg-dark-900 transition-all">
                        <div className="text-lg font-bold text-dark-500 w-6">
                          #{index + 1}
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTierColor(whale.tier)} flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0`}>
                          {whale.avatar ? (
                            <Image
                              src={whale.avatar}
                              alt={whale.username}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{whale.username[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                              {whale.displayName}
                            </span>
                            {whale.verified && <Shield className="w-3 h-3 text-accent-400" />}
                          </div>
                          <div className="text-xs text-dark-400">
                            ${whale.totalInvested.toLocaleString()} invested
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <Link
                href="/dashboard-v2/traders"
                className="block mt-4 px-4 py-2 bg-dark-900/50 border border-dark-700 rounded-lg text-center text-sm text-dark-300 hover:text-white hover:border-dark-600 transition-all flex items-center justify-center gap-2"
              >
                View All Traders
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
