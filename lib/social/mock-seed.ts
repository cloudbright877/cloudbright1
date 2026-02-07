import type { TraderProfile, FeedEvent, WhaleAlert } from './types';
import { calculateTier } from './tier-system';
import { isWhale } from './whale-detector';
import { createFeedEvent } from './feed-generator';

const SEED_FLAG = 'social_data_seeded';
const TRADERS_KEY = 'social_traders';

/**
 * Seeds localStorage with realistic social data
 * Called once on first app load
 */
export function seedSocialData(): void {
  if (typeof window === 'undefined') return;

  // Force re-seed to update data structure
  const needsReseed = !localStorage.getItem(SEED_FLAG) || localStorage.getItem('social_data_version') !== '2';

  if (!needsReseed) return; // Already seeded with correct version

  console.log('[MockSeed] Seeding social data...');

  // Clear old data
  localStorage.removeItem('social_feed_events');
  localStorage.removeItem('social_whale_alerts');

  // Generate 25 traders with realistic distributions
  const traders = generateMockTraders();
  localStorage.setItem(TRADERS_KEY, JSON.stringify(traders));

  // Generate feed events
  generateMockFeedEvents(traders);

  // Generate whale alerts
  generateMockWhaleAlerts(traders);

  localStorage.setItem(SEED_FLAG, 'true');
  localStorage.setItem('social_data_version', '2');
  console.log('[MockSeed] Social data seeded successfully');
}

/**
 * Generate 25 mock traders with realistic stat distributions
 */
function generateMockTraders(): TraderProfile[] {
  const traders: TraderProfile[] = [];

  const mockNames = [
    { username: 'john_pro', displayName: 'John Pro Trader', bio: 'Professional trader with 5+ years experience' },
    { username: 'crypto_queen', displayName: 'Crypto Queen', bio: 'Diamond tier trader. Follow for consistent profits.' },
    { username: 'whale_hunter', displayName: 'Whale Hunter', bio: 'Tracking big money moves in crypto' },
    { username: 'sarah_trades', displayName: 'Sarah Martinez', bio: 'Conservative trading strategy. Low risk, steady gains.' },
    { username: 'mike_crypto', displayName: 'Mike Chen', bio: 'Day trader | BTC/ETH specialist' },
    { username: 'alex_whale', displayName: 'Alex the Whale', bio: 'High capital trader. $100k+ positions.' },
    { username: 'lisa_smart', displayName: 'Lisa Smart', bio: 'Algorithm-based trading. Data-driven decisions.' },
    { username: 'tom_bitcoin', displayName: 'Tom Richards', bio: 'Bitcoin maximalist since 2015' },
    { username: 'emma_degen', displayName: 'Emma DeGen', bio: 'High risk, high reward. Not for beginners!' },
    { username: 'david_safe', displayName: 'David Safe', bio: 'Conservative DCA strategy. 60% win rate.' },
    { username: 'sophia_swing', displayName: 'Sophia Yang', bio: 'Swing trader. Positions held 3-7 days.' },
    { username: 'ryan_scalp', displayName: 'Ryan Walker', bio: 'Scalping expert. Quick in, quick out.' },
    { username: 'olivia_hold', displayName: 'Olivia HODL', bio: 'Long-term holder. Buy the dip!' },
    { username: 'james_trend', displayName: 'James Trend', bio: 'Trend following strategy. Ride the wave.' },
    { username: 'ava_grid', displayName: 'Ava GridBot', bio: 'Grid trading specialist. Sideways markets.' },
    { username: 'william_arb', displayName: 'William Arbitrage', bio: 'Cross-exchange arbitrage opportunities' },
    { username: 'mia_signals', displayName: 'Mia Signals', bio: 'Technical analysis signals. Chart patterns.' },
    { username: 'daniel_bot', displayName: 'Daniel AutoBot', bio: 'Automated trading. 24/7 market monitoring.' },
    { username: 'chloe_altcoin', displayName: 'Chloe Altcoin', bio: 'Altcoin gems hunter. High risk, massive gains.' },
    { username: 'noah_stable', displayName: 'Noah Stable', bio: 'Stablecoin yield farming. Low volatility.' },
    { username: 'zoe_defi', displayName: 'Zoe DeFi', bio: 'DeFi protocols and yield optimization' },
    { username: 'lucas_nft', displayName: 'Lucas NFT', bio: 'NFT trading and flipping. Digital art collector.' },
    { username: 'grace_eth', displayName: 'Grace Ethereum', bio: 'Ethereum ecosystem specialist' },
    { username: 'leo_momentum', displayName: 'Leo Momentum', bio: 'Momentum trading. Follow the strength.' },
    { username: 'bella_contrarian', displayName: 'Bella Contrarian', bio: 'Contrarian approach. Buy fear, sell greed.' },
  ];

  // Tier distribution: 2 Diamond, 4 Platinum, 8 Gold, 11 Silver
  const tierTargets = [
    { tier: 'Diamond', count: 2 },
    { tier: 'Platinum', count: 4 },
    { tier: 'Gold', count: 8 },
    { tier: 'Silver', count: 11 },
  ];

  let traderIndex = 0;

  for (const { tier, count } of tierTargets) {
    for (let i = 0; i < count; i++) {
      if (traderIndex >= mockNames.length) break;

      const mockData = mockNames[traderIndex];
      const stats = generateStatsForTier(tier as any);
      const calculatedTier = calculateTier(stats);

      const trader: TraderProfile = {
        userId: `trader_${traderIndex + 1}`,
        username: mockData.username,
        displayName: mockData.displayName,
        avatar: null,
        tier: calculatedTier,
        verified: Math.random() > 0.75, // 25% verified
        isWhale: isWhale(stats.totalInvested),
        bio: mockData.bio,
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        activeBotIds: [`bot_${traderIndex + 1}_1`, `bot_${traderIndex + 1}_2`],
        stats,
      };

      traders.push(trader);
      traderIndex++;
    }
  }

  return traders;
}

/**
 * Generate realistic stats for a given tier
 */
function generateStatsForTier(tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver') {
  const tierConfig: Record<typeof tier, {
    profitRange: [number, number];
    winRateRange: [number, number];
    copiersRange: [number, number];
    monthlyReturnRange: [number, number];
    tradesRange: [number, number];
    investedRange: [number, number];
  }> = {
    Diamond: {
      profitRange: [200000, 500000],
      winRateRange: [65, 75],
      copiersRange: [200, 500],
      monthlyReturnRange: [15, 25],
      tradesRange: [500, 2000],
      investedRange: [80000, 200000],
    },
    Platinum: {
      profitRange: [50000, 199000],
      winRateRange: [60, 68],
      copiersRange: [50, 199],
      monthlyReturnRange: [10, 20],
      tradesRange: [200, 800],
      investedRange: [30000, 100000],
    },
    Gold: {
      profitRange: [10000, 49000],
      winRateRange: [55, 62],
      copiersRange: [10, 49],
      monthlyReturnRange: [5, 15],
      tradesRange: [100, 500],
      investedRange: [10000, 50000],
    },
    Silver: {
      profitRange: [-5000, 9999],
      winRateRange: [45, 58],
      copiersRange: [0, 9],
      monthlyReturnRange: [-5, 10],
      tradesRange: [20, 200],
      investedRange: [1000, 20000],
    },
  };

  const config = tierConfig[tier];
  const totalProfit = randomInRange(config.profitRange);
  const totalTrades = randomInRange(config.tradesRange);

  return {
    totalProfit,
    monthlyReturn: randomInRange(config.monthlyReturnRange),
    winRate: randomInRange(config.winRateRange),
    totalTrades,
    rank: 0, // Will be calculated by leaderboard
    previousRank: Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 1 : 0,
    followers: Math.floor(Math.random() * 100),
    copiers: randomInRange(config.copiersRange),
    copiersAUM: randomInRange(config.copiersRange) * randomInRange([5000, 50000]),
    totalInvested: randomInRange(config.investedRange),
  };
}

/**
 * Generate mock feed events
 */
function generateMockFeedEvents(traders: TraderProfile[]): void {
  const events: FeedEvent[] = [];
  const now = Date.now();

  // Generate 50 events over the last 7 days
  for (let i = 0; i < 50; i++) {
    const trader = traders[Math.floor(Math.random() * traders.length)];
    const timestamp = now - Math.random() * 7 * 24 * 60 * 60 * 1000;

    const eventTypes: Array<'milestone' | 'whale-move' | 'rank-change' | 'new-copy'> = [
      'milestone',
      'whale-move',
      'rank-change',
      'new-copy',
    ];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    let data;
    switch (type) {
      case 'milestone':
        const milestoneValue = [1000, 5000, 10000, 25000, 50000, 100000][Math.floor(Math.random() * 6)];
        const milestoneDisplay = milestoneValue >= 1000 ? `$${(milestoneValue / 1000).toFixed(0)}k` : `$${milestoneValue}`;
        data = {
          type: 'milestone' as const,
          title: `Reached ${milestoneDisplay} Milestone!`,
          description: `Just hit ${milestoneDisplay} in total profit! Started with $${(trader.stats.totalInvested / 1000).toFixed(0)}k, now at $${((trader.stats.totalInvested + trader.stats.totalProfit) / 1000).toFixed(0)}k portfolio.`,
          milestone: milestoneDisplay,
          value: milestoneValue,
        };
        break;
      case 'whale-move':
        const action = ['invested', 'withdrew', 'profit'][Math.floor(Math.random() * 3)];
        const amount = randomInRange([10000, 50000]);
        data = {
          type: 'whale-move' as const,
          title: `WHALE ALERT: ${action === 'invested' ? 'Invested' : action === 'withdrew' ? 'Withdrew' : 'Took Profit'} $${(amount / 1000).toFixed(0)}k`,
          description: `${action === 'invested' ? 'Just invested' : action === 'withdrew' ? 'Withdrew' : 'Secured'} $${amount.toLocaleString()} ${action === 'invested' ? 'into' : 'from'} trading bots`,
          action: action === 'invested' ? 'Invested' : action === 'withdrew' ? 'Withdrew' : 'Took Profit',
          amount,
        };
        break;
      case 'rank-change':
        const oldRank = Math.floor(Math.random() * 50) + 1;
        const newRank = Math.floor(Math.random() * 50) + 1;
        data = {
          type: 'rank-change' as const,
          title: `Leaderboard Rank ${newRank < oldRank ? 'Up' : 'Down'}!`,
          description: `${newRank < oldRank ? 'Climbed' : 'Dropped'} from #${oldRank} to #${newRank} on the leaderboard this week`,
          oldRank,
          newRank,
        };
        break;
      case 'new-copy':
        const copierCount = randomInRange([5, 50]);
        data = {
          type: 'new-copy' as const,
          title: `${copierCount} New Copiers This Week!`,
          description: `${copierCount} traders started copying my strategy. Now at ${trader.stats.copiers} total copiers!`,
          copierCount,
          totalCopiers: trader.stats.copiers,
        };
        break;
    }

    events.push({
      id: `feed_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      traderId: trader.userId,
      traderUsername: trader.username,
      traderDisplayName: trader.displayName,
      traderTier: trader.tier,
      traderVerified: trader.verified,
      traderAvatar: trader.avatar,
      timestamp,
      data,
      likes: Math.floor(Math.random() * 50),
      likedBy: [],
    });
  }

  localStorage.setItem('social_feed_events', JSON.stringify(events));
}

/**
 * Generate mock whale alerts
 */
function generateMockWhaleAlerts(traders: TraderProfile[]): void {
  const alerts: WhaleAlert[] = [];
  const whales = traders.filter(t => t.isWhale);
  const now = Date.now();

  // Generate 30 whale alerts over the last 7 days
  for (let i = 0; i < 30; i++) {
    if (whales.length === 0) break;
    const whale = whales[Math.floor(Math.random() * whales.length)];
    const timestamp = now - Math.random() * 7 * 24 * 60 * 60 * 1000;

    alerts.push({
      id: `whale_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      traderId: whale.userId,
      traderUsername: whale.username,
      traderDisplayName: whale.displayName,
      traderTier: whale.tier,
      traderVerified: whale.verified,
      traderAvatar: whale.avatar,
      action: ['invested', 'withdrew', 'profit'][Math.floor(Math.random() * 3)] as any,
      amount: randomInRange([10000, 100000]),
      botName: `${whale.displayName}'s Bot`,
      botSlug: whale.username,
      timestamp,
      totalInvested: whale.stats.totalInvested,
      totalProfit: whale.stats.totalProfit,
    });
  }

  localStorage.setItem('whale_alerts', JSON.stringify(alerts));
}

/**
 * Get all social traders
 */
export function getSocialTraders(): TraderProfile[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TRADERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Get trader by username
 */
export function getTraderByUsername(username: string): TraderProfile | null {
  return getSocialTraders().find(t => t.username === username) || null;
}

/**
 * Get trader by userId
 */
export function getTraderById(userId: string): TraderProfile | null {
  return getSocialTraders().find(t => t.userId === userId) || null;
}

/**
 * Utility: Random number in range [min, max]
 */
function randomInRange([min, max]: [number, number]): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clear all social data (for testing)
 */
export function clearSocialData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEED_FLAG);
  localStorage.removeItem(TRADERS_KEY);
  localStorage.removeItem('social_feed_events');
  localStorage.removeItem('whale_alerts');
  localStorage.removeItem('social_follows');
  localStorage.removeItem('social_likes');
  console.log('[MockSeed] Social data cleared');
}
