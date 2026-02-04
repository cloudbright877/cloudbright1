'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FloatingShapes from './FloatingShapes';

const benefits = [
  {
    icon: '/icons/coin.png',
    title: 'Compound Daily',
    description: 'Automatically reinvest your earnings',
  },
  {
    icon: '/icons/lock.png',
    title: 'Secure Custody',
    description: 'Bank-level security for your assets',
  },
  {
    icon: '/icons/light.png',
    title: 'Instant Access',
    description: 'Withdraw anytime, no lock-up periods',
  },
  {
    icon: '/icons/graph.png',
    title: 'Transparent Tracking',
    description: 'Real-time performance monitoring',
  },
];

// Classic 3-tier plans with strategies
const classicPlans = [
  {
    name: 'Essential',
    minInvestment: '$50',
    dailyReturn: '2.0%',
    monthlyReturn: '60%',
    strategies: [
      'Spot trading on Binance & Coinbase',
      'BTC/ETH trend-following algorithms',
      'Basic grid trading automation',
      'Market-making on major pairs',
      'Daily rebalancing of portfolio',
    ],
    popular: false,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Professional',
    minInvestment: '$2,500',
    dailyReturn: '2.5%',
    monthlyReturn: '75%',
    strategies: [
      'All Essential strategies included',
      'Multi-exchange arbitrage execution',
      'Perpetual futures with 3-5x leverage',
      'DeFi yield farming optimization',
      'Options selling (covered calls)',
      'Advanced risk management systems',
    ],
    popular: true,
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    name: 'Ultimate',
    minInvestment: '$10,000',
    dailyReturn: '3.0%',
    monthlyReturn: '90%',
    strategies: [
      'All Professional strategies included',
      'High-frequency scalping bots',
      'MEV extraction on Ethereum',
      'Market-making with liquidity provision',
      'OTC trading desk access',
      'Custom algorithm configurations',
      'Institutional-grade execution',
    ],
    popular: false,
    gradient: 'from-accent-500 to-pink-500',
  },
];

export default function StakingPlans() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/3d-model-minimalist-abstract-horizon-perspective.png"
          alt="Abstract perspective background"
          fill
          className="object-cover opacity-40"
          quality={100}
        />
      </div>

      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-sphere-floating-in.png',
            size: 120,
            position: { top: '20%', right: '10%' },
            rotate: 0,
          },
          {
            src: '/images/glossy-glass-octahedron.png',
            size: 150,
            position: { bottom: '10%', left: '6%' },
            rotate: 45,
          },
        ]}
      />

      {/* Animated blur orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Choose Your <span className="text-gradient">Investment Plan</span>
          </h2>
          <p className="text-xl text-dark-200 max-w-3xl mx-auto">
            Start earning consistent daily returns with flexible plans designed
            for every investor. All investments are 100% protected by our insurance fund.
          </p>
        </motion.div>

        {/* Classic Grid - 3 columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {classicPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-sm font-bold text-white shadow-lg">
                    🔥 Most Popular
                  </div>
                </div>
              )}

              <div
                className={`relative h-full p-8 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-3xl border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'border-primary-500 shadow-2xl scale-105'
                    : 'border-dark-700 hover:border-primary-500/50'
                }`}
              >
                {/* Glow effect */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
                )}

                <div className="relative z-10">
                  {/* Plan name */}
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>

                  {/* Minimum investment */}
                  <div className="mb-6">
                    <div className="text-sm text-dark-300 mb-1">Minimum Investment</div>
                    <div className="text-4xl font-bold text-gradient">{plan.minInvestment}</div>
                  </div>

                  {/* Returns */}
                  <div className="mb-6 p-4 bg-dark-900/50 rounded-xl border border-primary-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-300">Daily Return:</span>
                      <span className="text-xl font-bold text-green-400">{plan.dailyReturn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark-300">Monthly Potential:</span>
                      <span className="text-xl font-bold text-green-400">{plan.monthlyReturn}</span>
                    </div>
                  </div>

                  {/* Strategies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-primary-400 mb-3">Trading Strategies:</h4>
                    <ul className="space-y-3">
                      {plan.strategies.map((strategy, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary-400 mt-1">▸</span>
                          <span className="text-dark-200 text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lock-in badge */}
                  <div className="mb-6 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-dark-400 text-xs">🔒</span>
                      <span className="text-white text-sm font-medium">30 Business Days Lock-in</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/register"
                    className={`block w-full py-4 rounded-xl font-semibold text-lg text-center transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-2xl hover:scale-105'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-dark-700 text-center hover:border-primary-500/30 transition-colors duration-300"
            >
              <div className="relative w-16 h-16 mx-auto mb-3">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold mb-2 text-white">{benefit.title}</h4>
              <p className="text-sm text-dark-300">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Insurance badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full backdrop-blur-sm">
            <span className="text-3xl">🛡️</span>
            <div className="text-left">
              <div className="font-bold text-green-400">100% Investment Insurance Protection</div>
              <div className="text-sm text-dark-300">Your entire investment is fully insured by our company's reserve fund.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
