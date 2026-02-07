import type { FeedEvent, FeedEventType, TierLevel } from './types';

const FEED_EVENTS_KEY = 'social_feed_events';

/**
 * Milestone thresholds (profit amounts that trigger feed events)
 */
const MILESTONE_THRESHOLDS = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

/**
 * Check if a profit amount crosses a milestone
 */
export function checkMilestone(previousProfit: number, currentProfit: number): number | null {
  for (const threshold of MILESTONE_THRESHOLDS) {
    if (previousProfit < threshold && currentProfit >= threshold) {
      return threshold;
    }
  }
  return null;
}

/**
 * Create a feed event
 */
export function createFeedEvent(
  event: Omit<FeedEvent, 'id' | 'likes' | 'likedBy'>
): FeedEvent {
  const feedEvent: FeedEvent = {
    ...event,
    id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    likes: 0,
    likedBy: [],
  };

  const events = getAllFeedEvents();
  events.unshift(feedEvent);
  // Keep last 200 events
  const trimmed = events.slice(0, 200);
  if (typeof window !== 'undefined') {
    localStorage.setItem(FEED_EVENTS_KEY, JSON.stringify(trimmed));
  }

  return feedEvent;
}

/**
 * Get all feed events
 */
export function getAllFeedEvents(): FeedEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(FEED_EVENTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Get feed events for "For You" tab
 * Sorted by: tier weight (Diamond events rank higher) + recency
 */
export function getForYouFeed(): FeedEvent[] {
  const events = getAllFeedEvents();
  const tierWeight: Record<TierLevel, number> = {
    Diamond: 4,
    Platinum: 3,
    Gold: 2,
    Silver: 1,
  };

  return events.sort((a, b) => {
    // Primary: recency (newer first)
    const timeDiff = b.timestamp - a.timestamp;
    // Secondary: tier weight
    const weightDiff = tierWeight[b.traderTier] - tierWeight[a.traderTier];
    // Combine: time matters more, but within same hour, tier matters
    const hourMs = 3600000;
    if (Math.abs(timeDiff) < hourMs) {
      return weightDiff || timeDiff;
    }
    return timeDiff;
  });
}

/**
 * Get feed events for "Following" tab
 * Only events from traders the user follows
 */
export function getFollowingFeed(followedTraderIds: string[]): FeedEvent[] {
  const events = getAllFeedEvents();
  return events
    .filter(event => followedTraderIds.includes(event.traderId))
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get feed events for "Trending" tab
 * Events with most likes in last 24 hours
 */
export function getTrendingFeed(): FeedEvent[] {
  const events = getAllFeedEvents();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return events
    .filter(event => event.timestamp > oneDayAgo)
    .sort((a, b) => b.likes - a.likes);
}

/**
 * Format milestone amount for display
 */
export function formatMilestone(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount}`;
}
