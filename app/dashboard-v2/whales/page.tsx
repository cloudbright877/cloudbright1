'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
} from 'lucide-react';

// Social system imports
import type { WhaleAlert } from '@/lib/social/types';
import { getFilteredWhaleAlerts, getTopWhales } from '@/lib/social/whale-detector';
import { getTierGradient, getTierIconName, getAvatarStyle } from '@/lib/social/tier-utils';
import { seedSocialData } from '@/lib/social/mock-seed';


type FilterType = 'all' | 'invested' | 'withdrew';

export default function WhalesPage() {
  const [activities, setActivities] = useState<WhaleAlert[]>([]);
  const [topWhales, setTopWhales] = useState<WhaleAlert[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [minAmount, setMinAmount] = useState(10000);
  const [showAmountDropdown, setShowAmountDropdown] = useState(false);
  const amountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (amountDropdownRef.current && !amountDropdownRef.current.contains(e.target as Node)) {
        setShowAmountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
  };

  const loadTopWhales = () => {
    const loaded = getTopWhales(5);
    setTopWhales(loaded);
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
      case 'withdrew': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'invested': return <DollarSign className="w-4 h-4" />;
      case 'withdrew': return <Banknote className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'invested': return 'invested';
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
    <div className="min-h-screen bg-gray-100 dark:bg-dark-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-visible relative z-20"
            >
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Action Filter */}
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-dark-400 mb-3">Activity Type</div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'all'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('invested')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        filter === 'invested'
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Investments
                    </button>
                    <button
                      onClick={() => setFilter('withdrew')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        filter === 'withdrew'
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Withdrawals
                    </button>
                  </div>
                </div>

                {/* Min Amount Filter */}
                <div className="md:w-48">
                  <div className="text-sm text-gray-600 dark:text-dark-400 mb-3">Min Amount</div>
                  <div className="relative" ref={amountDropdownRef}>
                    <button
                      onClick={() => setShowAmountDropdown(!showAmountDropdown)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white flex items-center justify-between gap-2 hover:border-gray-300 dark:hover:border-dark-600 transition-colors"
                    >
                      <span>${minAmount >= 1000 ? `${(minAmount / 1000).toFixed(0)}k` : minAmount}+</span>
                      <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-dark-400 transition-transform ${showAmountDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showAmountDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden z-[9999] shadow-xl"
                        >
                          {[
                            { value: 5000, label: '$5,000+' },
                            { value: 10000, label: '$10,000+' },
                            { value: 25000, label: '$25,000+' },
                            { value: 50000, label: '$50,000+' },
                            { value: 100000, label: '$100,000+' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setMinAmount(opt.value); setShowAmountDropdown(false); }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                minAmount === opt.value
                                  ? 'bg-primary-500/20 text-primary-400'
                                  : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              </div>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-dark-400">
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
                  >
                    <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                    <div className="relative bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Link
                        href={`/dashboard-v2/traders/${activity.traderUsername}`}
                        className="group"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform" style={getAvatarStyle(activity.traderDisplayName)}>
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
                                className="font-semibold text-gray-900 dark:text-white hover:text-primary-400 transition-colors"
                              >
                                {activity.traderDisplayName}
                              </Link>
                              {activity.traderVerified && (
                                <Shield className="w-4 h-4 text-accent-400" />
                              )}
                              <span className="text-xs text-gray-600 dark:text-dark-400 flex items-center gap-1">
                                {getTierIcon(activity.traderTier)}
                                {activity.traderTier}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-dark-300 flex-wrap">
                              <span className={`${getActionColor(activity.action)} flex items-center gap-1`}>
                                {getActionIcon(activity.action)} {getActionText(activity.action)}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${activity.amount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-dark-500">
                            {timeAgo(activity.timestamp)}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-dark-700">
                          <div>
                            <div className="text-xs text-gray-600 dark:text-dark-400">Total Invested</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              ${activity.totalInvested.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-dark-400">Total Profit</div>
                            <div className="text-sm font-medium text-green-400">
                              +${activity.totalProfit.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-dark-400">Return</div>
                            <div className="text-sm font-medium text-green-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +{activity.totalInvested > 0 ? ((activity.totalProfit / activity.totalInvested) * 100).toFixed(1) : '0.0'}%
                            </div>
                          </div>
                        </div>
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
              >
                <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-12 text-center">
                <Fish className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No whale activities found</h3>
                <p className="text-gray-600 dark:text-dark-400">
                  Try adjusting your filters to see more activities
                </p>
                </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Top Whales Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6"
            >
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-400" />
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
                      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-dark-900/50 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-900 transition-all">
                        <div className="text-lg font-medium text-gray-500 dark:text-dark-500 w-6">
                          #{index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-bold overflow-hidden flex-shrink-0" style={getAvatarStyle(whale.traderDisplayName)}>
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
                            <span className="text-sm font-normal text-gray-900 dark:text-white truncate group-hover:text-primary-400 transition-colors">
                              {whale.traderDisplayName}
                            </span>
                            {whale.traderVerified && <Shield className="w-3 h-3 text-accent-400" />}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-dark-400">
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
                href="/dashboard-v2/leaderboard"
                className="block mt-4 px-4 py-2 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-center text-sm text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:text-white hover:border-gray-300 dark:border-dark-600 transition-all flex items-center justify-center gap-2"
              >
                View Leaderboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
