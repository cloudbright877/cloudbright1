'use client';

import { motion } from 'framer-motion';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';

interface NetWorthHeroProps {
  portfolioValue: number;
  totalInvested: number;
  totalProfit: number;
  totalProfitPercent: number;
  todayPnL: number;
  activeBots: number;
  totalBots: number;
  totalRealizedPnL?: number;
  availableBalance?: number;
  unrealizedPnL?: number;
  totalTrades?: number;
}

export function NetWorthHero({
  portfolioValue,
  totalInvested,
  totalProfit,
  totalProfitPercent,
  todayPnL,
  activeBots,
  totalBots,
  totalRealizedPnL = 0,
  availableBalance = 0,
  unrealizedPnL = 0,
  totalTrades = 0,
}: NetWorthHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-2 lg:col-span-4 lg:row-span-2 order-2 lg:order-none"
    >
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-500/[0.12] via-indigo-500/[0.06] to-blue-500/[0.12] dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-blue-500/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] to-indigo-500/[0.06] dark:from-blue-500/5 dark:to-indigo-500/5 opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/[0.24] dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/[0.24] dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-dark-400 font-normal">Portfolio Value</p>
              <p className="text-xs text-gray-600 dark:text-dark-500 hidden sm:block">Total across all bots</p>
            </div>
          </div>

          <div className="mb-4 sm:mb-5 text-center sm:text-left">
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 dark:text-white mb-2">
              ${portfolioValue.toFixed(2)}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg ${
                totalProfit >= 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {totalProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="text-sm font-medium">
                  {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(0)}
                </span>
              </div>
              <span className={`text-sm font-medium ${totalProfit >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            {/* Invested | Realized P&L */}
            <div className="flex items-center p-3 bg-gray-100/80 dark:bg-dark-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-dark-700">
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Invested</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">${totalInvested.toLocaleString()}</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-dark-700 mx-3" />
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Realized P&L</p>
                <p className={`text-base font-medium ${totalRealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalRealizedPnL >= 0 ? '+' : ''}${totalRealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Available Balance | Unrealized P&L */}
            <div className="flex items-center p-3 bg-gray-100/80 dark:bg-dark-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-dark-700">
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Available</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">${availableBalance.toFixed(2)}</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-dark-700 mx-3" />
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Unrealized P&L</p>
                <p className={`text-base font-medium ${unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 p-2.5 bg-gray-100/80 dark:bg-dark-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-dark-700">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Today</p>
                <p className={`text-base font-medium ${todayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayPnL >= 0 ? '+' : ''}${todayPnL.toFixed(1)}
                </p>
              </div>
              <div className="flex-1 p-2.5 bg-gray-100/80 dark:bg-dark-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-dark-700">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Bots</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{activeBots}<span className="text-xs font-normal text-gray-600 dark:text-dark-400">/{totalBots}</span></p>
              </div>
              <div className="flex-1 p-2.5 bg-gray-100/80 dark:bg-dark-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-dark-700">
                <p className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Trades</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{totalTrades}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
