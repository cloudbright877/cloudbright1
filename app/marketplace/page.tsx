'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import MiniChart from '@/components/dashboard-v2/MiniChart';
import { DEMO_BOTS } from '@/lib/demoMarketplace';
import {
  TrendingUp,
  Gauge,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  BarChart3,
  Shield,
  Store,
  DollarSign,
  Clock,
} from 'lucide-react';

const riskColors: Record<string, string> = {
  low: 'text-green-400 border-green-400/30 bg-green-400/10',
  medium: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  high: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
};

const riskLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const riskIcons: Record<string, typeof Gauge> = {
  low: Gauge,
  medium: TrendingUp,
  high: AlertTriangle,
};

type SortOption = 'return30d' | 'copiers' | 'winRate';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'return30d', label: '30d Return' },
  { value: 'copiers', label: 'Copiers' },
  { value: 'winRate', label: 'Win Rate' },
];

/* Deterministic volatile chart — risk level drives swing amplitude */
const riskVolatility: Record<string, number> = { low: 0.25, medium: 0.5, high: 0.9 };

function seededChart(seed: number, target: number, risk: string, points: number = 30): number[] {
  const vol = riskVolatility[risk] ?? 0.5;
  const data: number[] = [0];
  let val = 0;
  let s = seed;
  const step = target / points;
  for (let i = 1; i < points - 1; i++) {
    s = (s * 16807 + 12345) % 2147483647;
    const noise = ((s % 1000) / 1000 - 0.5) * Math.max(Math.abs(target) * vol, 2 + vol * 6);
    val += step + noise;
    // Occasional spike / crash — more frequent on high risk
    s = (s * 16807 + 12345) % 2147483647;
    if ((s % 100) < 8 + vol * 20) {
      val += ((s % 1000) / 1000 - 0.5) * Math.abs(target) * vol * 0.7;
    }
    data.push(parseFloat(val.toFixed(1)));
  }
  data.push(target);
  return data;
}

/* Marketplace overrides: realistic 30d returns, copiers /15, varied investments & staking */
const marketplaceStats: Record<string, {
  return30d: number; seed: number; copiers: number;
  minInvest: number; staking: number; winRate: number;
}> = {
  'bybit-market-maker':       { return30d: 22.4,  seed: 101, copiers: 390, minInvest: 1000,  staking: 56,  winRate: 61.2 },
  'bitfinex-leverage-x10':    { return30d: -5.2,  seed: 202, copiers: 120, minInvest: 5000,  staking: 91,  winRate: 50.1 },
  'kraken-breakout-trader':   { return30d: 30.0,  seed: 303, copiers: 65,  minInvest: 10000, staking: 28,  winRate: 66.4 },
  'okx-grid-trading':         { return30d: 18.1,  seed: 404, copiers: 280, minInvest: 500,   staking: 42,  winRate: 58.3 },
  'kucoin-flash-arbitrage':   { return30d: 15.3,  seed: 505, copiers: 210, minInvest: 200,   staking: 14,  winRate: 57.0 },
  'binance-altcoin-scalper':  { return30d: 12.6,  seed: 606, copiers: 190, minInvest: 2500,  staking: 70,  winRate: 55.4 },
  'poloniex-futures-x5':      { return30d: 8.4,   seed: 707, copiers: 155, minInvest: 1500,  staking: 35,  winRate: 53.2 },
  'cryptocom-news-reactive':  { return30d: -8.0,  seed: 808, copiers: 95,  minInvest: 25000, staking: 175, winRate: 48.6 },
  'huobi-mean-reversion':     { return30d: 25.7,  seed: 909, copiers: 75,  minInvest: 3500,  staking: 119, winRate: 63.1 },
  'binance-bnb-bollinger':    { return30d: 19.8,  seed: 110, copiers: 145, minInvest: 50,    staking: 7,   winRate: 59.5 },
};

export default function MarketplacePage() {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('return30d');

  const filteredBots = useMemo(() => {
    let bots = DEMO_BOTS.map((bot) => {
      const o = marketplaceStats[bot.id];
      if (!o) return bot;
      return {
        ...bot,
        stats: {
          ...bot.stats,
          return30d: o.return30d,
          copiers: o.copiers,
          winRate: o.winRate,
          minInvestment: o.minInvest,
        },
        performanceData: seededChart(o.seed, o.return30d, bot.risk),
      };
    });
    if (riskFilter !== 'all') {
      bots = bots.filter((bot) => bot.risk === riskFilter);
    }
    bots.sort((a, b) => {
      const aVal = a.stats[sortBy];
      const bVal = b.stats[sortBy];
      return (bVal as number) - (aVal as number);
    });
    return bots;
  }, [riskFilter, sortBy]);

  return (
    <>
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/marketplace_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
              <Store className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-primary-300">
                Live Bot Performance Data
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">
                Bot Marketplace:{' '}
                <span className="text-gradient">100+ Verified Strategies</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-100 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
              Transparent statistics. Choose your risk profile. Start from just $50.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton href="/register" variant="primary" size="lg">
                Start Free
              </GlowButton>
              <GlowButton href="/services" variant="secondary" size="lg">
                How It Works
              </GlowButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <main className="bg-white dark:bg-dark-900">
        {/* ── Bot Cards ──────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Bot Marketplace
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-4 text-gray-900 dark:text-white">
                  Choose Your <span className="text-gradient">Strategy</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  Every bot shows full transparent statistics. Pick the risk level that matches your goals.
                </p>
              </div>
            </RevealOnScroll>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                <span className="text-sm text-gray-500 dark:text-dark-400 mr-2">Risk:</span>
                {['all', 'low', 'medium', 'high'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      riskFilter === risk
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    {risk === 'all' ? 'All' : riskLabels[risk]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-dark-400 mr-2">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white text-sm font-medium border border-gray-200 dark:border-dark-700 outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bot grid — 3 columns, dashboard-v2 card style */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.map((bot, index) => {
                const RiskIcon = riskIcons[bot.risk];
                const ret = bot.stats.return30d;
                const isPositive = ret >= 0;
                const override = marketplaceStats[bot.id];
                const staking = override?.staking ?? 30;
                return (
                  <RevealOnScroll key={bot.id} delay={index * 0.05} direction="up">
                    <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-colors duration-300">
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                          {bot.icon.startsWith('/') ? (
                            <img src={bot.icon} alt={bot.name} className="w-10 h-10 object-contain flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0">
                              {bot.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-semibold text-white truncate">{bot.name}</h3>
                              {bot.verified && <Shield className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-dark-400">
                              <span>{bot.stats.copiers} copiers</span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${riskColors[bot.risk]}`}>
                            <RiskIcon className="w-3 h-3" />
                            {riskLabels[bot.risk]}
                          </span>
                          {bot.trending && (
                            <span className="px-2 py-0.5 bg-dark-900/50 border border-dark-700 rounded text-[10px] font-semibold text-dark-300 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> HOT
                            </span>
                          )}
                        </div>

                        {/* Performance Chart */}
                        <div className="mb-4 bg-dark-900/30 rounded-xl p-3 border border-dark-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <BarChart3 className="w-3.5 h-3.5 text-dark-400" />
                              <span className="text-[10px] font-semibold text-dark-400">30d Performance</span>
                            </div>
                            <div className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositive ? '+' : ''}{ret.toFixed(1)}%
                            </div>
                          </div>
                          <MiniChart
                            data={bot.performanceData}
                            color={isPositive ? '#10b981' : '#ef4444'}
                            height={40}
                          />
                        </div>

                        {/* Key Stats Grid — Win Rate only */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-dark-900/50 rounded-lg border border-dark-700">
                            <div className="text-[10px] text-dark-400 mb-0.5">Win Rate</div>
                            <div className="text-sm font-semibold text-white">{bot.stats.winRate.toFixed(1)}%</div>
                          </div>
                          <div className="text-center p-2 bg-dark-900/50 rounded-lg border border-dark-700">
                            <div className="text-[10px] text-dark-400 mb-0.5">Copiers</div>
                            <div className="text-sm font-semibold text-white">{bot.stats.copiers}</div>
                          </div>
                        </div>

                        {/* Min Investment + Staking Period */}
                        <div className="flex gap-2 mb-4">
                          <div className="flex-1 p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-dark-400">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Min.</span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              ${bot.stats.minInvestment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex-1 p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-dark-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Staking</span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {staking}d
                            </span>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                          <Link
                            href="/register"
                            className="flex-1 px-4 py-2.5 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all text-center text-sm font-semibold"
                          >
                            Details
                          </Link>
                          <Link
                            href="/register"
                            className="flex-1 px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-lg text-white font-semibold hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-accent-500/20 hover:border-primary-500/50 transition-all text-center text-sm"
                          >
                            Copy
                          </Link>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-400 dark:text-dark-500 mt-8 max-w-xl mx-auto">
              Past performance does not guarantee future results. All metrics shown are historical and may change.
            </p>

            {/* Access All Bots CTA */}
            <div className="mt-12 text-center">
              <GlowButton href="/register" size="lg">
                <span className="flex items-center gap-2">
                  Access All Bots <ArrowRight className="w-5 h-5" />
                </span>
              </GlowButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
