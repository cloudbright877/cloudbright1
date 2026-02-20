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
      className="lg:col-span-4 lg:row-span-2"
    >
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-xl">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-dark-400 font-normal">Portfolio Value</p>
              <p className="text-xs text-dark-500">Total across all bots</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-4xl lg:text-5xl font-semibold text-white mb-2">
              ${portfolioValue.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
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
            <div className="flex items-center p-3 bg-dark-900/50 backdrop-blur-sm rounded-xl border border-dark-700">
              <div className="flex-1">
                <p className="text-xs text-dark-400 mb-0.5">Invested</p>
                <p className="text-base font-medium text-white">${totalInvested.toLocaleString()}</p>
              </div>
              <div className="w-px h-10 bg-dark-700 mx-3" />
              <div className="flex-1 text-right">
                <p className="text-xs text-dark-400 mb-0.5">Realized P&L</p>
                <p className={`text-base font-medium ${totalRealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalRealizedPnL >= 0 ? '+' : ''}${totalRealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Available Balance | Unrealized P&L */}
            <div className="flex items-center p-3 bg-dark-900/50 backdrop-blur-sm rounded-xl border border-dark-700">
              <div className="flex-1">
                <p className="text-xs text-dark-400 mb-0.5">Available</p>
                <p className="text-base font-medium text-white">${availableBalance.toFixed(2)}</p>
              </div>
              <div className="w-px h-10 bg-dark-700 mx-3" />
              <div className="flex-1 text-right">
                <p className="text-xs text-dark-400 mb-0.5">Unrealized P&L</p>
                <p className={`text-base font-medium ${unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-xs text-blue-400/70 mb-0.5">Today</p>
                <p className="text-base font-medium text-blue-400">
                  {todayPnL >= 0 ? '+' : ''}${todayPnL.toFixed(1)}
                </p>
              </div>
              <div className="flex-1 p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <p className="text-xs text-purple-400/70 mb-0.5">Bots</p>
                <p className="text-base font-medium text-purple-400">{activeBots}<span className="text-xs font-normal text-purple-400/70">/{totalBots}</span></p>
              </div>
              <div className="flex-1 p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <p className="text-xs text-emerald-400/70 mb-0.5">Trades</p>
                <p className="text-base font-medium text-emerald-400">{totalTrades}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
