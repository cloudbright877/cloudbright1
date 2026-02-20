'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Shield,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';
import { getAllDemoBots } from '@/lib/demoMarketplace';

function BotSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot = searchParams.get('slot') || '0';
  const currentBots = searchParams.get('bots') || '';

  const [search, setSearch] = useState('');

  const allBots = getAllDemoBots();

  // Parse currently selected bot slugs
  const selectedSlugs = currentBots ? currentBots.split(',') : [];

  // Filter bots by search query
  const filteredBots = allBots.filter((bot) => {
    const q = search.toLowerCase();
    return (
      bot.name.toLowerCase().includes(q) ||
      bot.strategy.toLowerCase().includes(q) ||
      bot.description.toLowerCase().includes(q) ||
      bot.risk.toLowerCase().includes(q)
    );
  });

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
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
      // Adding a new bot
      newSlugs.push(botSlug);
    } else {
      // Replacing existing bot
      newSlugs[slotIndex] = botSlug;
    }

    const botsParam = newSlugs.join(',');
    router.push(`/dashboard-v2/bots/compare?bots=${botsParam}`);
  };

  // Build back URL preserving current bots
  const backUrl = currentBots
    ? `/dashboard-v2/bots/compare?bots=${currentBots}`
    : '/dashboard-v2/bots/compare';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Compare</span>
        </Link>

        <h1 className="text-3xl font-semibold text-white mb-2">Select Bot</h1>
        <p className="text-dark-400">Choose a bot to add to comparison</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, strategy, or risk level..."
            className="w-full pl-12 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Bot List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-3"
      >
        {filteredBots.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            No bots found matching &quot;{search}&quot;
          </div>
        )}

        {filteredBots.map((bot) => {
          const isSelected = selectedSlugs.includes(bot.slug);

          return (
            <motion.button
              key={bot.id}
              whileHover={{ scale: 1.01, x: 4 }}
              onClick={() => !isSelected && handleSelectBot(bot.slug)}
              disabled={isSelected}
              className="p-5 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] hover:bg-dark-800/50 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
            >
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-5 hover:border-primary-500/50 transition-all">
              <div className="flex items-center gap-4">
                {/* Bot Icon */}
                {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                  <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0">
                    {bot.icon}
                  </div>
                )}

                {/* Bot Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white flex items-center gap-2 mb-1">
                    {bot.name}
                    {bot.verified && <Shield className="w-4 h-4 text-accent-400 flex-shrink-0" />}
                    {isSelected && (
                      <span className="px-2 py-0.5 text-[10px] bg-primary-500/20 border border-primary-500/30 text-primary-400 rounded-full font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-dark-400 truncate">{bot.strategy}</div>
                  <div className="text-xs text-dark-500 mt-1 line-clamp-1">{bot.description}</div>

                  {/* Tags Row */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getRiskColor(bot.risk)}`}>
                      {bot.risk === 'low' ? 'Low Risk' : bot.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-dark-400">
                      <Clock className="w-3 h-3" />
                      {bot.stats.reservationDays || 30}d lock
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-dark-400">
                      <Users className="w-3 h-3" />
                      {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-medium flex items-center gap-1 justify-end ${getPercentColor(bot.stats.return30d)}`}>
                    <TrendingUp className="w-4 h-4" />
                    {formatPercent(bot.stats.return30d)}
                  </div>
                  <div className="text-[10px] text-dark-400">30d return</div>
                  <div className={`text-sm font-normal mt-1 ${getPercentColor(bot.stats.return1y)}`}>
                    {formatPercent(bot.stats.return1y)}
                  </div>
                  <div className="text-[10px] text-dark-400">1y return</div>
                </div>
              </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function BotSelectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-white">Loading...</div>}>
      <BotSelectContent />
    </Suspense>
  );
}
