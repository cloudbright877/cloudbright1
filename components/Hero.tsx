'use client';

import { GlowButton } from '@/components/animations/GlowButton';
import { HexGrid } from '@/components/animations/HexGrid';
import { LivePositionTicker } from '@/components/LivePositionTicker';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Hex Grid Background */}
      <div className="absolute inset-0 bg-dark-900">
        <HexGrid />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-dark-900/20 to-dark-900/60" />
      </div>

      {/* Animated glow orbs — CSS only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl"
          style={{ animation: 'hero-orb 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl"
          style={{ animation: 'hero-orb 8s ease-in-out infinite reverse' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8 backdrop-blur-sm"
            style={{ animation: 'hero-fade-down 0.6s ease-out both' }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-200">
              Commission Only on Profit
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 leading-tight text-white"
            style={{ animation: 'hero-fade-in 0.6s ease-out 0.2s both' }}
          >
            Copy the Best Bots.
            <br />
            <span className="text-gradient">Collect the Profits.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg text-dark-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ animation: 'hero-fade-in 0.6s ease-out 0.4s both' }}
          >
            Top up your balance, copy a verified bot, and earn passive income automatically.{' '}
            <span className="text-white font-semibold">
              No monthly fees &mdash; pay only when you profit.
            </span>
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ animation: 'hero-fade-in 0.6s ease-out 0.8s both' }}
          >
            <GlowButton href="/register" variant="primary" size="lg">
              Start Free
            </GlowButton>
            <GlowButton href="/marketplace" variant="secondary" size="lg">
              Explore Bots
            </GlowButton>
          </div>

          {/* Live position tickers */}
          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
            style={{ animation: 'hero-fade-in 0.6s ease-out 1s both' }}
          >
            <LivePositionTicker startIndex={0} />
            <div className="hidden md:block">
              <LivePositionTicker startIndex={4} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
