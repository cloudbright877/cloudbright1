'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Medal,
  Calendar,
  CalendarDays,
  Infinity,
  DollarSign,
  Star,
  Shield,
  Gem,
  Award,
  Search,
  Wallet,
  Percent
} from 'lucide-react';

// Social system imports
import type { LeaderboardEntry, LeaderboardCategory, LeaderboardTimeFrame } from '@/lib/social/types';
import { calculateLeaderboard, getRankChange } from '@/lib/social/leaderboard';
import { getTierGradient, getTierIconName, getAvatarStyle } from '@/lib/social/tier-utils';
import { getSocialTraders, seedSocialData } from '@/lib/social/mock-seed';


export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<LeaderboardTimeFrame>('monthly');
  const [category, setCategory] = useState<LeaderboardCategory>('profit');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize data and recalculate when filters change
  useEffect(() => {
    seedSocialData();
    loadLeaderboard();
  }, [timeFrame, category]);

  const loadLeaderboard = () => {
    const traders = getSocialTraders();
    const calculated = calculateLeaderboard(traders, category, timeFrame, 'user_default');
    setLeaderboard(calculated);
  };

  // Filter by search query
  const filteredLeaderboard = leaderboard.filter(entry => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.username.toLowerCase().includes(query) ||
      entry.displayName.toLowerCase().includes(query)
    );
  });

  const currentUserEntry = filteredLeaderboard.find(entry => entry.isCurrentUser);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <div className="text-yellow-400 font-bold flex items-center justify-center"><Medal className="w-7 h-7" /></div>;
    if (rank === 2) return <div className="text-gray-400 font-bold flex items-center justify-center"><Medal className="w-7 h-7" /></div>;
    if (rank === 3) return <div className="text-orange-600 font-bold flex items-center justify-center"><Medal className="w-7 h-7" /></div>;
    return `#${rank}`;
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
        {/* Your Position Card */}
        {currentUserEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 backdrop-blur-sm border-2 border-primary-500/50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Position</h2>
              <div className="px-3 py-1 bg-primary-500/30 border border-primary-500/50 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                {getRankBadge(currentUserEntry.rank)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Profit</div>
                <div className="text-lg font-medium text-green-400">
                  ${currentUserEntry.stats.profit.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Return</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  +{currentUserEntry.stats.return}%
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Win Rate</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentUserEntry.stats.winRate}%
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Trades</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentUserEntry.stats.trades}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Invested</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  ${currentUserEntry.stats.invested.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Rank Change</div>
                <div className={`text-lg font-medium ${getRankChange(currentUserEntry.rank, currentUserEntry.previousRank).color}`}>
                  {getRankChange(currentUserEntry.rank, currentUserEntry.previousRank).text}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] mb-8"
        >
          <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Time Frame */}
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-dark-400 mb-3">Time Period</div>
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setTimeFrame('weekly')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    timeFrame === 'weekly'
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Weekly
                </button>
                <button
                  onClick={() => setTimeFrame('monthly')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    timeFrame === 'monthly'
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Monthly
                </button>
                <button
                  onClick={() => setTimeFrame('all-time')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    timeFrame === 'all-time'
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <Infinity className="w-4 h-4" />
                  All-Time
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-dark-400 mb-3">Ranked By</div>
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setCategory('profit')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    category === 'profit'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Profit
                </button>
                <button
                  onClick={() => setCategory('return')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    category === 'return'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  Return
                </button>
                <button
                  onClick={() => setCategory('winRate')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    category === 'winRate'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Win Rate
                </button>
                <button
                  onClick={() => setCategory('invested')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap ${
                    category === 'invested'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Invested
                </button>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-8 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-dark-500" />
          <input
            type="text"
            placeholder="Search traders by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {filteredLeaderboard.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className={`${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <Link
                href={`/dashboard-v2/traders/${entry.username}`}
                className="block group"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className={`rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] hover:shadow-2xl transition-all duration-300 ${
                    index === 0
                      ? 'hover:shadow-yellow-500/20'
                      : index === 1
                      ? 'hover:shadow-gray-400/20'
                      : 'hover:shadow-orange-600/20'
                  }`}>
                  <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-4">
                  {/* Top: Medal + Avatar + Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">{getRankBadge(entry.rank)}</div>
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg overflow-hidden" style={getAvatarStyle(entry.displayName)}>
                      {entry.avatar ? (
                        <Image
                          src={entry.avatar}
                          alt={entry.username}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{entry.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-400 transition-colors">
                          {entry.displayName}
                        </h3>
                        {entry.verified && <Shield className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-dark-400">@{entry.username}</div>
                    </div>
                    <div className={`text-xs font-medium flex-shrink-0 ${getRankChange(entry.rank, entry.previousRank).color}`}>
                      {getRankChange(entry.rank, entry.previousRank).text}
                    </div>
                  </div>

                  {/* Profit highlight */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/50 rounded-lg px-3 py-2 mb-2">
                    <span className="text-[10px] text-gray-600 dark:text-dark-400">Profit</span>
                    <span className="text-sm font-medium text-green-400">${entry.stats.profit.toLocaleString()}</span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg px-2 py-1.5 text-center">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400">Return</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">+{entry.stats.return}%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg px-2 py-1.5 text-center">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400">Win Rate</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">{entry.stats.winRate}%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg px-2 py-1.5 text-center">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400">Invested</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">${entry.stats.invested.toLocaleString()}</div>
                    </div>
                  </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]"
        >
          <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-900/50">
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Rank</th>
                  <th className="text-left text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Trader</th>
                  <th className="hidden md:table-cell text-left text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Tier</th>
                  <th className="text-right text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Profit</th>
                  <th className="hidden sm:table-cell text-right text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Return</th>
                  <th className="hidden sm:table-cell text-right text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Win Rate</th>
                  <th className="hidden lg:table-cell text-right text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Invested</th>
                  <th className="hidden lg:table-cell text-right text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Copiers</th>
                  <th className="hidden md:table-cell text-center text-sm text-gray-600 dark:text-dark-400 font-medium p-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.slice(3).map((entry, index) => (
                  <motion.tr
                    key={entry.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.02 }}
                    className={`border-b border-dark-800 hover:bg-dark-800/30 transition-colors ${
                      entry.isCurrentUser ? 'bg-primary-500/10' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {getRankBadge(entry.rank)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard-v2/traders/${entry.username}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-bold overflow-hidden" style={getAvatarStyle(entry.displayName)}>
                          {entry.avatar ? (
                            <Image
                              src={entry.avatar}
                              alt={entry.username}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{entry.username[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-normal text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors">
                              {entry.displayName}
                            </span>
                            {entry.verified && <Shield className="w-3 h-3 text-accent-400" />}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-dark-400">@{entry.username}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="hidden md:table-cell p-4">
                      <span className="text-xs text-gray-700 dark:text-dark-300 flex items-center gap-1">
                        {getTierIcon(entry.tier)}
                        {entry.tier}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-green-400">
                        ${entry.stats.profit.toLocaleString()}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4 text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        +{entry.stats.return}%
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4 text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.stats.winRate}%
                      </div>
                    </td>
                    <td className="hidden lg:table-cell p-4 text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${entry.stats.invested.toLocaleString()}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell p-4 text-right">
                      <div className="text-sm text-gray-700 dark:text-dark-300">
                        {entry.stats.copiers.toLocaleString()}
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center">
                      <div className={`text-sm font-medium ${getRankChange(entry.rank, entry.previousRank).color}`}>
                        {getRankChange(entry.rank, entry.previousRank).text}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
