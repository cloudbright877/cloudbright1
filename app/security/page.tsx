'use client';

import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import Link from 'next/link';
import { Shield, Lock, Key, Server, Globe, ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  const stats = [
    { value: '7+', label: 'Supported Cryptocurrencies', isText: true },
    { value: 'AES-256', label: 'Encryption Standard', isText: true },
    { numericValue: 24, suffix: '/7', label: 'Security Monitoring', isText: false },
    { value: '2FA', label: 'Authentication Support', isText: true },
  ];

  const coreFeatures = [
    {
      icon: Shield,
      title: 'Protected Custodial Wallets',
      description:
        'Your funds are secured in encrypted custodial wallets with multi-layer protection. AES-256 encryption, 2FA, and continuous monitoring safeguard every transaction.',
      features: [
        'AES-256 encrypted wallet storage',
        'Instant deposits for 7+ cryptocurrencies',
        '2FA authentication required',
        '24/7 continuous security monitoring',
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Wallet Encryption',
      description:
        'All wallet data is encrypted with AES-256 at rest and in transit. Private keys are stored in hardware security modules. Multi-signature authorization for all withdrawals.',
      features: [
        'AES-256 encryption at rest and in transit',
        'Hardware security module key storage',
        'Multi-signature withdrawal authorization',
        'Cold storage for reserve funds',
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: ShieldCheck,
      title: 'Smart Contract Security',
      description:
        'Blockchain-based infrastructure with audited smart contracts. Transparent, verifiable, and trustless execution of trading strategies.',
      features: [
        'Audited smart contracts',
        'On-chain transparency',
        'Verifiable execution logic',
        'Trustless architecture',
      ],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Globe,
      title: 'Web3 Foundation',
      description:
        'Built on Web3 principles: decentralization, transparency, and user sovereignty. No central point of failure for your funds.',
      features: [
        'Decentralized by design',
        'User sovereignty first',
        'No single point of failure',
        'Transparent operations',
      ],
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const additionalMeasures = [
    {
      icon: Key,
      title: 'Two-Factor Authentication',
      description:
        'Protect your account with 2FA using authenticator apps. An additional layer of security beyond your password.',
    },
    {
      icon: Lock,
      title: 'SSL/TLS Encryption',
      description:
        'All data transmitted between your browser and our servers is encrypted with industry-standard HTTPS/SSL protocols.',
    },
    {
      icon: ShieldCheck,
      title: 'Regular Security Audits',
      description:
        'Our systems undergo periodic security reviews and audits to identify and address potential vulnerabilities.',
    },
    {
      icon: Server,
      title: 'DDoS Protection',
      description:
        'Multi-layered DDoS mitigation ensures platform availability even during attempted distributed denial-of-service attacks.',
    },
    {
      icon: Shield,
      title: 'Rate Limiting & Access Control',
      description:
        'API rate limiting prevents abuse. IP whitelisting and device verification add additional layers of protection for your account.',
    },
    {
      icon: Lock,
      title: 'Encrypted Data Storage',
      description:
        'All sensitive data including wallet keys and personal information is encrypted at rest using industry-standard encryption.',
    },
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Create Account & Verify',
      description:
        'Sign up and complete identity verification. Your account is protected with AES-256 encryption and 2FA from day one.',
    },
    {
      step: 2,
      title: 'Deposit to Your Wallet',
      description:
        'Deposit USDT, BTC, ETH, or any of 7+ supported cryptocurrencies. Funds are credited instantly to your protected custodial wallet.',
    },
    {
      step: 3,
      title: 'Choose a Bot & Lock-in Period',
      description:
        'Browse 100+ verified bots, select your strategy, and choose a lock-in period from 7 to 180 days. Longer periods offer higher potential returns.',
    },
    {
      step: 4,
      title: 'Bot Trades Automatically',
      description:
        'The bot executes trades 24/7 on your behalf across 9+ exchanges. Watch every trade in real time from your dashboard.',
    },
    {
      step: 5,
      title: 'Collect Your Profits',
      description:
        'Collect realized profits on schedule. Once your lock-in period ends, your full investment is available for withdrawal. Full transparency at every step.',
    },
  ];

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/security_hero.mp4"
        videoSrcMobile="/security_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Bank-Grade Security —{' '}
            <span className="text-gradient">Your Funds, Fully Protected</span>
          </span>
        }
        subtitle="Cloudbright protects your funds with AES-256 encrypted custodial wallets, 2FA authentication, and continuous security monitoring. Instant deposits for 7+ cryptocurrencies."
        badge={{
          text: 'Security Audits Passed',
          icon: (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ),
        }}
        ctaButtons={[
          { text: 'Get Started', href: '/register', variant: 'primary' },
          { text: 'Learn More', href: '#architecture', variant: 'secondary' },
        ]}
        overlay="dark"
      />

      <main className="bg-white dark:bg-dark-900">
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-y border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <RevealOnScroll key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-semibold text-gradient mb-2">
                      {stat.isText ? (
                        stat.value
                      ) : (
                        <AnimatedCounter
                          value={stat.numericValue!}
                          suffix={stat.suffix}
                        />
                      )}
                    </div>
                    <div className="text-gray-600 dark:text-dark-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Core Security Architecture */}
        <section id="architecture" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Security Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  Core Security{' '}
                  <span className="text-gradient">Architecture</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                  Built from the ground up with bank-grade security. Your
                  funds are protected by multi-layer encryption and continuous
                  monitoring.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <RevealOnScroll
                    key={index}
                    delay={index * 0.1}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                  >
                    <div className="group relative h-full bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                      />

                      <div className="relative z-10">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-dark-300 mb-6 leading-relaxed">
                          {feature.description}
                        </p>

                        <div className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-gray-700 dark:text-dark-200"
                            >
                              <svg
                                className="w-5 h-5 text-green-500 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {item}
                            </div>
                          ))}
                        </div>

                        <div
                          className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-700 rounded-full`}
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Security Measures */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Defense in Depth
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  Additional{' '}
                  <span className="text-gradient">Security Measures</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                  Multiple layers of protection to keep your account and data
                  safe at every level.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalMeasures.map((measure, index) => {
                const IconComponent = measure.icon;
                return (
                  <RevealOnScroll key={index} delay={index * 0.1}>
                    <div className="h-full bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        {measure.title}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">
                        {measure.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* How Secure Trading Works */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  How It Works
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  How{' '}
                  <span className="text-gradient">Secure</span>{' '}
                  Trading Works
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                  Your funds are protected at every step. Here is how
                  Cloudbright secures your investments and executes trades.
                </p>
              </div>
            </RevealOnScroll>

            <div className="max-w-4xl mx-auto">
              {howItWorksSteps.map((step, index) => (
                <RevealOnScroll
                  key={index}
                  delay={index * 0.12}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  <div className="relative flex gap-6 mb-8 last:mb-0">
                    {/* Timeline line */}
                    {index < howItWorksSteps.length - 1 && (
                      <div className="absolute left-7 top-16 w-0.5 h-full bg-gradient-to-b from-primary-500/40 to-transparent" />
                    )}

                    {/* Step number */}
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-primary-500/25">
                      {step.step}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Audit & Compliance */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Trust & Transparency
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 text-gray-900 dark:text-white">
                  Audit &{' '}
                  <span className="text-gradient">Compliance</span>
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <RevealOnScroll direction="left">
                <div className="h-full bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Security Audits
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Information security audits passed',
                      'Smart contract audits completed',
                      'Regular internal security reviews',
                      'Penetration testing conducted',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-gray-800 dark:text-dark-100">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="right">
                <div className="h-full bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Company & Compliance
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Hong Kong registered company (HKCBS Limited)',
                      'Crypto-friendly HK regulatory environment',
                      'Custodial wallet model with full regulatory compliance',
                      'Transparent business operations',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-gray-800 dark:text-dark-100">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Risk Disclosure */}
            <RevealOnScroll delay={0.3}>
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-amber-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">
                        Risk Disclosure
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
                        Cryptocurrency trading involves substantial risk of loss
                        and is not suitable for every investor. Past performance
                        does not guarantee future results. You should carefully
                        consider whether trading is suitable for you in light of
                        your financial condition. Only trade with funds you can
                        afford to lose.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-900 dark:text-white">
                Your Security is Our{' '}
                <span className="text-gradient">Priority</span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Start earning with confidence. Bank-grade encryption, custodial
                wallets, and fully transparent — your investments are always
                protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white dark:bg-dark-800 border-2 border-gray-300 dark:border-dark-700 rounded-full font-semibold text-gray-900 dark:text-white hover:border-primary-500 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
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
