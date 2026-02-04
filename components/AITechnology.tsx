'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import FloatingShapes from './FloatingShapes';

const features = [
  {
    icon: '/icons/icon-neural-network.png',
    title: 'Neural Network Analysis',
    description: 'Our proprietary AI analyzes 10,000+ market indicators in real-time, identifying profitable opportunities before traditional traders.',
  },
  {
    icon: '/icons/icon-lightning.png',
    title: 'Lightning-Fast Execution',
    description: 'Execute trades in microseconds with our optimized algorithms, capturing market movements others miss.',
  },
  {
    icon: '/icons/icon-shield.png',
    title: 'Risk Management AI',
    description: 'Advanced risk protection system that automatically adjusts positions to minimize losses and maximize gains.',
  },
  {
    icon: '/icons/icon-exchange.png',
    title: 'Multi-Exchange Arbitrage',
    description: 'Simultaneously monitor and trade across 25+ exchanges, exploiting price differences for guaranteed profits.',
  },
  {
    icon: '/icons/icon-refresh.png',
    title: 'Continuous Learning',
    description: 'Our AI improves daily, learning from millions of trades to adapt to changing market conditions.',
  },
  {
    icon: '/icons/icon-target.png',
    title: 'Precision Targeting',
    description: '97.3% success rate in predicting short-term price movements, validated by independent auditors.',
  },
];

const stats = [
  { value: '10B+', label: 'Data Points Analyzed Daily' },
  { value: '50ms', label: 'Average Trade Execution' },
  { value: '25+', label: 'Crypto Exchanges Connected' },
  { value: '24/7', label: 'Automated Trading' },
];

// Static trade data for display
interface Trade {
  id: number;
  pair: string;
  exchange: string;
  type: 'BUY' | 'SELL';
  price: string;
  amount: string;
  profit: string;
  time: string;
}

const staticTrades: Trade[] = [
  { id: 1, pair: 'BTC/USDT', exchange: 'Binance', type: 'BUY', price: '43250.00', amount: '0.5432', profit: '+0.42', time: '14:23:15' },
  { id: 2, pair: 'ETH/USDT', exchange: 'Coinbase', type: 'SELL', price: '2285.50', amount: '1.2100', profit: '+0.38', time: '14:23:12' },
  { id: 3, pair: 'SOL/USDT', exchange: 'Kraken', type: 'BUY', price: '98.75', amount: '5.6700', profit: '+0.51', time: '14:23:08' },
  { id: 4, pair: 'BNB/USDT', exchange: 'Bybit', type: 'BUY', price: '312.40', amount: '2.3400', profit: '+0.29', time: '14:23:05' },
  { id: 5, pair: 'XRP/USDT', exchange: 'OKX', type: 'SELL', price: '0.5420', amount: '1850.0000', profit: '+0.33', time: '14:23:01' },
  { id: 6, pair: 'ADA/USDT', exchange: 'KuCoin', type: 'BUY', price: '0.4280', amount: '2340.5000', profit: '+0.47', time: '14:22:58' },
  { id: 7, pair: 'DOGE/USDT', exchange: 'Bitfinex', type: 'SELL', price: '0.0835', amount: '12000.0000', profit: '+0.25', time: '14:22:54' },
  { id: 8, pair: 'AVAX/USDT', exchange: 'Gemini', type: 'BUY', price: '38.92', amount: '8.9000', profit: '+0.44', time: '14:22:50' },
  { id: 9, pair: 'DOT/USDT', exchange: 'Huobi', type: 'SELL', price: '7.23', amount: '125.6000', profit: '-0.12', time: '14:22:47' },
  { id: 10, pair: 'MATIC/USDT', exchange: 'Gate.io', type: 'BUY', price: '0.8950', amount: '1120.0000', profit: '+0.56', time: '14:22:43' },
];

function LiveTradingTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-8 overflow-hidden"
    >
      <div className="bg-gradient-to-br from-gray-50 dark:from-dark-800/50 to-gray-100 dark:to-dark-900/50 backdrop-blur-sm border border-gray-200 dark:border-primary-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Trades
        </h3>

        <div className="overflow-hidden h-[440px]">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-200 dark:border-primary-500/20">
                  <th className="text-left text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Time</th>
                  <th className="text-left text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Pair</th>
                  <th className="text-left text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Exchange</th>
                  <th className="text-left text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Type</th>
                  <th className="text-right text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Price</th>
                  <th className="text-right text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Amount</th>
                  <th className="text-right text-gray-600 dark:text-dark-300 font-semibold py-3 px-2">Profit %</th>
                </tr>
              </thead>
              <tbody>
                {staticTrades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-gray-200 dark:border-dark-700/50 hover:bg-primary-500/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-500 dark:text-dark-300 font-mono text-xs">{trade.time}</td>
                    <td className="py-3 px-2 text-gray-900 dark:text-white font-semibold">{trade.pair}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-dark-200">{trade.exchange}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.type === 'BUY'
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-900 dark:text-white font-mono">${trade.price}</td>
                    <td className="py-3 px-2 text-right text-gray-700 dark:text-dark-200 font-mono">{trade.amount}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${
                      trade.profit.startsWith('+') || parseFloat(trade.profit) > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {trade.profit}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AITechnology() {
  return (
    <section className="relative py-24 bg-white dark:bg-dark-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-cube.png',
            size: 150,
            position: { top: '10%', left: '5%' },
            rotate: 15,
          },
          {
            src: '/images/glossy-glass-pyramid.png',
            size: 100,
            position: { bottom: '15%', right: '8%' },
            rotate: -25,
          },
        ]}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Powered by <span className="text-gradient">Advanced AI</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-dark-200 max-w-3xl mx-auto">
            Our proprietary artificial intelligence technology has been refined over 5 years
            of development, processing billions in trading volume with proven results.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-primary-500/10 dark:from-primary-500/10 to-accent-500/10 dark:to-accent-500/10 rounded-2xl border border-primary-500/20 dark:border-primary-500/20"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-dark-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, translateY: -5 }}
              className="group relative p-8 bg-gradient-to-br from-gray-50 dark:from-dark-800 to-gray-100 dark:to-dark-900 rounded-2xl border border-gray-200 dark:border-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300" />

              <div className="relative z-10">
                {/* 3D Icon */}
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={80}
                      height={80}
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Live Trading Table */}
        <LiveTradingTable />
      </div>
    </section>
  );
}
