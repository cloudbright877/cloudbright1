'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        {/* Desktop Hero Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/poster_planet.jpg"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/homepage_hero.mp4" type="video/mp4" />
        </video>

        {/* Mobile Hero Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/poster_planet.jpg"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/homepage_hero_mobile.mp4" type="video/mp4" />
        </video>

        {/* Light dark overlay */}
        <div className="absolute inset-0 bg-dark-900/30" />
      </div>

      {/* Animated overlay elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-300">
              15,000+ Active Investors Earning Daily
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            The World&apos;s Most{' '}
            <span className="text-gradient">Transparent</span>
            <br />
            Trading Bots
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl text-dark-200 mb-8 max-w-3xl mx-auto"
          >
            See every ML model decision in real-time. <span className="text-white font-semibold">Non-custodial storage</span>,
            risk control, unlimited asset management.
          </motion.p>

          {/* Social proof stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">$127M+</div>
              <div className="text-sm text-dark-300 mt-1">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">90%</div>
              <div className="text-sm text-dark-300 mt-1">Monthly ROI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">99.7%</div>
              <div className="text-sm text-dark-300 mt-1">Uptime Guarantee</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register" className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-lg text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 glow-effect">
              <span className="relative z-10">Start Earning Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <a href="#technology" className="px-8 py-4 bg-transparent border-2 border-primary-500 rounded-full font-semibold text-lg text-primary-400 hover:bg-primary-500/10 transition-all duration-300 backdrop-blur-sm">
              Watch How It Works
            </a>
          </motion.div>

          {/* Risk-free guarantee */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 text-sm text-dark-300"
          >
            🛡️ 30-Day Money-Back Guarantee • 🔒 Bank-Level Security • ⚡ Instant Withdrawals
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-500/50 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-3 bg-primary-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
