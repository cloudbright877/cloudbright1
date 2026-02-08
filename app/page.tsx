'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { TiltCard } from '@/components/animations/TiltCard';
import { Marquee } from '@/components/animations/Marquee';
import { GlowButton } from '@/components/animations/GlowButton';
import {
  Link as LinkIcon,
  Search,
  Copy,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  TrendingUp,
  Gauge,
  AlertTriangle,
} from 'lucide-react';

/* ─────────────────────────── DATA ─────────────────────────── */

const steps = [
  {
    step: '01',
    icon: LinkIcon,
    title: 'Connect Your Exchange',
    description:
      'Link your exchange account via secure API keys. Your funds stay on your exchange — we never hold your crypto.',
  },
  {
    step: '02',
    icon: Search,
    title: 'Browse Bots',
    description:
      'Explore 10+ trading bots with transparent risk profiles, historical performance data, and detailed strategy descriptions.',
  },
  {
    step: '03',
    icon: Copy,
    title: 'Start Copying',
    description:
      'Select a bot, set your allocation, and let it trade on your behalf. Pause, adjust, or stop anytime with full control.',
  },
];

const featuredBots = [
  {
    name: 'Momentum Alpha',
    exchange: 'Binance',
    risk: 'Medium' as const,
    description:
      'Trend-following strategy that identifies momentum breakouts across major crypto pairs. Optimized for trending markets.',
    pairs: 'BTC/USDT, ETH/USDT',
    type: 'Trend Following',
  },
  {
    name: 'Grid Master',
    exchange: 'Bybit',
    risk: 'Low' as const,
    description:
      'Grid trading bot designed for range-bound markets. Places buy and sell orders at predefined intervals to capture volatility.',
    pairs: 'BTC/USDT, SOL/USDT',
    type: 'Grid Trading',
  },
  {
    name: 'Scalp Engine',
    exchange: 'OKX',
    risk: 'High' as const,
    description:
      'High-frequency scalping bot targeting micro-movements. Executes rapid trades with tight stop-losses for active market conditions.',
    pairs: 'ETH/USDT, BNB/USDT',
    type: 'Scalping',
  },
  {
    name: 'DCA Sentinel',
    exchange: 'KuCoin',
    risk: 'Low' as const,
    description:
      'Dollar-cost averaging bot with smart entry timing. Accumulates positions gradually, reducing the impact of short-term volatility.',
    pairs: 'BTC/USDT, ETH/USDT',
    type: 'DCA',
  },
];

const exchanges = [
  'Binance',
  'Bybit',
  'OKX',
  'KuCoin',
  'Kraken',
  'Bitfinex',
  'Poloniex',
  'Crypto.com',
  'Huobi',
];

const riskColors: Record<string, string> = {
  Low: 'text-green-400 border-green-400/30 bg-green-400/10',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  High: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const riskIcons: Record<string, typeof Gauge> = {
  Low: Gauge,
  Medium: TrendingUp,
  High: AlertTriangle,
};

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Non-Custodial',
    description:
      'Your funds never leave your exchange. We connect via read/trade API keys only — no withdrawal access.',
  },
  {
    icon: Lock,
    title: 'Security First',
    description:
      'End-to-end encrypted API keys, two-factor authentication, and regular penetration testing to protect your account.',
  },
  {
    icon: Building2,
    title: 'Hong Kong Registered',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED — a fully registered company with a 40+ member team building for the long term.',
  },
];

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <Hero />

        {/* ── How It Works ── */}
        <section className="relative py-24 bg-dark-900 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(79,70,229,0.8) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                  How It <span className="text-gradient">Works</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  Get started in three simple steps. No coding required, no
                  complex setup — just connect, browse, and copy.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll
                    key={item.step}
                    delay={index * 0.15}
                    direction="up"
                  >
                    <div className="relative p-8 rounded-2xl bg-dark-800/60 border border-dark-700/50 backdrop-blur-sm hover:border-primary-500/40 transition-all duration-300 group">
                      {/* Step number */}
                      <span className="absolute -top-4 left-8 px-3 py-1 text-xs font-bold tracking-widest text-primary-400 bg-dark-900 border border-primary-500/30 rounded-full">
                        STEP {item.step}
                      </span>

                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-primary-400" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-dark-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Connector line (not on last) */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-dark-600" />
                      )}
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Bot Showcase ── */}
        <section className="relative py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                  Featured <span className="text-gradient">Bots</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  Explore bots with varying strategies and risk levels.
                  Historical data is provided for transparency — past results do
                  not guarantee future performance.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBots.map((bot, index) => {
                const RiskIcon = riskIcons[bot.risk];
                return (
                  <RevealOnScroll
                    key={bot.name}
                    delay={index * 0.1}
                    direction="up"
                  >
                    <TiltCard className="h-full">
                      <div className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {bot.name}
                            </h3>
                            <span className="text-xs text-dark-400">
                              {bot.exchange}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskColors[bot.risk]}`}
                          >
                            <RiskIcon className="w-3 h-3" />
                            {bot.risk}
                          </span>
                        </div>

                        {/* Strategy type badge */}
                        <div className="inline-flex self-start items-center px-2.5 py-1 bg-primary-500/10 border border-primary-500/20 rounded-md text-xs text-primary-300 font-medium mb-3">
                          {bot.type}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-dark-300 leading-relaxed mb-4 flex-1">
                          {bot.description}
                        </p>

                        {/* Pairs */}
                        <div className="pt-4 border-t border-white/5">
                          <span className="text-xs text-dark-400">Pairs:</span>
                          <span className="text-xs text-dark-200 ml-1">
                            {bot.pairs}
                          </span>
                        </div>
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* CTA */}
            <RevealOnScroll delay={0.4}>
              <div className="mt-12 text-center">
                <GlowButton href="/dashboard-v2/bots" variant="secondary" size="md">
                  <span className="flex items-center gap-2">
                    View All Bots <ArrowRight className="w-4 h-4" />
                  </span>
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Exchange Logos Marquee ── */}
        <section className="py-16 bg-dark-900 border-y border-dark-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <p className="text-center text-sm font-medium tracking-widest text-dark-400 uppercase mb-10">
                Supported Exchanges
              </p>
            </RevealOnScroll>

            <Marquee speed={35} pauseOnHover>
              {exchanges.map((name) => (
                <div
                  key={name}
                  className="flex-shrink-0 px-8 py-4 bg-dark-800/50 border border-dark-700/40 rounded-xl flex items-center justify-center min-w-[160px] hover:border-primary-500/30 transition-colors duration-300"
                >
                  <span className="text-lg font-semibold text-dark-200 whitespace-nowrap tracking-wide">
                    {name}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* ── Trust Signals ── */}
        <section className="relative py-24 bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                  Built on <span className="text-gradient">Trust</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  Your security is our foundation. We designed every layer of
                  CLOUDBRIGHT with transparency and safety in mind.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {trustSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <RevealOnScroll
                    key={signal.title}
                    delay={index * 0.15}
                    direction="up"
                  >
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-dark-800/80 to-dark-800/40 border border-dark-700/50 backdrop-blur-sm text-center hover:border-primary-500/30 transition-all duration-300 group">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {signal.title}
                      </h3>
                      <p className="text-dark-300 leading-relaxed">
                        {signal.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <div id="faq">
          <FAQ />
        </div>

        {/* ── Blog ── */}
        <div id="blog">
          <Blog />
        </div>
      </main>
      <Footer />
    </>
  );
}
