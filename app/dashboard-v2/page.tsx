'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BotSettingsModal } from '@/components/dashboard-v2/BotSettingsModal';
import { AddFundsModal } from '@/components/dashboard-v2/AddFundsModal';
import { ConfirmationModal } from '@/components/dashboard-v2/ConfirmationModal';
import { botManager } from '@/lib/BotManager';
import { priceService } from '@/lib/PriceService';
import { botsApi } from '@/lib/api/botsApi';
import { getUserCopy } from '@/lib/userCopies';
import type { BotStats } from '@/lib/trading/types';
import {
  Bot,
  TrendingUp,
  Activity,
  Plus,
  Settings,
  BarChart3,
  Users,
  Shield,
  Wallet,
  TrendingDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Zap,
  Target,
  Play,
  Pause,
  X,
  ArrowDownLeft,
  ArrowUpLeft,
  Trash2,
} from 'lucide-react';

interface ActiveBot {
  id: string;
  name: string;
  slug: string;
  risk: 'low' | 'medium' | 'high';
  invested: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  status: 'active' | 'paused';
  winRate: number;
  trades: number;
  todayPnL: number;
  lastTrade: string;
  openPositions: OpenPosition[];
  maxPositions?: number;
}

interface OpenPosition {
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
}

interface ClosedPosition {
  id: string;
  botName: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  amount: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  closedAt: string;
  closedAtTimestamp: number; // For sorting
  leverage: number;
  duration: string;
  positionSize: number;
}

// Icon mapping by risk level
const getBotIcon = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'low':
      return <Shield className="w-5 h-5 text-green-400" />;
    case 'medium':
      return <Zap className="w-5 h-5 text-blue-400" />;
    case 'high':
      return <Target className="w-5 h-5 text-red-400" />;
  }
};

// Format time ago (e.g., "2 min ago", "1 hr ago")
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Map BotStats to ActiveBot interface
const mapBotStatsToActiveBot = (stats: BotStats, config: any): ActiveBot => {
  // Determine risk level based on leverage or win rate
  let risk: 'low' | 'medium' | 'high' = 'medium';
  if (config.leverage <= 3) risk = 'low';
  else if (config.leverage >= 10) risk = 'high';

  // Calculate today's P&L (from trades in last 24h)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const todayPnL = stats.trades
    .filter(t => new Date(t.closedAt).getTime() > oneDayAgo)
    .reduce((sum, t) => sum + t.pnl, 0);

  // Map positions
  const openPositions: OpenPosition[] = stats.positions.map(pos => ({
    id: pos.id,
    pair: pos.pair,
    side: pos.side,
    amount: pos.amount,
    leverage: pos.leverage,
    entryPrice: pos.entryPrice,
    currentPrice: pos.currentPrice,
    pnl: pos.pnl,
    pnlPercent: pos.pnlPercent,
    stopLoss: pos.stopLoss,
    takeProfit: pos.takeProfit,
    openedAt: pos.duration,
  }));

  // Get last trade time
  const lastTrade = stats.trades[0]?.closedAt || 'No trades yet';

  return {
    id: stats.id,
    name: stats.name,
    slug: stats.id, // Use bot ID as slug
    risk,
    invested: config.investedCapital,
    currentValue: config.investedCapital + stats.totalPnL,
    profit: stats.totalPnL,
    profitPercent: config.investedCapital > 0 ? (stats.totalPnL / config.investedCapital) * 100 : 0,
    status: 'active', // TODO: Add status to BotConfig
    winRate: stats.winRate,
    trades: stats.tradesCount,
    todayPnL,
    lastTrade,
    openPositions,
  };
};

const mockActiveBots: ActiveBot[] = [
  {
    id: '1',
    name: 'Conservative Scalper',
    slug: 'alphabot',
    risk: 'low',
    invested: 1000,
    currentValue: 1042,
    profit: 42,
    profitPercent: 4.2,
    status: 'active',
    winRate: 68,
    trades: 24,
    todayPnL: 8.5,
    lastTrade: '5 min ago',
    openPositions: [
      { id: '1', pair: 'BTC/USDT', side: 'LONG', amount: 0.05, leverage: 3, entryPrice: 45230, currentPrice: 45480, pnl: 12.5, pnlPercent: 0.55, stopLoss: 44200, takeProfit: 46500, openedAt: '5 min ago' },
      { id: '2', pair: 'ETH/USDT', side: 'LONG', amount: 1.2, leverage: 2, entryPrice: 2341, currentPrice: 2355, pnl: 16.8, pnlPercent: 0.59, stopLoss: 2280, takeProfit: 2410, openedAt: '12 min ago' },
      { id: '3', pair: 'XRP/USDT', side: 'SHORT', amount: 200, leverage: 2, entryPrice: 0.52, currentPrice: 0.515, pnl: 10.0, pnlPercent: 0.96, stopLoss: 0.53, takeProfit: 0.50, openedAt: '18 min ago' },
      { id: '4', pair: 'ADA/USDT', side: 'LONG', amount: 150, leverage: 3, entryPrice: 0.38, currentPrice: 0.382, pnl: 3.0, pnlPercent: 0.52, stopLoss: 0.37, takeProfit: 0.39, openedAt: '25 min ago' },
      { id: '5', pair: 'DOGE/USDT', side: 'LONG', amount: 800, leverage: 2, entryPrice: 0.082, currentPrice: 0.0825, pnl: 4.0, pnlPercent: 0.61, stopLoss: 0.08, takeProfit: 0.085, openedAt: '32 min ago' },
      { id: '6', pair: 'MATIC/USDT', side: 'SHORT', amount: 100, leverage: 3, entryPrice: 0.85, currentPrice: 0.847, pnl: 3.0, pnlPercent: 0.35, stopLoss: 0.87, takeProfit: 0.82, openedAt: '40 min ago' },
      { id: '7', pair: 'DOT/USDT', side: 'LONG', amount: 20, leverage: 2, entryPrice: 5.2, currentPrice: 5.25, pnl: 10.0, pnlPercent: 0.96, stopLoss: 5.0, takeProfit: 5.4, openedAt: '48 min ago' },
      { id: '8', pair: 'LINK/USDT', side: 'LONG', amount: 12, leverage: 3, entryPrice: 14.5, currentPrice: 14.62, pnl: 14.4, pnlPercent: 0.82, stopLoss: 14.1, takeProfit: 15.0, openedAt: '55 min ago' },
      { id: '9', pair: 'UNI/USDT', side: 'SHORT', amount: 25, leverage: 2, entryPrice: 6.8, currentPrice: 6.75, pnl: 12.5, pnlPercent: 0.73, stopLoss: 7.0, takeProfit: 6.5, openedAt: '1 hr ago' },
      { id: '10', pair: 'ATOM/USDT', side: 'LONG', amount: 18, leverage: 2, entryPrice: 9.2, currentPrice: 9.28, pnl: 14.4, pnlPercent: 0.87, stopLoss: 8.9, takeProfit: 9.5, openedAt: '1.5 hr ago' },
    ],
  },
  {
    id: '2',
    name: 'Grid Trading Bot',
    slug: 'protrader',
    risk: 'medium',
    invested: 1500,
    currentValue: 1623,
    profit: 123,
    profitPercent: 8.2,
    status: 'active',
    winRate: 72,
    trades: 38,
    todayPnL: 12.3,
    lastTrade: '2 min ago',
    openPositions: [
      { id: '11', pair: 'BNB/USDT', side: 'SHORT', amount: 5, leverage: 5, entryPrice: 312, currentPrice: 310.5, pnl: 7.5, pnlPercent: 0.48, stopLoss: 318, takeProfit: 305, openedAt: '2 min ago' },
      { id: '12', pair: 'SOL/USDT', side: 'LONG', amount: 8, leverage: 3, entryPrice: 98, currentPrice: 99.2, pnl: 9.6, pnlPercent: 1.22, stopLoss: 95.5, takeProfit: 101, openedAt: '8 min ago' },
      { id: '13', pair: 'AVAX/USDT', side: 'LONG', amount: 15, leverage: 2, entryPrice: 35.2, currentPrice: 35.8, pnl: 9.0, pnlPercent: 1.7, stopLoss: 34.5, takeProfit: 36.2, openedAt: '15 min ago' },
      { id: '14', pair: 'LTC/USDT', side: 'LONG', amount: 3, leverage: 4, entryPrice: 72.5, currentPrice: 73.2, pnl: 21.0, pnlPercent: 0.96, stopLoss: 70.0, takeProfit: 75.0, openedAt: '22 min ago' },
      { id: '15', pair: 'BCH/USDT', side: 'SHORT', amount: 2, leverage: 3, entryPrice: 215, currentPrice: 213.5, pnl: 30.0, pnlPercent: 0.70, stopLoss: 220, takeProfit: 210, openedAt: '28 min ago' },
      { id: '16', pair: 'XLM/USDT', side: 'LONG', amount: 500, leverage: 2, entryPrice: 0.12, currentPrice: 0.121, pnl: 10.0, pnlPercent: 0.83, stopLoss: 0.116, takeProfit: 0.125, openedAt: '35 min ago' },
      { id: '17', pair: 'TRX/USDT', side: 'LONG', amount: 400, leverage: 3, entryPrice: 0.065, currentPrice: 0.0655, pnl: 20.0, pnlPercent: 0.77, stopLoss: 0.063, takeProfit: 0.068, openedAt: '42 min ago' },
      { id: '18', pair: 'ALGO/USDT', side: 'SHORT', amount: 80, leverage: 2, entryPrice: 0.18, currentPrice: 0.178, pnl: 16.0, pnlPercent: 1.11, stopLoss: 0.185, takeProfit: 0.172, openedAt: '50 min ago' },
      { id: '19', pair: 'FIL/USDT', side: 'LONG', amount: 12, leverage: 3, entryPrice: 4.2, currentPrice: 4.25, pnl: 15.0, pnlPercent: 1.19, stopLoss: 4.0, takeProfit: 4.4, openedAt: '58 min ago' },
      { id: '20', pair: 'NEAR/USDT', side: 'LONG', amount: 30, leverage: 2, entryPrice: 2.1, currentPrice: 2.12, pnl: 6.0, pnlPercent: 0.95, stopLoss: 2.0, takeProfit: 2.2, openedAt: '1.2 hr ago' },
    ],
  },
];

export default function DashboardPage() {
  const [settingsBotId, setSettingsBotId] = useState<string | null>(null);
  const [addFundsBot, setAddFundsBot] = useState<ActiveBot | null>(null);
  const [bots, setBots] = useState<ActiveBot[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation modals state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'pause' | 'resume' | 'remove';
    bot: ActiveBot;
  } | null>(null);

  // Load bots and connect to price service
  useEffect(() => {
    // Load bots from localStorage
    botManager.load();

    // Seed demo user copies (only if none exist)
    if (typeof window !== 'undefined') {
      import('@/lib/seedBots').then(({ seedUserCopies }) => {
        seedUserCopies();
      });
    }

    // Connect to Binance WebSocket
    priceService.connect();

    // Subscribe to price updates
    const unsubscribe = priceService.subscribe((prices) => {
      botManager.tick(prices);
    });

    setIsLoading(false);

    // Update UI every second
    const interval = setInterval(async () => {
      // Get user copies instead of test bots
      const userCopyStats = await botsApi.getUserCopies();
      const activeBots = userCopyStats.map(stats => {
        // Calculate today's P&L (trades in last 24h)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const rawTodayPnL = stats.trades
          .filter(t => new Date(t.closedAt).getTime() > oneDayAgo)
          .reduce((sum, t) => sum + (isNaN(t.pnl) || !isFinite(t.pnl) ? 0 : t.pnl), 0);
        const todayPnL = isNaN(rawTodayPnL) || !isFinite(rawTodayPnL) ? 0 : rawTodayPnL;

        // Get user copy record to get invested amount
        const copyRecord = getUserCopy(stats.id);
        const rawInvested = copyRecord?.investedAmount || 0;
        const invested = isNaN(rawInvested) || !isFinite(rawInvested) ? 0 : rawInvested;

        const safeTotalPnL = isNaN(stats.totalPnL) || !isFinite(stats.totalPnL) ? 0 : stats.totalPnL;
        const currentValue = invested + safeTotalPnL;
        const profitPercent = invested > 0 ? (safeTotalPnL / invested) * 100 : 0;

        // Map positions with real-time duration
        const now = Date.now();
        const openPositions = (stats.positions || []).map(pos => {
          const durationMs = now - pos.openedAt;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
          const duration = hours > 0 ? `${hours}h ${minutes}m` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

          // Validate P&L values
          const safePnl = isNaN(pos.pnl) || !isFinite(pos.pnl) ? 0 : pos.pnl;
          const safePnlPercent = isNaN(pos.pnlPercent) || !isFinite(pos.pnlPercent) ? 0 : pos.pnlPercent;

          return {
            id: pos.id,
            pair: pos.pair,
            side: pos.side,
            amount: pos.amount,
            leverage: pos.leverage,
            entryPrice: pos.entryPrice,
            currentPrice: pos.currentPrice,
            pnl: safePnl,
            pnlPercent: safePnlPercent,
            stopLoss: pos.stopLoss,
            takeProfit: pos.takeProfit,
            openedAt: duration,
          };
        });

        // Get last trade time
        const lastTrade = stats.trades[0]?.closedAt
          ? formatTimeAgo(new Date(stats.trades[0].closedAt))
          : 'No trades yet';

        // Determine risk level (low for now, can be enhanced)
        const risk: 'low' | 'medium' | 'high' = 'medium';

        // Validate profit values
        const safeProfit = isNaN(stats.totalPnL) || !isFinite(stats.totalPnL) ? 0 : stats.totalPnL;
        const safeProfitPercent = isNaN(profitPercent) || !isFinite(profitPercent) ? 0 : profitPercent;

        return {
          id: stats.id,
          name: stats.name,
          slug: stats.id,
          risk,
          invested,
          currentValue,
          profit: safeProfit,
          profitPercent: safeProfitPercent,
          status: 'active' as const,
          winRate: stats.winRate,
          trades: stats.tradesCount,
          todayPnL,
          lastTrade,
          openPositions,
        };
      });
      setBots(activeBots);

      // Get all closed trades from all user copies with original timestamp for sorting
      const allTrades = userCopyStats.flatMap(stats =>
        stats.trades.map(trade => {
          // Validate P&L values
          const safePnl = isNaN(trade.pnl) || !isFinite(trade.pnl) ? 0 : trade.pnl;
          const safePnlPercent = isNaN(trade.pnlPercent) || !isFinite(trade.pnlPercent) ? 0 : trade.pnlPercent;
          const safePositionSize = isNaN(trade.positionSize) || !isFinite(trade.positionSize) ? 0 : trade.positionSize;

          return {
            id: trade.id,
            botName: stats.name,
            pair: trade.pair,
            side: trade.side,
            amount: trade.amount,
            entryPrice: trade.entryPrice,
            exitPrice: trade.exitPrice,
            pnl: safePnl,
            pnlPercent: safePnlPercent,
            closedAt: formatTimeAgo(new Date(trade.closedAt)),
            closedAtTimestamp: new Date(trade.closedAt).getTime(), // For sorting
            leverage: trade.leverage,
            duration: trade.duration,
            positionSize: safePositionSize,
          };
        })
      );

      // Sort by closed time (newest first) and take first 10
      const sortedTrades = allTrades.sort((a, b) => b.closedAtTimestamp - a.closedAtTimestamp);
      setClosedPositions(sortedTrades.slice(0, 10));
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Calculate totals with NaN/Infinity protection
  const rawTotalInvested = bots.reduce((sum, bot) => sum + (bot.invested || 0), 0);
  const totalInvested = isNaN(rawTotalInvested) || !isFinite(rawTotalInvested) ? 0 : rawTotalInvested;

  const rawTotalValue = bots.reduce((sum, bot) => sum + (bot.currentValue || 0), 0);
  const totalValue = isNaN(rawTotalValue) || !isFinite(rawTotalValue) ? 0 : rawTotalValue;

  const rawTotalProfit = totalValue - totalInvested;
  const totalProfit = isNaN(rawTotalProfit) || !isFinite(rawTotalProfit) ? 0 : rawTotalProfit;

  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  // Available balance = 0 for now (no wallet functionality yet)
  const availableBalance = 0;
  const activeBots = bots.filter(bot => bot.status === 'active').length;
  const todayPnL = bots.reduce((sum, bot) => sum + bot.todayPnL, 0);
  const totalOpenPositions = bots.reduce((sum, bot) => sum + bot.openPositions.length, 0);

  // Mock actions - will be replaced with API calls
  const handleTogglePause = (botId: string) => {
    // TODO: Backend API call
    // await fetch(`/api/bots/${botId}/toggle-pause`, { method: 'POST' });

    setBots(bots.map(bot =>
      bot.id === botId
        ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' }
        : bot
    ));

    const bot = bots.find(b => b.id === botId);
    console.log(`[MOCK] ${bot?.status === 'active' ? 'Pausing' : 'Resuming'} bot ${botId}`);
  };

  const handleRemoveBot = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    // Close all positions and return funds to available balance
    const returnedAmount = bot.currentValue; // invested + profit/loss
    console.log(`Removing bot ${botId}, returning $${returnedAmount} to available balance`);
    console.log(`Closed ${bot.openPositions.length} positions`);

    // Delete bot from BotManager (also clears localStorage)
    botManager.deleteBot(botId);

    // Update UI immediately
    const allStats = botManager.getAllStats();
    const activeBots = allStats.map(stats => {
      const botInstance = botManager.getBot(stats.id);
      const config = botInstance?.getConfig();
      return mapBotStatsToActiveBot(stats, config);
    });
    setBots(activeBots);
  };

  const handleAddFunds = (botId: string, amount: number) => {
    const botInstance = botManager.getBot(botId);
    if (!botInstance) return;

    const currentConfig = botInstance.getConfig();

    // Update invested capital
    botInstance.updateConfig({
      investedCapital: currentConfig.investedCapital + amount,
    });

    console.log(`Added $${amount} to bot ${botId}. New capital: $${currentConfig.investedCapital + amount}`);

    // Update UI immediately
    const allStats = botManager.getAllStats();
    const activeBots = allStats.map(stats => {
      const bot = botManager.getBot(stats.id);
      const config = bot?.getConfig();
      return mapBotStatsToActiveBot(stats, config);
    });
    setBots(activeBots);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-dark-400">Manage your automated trading portfolio</p>
          </div>

          <Link href="/dashboard-v2/bots" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Bot
            </div>
          </Link>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Hero Stats - Left Side (Tall) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 lg:row-span-2"
          >
            <div className="relative h-full overflow-hidden bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 rounded-2xl p-6">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-50" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-xl">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-400 font-medium">Total Portfolio</p>
                    <p className="text-xs text-dark-500">All your investments</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-5xl lg:text-6xl font-bold text-white mb-2">
                    ${totalValue.toFixed(2)}
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
                      <p className="text-xs text-dark-400 mb-1">Invested</p>
                      <p className="text-xl font-bold text-white">${totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-12 bg-dark-700" />
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Available</p>
                      <p className="text-xl font-bold text-green-400">${availableBalance.toLocaleString()}</p>
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

                  {/* Deposit/Withdraw Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl font-semibold text-green-400 hover:text-green-300 transition-all flex items-center justify-center gap-2">
                      <ArrowDownLeft className="w-4 h-4" />
                      Deposit
                    </button>
                    <button className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 rounded-xl font-semibold text-dark-300 hover:text-white transition-all flex items-center justify-center gap-2">
                      <ArrowUpLeft className="w-4 h-4" />
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats - Top Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5 hover:border-green-500/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 font-medium mb-1">Active Bots</p>
                    <p className="text-3xl font-bold text-white">{activeBots}</p>
                    <p className="text-xs text-green-400 mt-1">
                      {bots.reduce((sum, bot) => sum + bot.trades, 0)} total trades
                    </p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5 hover:border-yellow-500/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 font-medium mb-1">Avg Win Rate</p>
                    <p className="text-3xl font-bold text-white">
                      {bots.length > 0 ? Math.round(bots.reduce((sum, bot) => sum + bot.winRate, 0) / bots.length) : 0}%
                    </p>
                    <p className="text-xs text-yellow-400 mt-1">Across all bots</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Closed Positions History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Recent Closed Positions</h3>
                    <p className="text-xs text-dark-400">Latest completed trades</p>
                  </div>
                </div>
                <Link href="/dashboard-v2/history" className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                  View All
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left text-xs font-semibold text-dark-400 pt-3 pb-3 pr-4 pl-3">Bot</th>
                      <th className="text-left text-xs font-semibold text-dark-400 pt-3 pb-3 px-4">Pair</th>
                      <th className="text-center text-xs font-semibold text-dark-400 pt-3 pb-3 px-4">Side</th>
                      <th className="text-center text-xs font-semibold text-dark-400 pt-3 pb-3 px-4">P&L</th>
                      <th className="text-center text-xs font-semibold text-dark-400 pt-3 pb-3 px-4">Position Size</th>
                      <th className="text-left text-xs font-semibold text-dark-400 pt-3 pb-3 px-4">Duration</th>
                      <th className="text-left text-xs font-semibold text-dark-400 pt-3 pb-3 pl-4">Closed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedPositions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-dark-400">
                          <div className="flex flex-col items-center gap-2">
                            <Activity className="w-8 h-8 opacity-50" />
                            <p className="text-sm">No closed positions yet</p>
                            <p className="text-xs">Start trading to see your history here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      closedPositions.slice(0, 3).map((position) => (
                        <tr key={position.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                          <td className="py-4 pr-4 pl-3">
                            <span className="text-xs text-dark-400">{position.botName}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-semibold text-white">{position.pair}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                              position.side === 'LONG'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {position.side === 'LONG' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {position.side}×{position.leverage}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className={`text-sm font-bold ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                            </div>
                            <div className={`text-xs ${
                              position.pnl >= 0 ? 'text-green-400/70' : 'text-red-400/70'
                            }`}>
                              ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-dark-300">
                            ${position.positionSize.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4 text-left text-sm text-dark-300">
                            {position.duration}
                          </td>
                          <td className="py-4 pl-4 text-left text-sm text-dark-400">
                            {position.closedAt}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Active Bots - Full Width */}
          {bots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="lg:col-span-6"
            >
              <div className="h-full relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/50 rounded-2xl overflow-hidden transition-all group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/20 group-hover:to-accent-500/20 blur-xl transition-all duration-500" />

                <div className="relative p-5 h-full flex flex-col">
                  {/* Bot Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl flex items-center justify-center border border-dark-700 shadow-lg">
                        {getBotIcon(bot.risk)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{bot.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="text-dark-400">{bot.trades} trades</span>
                          <span className="text-dark-400">•</span>
                          <span className="text-dark-400">{bot.openPositions.length} open</span>
                          {bot.status === 'active' && (
                            <>
                              <span className="text-dark-400">•</span>
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="font-medium text-green-400">Live</span>
                              </div>
                            </>
                          )}
                          <span className="text-dark-400">•</span>
                          <div className={`px-2 py-0.5 rounded font-medium ${
                            bot.risk === 'low'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : bot.risk === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {bot.risk === 'low' ? 'Low Risk' : bot.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSettingsBotId(bot.id)}
                        className="p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 transition-all"
                      >
                        <Settings className="w-4 h-4 text-dark-400 hover:text-primary-400 transition-colors" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({
                          type: bot.status === 'active' ? 'pause' : 'resume',
                          bot
                        })}
                        className={`p-2 rounded-lg border transition-all ${
                          bot.status === 'active'
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                            : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400'
                        }`}
                      >
                        {bot.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'remove', bot })}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                      <p className="text-xs text-dark-400 mb-1">Invested</p>
                      <p className="text-base font-bold text-white">${bot.invested.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                      <p className="text-xs text-dark-400 mb-1">Value</p>
                      <p className="text-base font-bold text-white">${bot.currentValue.toFixed(2)}</p>
                    </div>
                    <div className={`p-3 bg-gradient-to-br rounded-lg border ${
                      bot.profit >= 0
                        ? 'from-green-500/10 to-emerald-500/5 border-green-500/20'
                        : 'from-red-500/10 to-rose-500/5 border-red-500/20'
                    }`}>
                      <p className={`text-xs mb-1 ${bot.profit >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>Profit</p>
                      <p className={`text-base font-bold ${bot.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.profit >= 0 ? '+' : ''}${bot.profit.toFixed(2)}
                      </p>
                      <p className={`text-xs ${bot.profit >= 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                        {bot.profitPercent >= 0 ? '+' : ''}{bot.profitPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    <Link
                      href={`/dashboard-v2/copy/${bot.id}`}
                      className="flex-1 px-4 py-2.5 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 hover:border-primary-500/50 rounded-lg font-medium text-primary-400 hover:text-primary-300 transition-all text-center text-sm flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Details
                    </Link>
                    <button
                      onClick={() => setAddFundsBot(bot)}
                      className="px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg font-medium text-green-400 hover:text-green-300 transition-all text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Funds
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 lg:col-span-6"
          >
            <Link
              href="/dashboard-v2/leaderboard"
              className="block h-full p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 hover:border-blue-500/50 rounded-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-1">Copy Investor Strategies</p>
                    <p className="text-sm text-dark-400">Join the community of successful investors</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="col-span-12 lg:col-span-6"
          >
            <Link
              href="/dashboard-v2/analytics"
              className="block h-full p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-1">Analytics</p>
                    <p className="text-sm text-dark-400">Deep dive into your performance</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsBotId && (() => {
        const botInstance = botManager.getBot(settingsBotId);
        return botInstance ? (
          <BotSettingsModal
            isOpen={true}
            onClose={() => setSettingsBotId(null)}
            bot={botInstance}
          />
        ) : null;
      })()}

      {/* Add Funds Modal */}
      {addFundsBot && (
        <AddFundsModal
          isOpen={!!addFundsBot}
          onClose={() => setAddFundsBot(null)}
          bot={addFundsBot}
          availableBalance={availableBalance}
          onAddFunds={(amount) => {
            handleAddFunds(addFundsBot.id, amount);
            setAddFundsBot(null);
          }}
        />
      )}

      {/* Confirmation Modals */}
      {confirmAction?.type === 'pause' && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleTogglePause(confirmAction.bot.id)}
          title={`Pause ${confirmAction.bot.name}?`}
          description="The bot will stop opening new positions"
          icon={<Pause className="w-5 h-5 text-yellow-400" />}
          bulletPoints={[
            'Current open positions will remain active',
            'Positions will still be managed by bot (SL/TP)',
            'You can resume trading anytime',
            'Your invested funds stay in the bot'
          ]}
          confirmText="Pause Bot"
          confirmButtonClass="from-yellow-500 to-orange-500"
        />
      )}

      {confirmAction?.type === 'resume' && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleTogglePause(confirmAction.bot.id)}
          title={`Resume ${confirmAction.bot.name}?`}
          description="The bot will continue trading"
          icon={<Play className="w-5 h-5 text-green-400" />}
          bulletPoints={[
            'Bot will start opening new positions',
            'Uses your current settings (SL/TP)',
            `Invested funds: $${confirmAction.bot.invested.toLocaleString('en-US')}`
          ]}
          confirmText="Resume Bot"
          confirmButtonClass="from-green-500 to-emerald-500"
        />
      )}

      {confirmAction?.type === 'remove' && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleRemoveBot(confirmAction.bot.id)}
          title={`Remove ${confirmAction.bot.name}?`}
          description="This will permanently stop the bot"
          icon={<Trash2 className="w-5 h-5 text-red-400" />}
          bulletPoints={[
            `All open positions (${confirmAction.bot.openPositions.length}) will be closed immediately`,
            `Your invested $${confirmAction.bot.invested.toLocaleString('en-US')} + P&L ($${confirmAction.bot.profit.toLocaleString('en-US')}) will return to Available`,
            `Total returned: $${confirmAction.bot.currentValue.toLocaleString('en-US')}`,
            'Bot will be removed from your dashboard'
          ]}
          confirmText="Remove Bot"
          confirmButtonClass="from-red-500 to-orange-500"
          isDangerous={true}
        />
      )}
    </div>
  );
}
