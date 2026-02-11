'use client';

import Link from 'next/link';
import {
  Store,
  BarChart3,
  Copy,
  Globe,
  Users,
  Activity,
  Shield,
  FileCode,
  Share2,
  ArrowRight,
  Zap,
  Link as LinkIcon,
  Search,
  Rocket,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { Marquee } from '@/components/animations/Marquee';
import { GlowButton } from '@/components/animations/GlowButton';

/* ── Hex Floor background ── */
const HF_R = 30;
const HF_W = +(HF_R * Math.sqrt(3)).toFixed(2);
const HF_PAT_H = HF_R * 3;

function hfPoints(cx: number, cy: number) {
  return [0, 60, 120, 180, 240, 300]
    .map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return `${(cx + HF_R * Math.cos(rad)).toFixed(2)},${(cy + HF_R * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');
}

function HexFloorBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 70%)',
        }}
      >
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hfStrokeFeatures" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.12" />
              <stop offset="50%" stopColor="rgb(59,130,246)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0.12" />
            </linearGradient>
            <pattern
              id="hfGridFeatures"
              width={HF_W}
              height={HF_PAT_H}
              patternUnits="userSpaceOnUse"
            >
              <polygon points={hfPoints(HF_W / 2, HF_R)} fill="none" stroke="url(#hfStrokeFeatures)" strokeWidth="0.8" />
              <polygon points={hfPoints(0, HF_R * 2.5)} fill="none" stroke="url(#hfStrokeFeatures)" strokeWidth="0.8" />
              <polygon points={hfPoints(HF_W, HF_R * 2.5)} fill="none" stroke="url(#hfStrokeFeatures)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hfGridFeatures)" />
        </svg>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Store,
    title: 'Bot Marketplace',
    description:
      'Browse, compare, and filter 100+ verified trading bots. Filter by risk level, historical performance, and win rate to find strategies that match your goals.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Bot Analytics',
    description:
      'Every bot has detailed performance data: equity curves, trade history, risk metrics, Sharpe ratio, and max drawdown. Make informed decisions with full transparency.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Copy,
    title: '1-Click Copy Trading',
    description:
      'Copy any bot with one click. Set your investment amount and let algorithms trade for you around the clock.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Multi-Exchange Support',
    description:
      'Connect to 9+ major exchanges. Trade across Binance, Bybit, OKX, KuCoin, and more from one unified interface.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Users,
    title: 'Social Trading',
    description:
      'Community features: leaderboards, top bots, follow and copy successful strategies. Compete for rankings and learn from the best.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Activity,
    title: 'Real-Time Dashboard',
    description:
      'Live P&L tracking, open positions, equity curves. Monitor everything in real-time from any device.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Custodial Wallets',
    description:
      'Protected instant wallets for 7+ cryptocurrencies. AES-256 encrypted storage with multi-layer security.',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    icon: FileCode,
    title: 'Smart Contracts',
    description:
      'Blockchain-based infrastructure. Transparent, audited, and trustless architecture for maximum reliability.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Share2,
    title: 'Referral Program',
    description:
      'Earn commissions through a 10-level referral system. Build your network and earn from team performance.',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
];

const exchanges = [
  { name: 'Binance', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Bybit', color: 'from-orange-400 to-orange-600' },
  { name: 'OKX', color: 'from-white to-gray-300' },
  { name: 'KuCoin', color: 'from-green-400 to-emerald-600' },
  { name: 'Kraken', color: 'from-purple-400 to-purple-600' },
  { name: 'Bitfinex', color: 'from-green-300 to-green-500' },
  { name: 'Poloniex', color: 'from-teal-400 to-cyan-600' },
  { name: 'Crypto.com', color: 'from-blue-400 to-indigo-600' },
  { name: 'Huobi', color: 'from-blue-500 to-blue-700' },
];

const steps = [
  {
    number: '01',
    icon: LinkIcon,
    title: 'Create Account & Deposit',
    description:
      'Sign up, verify your identity, and deposit crypto to your protected wallet. We support 7+ cryptocurrencies with instant crediting. Minimum investment from $50.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Search,
    title: 'Browse & Compare Bots',
    description:
      'Filter bots by risk profile, strategy type, and historical metrics. View detailed analytics including equity curves, drawdown, and Sharpe ratio before you commit.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Copy & Earn',
    description:
      'One click to start copying. The bot trades automatically using your protected wallet funds. Monitor performance in real-time and adjust anytime.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      {/* ---- 1. Hero Section ---- */}
      <PageHero
        videoSrc="/services_hero.mp4"
        poster="/services_hero_poster.jpg"
        title={
          <span className="text-white drop-shadow-2xl">
            Everything You Need to{' '}
            <span className="text-gradient">Invest Smarter</span>
          </span>
        }
        subtitle="Copy verified trading bots, track every trade in real time, and earn passive income — all in one secure platform."
        badge={{
          text: 'Bot Marketplace — 100+ Verified Strategies',
          icon: <Store className="w-4 h-4 text-primary-300" />,
        }}
        ctaButtons={[
          { text: 'Get Started', href: '/register', variant: 'primary' },
          { text: 'Browse Bots', href: '/dashboard-v2/bots', variant: 'secondary' },
        ]}
      />

      <main className="bg-white dark:bg-dark-900">
        {/* ---- 2. Feature Cards Marquee ---- */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <HexFloorBg />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <RevealOnScroll>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
                  Built for{' '}
                  <span className="text-gradient">Smart Investors</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  From bot discovery to transparent statistics and social copy trading — passive income
                  without the complexity.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Row 1 — left (4 features) */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-dark-900 via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <Marquee speed={35} direction="left" gap={0}>
              {features.slice(0, 4).map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group w-[340px] px-8 py-6 border-r border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04] ${i === 0 ? 'border-l' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </div>
                );
              })}
            </Marquee>
          </div>

          <div className="border-t border-dark-700/40" />

          {/* Row 2 — right (5 features) */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-dark-900 via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <Marquee speed={30} direction="right" gap={0}>
              {features.slice(4, 9).map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group w-[340px] px-8 py-6 border-r border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04] ${i === 0 ? 'border-l' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </div>
                );
              })}
            </Marquee>
          </div>
        </section>

        {/* ---- 3. Supported Exchanges Marquee ---- */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-dark-800/50 border-y border-gray-200 dark:border-dark-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Multi-Exchange
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold mt-3 text-gray-900 dark:text-white">
                  Trade Across <span className="text-gradient">9+ Exchanges</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-dark-300 mt-4 max-w-2xl mx-auto">
                  Bots trade across all major exchanges on your behalf.
                  Your funds are protected in encrypted custodial wallets.
                </p>
              </div>
            </RevealOnScroll>

            <Marquee speed={35} pauseOnHover className="py-4">
              {exchanges.map((exchange) => (
                <div
                  key={exchange.name}
                  className="flex-shrink-0 mx-4 px-8 py-4 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <span
                    className={`text-xl font-bold bg-gradient-to-r ${exchange.color} bg-clip-text text-transparent`}
                  >
                    {exchange.name}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* ---- 4. How It Works — 3 Steps ---- */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  Getting Started
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  How It <span className="text-gradient">Works</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto leading-relaxed">
                  Go from zero to passive income in three simple steps.
                  No coding, no complexity — just deposit, copy, and earn.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <RevealOnScroll key={step.number} delay={index * 0.15}>
                    <div className="relative group">
                      {/* Connector line (between cards) */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-16 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-0.5 bg-gradient-to-r from-dark-600 to-dark-700 dark:from-dark-600 dark:to-dark-700 -translate-y-1/2 z-0">
                          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                        </div>
                      )}

                      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        {/* Background gradient on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                        />

                        <div className="relative z-10">
                          {/* Step number */}
                          <div className="flex items-center gap-4 mb-6">
                            <span className="text-5xl font-semibold text-gray-200 dark:text-dark-700 select-none">
                              {step.number}
                            </span>
                            <div
                              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Animated bottom gradient bar */}
                        <div
                          className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${step.gradient} transition-all duration-700`}
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- 5. CTA Section ---- */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500" />

          {/* Decorative blurred circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white/90">
                  Start earning in under 5 minutes
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-white">
                Ready to Explore?
              </h2>

              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join Cloudbright and start earning passive income with verified trading bots and a
                thriving community of investors — all with bank-grade security protecting your investments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>

                <Link
                  href="/dashboard-v2/bots"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  Browse Bot Marketplace
                  <Store className="w-5 h-5" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
