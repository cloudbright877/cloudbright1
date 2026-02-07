'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  Copy,
  UserPlus,
  UserCheck
} from 'lucide-react';

// Social system imports
import type { WhaleAlert } from '@/lib/social/types';
import { getFilteredWhaleAlerts, getTopWhales } from '@/lib/social/whale-detector';
import { getTierGradient, getTierIconName } from '@/lib/social/tier-utils';
import { toggleFollow, isFollowing } from '@/lib/social/follow-system';
import { seedSocialData } from '@/lib/social/mock-seed';


type FilterType = 'all' | 'invested' | 'profit' | 'withdrew';

export default function WhalesPage() {
  const [activities, setActivities] = useState<WhaleAlert[]>([]);
  const [topWhales, setTopWhales] = useState<WhaleAlert[]>([]);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [minAmount, setMinAmount] = useState(10000);

  // Initialize data on mount
  useEffect(() => {
    seedSocialData();
    loadActivities();
    loadTopWhales();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadActivities();
  }, [filter, minAmount]);

  const loadActivities = () => {
    const loaded = getFilteredWhaleAlerts(filter, minAmount);
    setActivities(loaded);

    // Load follow states
    const states: Record<string, boolean> = {};
    loaded.forEach(activity => {
      states[activity.traderId] = isFollowing(activity.traderId);
    });
    setFollowStates(states);
  };

  const loadTopWhales = () => {
    const loaded = getTopWhales(5);
    setTopWhales(loaded);
  };

  const handleFollowToggle = (traderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFollow(traderId);
    setFollowStates(prev => ({ ...prev, [traderId]: newState }));
  };

  const filteredActivities = activities;

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

  const getTierIcon = (tier: string) => {
    const iconName = getTierIconName(tier);
    const iconMap = { Gem, Trophy, Award, Medal };
    const IconComponent = iconMap[iconName];
    return <IconComponent className="w-3 h-3" />;
  };

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
                        href={`/dashboard-v2/traders/${activity.traderUsername}`}
                        className="group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierGradient(activity.traderTier)} flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          {activity.traderAvatar ? (
                            <Image
                              src={activity.traderAvatar}
                              alt={activity.traderUsername}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{activity.traderUsername[0].toUpperCase()}</span>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/dashboard-v2/traders/${activity.traderUsername}`}
                                className="font-semibold text-white hover:text-primary-400 transition-colors"
                              >
                                {activity.traderDisplayName}
                              </Link>
                              {activity.traderVerified && (
                                <Shield className="w-4 h-4 text-accent-400" />
                              )}
                              <span className="text-xs text-dark-400 flex items-center gap-1">
                                {getTierIcon(activity.traderTier)}
                                {activity.traderTier}
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
                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={(e) => handleFollowToggle(activity.traderId, e)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                followStates[activity.traderId]
                                  ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                  : 'bg-dark-900/50 border border-primary-500/30 text-primary-400 hover:bg-primary-500/10'
                              }`}
                            >
                              {followStates[activity.traderId] ? (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  Follow
                                </>
                              )}
                            </button>
                            <Link
                              href={`/dashboard-v2/traders/${activity.traderUsername}`}
                              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
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
                {topWhales.map((whale, index) => (
                  <motion.div
                    key={whale.traderId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link
                      href={`/dashboard-v2/traders/${whale.traderUsername}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl hover:bg-dark-900 transition-all">
                        <div className="text-lg font-bold text-dark-500 w-6">
                          #{index + 1}
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTierGradient(whale.traderTier)} flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0`}>
                          {whale.traderAvatar ? (
                            <Image
                              src={whale.traderAvatar}
                              alt={whale.traderUsername}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{whale.traderUsername[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                              {whale.traderDisplayName}
                            </span>
                            {whale.traderVerified && <Shield className="w-3 h-3 text-accent-400" />}
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
