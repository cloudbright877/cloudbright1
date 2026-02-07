'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceHeroCardProps {
  totalBalance: number;
  availableBalance: number;
  frozenBalance: number;
  profitToday?: number;
  profitPercent?: number;
}

export default function BalanceHeroCard({
  totalBalance,
  availableBalance,
  frozenBalance,
  profitToday = 0,
  profitPercent = 0,
}: BalanceHeroCardProps) {
  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const availablePercent = totalBalance > 0 ? (availableBalance / totalBalance) * 100 : 0;

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 rounded-2xl p-6">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-50" />
      <motion.div
        className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-xl">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-dark-400 font-medium">Total Balance</p>
            <p className="text-xs text-dark-500">Available + Frozen</p>
          </div>
        </div>

        {/* Main Balance */}
        <div className="mb-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold text-white mb-3"
          >
            ${formatNumber(totalBalance)}
          </motion.p>

          {/* Today's P&L (optional) */}
          {profitToday !== 0 && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                  profitToday >= 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {profitToday >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-bold">
                  {profitToday >= 0 ? '+' : ''}${formatNumber(Math.abs(profitToday), 0)}
                </span>
              </div>
              {profitPercent !== 0 && (
                <span
                  className={`text-sm font-medium ${
                    profitPercent >= 0 ? 'text-green-400/70' : 'text-red-400/70'
                  }`}
                >
                  {profitPercent >= 0 ? '+' : ''}{formatNumber(profitPercent, 2)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Balance Breakdown */}
        <div className="mt-auto space-y-4">
          {/* Available/Frozen Stats */}
          <div className="p-4 bg-dark-900/50 backdrop-blur-sm rounded-xl border border-dark-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-dark-400 mb-1">Available</p>
                <p className="text-xl font-bold text-green-400">
                  ${formatNumber(availableBalance)}
                </p>
              </div>
              <div className="w-px h-12 bg-dark-700" />
              <div>
                <p className="text-xs text-dark-400 mb-1">Frozen</p>
                <p className="text-xl font-bold text-yellow-400">
                  ${formatNumber(frozenBalance)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${availablePercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-dark-500">
              <span>{formatNumber(availablePercent, 1)}% available</span>
              <span>{formatNumber(100 - availablePercent, 1)}% frozen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
