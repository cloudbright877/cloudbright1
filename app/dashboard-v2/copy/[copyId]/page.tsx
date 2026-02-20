'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { botsApi } from '@/lib/api/botsApi';
import { getUserCopy, updateUserCopy } from '@/lib/userCopies';
import { getUserCopyPnLBreakdown, type PnLBreakdown } from '@/lib/userCopyStats';
import { isLockedIn, getDaysRemainingInReservation } from '@/lib/capitalReservation';
import { getDemoBotById } from '@/lib/demoMarketplace';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  DollarSign,
  Target,
  Clock,
  Award,
  AlertTriangle,
  Zap,
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Calendar,
  TrendingUpDown,
  Copy,
  ExternalLink,
  X as CloseIcon,
  Archive,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import type {
  BotDetails,
  BotStats,
  Trade,
  EquityPoint
} from '@/types/api';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ============================================================================
// V2 Live Position Types
// ============================================================================

export interface LivePosition {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  previousPrice?: number; // Previous price to detect direction
  priceDirection?: 'up' | 'down'; // Price movement direction (not trade direction!)
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  amount: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  duration: string;
  type: 'short_live' | 'instant';
  shouldWin: boolean;  // Pre-determined outcome based on win rate
  targetPnL: number;   // Target P&L percent
  stopLossPnL: number; // Stop loss P&L percent
  openMomentum?: { direction: 'up' | 'down' | 'flat'; change: number }; // Momentum at open
}

export default function UserCopyPage() {
  const params = useParams();
  const router = useRouter();
  const copyId = params.copyId as string;

  // State management
  const [botDetails, setBotDetails] = useState<BotDetails | null>(null);
  const [botStats, setBotStats] = useState<BotStats | null>(null);
  const [livePositions, setLivePositions] = useState<LivePosition[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [equityData, setEquityData] = useState<EquityPoint[]>([]);

  // User Copy specific state
  const [masterBotName, setMasterBotName] = useState<string>('');
  const [masterBotId, setMasterBotId] = useState<string>('');
  const [masterBotSlug, setMasterBotSlug] = useState<string>('');
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // P&L Breakdown (from central formula)
  const [pnlBreakdown, setPnlBreakdown] = useState<PnLBreakdown | null>(null);

  // Settings dialog state
  const [showSettings, setShowSettings] = useState(false);
  const [compoundingPercent, setCompoundingPercent] = useState(0);
  const [autocloseAfterLockIn, setAutocloseAfterLockIn] = useState(false);

  // Lock-in state
  const [lockedIn, setLockedIn] = useState(true);
  const [lockInDaysRemaining, setLockInDaysRemaining] = useState(0);

  // Note: PriceService subscription is handled globally in Dashboard page
  // to avoid duplicate ticks when multiple pages are open

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPair, setFilterPair] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'wins' | 'losses'>('all');
  const itemsPerPage = 10;

  // Equity Curve period filter
  const [equityPeriod, setEquityPeriod] = useState<'all' | 'day' | 'week' | 'month'>('all');

  // Expanded trades for accordion
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  const toggleTradeExpanded = (tradeId: string) => {
    setExpandedTrades(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tradeId)) {
        newSet.delete(tradeId);
      } else {
        newSet.add(tradeId);
      }
      return newSet;
    });
  };

  // 🔗 Load copy info
  useEffect(() => {
    const loadCopy = async () => {
      try {
        setLoading(true);

        // Get copy info
        const copyInfo = getUserCopy(copyId);
        if (!copyInfo) {
          console.error(`Copy ${copyId} not found`);
          setLoading(false);
          return;
        }

        setMasterBotId(copyInfo.masterBotId);
        setInvestedAmount(copyInfo.investedAmount);

        // Load lock-in status
        const locked = isLockedIn(copyInfo.createdAt, copyInfo.reservationDays);
        setLockedIn(locked);
        setLockInDaysRemaining(getDaysRemainingInReservation(copyInfo.createdAt, copyInfo.reservationDays));

        // Load settings
        setCompoundingPercent(copyInfo.compoundingPercent ?? 0);
        setAutocloseAfterLockIn(copyInfo.autocloseAfterLockIn ?? false);

        // Get master bot info
        const masterBot = await botsApi.getMasterBot(copyInfo.masterBotId);
        if (masterBot) {
          setMasterBotName(masterBot.name);
          setMasterBotSlug(masterBot.slug);
        }

        console.log(`[UserCopy] Loaded copy ${copyId} of ${copyInfo.masterBotId}`);
      } catch (err) {
        console.error('[UserCopy] Error loading copy:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCopy();
  }, [copyId]);

  // 🔄 Update copy stats every second from botsApi
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(async () => {
      const stats = await botsApi.getUserCopy(copyId);
      if (!stats) return;

      // Convert BotManager data to UI format
      const convertedPositions: LivePosition[] = stats.positions.map((pos: any) => ({
        id: pos.id,
        pair: pos.pair,
        side: pos.side,
        leverage: pos.leverage,
        entryPrice: pos.entryPrice,
        currentPrice: pos.currentPrice,
        pnl: pos.pnl,
        pnlPercent: pos.pnlPercent,
        positionSize: pos.positionSize,
        amount: pos.amount,
        stopLoss: pos.stopLoss || 0,
        takeProfit: pos.takeProfit || 0,
        openedAt: pos.openedAt,
        duration: formatDuration(Date.now() - pos.openedAt),
        type: 'short_live' as const,
        shouldWin: true,
        targetPnL: 0,
        stopLossPnL: 0,
      }));

      const convertedTrades: Trade[] = stats.trades.slice(0, 50).map((trade: any) => {
        // Calculate realistic metrics if not present
        const feeRate = 0.04;
        const posSize = trade.positionSize || 0;
        const openFee = trade.openFee ?? (posSize * feeRate / 100);
        const closeFee = trade.closeFee ?? (posSize * feeRate / 100);
        const totalFees = trade.totalFees ?? (openFee + closeFee);
        const netPnl = trade.netPnl ?? (trade.pnl - totalFees);
        const slippage = trade.slippage ?? 0;

        return {
          id: trade.id,
          botName: stats.name || 'User Copy',
          pair: trade.pair,
          side: trade.side,
          leverage: trade.leverage,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          amount: trade.amount,
          positionSize: trade.positionSize,
          pnl: trade.pnl,
          pnlPercent: trade.pnlPercent,
          duration: trade.duration || '0s',
          closedAt: trade.closedAt,

          // Realistic Trading Metrics
          openFee,
          closeFee,
          totalFees,
          netPnl,
          slippage,

          // Internal System Fields (optional)
          expectedOutcome: trade.expectedOutcome || (trade.pnl >= 0 ? 'WIN' : 'LOSS'),
          actualOutcome: trade.actualOutcome || (trade.pnl >= 0 ? 'WIN' : 'LOSS'),
          hadSlippage: trade.hadSlippage || false,
          slippageAmount: trade.slippageAmount,
          convergenceLayer: trade.convergenceLayer,
          favorabilityScore: trade.favorabilityScore,
          technicalIndicators: trade.technicalIndicators,
        };
      });

      setLivePositions(convertedPositions);
      setTradeHistory(convertedTrades);

      // Update P&L breakdown from central formula
      const breakdown = getUserCopyPnLBreakdown(copyId);
      if (breakdown) setPnlBreakdown(breakdown);

      // Calculate derived values
      const currentValue = investedAmount + stats.totalPnL;
      const profitPercent = investedAmount > 0
        ? (stats.totalPnL / investedAmount) * 100
        : 0;

      // Calculate Today's P&L (last 24 hours)
      const now = Date.now();
      const last24h = now - (24 * 60 * 60 * 1000);
      const todayTrades = stats.trades.filter(trade => {
        const closedAt = new Date(trade.closedAt).getTime();
        return closedAt >= last24h;
      });
      const todayPnL = todayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const todayPnLPercent = investedAmount > 0
        ? (todayPnL / investedAmount) * 100
        : 0;

      // Build Equity Curve from trade history (each trade = point)
      if (stats.trades.length > 0) {
        // Sort trades by closedAt (oldest first)
        const sortedTrades = [...stats.trades].sort((a, b) =>
          new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime()
        );

        // Build equity curve with point after each trade
        const equityPoints: EquityPoint[] = [];
        const startValue = investedAmount;

        // Add starting point BEFORE first trade (no empty space on left)
        const firstTradeTime = new Date(sortedTrades[0].closedAt).getTime();
        equityPoints.push({
          timestamp: firstTradeTime - 60000, // 1 min before first trade
          value: startValue,
        });

        // Add point after each trade (cumulative P&L)
        let cumulativePnL = 0;
        sortedTrades.forEach(trade => {
          cumulativePnL += trade.pnl;
          equityPoints.push({
            timestamp: new Date(trade.closedAt).getTime(),
            value: startValue + cumulativePnL,
          });
        });

        // Add current point (includes open positions) only if different from last point
        const lastPoint = equityPoints[equityPoints.length - 1];
        const now = Date.now();
        if (!lastPoint || now - lastPoint.timestamp > 1000) { // At least 1 second difference
          equityPoints.push({
            timestamp: now,
            value: currentValue, // investedCapital + totalPnL (includes open positions)
          });
        }

        // Filter out invalid values
        const validPoints = equityPoints.filter(p =>
          !isNaN(p.value) &&
          isFinite(p.value) &&
          p.value > 0
        );

        console.log('📊 Equity Curve Data:', {
          totalPoints: validPoints.length,
          points: validPoints.map(p => ({
            time: new Date(p.timestamp).toISOString(),
            value: p.value.toFixed(2)
          }))
        });

        setEquityData(validPoints);
      } else {
        // No trades yet, but might have open positions
        setEquityData([{
          timestamp: Date.now(),
          value: currentValue, // Use current value (includes open positions)
        }]);
      }

      // Determine risk level from average leverage
      const avgLeverage = stats.trades.length > 0
        ? stats.trades.reduce((sum, t) => sum + t.leverage, 0) / stats.trades.length
        : 5;
      let risk: 'low' | 'medium' | 'high';
      if (avgLeverage <= 3) risk = 'low';
      else if (avgLeverage <= 10) risk = 'medium';
      else risk = 'high';

      // Calculate running days (estimate from first trade or default to 7 days)
      const firstTradeTime = stats.trades.length > 0
        ? new Date(stats.trades[stats.trades.length - 1].closedAt).getTime()
        : Date.now() - (7 * 24 * 60 * 60 * 1000);
      const runningDays = Math.floor((Date.now() - firstTradeTime) / (1000 * 60 * 60 * 24));
      const runningSince = new Date(firstTradeTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Get trading pairs from trades
      const uniquePairs = Array.from(new Set(stats.trades.map(t => t.pair)));

      // Get bot icon from DEMO_BOTS using masterBotId
      const copyInfo = getUserCopy(copyId);
      const masterBot = copyInfo ? getDemoBotById(copyInfo.masterBotId) : null;
      const botIcon = masterBot?.icon;

      // Update bot details from stats
      setBotDetails({
        id: copyId,
        name: stats.name || 'User Copy',
        slug: copyId,
        icon: botIcon,
        status: 'active',
        strategy: '',
        risk,
        invested: investedAmount,
        currentValue,
        profit: stats.totalPnL,
        profitPercent,
        todayPnL,
        todayPnLPercent,
        tradingPairs: uniquePairs.length > 0 ? uniquePairs : ['BTC/USDT'],
        maxPositions: 10,
        activePositions: stats.positions.length,
        runningSince,
        runningDays,
      });

      // Calculate additional statistics
      const trades = stats.trades;

      // Average Hold Time
      let averageHoldTime = '0h';
      if (trades.length > 0) {
        const totalDurationMs = trades.reduce((sum, trade) => {
          const [value, unit] = trade.duration.split(/([a-z]+)/i).filter(Boolean);
          const numValue = parseFloat(value);
          let ms = 0;
          if (unit === 'h') ms = numValue * 60 * 60 * 1000;
          else if (unit === 'm') ms = numValue * 60 * 1000;
          else if (unit === 's') ms = numValue * 1000;
          return sum + ms;
        }, 0);
        const avgMs = totalDurationMs / trades.length;
        const avgHours = avgMs / (60 * 60 * 1000);
        const avgMinutes = avgMs / (60 * 1000);
        if (avgHours >= 1) averageHoldTime = `${avgHours.toFixed(1)}h`;
        else if (avgMinutes >= 1) averageHoldTime = `${avgMinutes.toFixed(0)}m`;
        else averageHoldTime = `${(avgMs / 1000).toFixed(0)}s`;
      }

      // Profit Factor (total wins / total losses)
      const totalWins = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
      const totalLosses = Math.abs(trades.filter(t => t.pnl <= 0).reduce((sum, t) => sum + t.pnl, 0));
      const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

      // Total Volume (sum of all position sizes)
      const totalVolume = trades.reduce((sum, t) => sum + t.positionSize, 0);

      // Best/Worst Trade
      const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
      const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0;

      // Best Win Streak (consecutive wins)
      let currentStreak = 0;
      let bestStreak = 0;
      trades.forEach(trade => {
        if (trade.pnl > 0) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      // Max Drawdown (from equity curve)
      let maxDrawdown = 0;
      if (trades.length > 0) {
        let peak = investedAmount;
        let cumulativePnL = 0;
        trades.forEach(trade => {
          cumulativePnL += trade.pnl;
          const currentValue = investedAmount + cumulativePnL;
          peak = Math.max(peak, currentValue);
          const drawdown = ((currentValue - peak) / peak) * 100;
          maxDrawdown = Math.min(maxDrawdown, drawdown);
        });
      }

      setBotStats({
        totalTrades: stats.tradesCount,
        winningTrades: stats.winsCount,
        losingTrades: stats.lossesCount,
        winRate: stats.winRate,
        averageWin: stats.avgWin,
        averageLoss: stats.avgLoss,
        profitFactor,
        sharpeRatio: 0, // TODO: Calculate actual sharpe ratio
        maxDrawdown,
        totalVolume,
        averageHoldTime,
        bestTrade,
        worstTrade,
        winStreak: bestStreak,
        recoveryFactor: 0, // TODO: Calculate recovery factor
        avgTradeSize: stats.positions.length > 0
          ? stats.positions.reduce((sum, p) => sum + p.positionSize, 0) / stats.positions.length
          : 0,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [copyId, loading, investedAmount]);

  // Helper functions

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // ============================================================================
  // Trade Filtering (Statistics come from BotManager)
  // ============================================================================

  // Get unique pairs for filter
  const uniquePairs = Array.from(new Set(tradeHistory.map(t => t.pair)));

  // Filter and sort trade history (newest first)
  const filteredTrades = tradeHistory
    .filter(trade => {
      if (filterPair !== 'all' && trade.pair !== filterPair) return false;
      if (filterResult === 'wins' && trade.pnl <= 0) return false;
      if (filterResult === 'losses' && trade.pnl >= 0) return false;
      return true;
    })
    .sort((a, b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime());

  // Pagination
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Handle save settings
  const handleSaveSettings = () => {
    updateUserCopy(copyId, { compoundingPercent, autocloseAfterLockIn });
    setShowSettings(false);
  };

  if (!botDetails || !botStats) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard-v2"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {botDetails.icon && typeof botDetails.icon === 'string' && botDetails.icon.startsWith('/') ? (
                <img src={botDetails.icon} alt={botDetails.name} className="w-14 h-14 object-contain" />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center text-2xl">
                  <Layers className="w-7 h-7 text-primary-400" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-semibold text-white">{botDetails.name}</h1>
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-full flex items-center gap-1.5">
                    <Copy className="w-3 h-3" />
                    Copy
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-green-400">Active</span>
                  </div>
                  <span className="text-dark-600">•</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    <span className="text-xs text-primary-400 font-medium">LIVE Updates (1s)</span>
                  </div>
                  {masterBotName && masterBotSlug && (
                    <>
                      <span className="text-dark-600">•</span>
                      <Link
                        href={`/dashboard-v2/bots/${masterBotSlug}`}
                        className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors"
                      >
                        Master: {masterBotName}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-dark-700/50 hover:bg-dark-700 border border-dark-600 hover:border-dark-500 rounded-lg font-semibold text-dark-300 hover:text-white transition-all flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              {!lockedIn && (
                <Link
                  href={`/dashboard-v2/copy/${copyId}/archive`}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-lg font-semibold text-amber-400 hover:text-amber-300 transition-all flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Link>
              )}
              {lockedIn && lockInDaysRemaining > 0 && (
                <div className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-dark-400 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  Lock-in: {lockInDaysRemaining}d left
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {/* Realized P&L */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${(pnlBreakdown?.realizedPnL ?? 0) >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded-xl flex items-center justify-center`}>
                  {(pnlBreakdown?.realizedPnL ?? 0) >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  (pnlBreakdown?.realizedPnL ?? 0) >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  Closed trades
                </div>
              </div>
              <div className="text-sm text-dark-400 mb-1">Realized P&L</div>
              <div className={`text-2xl font-semibold mb-2 ${(pnlBreakdown?.realizedPnL ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(pnlBreakdown?.realizedPnL ?? 0) >= 0 ? '+' : ''}${Math.abs(pnlBreakdown?.realizedPnL ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-dark-400">Running for {botDetails.runningDays} days</div>
            </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                  {botStats.totalTrades} trades
                </div>
              </div>
              <div className="text-sm text-dark-400 mb-1">Win Rate</div>
              <div className="text-2xl font-semibold text-white mb-2">{(botStats.winRate || 0).toFixed(1)}%</div>
              <div className="text-xs text-dark-400">{botStats.winningTrades}W / {botStats.losingTrades}L</div>
            </div>
            </div>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${botDetails.todayPnL >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded-xl flex items-center justify-center`}>
                  {botDetails.todayPnL >= 0 ? (
                    <Activity className="w-6 h-6 text-green-400" />
                  ) : (
                    <Activity className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  botDetails.todayPnL >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {botDetails.todayPnL >= 0 ? '+' : ''}{(botDetails.todayPnLPercent || 0).toFixed(2)}%
                </div>
              </div>
              <div className="text-sm text-dark-400 mb-1">Today's P&L</div>
              <div className={`text-2xl font-semibold mb-2 ${botDetails.todayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {botDetails.todayPnL >= 0 ? '+' : ''}${Math.abs(botDetails.todayPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-dark-400">Last 24 hours</div>
            </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-400">LIVE</span>
                </div>
              </div>
              <div className="text-sm text-dark-400 mb-1">Live Positions</div>
              <div className="text-2xl font-semibold text-white mb-2">{livePositions.length} / {botDetails.maxPositions}</div>
              <div className="text-xs text-dark-400">
                {livePositions.length > 0 ? 'Updating every 2s' : 'Scanning markets'}
              </div>
            </div>
            </div>
          </motion.div>
        </div>

        {/* Settings Dialog */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="bg-dark-800 rounded-[calc(1rem-1px)] p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Bot Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-dark-400 hover:text-white">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Compounding Slider */}
                <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-white">Compounding</div>
                    <div className={`text-sm font-medium ${
                      compoundingPercent === 0 ? 'text-blue-400' :
                      compoundingPercent <= 30 ? 'text-green-400' :
                      compoundingPercent <= 70 ? 'text-yellow-400' :
                      'text-primary-400'
                    }`}>{compoundingPercent}%</div>
                  </div>

                  {/* Slider */}
                  <div
                    className="relative w-full h-2 bg-dark-600 rounded-full cursor-pointer group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
                      setCompoundingPercent(pct);
                    }}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      const track = e.currentTarget;
                      const onMove = (ev: PointerEvent) => {
                        const rect = track.getBoundingClientRect();
                        const pct = Math.round(Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100)));
                        setCompoundingPercent(pct);
                      };
                      const onUp = () => {
                        track.removeEventListener('pointermove', onMove);
                        track.removeEventListener('pointerup', onUp);
                      };
                      track.addEventListener('pointermove', onMove);
                      track.addEventListener('pointerup', onUp);
                    }}
                  >
                    {/* Filled track */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full pointer-events-none bg-gradient-to-r ${
                        compoundingPercent === 0 ? 'from-blue-500 to-blue-400' :
                        compoundingPercent <= 30 ? 'from-green-500 to-emerald-400' :
                        compoundingPercent <= 70 ? 'from-yellow-500 to-amber-400' :
                        'from-primary-500 to-accent-500'
                      }`}
                      style={{ width: `${compoundingPercent}%` }}
                    />
                    {/* Thumb */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg border-2 border-white/20 pointer-events-none ${
                        compoundingPercent === 0 ? 'bg-blue-500' :
                        compoundingPercent <= 30 ? 'bg-green-500' :
                        compoundingPercent <= 70 ? 'bg-yellow-500' :
                        'bg-primary-500'
                      }`}
                      style={{ left: `calc(${compoundingPercent}% - 10px)` }}
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="flex gap-2 mt-3">
                    {[0, 25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setCompoundingPercent(pct)}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          compoundingPercent === pct
                            ? pct === 0 ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' :
                              pct <= 30 ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
                              pct <= 70 ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400' :
                              'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                            : 'bg-dark-700 text-dark-400 hover:bg-dark-600 hover:text-white'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  {/* Split Description */}
                  <div className="mt-4 p-3 bg-dark-800/80 rounded-lg border border-dark-700/50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-400">Reinvest into bot</span>
                      <span className="font-medium text-primary-400">{compoundingPercent}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-400">Send to Available Balance</span>
                      <span className="font-medium text-green-400">{100 - compoundingPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Auto-close after Lock-in */}
                <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Auto-close after lock-in</div>
                      <div className="text-xs text-dark-400 mt-0.5">
                        {lockedIn
                          ? `Automatically archive bot when lock-in ends (${lockInDaysRemaining}d left)`
                          : 'Lock-in period has already ended'
                        }
                      </div>
                    </div>
                    <button
                      onClick={() => setAutocloseAfterLockIn(!autocloseAfterLockIn)}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                        autocloseAfterLockIn ? 'bg-amber-500' : 'bg-dark-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        autocloseAfterLockIn ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Lock-in Info */}
                <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="text-sm font-medium text-white mb-2">Lock-in Period</div>
                  {lockedIn ? (
                    <div className="flex items-center gap-2 text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{lockInDaysRemaining} days remaining</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Lock-in period ended</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 rounded-lg text-white font-semibold transition-all"
                >
                  Save
                </button>
              </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Performance Chart + Bot Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-8">
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/50 transition-all flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-medium text-white">Equity Curve</h2>
                  <p className="text-xs text-dark-400">Portfolio value over time</p>
                </div>
                <div className="flex gap-2">
                  {(['day', 'week', 'month', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setEquityPeriod(period)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        equityPeriod === period
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700/50 text-dark-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {(() => {
                // Filter equity data by selected period
                const now = Date.now();
                let cutoffTime = 0;

                switch (equityPeriod) {
                  case 'day':
                    cutoffTime = now - (24 * 60 * 60 * 1000);
                    break;
                  case 'week':
                    cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
                    break;
                  case 'month':
                    cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
                    break;
                  case 'all':
                  default:
                    cutoffTime = 0;
                    break;
                }

                const filteredEquityData = equityPeriod === 'all'
                  ? equityData
                  : equityData.filter(point => point.timestamp >= cutoffTime);

                // If filtered data is empty, show all data (like analytics)
                const displayData = filteredEquityData.length > 0 ? filteredEquityData : equityData;

                // Calculate Y-axis range with padding for better visualization
                const values = displayData.map(p => p.value);
                const minValue = Math.min(...values);
                const maxValue = Math.max(...values);
                const range = maxValue - minValue;
                const padding = range > 0 ? range * 0.1 : maxValue * 0.02; // 10% padding or 2% of max if flat

                return (
                  <div className="flex-1 min-h-0 w-full">
                    <Chart
                      options={{
                        chart: { type: 'line', toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
                        theme: { mode: 'dark' },
                        dataLabels: { enabled: false },
                        stroke: { curve: 'smooth', width: 3, colors: ['#10B981'] },
                        grid: { borderColor: '#1e293b', strokeDashArray: 4, xaxis: { lines: { show: false } } },
                        xaxis: {
                          type: 'datetime',
                          labels: {
                            style: { colors: '#64748b', fontSize: '12px' },
                            datetimeUTC: false,
                          },
                          axisBorder: { show: false },
                          axisTicks: { show: false }
                        },
                        yaxis: {
                          min: minValue - padding,
                          max: maxValue + padding,
                          labels: { style: { colors: '#64748b', fontSize: '12px' }, formatter: (val: number) => `$${val.toLocaleString('en-US')}` }
                        },
                        tooltip: {
                          theme: 'dark',
                          x: {
                            formatter: (val: number) => {
                              const date = new Date(val);
                              return date.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              });
                            }
                          },
                          y: { formatter: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
                        },
                        markers: { size: 0, hover: { size: 5 } },
                      }}
                      series={[{ name: 'Portfolio Value', data: displayData.map(point => ({ x: point.timestamp, y: point.value })) }]}
                      type="line"
                      height="100%"
                    />
                  </div>
                );
              })()}
            </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }} className="lg:col-span-4">
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-accent-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-500/20 border border-accent-500/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Bot Information</h3>
                  <p className="text-xs text-dark-400">Configuration details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="text-xs text-dark-400 mb-1">Invested Capital</div>
                  <div className="text-2xl font-semibold text-white">${(botDetails.invested || 0).toLocaleString('en-US')}</div>
                </div>

                <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="text-xs text-dark-400 mb-1">Current Value</div>
                  <div className={`text-2xl font-semibold ${botDetails.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${(pnlBreakdown?.currentValue ?? botDetails.currentValue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {pnlBreakdown && (
                  <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-400">Total P&L</span>
                      <span className={`text-xs font-medium ${pnlBreakdown.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pnlBreakdown.totalPnL >= 0 ? '+' : ''}${pnlBreakdown.totalPnL.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-400">Auto-Credited</span>
                      <span className="text-xs font-medium text-green-400">${pnlBreakdown.totalAutoCredited.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-400">Compounding</span>
                      <span className={`text-xs font-medium ${compoundingPercent > 0 ? 'text-primary-400' : 'text-dark-400'}`}>
                        {compoundingPercent > 0 ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="text-xs text-dark-400 mb-1">Risk Level</div>
                  <div className={`text-sm font-medium ${
                    botDetails.risk === 'low' ? 'text-green-400' :
                    botDetails.risk === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {botDetails.risk.charAt(0).toUpperCase() + botDetails.risk.slice(1)}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="text-xs text-dark-400 mb-2">Trading Pairs</div>
                  <div className="flex flex-wrap gap-2">
                    {botDetails.tradingPairs.map((pair, i) => (
                      <span key={i} className="px-2 py-1 bg-primary-500/10 border border-primary-500/30 rounded text-xs font-medium text-primary-400">
                        {pair}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700/50">
                  <div className="text-xs text-dark-400 mb-1">Running Since</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-dark-400" />
                    <span className="text-sm font-medium text-white">
                      {botDetails.runningSince}
                    </span>
                    <span className="text-xs text-dark-400">({botDetails.runningDays} days)</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </div>

        {/* Trading Statistics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white">Trading Statistics</h2>
                <p className="text-sm text-dark-400">Comprehensive performance metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<BarChart3 className="w-4 h-4 text-blue-400" />}
                label="Total Trades"
                value={(botStats.totalTrades || 0).toString()}
                subtitle={botDetails.runningDays > 0 ? `${(botStats.totalTrades / botDetails.runningDays).toFixed(1)}/day` : 'Just started'}
                subtitleColor="text-blue-400"
              />
              <StatCard
                icon={<Clock className="w-4 h-4 text-purple-400" />}
                label="Avg Hold Time"
                value={botStats.averageHoldTime || '0h'}
                subtitle={
                  botStats.averageHoldTime.includes('h') ? 'Swing trading' :
                  botStats.averageHoldTime.includes('m') && parseInt(botStats.averageHoldTime) > 10 ? 'Day trading' :
                  'Scalping'
                }
                subtitleColor="text-purple-400"
              />
              <StatCard
                icon={<Target className="w-4 h-4 text-green-400" />}
                label="Win/Loss Ratio"
                value={`${((botStats.winningTrades || 0) / Math.max(botStats.losingTrades || 1, 1)).toFixed(2)}:1`}
                subtitle={`${botStats.winningTrades || 0}W / ${botStats.losingTrades || 0}L`}
                subtitleColor="text-green-400"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                label="Average Win"
                value={`+$${(botStats.averageWin || 0).toFixed(2)}`}
                subtitle={`${((botStats.averageWin / (botDetails.invested || 1)) * 100).toFixed(2)}% of capital`}
                valueColor="text-green-400"
                subtitleColor="text-green-400"
              />
              <StatCard
                icon={<TrendingDown className="w-4 h-4 text-red-400" />}
                label="Average Loss"
                value={`$${(botStats.averageLoss || 0).toFixed(2)}`}
                subtitle={`${((Math.abs(botStats.averageLoss) / (botDetails.invested || 1)) * 100).toFixed(2)}% of capital`}
                valueColor="text-red-400"
                subtitleColor="text-red-400"
              />
              <StatCard
                icon={<Zap className="w-4 h-4 text-amber-400" />}
                label="Profit Factor"
                value={(botStats.profitFactor || 0).toFixed(2)}
                subtitle={
                  botStats.profitFactor >= 2 ? 'Excellent' :
                  botStats.profitFactor >= 1.5 ? 'Good' :
                  botStats.profitFactor >= 1 ? 'Profitable' :
                  'Needs improvement'
                }
                valueColor="text-amber-400"
                subtitleColor={
                  botStats.profitFactor >= 2 ? 'text-green-400' :
                  botStats.profitFactor >= 1.5 ? 'text-yellow-400' :
                  botStats.profitFactor >= 1 ? 'text-amber-400' :
                  'text-red-400'
                }
              />
              <StatCard
                icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                label="Max Drawdown"
                value={`${(botStats.maxDrawdown || 0).toFixed(1)}%`}
                subtitle={
                  Math.abs(botStats.maxDrawdown) < 5 ? 'Very safe' :
                  Math.abs(botStats.maxDrawdown) < 10 ? 'Safe' :
                  Math.abs(botStats.maxDrawdown) < 20 ? 'Moderate risk' :
                  'High risk'
                }
                valueColor="text-red-400"
                subtitleColor={
                  Math.abs(botStats.maxDrawdown) < 5 ? 'text-green-400' :
                  Math.abs(botStats.maxDrawdown) < 10 ? 'text-yellow-400' :
                  Math.abs(botStats.maxDrawdown) < 20 ? 'text-amber-400' :
                  'text-red-400'
                }
              />
              <StatCard
                icon={<DollarSign className="w-4 h-4 text-cyan-400" />}
                label="Total Volume"
                value={`$${((botStats.totalVolume || 0) / 1000).toFixed(0)}K`}
                subtitle={`${((botStats.totalVolume / (botDetails.invested || 1))).toFixed(1)}× capital turnover`}
                subtitleColor="text-cyan-400"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                label="Best Trade"
                value={`+$${(botStats.bestTrade || 0).toFixed(2)}`}
                subtitle={`${((botStats.bestTrade / (botDetails.invested || 1)) * 100).toFixed(2)}% gain`}
                valueColor="text-green-400"
                subtitleColor="text-green-400"
              />
              <StatCard
                icon={<TrendingDown className="w-4 h-4 text-red-400" />}
                label="Worst Trade"
                value={`$${(botStats.worstTrade || 0).toFixed(2)}`}
                subtitle={`${((Math.abs(botStats.worstTrade) / (botDetails.invested || 1)) * 100).toFixed(2)}% loss`}
                valueColor="text-red-400"
                subtitleColor="text-red-400"
              />
              <StatCard
                icon={<Zap className="w-4 h-4 text-green-400" />}
                label="Best Streak"
                value={`${botStats.winStreak || 0} W`}
                subtitle={
                  botStats.winStreak >= 10 ? 'Exceptional streak' :
                  botStats.winStreak >= 7 ? 'Strong streak' :
                  botStats.winStreak >= 5 ? 'Above average' :
                  botStats.winStreak >= 3 ? 'Moderate streak' :
                  'Early stage'
                }
                valueColor="text-green-400"
                subtitleColor="text-green-400"
              />
            </div>
          </div>
          </div>
        </motion.div>

        {/* Open Positions Table (LIVE V2) - GRID 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-6">
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                  <TrendingUpDown className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">Open Positions (Live)</h2>
                  <p className="text-sm text-dark-400">{livePositions.length} active position{livePositions.length !== 1 ? 's' : ''} • Updates every 2s</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            </div>

            {livePositions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-dark-600" />
                </div>
                <p className="text-dark-400">No open positions</p>
                <p className="text-xs text-dark-500 mt-1">Bot is analyzing markets...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {livePositions.map((position) => (
                  <motion.div
                    key={position.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-3 rounded-lg border border-dark-700 bg-dark-900/30 overflow-hidden"
                  >
                    <div className="relative">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                          position.side === 'LONG'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {position.side} ×{position.leverage}
                        </div>
                        <span className="text-base font-medium text-white">{position.pair}</span>
                        {/* SL/TP after pair */}
                        <div className="flex items-center gap-1.5 ml-2">
                          {/* Stop Loss */}
                          <div className="px-1.5 py-0.5 bg-dark-800/50 border border-dark-700 rounded flex items-center gap-1.5">
                            <div className="text-[9px] text-dark-400">SL</div>
                            <div className="font-mono text-[10px] text-red-400 font-normal">
                              ${position.stopLoss.toFixed(0)}
                            </div>
                          </div>
                          {/* Take Profit */}
                          <div className="px-1.5 py-0.5 bg-dark-800/50 border border-dark-700 rounded flex items-center gap-1.5">
                            <div className="text-[9px] text-dark-400">TP</div>
                            <div className="font-mono text-[10px] text-green-400 font-normal">
                              ${position.takeProfit.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Timer stays on the right */}
                      <div className="flex items-center gap-1.5 text-xs text-dark-400">
                        <Clock className="w-3 h-3" />
                        {position.duration}
                      </div>
                    </div>

                    {/* Price Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <div className="text-[10px] text-dark-400 mb-0.5">Entry Price</div>
                        <div className="font-mono text-sm text-white font-normal">
                          ${position.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-dark-400 mb-0.5 flex items-center gap-1">
                          Current Price
                          {position.pnl >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-green-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                        </div>
                        <motion.div
                          key={`price-${position.id}-${position.currentPrice}`}
                          className="font-mono text-sm font-normal"
                          initial={{ color: 'rgb(255, 255, 255)' }}
                          animate={{ color: [
                            'rgb(255, 255, 255)',
                            position.priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                            position.priceDirection === 'up' ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                            'rgb(255, 255, 255)'
                          ]}}
                          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                        >
                          ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.div>
                      </div>
                      <div>
                        <div className="text-[10px] text-dark-400 mb-0.5">Position Size</div>
                        <div className="font-mono text-sm text-white font-normal">
                          ${position.positionSize.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-dark-400 mb-0.5">Amount</div>
                        <div className="font-mono text-sm text-white font-normal">
                          {position.amount.toFixed(8)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-dark-400 mb-0.5">P&L</div>
                        <motion.div
                          key={`pnl-${position.id}-${position.pnl}`}
                          className="font-mono text-sm font-normal"
                          initial={{ color: position.pnl >= 0 ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)' }}
                          animate={{ color: [
                            'rgb(255, 255, 255)',
                            position.pnl >= 0 ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                            position.pnl >= 0 ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)',
                            position.pnl >= 0 ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'
                          ]}}
                          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                        >
                          {position.pnl >= 0 ? '+' : ''}${Math.abs(position.pnl).toFixed(2)} <span className="text-[10px] opacity-70">({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Type Badge */}
                    {position.type === 'instant' && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Target className="w-2.5 h-2.5" />
                        <span className="font-medium">Closing soon...</span>
                      </div>
                    )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          </div>
        </motion.div>

        {/* Trade History - GRID 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6 hover:border-accent-500/50 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-500/20 border border-accent-500/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">Trade History</h2>
                  <p className="text-sm text-dark-400">{filteredTrades.length} trades</p>
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={filterPair}
                  onChange={(e) => { setFilterPair(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="all">All Pairs</option>
                  {uniquePairs.map(pair => <option key={pair} value={pair}>{pair}</option>)}
                </select>

                <select
                  value={filterResult}
                  onChange={(e) => { setFilterResult(e.target.value as 'all' | 'wins' | 'losses'); setCurrentPage(1); }}
                  className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="all">All Results</option>
                  <option value="wins">Wins Only</option>
                  <option value="losses">Losses Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {paginatedTrades.map((trade) => {
                const isExpanded = expandedTrades.has(trade.id);
                return (
                  <div key={trade.id} className="rounded-lg border border-dark-700 bg-dark-900/30 overflow-hidden">
                    {/* Compact Header - Always Visible */}
                    <div
                      className="p-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-dark-800/70 transition-colors"
                      onClick={() => toggleTradeExpanded(trade.id)}
                    >
                      {/* Left: Pair & Side */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-base font-normal text-white">{trade.pair}</span>
                        <div className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                          trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side === 'LONG' ? '↑' : '↓'} {trade.side}×{trade.leverage}
                        </div>
                      </div>

                      {/* Middle: P&L (Main Focus) */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                          <div className={`text-[10px] font-medium opacity-70 ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* Right: Timestamp & Arrow */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-dark-400 whitespace-nowrap">
                            {new Date(trade.closedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3 h-3 text-dark-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-0 border-t border-dark-700/50">
                        {/* Row 1: Basic Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Entry Price</div>
                            <div className="px-1.5 py-0.5 bg-dark-800/50 border border-dark-700 rounded inline-flex items-center">
                              <div className="font-mono text-sm text-white font-normal">${trade.entryPrice.toFixed(2)}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Exit Price</div>
                            <div className="px-1.5 py-0.5 bg-dark-800/50 border border-dark-700 rounded inline-flex items-center">
                              <div className="font-mono text-sm text-white font-normal">${trade.exitPrice.toFixed(2)}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Position Size</div>
                            <div className="font-mono text-sm text-white font-normal">${trade.positionSize.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Duration</div>
                            <div className="text-sm text-white font-normal">{trade.duration}</div>
                          </div>
                        </div>

                        {/* Row 2: Trading Costs */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Total Fees</div>
                            <div className="font-mono text-sm text-red-400 font-normal">
                              -${trade.totalFees.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-dark-400 mb-1">Slippage</div>
                            {trade.slippage > 0 ? (
                              <div className="font-mono text-sm text-amber-400 font-normal">
                                {trade.slippage.toFixed(3)}%
                              </div>
                            ) : (
                              <div className="font-mono text-sm text-dark-500 font-normal">
                                0%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-700">
                <div className="text-sm text-dark-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTrades.length)} of {filteredTrades.length} trades
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white hover:bg-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum ? 'bg-primary-500 text-white' : 'bg-dark-800 border border-dark-600 text-dark-300 hover:bg-dark-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white hover:bg-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  valueColor?: string;
}

function StatCard({ icon, label, value, subtitle, subtitleColor = 'text-green-400', valueColor = 'text-white' }: StatCardProps) {
  return (
    <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/50 hover:border-blue-500/30 transition-all">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div className="text-xs text-dark-400">{label}</div>
      </div>
      <div className={`text-xl font-medium ${valueColor}`}>{value}</div>
      <div className={`text-xs ${subtitleColor} mt-1`}>{subtitle}</div>
    </div>
  );
}
