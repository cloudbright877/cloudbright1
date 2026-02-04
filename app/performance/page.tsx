'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PerformancePage() {
  const [animatedStats, setAnimatedStats] = useState({
    totalReturns: 0,
    activeInvestors: 0,
    dailyVolume: 0,
    successRate: 0,
  });

  // Animate numbers on mount
  useEffect(() => {
    const targets = {
      totalReturns: 847.3,
      activeInvestors: 152847,
      dailyVolume: 45.2,
      successRate: 94.7,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalReturns: Math.floor(targets.totalReturns * progress * 10) / 10,
        activeInvestors: Math.floor(targets.activeInvestors * progress),
        dailyVolume: Math.floor(targets.dailyVolume * progress * 10) / 10,
        successRate: Math.floor(targets.successRate * progress * 10) / 10,
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const realTimeStats = [
    {
      label: 'Total Returns',
      value: `${animatedStats.totalReturns}%`,
      subtitle: 'Since Launch (2019)',
      icon: '📈',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Active Investors',
      value: animatedStats.activeInvestors.toLocaleString(),
      subtitle: 'Worldwide',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Daily Volume',
      value: `$${animatedStats.dailyVolume}M`,
      subtitle: 'Average Trading Volume',
      icon: '💹',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Success Rate',
      value: `${animatedStats.successRate}%`,
      subtitle: 'Profitable Trades',
      icon: '🎯',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const monthlyPerformance = [
    { month: 'Jan 2024', return: 12.4, volume: 38.5 },
    { month: 'Feb 2024', return: 15.2, volume: 42.1 },
    { month: 'Mar 2024', return: 18.7, volume: 45.8 },
    { month: 'Apr 2024', return: 14.3, volume: 41.2 },
    { month: 'May 2024', return: 16.8, volume: 47.3 },
    { month: 'Jun 2024', return: 19.2, volume: 51.6 },
    { month: 'Jul 2024', return: 17.5, volume: 48.9 },
    { month: 'Aug 2024', return: 20.1, volume: 54.2 },
    { month: 'Sep 2024', return: 16.9, volume: 46.7 },
    { month: 'Oct 2024', return: 18.4, volume: 49.8 },
    { month: 'Nov 2024', return: 21.3, volume: 56.4 },
    { month: 'Dec 2024', return: 19.8, volume: 52.1 },
  ];

  const yearlyReturns = [
    { year: '2019', return: 156.3, description: 'Platform Launch Year' },
    { year: '2020', return: 187.5, description: 'Market Volatility Capitalized' },
    { year: '2021', return: 243.8, description: 'Bull Market Performance' },
    { year: '2022', return: 124.6, description: 'Bear Market Resilience' },
    { year: '2023', return: 198.4, description: 'Recovery & Growth' },
    { year: '2024', return: 212.7, description: 'Year to Date' },
  ];

  const portfolioAllocation = [
    { asset: 'Bitcoin', percentage: 35, color: 'bg-orange-500' },
    { asset: 'Ethereum', percentage: 25, color: 'bg-blue-500' },
    { asset: 'Altcoins', percentage: 20, color: 'bg-purple-500' },
    { asset: 'Stablecoins', percentage: 15, color: 'bg-green-500' },
    { asset: 'DeFi Tokens', percentage: 5, color: 'bg-pink-500' },
  ];

  const comparisonData = [
    { name: 'Celestian AI', returns: '212.7%', risk: 'Medium', color: 'from-primary-500 to-accent-500' },
    { name: 'Traditional Stocks', returns: '12.4%', risk: 'Low', color: 'from-gray-400 to-gray-500' },
    { name: 'Crypto Buy & Hold', returns: '67.8%', risk: 'High', color: 'from-yellow-500 to-orange-500' },
    { name: 'Savings Account', returns: '2.1%', risk: 'Very Low', color: 'from-green-400 to-green-500' },
  ];

  const tradingMetrics = [
    { metric: 'Average Trade Duration', value: '4.3 hours', icon: '⏱️' },
    { metric: 'Win/Loss Ratio', value: '3.2:1', icon: '⚖️' },
    { metric: 'Maximum Drawdown', value: '8.4%', icon: '📉' },
    { metric: 'Sharpe Ratio', value: '2.87', icon: '📊' },
    { metric: 'Number of Trades', value: '1.2M+', icon: '🔄' },
    { metric: 'Avg. Daily Return', value: '2.8%', icon: '💰' },
  ];

  const maxReturn = Math.max(...monthlyPerformance.map(m => m.return));

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/performance_hero.mp4"
        videoSrcMobile="/performance_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Proven Track Record of <span className="text-gradient">Exceptional Returns</span>
          </span>
        }
        subtitle="Complete transparency. Real results. See exactly how our AI-powered trading platform has consistently delivered market-beating returns since 2019."
        badge={{
          text: '212.7% Average Annual Returns',
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Start Earning Today', href: '/register', variant: 'primary' },
          { text: 'Download Full Report', href: '#report', variant: 'secondary' },
        ]}
        overlay="medium"
      />

      <main className="bg-white dark:bg-dark-900">
        {/* Real-Time Stats */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-y border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {realTimeStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-dark-300">
                      {stat.subtitle}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Performance Chart */}
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
                2024 Performance
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Monthly <span className="text-gradient">Returns Breakdown</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Consistent double-digit returns month after month, regardless of market conditions.
              </p>
            </motion.div>

            <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
              <div className="space-y-4">
                {monthlyPerformance.map((data, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-dark-200 w-24">
                        {data.month}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="h-8 bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(data.return / maxReturn) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-end pr-3"
                          >
                            <span className="text-white font-bold text-sm">{data.return}%</span>
                          </motion.div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-dark-400 w-20 text-right">
                        ${data.volume}M
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-300">Average Monthly Return:</span>
                <span className="font-bold text-gradient">17.7%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Returns */}
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
                Historical Performance
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Year-Over-Year <span className="text-gradient">Growth</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Five years of proven success across all market conditions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yearlyReturns.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-3xl font-black text-gradient mb-4">
                    {data.year}
                  </div>
                  <div className="text-5xl font-black mb-2 text-gray-900 dark:text-white">
                    {data.return}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-dark-300">
                    {data.description}
                  </p>
                  <div className="mt-6 h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Allocation */}
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
                  Asset Allocation
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Diversified <span className="text-gradient">Portfolio Strategy</span>
                </h2>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-8 leading-relaxed">
                  Our AI dynamically adjusts portfolio allocation based on market conditions, maintaining optimal risk-reward balance at all times.
                </p>

                <div className="space-y-6">
                  {portfolioAllocation.map((asset, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{asset.asset}</span>
                        <span className="text-sm font-bold text-primary-500">{asset.percentage}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${asset.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full ${asset.color} rounded-full`}
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
                  Key Trading Metrics
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {tradingMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-2">{metric.icon}</div>
                      <div className="text-2xl font-black text-gradient mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-dark-300">
                        {metric.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Comparison */}
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
                Performance Comparison
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                How We <span className="text-gradient">Stack Up</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                See how Celestian AI compares to traditional investment options.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {comparisonData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white dark:bg-dark-800 rounded-3xl p-8 border-2 transition-all duration-300 ${
                    index === 0
                      ? 'border-primary-500 shadow-2xl shadow-primary-500/20 scale-105'
                      : 'border-gray-200 dark:border-dark-700 hover:shadow-xl'
                  }`}
                >
                  {index === 0 && (
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white text-xs font-bold mb-4">
                      Best Performance
                    </div>
                  )}
                  <h3 className="text-xl font-black mb-4 text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <div className={`text-4xl font-black mb-3 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.returns}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-dark-300">
                    Annual Return (2024)
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <span className="text-xs font-semibold text-gray-500 dark:text-dark-400">
                      Risk Level: {item.risk}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Disclaimer */}
        <section className="py-16 bg-yellow-50 dark:bg-yellow-900/10 border-y border-yellow-200 dark:border-yellow-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4"
            >
              <div className="text-3xl">⚠️</div>
              <div>
                <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white">
                  Risk Disclosure
                </h3>
                <p className="text-gray-700 dark:text-dark-200 leading-relaxed">
                  <strong>Past performance does not guarantee future results.</strong> Cryptocurrency trading involves substantial risk of loss. All displayed returns are historical and should not be considered as investment advice. The value of your investment may fluctuate. Only invest capital you can afford to lose. Please read our full risk disclosure before investing.
                </p>
              </div>
            </motion.div>
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
                Start Your Journey to Financial Freedom
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of investors who are already benefiting from our proven AI trading system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start Investing Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Schedule a Consultation
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
