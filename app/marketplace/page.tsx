'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { TiltCard } from '@/components/animations/TiltCard';
import { GlowButton } from '@/components/animations/GlowButton';
import { DEMO_BOTS } from '@/lib/demoMarketplace';
import {
  Star,
  Users,
  TrendingUp,
  Gauge,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  BarChart3,
  Clock,
  Target,
  Activity,
  LineChart,
  Shield,
  Store,
} from 'lucide-react';

const riskColors: Record<string, string> = {
  low: 'text-green-400 border-green-400/30 bg-green-400/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  high: 'text-red-400 border-red-400/30 bg-red-400/10',
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

type SortOption = 'return30d' | 'copiers' | 'winRate' | 'rating';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'return30d', label: '30d Return' },
  { value: 'copiers', label: 'Copiers' },
  { value: 'winRate', label: 'Win Rate' },
  { value: 'rating', label: 'Rating' },
];

const transparencyMetrics = [
  { icon: LineChart, label: 'Equity Curve', description: 'Full growth chart from day one' },
  { icon: Activity, label: 'Trade History', description: 'Every trade logged and visible' },
  { icon: BarChart3, label: 'Sharpe Ratio', description: 'Risk-adjusted return measurement' },
  { icon: TrendingUp, label: 'Max Drawdown', description: 'Worst peak-to-trough decline' },
  { icon: Target, label: 'Win Rate', description: 'Percentage of profitable trades' },
  { icon: Clock, label: 'Avg Duration', description: 'Average trade holding time' },
  { icon: Shield, label: 'Profit Factor', description: 'Gross profit vs gross loss ratio' },
  { icon: Store, label: 'Monthly Returns', description: 'Month-by-month performance breakdown' },
];

export default function MarketplacePage() {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('return30d');

  const filteredBots = useMemo(() => {
    let bots = [...DEMO_BOTS];
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

      <PageHero
        videoSrc="/services_hero.mp4"
        poster="/services_hero_poster.jpg"
        title={
          <span className="text-white drop-shadow-2xl">
            Bot Marketplace:{' '}
            <span className="text-gradient">100+ Verified Strategies</span>
          </span>
        }
        subtitle="Transparent statistics. Choose your risk profile. Start from just $50."
        badge={{
          text: 'Live Bot Performance Data',
          icon: <Store className="w-4 h-4 text-primary-300" />,
        }}
        ctaButtons={[
          { text: 'Start Free', href: '/register', variant: 'primary' },
        ]}
      />

      <main className="bg-white dark:bg-dark-900">
        {/* ── Bot Cards ──────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Bot Marketplace
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Choose Your <span className="text-gradient">Strategy</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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

            {/* Bot grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBots.map((bot, index) => {
                const RiskIcon = riskIcons[bot.risk];
                return (
                  <RevealOnScroll key={bot.id} delay={index * 0.05} direction="up">
                    <TiltCard className="h-full">
                      <div className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-700/50 overflow-hidden flex-shrink-0">
                            <Image src={bot.icon} alt={bot.name} width={40} height={40} className="rounded-lg" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">{bot.name}</h3>
                            <span className="text-xs text-gray-500 dark:text-dark-400">{bot.tags[0]}</span>
                          </div>
                        </div>

                        {/* Risk + Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${riskColors[bot.risk]}`}>
                            <RiskIcon className="w-3 h-3" />
                            {riskLabels[bot.risk]}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {bot.stats.rating}
                          </span>
                          {bot.verified && (
                            <span className="text-xs text-primary-400 font-medium">Verified</span>
                          )}
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-white/5 mt-auto">
                          <div>
                            <span className="text-[11px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">30d Return</span>
                            <p className="text-lg font-bold text-green-400">+{bot.stats.return30d}%</p>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Copiers</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-500 dark:text-dark-400" />
                              {bot.stats.copiers.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Win Rate</span>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{bot.stats.winRate}%</p>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Max DD</span>
                            <p className="text-sm font-semibold text-red-400">{bot.stats.maxDD}%</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          href="/register"
                          className="mt-4 block w-full text-center px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                        >
                          Start Copying
                        </Link>
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-400 dark:text-dark-500 mt-8 max-w-xl mx-auto">
              Past performance does not guarantee future results. All metrics shown are historical and may change.
            </p>
          </div>
        </section>

        {/* ── Transparency Metrics ──────────────────────────── */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Full Transparency
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  The Most <span className="text-gradient">Transparent</span> Platform
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                  We show EVERYTHING — including the metrics other platforms hide.
                  Make decisions with institutional-grade data.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {transparencyMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <RevealOnScroll key={metric.label} delay={index * 0.05}>
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow duration-300 group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{metric.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-300">{metric.description}</p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Strategy Comparison ────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Risk Profiles
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Compare <span className="text-gradient">Strategies</span>
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-700">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-dark-800">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">
                        Metric
                      </th>
                      <th className="text-center px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-400 uppercase tracking-wide">
                          <Gauge className="w-4 h-4" /> Low Risk
                        </span>
                      </th>
                      <th className="text-center px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-400 uppercase tracking-wide">
                          <TrendingUp className="w-4 h-4" /> Medium Risk
                        </span>
                      </th>
                      <th className="text-center px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-400 uppercase tracking-wide">
                          <AlertTriangle className="w-4 h-4" /> High Risk
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { metric: 'Expected Monthly Return', low: '20-25%', medium: '50-60%', high: '80-140%' },
                      { metric: 'Max Drawdown', low: '-3% to -5%', medium: '-18% to -25%', high: '-35% to -55%' },
                      { metric: 'Trade Frequency', low: '180-320/day', medium: '52-95/day', high: '8-75/day' },
                      { metric: 'Leverage Range', low: '2-4x', medium: '5-10x', high: '10-25x' },
                      { metric: 'Best For', low: 'Capital preservation', medium: 'Balanced growth', high: 'Maximum returns' },
                    ].map((row, index) => (
                      <motion.tr
                        key={row.metric}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                        className="border-t border-gray-100 dark:border-dark-700/60"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{row.metric}</td>
                        <td className="px-6 py-4 text-center text-green-400 font-semibold">{row.low}</td>
                        <td className="px-6 py-4 text-center text-yellow-400 font-semibold">{row.medium}</td>
                        <td className="px-6 py-4 text-center text-red-400 font-semibold">{row.high}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Risk Disclosure ────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
                      Risk Disclosure
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed">
                      Cryptocurrency trading involves substantial risk of loss. Past performance of trading bots does not
                      guarantee future results. You should only invest what you can afford to lose. Cloudbright does not
                      provide financial advice. All trading statistics shown are historical and may not reflect future performance.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="py-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Ready to <span className="text-gradient">Start Copying</span>?
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Register for free, top up your balance, and start copying any bot from the marketplace.
                Commission only when you profit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" size="lg">
                  <span className="flex items-center gap-2">
                    Create Free Account <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
