'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { BotCarousel } from '@/components/dashboard-v2/BotCarousel';
import { Shield, ChevronRight, Bot, Scale, TrendingUp, Target } from 'lucide-react';
import { getAllDemoBots } from '@/lib/demoMarketplace';
import type { DemoBot } from '@/lib/demoMarketplace';

export default function BotsPage() {
  const [activeTab, setActiveTab] = useState<'recommendation' | 'ranklist'>('recommendation');
  const [sortBy, setSortBy] = useState<'rating' | 'return' | 'copiers' | 'winRate' | 'risk'>('rating');

  // Get demo bots directly (no API call needed)
  const bots = getAllDemoBots();

  // Filter and sort bots for Rank List
  const filteredAndSortedBots = [...bots].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.stats.rating - a.stats.rating;
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

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (risk === 'medium') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return 'Low Risk';
    if (risk === 'medium') return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary-400" />
              Trading Bots
            </h1>
            <p className="text-dark-300">Choose from a wide selection of AI-powered bots to copy and start earning</p>
          </div>
          <Link
            href="/dashboard-v2/bots/compare"
            className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all flex items-center gap-2"
          >
            <Scale className="w-5 h-5" />
            <span className="hidden md:inline">Compare Bots</span>
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-0.5 rounded-lg bg-dark-900/50 border border-dark-700 p-1 inline-flex">
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`px-6 py-3 font-semibold rounded-lg text-sm transition-all ${
                activeTab === 'recommendation'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Recommendation
            </button>
            <button
              onClick={() => setActiveTab('ranklist')}
              className={`px-6 py-3 font-semibold rounded-lg text-sm transition-all ${
                activeTab === 'ranklist'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Rank List
            </button>
          </div>
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
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
              className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
                <span className="text-sm font-semibold text-dark-300 flex-shrink-0">Sort by:</span>
                {[
                  { label: 'Rating', value: 'rating' },
                  { label: 'Return', value: 'return' },
                  { label: 'Copiers', value: 'copiers' },
                  { label: 'Win Rate', value: 'winRate' },
                  { label: 'Risk Band', value: 'risk' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-dark-900/50 border border-dark-700 text-dark-300 hover:text-white hover:border-primary-500/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
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
                  className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-lg font-bold text-dark-500">
                        {index + 1}
                      </span>
                    </div>

                    {/* Bot Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg">
                        {bot.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white truncate">
                            {bot.name}
                          </h3>
                          {bot.verified && (
                            <Shield className="w-4 h-4 text-accent-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-dark-400 truncate">
                          {bot.strategy}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-xs text-dark-400 mb-1">Rating</div>
                        <div className="text-sm font-bold text-white">
                          {bot.stats.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-dark-400 mb-1">Return</div>
                        <div className="text-sm font-bold text-green-400">
                          +{bot.stats.return1y.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-dark-400 mb-1">Copiers</div>
                        <div className="text-sm font-bold text-white">
                          {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-dark-400 mb-1">Win Rate</div>
                        <div className="text-sm font-bold text-white">
                          {bot.stats.winRate.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-dark-400 mb-1">Risk</div>
                        <div className={`text-sm font-bold ${getRiskColor(bot.risk).split(' ')[0]}`}>
                          {getRiskLabel(bot.risk)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/dashboard-v2/bots/${bot.slug}`}
                        className="px-4 py-2 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all text-sm font-semibold"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/dashboard-v2/bots/${bot.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all text-sm"
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
