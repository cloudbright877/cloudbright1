'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import { AnimatedBorderGrid } from '@/components/animations/AnimatedBorderGrid';
import { TiltCard } from '@/components/animations/TiltCard';
import { Spotlight, SpotlightCard } from '@/components/animations/SpotlightCards';
import { ShieldCheck, Lock, Building2, Building, Check, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Transparency',
    description:
      'Every bot on the platform comes with full, verifiable performance data. No hidden metrics, no inflated numbers — just real results you can audit.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Security',
    description:
      'Bank-grade security by design. Your funds are protected in encrypted custodial wallets with AES-256 encryption, 2FA, and hardware security modules.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Innovation',
    description:
      'Built on Web3 principles with smart contracts and blockchain-based settlement. Cutting-edge technology powering the next generation of passive income.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Community',
    description:
      'Social copy trading at its core. Follow top-performing bots, share insights, and grow together with a global community of investors.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const milestones = [
  {
    date: 'Dec 2025',
    event: 'Company Founded',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED established in Hong Kong as a Web3 fintech company.',
    status: 'completed' as const,
  },
  {
    date: 'Jan 2026',
    event: 'Security Audits Passed',
    description:
      'Completed comprehensive security audits for smart contracts, API infrastructure, and platform architecture.',
    status: 'completed' as const,
  },
  {
    date: 'Feb 2026',
    event: 'Platform Launch',
    description:
      'Public launch of the bot marketplace and social copy trading platform with support for major exchanges.',
    status: 'current' as const,
  },
  {
    date: '2026+',
    event: 'Mobile App & Expansion',
    description:
      'Native mobile applications, additional exchange integrations, and expanded bot marketplace.',
    status: 'upcoming' as const,
  },
];

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Transparent Statistics',
    description:
      'Every trade, every metric visible. Full history, equity curves, Sharpe ratio — the most transparent platform in the industry.',
  },
  {
    icon: Lock,
    title: '$0 Until You Profit',
    description:
      'No subscriptions, no setup fees. We charge 1-2% only when you collect profit. Our success depends on yours.',
  },
  {
    icon: Building2,
    title: 'Real Company, Real Team',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED. 40+ professionals, security audits passed, HK registered since Dec 2025.',
  },
];

const teamMembers = [
  {
    name: 'James Chen',
    role: 'CEO & Co-Founder',
    department: 'Leadership & Strategy',
    description:
      'Decades of experience in fintech and crypto markets. Setting the vision for accessible passive crypto income.',
    gradient: 'from-blue-500 to-cyan-500',
    initials: 'JC',
  },
  {
    name: 'Alex Rivera',
    role: 'CTO & Co-Founder',
    department: 'Engineering & AI',
    description:
      'Building the core platform and trading engine. Specializes in high-frequency systems and machine learning.',
    gradient: 'from-purple-500 to-pink-500',
    initials: 'AR',
  },
  {
    name: 'Sarah Kim',
    role: 'Head of Security',
    department: 'Security & Compliance',
    description:
      'Ensuring platform integrity and regulatory compliance. Continuous auditing to protect every user.',
    gradient: 'from-orange-500 to-red-500',
    initials: 'SK',
  },
  {
    name: 'David Okafor',
    role: 'Head of Community',
    department: 'Community & Support',
    description:
      'Connecting investors worldwide and providing 24/7 assistance. From onboarding to advanced strategy guidance.',
    gradient: 'from-green-500 to-emerald-500',
    initials: 'DO',
  },
];

export default function AboutPage() {
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
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/tooling_hero.mp4" type="video/mp4" />
        </video>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/tooling_hero_mobile.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
                <Building className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-medium text-primary-300">
                  Founded December 2025 in Hong Kong
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 md:mb-8 leading-tight">
                <span className="text-white drop-shadow-2xl">
                  Building the Future of{' '}
                  <span className="text-gradient">Passive Crypto Income</span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 md:mb-12 max-w-2xl leading-relaxed">
                Cloudbright is on a mission to make passive income from crypto trading
                accessible to everyone — with bank-grade security protecting every investment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <GlowButton href="/register" variant="primary" size="lg">
                  Get Started
                </GlowButton>
                <GlowButton href="/features" variant="secondary" size="lg">
                  Our Features
                </GlowButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <main className="bg-white dark:bg-dark-900">
        {/* ══════════ WHO WE ARE ══════════ */}
        <section className="relative py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
          {/* Dot grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-primary-500" />
          <div className="absolute top-40 right-24 w-1.5 h-1.5 rounded-full bg-primary-500 opacity-30" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[50px] items-start">
              {/* Left column: text content */}
              <div>
                <RevealOnScroll>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-0.5 bg-primary-500" />
                    <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                      Who We Are
                    </span>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.1}>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 mb-3" />
                  <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-[1.05] tracking-tight mb-5">
                    Leading Global Copy Trading Platform
                  </h2>
                </RevealOnScroll>

                <RevealOnScroll delay={0.15}>
                  <p className="text-dark-400 text-[15px] leading-[1.7] mb-8 max-w-[520px]">
                    After years of building institutional trading systems, our team launched Cloudbright
                    to give everyday investors access to the same automated strategies used by hedge funds
                    and professional institutions.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <div className="flex flex-col gap-4 mb-10">
                    {[
                      'Copy verified bots with real-time trade tracking',
                      'Automated trading — the bot handles everything',
                      'Transparent performance metrics across all strategies',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-white text-[15px] font-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.25}>
                  <div className="bg-dark-800/50 rounded-2xl p-6 grid grid-cols-[1fr_auto] gap-5 items-center mb-9 max-w-[520px] border border-dark-700/30">
                    <p className="text-dark-300 text-sm leading-relaxed italic">
                      &ldquo;We believe every investor deserves access to professional trading strategies.
                      Our platform levels the playing field.&rdquo;
                    </p>
                    <div className="text-center">
                      <div className="text-primary-400 text-sm font-extrabold tracking-wider uppercase">Cloud Bright</div>
                      <div className="text-dark-500 text-xs mt-0.5">Software Limited</div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mt-2.5">
                        <span className="text-lg font-bold text-white">CB</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.3}>
                  <div className="flex items-center gap-5 flex-wrap">
                    <GlowButton href="/register" variant="primary" size="md">
                      <span className="flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                      </span>
                    </GlowButton>
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-dark-500 text-xs">Serving investors in</div>
                        <div className="text-white text-base font-extrabold">85+ Countries</div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right column: overlapping shapes */}
              <div className="relative min-h-[500px] lg:min-h-[720px] hidden lg:block">
                <div className="absolute top-5 left-[8%] z-[1]">
                  <RevealOnScroll delay={0.2}>
                    <TiltCard maxTilt={5} className="p-0 border-0 bg-transparent rounded-none">
                      <div
                        className="overflow-hidden flex flex-col justify-center items-center p-8"
                        style={{ width: 340, height: 560, borderRadius: 180, background: 'linear-gradient(145deg, #1a1a2e, #16213e, #0f3460, #1a1a3e)' }}
                      >
                        <svg viewBox="0 0 200 120" className="w-[80%]">
                          <defs>
                            <linearGradient id="wwa-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <polyline points="0,100 25,85 50,90 75,50 100,60 130,25 160,40 190,15" fill="none" stroke="rgb(79,70,229)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                          <polyline points="0,100 25,85 50,90 75,50 100,60 130,25 160,40 190,15 200,10 200,120 0,120" fill="url(#wwa-grad)" opacity="0.3" />
                        </svg>
                        <p className="text-3xl font-extrabold text-white mt-4 font-mono">+34.2%</p>
                        <p className="text-xs text-white/40 mt-1">Portfolio Growth</p>
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                </div>

                <div className="absolute -top-0.5 -right-0.5 z-[2] pointer-events-none" style={{ width: 196, height: 172, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: '#0f172a' }} />
                <div className="absolute top-1.5 right-1.5 z-[3]">
                  <RevealOnScroll delay={0.35}>
                    <TiltCard maxTilt={7} className="p-0 border-0 bg-transparent rounded-none">
                      <div className="flex flex-col justify-center items-center" style={{ width: 180, height: 156, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: 'linear-gradient(160deg, #0f172a, #1e293b, #334155, #1e293b)' }}>
                        <Globe className="w-8 h-8 text-primary-400 mb-2" />
                        <p className="text-[22px] font-extrabold text-white font-mono">85+</p>
                        <p className="text-[10px] text-white/40 mt-0.5">Countries</p>
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                </div>

                <div className="absolute bottom-10 -right-3 z-[2] pointer-events-none" style={{ width: 336, height: 293, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: '#0f172a' }} />
                <div className="absolute bottom-12 -right-1 z-[3]">
                  <RevealOnScroll delay={0.5}>
                    <TiltCard maxTilt={6} className="p-0 border-0 bg-transparent rounded-none">
                      <div className="flex flex-col justify-center" style={{ width: 320, height: 277, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: 'linear-gradient(160deg, #111827, #1f2937, #374151, #1f2937)', padding: '30px 65px' }}>
                        <p className="text-[10px] text-white/50 font-bold tracking-[0.15em] uppercase mb-3.5">Top Bots</p>
                        {[
                          { name: 'AlphaTrader', roi: '+127%', color: 'from-primary-500 to-orange-500' },
                          { name: 'CryptoWhale', roi: '+84%', color: 'from-accent-500 to-purple-500' },
                          { name: 'SwingKing', roi: '+63%', color: 'from-cyan-500 to-blue-500' },
                        ].map((tr, i) => (
                          <div key={tr.name} className="flex justify-between items-center py-2" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${tr.color} flex items-center justify-center`}>
                                <span className="text-[10px] font-bold text-white">{tr.name[0]}</span>
                              </div>
                              <span className="text-white/70 text-[13px] font-medium">{tr.name}</span>
                            </div>
                            <span className="text-green-400 text-[13px] font-bold font-mono">{tr.roi}</span>
                          </div>
                        ))}
                      </div>
                    </TiltCard>
                  </RevealOnScroll>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Core Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                What We <span className="text-gradient">Stand For</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Every decision at Cloudbright is guided by four principles that put
                investors first.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-dark-800 p-8 rounded-2xl border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  {/* Gradient hover overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                  />
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Investors Choose Cloudbright */}
        <section className="relative py-24 bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
                  Why Investors Choose{' '}
                  <span className="text-gradient">Cloudbright</span>
                </h2>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                  We built the platform we&apos;d want to invest through ourselves.
                  Transparent, safe, and aligned with your success.
                </p>
              </div>
            </RevealOnScroll>

            <AnimatedBorderGrid columns={3}>
              {trustSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <AnimatedBorderGrid.Cell
                    key={signal.title}
                    borderRight={index < 2}
                    borderBottom={false}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{signal.title}</h3>
                    <p className="text-dark-300 leading-relaxed">{signal.description}</p>
                    <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </AnimatedBorderGrid.Cell>
                );
              })}
            </AnimatedBorderGrid>
          </div>
        </section>

        {/* Why Hong Kong Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 dark:from-dark-700 dark:to-dark-800 border border-gray-200 dark:border-dark-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                      <motion.div
                        className="text-8xl md:text-9xl font-semibold text-gradient opacity-20"
                        animate={{ opacity: [0.15, 0.25, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        HK
                      </motion.div>
                      <div className="mt-4 text-sm font-semibold text-gray-400 dark:text-dark-400 uppercase tracking-widest">
                        Hong Kong SAR
                      </div>
                    </div>
                  </div>
                  {/* Decorative dot grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Our Home Base
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  Why <span className="text-gradient">Hong Kong</span>
                </h2>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Hong Kong is one of the world&apos;s leading fintech hubs with a
                  forward-thinking, Web3-friendly regulatory environment. The city&apos;s
                  progressive approach to virtual asset regulation makes it the ideal
                  home for a blockchain-based trading platform.
                </p>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Strategically positioned at the crossroads of Asian and global crypto
                  markets, Hong Kong gives Cloudbright direct access to the most active
                  trading hours and liquidity pools in the world.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Web3-Friendly Regulation', 'Global Fintech Hub', 'Strategic Market Access', 'Crypto-Forward Policy'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm font-medium text-primary-600 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                Key <span className="text-gradient">Milestones</span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col md:gap-16`}
                  >
                    {/* Content */}
                    <div
                      className={`w-full md:w-1/2 ${
                        index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                      }`}
                    >
                      <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 ml-16 md:ml-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl font-semibold text-gradient">
                            {milestone.date}
                          </div>
                          {milestone.status === 'completed' && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                              Completed
                            </span>
                          )}
                          {milestone.status === 'current' && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                              In Progress
                            </span>
                          )}
                          {milestone.status === 'upcoming' && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-500/10 text-gray-500 dark:text-dark-400 rounded-full border border-gray-500/20">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {milestone.event}
                        </h3>
                        <p className="text-gray-600 dark:text-dark-300">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div
                      className={`absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-dark-900 ${
                        milestone.status === 'completed'
                          ? 'bg-green-500'
                          : milestone.status === 'current'
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                          : 'bg-gray-400 dark:bg-dark-500'
                      }`}
                    />

                    {/* Empty space on other side */}
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section — Spotlight Cards */}
        <section className="py-24 bg-dark-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-white">
                <span className="text-gradient">40+ Professionals</span> Across Four
                Departments
              </h2>
              <p className="text-xl text-dark-300 max-w-3xl mx-auto">
                A multidisciplinary team of engineers, quants, security experts, and
                community builders — united by the goal of making passive crypto income
                accessible to everyone.
              </p>
            </motion.div>

            <Spotlight className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard>
                    <div className="flex flex-col h-full items-center text-center">
                      {/* Photo placeholder */}
                      <div className="w-full aspect-[4/3] bg-dark-800 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-10`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl font-bold text-white">{member.initials}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {member.name}
                        </h3>
                        <span className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-1`}>
                          {member.role}
                        </span>
                        <span className="text-xs text-dark-400 uppercase tracking-wider mb-4">
                          {member.department}
                        </span>
                        <p className="text-dark-300 text-sm leading-relaxed flex-1">
                          {member.description}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </Spotlight>
          </div>
        </section>

        {/* Revenue Model Callout */}
        <section
          className="relative py-16 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/hong-kong-bg.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-dark-900/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-dark-700/50 text-center"
            >
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
                How We Earn
              </span>
              <h3 className="text-3xl md:text-4xl font-semibold mt-4 mb-4 text-white">
                Aligned With <span className="text-gradient">Your Success</span>
              </h3>
              <p className="text-lg text-dark-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                Cloudbright charges a small 1-2% commission only when you withdraw
                profit. If you don&apos;t profit, we don&apos;t earn. Our incentives are
                fully aligned with yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-200 font-medium">
                    No upfront fees
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-200 font-medium">
                    No monthly subscriptions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-200 font-medium">
                    Pay only on profit
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-900 dark:text-white">
                Ready to <span className="text-gradient">Start Copying</span>?
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Pick a bot, choose your lock-in period, and start earning passive income —
                with your investments fully protected by bank-grade security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white dark:bg-dark-800 border-2 border-gray-300 dark:border-dark-700 rounded-full font-semibold text-gray-900 dark:text-white hover:border-primary-500 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
