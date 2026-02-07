// === TIER SYSTEM ===
export type TierLevel = 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface TierRequirements {
  tier: TierLevel;
  minProfit: number;      // Total profit in USD
  minWinRate: number;     // Win rate percentage (0-100)
  minCopiers: number;     // Number of active copiers
}

// === TRADER PROFILE ===
export interface TraderProfile {
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  tier: TierLevel;
  verified: boolean;       // Manual admin flag, NOT auto-calculated
  isWhale: boolean;        // totalInvested >= $50,000
  bio: string;
  joinedDate: string;      // ISO date string
  activeBotIds: string[];  // References to master bot IDs
  stats: TraderStats;
}

export interface TraderStats {
  totalProfit: number;
  monthlyReturn: number;   // Average % over last 12 months
  winRate: number;          // 0-100
  totalTrades: number;
  rank: number;             // Current leaderboard position
  previousRank: number;     // Previous period rank (for change indicator)
  followers: number;
  copiers: number;
  copiersAUM: number;       // Total $ managed via copies
  totalInvested: number;    // Trader's own invested capital
}

// === FEED EVENTS ===
export type FeedEventType = 'milestone' | 'whale-move' | 'rank-change' | 'new-copy';

export interface FeedEvent {
  id: string;                    // feed_<timestamp>_<random>
  type: FeedEventType;
  traderId: string;              // userId of the trader
  traderUsername: string;
  traderDisplayName: string;
  traderTier: TierLevel;
  traderVerified: boolean;
  traderAvatar: string | null;
  timestamp: number;             // Unix ms
  data: MilestoneData | WhaleMoveData | RankChangeData | NewCopyData;
  likes: number;
  likedBy: string[];             // Array of userIds who liked
}

export interface MilestoneData {
  type: 'milestone';
  title: string;
  description: string;
  milestone: string;             // Display value like "$1k", "$5k", etc.
  value: number;                 // Numeric value
}

export interface WhaleMoveData {
  type: 'whale-move';
  title: string;
  description: string;
  action: string;                // Display action like "Invested", "Withdrew"
  amount: number;
  botName?: string;
}

export interface RankChangeData {
  type: 'rank-change';
  title: string;
  description: string;
  oldRank: number;
  newRank: number;
}

export interface NewCopyData {
  type: 'new-copy';
  title: string;
  description: string;
  copierCount: number;
  totalCopiers: number;
}

// === WHALE ALERTS ===
export interface WhaleAlert {
  id: string;
  traderId: string;
  traderUsername: string;
  traderDisplayName: string;
  traderTier: TierLevel;
  traderVerified: boolean;
  traderAvatar: string | null;
  action: 'invested' | 'withdrew' | 'profit';
  amount: number;
  botName: string;
  botSlug: string;
  timestamp: number;
  totalInvested: number;
  totalProfit: number;
}

// === LEADERBOARD ===
export interface LeaderboardEntry {
  rank: number;
  previousRank: number | null;
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  tier: TierLevel;
  verified: boolean;
  stats: {
    profit: number;
    return: number;        // % return
    winRate: number;
    trades: number;
    copiers: number;
  };
  isCurrentUser?: boolean;
}

export type LeaderboardTimeFrame = 'weekly' | 'monthly' | 'all-time';
export type LeaderboardCategory = 'profit' | 'return' | 'winRate';

// === FOLLOW SYSTEM ===
export interface FollowData {
  userId: string;          // Who is following
  following: string[];     // Array of traderIds being followed
}
