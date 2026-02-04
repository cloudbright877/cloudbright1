import { botManager } from './BotManager';
import { getUserCopy, getAllCopiesOfMaster } from './userCopies';
import type { BotStats, Position, Trade } from './trading/types';
import type { UserCopy } from './userCopies';

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

  // Calculate user's proportion
  const ratio = copy.investedAmount / masterConfig.investedCapital;

  console.log(
    `[UserCopyStats] Copy ${copyId}: $${copy.investedAmount} / $${masterConfig.investedCapital} = ${(ratio * 100).toFixed(1)}%`
  );

  // Filter trades that happened AFTER copy was created
  const tradesAfterCopy = masterStats.trades.filter(
    (t) => new Date(t.closedAt).getTime() >= copy.createdAt
  );

  // Scale positions
  const scaledPositions: Position[] = masterStats.positions.map((p) => ({
    ...p,
    pnl: p.pnl * ratio,
    positionSize: p.positionSize * ratio,
  }));

  // Scale trades (only those after copy was created)
  const scaledTrades: Trade[] = tradesAfterCopy.map((t) => ({
    ...t,
    pnl: t.pnl * ratio,
    positionSize: t.positionSize * ratio,
  }));

  // Calculate stats from filtered trades
  const wins = scaledTrades.filter((t) => t.pnl > 0);
  const losses = scaledTrades.filter((t) => t.pnl <= 0);
  const totalPnL = scaledTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate =
    scaledTrades.length > 0 ? (wins.length / scaledTrades.length) * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length : 0;

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
