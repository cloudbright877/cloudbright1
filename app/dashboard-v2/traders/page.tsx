'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  Gem,
  Trophy,
  Award,
  Medal,
  Shield,
  DollarSign,
  TrendingUp,
  Star,
  Rocket,
  ArrowRight,
  Bot
} from 'lucide-react';

interface Trader {
  username: string;
  displayName: string;
  avatar: string | null;
  tier: string;
  verified: boolean;
  stats: {
    totalProfit: number;
    monthlyReturn: number;
    winRate: number;
    rank: number;
    followers: number;
    copiers: number;
    copiersAUM: number;
  };
  activeBots: number;
  joinedDate: string;
}

const mockTraders: Trader[] = [
  {
    username: 'john_pro',
    displayName: 'John "The Pro" Davis',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    stats: {
      totalProfit: 284750.00,
      monthlyReturn: 18.4,
      winRate: 73.2,
      rank: 47,
      followers: 12847,
      copiers: 3421,
      copiersAUM: 847293.50,
    },
    activeBots: 3,
    joinedDate: '2023-03-15',
  },
  {
    username: 'crypto_queen',
    displayName: 'Sarah "Crypto Queen" Miller',
    avatar: null,
    tier: 'Diamond',
    verified: true,
    stats: {
      totalProfit: 567240.00,
      monthlyReturn: 24.8,
      winRate: 81.5,
      rank: 12,
      followers: 28493,
      copiers: 8742,
      copiersAUM: 2847293.50,
    },
    activeBots: 5,
    joinedDate: '2022-11-20',
  },
  {
    username: 'algo_master',
    displayName: 'Alex "Algo Master" Chen',
    avatar: null,
    tier: 'Platinum',
    verified: true,
    stats: {
      totalProfit: 192847.00,
      monthlyReturn: 15.2,
      winRate: 68.9,
      rank: 89,
      followers: 8492,
      copiers: 2156,
      copiersAUM: 542847.20,
    },
    activeBots: 4,
    joinedDate: '2023-05-10',
  },
  {
    username: 'whale_watcher',
    displayName: 'Michael "Whale Watcher" Torres',
    avatar: null,
    tier: 'Platinum',
    verified: true,
    stats: {
      totalProfit: 158293.00,
      monthlyReturn: 12.8,
      winRate: 65.4,
      rank: 124,
      followers: 6247,
      copiers: 1847,
      copiersAUM: 384729.00,
    },
    activeBots: 2,
    joinedDate: '2023-07-01',
  },
  {
    username: 'defi_ninja',
    displayName: 'Emma "DeFi Ninja" Rodriguez',
    avatar: null,
    tier: 'Gold',
    verified: false,
    stats: {
      totalProfit: 94820.00,
      monthlyReturn: 9.7,
      winRate: 61.2,
      rank: 287,
      followers: 3492,
      copiers: 892,
      copiersAUM: 184729.00,
    },
    activeBots: 3,
    joinedDate: '2023-09-15',
  },
  {
    username: 'bot_hunter',
    displayName: 'David "Bot Hunter" Kim',
    avatar: null,
    tier: 'Gold',
    verified: false,
    stats: {
      totalProfit: 76240.00,
      monthlyReturn: 8.4,
      winRate: 58.7,
      rank: 342,
      followers: 2847,
      copiers: 647,
      copiersAUM: 142847.00,
    },
    activeBots: 2,
    joinedDate: '2023-10-20',
  },
  {
    username: 'smart_trader',
    displayName: 'Lisa "Smart Trader" Anderson',
    avatar: null,
    tier: 'Silver',
    verified: false,
    stats: {
      totalProfit: 48293.00,
      monthlyReturn: 6.8,
      winRate: 55.3,
      rank: 487,
      followers: 1847,
      copiers: 342,
      copiersAUM: 84729.00,
    },
    activeBots: 2,
    joinedDate: '2024-01-05',
  },
  {
    username: 'risk_manager',
    displayName: 'Tom "Risk Manager" Wilson',
    avatar: null,
    tier: 'Silver',
    verified: false,
    stats: {
      totalProfit: 34820.00,
      monthlyReturn: 5.2,
      winRate: 52.8,
      rank: 592,
      followers: 1247,
      copiers: 218,
      copiersAUM: 54729.00,
    },
    activeBots: 1,
    joinedDate: '2024-02-12',
  },
];

type SortOption = 'rank' | 'profit' | 'return' | 'copiers' | 'winRate';
type TierFilter = 'all' | 'diamond' | 'platinum' | 'gold' | 'silver';

export default function TradersPage() {
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort traders
  const filteredTraders = mockTraders
    .filter(trader => {
      // Tier filter
      if (tierFilter !== 'all') {
        const traderTier = trader.tier.toLowerCase();
        if (!traderTier.includes(tierFilter)) return false;
      }

      // Verified filter
      if (verifiedOnly && !trader.verified) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          trader.username.toLowerCase().includes(query) ||
          trader.displayName.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.stats.rank - b.stats.rank;
        case 'profit':
          return b.stats.totalProfit - a.stats.totalProfit;
        case 'return':
          return b.stats.monthlyReturn - a.stats.monthlyReturn;
        case 'copiers':
          return b.stats.copiers - a.stats.copiers;
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        default:
          return 0;
      }
    });

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
            <Users className="w-8 h-8 text-primary-400" />
            Top Traders
          </h1>
          <p className="text-dark-300">
            Discover and follow the best performing traders on Celestian
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 mb-8"
        >
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search traders by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  tierFilter === 'all'
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                }`}
              >
                All Tiers
              </button>
              <button
                onClick={() => setTierFilter('diamond')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  tierFilter === 'diamond'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                }`}
              >
                <Gem className="w-4 h-4" />
                Diamond
              </button>
              <button
                onClick={() => setTierFilter('platinum')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  tierFilter === 'platinum'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Platinum
              </button>
              <button
                onClick={() => setTierFilter('gold')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  tierFilter === 'gold'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                }`}
              >
                <Award className="w-4 h-4" />
                Gold
              </button>
              <button
                onClick={() => setTierFilter('silver')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  tierFilter === 'silver'
                    ? 'bg-gradient-to-r from-gray-500 to-gray-400 text-white'
                    : 'bg-dark-900/50 text-dark-300 hover:text-white border border-dark-700'
                }`}
              >
                <Medal className="w-4 h-4" />
                Silver
              </button>
            </div>

            {/* Verified Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-5 h-5 rounded bg-dark-900 border-dark-700 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-300 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Verified Only
              </span>
            </label>
          </div>

          {/* Sort */}
          <div className="mt-6 pt-6 border-t border-dark-700">
            <div className="flex items-center gap-2 text-sm text-dark-400 mb-3">
              Sort by:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('rank')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === 'rank'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-900/50 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                Rank
              </button>
              <button
                onClick={() => setSortBy('profit')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === 'profit'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-900/50 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                Total Profit
              </button>
              <button
                onClick={() => setSortBy('return')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === 'return'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-900/50 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Monthly Return
              </button>
              <button
                onClick={() => setSortBy('copiers')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === 'copiers'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-900/50 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Copiers
              </button>
              <button
                onClick={() => setSortBy('winRate')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === 'winRate'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-900/50 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                Win Rate
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-4 text-sm text-dark-400">
          Showing {filteredTraders.length} of {mockTraders.length} traders
        </div>

        {/* Traders Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${sortBy}-${tierFilter}-${verifiedOnly}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredTraders.map((trader, index) => (
              <motion.div
                key={trader.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -4 }}
              >
                <Link
                  href={`/dashboard-v2/traders/${trader.username}`}
                  className="block group"
                >
                  <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTierColor(trader.tier)} flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0 shadow-md`}>
                        {trader.avatar ? (
                          <Image
                            src={trader.avatar}
                            alt={trader.username}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{trader.username[0].toUpperCase()}</span>
                        )}
                      </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                              {trader.displayName}
                            </h3>
                            {trader.verified && (
                              <Shield className="w-4 h-4 text-accent-400" />
                            )}
                          </div>
                          <div className="text-sm text-dark-400 mb-2">
                            @{trader.username}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-dark-300 flex items-center gap-1">
                              {getTierIcon(trader.tier)}
                              {trader.tier}
                            </span>
                            <span className="text-dark-600">•</span>
                            <span className="text-xs text-dark-400 flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              Rank #{trader.stats.rank}
                            </span>
                          </div>
                        </div>

                        {/* Active Bots Badge */}
                        <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg">
                          <div className="text-xs text-dark-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            Active Bots
                          </div>
                          <div className="text-lg font-bold text-primary-400">
                            {trader.activeBots}
                          </div>
                        </div>
                      </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-dark-900/50 rounded-lg p-3">
                        <div className="text-xs text-dark-400 mb-1">Total Profit</div>
                        <div className="text-sm font-bold text-green-400">
                          ${trader.stats.totalProfit.toLocaleString('en-US')}
                        </div>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-3">
                        <div className="text-xs text-dark-400 mb-1">Monthly Avg</div>
                        <div className="text-sm font-bold text-green-400">
                          +{trader.stats.monthlyReturn}%
                        </div>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-3">
                        <div className="text-xs text-dark-400 mb-1">Win Rate</div>
                        <div className="text-sm font-bold text-white">
                          {trader.stats.winRate}%
                        </div>
                      </div>
                    </div>

                      {/* Social Stats */}
                      <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-dark-400">
                            <Users className="w-4 h-4" />
                            <span>{trader.stats.followers.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-dark-400">
                            <Rocket className="w-4 h-4" />
                            <span>{trader.stats.copiers.toLocaleString()} copiers</span>
                          </div>
                        </div>
                        <div className="text-primary-400 font-medium group-hover:text-primary-300 flex items-center gap-1">
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTraders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-12 text-center"
          >
            <Search className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No traders found</h3>
            <p className="text-dark-400">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
