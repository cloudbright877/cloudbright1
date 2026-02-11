'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { featuredBots } from '@/data/bots';

interface MockPosition {
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  positionSize: number;
  durationSeconds: number;
  stopLoss: number;
  takeProfit: number;
}

// Realistic positions matching dashboard TradingBot formula:
// pnl = (priceChange / entryPrice) * leverage * positionSize
// positionSize = 6-14% of $5000-$10000 capital → $300-$1400
// Leverages: 3, 5, 10 (from presets)
// TP/SL: calculated as price * (1 ± targetPnL / (leverage * 100))
const MOCK_POSITIONS: MockPosition[] = [
  // BTC LONG ×5, $620 pos, entry 97420, current +0.12% → pnl = 0.0012 * 5 * 620 = $3.72
  { pair: 'BTC/USDT', side: 'LONG', leverage: 5, entryPrice: 97420.50, currentPrice: 97537.40, positionSize: 620, durationSeconds: 862, stopLoss: 96934.00, takeProfit: 97907.00 },
  // ETH SHORT ×3, $480 pos, entry 3842, current -0.21% (profit for short) → pnl = 0.0021 * 3 * 480 = $3.02
  { pair: 'ETH/USDT', side: 'SHORT', leverage: 3, entryPrice: 3842.10, currentPrice: 3834.03, positionSize: 480, durationSeconds: 1543, stopLoss: 3880.50, takeProfit: 3803.70 },
  // SOL LONG ×10, $350 pos, entry 198.35, current +0.38% → pnl = 0.0038 * 10 * 350 = $13.30
  { pair: 'SOL/USDT', side: 'LONG', leverage: 10, entryPrice: 198.35, currentPrice: 199.10, positionSize: 350, durationSeconds: 427, stopLoss: 196.37, takeProfit: 200.33 },
  // BNB SHORT ×5, $540 pos, entry 612.80, current -0.15% → pnl = 0.0015 * 5 * 540 = $4.05
  { pair: 'BNB/USDT', side: 'SHORT', leverage: 5, entryPrice: 612.80, currentPrice: 611.88, positionSize: 540, durationSeconds: 2105, stopLoss: 615.86, takeProfit: 609.74 },
  // BTC SHORT ×3, $780 pos, entry 97650, current -0.08% → pnl = 0.0008 * 3 * 780 = $1.87
  { pair: 'BTC/USDT', side: 'SHORT', leverage: 3, entryPrice: 97650.00, currentPrice: 97571.88, positionSize: 780, durationSeconds: 318, stopLoss: 97943.30, takeProfit: 97161.00 },
  // ETH LONG ×10, $420 pos, entry 3815, current +0.18% → pnl = 0.0018 * 10 * 420 = $7.56
  { pair: 'ETH/USDT', side: 'LONG', leverage: 10, entryPrice: 3815.40, currentPrice: 3822.27, positionSize: 420, durationSeconds: 1890, stopLoss: 3777.25, takeProfit: 3853.55 },
  // SOL SHORT ×5, $510 pos, entry 201.20, current losing -0.10% → pnl = -0.001 * 5 * 510 = -$2.55
  { pair: 'SOL/USDT', side: 'SHORT', leverage: 5, entryPrice: 201.20, currentPrice: 201.40, positionSize: 510, durationSeconds: 654, stopLoss: 203.21, takeProfit: 199.19 },
  // BTC LONG ×10, $450 pos, entry 97280, current +0.25% → pnl = 0.0025 * 10 * 450 = $11.25
  { pair: 'BTC/USDT', side: 'LONG', leverage: 10, entryPrice: 97280.00, currentPrice: 97523.20, positionSize: 450, durationSeconds: 1072, stopLoss: 96794.56, takeProfit: 97765.44 },
];

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function LivePositionTicker() {
  const [posIndex, setPositionIndex] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(MOCK_POSITIONS[0].currentPrice);
  const [elapsed, setElapsed] = useState(MOCK_POSITIONS[0].durationSeconds);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down'>('up');
  const [botName, setBotName] = useState(featuredBots[0].name);
  const priceKeyRef = useRef(0);

  const position = MOCK_POSITIONS[posIndex];

  // Calculate live PnL using dashboard formula: (priceChange / entryPrice) * leverage * positionSize
  const livePnl = (() => {
    const diff = position.side === 'LONG'
      ? currentPrice - position.entryPrice
      : position.entryPrice - currentPrice;
    const pctChange = diff / position.entryPrice;
    return {
      pnl: pctChange * position.leverage * position.positionSize,
      pnlPercent: pctChange * position.leverage * 100,
    };
  })();

  // Randomize bot name after mount to avoid hydration mismatch
  useEffect(() => {
    setBotName(featuredBots[Math.floor(Math.random() * featuredBots.length)].name);
  }, []);

  // Duration counter — every 1s
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [posIndex]);

  // Price ticker — every 2s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(prev => {
        const variation = 0.0001 + Math.random() * 0.0004; // 0.01% - 0.05%
        const direction = Math.random() > 0.4 ? 1 : -1; // slight upward bias
        setPriceDirection(direction > 0 ? 'up' : 'down');
        priceKeyRef.current += 1;
        return prev * (1 + direction * variation);
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [posIndex]);

  // Position rotation — every 6s
  const cyclePosition = useCallback(() => {
    setPositionIndex(prev => {
      const next = (prev + 1) % MOCK_POSITIONS.length;
      setCurrentPrice(MOCK_POSITIONS[next].currentPrice);
      setElapsed(MOCK_POSITIONS[next].durationSeconds);
      setBotName(featuredBots[Math.floor(Math.random() * featuredBots.length)].name);
      priceKeyRef.current = 0;
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(cyclePosition, 6000);
    return () => clearInterval(timer);
  }, [cyclePosition]);

  const isPositive = livePnl.pnl >= 0;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg min-h-[13.5rem]">
        <AnimatePresence mode="wait">
            <motion.div
              key={posIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="backdrop-blur-sm bg-dark-800/60 border border-dark-700/50 rounded-xl pt-4 px-4 overflow-hidden"
            >
              {/* Header: LIVE · Bot Name */}
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Live</span>
                <span className="text-dark-500 text-xs">·</span>
                <span className="text-xs text-dark-300 font-medium">{botName}</span>
              </div>

              {/* Side/Leverage + Pair + Duration */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    position.side === 'LONG'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {position.side} ×{position.leverage}
                  </div>
                  <span className="font-bold text-white text-sm">{position.pair}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-dark-400">
                  <Clock className="w-3 h-3" />
                  {formatDuration(elapsed)}
                </div>
              </div>

              {/* Entry → Current price */}
              <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-dark-400">Entry</span>
                  <span className="font-mono text-white">${formatPrice(position.entryPrice)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-dark-400">Current</span>
                  <motion.span
                    key={`price-${posIndex}-${priceKeyRef.current}`}
                    className="font-mono"
                    initial={{ color: 'rgb(255, 255, 255)' }}
                    animate={{ color: [
                      'rgb(255, 255, 255)',
                      priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                      priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                      'rgb(255, 255, 255)',
                    ]}}
                    transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                  >
                    ${formatPrice(currentPrice)}
                  </motion.span>
                </div>
              </div>

              {/* SL · TP */}
              <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-dark-500">SL</span>
                  <span className="font-mono text-red-400/80">${formatPrice(position.stopLoss)}</span>
                </div>
                <span className="text-dark-600">·</span>
                <div className="flex items-center gap-1">
                  <span className="text-dark-500">TP</span>
                  <span className="font-mono text-green-400/80">${formatPrice(position.takeProfit)}</span>
                </div>
              </div>

              {/* P&L */}
              <motion.div
                key={`pnl-${posIndex}-${priceKeyRef.current}`}
                className="mt-3 -mx-4 px-4 py-3 border-t border-dark-700/50"
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: [
                  'rgba(0,0,0,0)',
                  isPositive ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  isPositive ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  'rgba(0,0,0,0)',
                ]}}
                transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs text-dark-400">P&L</span>
                  <span className={`font-mono text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : '-'}${Math.abs(livePnl.pnl).toFixed(2)}
                  </span>
                  <span className={`text-xs ${isPositive ? 'text-green-400/60' : 'text-red-400/60'}`}>
                    ({isPositive ? '+' : ''}{livePnl.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </motion.div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
