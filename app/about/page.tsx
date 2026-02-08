'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import Link from 'next/link';

const stats = [
  { value: 40, suffix: '+', label: 'Team Members' },
  { value: 9, suffix: '+', label: 'Supported Exchanges' },
  { value: 10, suffix: '+', label: 'Trading Bots' },
  { value: 24, suffix: '/7', label: 'Trading Operations' },
];

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
      'Non-custodial by design. Your funds never leave your exchange account. We connect via read/trade API keys — withdrawal is never possible through us.',
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
      'Built on Web3 principles with smart contracts and blockchain-based settlement. Cutting-edge technology powering the next generation of trading tools.',
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
      'Social copy trading at its core. Follow top-performing strategies, share insights, and grow together with a global community of traders.',
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

const departments = [
  {
    title: 'Leadership & Strategy',
    description:
      'Setting the vision for accessible algorithmic trading. Our leadership team brings decades of combined experience in fintech, crypto markets, and enterprise software.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Engineering & AI',
    description:
      'Building the core platform, trading engine, and bot marketplace. Our engineers specialize in high-frequency systems, blockchain integration, and machine learning.',
    gradient: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Security & Compliance',
    description:
      'Ensuring platform integrity, smart contract safety, and regulatory compliance. Continuous auditing and monitoring to protect every user on the platform.',
    gradient: 'from-orange-500 to-red-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Community & Support',
    description:
      'Connecting traders worldwide and providing 24/7 assistance. From onboarding to advanced strategy guidance, our team is here to help you succeed.',
    gradient: 'from-green-500 to-emerald-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <PageHero
        videoSrc="/about_hero.mp4"
        poster="/about_hero_img.jpg"
        title={
          <span className="text-white drop-shadow-2xl">
            Building the Future of{' '}
            <span className="text-gradient">Algorithmic Trading</span>
          </span>
        }
        subtitle="CLOUDBRIGHT is on a mission to make professional-grade trading bots accessible to everyone — without ever touching your funds."
        badge={{
          text: 'Founded December 2025 in Hong Kong',
          icon: <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Get Started', href: '/register', variant: 'primary' },
          { text: 'Our Features', href: '/features', variant: 'secondary' },
        ]}
        overlay="medium"
      />

      <main className="bg-white dark:bg-dark-900">
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-y border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-black text-gradient mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-4xl md:text-5xl font-black text-gradient"
                    />
                  </div>
                  <div className="text-gray-600 dark:text-dark-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Our Mission
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Democratizing{' '}
                  <span className="text-gradient">Algorithmic Trading</span>
                </h2>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Professional trading algorithms have long been the exclusive domain of
                  hedge funds and institutional players. CLOUDBRIGHT changes that by
                  building a marketplace where anyone can access, compare, and deploy
                  battle-tested trading bots with just a few clicks.
                </p>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Our social copy trading platform lets you follow the strategies that
                  resonate with your goals — whether you are looking for conservative
                  steady growth or more active approaches. Every bot&apos;s track record is
                  fully transparent and verifiable on-chain.
                </p>
                <p className="text-lg text-gray-700 dark:text-dark-200 leading-relaxed">
                  And the best part?{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Your keys, your crypto.
                  </span>{' '}
                  CLOUDBRIGHT is 100% non-custodial. Your funds stay on your own exchange
                  account at all times. We never have withdrawal access to your assets.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-3xl overflow-hidden">
                  {/* Abstract gradient visual */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-primary-500/20 rounded-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <motion.div
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 blur-2xl"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl md:text-7xl font-black text-gradient mb-2">
                            CB
                          </div>
                          <div className="text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-widest">
                            CLOUDBRIGHT
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative grid */}
                  <div className="absolute inset-0 opacity-10 dark:opacity-5"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                </div>
              </motion.div>
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
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                What We <span className="text-gradient">Stand For</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Every decision at CLOUDBRIGHT is guided by four principles that put
                traders first.
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
                        className="text-8xl md:text-9xl font-black text-gradient opacity-20"
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
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
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
                  markets, Hong Kong gives CLOUDBRIGHT direct access to the most active
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
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
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
                          <div className="text-2xl font-black text-gradient">
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

        {/* Team Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Team
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                <span className="text-gradient">40+ Professionals</span> Across Four
                Departments
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                A multidisciplinary team of engineers, traders, security experts, and
                community builders — united by the goal of making algorithmic trading
                accessible to everyone.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {departments.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group relative"
                >
                  <div className="relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    {/* Animated gradient background on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Decorative corner element */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${dept.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-6">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}
                        >
                          {dept.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-gradient transition-all duration-300">
                          {dept.title}
                        </h3>
                        <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                          {dept.description}
                        </p>
                      </div>

                      {/* Decorative line */}
                      <div
                        className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${dept.gradient} transition-all duration-700 rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Model Callout */}
        <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-dark-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-dark-700 text-center"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                How We Earn
              </span>
              <h3 className="text-3xl md:text-4xl font-black mt-4 mb-4 text-gray-900 dark:text-white">
                Aligned With <span className="text-gradient">Your Success</span>
              </h3>
              <p className="text-lg text-gray-700 dark:text-dark-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                CLOUDBRIGHT charges a small 1-2% commission only when you withdraw
                profit. If you don&apos;t profit, we don&apos;t earn. Our incentives are
                fully aligned with yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-dark-200 font-medium">
                    No upfront fees
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-dark-200 font-medium">
                    No monthly subscriptions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-dark-200 font-medium">
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
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Ready to <span className="text-gradient">Start Trading</span>?
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Connect your exchange, pick a bot, and let the algorithms work for you —
                while you stay in full control of your funds.
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
