import { botManager } from './BotManager';
import { getUserCopy, getAllCopiesOfMaster } from './userCopies';
import type { BotStats, Position, Trade } from './trading/types';
import type { UserCopy } from './userCopies';

// ============================================================================
// P&L Breakdown — Single Source of Truth
// ============================================================================

/**
 * Complete P&L breakdown for a user copy.
 * ALL UI pages MUST use getUserCopyPnLBreakdown() — no duplicate calculations.
 *
 * Profit is auto-credited to user's available balance when trades close.
 * No manual collect — totalAutoCredited tracks what was already sent to balance.
 */
export interface PnLBreakdown {
  realizedPnL: number;        // sum(closedTrades.pnl) — from trades after copy creation
  unrealizedPnL: number;      // sum(openPositions.pnl)
  totalPnL: number;           // realized + unrealized (for leaderboard)
  totalAutoCredited: number;  // profit already auto-credited to user's available balance
  currentValue: number;       // invested + realized - autoCredited + unrealized
  investedAmount: number;     // original capital
}

/**
 * THE source for all P&L numbers everywhere.
 * Dashboard, copy detail, archive page, wallet — all call this function.
 */
export function getUserCopyPnLBreakdown(copyId: string): PnLBreakdown | null {
  const copy = getUserCopy(copyId);
  if (!copy) return null;

  const masterBot = botManager.getBot(copy.masterBotId);
  if (!masterBot) return null;

  const masterStats = masterBot.getStats();
  const masterConfig = masterBot.getConfig();

  const masterCapital = masterConfig.investedCapital || 1;
  const ratio = copy.investedAmount / masterCapital;

  if (!isFinite(ratio) || isNaN(ratio) || ratio < 0) return null;

  // Filter trades that happened AFTER copy was created
  const tradesAfterCopy = masterStats.trades.filter(
    (t) => new Date(t.closedAt).getTime() >= copy.createdAt
  );

  // Realized P&L = sum of closed trades (scaled)
  const rawRealized = tradesAfterCopy.reduce((sum, t) => sum + t.pnl * ratio, 0);
  const realizedPnL = isFinite(rawRealized) && !isNaN(rawRealized) ? rawRealized : 0;

  // Unrealized P&L = sum of open positions (scaled)
  const rawUnrealized = masterStats.positions.reduce((sum, p) => sum + p.pnl * ratio, 0);
  const unrealizedPnL = isFinite(rawUnrealized) && !isNaN(rawUnrealized) ? rawUnrealized : 0;

  const totalPnL = realizedPnL + unrealizedPnL;
  const totalAutoCredited = copy.totalCollectedPnL || 0;
  const currentValue = copy.investedAmount + realizedPnL - totalAutoCredited + unrealizedPnL;

  return {
    realizedPnL,
    unrealizedPnL,
    totalPnL,
    totalAutoCredited,
    currentValue,
    investedAmount: copy.investedAmount,
  };
}

// ============================================================================
// Aggregated Stats
// ============================================================================

/**
 * Aggregated stats for marketplace display
 */
export interface AggregatedMasterBotStats {
  masterBotId: string;
  totalCopiers: number;
  totalInvested: number;
  avgInvestmentPerCopy: number;
  masterBotStats: BotStats;
  copiers: Array<{
    copyId: string;
    userId: string;
    investedAmount: number;
    createdAt: number;
  }>;
}

/**
 * Calculate proportional stats for a user copy
 */
export function getUserCopyStats(copyId: string): BotStats | null {
  const copy = getUserCopy(copyId);
  if (!copy) {
    console.warn(`[UserCopyStats] Copy ${copyId} not found`);
    return null;
  }

  const masterBot = botManager.getBot(copy.masterBotId);
  if (!masterBot) {
    console.warn(`[UserCopyStats] Master bot ${copy.masterBotId} not found`);
    return null;
  }

  const masterStats = masterBot.getStats();
  const masterConfig = masterBot.getConfig();

  // Calculate user's proportion with division by zero protection
  const masterCapital = masterConfig.investedCapital || 1; // Prevent division by 0
  const ratio = copy.investedAmount / masterCapital;

  // Validate ratio
  if (!isFinite(ratio) || isNaN(ratio) || ratio < 0) {
    console.error(`[UserCopyStats] Invalid ratio for copy ${copyId}: ${ratio}`);
    return null;
  }

  console.log(
    `[UserCopyStats] Copy ${copyId}: $${copy.investedAmount} / $${masterCapital} = ${(ratio * 100).toFixed(1)}%`
  );

  // Filter trades that happened AFTER copy was created
  const tradesAfterCopy = masterStats.trades.filter(
    (t) => new Date(t.closedAt).getTime() >= copy.createdAt
  );

  // Scale positions with validation
  const scaledPositions: Position[] = masterStats.positions.map((p) => {
    const scaledPnl = p.pnl * ratio;
    const scaledSize = p.positionSize * ratio;

    return {
      ...p,
      pnl: isFinite(scaledPnl) && !isNaN(scaledPnl) ? scaledPnl : 0,
      positionSize: isFinite(scaledSize) && !isNaN(scaledSize) ? scaledSize : 0,
    };
  });

  // Scale trades (only those after copy was created) with validation
  const scaledTrades: Trade[] = tradesAfterCopy.map((t) => {
    const scaledPnl = t.pnl * ratio;
    const scaledSize = t.positionSize * ratio;

    return {
      ...t,
      pnl: isFinite(scaledPnl) && !isNaN(scaledPnl) ? scaledPnl : 0,
      positionSize: isFinite(scaledSize) && !isNaN(scaledSize) ? scaledSize : 0,
    };
  });

  // Calculate stats from filtered trades with validation
  const wins = scaledTrades.filter((t) => t.pnl > 0);
  const losses = scaledTrades.filter((t) => t.pnl <= 0);

  const rawTotalPnL = scaledTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalPnL = isFinite(rawTotalPnL) && !isNaN(rawTotalPnL) ? rawTotalPnL : 0;

  const winRate = scaledTrades.length > 0 ? (wins.length / scaledTrades.length) * 100 : 0;

  const rawAvgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
  const avgWin = isFinite(rawAvgWin) && !isNaN(rawAvgWin) ? rawAvgWin : 0;

  const rawAvgLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length : 0;
  const avgLoss = isFinite(rawAvgLoss) && !isNaN(rawAvgLoss) ? rawAvgLoss : 0;

  return {
    id: copy.id,
    name: `${masterStats.name} Copy`,
    totalPnL,
    winRate,
    tradesCount: scaledTrades.length,
    winsCount: wins.length,
    lossesCount: losses.length,
    avgWin,
    avgLoss,
    positions: scaledPositions,
    trades: scaledTrades,
  };
}

/**
 * Get aggregated stats for marketplace display
 */
export function getMasterBotAggregatedStats(
  masterBotId: string
): AggregatedMasterBotStats {
  const copies = getAllCopiesOfMaster(masterBotId);
  const masterStats = botManager.getStats(masterBotId);

  const totalInvested = copies.reduce((sum, c) => sum + c.investedAmount, 0);
  const avgInvestment = copies.length > 0 ? totalInvested / copies.length : 0;

  return {
    masterBotId,
    totalCopiers: copies.length,
    totalInvested,
    avgInvestmentPerCopy: avgInvestment,
    masterBotStats: masterStats || {
      id: masterBotId,
      name: 'Unknown',
      totalPnL: 0,
      winRate: 0,
      tradesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      avgWin: 0,
      avgLoss: 0,
      positions: [],
      trades: [],
    },
    copiers: copies.map((c) => ({
      copyId: c.id,
      userId: c.userId,
      investedAmount: c.investedAmount,
      createdAt: c.createdAt,
    })),
  };
}
