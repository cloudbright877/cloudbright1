import type { LeaderboardEntry, LeaderboardTimeFrame, LeaderboardCategory, TraderProfile } from './types';

/**
 * Calculate leaderboard rankings from trader profiles
 *
 * @param traders - All trader profiles
 * @param category - Metric to rank by
 * @param timeFrame - Time period (affects which stats to use)
 * @param currentUserId - Highlight current user
 * @returns Sorted leaderboard entries with ranks
 */
export function calculateLeaderboard(
  traders: TraderProfile[],
  category: LeaderboardCategory = 'profit',
  timeFrame: LeaderboardTimeFrame = 'all-time',
  currentUserId: string = 'user_default'
): LeaderboardEntry[] {
  // Minimum trades required for winRate ranking
  const MIN_TRADES_FOR_WINRATE = 50;

  // Filter traders with enough data
  let eligible = [...traders];
  if (category === 'winRate') {
    eligible = eligible.filter(t => t.stats.totalTrades >= MIN_TRADES_FOR_WINRATE);
  }

  // Sort by selected category
  eligible.sort((a, b) => {
    switch (category) {
      case 'profit':
        return b.stats.totalProfit - a.stats.totalProfit;
      case 'return':
        return b.stats.monthlyReturn - a.stats.monthlyReturn;
      case 'winRate':
        return b.stats.winRate - a.stats.winRate;
      default:
        return 0;
    }
  });

  // Assign ranks
  return eligible.map((trader, index) => ({
    rank: index + 1,
    previousRank: trader.stats.previousRank || null,
    userId: trader.userId,
    username: trader.username,
    displayName: trader.displayName,
    avatar: trader.avatar,
    tier: trader.tier,
    verified: trader.verified,
    stats: {
      profit: trader.stats.totalProfit,
      return: trader.stats.monthlyReturn,
      winRate: trader.stats.winRate,
      trades: trader.stats.totalTrades,
      copiers: trader.stats.copiers,
    },
    isCurrentUser: trader.userId === currentUserId,
  }));
}

/**
 * Get rank change indicator
 */
export function getRankChange(rank: number, previousRank: number | null): {
  text: string;
  color: string;
  direction: 'up' | 'down' | 'new' | 'unchanged';
} {
  if (previousRank === null) {
    return { text: 'NEW', color: 'text-accent-400', direction: 'new' };
  }
  const change = previousRank - rank;
  if (change > 0) {
    return { text: `+${change}`, color: 'text-green-400', direction: 'up' };
  }
  if (change < 0) {
    return { text: `${change}`, color: 'text-red-400', direction: 'down' };
  }
  return { text: '—', color: 'text-dark-500', direction: 'unchanged' };
}
