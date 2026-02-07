'use client';

import { motion } from 'framer-motion';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';

interface NetWorthHeroProps {
  netWorth: number;
  portfolioValue: number;
  cashBalance: number;
  totalProfit: number;
  totalProfitPercent: number;
  todayPnL: number;
  totalOpenPositions: number;
}

export function NetWorthHero({
  netWorth,
  portfolioValue,
  cashBalance,
  totalProfit,
  totalProfitPercent,
  todayPnL,
  totalOpenPositions,
}: NetWorthHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lg:col-span-4 lg:row-span-2"
    >
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-xl">
              <Gauge className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-dark-400 font-medium">Net Worth</p>
              <p className="text-xs text-dark-500">Portfolio + Available Cash</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-5xl lg:text-6xl font-bold text-white mb-2">
              ${netWorth.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                totalProfit >= 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {totalProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-bold">
                  {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(0)}
                </span>
              </div>
              <span className={`text-sm font-medium ${totalProfit >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900/50 backdrop-blur-sm rounded-xl border border-dark-700">
              <div>
                <p className="text-xs text-dark-400 mb-1">Portfolio Value</p>
                <p className="text-xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
              </div>
              <div className="w-px h-12 bg-dark-700" />
              <div>
                <p className="text-xs text-dark-400 mb-1">Cash</p>
                <p className="text-xl font-bold text-green-400">${cashBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-xs text-blue-400/70 mb-1">Today</p>
                <p className="text-lg font-bold text-blue-400">
                  {todayPnL >= 0 ? '+' : ''}${todayPnL.toFixed(1)}
                </p>
              </div>
              <div className="flex-1 p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <p className="text-xs text-purple-400/70 mb-1">Positions</p>
                <p className="text-lg font-bold text-purple-400">{totalOpenPositions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
