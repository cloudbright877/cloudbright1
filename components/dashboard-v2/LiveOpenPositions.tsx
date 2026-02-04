'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Zap, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface LivePosition {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  amount: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: string;
  duration: string;
  priceDirection?: 'up' | 'down';
  type?: string;
}

interface LiveOpenPositionsProps {
  positions: LivePosition[];
}

export function LiveOpenPositions({ positions }: LiveOpenPositionsProps) {
  if (positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Positions</h3>
              <p className="text-xs text-dark-400">0 active</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-dark-600 rounded-full" />
            <span className="text-xs text-dark-500 font-semibold">Scanning</span>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-dark-600 animate-pulse" />
          </div>
          <p className="text-sm text-dark-400">Analyzing market conditions...</p>
          <p className="text-xs text-dark-500 mt-1">Waiting for favorable momentum</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Live Positions</h3>
            <p className="text-xs text-dark-400">{positions.length} active</p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* Position List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {positions.map((position, index) => (
            <motion.div
              key={position.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-xl border border-dark-700 bg-dark-900/30"
            >
              {/* Content */}
              <div className="relative p-3">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      position.side === 'LONG'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {position.side} ×{position.leverage}
                    </div>
                    <span className="font-bold text-white text-sm">{position.pair}</span>
                    {/* Duration moved here */}
                    <div className="flex items-center gap-1 text-xs text-dark-400 ml-1">
                      <Clock className="w-3 h-3" />
                      {position.duration}
                    </div>
                  </div>

                  {/* SL/TP moved to header */}
                  <div className="flex items-center gap-2">
                    {/* Stop Loss */}
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] text-dark-500">Stop Loss</div>
                      <div className="font-mono text-xs text-red-400 font-semibold">
                        ${(position.stopLoss || 0).toFixed(0)}
                      </div>
                    </div>
                    {/* Take Profit */}
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] text-dark-500">Take Profit</div>
                      <div className="font-mono text-xs text-green-400 font-semibold">
                        ${(position.takeProfit || 0).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prices - Single Row */}
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-400">Entry:</span>
                    <span className="font-mono text-white">
                      ${position.entryPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {position.pnl >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    {/* Current Price with Flash Animation */}
                    <motion.span
                      key={`price-${position.id}-${position.currentPrice}`}
                      className="font-mono"
                      initial={{ color: 'rgb(255, 255, 255)' }}
                      animate={{ color: [
                        'rgb(255, 255, 255)',
                        position.priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                        position.priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                        'rgb(255, 255, 255)'
                      ]}}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                    >
                      ${position.currentPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </motion.span>
                  </div>
                </div>

                {/* P&L - Centered Full Width */}
                <div className="pt-2 border-t border-dark-700">
                  {/* P&L Block with Flash Animation */}
                  <motion.div
                    key={`pnl-${position.id}-${position.pnl}`}
                    className="px-3 py-2 bg-dark-800/50 border border-dark-700 rounded flex items-center justify-center"
                    initial={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    animate={{ backgroundColor: [
                      'rgba(31, 41, 55, 0.5)',
                      position.pnl >= 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                      position.pnl >= 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                      'rgba(31, 41, 55, 0.5)'
                    ]}}
                    transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-dark-400">P&L:</div>
                      <div className={`font-mono text-sm font-bold ${
                        position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {position.pnl >= 0 ? '+' : '-'}${Math.abs(position.pnl).toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        position.pnl >= 0 ? 'text-green-400/60' : 'text-red-400/60'
                      }`}>
                        ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Type Badge */}
                {position.type === 'instant' && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                    <Target className="w-3 h-3" />
                    <span className="font-semibold">Closing soon...</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-dark-700">
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
          <span>Prices update every 2 seconds</span>
        </div>
      </div>
    </motion.div>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
