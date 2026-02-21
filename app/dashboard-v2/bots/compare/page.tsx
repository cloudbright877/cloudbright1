'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { getAllDemoBots, getDemoBotBySlug, type DemoBot } from '@/lib/demoMarketplace';

interface CompareBot {
  id: string;
  slug: string;
  name: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
  verified: boolean;
  stats: {
    return7d: number;
    return30d: number;
    return90d: number;
    return1y: number;
    winRate: number;
    maxDD: number;
    sharpeRatio: number;
    copiers: number;
    minInvestment: number;
    reservationDays?: number;
  };
  strategy: string;
  description: string;
}

function mapDemoBotToCompare(bot: DemoBot): CompareBot {
  return {
    id: bot.id,
    slug: bot.slug,
    name: bot.name,
    icon: bot.icon,
    risk: bot.risk,
    verified: bot.verified,
    strategy: bot.strategy,
    description: bot.description,
    stats: {
      return7d: bot.stats.return7d,
      return30d: bot.stats.return30d,
      return90d: bot.stats.return90d,
      return1y: bot.stats.return1y,
      winRate: bot.stats.winRate,
      maxDD: bot.stats.maxDD,
      sharpeRatio: bot.stats.sharpeRatio,
      copiers: bot.stats.copiers,
      minInvestment: bot.stats.minInvestment,
      reservationDays: bot.stats.reservationDays,
    },
  };
}

function getAvailableBots(): CompareBot[] {
  return getAllDemoBots().map(mapDemoBotToCompare);
}

function BotCompareContent() {
  const searchParams = useSearchParams();
  const botsParam = searchParams.get('bots');

  const [selectedBots, setSelectedBots] = useState<CompareBot[]>(() => {
    const allBots = getAvailableBots();
    if (botsParam) {
      const slugs = botsParam.split(',');
      const resolved = slugs
        .map((slug) => {
          const demoBot = getDemoBotBySlug(slug);
          return demoBot ? mapDemoBotToCompare(demoBot) : null;
        })
        .filter((b): b is CompareBot => b !== null);
      if (resolved.length >= 2) return resolved;
    }
    return allBots.length >= 2 ? [allBots[0], allBots[1]] : allBots.slice(0, 2);
  });

  // Update selected bots when URL params change
  useEffect(() => {
    if (botsParam) {
      const slugs = botsParam.split(',');
      const resolved = slugs
        .map((slug) => {
          const demoBot = getDemoBotBySlug(slug);
          return demoBot ? mapDemoBotToCompare(demoBot) : null;
        })
        .filter((b): b is CompareBot => b !== null);
      if (resolved.length >= 2) {
        setSelectedBots(resolved);
      }
    }
  }, [botsParam]);

  // Build current bots param for select page links
  const currentBotsParam = selectedBots.map((b) => b.slug).join(',');

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (risk === 'medium') return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
  };

  // Prepare radar chart data
  const radarData = [
    { metric: '30d Return', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.return30d])) },
    { metric: 'Win Rate', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.winRate])) },
    { metric: 'Sharpe Ratio', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.sharpeRatio * 20])) },
    { metric: 'Risk Mgmt', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, Math.abs(bot.stats.maxDD) * 5])) },
    { metric: 'Popularity', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, (bot.stats.copiers / 100)])) },
  ];

  const radarColors = ['#6B7FFF', '#8B5CF6', '#4A90E2'];

  const formatPercent = (value: number) => {
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  const getPercentColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto min-w-0">
      {/* Bot Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {selectedBots.map((bot, index) => (
          <motion.div
            key={index}
            className="relative rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]"
          >
            <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 overflow-hidden">

            <div className="relative z-10 min-w-0">
              {/* Row 1: Icon + Name/Strategy */}
              <div className="flex items-center gap-3 mb-3">
                {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                  <img src={bot.icon} alt={bot.name} className="w-10 h-10 object-contain flex-shrink-0" />
                ) : (
                  <div className="text-2xl flex-shrink-0">{bot.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {bot.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-dark-400 truncate">{bot.strategy}</div>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${getRiskColor(bot.risk)}`}>
                  {bot.risk === 'low' ? 'Low' : bot.risk === 'medium' ? 'Medium' : 'High'}
                </span>
              </div>

              {/* Row 2: Stats */}
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-4 gap-2 mb-3 py-2 border-t border-gray-100 dark:border-dark-700/50">
                <div className="flex items-center justify-between sm:flex-col sm:text-center sm:flex-1 bg-gray-50 dark:bg-dark-900/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg px-3 py-2 sm:p-0">
                  <span className="text-xs text-gray-500 dark:text-dark-500 sm:text-[10px] sm:mb-1">30d</span>
                  <span className={`text-sm font-medium ${getPercentColor(bot.stats.return30d)}`}>
                    {formatPercent(bot.stats.return30d)}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:text-center sm:flex-1 bg-gray-50 dark:bg-dark-900/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg px-3 py-2 sm:p-0">
                  <span className="text-xs text-gray-500 dark:text-dark-500 sm:text-[10px] sm:mb-1">1y</span>
                  <span className={`text-sm font-medium ${getPercentColor(bot.stats.return1y)}`}>
                    {formatPercent(bot.stats.return1y)}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:text-center sm:flex-1 bg-gray-50 dark:bg-dark-900/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg px-3 py-2 sm:p-0">
                  <span className="text-xs text-gray-500 dark:text-dark-500 sm:text-[10px] sm:mb-1">Win Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{bot.stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:text-center sm:flex-1 bg-gray-50 dark:bg-dark-900/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg px-3 py-2 sm:p-0">
                  <span className="text-xs text-gray-500 dark:text-dark-500 sm:text-[10px] sm:mb-1">Copiers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                  </span>
                </div>
              </div>

              {/* Row 3: Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard-v2/bots/compare/select?slot=${index}&bots=${currentBotsParam}`}
                  className="flex-1 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 text-sm font-semibold hover:bg-primary-500/30 transition-all text-center"
                >
                  Change
                </Link>
                <Link
                  href={`/dashboard-v2/bots/${bot.slug}`}
                  className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white text-sm font-semibold hover:border-primary-500/50 transition-all text-center"
                >
                  Details
                </Link>
              </div>
            </div>
            </div>
          </motion.div>
        ))}

        {/* Add Bot Button */}
        {selectedBots.length < 3 && (
          <Link
            href={`/dashboard-v2/bots/compare/select?slot=${selectedBots.length}&bots=${currentBotsParam}`}
            className="bg-gray-50 dark:bg-dark-900/50 border-2 border-dashed border-gray-300 dark:border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 hover:bg-gray-100 dark:hover:bg-dark-800/50 transition-all flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-900 dark:text-white">+</div>
              <div className="text-sm text-gray-600 dark:text-dark-400">Add Bot to Compare</div>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Radar Chart Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 overflow-hidden">
        <h2 className="text-base sm:text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          Performance Overview
        </h2>
        <div className="h-[280px] sm:h-[400px] [&_*]:outline-none overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
              <PolarGrid stroke="currentColor" className="text-gray-300 dark:text-gray-700" strokeOpacity={0.5} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: 'currentColor', fontSize: 10 }}
                className="[&_text]:fill-gray-700 dark:[&_text]:fill-gray-400 sm:[&_text]:text-xs"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'currentColor', fontSize: 8 }}
                className="[&_text]:fill-gray-600 dark:[&_text]:fill-gray-500"
              />
              {selectedBots.map((bot, index) => (
                <Radar
                  key={index}
                  name={bot.name}
                  dataKey={`bot${index}`}
                  stroke={radarColors[index]}
                  fill={radarColors[index]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-gray-900 dark:text-white text-xs sm:text-sm">{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 dark:text-dark-400 text-center mt-4">
          Normalized metrics for visual comparison. Higher values indicate better performance.
        </p>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] overflow-hidden">
        {/* Performance Metrics */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h2>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-0">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-dark-400">Metric</th>
                  {selectedBots.map((bot) => (
                    <th key={bot.id} className="text-center py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center gap-2">
                        {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                          <img src={bot.icon} alt={bot.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="text-lg">{bot.icon}</div>
                        )}
                        <span className="truncate max-w-[120px]">{bot.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">7d Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return7d)}`}>{formatPercent(bot.stats.return7d)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">30d Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return30d)}`}>{formatPercent(bot.stats.return30d)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">90d Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return90d)}`}>{formatPercent(bot.stats.return90d)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">1y Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return1y)}`}>{formatPercent(bot.stats.return1y)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Win Rate</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.winRate.toFixed(1)}%</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Sharpe</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.sharpeRatio}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Reservation</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.reservationDays || 30} days</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards per bot */}
          <div className="sm:hidden space-y-4">
            {selectedBots.map((bot) => (
              <div key={bot.id} className="bg-gray-50 dark:bg-dark-900/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-dark-700/50">
                  {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                    <img src={bot.icon} alt={bot.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="text-base">{bot.icon}</div>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{bot.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '7d Return', value: formatPercent(bot.stats.return7d), color: getPercentColor(bot.stats.return7d) },
                    { label: '30d Return', value: formatPercent(bot.stats.return30d), color: getPercentColor(bot.stats.return30d) },
                    { label: '90d Return', value: formatPercent(bot.stats.return90d), color: getPercentColor(bot.stats.return90d) },
                    { label: '1y Return', value: formatPercent(bot.stats.return1y), color: getPercentColor(bot.stats.return1y) },
                    { label: 'Win Rate', value: `${bot.stats.winRate.toFixed(1)}%`, color: 'text-gray-900 dark:text-white' },
                    { label: 'Sharpe', value: `${bot.stats.sharpeRatio}`, color: 'text-gray-900 dark:text-white' },
                    { label: 'Reservation', value: `${bot.stats.reservationDays || 30}d`, color: 'text-gray-900 dark:text-white' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between bg-white dark:bg-dark-800/50 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500 dark:text-dark-500">{metric.label}</span>
                      <span className={`text-sm font-medium ${metric.color}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Requirements */}
        <div className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Pricing & Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBots.map((bot) => (
              <div
                key={bot.id}
                className="p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                      <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="text-2xl">{bot.icon}</div>
                    )}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">{bot.name}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Capital Reservation:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{bot.stats.reservationDays || 30} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Current Copiers:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{bot.stats.copiers.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard-v2/bots/${bot.slug}`}
                  className="mt-4 block w-full py-2 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-lg font-semibold text-gray-900 dark:text-white hover:border-primary-500/50 transition-all text-center text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>
      </motion.div>

      </div>
    </div>
  );
}

export default function BotComparePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-gray-900 dark:text-white">Loading...</div>}>
      <BotCompareContent />
    </Suspense>
  );
}
