'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      icon: '🤖',
      title: 'AI-Powered Trading',
      description: 'Advanced machine learning algorithms that analyze market patterns and execute trades 24/7 with millisecond precision.',
      features: ['Real-time market analysis', 'Automated trade execution', 'Risk management', 'Portfolio optimization'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '📊',
      title: 'Smart Portfolio Management',
      description: 'Diversified crypto portfolios automatically rebalanced based on market conditions and your risk tolerance.',
      features: ['Auto-rebalancing', 'Tax-loss harvesting', 'Performance tracking', 'Custom strategies'],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '⚡',
      title: 'High-Frequency Arbitrage',
      description: 'Lightning-fast arbitrage across multiple exchanges to capture price inefficiencies before they disappear.',
      features: ['Multi-exchange trading', 'Low latency execution', 'Profit maximization', '99.9% uptime'],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '🛡️',
      title: 'Risk Protection',
      description: 'Advanced risk management systems that protect your capital during market volatility and black swan events.',
      features: ['Stop-loss automation', 'Volatility detection', 'Portfolio hedging', 'Emergency shutdown'],
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const technologies = [
    { name: 'Machine Learning', percentage: 95 },
    { name: 'Natural Language Processing', percentage: 88 },
    { name: 'Deep Neural Networks', percentage: 92 },
    { name: 'Quantum Computing Research', percentage: 75 },
  ];

  const benefits = [
    { icon: '💰', title: 'Consistent Returns', stat: '2.8% avg daily', description: 'Outperform traditional investment vehicles' },
    { icon: '⏱️', title: 'Zero Effort', stat: '100% automated', description: 'Set it and forget it - AI does everything' },
    { icon: '🔒', title: 'Bank-Grade Security', stat: '$100M insured', description: 'Your funds are safe and protected' },
    { icon: '📱', title: 'Real-Time Access', stat: '24/7 monitoring', description: 'Track performance anytime, anywhere' },
  ];

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/services_hero.mp4"
        videoSrcMobile="/services_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Intelligent Trading <span className="text-gradient">Powered by AI</span>
          </span>
        }
        subtitle="Our proprietary algorithms process millions of data points per second to identify profitable trading opportunities that human traders simply can't match."
        badge={{
          text: '$2.5B+ Traded Monthly Through Our Platform',
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Start Trading Now', href: '/register', variant: 'primary' },
          { text: 'View Performance', href: '/performance', variant: 'secondary' },
        ]}
      />

      <main className="bg-white dark:bg-dark-900">
        {/* Services Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Services
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Everything You Need to <span className="text-gradient">Succeed</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Cutting-edge technology meets proven trading strategies. All automated, all optimized for maximum returns.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-dark-200">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${service.gradient} transition-all duration-700 rounded-full`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Technology Stack
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Powered by <span className="text-gradient">Next-Gen AI</span>
                </h2>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-8 leading-relaxed">
                  We invest millions in research and development to stay ahead of the curve. Our technology stack combines proven algorithms with cutting-edge innovations.
                </p>

                <div className="space-y-6">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{tech.name}</span>
                        <span className="text-sm font-bold text-primary-500">{tech.percentage}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 rounded-3xl p-12 border border-primary-500/20"
              >
                <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">
                  Why Our AI Outperforms
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-dark-200">
                      <strong>Real-time Learning:</strong> Our AI adapts to market changes in milliseconds
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-dark-200">
                      <strong>Sentiment Analysis:</strong> Analyzes news, social media, and market sentiment
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-dark-200">
                      <strong>Pattern Recognition:</strong> Identifies complex patterns invisible to humans
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-dark-200">
                      <strong>Multi-Asset Strategy:</strong> Trades across 50+ cryptocurrencies simultaneously
                    </p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                The Celestian Advantage
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Why Investors <span className="text-gradient">Choose Us</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <div className="text-3xl font-black text-gradient mb-2">
                    {benefit.stat}
                  </div>
                  <p className="text-gray-600 dark:text-dark-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-500 to-accent-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                Ready to Experience AI Trading?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join 150,000+ investors who trust our AI to grow their wealth. Start with as little as $100.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Talk to an Expert
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
