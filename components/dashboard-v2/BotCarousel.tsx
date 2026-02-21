'use client';

import Link from 'next/link';
import { Shield, TrendingUp, BarChart3, Clock } from 'lucide-react';
import MiniChart from './MiniChart';

interface Bot {
  id: number | string;
  slug: string;
  name: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
  strategy: string;
  description: string;
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
  tags: string[];
  trending: boolean;
  verified: boolean;
  performanceData: number[];
}

interface BotCarouselProps {
  title: string;
  bots: Bot[];
}

export function BotCarousel({ title, bots }: BotCarouselProps) {
  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return 'Low Risk';
    if (risk === 'medium') return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="relative">
      {/* Horizontal Scroll Container */}
      <div
        className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent"
      >
        <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="group/card w-[82vw] sm:w-[300px] md:w-[340px] lg:w-[380px] flex-shrink-0"
            >
              <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm border border-gray-200 dark:border-dark-700 rounded-2xl overflow-hidden">

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                      <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {bot.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                          {bot.name}
                        </h3>
                      </div>
                      <p className="text-[10px] text-gray-600 dark:text-dark-400 mt-1 truncate">{bot.strategy}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <div className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300">
                      {getRiskLabel(bot.risk)}
                    </div>
                    {bot.trending && (
                      <span className="px-2 py-1 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded text-[10px] font-medium text-gray-700 dark:text-dark-300 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Performance Chart */}
                  <div className="mb-5 bg-gray-100 dark:bg-dark-900/30 rounded-xl p-4 border border-gray-200 dark:border-dark-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-gray-600 dark:text-dark-400" />
                        <span className="text-[10px] font-medium text-gray-600 dark:text-dark-400">30d Performance</span>
                      </div>
                      <div className={`text-sm font-normal ${bot.stats.return30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.stats.return30d >= 0 ? '+' : ''}{bot.stats.return30d.toFixed(1)}%
                      </div>
                    </div>
                    <MiniChart
                      data={bot.performanceData}
                      color={bot.stats.return30d > 0 ? '#10b981' : '#ef4444'}
                      height={40}
                    />
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-5">
                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">1Y Return</div>
                      <div className={`text-xs sm:text-base font-normal ${bot.stats.return1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.stats.return1y >= 0 ? '+' : ''}{bot.stats.return1y.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Win Rate</div>
                      <div className="text-xs sm:text-base font-normal text-gray-900 dark:text-white">{bot.stats.winRate.toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                      <div className="text-[10px] text-gray-600 dark:text-dark-400 mb-1">Copiers</div>
                      <div className="text-xs sm:text-base font-normal text-gray-900 dark:text-white">
                        {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                      </div>
                    </div>
                  </div>

                  {/* Capital Reservation */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-dark-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Capital Reservation</span>
                    </div>
                    <span className="text-sm font-normal text-gray-900 dark:text-white">
                      {bot.stats.reservationDays || 30} days
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all text-center text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="px-4 py-2.5 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white font-semibold hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-accent-500/20 hover:border-primary-500/50 transition-all text-center text-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                    >
                      Copy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
