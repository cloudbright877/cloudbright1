'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { TiltCard } from '@/components/animations/TiltCard';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { GlowButton } from '@/components/animations/GlowButton';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
import { Marquee } from '@/components/animations/Marquee';

const LiveTradingDemo = dynamic(
  () => import('@/components/LiveTradingDemo').then(mod => ({ default: mod.LiveTradingDemo })),
  { ssr: false, loading: () => <div className="w-full h-[400px] rounded-2xl bg-dark-800/50 animate-pulse" /> }
);
import { exchangeLogos } from '@/components/ExchangeLogos';
import {
  Wallet,
  TrendingUp,
  Users,
  ArrowRight,
  CircleDollarSign,
  Zap,
  Activity,
  Copy,
  Star,
  Eye,
  Store,
  Target,
  MessageSquare,
  Trophy,
  Bell,
  Gauge,
  Check,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   MINI-RENDER PREVIEW COMPONENTS
   Static dashboard previews following home page pattern
   (BalancePreview, BotCardPreview, CollectPreview)
   ═══════════════════════════════════════════════════════════════ */

/* ── Section 2: Dashboard & Portfolio ────────────────────────── */

function NetWorthPreview() {
  return (
    <div className="w-full flex-1 flex flex-col rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 p-5 shadow-2xl shadow-primary-500/10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-dark-400 font-medium">Net Worth</p>
          <p className="text-[10px] text-dark-500">Total portfolio value</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">$16,856.40</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$4,856</span>
        </div>
        <span className="text-xs text-green-400/70">+40.47%</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700">
          <p className="text-[10px] text-dark-400">Invested</p>
          <p className="text-sm font-bold text-white">$12,000</p>
        </div>
        <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700">
          <p className="text-[10px] text-dark-400">Realized</p>
          <p className="text-sm font-bold text-green-400">+$3,240</p>
        </div>
        <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700">
          <p className="text-[10px] text-dark-400">Unrealized</p>
          <p className="text-sm font-bold text-cyan-400">+$1,616</p>
        </div>
        <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700">
          <p className="text-[10px] text-dark-400">Today</p>
          <p className="text-sm font-bold text-green-400">+$3.30</p>
        </div>
      </div>
      <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700 mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-dark-400">Active Bots</p>
          <p className="text-sm font-bold text-white">1 / 1</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold">All Running</span>
        </div>
      </div>
      {/* Equity chart */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-dark-500 uppercase tracking-wider font-semibold">Equity · 30d</span>
          <span className="text-[10px] text-green-400 font-bold">+40.47%</span>
        </div>
        <svg viewBox="0 0 240 60" className="w-full h-12">
          <defs>
            <linearGradient id="nw-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 C10,48 20,45 35,42 S55,38 70,35 S90,30 105,26 S120,28 135,22 S155,18 170,14 S190,10 210,7 S230,4 240,2 L240,60 L0,60 Z"
            fill="url(#nw-fill)"
          />
          <path
            d="M0,50 C10,48 20,45 35,42 S55,38 70,35 S90,30 105,26 S120,28 135,22 S155,18 170,14 S190,10 210,7 S230,4 240,2"
            fill="none"
            stroke="rgb(79,70,229)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Current price dot */}
          <circle cx="240" cy="2" r="3" fill="rgb(79,70,229)" />
          <circle cx="240" cy="2" r="5" fill="rgb(79,70,229)" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}


/* ── Section 3: Marketplace & Copy Trading ───────────────────── */

function QuickStartPreview() {
  return (
    <div className="w-[340px] rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-violet-500/10 border border-violet-500/30 p-5 shadow-2xl shadow-violet-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Quick Start</p>
          <p className="text-[10px] text-dark-500">Portfolio builder</p>
        </div>
      </div>
      <p className="text-[10px] text-dark-400 mb-3 uppercase tracking-wider font-semibold">Select Risk Profile</p>
      <div className="space-y-2">
        {[
          { label: 'Conservative', color: 'green', desc: 'Low risk, steady growth', active: false },
          { label: 'Balanced', color: 'blue', desc: 'Medium risk, solid returns', active: true },
          { label: 'Aggressive', color: 'red', desc: 'High risk, max potential', active: false },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
              opt.active
                ? 'border-blue-500/50 bg-blue-500/10'
                : 'border-dark-700/50 bg-dark-900/40'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                opt.active ? 'border-blue-400' : 'border-dark-600'
              }`}
            >
              {opt.active && <div className="w-2 h-2 rounded-full bg-blue-400" />}
            </div>
            <div>
              <p className={`text-[11px] font-semibold ${opt.active ? 'text-white' : 'text-dark-300'}`}>
                {opt.label}
              </p>
              <p className="text-[9px] text-dark-500">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 w-full text-center px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg text-[11px] font-semibold text-white">
        Build My Portfolio
      </div>
    </div>
  );
}

/* ── Section 5: Social & Community — Orbital Layout ─────────── */

/* ── Section 6: Why Choose ─────────────────────────────────── */

function WalletPreview() {
  const currencies = [
    { name: 'USDT', balance: '$8,450.00', img: '/currency/Tether.svg' },
    { name: 'BTC', balance: '0.2847 BTC', img: '/currency/Bitcoin.svg' },
    { name: 'ETH', balance: '2.156 ETH', img: '/currency/Ethereum.svg' },
  ];

  return (
    <div className="w-[280px] rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-500/10 border border-emerald-500/30 p-5 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
          <Wallet className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">My Wallets</p>
          <p className="text-[10px] text-dark-500">3 currencies</p>
        </div>
        <span className="ml-auto text-sm font-bold text-green-400">$12,840</span>
      </div>
      <div className="space-y-2">
        {currencies.map((c) => (
          <div key={c.name} className="flex items-center gap-3 p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50">
            <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white">{c.name}</p>
            </div>
            <span className="text-xs font-bold text-dark-200">{c.balance}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 text-center px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[11px] font-semibold text-emerald-400">
          Deposit
        </div>
        <div className="flex-1 text-center px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-[11px] font-semibold text-dark-300">
          Withdraw
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-dark-800 border border-dark-700 p-5 shadow-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-dark-400 font-medium">Net Worth</p>
          <p className="text-[10px] text-dark-500">Total portfolio value</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">$16,856.40</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$4,856</span>
        </div>
        <span className="text-xs text-green-400/70">+40.47%</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 bg-dark-900 rounded-lg border border-dark-700">
          <p className="text-[9px] text-dark-400">Invested</p>
          <p className="text-sm font-bold text-white">$12,000</p>
        </div>
        <div className="p-2.5 bg-dark-900 rounded-lg border border-dark-700">
          <p className="text-[9px] text-dark-400">Realized</p>
          <p className="text-sm font-bold text-green-400">+$3,240</p>
        </div>
      </div>
      <div className="p-2.5 bg-dark-900 rounded-lg border border-dark-700 mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-dark-400">Active Bots</p>
          <p className="text-sm font-bold text-white">3 / 3</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold">All Running</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-dark-500 uppercase tracking-wider font-semibold">Equity · 30d</span>
          <span className="text-[10px] text-green-400 font-bold">+40.47%</span>
        </div>
        <svg viewBox="0 0 240 50" className="w-full h-10">
          <defs>
            <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,42 C10,40 20,37 35,34 S55,30 70,27 S90,22 105,18 S120,20 135,15 S155,11 170,8 S190,5 210,4 S230,2 240,1 L240,50 L0,50 Z"
            fill="url(#dash-fill)"
          />
          <path
            d="M0,42 C10,40 20,37 35,34 S55,30 70,27 S90,22 105,18 S120,20 135,15 S155,11 170,8 S190,5 210,4 S230,2 240,1"
            fill="none"
            stroke="rgb(79,70,229)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="240" cy="1" r="3" fill="rgb(79,70,229)" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION DATA
   ═══════════════════════════════════════════════════════════════ */

const marketplaceFeatures = [
  {
    number: '01',
    icon: Store,
    title: 'Bot Marketplace',
    description: 'Browse 100+ verified bots ranked by performance, risk level, and copier count. Full stats for every strategy.',
  },
  {
    number: '02',
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Set your amount, tap copy, done. The bot trades 24/7 automatically while you watch live P&L.',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Smart Portfolio Builder',
    description: 'Quick Start wizard picks the best bots for your risk tolerance and investment horizon.',
  },
  {
    number: '04',
    icon: Target,
    title: 'Risk-Based Filtering',
    description: 'Filter by risk level, win rate, max drawdown, and Sharpe ratio. Compare any two bots side by side.',
  },
];

const socialFeatures = [
  {
    number: '01',
    icon: Users,
    title: 'Public Profiles',
    description: 'Every bot has a public profile with full performance history, level badges, and verification status.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Social Feed',
    description: 'Follow top bots, see their moves in real time. Like and interact with the community.',
  },
  {
    number: '03',
    icon: Bell,
    title: 'Whale Alerts',
    description: 'Track what the biggest investors are doing. See large investments and profit collections live.',
  },
  {
    number: '04',
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Global rankings by profit, ROI, win rate, and Sharpe ratio. Weekly and monthly competitions.',
  },
];

const whyChooseFeatures = [
  {
    number: '01',
    icon: Wallet,
    title: 'Multi-Currency Wallets',
    description: 'Hold 7+ cryptocurrencies in protected wallets. Deposit instantly, withdraw copy trading profits anytime.',
  },
  {
    number: '02',
    icon: CircleDollarSign,
    title: 'Flexible Profit Collection',
    description: 'Choose your lock-in period from 7 to 180 days. Longer lock-in — higher returns. Collect profits anytime.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   FEATURE LIST COMPONENT (for split layout sections)
   ═══════════════════════════════════════════════════════════════ */

function FeatureList({ features }: { features: typeof marketplaceFeatures }) {
  return (
    <div className="flex flex-col gap-8">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.number} className="relative flex items-start gap-4 group">
            <span className="absolute -left-1 -top-2 text-6xl font-semibold text-dark-800/20 select-none pointer-events-none leading-none">
              {feature.number}
            </span>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
              <p className="text-dark-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function PlatformPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ══════════ SECTION 1: HERO ══════════ */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/services-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
                <Eye className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-medium text-primary-300">
                  Full Platform Overview
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
                <span className="text-white drop-shadow-2xl">
                  The Complete{' '}
                  <span className="text-gradient">Copy Trading Platform</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-100 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
                Dashboard, marketplace, analytics, social trading, and security — everything you need in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlowButton href="/register" variant="primary" size="lg">
                  Get Started Free
                </GlowButton>
                <GlowButton href="/marketplace" variant="secondary" size="lg">
                  Browse Marketplace
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ SECTION 2: MARKETPLACE & COPY TRADING (Split Layout) ══════════ */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top row: heading centered */}
            <div className="text-center mb-12 lg:mb-16">
              <RevealOnScroll>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Marketplace
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                  Find Your Strategy in{' '}
                  <span className="text-gradient">Seconds</span>
                </h2>
              </RevealOnScroll>
            </div>

            {/* Bottom row: renders + features */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_48%] gap-12 lg:gap-10 items-center">
              {/* Left: feature list */}
              <RevealOnScroll delay={0.3}>
                <FeatureList features={marketplaceFeatures} />
              </RevealOnScroll>

              {/* Right: overlapping cards */}
              <div className="relative h-[500px] lg:h-[580px] flex items-center justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-[30%] z-20">
                  <RevealOnScroll direction="right" delay={0.2}>
                    <TiltCard maxTilt={8} unstyled>
                      <div className="w-[340px] rounded-2xl bg-dark-800 border border-dark-700 p-5 shadow-2xl shadow-purple-500/10">
                        <div className="flex items-start gap-2.5 mb-3">
                          <img src="/bots/BybitMarketMakerBot.png" alt="Bot" className="w-9 h-9 object-contain" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white leading-tight truncate">Bybit Market Maker</h4>
                            <span className="text-[10px] text-dark-400">Market Making</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border text-green-400 border-green-400/30 bg-green-400/10">
                            Low Risk
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />4.9
                          </span>
                          <span className="text-[10px] text-primary-400 font-medium">Verified</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                          <div>
                            <span className="text-[9px] text-dark-400 uppercase tracking-wider">30d Return</span>
                            <p className="text-sm font-bold text-green-400">+21.4%</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-dark-400 uppercase tracking-wider">Copiers</span>
                            <p className="text-sm font-bold text-white flex items-center gap-0.5">
                              <Users className="w-3 h-3 text-dark-400" />5,830
                            </p>
                          </div>
                          <div>
                            <span className="text-[9px] text-dark-400 uppercase tracking-wider">Win Rate</span>
                            <p className="text-xs font-semibold text-white">58.1%</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-dark-400 uppercase tracking-wider">Max DD</span>
                            <p className="text-xs font-semibold text-red-400">-8.2%</p>
                          </div>
                        </div>
                        <div className="mt-3 w-full text-center px-3 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-xs font-semibold text-white">
                          Start Copying
                        </div>
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                </div>
                <div className="absolute bottom-[50px] left-0 z-10">
                  <RevealOnScroll direction="left" delay={0.4}>
                    <TiltCard maxTilt={8} unstyled>
                      <QuickStartPreview />
                    </TiltCard>
                  </RevealOnScroll>
                </div>
                {/* Gradient glow behind renders */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary-500/25 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-[10%] right-[5%] w-[280px] h-[280px] bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[15%] left-[5%] w-[220px] h-[220px] bg-accent-500/20 rounded-full blur-[80px] pointer-events-none" />
                {/* Decorative elements */}
                <div className="absolute -top-3 -left-3 w-16 h-16 border-2 border-primary-500/10 rounded-2xl pointer-events-none" />
                <div className="absolute bottom-20 right-10 w-10 h-10 border-2 border-violet-500/10 rounded-full pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ STATS DIVIDER ══════════ */}
        <div className="bg-dark-900 border-y border-dark-700/30 py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
                {[
                  { value: 12400, suffix: '+', label: 'Total Trades', sub: 'Across all bots', Icon: Activity },
                  { value: 67.3, suffix: '%', label: 'Avg Win Rate', sub: '8,340W / 4,060L', Icon: Target },
                  { value: 2.18, suffix: '', label: 'Profit Factor', sub: 'Platform average', Icon: TrendingUp },
                  { value: 23, suffix: 'm', label: 'Avg Hold Time', sub: 'Scalp to intraday', Icon: Zap },
                  { value: 14, suffix: ' W', label: 'Best Streak', sub: 'Top bot record', Icon: Trophy },
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <stat.Icon className="w-4 h-4 text-primary-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1400} />
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-[10px] text-dark-500 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* ══════════ SECTION 3: DASHBOARD & PORTFOLIO ══════════ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/services-2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-dark-900/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_50%] gap-12 lg:gap-10 items-center">
              {/* Left column: text content */}
              <div>
                <RevealOnScroll>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                    Watch Every Trade in{' '}
                    <span className="text-gradient">Real Time</span>
                  </h2>
                  <p className="text-base sm:text-lg text-dark-300 mb-8">
                    Your entire portfolio on one screen. Real-time P&L, active bots, open positions,
                    and trade history — all updated live.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <ul className="flex flex-col gap-4 mb-8">
                    {[
                      'Real-time P&L, win rate, and live status for every bot',
                      'Collect profits anytime based on your lock-in period',
                      'Quick Start wizard builds your portfolio in 4 steps',
                      'Full trade history, equity curves, and risk metrics',
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary-400 shrink-0 mt-1.5" />
                        <span className="text-sm text-dark-200 leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>
                </RevealOnScroll>

                <RevealOnScroll delay={0.3}>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <AnimatedCounter value={26} suffix="K+" className="text-3xl font-bold text-gradient" />
                      <p className="text-xs text-dark-400 mt-1">Copiers</p>
                    </div>
                    <div className="text-center">
                      <AnimatedCounter value={100} suffix="+" className="text-3xl font-bold text-gradient" />
                      <p className="text-xs text-dark-400 mt-1">Bot Strategies</p>
                    </div>
                    <div className="text-center">
                      <AnimatedCounter value={9} suffix="+" className="text-3xl font-bold text-gradient" />
                      <p className="text-xs text-dark-400 mt-1">Exchanges</p>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right column: live trading widget */}
              <RevealOnScroll direction="right">
                <div style={{ perspective: '170px' }}>
                  <div style={{ transform: 'rotateY(-8deg) scale(1.3)', transformOrigin: 'right center' }}>
                    <LiveTradingDemo />
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══════════ EXCHANGE MARQUEE ══════════ */}
        <div className="bg-dark-900 py-8 border-y border-dark-700/30">
          <Marquee speed={35}>
            {exchangeLogos.map(({ key, Component }) => (
              <Component key={key} className="mx-8 text-dark-400 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity" />
            ))}
          </Marquee>
        </div>

        {/* ══════════ SECTION 5: SOCIAL & COMMUNITY (Orbital Layout) ══════════ */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading — centered */}
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <RevealOnScroll>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-rose-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-rose-400">
                    Social Trading
                  </span>
                  <div className="w-8 h-0.5 bg-rose-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                  Learn from the{' '}
                  <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                    Best Investors
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-dark-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
                  Cloudbright is more than a copy trading platform — it&apos;s a community.
                  Follow top bots, learn from the best, and grow together.
                </p>
              </RevealOnScroll>
            </div>

            {/* Orbital layout: 2 features | orbits | 2 features */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-6 items-center">
              {/* Left features */}
              <div className="flex flex-col gap-10 lg:gap-14">
                {socialFeatures.slice(0, 2).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <RevealOnScroll key={feature.title} direction="left">
                      <div className="flex items-start gap-4 lg:flex-row-reverse lg:text-right max-w-sm lg:ml-auto">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/15 to-amber-500/15 border border-rose-500/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                          <p className="text-dark-300 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>

              {/* Orbital center */}
              <RevealOnScroll>
                <div className="relative w-[280px] h-[280px] lg:w-[340px] lg:h-[340px] mx-auto flex items-center justify-center">
                  {/* Orbit ring 1 — outermost */}
                  <div
                    className="absolute inset-0 rounded-full border border-rose-500/[0.12]"
                    style={{ animation: 'spin 35s linear infinite' }}
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500/50 shadow-lg shadow-rose-500/30" />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500/30" />
                  </div>

                  {/* Orbit ring 2 — middle */}
                  <div
                    className="absolute inset-[42px] lg:inset-[52px] rounded-full border border-amber-500/[0.18]"
                    style={{ animation: 'spin 22s linear infinite reverse' }}
                  >
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500/50 shadow-lg shadow-amber-500/30" />
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500/35" />
                  </div>

                  {/* Orbit ring 3 — innermost */}
                  <div
                    className="absolute inset-[84px] lg:inset-[104px] rounded-full border border-rose-400/[0.22]"
                    style={{ animation: 'spin 14s linear infinite' }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/50 shadow-lg shadow-white/20" />
                  </div>

                  {/* Radial connector lines (subtle dashed) */}
                  <div className="hidden lg:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-6 border-t border-dashed border-rose-500/15" />
                  <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-full w-6 border-t border-dashed border-rose-500/15" />
                  <div className="hidden lg:block absolute top-[25%] left-0 -translate-x-full w-4 border-t border-dashed border-amber-500/10" />
                  <div className="hidden lg:block absolute top-[75%] right-0 translate-x-full w-4 border-t border-dashed border-amber-500/10" />

                  {/* Center icon */}
                  <div className="relative z-10 w-[72px] h-[72px] lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-500/30">
                    <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>

                  {/* Center glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-rose-500/8 rounded-full blur-[60px] pointer-events-none" />
                </div>
              </RevealOnScroll>

              {/* Right features */}
              <div className="flex flex-col gap-10 lg:gap-14">
                {socialFeatures.slice(2, 4).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <RevealOnScroll key={feature.title} direction="right">
                      <div className="flex items-start gap-4 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/15 to-amber-500/15 border border-rose-500/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                          <p className="text-dark-300 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>

            <RevealOnScroll delay={0.3}>
              <div className="text-center mt-14">
                <GlowButton href="/register" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Join the Community <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ SECTION 6: WHY CHOOSE (Bento Grid) ══════════ */}
        <section className="relative py-16 sm:py-24 bg-dark-900 overflow-hidden">
          {/* Subtle hex grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={hexGridBg}
          />
          <NeonGridLines />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading — centered */}
            <RevealOnScroll>
              <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-emerald-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400">
                    Why Choose
                  </span>
                  <div className="w-8 h-0.5 bg-emerald-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                  Complete Financial{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    Control
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-dark-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
                  Your money, your rules. Secure custodial wallets for 7+ cryptocurrencies — all in one place.
                </p>
              </div>
            </RevealOnScroll>

            {/* Bento Grid — 2×2 asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Top-left: Wallet render (large) */}
              <RevealOnScroll delay={0.1}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                  <div className="relative z-10 flex flex-col items-center justify-center min-h-[320px]">
                    <WalletPreview />
                  </div>
                </div>
              </RevealOnScroll>

              {/* Top-right: Feature 1 — Multi-Currency Wallets */}
              <RevealOnScroll delay={0.2}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-green-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-500/10 transition-colors duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                      <Wallet className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="text-7xl font-bold text-dark-800/30 absolute top-4 right-6 select-none pointer-events-none">01</span>
                    <h3 className="text-xl font-semibold text-white mb-3">Multi-Currency Wallets</h3>
                    <p className="text-dark-300 leading-relaxed mb-5">
                      Hold 7+ cryptocurrencies in protected wallets. Deposit instantly, withdraw copy trading profits anytime.
                    </p>
                    <div className="relative mt-1 -mx-6 lg:-mx-8 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark-800/80 to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark-800/80 to-transparent z-10 pointer-events-none" />
                      <Marquee speed={20} pauseOnHover={false} gap={24}>
                        {[
                          { name: 'USDT', img: '/currency/Tether.svg' },
                          { name: 'BTC', img: '/currency/Bitcoin.svg' },
                          { name: 'ETH', img: '/currency/Ethereum.svg' },
                          { name: 'SOL', img: '/currency/Solana.svg' },
                          { name: 'BNB', img: '/currency/bnb.svg' },
                          { name: 'TRX', img: '/currency/Tron.svg' },
                          { name: 'USDC', img: '/currency/usdc.svg' },
                        ].map((c) => (
                          <div key={c.name} className="flex items-center gap-2 px-1">
                            <img src={c.img} alt={c.name} className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-medium text-dark-300 whitespace-nowrap">{c.name}</span>
                          </div>
                        ))}
                      </Marquee>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Bottom-left: Feature 2 — Flexible Profit Collection */}
              <RevealOnScroll delay={0.3}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                      <CircleDollarSign className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="text-7xl font-bold text-dark-800/30 absolute top-4 right-6 select-none pointer-events-none">02</span>
                    <h3 className="text-xl font-semibold text-white mb-3">Flexible Profit Collection</h3>
                    <p className="text-dark-300 leading-relaxed mb-5">
                      Lock-in periods from 7 to 180 days. Longer terms offer higher potential returns. Collect profits anytime.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['7-180 Day Lock-in', 'Collect Anytime', 'From $50', 'Higher Returns'].map((tag) => (
                        <span key={tag} className="px-3 py-1 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Bottom-right: Dashboard render (large) */}
              <RevealOnScroll delay={0.4}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/10 transition-colors duration-500" />
                  <div className="relative z-10 flex flex-col items-center justify-center min-h-[320px]">
                    <DashboardPreview />
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══════════ SECTION 7: CTA BLOCK ══════════ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/bg_section_random.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-primary-500/20 rounded-full mb-8 backdrop-blur-sm">
                <CircleDollarSign className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white/90">
                  Zero fees until you profit
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                Start Copying in{' '}
                <span className="text-gradient">3 Minutes</span>
              </h2>

              <p className="text-base sm:text-lg text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join 26,000+ investors who earn passively with battle-tested algorithms.
                Set up once, collect profits on your schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
                <GlowButton href="/marketplace" variant="secondary" size="lg">
                  Browse Bots
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
