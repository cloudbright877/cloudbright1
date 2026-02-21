'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BotCarousel } from '@/components/dashboard-v2/BotCarousel';
import { Shield, ChevronRight, Bot, Scale, TrendingUp, Target } from 'lucide-react';
import { getAllDemoBots } from '@/lib/demoMarketplace';
import type { DemoBot } from '@/lib/demoMarketplace';
import { priceService } from '@/lib/PriceService';
import { botManager } from '@/lib/BotManager';

export default function BotsPage() {
  const [activeTab, setActiveTab] = useState<'recommendation' | 'ranklist'>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'ranklist' : 'recommendation'
  );
  const [sortBy, setSortBy] = useState<'return' | 'copiers' | 'winRate' | 'risk'>('return');
  const [bots, setBots] = useState<DemoBot[]>([]);

  // Load bots and update in real-time
  useEffect(() => {
    // Load bots from localStorage
    botManager.load();

    // Connect to Binance WebSocket
    priceService.connect();

    // Subscribe to price updates
    const unsubscribe = priceService.subscribe((prices) => {
      botManager.tick(prices);
    });

    // Initial load
    setBots(getAllDemoBots());

    // Update UI every 2 seconds to refresh performance data
    const interval = setInterval(() => {
      setBots(getAllDemoBots());
    }, 2000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Filter and sort bots for Rank List
  const filteredAndSortedBots = [...bots].sort((a, b) => {
    switch (sortBy) {
      case 'return':
        return b.stats.return1y - a.stats.return1y;
      case 'copiers':
        return b.stats.copiers - a.stats.copiers;
      case 'winRate':
        return b.stats.winRate - a.stats.winRate;
      case 'risk':
        const riskOrder = { low: 1, medium: 2, high: 3 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      default:
        return 0;
    }
  });

  // Categorize bots for Recommendation tab
  const highestReturnBots = [...bots].sort((a, b) => b.stats.return1y - a.stats.return1y).slice(0, 10);
  const lowRiskBots = bots.filter(b => b.risk === 'low').slice(0, 10);
  const highWinRateBots = [...bots].sort((a, b) => b.stats.winRate - a.stats.winRate).slice(0, 10);

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return 'Low Risk';
    if (risk === 'medium') return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs + Compare */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between gap-2 sm:gap-4"
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium rounded-lg sm:rounded-md text-sm transition-all ${
                activeTab === 'recommendation'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white sm:shadow-lg sm:shadow-primary-500/30'
                  : 'bg-gray-200 dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 sm:bg-transparent sm:dark:bg-transparent sm:border-0 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Recommendation
            </button>
            <button
              onClick={() => setActiveTab('ranklist')}
              className={`px-3 sm:px-6 py-2.5 sm:py-3 font-medium rounded-lg sm:rounded-md text-sm transition-all ${
                activeTab === 'ranklist'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white sm:shadow-lg sm:shadow-primary-500/30'
                  : 'bg-gray-200 dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 sm:bg-transparent sm:dark:bg-transparent sm:border-0 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Rank List
            </button>
          </div>
          <Link
            href="/dashboard-v2/bots/compare"
            className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all flex items-center gap-2"
          >
            <Scale className="w-5 h-5" />
            <span className="hidden md:inline">Compare Bots</span>
          </Link>
        </motion.div>

        {/* Content */}
        {activeTab === 'recommendation' && (
          <div className="space-y-8">
            {/* Highest Annual Return */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                  Highest Annual Return
                </h2>
                <button
                  onClick={() => setActiveTab('ranklist')}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <BotCarousel title="Highest Annual Return" bots={highestReturnBots} />
            </motion.div>

            {/* Low Risk And Stable Return */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                  Low Risk And Stable Return
                </h2>
                <button
                  onClick={() => setActiveTab('ranklist')}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <BotCarousel title="Low Risk And Stable Return" bots={lowRiskBots} />
            </motion.div>

            {/* High Win Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                  High Win Rate
                </h2>
                <button
                  onClick={() => setActiveTab('ranklist')}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <BotCarousel title="High Win Rate" bots={highWinRateBots} />
            </motion.div>
          </div>
        )}

        {/* Rank List Tab */}
        {activeTab === 'ranklist' && (
          <>
            {/* Sort Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] mb-6"
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
                      onClick={() => setSortBy(option.value as any)}
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

            {/* Bots List */}
            <div className="space-y-3">
              {filteredAndSortedBots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
                  {/* Row 1: Rank + Icon + Name (+ desktop stats + desktop actions) */}
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
                        <div className={`text-sm font-normal ${bot.stats.return1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
                      <Link
                        href={`/dashboard-v2/bots/${bot.slug}`}
                        className="px-4 py-2 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white font-semibold hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-accent-500/20 hover:border-primary-500/50 transition-all text-sm"
                      >
                        Copy
                      </Link>
                    </div>
                  </div>

                  {/* Row 2: Stats — mobile only */}
                  <div className="md:hidden grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-dark-700/50">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/30 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">1y Return</span>
                      <span className={`text-sm font-medium ${bot.stats.return1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white font-semibold text-sm hover:border-primary-500/50 transition-all text-center"
                    >
                      Copy
                    </Link>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
