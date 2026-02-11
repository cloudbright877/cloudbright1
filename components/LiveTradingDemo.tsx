'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TradingBot } from '@/lib/trading/TradingBot';
import { priceService } from '@/lib/PriceService';
import { getAllDemoBots } from '@/lib/demoMarketplace';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const DEMO_BOT_ID = 'demo_services';

interface MappedPosition {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
  takeProfit: number;
  duration: string;
}

interface MappedTrade {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  pnl: number;
  pnlPercent: number;
  duration: string;
  closedAt: string;
}

function getRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'Just now';
}

function safe(v: number) { return isNaN(v) || !isFinite(v) ? 0 : v; }

/**
 * LiveTradingDemo — self-contained live trading widget.
 * Layout: bot header on top, then a 2-col grid (positions left, trades right).
 */
export function LiveTradingDemo() {
  const botRef = useRef<TradingBot | null>(null);
  const [positions, setPositions] = useState<MappedPosition[]>([]);
  const [trades, setTrades] = useState<MappedTrade[]>([]);
  const [stats, setStats] = useState({ totalPnL: 0, winRate: 0, tradesCount: 0, positionsCount: 0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const demoBots = getAllDemoBots();
    const demoBot = demoBots[0];
    if (!demoBot) return;

    const bot = new TradingBot(DEMO_BOT_ID, { ...demoBot.config, investedCapital: 5000 });
    botRef.current = bot;

    priceService.connect();
    setIsConnected(true);

    const unsubscribe = priceService.subscribe((prices) => { bot.tick(prices); });

    const interval = setInterval(() => {
      const s = bot.getStats();
      const now = Date.now();

      setPositions((s.positions || []).slice(0, 3).map((pos) => {
        const ms = now - pos.openedAt;
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        return {
          id: pos.id, pair: pos.pair, side: pos.side, leverage: pos.leverage,
          entryPrice: pos.entryPrice, currentPrice: pos.currentPrice,
          stopLoss: pos.stopLoss, takeProfit: pos.takeProfit,
          pnl: safe(pos.pnl), pnlPercent: safe(pos.pnlPercent),
          duration: h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec}s` : `${sec}s`,
        };
      }));

      setTrades(s.trades.slice(0, 3).map((t) => ({
        id: t.id, pair: t.pair, side: t.side, leverage: t.leverage,
        pnl: safe(t.pnl), pnlPercent: safe(t.pnlPercent),
        duration: t.duration, closedAt: t.closedAt,
      })));

      setStats({
        totalPnL: safe(s.totalPnL), winRate: safe(s.winRate),
        tradesCount: s.tradesCount, positionsCount: s.positions.length,
      });
    }, 1000);

    return () => { clearInterval(interval); unsubscribe(); };
  }, []);

  const demoBot = getAllDemoBots()[0];
  const pnlPositive = stats.totalPnL >= 0;

  return (
    <div className="flex flex-col gap-2">
      {/* ── Bot Header ── */}
      <div>
        <div className="rounded-xl bg-dark-800/95 border border-dark-700 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2">
            {demoBot && <img src={demoBot.icon} alt={demoBot.name} className="w-6 h-6 object-contain" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white">{demoBot?.name || 'Market Maker'}</span>
                <span className="text-[8px] px-1 py-px rounded-full border text-green-400 border-green-400/30 bg-green-400/10 font-semibold">Low</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
            <span className={`text-[11px] font-bold ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
              {pnlPositive ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-px bg-dark-700/30">
            {[
              { l: 'Invested', v: '$5,000' },
              { l: 'Win Rate', v: stats.tradesCount > 0 ? `${stats.winRate.toFixed(1)}%` : '—' },
              { l: 'Trades', v: `${stats.tradesCount}` },
              { l: 'Open', v: `${stats.positionsCount}` },
            ].map((s) => (
              <div key={s.l} className="bg-dark-900/60 px-2 py-1.5 text-center">
                <p className="text-[7px] text-dark-500 uppercase tracking-wider">{s.l}</p>
                <p className="text-[10px] font-bold text-white">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Positions + Trades grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
      {/* ── Live Positions (stretches to fill height) ── */}
      <div className="flex flex-col">
        <div className="rounded-xl bg-dark-800/95 border border-dark-700 p-2.5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3 text-primary-400" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Live Positions</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[8px] text-green-400 font-semibold">LIVE</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <AnimatePresence mode="popLayout">
              {positions.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 flex-1 flex items-center justify-center">
                  <p className="text-[9px] text-dark-500">Scanning markets...</p>
                </motion.div>
              ) : (
                positions.map((pos, i) => (
                  <motion.div
                    key={pos.id} layout
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-lg bg-dark-900/50 border border-dark-700/30 p-2 flex-1 flex flex-col justify-between"
                  >
                    {/* Row 1: pair, side/leverage, SL/TP */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className={`text-[8px] px-1 py-px rounded font-bold ${
                          pos.side === 'LONG' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                        }`}>{pos.side} ×{pos.leverage}</span>
                        <span className="text-[10px] font-bold text-white">{pos.pair}</span>
                        <span className="text-[8px] text-dark-500 flex items-center gap-0.5 ml-0.5">
                          <Clock className="w-2.5 h-2.5" />{pos.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px]">
                        <span className="text-red-400/70 font-mono">SL ${pos.stopLoss.toFixed(0)}</span>
                        <span className="text-green-400/70 font-mono">TP ${pos.takeProfit.toFixed(0)}</span>
                      </div>
                    </div>
                    {/* Row 2: Entry / Current */}
                    <div className="flex items-center justify-between mb-1 text-[9px]">
                      <span className="text-dark-500">Entry <span className="text-dark-300 font-mono font-medium">${pos.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
                      <div className="flex items-center gap-0.5">
                        {pos.pnl >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-green-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                        <span className="text-dark-200 font-mono font-medium">${pos.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    {/* Row 3: P&L bar */}
                    <motion.div
                      key={`pnl-${pos.id}-${pos.pnl}`}
                      className={`flex items-center justify-center gap-1.5 rounded px-2 py-1 border text-[9px] ${
                        pos.pnl >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                      }`}
                      initial={{ backgroundColor: 'rgba(31,41,55,0.5)' }}
                      animate={{ backgroundColor: [
                        'rgba(31,41,55,0.5)',
                        pos.pnl >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        pos.pnl >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        'rgba(31,41,55,0.5)',
                      ]}}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                    >
                      <span className="text-dark-500">P&L</span>
                      <span className={`font-mono font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </span>
                      <span className={pos.pnl >= 0 ? 'text-green-400/60' : 'text-red-400/60'}>
                        ({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)
                      </span>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Closed Trades ── */}
      <div>
        <div className="rounded-xl bg-dark-800/95 border border-dark-700 p-2.5 h-full">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="w-3 h-3 text-accent-400" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Recent Trades</span>
          </div>
          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {trades.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <p className="text-[9px] text-dark-500">Waiting for closes...</p>
                </motion.div>
              ) : (
                trades.map((t, i) => (
                  <motion.div
                    key={t.id} layout
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.03 }}
                    className={`rounded-lg border p-2 ${
                      t.pnl >= 0 ? 'bg-green-500/5 border-green-500/15' : 'bg-red-500/5 border-red-500/15'
                    }`}
                  >
                    {/* Row 1: icon, time */}
                    <div className="flex items-center gap-1.5 mb-1">
                      {t.pnl >= 0
                        ? <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center"><TrendingUp className="w-2.5 h-2.5 text-green-400" /></div>
                        : <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center"><TrendingDown className="w-2.5 h-2.5 text-red-400" /></div>
                      }
                      <span className="text-[8px] text-dark-400">{getRelativeTime(t.closedAt)}</span>
                    </div>
                    {/* Row 2: pair, side, duration */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-white">{t.pair}</span>
                      <span className={`text-[8px] px-1 py-px rounded font-bold ${
                        t.side === 'LONG' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>{t.side} ×{t.leverage}</span>
                      <span className="text-[8px] text-dark-500 flex items-center gap-0.5 ml-auto">
                        <Clock className="w-2.5 h-2.5" />{t.duration}
                      </span>
                    </div>
                    {/* Row 3: P&L */}
                    <div className="pt-1 border-t border-dark-700/30 flex items-center justify-between">
                      <span className="text-[8px] text-dark-500">P&L</span>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold font-mono ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {t.pnl >= 0 ? '+' : ''}${Math.abs(t.pnl).toFixed(2)}
                        </span>
                        <span className={`text-[8px] ml-1 ${t.pnl >= 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                          ({t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>{/* closes grid */}
    </div>
  );
}
