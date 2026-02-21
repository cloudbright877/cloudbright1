'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
} from 'lucide-react';
import { getAllDemoBots } from '@/lib/demoMarketplace';

function BotSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot = searchParams.get('slot') || '0';
  const currentBots = searchParams.get('bots') || '';

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'return' | 'copiers' | 'winRate' | 'risk'>('return');

  const allBots = getAllDemoBots();
  const selectedSlugs = currentBots ? currentBots.split(',') : [];

  const filteredBots = allBots
    .filter((bot) => {
      const q = search.toLowerCase();
      return (
        bot.name.toLowerCase().includes(q) ||
        bot.strategy.toLowerCase().includes(q) ||
        bot.description.toLowerCase().includes(q) ||
        bot.risk.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'return':
          return b.stats.return1y - a.stats.return1y;
        case 'copiers':
          return b.stats.copiers - a.stats.copiers;
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        case 'risk': {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        }
        default:
          return 0;
      }
    });

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return 'Low Risk';
    if (risk === 'medium') return 'Medium Risk';
    return 'High Risk';
  };

  const getPercentColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatPercent = (value: number) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const handleSelectBot = (botSlug: string) => {
    const slotIndex = parseInt(slot);
    const newSlugs = [...selectedSlugs];
    if (slotIndex >= newSlugs.length) {
      newSlugs.push(botSlug);
    } else {
      newSlugs[slotIndex] = botSlug;
    }
    router.push(`/dashboard-v2/bots/compare?bots=${newSlugs.join(',')}`);
  };

  const backUrl = currentBots
    ? `/dashboard-v2/bots/compare?bots=${currentBots}`
    : '/dashboard-v2/bots/compare';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Compare</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2">Select Bot</h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-dark-400">Choose a bot to add to comparison</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bots..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] mb-6"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-normal text-gray-700 dark:text-dark-300 flex-shrink-0">Sort by:</span>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                {[
                  { label: 'Return', value: 'return' },
                  { label: 'Copiers', value: 'copiers' },
                  { label: 'Win Rate', value: 'winRate' },
                  { label: 'Risk Band', value: 'risk' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as typeof sortBy)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:border-primary-500/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bot List */}
        {filteredBots.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-dark-400">
            No bots found matching &quot;{search}&quot;
          </div>
        )}

        <div className="space-y-3">
          {filteredBots.map((bot, index) => {
            const isSelected = selectedSlugs.includes(bot.slug);

            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  {/* Row 1: Rank + Icon + Name (+ desktop stats + desktop button) */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-6 sm:w-8 text-center">
                      <span className="text-base sm:text-lg font-medium text-gray-400 dark:text-dark-500">
                        {index + 1}
                      </span>
                    </div>

                    {/* Bot Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                        <img src={bot.icon} alt={bot.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                          {bot.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                          {bot.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-dark-400 truncate">
                          {bot.strategy}
                        </p>
                      </div>
                    </div>

                    {/* Stats — desktop */}
                    <div className="hidden md:flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Return</div>
                        <div className={`text-sm font-normal ${getPercentColor(bot.stats.return1y)}`}>
                          {bot.stats.return1y >= 0 ? '+' : ''}{bot.stats.return1y.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Copiers</div>
                        <div className="text-sm font-normal text-gray-900 dark:text-white">
                          {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Win Rate</div>
                        <div className="text-sm font-normal text-gray-900 dark:text-white">
                          {bot.stats.winRate.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Risk</div>
                        <div className="text-sm font-normal text-gray-900 dark:text-white">
                          {getRiskLabel(bot.risk)}
                        </div>
                      </div>
                    </div>

                    {/* Actions — desktop */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/dashboard-v2/bots/${bot.slug}`}
                        className="px-4 py-2 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all text-sm font-semibold"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => !isSelected && handleSelectBot(bot.slug)}
                        disabled={isSelected}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-primary-500/20 border border-primary-500/30 text-primary-400 cursor-not-allowed'
                            : 'bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-accent-500/20 hover:border-primary-500/50'
                        }`}
                      >
                        {isSelected ? 'Added' : 'Select'}
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Stats — mobile only */}
                  <div className="md:hidden grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-dark-700/50">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/30 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">1y Return</span>
                      <span className={`text-sm font-medium ${getPercentColor(bot.stats.return1y)}`}>
                        {bot.stats.return1y >= 0 ? '+' : ''}{bot.stats.return1y.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/30 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">Win Rate</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{bot.stats.winRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/30 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">Copiers</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/30 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">Risk</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{getRiskLabel(bot.risk)}</span>
                    </div>
                  </div>

                  {/* Row 3: Buttons — mobile only */}
                  <div className="md:hidden flex items-center gap-2 mt-3">
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all text-sm font-semibold text-center"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => !isSelected && handleSelectBot(bot.slug)}
                      disabled={isSelected}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all text-center ${
                        isSelected
                          ? 'bg-primary-500/20 border border-primary-500/30 text-primary-400 cursor-not-allowed'
                          : 'bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white hover:border-primary-500/50'
                      }`}
                    >
                      {isSelected ? 'Added' : 'Select'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BotSelectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-gray-900 dark:text-white">Loading...</div>}>
      <BotSelectContent />
    </Suspense>
  );
}
