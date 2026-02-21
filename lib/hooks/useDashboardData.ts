import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { botManager } from '@/lib/BotManager';
import { priceService } from '@/lib/PriceService';
import { botsApi } from '@/lib/api/botsApi';
import { getUserCopy } from '@/lib/userCopies';
import { getUserCopyPnLBreakdown } from '@/lib/userCopyStats';
import { isLockedIn } from '@/lib/capitalReservation';
import { getBalance } from '@/lib/balances';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { getDemoBotById } from '@/lib/demoMarketplace';
import { safeNumber, timeAgo } from '@/lib/formatters';

// Interfaces
export interface OpenPosition {
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

export interface ActiveBot {
  id: string;
  name: string;
  slug: string;
  icon: string;
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
  totalAutoCredited: number;
  totalRealizedPnL: number;
  lockedIn: boolean;
}

export interface ClosedPosition {
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

export const useDashboardData = () => {
  const [bots, setBots] = useState<ActiveBot[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [addFundsBot, setAddFundsBot] = useState<ActiveBot | null>(null);
  const prevBotsHashRef = useRef('');
  const prevTradesHashRef = useRef('');

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

    // Load available balance
    const userId = getCurrentUserId();
    if (userId) {
      getBalance(userId).then((b) => setAvailableBalance(b.available));
    }

    // Update UI every second
    const interval = setInterval(async () => {
      // Get user copies instead of test bots
      const userCopyStats = await botsApi.getUserCopies();
      const activeBots = userCopyStats.map(stats => {
        // Calculate today's P&L (trades in last 24h)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const rawTodayPnL = stats.trades
          .filter(t => new Date(t.closedAt).getTime() > oneDayAgo)
          .reduce((sum, t) => sum + safeNumber(t.pnl), 0);
        const todayPnL = safeNumber(rawTodayPnL);

        // Get user copy record to get invested amount and bot data
        const copyRecord = getUserCopy(stats.id);
        const invested = safeNumber(copyRecord?.investedAmount || 0);

        // Get bot icon from DEMO_BOTS
        const masterBot = getDemoBotById(copyRecord?.masterBotId || stats.id);
        const botIcon = masterBot?.icon || '';

        const safeTotalPnL = safeNumber(stats.totalPnL);
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

          return {
            id: pos.id,
            pair: pos.pair,
            side: pos.side,
            amount: pos.amount,
            leverage: pos.leverage,
            entryPrice: pos.entryPrice,
            currentPrice: pos.currentPrice,
            pnl: safeNumber(pos.pnl),
            pnlPercent: safeNumber(pos.pnlPercent),
            stopLoss: pos.stopLoss,
            takeProfit: pos.takeProfit,
            openedAt: duration,
          };
        });

        // Get last trade time
        const lastTrade = stats.trades[0]?.closedAt
          ? timeAgo(new Date(stats.trades[0].closedAt).getTime())
          : 'No trades yet';

        // Determine risk level (low for now, can be enhanced)
        const risk: 'low' | 'medium' | 'high' = 'medium';

        // Get P&L breakdown
        const pnlBreakdown = getUserCopyPnLBreakdown(stats.id);

        // Check lock-in status
        const copyRec = getUserCopy(stats.id);
        const locked = copyRec ? isLockedIn(copyRec.createdAt, copyRec.reservationDays) : true;

        return {
          id: stats.id,
          name: stats.name,
          slug: stats.id,
          icon: botIcon,
          risk,
          invested,
          currentValue: pnlBreakdown?.currentValue ?? currentValue,
          profit: safeNumber(stats.totalPnL),
          profitPercent: safeNumber(profitPercent),
          status: 'active' as const,
          winRate: stats.winRate,
          trades: stats.tradesCount,
          todayPnL,
          lastTrade,
          openPositions,
          totalAutoCredited: pnlBreakdown?.totalAutoCredited ?? 0,
          totalRealizedPnL: pnlBreakdown?.realizedPnL ?? 0,
          lockedIn: locked,
        };
      });
      // Only update state if data actually changed (prevents unnecessary re-renders)
      const botsHash = activeBots.map(b => `${b.id}:${b.currentValue}:${b.profit}:${b.openPositions.length}`).join('|');
      if (botsHash !== prevBotsHashRef.current) {
        prevBotsHashRef.current = botsHash;
        setBots(activeBots);
      }

      // Get all closed trades from all user copies with original timestamp for sorting
      const allTrades = userCopyStats.flatMap(stats =>
        stats.trades.map(trade => ({
          id: trade.id,
          botName: stats.name,
          pair: trade.pair,
          side: trade.side,
          amount: trade.amount,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          pnl: safeNumber(trade.pnl),
          pnlPercent: safeNumber(trade.pnlPercent),
          closedAt: new Date(trade.closedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          closedAtTimestamp: new Date(trade.closedAt).getTime(),
          leverage: trade.leverage,
          duration: trade.duration,
          positionSize: safeNumber(trade.positionSize),
        }))
      );

      // Sort by closed time (newest first) and take first 10
      const sortedTrades = allTrades.sort((a, b) => b.closedAtTimestamp - a.closedAtTimestamp);
      const top10 = sortedTrades.slice(0, 10);
      const tradesHash = top10.map(t => t.id).join('|');
      if (tradesHash !== prevTradesHashRef.current) {
        prevTradesHashRef.current = tradesHash;
        setClosedPositions(top10);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Calculate totals with NaN/Infinity protection using useMemo
  const {
    totalInvested,
    totalValue,
    totalProfit,
    totalProfitPercent,
    activeBotCount,
    todayPnL,
    unrealizedPnL,
    totalRealizedPnL,
    totalTrades,
  } = useMemo(() => {
    const invested = bots.reduce((sum, bot) => sum + (bot.invested || 0), 0);
    const value = bots.reduce((sum, bot) => sum + (bot.currentValue || 0), 0);
    const profit = value - invested;
    const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
    const activeCount = bots.filter(bot => bot.status === 'active').length;
    const pnlToday = bots.reduce((sum, bot) => sum + bot.todayPnL, 0);
    const unrealizedPnl = bots.reduce((sum, bot) => sum + bot.openPositions.reduce((s, p) => s + p.pnl, 0), 0);
    const realizedPnL = bots.reduce((sum, bot) => sum + (bot.totalRealizedPnL || 0), 0);
    const trades = bots.reduce((sum, bot) => sum + bot.trades, 0);

    return {
      totalInvested: safeNumber(invested),
      totalValue: safeNumber(value),
      totalProfit: safeNumber(profit),
      totalProfitPercent: safeNumber(profitPercent),
      activeBotCount: activeCount,
      todayPnL: safeNumber(pnlToday),
      unrealizedPnL: safeNumber(unrealizedPnl),
      totalRealizedPnL: safeNumber(realizedPnL),
      totalTrades: trades,
    };
  }, [bots]);

  const handleRemoveBot = useCallback((botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    botManager.deleteBot(botId);
    setBots(prevBots => prevBots.filter(b => b.id !== botId));
  }, [bots]);

  const handleAddFunds = useCallback((botId: string, amount: number) => {
    const botInstance = botManager.getBot(botId);
    if (!botInstance) return;

    const currentConfig = botInstance.getConfig();
    botInstance.updateConfig({
      investedCapital: currentConfig.investedCapital + amount,
    });
  }, []);

  return {
    bots,
    closedPositions,
    isLoading,
    availableBalance,
    totalInvested,
    totalValue,
    totalProfit,
    totalProfitPercent,
    activeBotCount,
    todayPnL,
    unrealizedPnL,
    totalRealizedPnL,
    totalTrades,
    handleRemoveBot,
    handleAddFunds,
    addFundsBot,
    setAddFundsBot,
  };
};
