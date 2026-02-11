'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { ExpandingCards } from '@/components/animations/ExpandingCards';
import { Marquee } from '@/components/animations/Marquee';
import { featuredBots } from '@/data/bots';

const BotCarousel = dynamic(
  () => import('@/components/BotCarousel').then((mod) => ({ default: mod.BotCarousel })),
  { ssr: false, loading: () => <div className="h-[460px]" /> },
);
import { AnimatedBorderGrid } from '@/components/animations/AnimatedBorderGrid';
import {
  Wallet,
  Search,
  TrendingUp,
  ArrowRight,
  Star,
  CircleDollarSign,
  Users,
  Gauge,
  Store,
  BarChart3,
  Copy,
  Globe,
  Activity,
  Shield,
  Lock,
  Building2,
  Check,
  FileCode,
  Share2,
  Zap,
  DollarSign,
} from 'lucide-react';

/* ──────────────── PLATFORM FEATURES (marquee) ──────────────── */

const platformFeatures = [
  { icon: Store, title: 'Bot Marketplace', description: 'Browse, compare, and filter 100+ verified trading bots. Filter by risk level, historical performance, and win rate to find strategies that match your goals.' },
  { icon: BarChart3, title: 'Deep Bot Analytics', description: 'Every bot has detailed performance data: equity curves, trade history, risk metrics, Sharpe ratio, and max drawdown. Make informed decisions with full transparency.' },
  { icon: Copy, title: '1-Click Copy Trading', description: 'Copy any bot with one click. Set your investment amount and let algorithms trade for you around the clock.' },
  { icon: Globe, title: 'Multi-Exchange Support', description: 'Connect to 9+ major exchanges. Trade across Binance, Bybit, OKX, KuCoin, and more from one unified interface.' },
  { icon: Users, title: 'Social Trading', description: 'Community features: leaderboards, top bots, follow and copy successful strategies. Compete for rankings and learn from the best.' },
  { icon: Activity, title: 'Real-Time Dashboard', description: 'Live P&L tracking, open positions, equity curves. Monitor everything in real-time from any device.' },
  { icon: Shield, title: 'Custodial Wallets', description: 'Protected instant wallets for 7+ cryptocurrencies. AES-256 encrypted storage with 2FA and multi-layer security.' },
  { icon: FileCode, title: 'Smart Contracts', description: 'Blockchain-based infrastructure. Transparent, audited, and trustless architecture for maximum reliability.' },
  { icon: Share2, title: 'Referral Program', description: 'Earn commissions through a 10-level referral system. Build your network and earn from team performance.' },
];

/* ──────────────── HEX FLOOR HELPERS ────────────────────── */

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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            <linearGradient id="hfStrokeHome" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.12" />
              <stop offset="50%" stopColor="rgb(59,130,246)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0.12" />
            </linearGradient>
            <pattern id="hfGridHome" width={HF_W} height={HF_PAT_H} patternUnits="userSpaceOnUse">
              <polygon points={hfPoints(HF_W / 2, HF_R)} fill="none" stroke="url(#hfStrokeHome)" strokeWidth="0.8" />
              <polygon points={hfPoints(0, HF_R * 2.5)} fill="none" stroke="url(#hfStrokeHome)" strokeWidth="0.8" />
              <polygon points={hfPoints(HF_W, HF_R * 2.5)} fill="none" stroke="url(#hfStrokeHome)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hfGridHome)" />
        </svg>
      </div>
    </div>
  );
}

function IsometricHexFloor() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        inset: '-50% -30%',
        perspective: '800px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: 'rotateX(58deg)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.8) 60%, black 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.8) 60%, black 80%)',
        }}
      >
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hfStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.18" />
              <stop offset="50%" stopColor="rgb(59,130,246)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0.18" />
            </linearGradient>
            <pattern
              id="hfGrid"
              width={HF_W}
              height={HF_PAT_H}
              patternUnits="userSpaceOnUse"
            >
              <polygon points={hfPoints(HF_W / 2, HF_R)} fill="none" stroke="url(#hfStroke)" strokeWidth="0.8" />
              <polygon points={hfPoints(0, HF_R * 2.5)} fill="none" stroke="url(#hfStroke)" strokeWidth="0.8" />
              <polygon points={hfPoints(HF_W, HF_R * 2.5)} fill="none" stroke="url(#hfStroke)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hfGrid)" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────── STEP PREVIEWS ───────────────────── */

function BalancePreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 p-5 shadow-2xl shadow-primary-500/10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-dark-400 font-medium">Total Balance</p>
          <p className="text-[10px] text-dark-500">Available + Frozen</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">$12,485.00</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$340</span>
        </div>
        <span className="text-xs text-green-400/70">+2.80%</span>
      </div>
      <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-dark-400">Available</p>
            <p className="text-sm font-bold text-green-400">$4,485.00</p>
          </div>
          <div className="w-px h-8 bg-dark-700" />
          <div>
            <p className="text-[10px] text-dark-400">Frozen</p>
            <p className="text-sm font-bold text-yellow-400">$8,000.00</p>
          </div>
        </div>
        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full w-[36%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BotCardPreview() {
  return (
    <div className="w-[240px] rounded-2xl bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 p-5 shadow-2xl shadow-purple-500/10">
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
  );
}

function CollectPreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/30 p-5 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-dark-400 font-medium">Portfolio Value</p>
          <p className="text-[10px] text-dark-500">Total across all bots</p>
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
      <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-xl border border-dark-700 mb-3">
        <div>
          <p className="text-[10px] text-dark-400">Invested</p>
          <p className="text-sm font-bold text-white">$12,000</p>
        </div>
        <div className="w-px h-8 bg-dark-700" />
        <div>
          <p className="text-[10px] text-dark-400">Realized</p>
          <p className="text-sm font-bold text-green-400">+$3,240</p>
        </div>
        <div className="w-px h-8 bg-dark-700" />
        <div>
          <p className="text-[10px] text-dark-400">Unrealized</p>
          <p className="text-sm font-bold text-cyan-400">+$1,616</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 p-2.5 bg-green-500/10 rounded-lg border border-green-500/30">
          <p className="text-[10px] text-green-400/70 mb-0.5">Today</p>
          <p className="text-sm font-bold text-green-400">+$186.5</p>
        </div>
        <div className="flex-1 p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
          <p className="text-[10px] text-emerald-400/70 mb-0.5">Active Bots</p>
          <p className="text-sm font-bold text-emerald-400">3 <span className="text-[10px] font-normal text-emerald-400/70">/ 3</span></p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── DATA ─────────────────────────── */

const stepItems = [
  {
    title: 'Top Up Your Balance',
    description: 'Deposit USDT, BTC, ETH, or other supported crypto. Instant crediting, minimum investment from $50.',
    icon: <Wallet className="w-7 h-7 text-white" />,
    gradient: 'from-violet-500 to-purple-500',
    preview: <BalancePreview />,
    previewGlow: 'bg-purple-500/40',
    activeBorder: 'rgba(139, 92, 246, 0.4)',
  },
  {
    title: 'Pick a Proven Bot',
    description: 'Compare 100+ bots by win rate, returns, drawdown, and risk level. Use Quick Start wizard or browse the full marketplace.',
    icon: <Search className="w-7 h-7 text-white" />,
    gradient: 'from-blue-500 to-indigo-500',
    preview: <BotCardPreview />,
    previewGlow: 'bg-blue-500/40',
    activeBorder: 'rgba(59, 130, 246, 0.4)',
  },
  {
    title: 'Collect Your Profits',
    description: 'Bot trades 24/7 automatically. Watch live P&L, collect profits anytime, close the bot with one click.',
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    gradient: 'from-emerald-500 to-teal-500',
    preview: <CollectPreview />,
    previewGlow: 'bg-emerald-500/40',
    activeBorder: 'rgba(16, 185, 129, 0.4)',
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: 'Encryption & Infrastructure',
    description:
      'All data encrypted with AES-256 at rest and in transit. SSL/TLS everywhere. Multi-layer DDoS protection with 99.9% uptime.',
    items: ['AES-256 encryption', 'SSL/TLS connections', 'DDoS protection', '24/7 monitoring'],
  },
  {
    icon: Lock,
    title: 'Flexible Lock-in Periods',
    description:
      'Choose lock-in periods from 7 to 180 days. Longer periods — higher returns. Full transparency over every single transaction.',
    items: ['Lock-in from 7 to 180 days', 'Higher returns for longer terms', 'Full transaction history', 'Collect profits anytime'],
  },
  {
    icon: Building2,
    title: 'Licensed & Audited',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED. 40+ professionals, security audits passed, registered since Dec 2025.',
    items: ['HK registered company', 'Regular security audits', '2FA authentication', '40+ team members'],
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
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
          <IsometricHexFloor />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
                  Start in <span className="text-gradient">3 Steps</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  No coding, no complex setup, no learning curve.
                  Top up, choose, and earn.
                </p>
              </div>
            </RevealOnScroll>

            <ExpandingCards items={stepItems} autoPlayInterval={5000} />
          </div>
        </section>

        {/* ── Bot Showcase ── */}
        <section className="relative py-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/3d-model-minimalist-abstract-horizon-perspective.webp')" }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
                  Top Performing <span className="text-gradient">Bots</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  Real strategies with real metrics. Pick your risk level —
                  from conservative grid trading to aggressive leverage plays.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <BotCarousel bots={featuredBots} autoPlayInterval={5000} />
            </RevealOnScroll>

            {/* CTA */}
            <RevealOnScroll delay={0.4}>
              <div className="mt-6 text-center">
                <GlowButton href="/marketplace" variant="secondary" size="md">
                  <span className="flex items-center gap-2">
                    View All Bots <ArrowRight className="w-4 h-4" />
                  </span>
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Platform Features Marquee ── */}
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
              {platformFeatures.slice(0, 4).map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group w-[340px] px-8 py-6 border-r border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04] ${i === 0 ? 'border-l' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                    <p className="text-dark-400 text-xs leading-relaxed">{feature.description}</p>
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
              {platformFeatures.slice(4, 9).map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group w-[340px] px-8 py-6 border-r border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04] ${i === 0 ? 'border-l' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                    <p className="text-dark-400 text-xs leading-relaxed">{feature.description}</p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </div>
                );
              })}
            </Marquee>
          </div>
        </section>

        {/* ── CTA Block ── */}
        <section className="relative py-24 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/core_domains.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20" />
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

              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Your Portfolio, <span className="text-gradient">Always Working</span>
              </h2>

              <p className="text-xl text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join 26,000+ investors who earn passively with battle-tested algorithms.
                Set up once, collect profits on your schedule.
              </p>

              <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12">
                {[
                  { value: 26, suffix: 'K+', label: 'Active Copiers', Icon: Users },
                  { value: 100, suffix: '+', label: 'Bot Strategies', Icon: Zap },
                  { value: 2, suffix: 'M+', label: 'USDT Paid Out', Icon: DollarSign },
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.Icon className="w-5 h-5 text-primary-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="text-4xl font-bold text-gradient">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1400} />
                      </div>
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
                <GlowButton href="/pricing" variant="secondary" size="lg">
                  See Pricing
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Security & Trust ── */}
        <section className="relative py-24 bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Security
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                  Built for <span className="text-gradient">Trust</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  Enterprise-grade security with full transparency.
                  Your investments are always protected.
                </p>
              </div>
            </RevealOnScroll>

            <AnimatedBorderGrid columns={3}>
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedBorderGrid.Cell
                    key={feature.title}
                    borderRight={index < 2}
                    borderBottom={false}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-dark-300 leading-relaxed mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-dark-200">
                          <Check className="w-4 h-4 text-green-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </AnimatedBorderGrid.Cell>
                );
              })}
            </AnimatedBorderGrid>
          </div>
        </section>

        {/* ── FAQ ── */}
        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
