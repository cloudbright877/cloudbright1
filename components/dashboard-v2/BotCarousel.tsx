'use client';

import Link from 'next/link';
import { Shield, TrendingUp, BarChart3, Star, DollarSign } from 'lucide-react';
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
    rating: number;
    reviews: number;
    minInvestment: number;
  };
  tags: string[];
  trending: boolean;
  verified: boolean;
  ageMonths: number;
  performanceData: number[];
}

interface BotCarouselProps {
  title: string;
  bots: Bot[];
}

export function BotCarousel({ title, bots }: BotCarouselProps) {
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
    <div className="relative">
      {/* Horizontal Scroll Container */}
      <div
        className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent"
      >
        <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="group/card w-[380px] flex-shrink-0"
            >
              <div className="relative h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-300">

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white shadow-xl transition-all duration-300">
                      {bot.icon}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white truncate">
                          {bot.name}
                        </h3>
                        {bot.verified && (
                          <Shield className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-dark-400 mt-1.5">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                          <span className="font-semibold">{bot.stats.rating.toFixed(1)}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-dark-600" />
                        <span>{bot.ageMonths}mo</span>
                      </div>
                      <p className="text-xs text-dark-400 mt-1 truncate">{bot.strategy}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <div className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-sm ${getRiskColor(bot.risk)}`}>
                      {getRiskLabel(bot.risk)}
                    </div>
                    {bot.trending && (
                      <span className="px-2.5 py-1.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg text-xs font-bold text-red-400 backdrop-blur-sm animate-pulse flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Performance Chart */}
                  <div className="mb-5 bg-dark-900/30 rounded-xl p-4 border border-dark-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary-400" />
                        <span className="text-xs font-semibold text-dark-300">30d Performance</span>
                      </div>
                      <div className="text-sm font-bold text-green-400">+{bot.stats.return30d.toFixed(1)}%</div>
                    </div>
                    <MiniChart
                      data={bot.performanceData}
                      color={bot.stats.return30d > 0 ? '#10b981' : '#ef4444'}
                      height={40}
                    />
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-lg border border-green-500/20">
                      <div className="text-xs text-green-400/70 mb-1.5">1Y Return</div>
                      <div className="text-lg font-bold text-green-400">+{bot.stats.return1y.toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-lg border border-blue-500/20">
                      <div className="text-xs text-blue-400/70 mb-1.5">Win Rate</div>
                      <div className="text-lg font-bold text-blue-400">{bot.stats.winRate.toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-lg border border-purple-500/20">
                      <div className="text-xs text-purple-400/70 mb-1.5">Copiers</div>
                      <div className="text-lg font-bold text-purple-400">
                        {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                      </div>
                    </div>
                  </div>

                  {/* Minimum Investment */}
                  <div className="mb-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Min. Investment</span>
                    </div>
                    <span className="text-base font-bold text-white">
                      ${bot.stats.minInvestment.toLocaleString()}
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="flex-1 px-4 py-3 border border-dark-700 rounded-xl text-dark-300 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all text-center text-sm font-semibold"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="relative px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white font-semibold hover:shadow-xl hover:shadow-primary-500/50 transition-all text-center text-sm overflow-hidden group/btn"
                    >
                      <span className="relative z-10">Copy</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
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
