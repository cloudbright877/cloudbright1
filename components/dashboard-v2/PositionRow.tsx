'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PositionRowProps {
  position: {
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
  };
  index: number;
}

/**
 * Memoized Position Row Component
 * Only re-renders when pnl, currentPrice, or priceDirection changes
 */
export const PositionRow = memo<PositionRowProps>(
  function PositionRow({ position, index }) {
    return (
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
              {/* Duration */}
              <div className="flex items-center gap-1 text-xs text-dark-400 ml-1">
                <Clock className="w-3 h-3" />
                {position.duration}
              </div>
            </div>

            {/* SL/TP */}
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
    );
  },
  // Custom comparator: only re-render if these fields change
  (prevProps, nextProps) => {
    const prev = prevProps.position;
    const next = nextProps.position;

    // Re-render only if these critical fields changed
    return (
      prev.id === next.id &&
      prev.currentPrice === next.currentPrice &&
      prev.pnl === next.pnl &&
      prev.pnlPercent === next.pnlPercent &&
      prev.priceDirection === next.priceDirection &&
      prev.duration === next.duration
    );
  }
);
