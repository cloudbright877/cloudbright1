'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { GlowButton } from '@/components/animations/GlowButton';
import { TiltCard } from '@/components/animations/TiltCard';
import {
  Repeat,
  BarChart3,
  Target,
  Zap,
  HeadphonesIcon,
  Trophy,
  ArrowRight,
  Gift,
  Check,
} from 'lucide-react';

function ReferralPreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 p-5 shadow-2xl shadow-primary-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Gift className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Referral Program</p>
          <p className="text-[10px] text-dark-500">10-level deep</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50">
          <p className="text-[9px] text-dark-400 uppercase tracking-wider">Total Earned</p>
          <p className="text-sm font-bold text-green-400">$1,842</p>
        </div>
        <div className="p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50">
          <p className="text-[9px] text-dark-400 uppercase tracking-wider">Team Size</p>
          <p className="text-sm font-bold text-white">47</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { level: 'Level 1', rate: '10%', earned: '$940', color: 'text-primary-400' },
          { level: 'Level 2', rate: '5%', earned: '$520', color: 'text-accent-400' },
          { level: 'Level 3', rate: '3%', earned: '$382', color: 'text-blue-400' },
        ].map((l) => (
          <div key={l.level} className="flex items-center justify-between p-2 bg-dark-900/30 rounded-lg">
            <span className={`text-[10px] font-semibold ${l.color}`}>{l.level}</span>
            <span className="text-[10px] text-dark-400">{l.rate}</span>
            <span className="text-[10px] font-bold text-dark-200">{l.earned}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);

  const referralLevels = [
    { level: 1, commission: '10%', description: 'Direct referrals' },
    { level: 2, commission: '5%', description: 'Referrals of your referrals' },
    { level: 3, commission: '3%', description: 'Third level network' },
    { level: 4, commission: '2%', description: 'Fourth level' },
    { level: 5, commission: '2%', description: 'Fifth level' },
    { level: 6, commission: '2%', description: 'Sixth level' },
    { level: 7, commission: '2%', description: 'Seventh level' },
    { level: 8, commission: '2%', description: 'Eighth level' },
    { level: 9, commission: '2%', description: 'Ninth level' },
    { level: 10, commission: '2%', description: 'Tenth level' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up & Get Your Link',
      description: 'Create your free affiliate account and receive your unique referral link instantly.',
      icon: '🔗',
    },
    {
      step: '02',
      title: 'Share With Your Network',
      description: 'Promote Cloudbright to your audience through social media, blogs, email, or any channel you prefer.',
      icon: '📢',
    },
    {
      step: '03',
      title: 'Earn Commissions',
      description: 'Get paid up to 25% commission on every investment your referrals make. Lifetime earnings!',
      icon: '💰',
    },
  ];

  const benefits = [
    {
      icon: Repeat,
      title: 'Lifetime Commissions',
      description: 'Earn recurring commissions for as long as your referrals remain active investors.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Dashboard',
      description: 'Track your referrals, commissions, and performance with our advanced analytics dashboard.',
    },
    {
      icon: Target,
      title: 'Marketing Materials',
      description: 'Access professionally designed banners, landing pages, and email templates.',
    },
    {
      icon: Zap,
      title: 'Fast Payouts',
      description: 'Get paid weekly via crypto or bank transfer. Minimum payout is just $50.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Dedicated Support',
      description: 'Your success is our success. Get help from our affiliate support team 24/7.',
    },
    {
      icon: Trophy,
      title: 'Performance Bonuses',
      description: 'Qualify for exclusive bonuses, rewards, and special promotions throughout the year.',
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      role: 'Tech Blogger',
      earnings: '$4,200/month',
      quote: 'The Cloudbright affiliate program has become my #1 income source. The conversion rate is incredible!',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Lisa Chen',
      role: 'YouTube Creator',
      earnings: '$7,800/month',
      quote: 'My audience loves Cloudbright. High commissions + great product = easy money. Highly recommend!',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'David Rodriguez',
      role: 'Finance Newsletter',
      earnings: '$12,500/month',
      quote: 'Best-converting offer in the crypto space. Professional tools and amazing support team.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://cloudbright.com/ref/YOUR_ID');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <source src="/affiliate_hero.mp4" type="video/mp4" />
        </video>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/affiliate_hero_mobile.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
              <Gift className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-primary-300">
                10-Level Deep Referral Commissions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 md:mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">
                Turn Your Influence Into{' '}
                <span className="text-gradient">Passive Income</span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
              Join Cloudbright&apos;s 10-level referral program. Earn commissions from your entire network&apos;s profits — up to 10 levels deep.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton href="/register?affiliate=true" variant="primary" size="lg">
                Join Affiliate Program
              </GlowButton>
              <GlowButton href="#tiers" variant="secondary" size="lg">
                See Commission Tiers
              </GlowButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ══════════ REFERRAL OVERVIEW ══════════ */}
      <section className="relative py-24 bg-dark-900 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            {/* Left: text content */}
            <div>
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    How It Pays
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Earn from Your{' '}
                  <span className="text-gradient">
                    Entire Network
                  </span>
                </h2>
                <p className="text-lg text-dark-300 mb-8 max-w-xl">
                  10-level deep referral system. Invite friends, build your team,
                  and earn commissions from their trading activity — automatically, forever.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ul className="flex flex-col gap-4 mb-8">
                  {[
                    'Up to 10% commission on Level 1 referrals',
                    '10 levels deep — earn from your entire network',
                    'Real-time tracking of team size and earnings',
                    'Instant payouts to your wallet — no minimum',
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-dark-200 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>

              <RevealOnScroll delay={0.3}>
                <GlowButton href="#tiers" variant="primary" size="md">
                  <span className="flex items-center gap-2">
                    See All Tiers <ArrowRight className="w-4 h-4" />
                  </span>
                </GlowButton>
              </RevealOnScroll>
            </div>

            {/* Right: ReferralPreview render */}
            <div className="flex items-center justify-center">
              <RevealOnScroll direction="right">
                <TiltCard maxTilt={8} className="p-0 border-0 bg-transparent">
                  <ReferralPreview />
                </TiltCard>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white dark:bg-dark-900">
        {/* Commission Structure */}
        <section id="tiers" className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Commission Structure
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                10-Level <span className="text-gradient">Referral Program</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Earn commissions from your entire network — up to 10 levels deep. Commission is calculated on your referrals&apos; bot profits.
              </p>
            </motion.div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-dark-700">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">Level</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">Commission</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {referralLevels.map((level, index) => (
                    <motion.tr
                      key={level.level}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`border-t border-gray-100 dark:border-dark-700/60 ${index === 0 ? 'bg-primary-500/5' : ''}`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        Level {level.level}
                        {index === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-primary-500/10 text-primary-500 rounded-full">Top Rate</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gradient">{level.commission}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-dark-300">{level.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works */}
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
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                How the <span className="text-gradient">Affiliate Program Works</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Start earning in three simple steps. No technical skills required.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connecting line (hidden on mobile) */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 opacity-30" />
                  )}

                  <div className="relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {item.step}
                    </div>

                    <div className="text-6xl mb-6 mt-4">{item.icon}</div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features — Sticky Scroll */}
        <section className="relative py-24 bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left — Sticky */}
              <div>
                <div className="lg:sticky lg:top-24 flex flex-col items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
                      Partner Benefits
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-white">
                      Why Join the{' '}
                      <span className="text-gradient">Affiliate Program</span>
                    </h2>
                    <p className="text-lg text-dark-300 mb-10 leading-relaxed">
                      Everything you need to succeed as a Cloudbright partner —
                      from marketing tools to real-time analytics.
                    </p>

                    {/* CTA Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 w-full">
                      <p className="text-lg text-dark-200 mb-4">
                        Join 12,000+ affiliates earning passive income with our
                        10-level referral program.
                      </p>
                      <Link
                        href="/register?affiliate=true"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right — Stacking Cards */}
              <div>
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="group p-8 md:p-10 bg-dark-900 border-b border-dark-700/40 transition-colors duration-300 hover:bg-primary-500/[0.04] lg:sticky lg:top-24"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-dark-300 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 rounded-full" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
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
                Success Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                What Our <span className="text-gradient">Top Affiliates Say</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${testimonial.gradient} rounded-full text-white font-bold text-sm mb-4`}>
                      {testimonial.earnings}
                    </div>
                    <p className="text-gray-700 dark:text-dark-200 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-200 dark:border-dark-700">
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-dark-300">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-white">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of affiliates earning passive income with the world's best crypto trading platform. Sign up is free and takes less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register?affiliate=true"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Join Now - It's Free
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Contact Affiliate Team
                </Link>
              </div>

              {/* Demo referral link */}
              <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white/80 text-sm mb-3">Preview your affiliate link:</p>
                <div className="flex items-center gap-3 bg-dark-900/30 rounded-lg p-4">
                  <input
                    type="text"
                    value="https://cloudbright.com/ref/YOUR_ID"
                    readOnly
                    className="flex-1 bg-transparent text-white outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
