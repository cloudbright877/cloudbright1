'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
import {
  ArrowRight,
  Gift,
  Check,
  Activity,
  DollarSign,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Crown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const referralLevels = [
  { level: 1, commission: '5%', description: 'Direct referrals', highlight: true },
  { level: 2, commission: '3%', description: 'Second level network' },
  { level: 3, commission: '2%', description: 'Third level network' },
  { level: 4, commission: '1%', description: 'Fourth level network' },
  { level: 5, commission: '0.5%', description: 'Fifth level network' },
];

const cashflowLevels = [
  { level: 1, impact: '100%' },
  { level: 2, impact: '50%' },
  { level: 3, impact: '25%' },
  { level: 4, impact: '10%' },
  { level: 5, impact: '10%' },
];

const turnoverBonuses = [
  { lvl: 1, amount: '$100' },
  { lvl: 2, amount: '$200' },
  { lvl: 3, amount: '$500' },
  { lvl: 4, amount: '$500' },
  { lvl: 5, amount: '$1,500' },
  { lvl: 6, amount: '$3,000' },
  { lvl: 7, amount: '$5,000' },
  { lvl: 8, amount: '$15,000' },
  { lvl: 9, amount: '$30,000' },
  { lvl: 10, amount: '$50,000' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up for free — no active deposit required. Get your unique referral link instantly.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Share With Your Network',
    description: 'Promote Celestian to your audience through social media, blogs, email, or any channel you prefer.',
    icon: Gift,
  },
  {
    step: '03',
    title: 'Earn Instantly',
    description: 'Every time your referral activates a bot, you receive your commission in USDT — credited to your balance immediately.',
    icon: Zap,
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AffiliatePage() {
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
          <source src="/affiliate_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
              <Gift className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-primary-300">
                5-Level Affiliate Program
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">
                Build Your Network.{' '}
                <span className="text-gradient">Earn Instantly.</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-100 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
              Earn up to 5% commission every time your referrals activate a trading bot. 5 levels deep, paid in USDT, withdrawn instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton href="/register?affiliate=true" variant="primary" size="lg">
                Join Affiliate Program
              </GlowButton>
              <GlowButton href="#commission" variant="secondary" size="lg">
                See Commission Tiers
              </GlowButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <main className="bg-white dark:bg-dark-900">

        {/* ══════════ COMMISSION STRUCTURE (Apple-style) ══════════ */}
        <section id="commission" className="relative py-16 sm:py-24 bg-white dark:bg-dark-900 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={hexGridBg}
          />
          <NeonGridLines />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-10 sm:mb-14">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-emerald-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400">
                    Commission Structure
                  </span>
                  <div className="w-8 h-0.5 bg-emerald-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white leading-tight">
                  5-Level{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    Referral Program
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
                  Earn commissions from your entire network — up to 5 levels deep. Commission is credited instantly in USDT every time a referral activates a bot.
                </p>
              </div>
            </RevealOnScroll>

            {/* Bento Grid: Commission Table + Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Left: Commission Table */}
              <RevealOnScroll delay={0.1}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Commission per Level</h3>
                    <div className="space-y-3">
                      {referralLevels.map((level) => (
                        <div
                          key={level.level}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                            level.highlight
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-gray-50/50 dark:bg-dark-900/50 border-gray-200/50 dark:border-dark-700/50 hover:border-gray-300/50 dark:hover:border-dark-600/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              level.highlight
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-300'
                            }`}>
                              L{level.level}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Level {level.level}</p>
                              <p className="text-xs text-gray-500 dark:text-dark-400">{level.description}</p>
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${
                            level.highlight ? 'text-emerald-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {level.commission}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Right: Features grid */}
              <div className="grid grid-rows-2 gap-4 lg:gap-5">
                <RevealOnScroll delay={0.2}>
                  <div className="group relative rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center">
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-green-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-500/10 transition-colors duration-500" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                        <Zap className="w-7 h-7 text-emerald-400" />
                      </div>
                      <span className="text-7xl font-bold text-gray-200/40 dark:text-dark-800/30 absolute top-4 right-6 select-none pointer-events-none">01</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Instant Payout</h3>
                      <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                        Commission is credited to your USDT balance the moment your referral activates any trading bot. No delays, no minimum thresholds.
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.3}>
                  <div className="group relative rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 p-6 lg:p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                        <Shield className="w-7 h-7 text-emerald-400" />
                      </div>
                      <span className="text-7xl font-bold text-gray-200/40 dark:text-dark-800/30 absolute top-4 right-6 select-none pointer-events-none">02</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Deposit Required</h3>
                      <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                        You don&apos;t need an active deposit to earn affiliate commissions. Simply share your link and start building your network.
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/affiliate-bg2.webp)' }}
          />
          <div className="absolute inset-0 bg-dark-900/85" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <RevealOnScroll>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Simple Process
                  </span>
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                  How the <span className="text-gradient">Affiliate Program</span> Works
                </h2>
                <p className="text-base sm:text-lg text-dark-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
                  Start earning in three simple steps. No active deposit required — just share your link and earn.
                </p>
              </RevealOnScroll>
            </div>

            {/* Steps — numbered feature list like services page */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_48%] gap-12 lg:gap-10 items-center">
              {/* Left: feature list */}
              <RevealOnScroll>
                <div className="flex flex-col gap-8">
                  {howItWorks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="relative flex items-start gap-4 group">
                        <span className="absolute -left-1 -top-2 text-6xl font-semibold text-dark-800/20 select-none pointer-events-none leading-none">
                          {item.step}
                        </span>
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-dark-300 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RevealOnScroll>

              {/* Right: info card with badges */}
              <RevealOnScroll direction="right">
                <div className="group relative rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-dark-700/50 p-8 lg:p-10 hover:border-primary-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/10 transition-colors duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-6">
                      <Gift className="w-7 h-7 text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Zero Barriers to Start</h3>
                    <p className="text-dark-300 leading-relaxed mb-8">
                      The affiliate program is completely free with no requirements. Share your link, grow your network, and earn USDT commissions from every bot activation.
                    </p>

                    <div className="space-y-3 mb-8">
                      {[
                        'Active deposit is not required to use Affiliate program',
                        'Money bonus is added to account and can be withdrawn instantly',
                        'Commissions paid in USDT — no conversion fees',
                      ].map((text) => (
                        <div key={text} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-dark-200 leading-relaxed">{text}</span>
                        </div>
                      ))}
                    </div>

                    <GlowButton href="/register?affiliate=true" variant="primary" size="md">
                      <span className="flex items-center gap-2">
                        Join Now — Free <ArrowRight className="w-4 h-4" />
                      </span>
                    </GlowButton>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══════════ CASHFLOW LEVELS IMPACT (Violet) ══════════ */}
        <section className="relative py-16 sm:py-24 bg-white dark:bg-dark-900 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_55%] gap-12 lg:gap-16 items-center">
              {/* Left: Text */}
              <RevealOnScroll>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white leading-tight mb-2">
                    Cashflow
                  </h2>
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-6">
                    <span className="text-gray-900 dark:text-white">Levels </span>
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Impact</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 leading-relaxed max-w-md">
                    Each level of your affiliate structure has a different impact on your cashflow. The closer the referral, the higher the turnover contribution.
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      'Turnover = sum of all active bots in your network',
                      'Higher levels contribute proportionally to your turnover',
                      'Reach turnover milestones to unlock cash bonuses',
                    ].map((text) => (
                      <div key={text} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-dark-200 leading-relaxed">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              {/* Right: Table */}
              <RevealOnScroll direction="right">
                <div className="rounded-2xl border border-violet-500/20 overflow-hidden overflow-x-auto bg-white/80 dark:bg-dark-800/50 backdrop-blur-sm">
                  {/* Header */}
                  <div className="grid grid-cols-5 bg-violet-500/[0.06] min-w-[400px]">
                    {cashflowLevels.map((l) => (
                      <div key={l.level} className="px-4 py-4 text-center border-r border-violet-500/10 last:border-r-0">
                        <span className="text-xs text-gray-500 dark:text-dark-400 font-medium">Level {l.level}</span>
                      </div>
                    ))}
                  </div>
                  {/* Impact row */}
                  <div className="grid grid-cols-5 border-t border-violet-500/10 min-w-[400px]">
                    {cashflowLevels.map((l, i) => (
                      <motion.div
                        key={l.level}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="px-4 py-6 text-center border-r border-violet-500/10 last:border-r-0"
                      >
                        <span className={`text-2xl sm:text-3xl font-bold ${
                          i === 0 ? 'text-violet-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {l.impact}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Label row */}
                  <div className="grid grid-cols-5 border-t border-violet-500/10 min-w-[400px]">
                    {cashflowLevels.map((l) => (
                      <div key={l.level} className="px-4 py-3 text-center border-r border-violet-500/10 last:border-r-0">
                        <span className="text-[10px] text-gray-400 dark:text-dark-500 uppercase tracking-wider">Impact</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ══════════ TURNOVER CASH BONUSES (Orbital Design — Compact) ══════════ */}
        <section className="relative py-12 bg-white dark:bg-dark-900 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white">
                  Cash <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">bonuses</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 mt-3 max-w-xl mx-auto">
                  Reach turnover milestones — get rewarded in USDT.
                </p>
              </div>
            </RevealOnScroll>

            {/* Orbital Layout — Compact */}
            <RevealOnScroll>
              <div className="relative w-full max-w-[720px] mx-auto p-4 sm:p-8 md:p-[56px] lg:p-[72px]">
                <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                  {/* Orbit rings */}
                  <div className="absolute inset-[12%] rounded-full border border-violet-500/[0.07]" />
                  <div className="absolute inset-[26%] rounded-full border border-violet-500/[0.12]" />
                  <div className="absolute inset-[38%] rounded-full border border-violet-500/[0.18]" />

                  {/* Animated orbit dots */}
                  <div
                    className="absolute inset-[26%] rounded-full"
                    style={{ animation: 'spin 40s linear infinite' }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-500/40" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-500/30" />
                  </div>
                  <div
                    className="absolute inset-[38%] rounded-full"
                    style={{ animation: 'spin 25s linear infinite reverse' }}
                  >
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400/50" />
                  </div>

                  {/* Center crown */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-14 h-14 lg:w-[68px] lg:h-[68px] rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <Crown className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                  </div>

                  {/* Center glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-violet-500/8 rounded-full blur-[70px] pointer-events-none" />

                  {/* Bonus cards */}
                  {turnoverBonuses.map((bonus, i) => {
                    const count = turnoverBonuses.length;
                    const angle = (i / count) * 360 - 90;
                    const rad = angle * (Math.PI / 180);
                    const r = 38;
                    const cx = 50 + r * Math.cos(rad);
                    const cy = 50 + r * Math.sin(rad);

                    return (
                      <div
                        key={bonus.lvl}
                        className="absolute z-10"
                        style={{
                          left: `${cx}%`,
                          top: `${cy}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.07 }}
                        >
                          <div className="group flex flex-col items-center gap-0.5 p-2.5 lg:p-3 rounded-xl bg-white/90 dark:bg-dark-800/90 border border-gray-200/60 dark:border-dark-700/60 backdrop-blur-sm hover:border-violet-500/40 hover:bg-gray-50 dark:hover:bg-dark-800 transition-all duration-300 w-[96px] lg:w-[108px]">
                            <span className="text-[10px] lg:text-[11px] text-gray-400 dark:text-dark-500 font-semibold uppercase tracking-wider">LVL {bonus.lvl}</span>
                            <span className="text-base lg:text-lg font-bold text-violet-400">{bonus.amount}</span>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ HOW TURNOVER WORKS ══════════ */}
        <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <RevealOnScroll>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-blue-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-blue-400">
                    Turnover System
                  </span>
                  <div className="w-8 h-0.5 bg-blue-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white">
                  How{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Turnover
                  </span>{' '}
                  Works
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 mt-3 sm:mt-4 max-w-2xl mx-auto">
                  Your turnover grows as your network activates bots. Reach milestones — unlock cash bonuses in USDT.
                </p>
              </RevealOnScroll>
            </div>

            {/* 3 step cards on top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-10">
              {[
                {
                  step: '01',
                  icon: Users,
                  title: 'Network activates bots',
                  desc: 'Each referral who activates a bot adds to your turnover based on their level.',
                },
                {
                  step: '02',
                  icon: TrendingUp,
                  title: 'Turnover accumulates',
                  desc: 'L1 counts 100%, L2 — 50%, L3 — 25%, L4-L5 — 10% of bot size.',
                },
                {
                  step: '03',
                  icon: DollarSign,
                  title: 'Milestone reached',
                  desc: 'Hit a rank threshold — bonus is credited to your USDT balance instantly.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll key={item.step} delay={i * 0.1}>
                    <div className="group relative rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 p-6 lg:p-8 hover:border-blue-500/30 transition-all duration-500 overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-blue-500/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="text-7xl font-bold text-gray-200/40 dark:text-dark-800/20 absolute top-4 right-6 select-none pointer-events-none">{item.step}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* Example calculation bento card below */}
            <RevealOnScroll delay={0.2}>
              <div className="group relative rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-dark-800/80 dark:to-dark-900/80 border border-gray-200/50 dark:border-dark-700/50 p-6 lg:p-8 hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-blue-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Example Calculation</h3>
                      <p className="text-xs text-gray-400 dark:text-dark-500">41 referrals across 5 levels</p>
                    </div>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-5 gap-2 px-3 mb-2">
                    {['Level', 'Referrals', 'Bots', 'Impact', 'Turnover'].map((label) => (
                      <span key={label} className={`text-[9px] text-gray-400 dark:text-dark-500 uppercase tracking-wider font-semibold ${label === 'Turnover' ? 'text-right' : label === 'Level' ? '' : 'text-center'}`}>
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="space-y-2 mb-5">
                    {[
                      { level: 'Level 1', users: '3', bots: '$10,000', impact: '100%', result: '$10,000' },
                      { level: 'Level 2', users: '5', bots: '$8,000', impact: '50%', result: '$4,000' },
                      { level: 'Level 3', users: '8', bots: '$12,000', impact: '25%', result: '$3,000' },
                      { level: 'Level 4', users: '10', bots: '$6,000', impact: '10%', result: '$600' },
                      { level: 'Level 5', users: '15', bots: '$9,000', impact: '10%', result: '$900' },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-5 items-center gap-2 p-3 rounded-xl ${
                          i === 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-50/50 dark:bg-dark-900/50 border border-gray-200/30 dark:border-dark-700/30'
                        }`}
                      >
                        <span className={`text-sm font-semibold ${i === 0 ? 'text-blue-400' : 'text-gray-900 dark:text-white'}`}>{row.level}</span>
                        <span className="text-xs text-gray-500 dark:text-dark-400 text-center">{row.users}</span>
                        <span className="text-xs text-gray-600 dark:text-dark-300 text-center">{row.bots}</span>
                        <span className={`text-xs font-medium text-center ${i === 0 ? 'text-blue-400' : 'text-gray-500 dark:text-dark-400'}`}>&times;{row.impact}</span>
                        <span className={`text-sm font-bold text-right ${i === 0 ? 'text-blue-400' : 'text-gray-900 dark:text-white'}`}>{row.result}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <span className="text-sm font-semibold text-gray-700 dark:text-dark-200">Your Total Turnover</span>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-400">$18,500</span>
                      <span className="text-[10px] text-gray-500 dark:text-dark-400 hidden sm:inline">LVL 4 bonus unlocked</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ CTA SECTION ══════════ */}
        <section className="relative py-24 overflow-hidden">
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
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                Ready to Start Earning?
              </h2>
              <p className="text-base sm:text-lg text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join the Celestian affiliate program. No deposit required — earn commissions in USDT from your referral network&apos;s bot activations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register?affiliate=true" variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Join Now — It&apos;s Free <ArrowRight className="w-5 h-5" />
                  </span>
                </GlowButton>
                <GlowButton href="/contact" variant="secondary" size="lg">
                  Contact Affiliate Team
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
