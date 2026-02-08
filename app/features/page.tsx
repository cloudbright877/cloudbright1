'use client';

import { motion } from 'framer-motion';
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
import { BentoGrid } from '@/components/animations/BentoGrid';
import { BentoItem } from '@/components/animations/BentoItem';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { Marquee } from '@/components/animations/Marquee';
import { GlowButton } from '@/components/animations/GlowButton';

const features = [
  {
    icon: Store,
    title: 'Bot Marketplace',
    description:
      'Browse, compare, and filter 10+ professional trading bots. Filter by risk level, historical performance, and win rate to find strategies that match your goals.',
    colSpan: 2 as const,
    rowSpan: 1 as const,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Bot Analytics',
    description:
      'Every bot has detailed performance data: equity curves, trade history, risk metrics, Sharpe ratio, and max drawdown. Make informed decisions with full transparency.',
    colSpan: 1 as const,
    rowSpan: 2 as const,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Copy,
    title: '1-Click Copy Trading',
    description:
      'Copy any bot with one click. Set your investment amount and let algorithms trade for you around the clock.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Multi-Exchange Support',
    description:
      'Connect to 9+ major exchanges. Trade across Binance, Bybit, OKX, KuCoin, and more from one unified interface.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Users,
    title: 'Social Trading',
    description:
      'Community features: leaderboards, top traders, follow and copy successful strategies. Compete for rankings and learn from the best.',
    colSpan: 2 as const,
    rowSpan: 1 as const,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Activity,
    title: 'Real-Time Dashboard',
    description:
      'Live P&L tracking, open positions, equity curves. Monitor everything in real-time from any device.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Non-Custodial Security',
    description:
      'Your funds stay on YOUR exchange. We never hold your crypto. API-key based connection with encryption.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    icon: FileCode,
    title: 'Smart Contracts',
    description:
      'Blockchain-based infrastructure. Transparent, audited, and trustless architecture for maximum reliability.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Share2,
    title: 'Referral Program',
    description:
      'Earn commissions through a 10-level referral system. Build your network and earn from team performance.',
    colSpan: 1 as const,
    rowSpan: 1 as const,
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
    title: 'Connect Your Exchange',
    description:
      'Link your exchange via API keys. Choose read-only for monitoring or trade access for full automation. Your keys are encrypted and never stored in plain text.',
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
      'One click to start copying. The bot trades automatically on your exchange using your funds. Monitor performance in real-time and adjust anytime.',
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
            <span className="text-gradient">Trade Smarter</span>
          </span>
        }
        subtitle="A complete crypto bot marketplace with deep analytics, social copy trading, and multi-exchange support — all in one non-custodial platform."
        badge={{
          text: 'Bot Marketplace — 10+ Professional Strategies',
          icon: <Store className="w-4 h-4 text-primary-300" />,
        }}
        ctaButtons={[
          { text: 'Get Started', href: '/register', variant: 'primary' },
          { text: 'Browse Bots', href: '/dashboard-v2/bots', variant: 'secondary' },
        ]}
      />

      <main className="bg-white dark:bg-dark-900">
        {/* ---- 2. Bento Grid of Features ---- */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
                Platform Features
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Built for <span className="text-gradient">Serious Traders</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto leading-relaxed">
                From bot discovery to deep analytics and social copy trading, CLOUDBRIGHT gives
                you professional-grade tools without the complexity.
              </p>
            </motion.div>

            <BentoGrid columns={3} className="gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <BentoItem
                    key={feature.title}
                    colSpan={feature.colSpan}
                    rowSpan={feature.rowSpan}
                    className="group"
                  >
                    {/* Gradient hover glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500 rounded-2xl`}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-dark-300 leading-relaxed flex-1">
                        {feature.description}
                      </p>

                      {/* Animated bottom bar */}
                      <div
                        className={`mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-700 rounded-full`}
                      />
                    </div>
                  </BentoItem>
                );
              })}
            </BentoGrid>
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
                <h2 className="text-3xl md:text-4xl font-black mt-3 text-gray-900 dark:text-white">
                  Trade Across <span className="text-gradient">9+ Exchanges</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-dark-300 mt-4 max-w-2xl mx-auto">
                  Connect your favorite exchange and manage everything from a single dashboard.
                  Non-custodial — your funds never leave your exchange.
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
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  How It <span className="text-gradient">Works</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto leading-relaxed">
                  Go from zero to automated trading in three simple steps.
                  No coding, no complexity — just connect and copy.
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
                            <span className="text-5xl font-black text-gray-200 dark:text-dark-700 select-none">
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
                  Start trading in under 5 minutes
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
                Ready to Explore?
              </h2>

              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join CLOUDBRIGHT and access professional trading bots, deep analytics, and a
                thriving community of traders — all without giving up control of your funds.
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
