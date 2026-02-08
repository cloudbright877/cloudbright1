'use client';

import { motion } from 'framer-motion';
import { ScrambleText } from '@/components/animations/ScrambleText';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { GlowButton } from '@/components/animations/GlowButton';
import { Shield, Zap, Globe } from 'lucide-react';

const stats = [
  { value: 40, suffix: '+', label: 'Team Members', icon: Globe },
  { value: 9, suffix: '+', label: 'Exchanges', icon: Zap },
  { value: 10, suffix: '+', label: 'Trading Bots', icon: Shield },
];

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

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dark-900/40" />
      </div>

      {/* Animated overlay elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
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
            ease: 'easeInOut',
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-200">
              Bot Marketplace &mdash; 9+ Exchanges Supported
            </span>
          </motion.div>

          {/* Main headline with ScrambleText */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            <ScrambleText
              text="Professional Trading Bots,"
              delay={400}
              duration={1200}
            />
            <br />
            <span className="text-gradient">
              <ScrambleText
                text="One Click Away"
                delay={900}
                duration={1000}
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl text-dark-200 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Browse curated trading bots, copy top strategies, and keep full
            control of your funds.{' '}
            <span className="text-white font-semibold">
              100% non-custodial
            </span>{' '}
            &mdash; your keys, your crypto.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-5 h-5 text-primary-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="text-4xl font-bold text-gradient">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        duration={1400}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-dark-300">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlowButton href="/register" variant="primary" size="lg">
              Get Started
            </GlowButton>
            <GlowButton href="/dashboard-v2/bots" variant="secondary" size="lg">
              Explore Bots
            </GlowButton>
          </motion.div>

          {/* Risk disclosure */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-10 text-xs text-dark-400 max-w-2xl mx-auto leading-relaxed"
          >
            Trading bots involve risk. Past performance does not guarantee future
            results. Only invest what you can afford to lose. CLOUDBRIGHT does
            not provide financial advice.
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
