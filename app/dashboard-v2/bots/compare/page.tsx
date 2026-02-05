'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Check,
  X,
  ArrowLeft,
  BarChart3,
  Star,
  Users,
  DollarSign
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface Bot {
  id: number;
  slug: string;
  name: string;
  icon: React.ReactNode;
  risk: 'low' | 'medium' | 'high';
  verified: boolean;
  stats: {
    return7d: number;
    return30d: number;
    return90d: number;
    return1y: number;
    winRate: number;
    maxDD: number;
    sharpeRatio: number;
    copiers: number;
    rating: number;
    minInvestment: number;
    avgTradeDuration: string;
    totalTrades: number;
    profitableDays: number;
  };
  features: {
    autoRebalance: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
    trailingStop: boolean;
    riskManagement: boolean;
    multiExchange: boolean;
  };
  strategy: string;
  description: string;
}

// Mock bots for comparison
const availableBots: Bot[] = [
  {
    id: 1,
    slug: 'alphabot',
    name: 'AlphaBot Pro',
    icon: <Shield className="w-8 h-8 text-green-400" />,
    risk: 'low',
    verified: true,
    strategy: 'DCA + Grid Trading',
    description: 'Conservative bot focused on consistent returns with minimal drawdown',
    stats: {
      return7d: 2.3,
      return30d: 12.5,
      return90d: 34.2,
      return1y: 127.8,
      winRate: 87,
      maxDD: -4.2,
      sharpeRatio: 2.8,
      copiers: 2847,
      rating: 4.9,
      minInvestment: 100,
      avgTradeDuration: '2.5 days',
      totalTrades: 1247,
      profitableDays: 87,
    },
    features: {
      autoRebalance: true,
      stopLoss: true,
      takeProfit: true,
      trailingStop: false,
      riskManagement: true,
      multiExchange: false,
    },
  },
  {
    id: 2,
    slug: 'protrader',
    name: 'ProTrader Elite',
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
    risk: 'medium',
    verified: true,
    strategy: 'Swing Trading',
    description: 'Balanced approach with higher returns and moderate risk',
    stats: {
      return7d: 4.1,
      return30d: 18.3,
      return90d: 47.6,
      return1y: 178.2,
      winRate: 82,
      maxDD: -8.5,
      sharpeRatio: 2.3,
      copiers: 1923,
      rating: 4.7,
      minInvestment: 500,
      avgTradeDuration: '5.2 days',
      totalTrades: 894,
      profitableDays: 82,
    },
    features: {
      autoRebalance: true,
      stopLoss: true,
      takeProfit: true,
      trailingStop: true,
      riskManagement: true,
      multiExchange: true,
    },
  },
  {
    id: 3,
    slug: 'sigmabot',
    name: 'SigmaBot',
    icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
    risk: 'high',
    verified: true,
    strategy: 'Scalping + Momentum',
    description: 'Aggressive high-frequency trading for maximum returns',
    stats: {
      return7d: 7.8,
      return30d: 28.9,
      return90d: 67.3,
      return1y: 243.5,
      winRate: 74,
      maxDD: -15.3,
      sharpeRatio: 1.9,
      copiers: 1247,
      rating: 4.5,
      minInvestment: 1000,
      avgTradeDuration: '8.3 hours',
      totalTrades: 3421,
      profitableDays: 74,
    },
    features: {
      autoRebalance: false,
      stopLoss: true,
      takeProfit: true,
      trailingStop: true,
      riskManagement: true,
      multiExchange: true,
    },
  },
  {
    id: 4,
    slug: 'thetagang',
    name: 'ThetaGang',
    icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
    risk: 'medium',
    verified: true,
    strategy: 'Options Selling',
    description: 'Premium collection through options selling strategies',
    stats: {
      return7d: 1.8,
      return30d: 8.7,
      return90d: 26.4,
      return1y: 98.3,
      winRate: 91,
      maxDD: -3.1,
      sharpeRatio: 3.2,
      copiers: 876,
      rating: 4.8,
      minInvestment: 2000,
      avgTradeDuration: '30 days',
      totalTrades: 234,
      profitableDays: 91,
    },
    features: {
      autoRebalance: true,
      stopLoss: true,
      takeProfit: false,
      trailingStop: false,
      riskManagement: true,
      multiExchange: false,
    },
  },
];

export default function BotComparePage() {
  const [selectedBots, setSelectedBots] = useState<Bot[]>([availableBots[0], availableBots[1]]);
  const [showSelector, setShowSelector] = useState(false);

  const handleSelectBot = (bot: Bot, index: number) => {
    const newSelected = [...selectedBots];
    newSelected[index] = bot;
    setSelectedBots(newSelected);
    setShowSelector(false);
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Low Risk
      </span>
    );
    if (risk === 'medium') return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Medium Risk
      </span>
    );
    return (
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> High Risk
      </span>
    );
  };

  // Prepare radar chart data
  const radarData = [
    { metric: '30d Return', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.return30d])) },
    { metric: 'Win Rate', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.winRate])) },
    { metric: 'Sharpe Ratio', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, bot.stats.sharpeRatio * 20])) },
    { metric: 'Risk Mgmt', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, Math.abs(bot.stats.maxDD) * 5])) },
    { metric: 'Popularity', ...Object.fromEntries(selectedBots.map((bot, i) => [`bot${i}`, (bot.stats.copiers / 100)])) },
  ];

  const radarColors = ['#10b981', '#3b82f6', '#a855f7'];

  const formatPercent = (value: number) => {
    return value >= 0 ? `+${value}%` : `${value}%`;
  };

  const getPercentColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Compare Bots</h1>
            <p className="text-dark-400">Side-by-side comparison of trading bots</p>
          </div>
          <Link
            href="/dashboard-v2/bots"
            className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bots
          </Link>
        </div>
      </motion.div>

      {/* Bot Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {selectedBots.map((bot, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-primary-500/50 transition-all duration-300"
          >
            {/* Glowing background on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 hover:from-primary-500/5 hover:to-accent-500/5 transition-all duration-300 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                    <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="text-2xl">{bot.icon}</div>
                  )}
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {bot.name}
                      {bot.verified && <Shield className="w-4 h-4 text-accent-400" />}
                    </div>
                    <div className="text-xs text-dark-400">{bot.strategy}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSelector(true)}
                  className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 text-sm font-semibold hover:bg-primary-500/30 hover:scale-105 transition-all"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRiskColor(bot.risk)}`}>
                  {getRiskBadge(bot.risk)}
                </span>
                <span className="flex items-center gap-1 text-xs text-dark-400">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {bot.stats.rating}
                  <Users className="w-3 h-3 ml-1" />
                  ({bot.stats.copiers.toLocaleString()})
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Bot Button */}
        {selectedBots.length < 3 && (
          <button
            onClick={() => setShowSelector(true)}
            className="bg-dark-900/50 border-2 border-dashed border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 hover:bg-dark-800/50 transition-all flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">+</div>
              <div className="text-sm text-dark-400">Add Bot to Compare</div>
            </div>
          </button>
        )}
      </motion.div>

      {/* Radar Chart Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          Performance Comparison Overview
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              {selectedBots.map((bot, index) => (
                <Radar
                  key={index}
                  name={bot.name}
                  dataKey={`bot${index}`}
                  stroke={radarColors[index]}
                  fill={radarColors[index]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#fff', fontSize: '14px' }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-dark-400 text-center mt-4">
          Normalized metrics for visual comparison. Higher values indicate better performance.
        </p>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden"
      >
        {/* Performance Metrics */}
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Metric</th>
                  {selectedBots.map((bot) => (
                    <th key={bot.id} className="text-center py-3 px-4 text-sm font-semibold text-white">
                      <div className="flex items-center justify-center gap-2">
                        {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                          <img src={bot.icon} alt={bot.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="text-lg">{bot.icon}</div>
                        )}
                        {bot.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {/* 7d Return */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">7-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-bold ${getPercentColor(bot.stats.return7d)}`}>
                        {formatPercent(bot.stats.return7d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 30d Return */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">30-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-bold ${getPercentColor(bot.stats.return30d)}`}>
                        {formatPercent(bot.stats.return30d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 90d Return */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">90-Day Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-bold ${getPercentColor(bot.stats.return90d)}`}>
                        {formatPercent(bot.stats.return90d)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 1y Return */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">1-Year Return</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className={`font-bold ${getPercentColor(bot.stats.return1y)}`}>
                        {formatPercent(bot.stats.return1y)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Win Rate */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Win Rate</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-bold text-white">{bot.stats.winRate}%</span>
                    </td>
                  ))}
                </tr>

                {/* Max Drawdown */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Max Drawdown</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-bold text-red-400">{bot.stats.maxDD}%</span>
                    </td>
                  ))}
                </tr>

                {/* Sharpe Ratio */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Sharpe Ratio</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-bold text-white">{bot.stats.sharpeRatio}</span>
                    </td>
                  ))}
                </tr>

                {/* Avg Trade Duration */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Avg Trade Duration</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-bold text-white">{bot.stats.avgTradeDuration}</span>
                    </td>
                  ))}
                </tr>

                {/* Total Trades */}
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Total Trades</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      <span className="font-bold text-white">{bot.stats.totalTrades.toLocaleString()}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4">Features</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Feature</th>
                  {selectedBots.map((bot) => (
                    <th key={bot.id} className="text-center py-3 px-4 text-sm font-semibold text-white">
                      <div className="flex items-center justify-center gap-2">
                        {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                          <img src={bot.icon} alt={bot.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="text-lg">{bot.icon}</div>
                        )}
                        {bot.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Auto-Rebalance</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.autoRebalance ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Stop Loss</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.stopLoss ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Take Profit</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.takeProfit ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Trailing Stop</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.trailingStop ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Risk Management</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.riskManagement ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-dark-300">Multi-Exchange</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-3 px-4 text-center">
                      {bot.features.multiExchange ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing & Requirements */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pricing & Requirements</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBots.map((bot) => (
              <motion.div
                key={bot.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                      <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="text-2xl">{bot.icon}</div>
                    )}
                  </div>
                  <div className="font-bold text-white">{bot.name}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Min Investment:
                    </span>
                    <span className="font-bold text-white">${bot.stats.minInvestment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Current Copiers:
                    </span>
                    <span className="font-bold text-white">{bot.stats.copiers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-400 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Rating:
                    </span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {bot.stats.rating}/5.0
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard-v2/bots/${bot.slug}`}
                  className="mt-4 block w-full py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all text-center text-sm"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bot Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Select Bot to Compare</h3>
              <button
                onClick={() => setShowSelector(false)}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4">
              {availableBots.map((bot) => (
                <motion.button
                  key={bot.id}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => handleSelectBot(bot, selectedBots.length < 3 ? selectedBots.length : 0)}
                  disabled={selectedBots.some((b) => b.id === bot.id)}
                  className="p-4 bg-dark-900/50 border border-dark-700 rounded-xl hover:border-primary-500/50 hover:bg-dark-800/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
                      <img src={bot.icon} alt={bot.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="text-2xl">{bot.icon}</div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        {bot.name}
                        {bot.verified && <Shield className="w-4 h-4 text-accent-400" />}
                      </div>
                      <div className="text-sm text-dark-400">{bot.strategy}</div>
                      <div className="text-xs text-dark-500 mt-1">{bot.description}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold flex items-center gap-1 ${getPercentColor(bot.stats.return30d)}`}>
                        <TrendingUp className="w-4 h-4" />
                        {formatPercent(bot.stats.return30d)}
                      </div>
                      <div className="text-xs text-dark-400">30d return</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
