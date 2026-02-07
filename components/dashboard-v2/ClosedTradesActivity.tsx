'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Trade } from '@/types/api';

interface ClosedTradesActivityProps {
  trades: Trade[];
}

export function ClosedTradesActivity({ trades }: ClosedTradesActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 hover:border-accent-500/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent-500/20 border border-accent-500/30 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Recent Trades</h3>
          <p className="text-xs text-dark-400">Last {trades.length} closed</p>
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {trades.map((trade, index) => (
            <motion.div
              key={trade.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`p-3 rounded-xl border ${
                trade.pnl >= 0
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.pnl >= 0 ? (
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    </div>
                  )}
                  <span className="text-xs text-dark-400">
                    {getRelativeTime(trade.closedAt)}
                  </span>
                </div>
              </div>

              {/* Trade Info */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{trade.pair}</span>
                  <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    trade.side === 'LONG'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.side} ×{trade.leverage}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-dark-400">
                  <Clock className="w-3 h-3" />
                  {trade.duration}
                </div>
              </div>

              {/* P&L */}
              <div className="pt-2 border-t border-dark-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-500">P&L</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                    </div>
                    <div className={`text-xs ${
                      trade.pnl >= 0 ? 'text-green-400/70' : 'text-red-400/70'
                    }`}>
                      ({trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
