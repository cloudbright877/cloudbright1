'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';

// Platform stats (static)
const platformStats = {
  totalUsers: 15247,
  totalInvested: 127000000,
  totalPaid: 45000000,
};


const userBalance = {
  total: 15847.32,
};

const investmentsData = {
  totalValue: 45000.00,
  totalInvested: 40000.00,
  totalProfit: 8500.00,
  totalEarned: 2350.00,
  activeCount: 3,
  roi: 21.25,
};

const activeInvestments = [
  {
    id: 1,
    name: 'Professional Plan',
    amount: 15000,
    currency: 'USDT',
    return: 75.0,
    profit: 5625.00,
    lastEarning: 187.50,
    daysTotal: 30,
    daysElapsed: 15,
    progress: 50,
  },
  {
    id: 2,
    name: 'Essential Plan',
    amount: 10000,
    currency: 'BTC',
    return: 60.0,
    profit: 2000.00,
    lastEarning: 200.00,
    daysTotal: 30,
    daysElapsed: 10,
    progress: 33,
  },
  {
    id: 3,
    name: 'Ultimate Plan',
    amount: 15000,
    currency: 'ETH',
    return: 90.0,
    profit: 900.00,
    lastEarning: 450.00,
    daysTotal: 30,
    daysElapsed: 2,
    progress: 7,
  },
];

const completedInvestments = [
  {
    id: 4,
    name: 'Essential Plan',
    currency: 'USDT',
    profit: 3000.00,
    amount: 5000,
  },
  {
    id: 5,
    name: 'Professional Plan',
    currency: 'BTC',
    profit: 3750.00,
    amount: 5000,
  },
];

export default function DashboardPage() {
  const balance = userBalance;
  const investments = investmentsData;
  const recent = {
    active: activeInvestments,
    completed: completedInvestments,
  };

  // Simple formatting helpers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated blobs */}
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
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* Total Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-2xl border-2 border-primary-500/20 p-6 hover:border-primary-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-300 text-sm font-medium">Total Balance</span>
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${formatNumber(balance.total + investments.totalValue)}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-400">↑ {investments.roi.toFixed(1)}%</span>
                <span className="text-dark-400">ROI</span>
              </div>
            </div>
          </motion.div>

          {/* Invested */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-2xl border-2 border-dark-700 p-6 hover:border-accent-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-300 text-sm font-medium">Total Invested</span>
                <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${formatNumber(investments.totalInvested)}
              </div>
              <div className="flex items-center gap-1 text-sm text-dark-400">
                {investments.activeCount} active plans
              </div>
            </div>
          </motion.div>

          {/* Total Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-2xl border-2 border-dark-700 p-6 hover:border-green-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-300 text-sm font-medium">Total Earned</span>
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  ✨
                </div>
              </div>
              <div className="text-3xl font-bold text-gradient mb-1">
                ${formatNumber((investments.totalProfit || 0) + (investments.totalEarned || 0))}
              </div>
              <div className="flex items-center gap-1 text-sm text-dark-400">
                Profit and bonuses
              </div>
            </div>
          </motion.div>

          {/* Available */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-2xl border-2 border-dark-700 p-6 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-300 text-sm font-medium">Available</span>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  💳
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${formatNumber(balance.total)}
              </div>
              <div className="flex items-center gap-1 text-sm text-dark-400">
                Ready to withdraw
              </div>
            </div>
          </motion.div>

          {/* Active Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm rounded-2xl border-2 border-dark-700 p-6 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-300 text-sm font-medium">Active Value</span>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  💎
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${formatNumber(investments.totalValue)}
              </div>
              <div className="flex items-center gap-1 text-sm text-dark-400">
                In active plans
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Active Investments (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Create Investment - PRIMARY CTA */}
                <Link
                  href="/investments"
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 flex items-center justify-between hover:scale-105 transition-transform duration-300 glow-effect">
                    <div>
                      <div className="text-sm font-medium text-white/80 mb-1">Start Earning</div>
                      <div className="text-xl font-bold text-white">+ New Investment</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      🚀
                    </div>
                  </div>
                </Link>

                {/* Deposit */}
                <Link
                  href="/wallets/deposit"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-6 flex items-center justify-between hover:border-primary-500/50 hover:scale-105 transition-all duration-300">
                    <div>
                      <div className="text-sm font-medium text-dark-300 mb-1">Add Funds</div>
                      <div className="text-xl font-bold text-white">↓ Deposit</div>
                    </div>
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-2xl">
                      💳
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Active Investments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Active Investments</h2>
                <Link
                  href="/investments?tab=active-plans"
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {recent.active.length > 0 ? (
                  recent.active.map((deposit: any, index: number) => (
                  <motion.div
                    key={deposit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative group"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{deposit.name}</h3>
                            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-xs font-semibold text-green-400">
                              Active
                            </span>
                          </div>
                          <div className="text-sm text-dark-300">
                            {formatNumber(deposit.amount)} {deposit.currency} • {deposit.return.toFixed(1)}% Total
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-dark-400 mb-1">Total Profit</div>
                          <div className="text-xl font-bold text-green-400">
                            +{formatNumber(deposit.profit)}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-dark-400 mb-2">
                          <span>Progress</span>
                          <span>{deposit.daysElapsed}/{deposit.daysTotal} days</span>
                        </div>
                        <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${deposit.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-dark-900/50 rounded-lg p-3">
                          <div className="text-xs text-dark-400 mb-1">Last Earning</div>
                          <div className="text-sm font-bold text-green-400">
                            +{formatNumber(deposit.lastEarning)}
                          </div>
                        </div>
                        <div className="bg-dark-900/50 rounded-lg p-3">
                          <div className="text-xs text-dark-400 mb-1">Days Left</div>
                          <div className="text-sm font-bold text-white">
                            {deposit.daysTotal - deposit.daysElapsed}
                          </div>
                        </div>
                        <div className="bg-dark-900/50 rounded-lg p-3">
                          <div className="text-xs text-dark-400 mb-1">Return</div>
                          <div className="text-sm font-bold text-primary-400">
                            {deposit.return.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))) : (
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dashed border-dark-700 rounded-2xl p-12 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Investments</h3>
                    <p className="text-dark-300 mb-6">
                      Start earning passive income today with our AI-powered trading
                    </p>
                    <Link
                      href="/investments"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Create Your First Investment
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Recent Completed</h2>
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-4">
                <div className="space-y-3">
                  {recent.completed.length > 0 ? (
                    recent.completed.map((comp: any, index: number) => (
                      <motion.div
                        key={comp.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-lg hover:bg-dark-900/70 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-green-500/10">
                          ✓
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">{comp.name}</div>
                          <div className="text-xs text-dark-400">{comp.currency}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-400">
                            +{formatNumber(comp.profit)}
                          </div>
                          <div className="text-xs text-dark-400">
                            ${formatNumber(comp.amount)}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-dark-400 text-sm">
                      No completed investments yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Platform Stats</h2>
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Total Invested</div>
                    <div className="text-2xl font-bold text-gradient">
                      {formatLargeNumber(platformStats.totalInvested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Total Paid Out</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatLargeNumber(platformStats.totalPaid)}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-dark-700">
                    <div className="text-xs text-dark-400 mb-2">Trust Score</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                        <div className="h-full w-[97%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-green-400">97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Referral CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Link href="/referrals" className="block group">
                <div className="relative overflow-hidden bg-gradient-to-br from-accent-500/20 to-pink-500/20 border-2 border-accent-500/30 rounded-2xl p-6 hover:border-accent-500/50 transition-all duration-300">
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Earn 5% Commission
                    </h3>
                    <p className="text-sm text-dark-300 mb-4">
                      Invite friends and earn lifetime referral bonuses
                    </p>
                    <div className="inline-flex items-center gap-2 text-accent-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Get Your Link</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-dark-400"
        >
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Instant Withdrawals</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>100% Insurance Fund</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
