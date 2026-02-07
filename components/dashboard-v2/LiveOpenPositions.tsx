'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Zap, Target } from 'lucide-react';
import { PositionRow } from './PositionRow';

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
  const parentRef = useRef<HTMLDivElement>(null);

  // Use virtualization for 20+ positions for better performance
  const useVirtualization = positions.length > 20;

  const rowVirtualizer = useVirtualizer({
    count: positions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated row height in pixels
    enabled: useVirtualization,
  });

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
      {useVirtualization ? (
        // Virtualized list for 20+ positions
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: '600px', maxHeight: '70vh' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const position = positions[virtualItem.index];
              return (
                <div
                  key={position.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="pb-3">
                    <PositionRow position={position} index={virtualItem.index} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Normal list for < 20 positions (with animations)
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {positions.map((position, index) => (
              <PositionRow key={position.id} position={position} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

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
