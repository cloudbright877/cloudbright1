'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  AlertTriangle,
  ArrowLeft,
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
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Low Risk
      </span>
    );
    if (risk === 'medium') return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Medium Risk
      </span>
    );
    return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> High Risk
      </span>
    );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Bot Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {selectedBots.map((bot, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6 hover:border-primary-500/50 transition-all duration-300">
            {/* Glowing background on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 hover:from-primary-500/5 hover:to-accent-500/5 transition-all duration-300 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                    <img src={bot.icon} alt={bot.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="text-2xl">{bot.icon}</div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {bot.name}
                      {bot.verified && <Shield className="w-4 h-4 text-accent-400" />}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">{bot.strategy}</div>
                  </div>
                </div>
                <Link
                  href={`/dashboard-v2/bots/compare/select?slot=${index}&bots=${currentBotsParam}`}
                  className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 text-sm font-semibold hover:bg-primary-500/30 hover:scale-105 transition-all"
                >
                  Change
                </Link>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getRiskColor(bot.risk)}`}>
                  {getRiskBadge(bot.risk)}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-dark-400">
                  <Users className="w-3 h-3" />
                  {bot.stats.copiers.toLocaleString()} copiers
                </span>
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
        className="mb-6 rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-3 sm:p-4 lg:p-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          Performance Comparison Overview
        </h2>
        <div className="h-[300px] sm:h-[400px] [&_*]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
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
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#fff', fontSize: '14px' }}>{value}</span>}
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
        className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] overflow-hidden">
        {/* Performance Metrics */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
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
                        {bot.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {/* 7d Return */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">7-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return7d)}`}>
                        {formatPercent(bot.stats.return7d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 30d Return */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">30-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return30d)}`}>
                        {formatPercent(bot.stats.return30d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 90d Return */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">90-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return90d)}`}>
                        {formatPercent(bot.stats.return90d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 1y Return */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">1-Year Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPercentColor(bot.stats.return1y)}`}>
                        {formatPercent(bot.stats.return1y)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Win Rate */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Win Rate</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.winRate}%</span>
                    </td>
                  ))}
                </tr>

                {/* Sharpe Ratio */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Sharpe Ratio</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.sharpeRatio}</span>
                    </td>
                  ))}
                </tr>

                {/* Capital Reservation */}
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-300">Capital Reservation</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900 dark:text-white">{bot.stats.reservationDays || 30} days</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing & Requirements */}
        <div className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Pricing & Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBots.map((bot) => (
              <motion.div
                key={bot.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all shadow-lg hover:shadow-2xl"
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
                  className="mt-4 block w-full py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all text-center text-sm"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </motion.div>

    </div>
  );
}

export default function BotComparePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-white">Loading...</div>}>
      <BotCompareContent />
    </Suspense>
  );
}
