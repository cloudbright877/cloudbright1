'use client';

import { useState, useCallback } from 'react';
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
import Image from 'next/image';
import { featuredBots } from '@/data/bots';

const BotCarousel = dynamic(
  () => import('@/components/BotCarousel').then((mod) => ({ default: mod.BotCarousel })),
  { ssr: false, loading: () => <div className="h-[460px]" /> },
);
import { AnimatedBorderGrid } from '@/components/animations/AnimatedBorderGrid';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
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
  Share2,
  Zap,
  DollarSign,
  Play,
  X,
} from 'lucide-react';

/* ──────────────── PLATFORM FEATURES (marquee) ──────────────── */

const platformFeatures: {
  icon: typeof Store;
  title: string;
  description: string;
  span: string;
  iconGradient: string;
  iconColor: string;
  bigNumber?: string;
  tags?: string[];
  visual?: 'exchanges' | 'currencies';
}[] = [
  { icon: Store, title: 'Bot Marketplace', description: 'Browse, compare, and filter verified trading bots by risk level, performance, and win rate.', span: 'md:col-span-2', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', tags: ['Low Risk', 'Medium Risk', 'High Risk'] },
  { icon: BarChart3, title: 'Deep Bot Analytics', description: 'Equity curves, trade history, Sharpe ratio, and max drawdown for every bot.', span: '', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', tags: ['Equity Curve', 'Win Rate', 'Sharpe'] },
  { icon: Copy, title: '1-Click Copy Trading', description: 'Set your amount, tap copy. The bot trades automatically around the clock.', span: '', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', bigNumber: '24/7' },
  { icon: Globe, title: 'Multi-Exchange', description: 'Trade across all major exchanges from one unified interface.', span: '', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', bigNumber: '9+', visual: 'exchanges' },
  { icon: Users, title: 'Social Trading', description: 'Leaderboards, whale alerts, public profiles, and community competitions.', span: '', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', tags: ['Leaderboards', 'Whale Alerts'] },
  { icon: Activity, title: 'Real-Time Dashboard', description: 'Live P&L, open positions, equity curves — updated every second on any device.', span: 'md:col-span-2', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', tags: ['Live P&L', 'Positions', 'History'] },
  { icon: Shield, title: 'Custodial Wallets', description: 'Protected wallets with AES-256 encryption, 2FA, and multi-layer security.', span: 'md:col-span-2', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', bigNumber: '7+', visual: 'currencies' },
  { icon: Share2, title: 'Referral Program', description: 'Build your network and earn commissions from team performance across multiple levels.', span: 'md:col-span-2', iconGradient: 'from-violet-500/15 to-indigo-500/15', iconColor: 'text-violet-400', bigNumber: '10', tags: ['Levels', 'Team Commissions'] },
];

/* ─────────────────────── STEP PREVIEWS ───────────────────── */

function BalancePreview() {
  return (
    <div className="w-full max-w-[280px] rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 p-5 shadow-2xl shadow-primary-500/10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-dark-400 font-medium">Total Balance</p>
          <p className="text-[10px] text-gray-400 dark:text-dark-500">Available + Frozen</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$12,485.00</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$340</span>
        </div>
        <span className="text-xs text-green-400/70">+2.80%</span>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-gray-500 dark:text-dark-400">Available</p>
            <p className="text-sm font-bold text-green-400">$4,485.00</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-dark-700" />
          <div>
            <p className="text-[10px] text-gray-500 dark:text-dark-400">Frozen</p>
            <p className="text-sm font-bold text-yellow-400">$8,000.00</p>
          </div>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full w-[36%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BotCardPreview() {
  return (
    <div className="w-full max-w-[240px] rounded-2xl bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-dark-800/95 dark:to-dark-900/95 border border-gray-200 dark:border-dark-700 p-5 shadow-2xl shadow-purple-500/10">
      <div className="flex items-start gap-2.5 mb-3">
        <img src="/bots/BybitMarketMakerBot.png" alt="Bot" className="w-9 h-9 object-contain" />
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight truncate">Bybit Market Maker</h4>
          <span className="text-[10px] text-gray-500 dark:text-dark-400">Market Making</span>
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
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200/50 dark:border-white/5">
        <div>
          <span className="text-[9px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">30d Return</span>
          <p className="text-sm font-bold text-green-400">+21.4%</p>
        </div>
        <div>
          <span className="text-[9px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Copiers</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-0.5">
            <Users className="w-3 h-3 text-gray-500 dark:text-dark-400" />5,830
          </p>
        </div>
        <div>
          <span className="text-[9px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Win Rate</span>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">58.1%</p>
        </div>
        <div>
          <span className="text-[9px] text-gray-500 dark:text-dark-400 uppercase tracking-wider">Max DD</span>
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
    <div className="w-full max-w-[280px] rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/30 p-5 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-dark-400 font-medium">Portfolio Value</p>
          <p className="text-[10px] text-gray-400 dark:text-dark-500">Total across all bots</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$16,856.40</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$4,856</span>
        </div>
        <span className="text-xs text-green-400/70">+40.47%</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 mb-3">
        <div>
          <p className="text-[10px] text-gray-500 dark:text-dark-400">Invested</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">$12,000</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-dark-700" />
        <div>
          <p className="text-[10px] text-gray-500 dark:text-dark-400">Realized</p>
          <p className="text-sm font-bold text-green-400">+$3,240</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-dark-700" />
        <div>
          <p className="text-[10px] text-gray-500 dark:text-dark-400">Unrealized</p>
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
    description: 'Compare bots by win rate, returns, drawdown, and risk level. Use Quick Start wizard or browse the full marketplace.',
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
    title: 'Full Control & Transparency',
    description:
      'Copy bot trades automatically with capital reservation from 15 to 180 days. Profits accumulate on your balance in real time. Every trade and transaction fully visible.',
    items: ['Capital reservation from 15 to 180 days', 'Automatic profit accumulation', 'Full transaction history', 'Withdraw profits anytime'],
  },
  {
    icon: Building2,
    title: 'Licensed & Audited',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED. 40+ professionals, security audits passed, registered since Dec 2025.',
    items: ['HK registered company', 'Regular security audits', '2FA authentication', '40+ team members'],
  },
];

/* ──────────────── TESTIMONIALS ──────────────── */

const testimonials = [
  {
    name: 'marc_t',
    avatar: '/testimonials/marc_t.webp',
    gradient: 'from-blue-500 to-indigo-500',
    text: 'Set it up once and haven\'t touched it since. The market maker bot just does its thing — quiet, consistent, no drama. Honestly forgot it was running until I checked my balance.',
    stats: '+18.6% first month',
  },
  {
    name: 'Elena K.',
    avatar: '/testimonials/elena-k.webp',
    gradient: 'from-emerald-500 to-teal-500',
    text: 'What sold me is the transparency. I can see every single trade in real time. No black boxes, no hidden fees. The dashboard is genuinely best-in-class.',
    stats: '3 bots running',
  },
  {
    name: 'dreyes',
    avatar: '/testimonials/dreyes.webp',
    gradient: 'from-violet-500 to-purple-500',
    text: 'Started with just $200 to test it out. The low-risk grid bots are perfect for beginners. Now I have $2,000 across multiple strategies.',
    stats: 'Started with $200',
  },
  {
    name: 'soph_lin',
    avatar: '/testimonials/soph_lin.webp',
    gradient: 'from-amber-500 to-orange-500',
    text: 'A flat 2% withdrawal fee and nothing else — no subscriptions, no hidden charges. The simplest and fairest fee model I\'ve seen on any trading platform.',
    stats: 'Early access user',
  },
  {
    name: 'JWhit',
    avatar: '/testimonials/jwhit.webp',
    gradient: 'from-cyan-500 to-blue-500',
    text: 'I wanted passive income without learning to trade. The Quick Start wizard recommended a balanced portfolio and I\'ve been earning steadily since day one.',
    stats: '+25% monthly avg',
  },
  {
    name: 'Aisha M.',
    avatar: 'AM',
    gradient: 'from-pink-500 to-rose-500',
    text: 'The leaderboard feature helped me discover bots I would never have found on my own. The community aspect makes this platform unique.',
    stats: '5 bots copied',
  },
  {
    name: 'nightowl',
    avatar: '/testimonials/nightowl.webp',
    gradient: 'from-teal-500 to-emerald-500',
    text: 'Tried to build my own strategies for a year — wasted time and money. Here I just picked top-performing bots from the leaderboard and let them do the work. Should have started sooner.',
    stats: '$8,400 invested',
  },
  {
    name: 'Rob F.',
    avatar: '/testimonials/rob-f.webp',
    gradient: 'from-indigo-500 to-violet-500',
    text: 'The referral program is phenomenal. I invited my team and the commissions from their bot activations add a nice passive layer on top of my own bot returns.',
    stats: '56 referrals',
  },
  {
    name: 'lina.h',
    avatar: '/testimonials/lina-h.webp',
    gradient: 'from-rose-500 to-pink-500',
    text: 'You only need $50 to activate your first bot — that let me test things out without risking much. The low-risk bots protect my capital while I learn. Great platform for getting started.',
    stats: 'Started with $50',
  },
];

/* ──────────────── BLOG ARTICLES (HOME) ──────────────── */

const homeArticles = [
  {
    category: 'Getting Started',
    title: 'How Copy Trading Works: A Complete Guide for Beginners',
    excerpt: 'Learn how to pick your first bot, set investment amounts, and start earning passive income — step by step.',
    readTime: '5 min read',
    date: 'Feb 2026',
  },
  {
    category: 'Strategy',
    title: 'Low-Risk vs High-Risk Bots: Which One Fits Your Goals?',
    excerpt: 'Compare grid trading, market making, and leverage strategies. Understand risk-reward tradeoffs before you invest.',
    readTime: '7 min read',
    date: 'Feb 2026',
  },
  {
    category: 'Platform',
    title: 'Understanding Bot Statistics: Win Rate, Drawdown & Sharpe Ratio',
    excerpt: 'How to read bot performance data and make informed decisions using the analytics dashboard.',
    readTime: '6 min read',
    date: 'Jan 2026',
  },
];


/* ─────────────────────────── PAGE ─────────────────────────── */

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <Hero />

        {/* ── Video Preview ── */}
        <section className="py-16 sm:py-24 bg-gray-50 dark:bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left — text */}
              <div>
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                  About Cloudbright
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  Real Team. Real Office.{' '}
                  <span className="text-gradient">Real Results.</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 mb-8 leading-relaxed">
                  We built Cloudbright so anyone can earn from crypto — without staring at charts 24/7.
                  Our algorithms do the work; you collect the returns.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { label: '40+ employees', value: 'across engineering, quant research & support' },
                    { label: 'Diverse bot strategies', value: 'verified, all stats public' },
                  ].map((fact) => (
                    <div key={fact.label} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{fact.label}</span>{' '}
                        <span className="text-gray-600 dark:text-dark-300">— {fact.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <GlowButton href="/about" variant="secondary" size="md">
                  <span className="flex items-center gap-2">
                    Learn More About Us <ArrowRight className="w-4 h-4" />
                  </span>
                </GlowButton>
              </div>

              {/* Right — video thumbnail */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                <Image
                  src="/hero-bg-about.webp"
                  alt="Platform overview"
                  width={1280}
                  height={720}
                  className="w-full h-auto block"
                />
                  <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-500 text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-30" />
                    <span className="absolute -inset-1.5 rounded-full border-2 border-indigo-400/40 animate-pulse" />
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Modal */}
        {videoOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeVideo}
          >
            <div
              className="relative w-full max-w-4xl mx-4 aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/sgjEkiD0fZk?autoplay=1&rel=0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* ── How It Works ── */}
        <section className="relative py-16 sm:py-24 bg-white dark:bg-dark-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          {/* Tilted hex grid floor */}
          <div className="absolute inset-0 pointer-events-none" style={{ perspective: '800px' }}>
            <div
              className="absolute inset-0"
              style={{
                ...hexGridBg,
                transform: 'rotateX(58deg) translateY(-20%)',
                transformOrigin: 'center bottom',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Start in <span className="text-gradient">3 Steps</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
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
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-transparent to-dark-900/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                  Top Performing <span className="text-gradient">Bots</span>
                </h2>
                <p className="text-base sm:text-lg text-dark-300 max-w-2xl mx-auto">
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

        {/* ── Platform Features (Bento Grid) ── */}
        <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-gray-50 dark:bg-dark-900">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <NeonGridLines />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Built for{' '}
                  <span className="text-gradient">Smart Investors</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  From bot discovery to transparent statistics and social copy trading — passive income
                  without the complexity.
                </p>
              </div>
            </RevealOnScroll>

            {/* Bento Grid — 4 columns, zigzag spans */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {platformFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <RevealOnScroll key={feature.title} delay={i * 0.06}>
                    <div className={`group relative h-full rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 hover:border-primary-500/30 transition-all duration-500 overflow-hidden p-5 md:p-6 ${feature.span}`}>
                      <div className="absolute top-0 right-0 w-[160px] h-[160px] bg-primary-500/0 group-hover:bg-primary-500/5 rounded-full blur-[60px] pointer-events-none transition-colors duration-500" />

                      {/* Big number accent */}
                      {feature.bigNumber && (
                        <span className="absolute top-3 right-4 text-5xl font-bold text-gray-200/40 dark:text-dark-800/30 select-none pointer-events-none leading-none">
                          {feature.bigNumber}
                        </span>
                      )}

                      <div className="relative z-10">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.iconGradient} border border-gray-200/30 dark:border-dark-600/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                          <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{feature.title}</h3>
                        <p className="text-gray-500 dark:text-dark-400 text-xs leading-relaxed">{feature.description}</p>

                        {/* Tags */}
                        {feature.tags && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {feature.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-dark-300 border border-gray-200 dark:border-dark-700/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Exchange logos row */}
                        {feature.visual === 'exchanges' && (
                          <div className="flex items-center gap-2.5 mt-3 overflow-hidden">
                            {[
                              { src: '/exchanges/binance-svgrepo-com.svg', name: 'Binance' },
                              { src: '/exchanges/bybit-svgrepo-com.svg', name: 'Bybit' },
                              { src: '/exchanges/okx-logo.svg', name: 'OKX' },
                              { src: '/exchanges/kucoin-svgrepo-com.svg', name: 'KuCoin' },
                              { src: '/exchanges/kraken-svgrepo-com.svg', name: 'Kraken' },
                            ].map((ex) => (
                              <img key={ex.name} src={ex.src} alt={ex.name} className="w-4 h-4 object-contain opacity-40 group-hover:opacity-70 transition-opacity" title={ex.name} />
                            ))}
                            <span className="text-[10px] text-dark-500">+4 more</span>
                          </div>
                        )}

                        {/* Currency marquee */}
                        {feature.visual === 'currencies' && (
                          <div className="relative mt-3 -mx-5 md:-mx-6 overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/80 dark:from-dark-800/80 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 dark:from-dark-800/80 to-transparent z-10 pointer-events-none" />
                            <Marquee speed={18} pauseOnHover={false} gap={20}>
                              {[
                                { name: 'USDT', img: '/currency/Tether.svg' },
                                { name: 'BTC', img: '/currency/Bitcoin.svg' },
                                { name: 'ETH', img: '/currency/Ethereum.svg' },
                                { name: 'SOL', img: '/currency/Solana.svg' },
                                { name: 'BNB', img: '/currency/bnb.svg' },
                                { name: 'TRX', img: '/currency/Tron.svg' },
                                { name: 'USDC', img: '/currency/usdc.svg' },
                              ].map((c) => (
                                <div key={c.name} className="flex items-center gap-1.5 px-0.5">
                                  <img src={c.img} alt={c.name} className="w-4 h-4 rounded-full" />
                                  <span className="text-[10px] font-medium text-gray-500 dark:text-dark-400 whitespace-nowrap">{c.name}</span>
                                </div>
                              ))}
                            </Marquee>
                          </div>
                        )}

                        {/* Hover line (only for cards without tags/visuals) */}
                        {!feature.tags && !feature.visual && (
                          <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                        )}
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials (Marquee) ── */}
        <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
            <RevealOnScroll>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Trusted by <span className="text-gradient">Investors</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  Real feedback from our community of active copiers.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Row 1 — left (5 testimonials) */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-white dark:from-dark-900 via-white/70 dark:via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-white dark:from-dark-900 via-white/70 dark:via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <Marquee speed={30} direction="left" gap={0}>
              {testimonials.slice(0, 5).map((t) => (
                <div key={t.name} className="group w-[360px] px-6 py-5 border-r border-gray-200/40 dark:border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    {t.avatar.startsWith('/') ? (
                      <Image src={t.avatar} alt={t.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {t.avatar}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-dark-400">Verified Copier</p>
                    </div>
                    <div className="ml-auto px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md shrink-0">
                      <span className="text-[10px] font-semibold text-green-400 whitespace-nowrap">{t.stats}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-dark-400 text-xs leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                </div>
              ))}
            </Marquee>
          </div>

          <div className="border-t border-gray-200/40 dark:border-dark-700/40" />

          {/* Row 2 — right (4 testimonials) */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-white dark:from-dark-900 via-white/70 dark:via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-white dark:from-dark-900 via-white/70 dark:via-dark-900/70 to-transparent z-10 pointer-events-none" />
            <Marquee speed={25} direction="right" gap={0}>
              {testimonials.slice(5, 9).map((t) => (
                <div key={t.name} className="group w-[360px] px-6 py-5 border-r border-gray-200/40 dark:border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    {t.avatar.startsWith('/') ? (
                      <Image src={t.avatar} alt={t.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {t.avatar}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-dark-400">Verified Copier</p>
                    </div>
                    <div className="ml-auto px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md shrink-0">
                      <span className="text-[10px] font-semibold text-green-400 whitespace-nowrap">{t.stats}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-dark-400 text-xs leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* ── CTA Block ── */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/home-bg-2.mp4" type="video/mp4" />
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
                Your Portfolio, <span className="text-gradient">Always Working</span>
              </h2>

              <p className="text-base sm:text-lg text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join 2,600+ investors who earn passively with battle-tested algorithms.
                Set up once, collect profits on your schedule.
              </p>

              <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12">
                {[
                  { value: 2.6, suffix: 'K+', label: 'Active Copiers', Icon: Users },
                  { value: 10, suffix: '+', label: 'Bot Strategies', Icon: Zap },
                  { value: 200, suffix: 'K+', label: 'USDT Paid Out', Icon: DollarSign },
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.Icon className="w-5 h-5 text-primary-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="text-3xl sm:text-4xl font-bold text-primary-400">
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
                <GlowButton href="/services" variant="secondary" size="lg">
                  How It Works
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Security & Trust ── */}
        <section className="relative py-16 sm:py-24 bg-white dark:bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Security
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Built for <span className="text-gradient">Trust</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-dark-300 leading-relaxed mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-200">
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
          <FAQ limit={5} />
        </div>
        {/* ── Blog / Insights ── */}
        <section className="relative py-16 sm:py-20 bg-gray-50 dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800/50 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Latest <span className="text-gradient">Insights</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  Learn about copy trading strategies, bot analytics, and platform tips.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-6">
              {homeArticles.map((article, i) => (
                <RevealOnScroll key={article.title} delay={i * 0.1}>
                  <a href="/blog" className="group block h-full">
                    <div className="h-full p-6 bg-white/80 dark:bg-dark-800/50 border border-gray-200/50 dark:border-dark-700/50 rounded-2xl hover:border-primary-500/30 transition-all duration-300 flex flex-col">
                      <div className="inline-flex self-start px-2.5 py-1 bg-primary-500/10 border border-primary-500/30 rounded-full text-xs font-semibold text-primary-400 mb-4">
                        {article.category}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-dark-300 leading-relaxed flex-1 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-dark-500">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </a>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delay={0.3}>
              <div className="mt-8 text-center">
                <GlowButton href="/blog" variant="secondary" size="md">
                  <span className="flex items-center gap-2">
                    View All Articles <ArrowRight className="w-4 h-4" />
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
