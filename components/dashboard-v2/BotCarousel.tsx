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
              <div className="relative h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden">

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
                        <h3 className="text-base font-semibold text-white truncate">
                          {bot.name}
                        </h3>
                        {bot.verified && (
                          <Shield className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-dark-400 mt-1.5">
                        <div className="flex items-center gap-1 text-white">
                          <Star className="w-3 h-3 fill-white" />
                          <span className="font-semibold">{bot.stats.rating.toFixed(1)}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-dark-600" />
                        <span>{bot.ageMonths}mo</span>
                      </div>
                      <p className="text-[10px] text-dark-400 mt-1 truncate">{bot.strategy}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <div className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold border border-dark-700 bg-dark-900/50 text-dark-300">
                      {getRiskLabel(bot.risk)}
                    </div>
                    {bot.trending && (
                      <span className="px-2 py-1 bg-dark-900/50 border border-dark-700 rounded text-[10px] font-semibold text-dark-300 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Performance Chart */}
                  <div className="mb-5 bg-dark-900/30 rounded-xl p-4 border border-dark-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-dark-400" />
                        <span className="text-[10px] font-semibold text-dark-400">30d Performance</span>
                      </div>
                      <div className={`text-sm font-semibold ${bot.stats.return30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                      <div className="text-[10px] text-dark-400 mb-1">1Y Return</div>
                      <div className={`text-base font-semibold ${bot.stats.return1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.stats.return1y >= 0 ? '+' : ''}{bot.stats.return1y.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                      <div className="text-[10px] text-dark-400 mb-1">Win Rate</div>
                      <div className="text-base font-semibold text-white">{bot.stats.winRate.toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                      <div className="text-[10px] text-dark-400 mb-1">Copiers</div>
                      <div className="text-base font-semibold text-white">
                        {bot.stats.copiers > 999 ? `${(bot.stats.copiers / 1000).toFixed(1)}k` : bot.stats.copiers}
                      </div>
                    </div>
                  </div>

                  {/* Minimum Investment */}
                  <div className="mb-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-dark-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Min. Investment</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      ${bot.stats.minInvestment.toLocaleString()}
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="flex-1 px-4 py-2.5 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-colors text-center text-sm font-semibold"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/dashboard-v2/bots/${bot.slug}`}
                      className="px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-lg text-white font-semibold hover:bg-dark-800/70 transition-colors text-center text-sm"
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
