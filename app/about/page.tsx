'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import { AnimatedBorderGrid } from '@/components/animations/AnimatedBorderGrid';
import { TiltCard } from '@/components/animations/TiltCard';
import { OfficeSlider } from '@/components/OfficeSlider';
import { ShieldCheck, Lock, Building2, Building, Check, Globe, ArrowRight, Smartphone, Sparkles, Users, Layers, Landmark, Shield, Zap } from 'lucide-react';
import Image from 'next/image';

const officeImages = [
  { src: '/office-slider/1.webp', alt: 'Cloudbright office' },
  { src: '/office-slider/2.webp', alt: 'Cloudbright workspace' },
  { src: '/office-slider/3.webp', alt: 'Cloudbright team area' },
  { src: '/office-slider/4.webp', alt: 'Cloudbright meeting room' },
  { src: '/office-slider/5.webp', alt: 'Cloudbright development floor' },
  { src: '/office-slider/6.webp', alt: 'Cloudbright lounge' },
  { src: '/office-slider/7.webp', alt: 'Cloudbright office view' },
  { src: '/office-slider/8.webp', alt: 'Cloudbright common area' },
  { src: '/office-slider/9.webp', alt: 'Cloudbright team meeting' },
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
    title: '$0 Until You Withdraw',
    description:
      'No subscriptions, no setup fees. The only fee is a flat 2% on withdrawals. Free deposits, free trading.',
  },
  {
    icon: Building2,
    title: 'Real Company, Real Team',
    description:
      'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED. 40+ professionals, security audits passed, HK registered since Dec 2025.',
  },
];

const ceo = {
  name: 'Anyun Yang',
  role: 'Chief Executive Officer',
  photo: '/team/Anyun-Yang.webp',
  bio: 'Anyun brings over 15 years of experience in quantitative finance, fintech, and digital asset management. She began her career at Goldman Sachs in Hong Kong after graduating with a Master of Finance from the London School of Economics, where she specialized in algorithmic trading and derivatives pricing.',
  bio2: 'After seven years on the institutional trading desk, she moved to lead product at a Series B fintech startup in Singapore, scaling their automated portfolio management platform to $2B+ in AUM. Before founding Cloudbright, Anyun served as VP of Digital Assets at HSBC, overseeing the bank\'s crypto custody and DeFi strategy across the Asia-Pacific region.',
  highlights: [
    { label: 'Education', value: 'MSc Finance, London School of Economics' },
    { label: 'Experience', value: '15+ years in finance & fintech' },
    { label: 'Previous', value: 'Goldman Sachs, HSBC Digital Assets' },
    { label: 'Focus', value: 'Quantitative trading & DeFi strategy' },
  ],
};

const teamMembers = [
  {
    name: 'James Chen',
    role: 'COO & Co-Founder',
    department: 'Operations & Strategy',
    description:
      '12+ years in fintech operations and crypto markets. Driving day-to-day execution and platform growth.',
    photo: '/team/JamesChen.webp',
  },
  {
    name: 'Dong Aiguo',
    role: 'CTO & Co-Founder',
    department: 'Engineering & AI',
    description:
      'Building the core platform and trading engine. Specializes in high-frequency systems and machine learning.',
    photo: '/team/DongAiguo.webp',
  },
  {
    name: 'Adrian Roberts',
    role: 'Chief Marketing Officer',
    department: 'Marketing & Growth',
    description:
      'Driving brand strategy, user acquisition, and global market expansion. 10+ years scaling fintech products across APAC and Europe.',
    photo: '/team/Adrian-Roberts.webp',
  },
  {
    name: 'Samarth Ramesh',
    role: 'Head of Security',
    department: 'Security & Compliance',
    description:
      'Ensuring platform integrity and regulatory compliance. Continuous auditing to protect every user.',
    photo: '/team/Samarth-Ramesh.webp',
  },
  {
    name: 'David Okafor',
    role: 'Head of Partnerships',
    department: 'Business Development',
    description:
      'Forging strategic alliances with exchanges, funds, and ecosystem partners to expand Cloudbright\'s global reach.',
    photo: '/team/DavidOkafor.webp',
  },
  {
    name: 'Kwame Asante',
    role: 'Chief Financial Officer',
    department: 'Finance & Risk',
    description:
      'Overseeing treasury, financial planning, and risk management. 14+ years in corporate finance across African and Asian markets.',
    photo: '/team/Kwame-Asante.webp',
  },
];

const roadmapTimeline = [
  {
    year: '2025',
    items: [
      {
        quarter: 'Dec 2025',
        icon: Building,
        title: 'Company Founded',
        gradient: 'from-slate-400 to-slate-500',
        status: 'completed' as const,
        features: [
          'HONG KONG CLOUD BRIGHT SOFTWARE LIMITED established',
          'Registered in Hong Kong as a Web3 fintech company',
          'Core team assembled — 40+ professionals across four departments',
        ],
      },
    ],
  },
  {
    year: '2026',
    items: [
      {
        quarter: 'Jan 2026',
        icon: Shield,
        title: 'Security Audits Passed',
        gradient: 'from-emerald-400 to-green-500',
        status: 'completed' as const,
        features: [
          'Smart contract audits completed by independent firms',
          'API infrastructure & platform architecture verified',
          'AES-256 encryption, 2FA, and HSM integration certified',
        ],
      },
      {
        quarter: 'Feb 2026',
        icon: Zap,
        title: 'Platform Launch',
        gradient: 'from-primary-400 to-accent-500',
        status: 'current' as const,
        features: [
          'Public launch of bot marketplace & social copy trading',
          'Support for major exchanges — Binance, Bybit, OKX',
          'Live performance tracking with transparent statistics',
        ],
      },
      {
        quarter: 'Q2 2026',
        icon: Smartphone,
        title: 'Mobile App Beta',
        gradient: 'from-blue-500 to-cyan-500',
        features: [
          'Native iOS & Android applications',
          'Real-time portfolio tracking & push notifications',
          'Connect a bot with one tap — fully automated trading on the go',
        ],
      },
      {
        quarter: 'Q3 2026',
        icon: Sparkles,
        title: 'AI Strategy Builder',
        gradient: 'from-purple-500 to-pink-500',
        features: [
          'AI-powered strategy selection based on your risk profile',
          'Instant backtesting on historical data',
          'One-click deployment to live markets',
        ],
      },
      {
        quarter: 'Q4 2026',
        icon: Users,
        title: 'Cloudbright Summit HK',
        gradient: 'from-orange-500 to-red-500',
        features: [
          'First annual conference in Hong Kong',
          'Live trading battles & masterclasses from top bot creators',
          'Exclusive networking with institutional investors',
        ],
      },
    ],
  },
  {
    year: '2027',
    items: [
      {
        quarter: 'Q1 2027',
        icon: Layers,
        title: 'DEX & DeFi Module',
        gradient: 'from-green-500 to-emerald-500',
        features: [
          'Copy trading expands to decentralized exchanges',
          'On-chain execution with full transparency',
          'Zero middlemen — direct smart-contract settlement',
        ],
      },
      {
        quarter: 'Q2 2027',
        icon: Landmark,
        title: 'Community DAO',
        gradient: 'from-yellow-500 to-orange-500',
        features: [
          'Platform governance goes fully decentralized',
          'Token holders vote on features & fee structures',
          'Community-curated bot marketplace',
        ],
      },
      {
        quarter: 'H2 2027',
        icon: Building2,
        title: 'Institutional Suite',
        gradient: 'from-indigo-500 to-purple-500',
        features: [
          'Enterprise API & white-label solutions',
          'Compliance tools for hedge funds & asset managers',
          'Dedicated account management & SLA guarantees',
        ],
      },
    ],
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
          preload="auto"
          src="/about-hero-bg.mp4"
          className="absolute inset-0 w-full h-full object-cover"
        />
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

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
                <span className="text-white drop-shadow-2xl">
                  Building the Future of{' '}
                  <span className="text-gradient">Passive Crypto Income</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-100 mb-8 md:mb-12 max-w-2xl leading-relaxed">
                Cloudbright is on a mission to make passive income from crypto trading
                accessible to everyone — with bank-grade security protecting every investment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <GlowButton href="/register" variant="primary" size="lg">
                  Get Started
                </GlowButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <main className="bg-white dark:bg-dark-900">
        {/* ══════════ WHO WE ARE ══════════ */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
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
            {/* Text content — centered */}
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <RevealOnScroll>
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Who We Are
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-5">
                  Next-Gen Copy Trading Powered With Social Elements
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={0.15}>
                <p className="text-gray-500 dark:text-dark-400 text-[15px] leading-[1.7] mb-8 max-w-[600px] mx-auto">
                  After years of building institutional trading systems, our team launched Cloudbright
                  to give everyday investors access to the same automated strategies used by hedge funds
                  and professional institutions.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10">
                  {[
                    'Copy verified bots with real-time trade tracking',
                    'Automated trading — the bot handles everything',
                    'Transparent performance metrics across all strategies',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-white text-sm font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>

            </div>

            {/* Office slider — full width */}
            <RevealOnScroll delay={0.3}>
              <OfficeSlider images={officeImages} autoPlayInterval={4000} />
            </RevealOnScroll>
          </div>
        </section>

        {/* Why Investors Choose Cloudbright */}
        <section
          className="relative py-16 sm:py-24 overflow-hidden bg-gray-50 dark:bg-fixed dark:bg-cover dark:bg-center"
          style={{ backgroundImage: 'url(/why-us2.webp)' }}
        >
          <div className="absolute inset-0 bg-white dark:bg-dark-900/70" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white dark:from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Why Investors Choose{' '}
                  <span className="text-gradient">Cloudbright</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{signal.title}</h3>
                    <p className="text-gray-600 dark:text-dark-300 leading-relaxed">{signal.description}</p>
                    <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                  </AnimatedBorderGrid.Cell>
                );
              })}
            </AnimatedBorderGrid>
          </div>
        </section>

        {/* As Featured In */}
        <section className="py-12 sm:py-16 bg-white dark:bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-dark-500">
                  As Featured In
                </span>
                <div className="mt-6 flex justify-center">
                  <a
                    href="https://www.digitaljournal.com/pr/news/vehement-media/meet-cloudbright-hong-kong-startup-1959577616.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300"
                  >
                    <Image
                      src="/social/digital-journal.svg"
                      alt="Digital Journal"
                      width={160}
                      height={36}
                      className="h-8 w-auto text-gray-400 dark:text-dark-400 opacity-60 group-hover:opacity-100 transition-opacity dark:invert"
                    />
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative py-16 sm:py-24 bg-white dark:bg-dark-900 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-16">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Our Team
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  <span className="text-gradient">40+ Professionals</span> Across Four
                  Departments
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  A multidisciplinary team of engineers, quants, security experts, and
                  community builders — united by the goal of making passive crypto income
                  accessible to everyone.
                </p>
              </div>
            </RevealOnScroll>

            {/* CEO — featured card */}
            <RevealOnScroll delay={0.1}>
              <div className="relative rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50 backdrop-blur-sm overflow-hidden mb-10">
                <div className="grid md:grid-cols-[320px_1fr] items-stretch">
                  {/* Photo */}
                  <div className="relative aspect-square md:aspect-auto md:min-h-[420px]">
                    <Image
                      src={ceo.photo}
                      alt={ceo.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400 mb-2">
                      {ceo.role}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-5">
                      {ceo.name}
                    </h3>

                    <div className="w-12 h-px bg-gradient-to-r from-primary-500 to-accent-500 mb-5" />

                    <p className="text-gray-600 dark:text-dark-300 text-[15px] leading-[1.75] mb-4">
                      {ceo.bio}
                    </p>
                    <p className="text-gray-600 dark:text-dark-300 text-[15px] leading-[1.75] mb-8">
                      {ceo.bio2}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {ceo.highlights.map((h) => (
                        <div key={h.label} className="bg-gray-50/60 dark:bg-dark-900/60 rounded-xl p-4 border border-gray-200/30 dark:border-dark-700/30">
                          <div className="text-[11px] text-gray-400 dark:text-dark-500 uppercase tracking-wider mb-1">{h.label}</div>
                          <div className="text-gray-900 dark:text-white text-sm font-medium">{h.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <RevealOnScroll key={index} delay={index * 0.1}>
                  <div className="relative h-full rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50 backdrop-blur-sm overflow-hidden">
                    {/* Photo */}
                    <div className="relative w-full aspect-square">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col items-center text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <span className="text-sm font-medium text-primary-400 mb-1">
                        {member.role}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-dark-500 uppercase tracking-wider mb-4">
                        {member.department}
                      </span>

                      <div className="w-10 h-px bg-gradient-to-r from-primary-500/40 to-accent-500/40 mb-4" />

                      <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Hong Kong Section */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
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
                <div className="relative h-[400px] rounded-3xl overflow-hidden border border-dark-700">
                  <Image
                    src="/hong-kong-office.webp"
                    alt="Hong Kong office"
                    fill
                    className="object-cover"
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
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Why <span className="text-gradient">Hong Kong</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Hong Kong is one of the world&apos;s leading fintech hubs with a
                  forward-thinking, Web3-friendly regulatory environment. The city&apos;s
                  progressive approach to virtual asset regulation makes it the ideal
                  home for a blockchain-based trading platform.
                </p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
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

        {/* Revenue Model Callout */}
        <section
          className="relative py-16 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/how-we-earn.webp)' }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />
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
              <h3 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                Aligned With <span className="text-gradient">Your Success</span>
              </h3>
              <p className="text-base sm:text-lg text-dark-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                Cloudbright charges a flat 2% commission only when you withdraw funds.
                No deposit fees, no trading fees, no subscriptions. Simple and
                transparent from day one.
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

        {/* ══════════ ROADMAP — Fixed-height scrollable timeline ══════════ */}
        <section className="relative h-screen max-h-[900px] min-h-[450px] sm:min-h-[600px] bg-white dark:bg-dark-900 flex flex-col overflow-hidden">
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />
          </div>

          {/* Header — stays at top */}
          <div className="relative z-10 pt-16 pb-8 text-center px-4 sm:px-6 lg:px-8 flex-shrink-0">
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
              Our Journey &amp; What&apos;s Next
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-3 sm:mb-4 text-gray-900 dark:text-white">
              <span className="text-gradient">Roadmap</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
              From founding to the future — every milestone on our path to
              building the leading copy-trading platform.
            </p>
          </div>

          {/* Scrollable timeline area */}
          <div className="relative z-10 flex-1 min-h-0">
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-dark-900 to-transparent z-30 pointer-events-none" />

            <div className="h-full max-w-2xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
              <div className="relative pt-8 pb-16 px-4">
                {/* Vertical line */}
                <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-500/60 via-accent-500/30 to-primary-500/10" />

                {roadmapTimeline.map((yearGroup) => (
                  <div key={yearGroup.year} className="relative mb-4">
                    {/* Sticky year label */}
                    <h3 className="sticky top-0 z-20 text-[1.1rem] md:text-[1.25rem] font-extralight tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-8 select-none py-2">
                      {yearGroup.year}
                    </h3>

                    {yearGroup.items.map((item, index) => {
                      const Icon = item.icon;
                      const isCompleted = 'status' in item && item.status === 'completed';
                      const isCurrent = 'status' in item && item.status === 'current';
                      return (
                        <motion.div
                          key={item.quarter}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="relative pl-[70px] md:pl-[80px] pb-14 group"
                        >
                          {/* Dot on timeline */}
                          <div
                            className={`absolute left-[21px] md:left-[25px] top-[6px] w-[14px] h-[14px] rounded-full z-[2] group-hover:scale-125 transition-transform duration-300 ${
                              isCompleted
                                ? 'bg-green-500 ring-[3px] ring-white dark:ring-dark-900'
                                : isCurrent
                                ? 'bg-primary-400 ring-[3px] ring-primary-400/30 animate-pulse'
                                : 'bg-gradient-to-br from-primary-500/60 to-accent-500/60 ring-[3px] ring-white dark:ring-dark-900'
                            }`}
                          />

                          {/* Icon + Title + Status */}
                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-primary-400" />
                            </div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              {isCompleted && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-500/10 text-green-400 rounded-full border border-green-500/20 uppercase tracking-wide">
                                  Done
                                </span>
                              )}
                              {isCurrent && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20 uppercase tracking-wide flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                                  Live
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Feature list */}
                          <ul className="space-y-2 ml-0.5">
                            {item.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2.5 text-gray-600 dark:text-dark-300 text-[0.95rem] leading-relaxed"
                              >
                                <span className="text-gray-400 dark:text-dark-500 mt-[7px] text-[6px] flex-shrink-0">
                                  ●
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* Quarter label */}
                          <span className="text-gray-400 dark:text-dark-600 text-xs font-medium tracking-wide mt-3 block">
                            {item.quarter}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                Ready to Start Copying?
              </h2>
              <p className="text-base sm:text-lg text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Pick a bot, choose your earning plan, and start generating passive income —
                with your investments fully protected by bank-grade security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Create Free Account <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
                <GlowButton href="/contact" variant="secondary" size="lg">
                  Contact Us
                </GlowButton>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
