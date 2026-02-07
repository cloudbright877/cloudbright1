# Social System Architecture & Implementation Spec

> **Target:** Sonnet implementation guide
> **Status:** Approved by product owner
> **Date:** 2026-02-07
> **Scope:** Feed, Whales, Traders, Leaderboard pages + business logic layer

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [New Modules to Create](#2-new-modules-to-create)
3. [Types & Interfaces](#3-types--interfaces)
4. [Tier System](#4-tier-system)
5. [Whale Detection](#5-whale-detection)
6. [Follow System](#6-follow-system)
7. [Feed Generator](#7-feed-generator)
8. [Social Interactions (Likes)](#8-social-interactions)
9. [Leaderboard Algorithm](#9-leaderboard-algorithm)
10. [Page Modifications](#10-page-modifications)
11. [What to Remove](#11-what-to-remove)
12. [Implementation Order](#12-implementation-order)

---

## 1. Architecture Overview

### Design Principles
- **Simplicity:** Минимум абстракций, максимум понятности
- **No gamification:** Никаких стриков, ачивок, бонусов. Только деньги и статистика
- **Auto-generated content:** Пользователи НЕ создают посты. Система генерирует feed events
- **localStorage MVP:** Все данные в localStorage, готовые к миграции на backend API

### File Structure (NEW)
```
lib/social/
  types.ts              — Shared types for all social features
  tier-system.ts        — Tier calculation (Diamond/Platinum/Gold/Silver)
  tier-utils.ts         — getTierColor, getTierIcon (единая копия, заменяет 4 дубликата)
  whale-detector.ts     — Whale identification + alert generation
  follow-system.ts      — Follow/unfollow with localStorage
  feed-generator.ts     — Auto-generate feed events from system data
  social-interactions.ts — Likes persistence with localStorage
  leaderboard.ts        — Ranking algorithm
```

### Existing Files to Modify
```
app/dashboard-v2/feed/page.tsx         — Major refactor
app/dashboard-v2/whales/page.tsx       — Connect to whale-detector
app/dashboard-v2/traders/page.tsx      — Add Follow button, use shared types
app/dashboard-v2/leaderboard/page.tsx  — Working filters, search, real ranking
app/dashboard-v2/traders/[username]/page.tsx — Dynamic data, working buttons
lib/users.ts                           — Add social fields to User interface
components/dashboard-v2/Sidebar.tsx    — No changes needed
```

---

## 2. New Modules to Create

### 2.1 `lib/social/types.ts`

All shared types for the social system. Single source of truth.

```typescript
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
  milestone: number;             // $1k, $5k, $10k, $25k, $50k, $100k, $250k, $500k, $1M
  totalProfit: number;
  portfolioValue: number;
}

export interface WhaleMoveData {
  type: 'whale-move';
  action: 'invested' | 'withdrew' | 'profit';
  amount: number;
  botName: string;
  botSlug: string;
  totalInvested: number;
}

export interface RankChangeData {
  type: 'rank-change';
  oldRank: number;
  newRank: number;
  direction: 'up' | 'down';
}

export interface NewCopyData {
  type: 'new-copy';
  copierCount: number;           // "15 traders copied this week"
  botName: string;
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
```

### 2.2 `lib/social/tier-system.ts`

Automatic tier calculation based on trader metrics.

```typescript
import type { TierLevel, TierRequirements, TraderStats } from './types';

/**
 * Tier thresholds — ALL conditions must be met simultaneously
 * Tiers can go UP or DOWN based on current metrics
 */
const TIER_THRESHOLDS: TierRequirements[] = [
  { tier: 'Diamond',  minProfit: 200000, minWinRate: 65, minCopiers: 200 },
  { tier: 'Platinum', minProfit: 50000,  minWinRate: 60, minCopiers: 50 },
  { tier: 'Gold',     minProfit: 10000,  minWinRate: 55, minCopiers: 10 },
  { tier: 'Silver',   minProfit: 0,      minWinRate: 0,  minCopiers: 0 },
];

/**
 * Calculate tier based on trader stats
 * Returns highest tier where ALL conditions are met
 */
export function calculateTier(stats: TraderStats): TierLevel {
  for (const threshold of TIER_THRESHOLDS) {
    if (
      stats.totalProfit >= threshold.minProfit &&
      stats.winRate >= threshold.minWinRate &&
      stats.copiers >= threshold.minCopiers
    ) {
      return threshold.tier;
    }
  }
  return 'Silver';
}

/**
 * Get tier requirements for display (e.g. progress bars)
 */
export function getTierRequirements(tier: TierLevel): TierRequirements {
  return TIER_THRESHOLDS.find(t => t.tier === tier) || TIER_THRESHOLDS[3];
}

/**
 * Get next tier requirements (for "X more to upgrade" display)
 * Returns null if already Diamond
 */
export function getNextTierRequirements(currentTier: TierLevel): TierRequirements | null {
  const index = TIER_THRESHOLDS.findIndex(t => t.tier === currentTier);
  if (index <= 0) return null; // Already Diamond or not found
  return TIER_THRESHOLDS[index - 1];
}

/**
 * Export thresholds for display purposes
 */
export { TIER_THRESHOLDS };
```

### 2.3 `lib/social/tier-utils.ts`

Single source of truth for tier colors and icons. Replaces 4 duplicated functions across pages.

```typescript
import type { TierLevel } from './types';

/**
 * Gradient classes for tier badges/avatars
 */
export function getTierGradient(tier: TierLevel | string): string {
  if (tier.includes('Diamond')) return 'from-cyan-500 to-blue-500';
  if (tier.includes('Platinum')) return 'from-purple-500 to-pink-500';
  if (tier.includes('Gold')) return 'from-yellow-500 to-orange-500';
  return 'from-gray-500 to-gray-400';
}

/**
 * Tier badge text color
 */
export function getTierTextColor(tier: TierLevel | string): string {
  if (tier.includes('Diamond')) return 'text-cyan-400';
  if (tier.includes('Platinum')) return 'text-purple-400';
  if (tier.includes('Gold')) return 'text-yellow-400';
  return 'text-gray-400';
}

/**
 * Lucide icon name for each tier (use in components with dynamic import)
 * Diamond = Gem, Platinum = Trophy, Gold = Award, Silver = Medal
 */
export function getTierIconName(tier: TierLevel | string): 'Gem' | 'Trophy' | 'Award' | 'Medal' {
  if (tier.includes('Diamond')) return 'Gem';
  if (tier.includes('Platinum')) return 'Trophy';
  if (tier.includes('Gold')) return 'Award';
  return 'Medal';
}

/**
 * All tier levels in order (highest to lowest)
 */
export const TIER_ORDER: TierLevel[] = ['Diamond', 'Platinum', 'Gold', 'Silver'];
```

### 2.4 `lib/social/whale-detector.ts`

Whale identification and alert generation.

```typescript
import type { TraderProfile, WhaleAlert } from './types';

const WHALE_THRESHOLD = 50000;        // $50k+ invested = whale
const WHALE_ALERT_MIN_AMOUNT = 10000; // Actions $10k+ generate alerts

const WHALE_ALERTS_KEY = 'whale_alerts';

/**
 * Check if a trader qualifies as a whale
 */
export function isWhale(totalInvested: number): boolean {
  return totalInvested >= WHALE_THRESHOLD;
}

/**
 * Check if an action should generate a whale alert
 */
export function shouldGenerateAlert(
  totalInvested: number,
  actionAmount: number
): boolean {
  return isWhale(totalInvested) && actionAmount >= WHALE_ALERT_MIN_AMOUNT;
}

/**
 * Create a whale alert
 */
export function createWhaleAlert(
  trader: TraderProfile,
  action: 'invested' | 'withdrew' | 'profit',
  amount: number,
  botName: string,
  botSlug: string
): WhaleAlert | null {
  if (!shouldGenerateAlert(trader.stats.totalInvested, amount)) {
    return null;
  }

  const alert: WhaleAlert = {
    id: `whale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    traderId: trader.userId,
    traderUsername: trader.username,
    traderDisplayName: trader.displayName,
    traderTier: trader.tier,
    traderVerified: trader.verified,
    traderAvatar: trader.avatar,
    action,
    amount,
    botName,
    botSlug,
    timestamp: Date.now(),
    totalInvested: trader.stats.totalInvested,
    totalProfit: trader.stats.totalProfit,
  };

  // Persist
  const alerts = getWhaleAlerts();
  alerts.unshift(alert);
  // Keep only last 100 alerts
  const trimmed = alerts.slice(0, 100);
  if (typeof window !== 'undefined') {
    localStorage.setItem(WHALE_ALERTS_KEY, JSON.stringify(trimmed));
  }

  return alert;
}

/**
 * Get all whale alerts
 */
export function getWhaleAlerts(): WhaleAlert[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(WHALE_ALERTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Get whale alerts filtered by criteria
 */
export function getFilteredWhaleAlerts(
  filter: 'all' | 'invested' | 'profit' | 'withdrew' = 'all',
  minAmount: number = 0
): WhaleAlert[] {
  return getWhaleAlerts().filter(alert => {
    if (filter !== 'all' && alert.action !== filter) return false;
    if (alert.amount < minAmount) return false;
    return true;
  });
}

/**
 * Get top whales by total invested (unique traders)
 */
export function getTopWhales(limit: number = 5): WhaleAlert[] {
  const alerts = getWhaleAlerts();
  const uniqueMap = new Map<string, WhaleAlert>();

  for (const alert of alerts) {
    const existing = uniqueMap.get(alert.traderId);
    if (!existing || alert.totalInvested > existing.totalInvested) {
      uniqueMap.set(alert.traderId, alert);
    }
  }

  return Array.from(uniqueMap.values())
    .sort((a, b) => b.totalInvested - a.totalInvested)
    .slice(0, limit);
}

export { WHALE_THRESHOLD, WHALE_ALERT_MIN_AMOUNT };
```

### 2.5 `lib/social/follow-system.ts`

Follow/unfollow with localStorage persistence.

```typescript
import type { FollowData } from './types';

const FOLLOW_KEY = 'social_follows';

/**
 * Get follow data for a user
 */
function getFollowData(userId: string = 'user_default'): FollowData {
  if (typeof window === 'undefined') return { userId, following: [] };

  const data = localStorage.getItem(FOLLOW_KEY);
  if (!data) return { userId, following: [] };

  try {
    const allFollows: FollowData[] = JSON.parse(data);
    return allFollows.find(f => f.userId === userId) || { userId, following: [] };
  } catch {
    return { userId, following: [] };
  }
}

/**
 * Save follow data
 */
function saveFollowData(followData: FollowData): void {
  if (typeof window === 'undefined') return;

  const data = localStorage.getItem(FOLLOW_KEY);
  let allFollows: FollowData[] = [];

  try {
    if (data) allFollows = JSON.parse(data);
  } catch {
    allFollows = [];
  }

  const index = allFollows.findIndex(f => f.userId === followData.userId);
  if (index >= 0) {
    allFollows[index] = followData;
  } else {
    allFollows.push(followData);
  }

  localStorage.setItem(FOLLOW_KEY, JSON.stringify(allFollows));
}

/**
 * Follow a trader
 */
export function followTrader(traderId: string, userId: string = 'user_default'): void {
  const data = getFollowData(userId);
  if (!data.following.includes(traderId)) {
    data.following.push(traderId);
    saveFollowData(data);
  }
}

/**
 * Unfollow a trader
 */
export function unfollowTrader(traderId: string, userId: string = 'user_default'): void {
  const data = getFollowData(userId);
  data.following = data.following.filter(id => id !== traderId);
  saveFollowData(data);
}

/**
 * Check if following a trader
 */
export function isFollowing(traderId: string, userId: string = 'user_default'): boolean {
  const data = getFollowData(userId);
  return data.following.includes(traderId);
}

/**
 * Get all followed trader IDs
 */
export function getFollowing(userId: string = 'user_default'): string[] {
  return getFollowData(userId).following;
}

/**
 * Get follower count for a trader (across all users)
 */
export function getFollowerCount(traderId: string): number {
  if (typeof window === 'undefined') return 0;

  const data = localStorage.getItem(FOLLOW_KEY);
  if (!data) return 0;

  try {
    const allFollows: FollowData[] = JSON.parse(data);
    return allFollows.filter(f => f.following.includes(traderId)).length;
  } catch {
    return 0;
  }
}

/**
 * Toggle follow state, returns new isFollowing state
 */
export function toggleFollow(traderId: string, userId: string = 'user_default'): boolean {
  if (isFollowing(traderId, userId)) {
    unfollowTrader(traderId, userId);
    return false;
  } else {
    followTrader(traderId, userId);
    return true;
  }
}
```

### 2.6 `lib/social/feed-generator.ts`

Auto-generates feed events. Users do NOT create posts.

```typescript
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
```

### 2.7 `lib/social/social-interactions.ts`

Like persistence with localStorage.

```typescript
const LIKES_KEY = 'social_likes';

interface LikeData {
  userId: string;
  likedEventIds: string[];  // Feed event IDs
}

/**
 * Get user's liked event IDs
 */
function getUserLikes(userId: string = 'user_default'): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LIKES_KEY);
  if (!data) return [];
  try {
    const allLikes: LikeData[] = JSON.parse(data);
    const userData = allLikes.find(l => l.userId === userId);
    return userData?.likedEventIds || [];
  } catch {
    return [];
  }
}

/**
 * Save user's likes
 */
function saveUserLikes(userId: string, likedEventIds: string[]): void {
  if (typeof window === 'undefined') return;
  const data = localStorage.getItem(LIKES_KEY);
  let allLikes: LikeData[] = [];
  try {
    if (data) allLikes = JSON.parse(data);
  } catch {
    allLikes = [];
  }

  const index = allLikes.findIndex(l => l.userId === userId);
  if (index >= 0) {
    allLikes[index].likedEventIds = likedEventIds;
  } else {
    allLikes.push({ userId, likedEventIds });
  }

  localStorage.setItem(LIKES_KEY, JSON.stringify(allLikes));
}

/**
 * Toggle like on a feed event. Returns new like state.
 */
export function toggleLike(eventId: string, userId: string = 'user_default'): boolean {
  const likes = getUserLikes(userId);
  const isLiked = likes.includes(eventId);

  if (isLiked) {
    saveUserLikes(userId, likes.filter(id => id !== eventId));
    // Also update like count in feed events
    updateFeedEventLikes(eventId, userId, false);
    return false;
  } else {
    saveUserLikes(userId, [...likes, eventId]);
    updateFeedEventLikes(eventId, userId, true);
    return true;
  }
}

/**
 * Check if user liked an event
 */
export function isLiked(eventId: string, userId: string = 'user_default'): boolean {
  return getUserLikes(userId).includes(eventId);
}

/**
 * Update like count on a feed event in storage
 */
function updateFeedEventLikes(eventId: string, userId: string, add: boolean): void {
  if (typeof window === 'undefined') return;
  const FEED_KEY = 'social_feed_events';
  const data = localStorage.getItem(FEED_KEY);
  if (!data) return;

  try {
    const events = JSON.parse(data);
    const index = events.findIndex((e: { id: string }) => e.id === eventId);
    if (index >= 0) {
      if (add) {
        events[index].likes += 1;
        if (!events[index].likedBy.includes(userId)) {
          events[index].likedBy.push(userId);
        }
      } else {
        events[index].likes = Math.max(0, events[index].likes - 1);
        events[index].likedBy = events[index].likedBy.filter((id: string) => id !== userId);
      }
      localStorage.setItem(FEED_KEY, JSON.stringify(events));
    }
  } catch {
    // Silently fail
  }
}
```

### 2.8 `lib/social/leaderboard.ts`

Ranking algorithm.

```typescript
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
```

---

## 3. Types & Interfaces

### User Interface Extension (`lib/users.ts`)

Add these fields to the existing `User` interface at line 16:

```typescript
export interface User {
  // EXISTING fields (keep all):
  id: string;
  username: string;
  email: string;
  referralCode: string;
  referredBy: string | null;
  referralPath: string;
  createdAt: number;

  // NEW social fields:
  displayName: string;           // "John Pro" (display name, different from username)
  avatar: string | null;         // URL or null for default
  bio: string;                   // Multi-line bio text
  verified: boolean;             // Admin-set verification flag
  // NOTE: tier is NOT stored on User - it's CALCULATED from stats
  // NOTE: isWhale is NOT stored - it's CALCULATED from totalInvested
}
```

**IMPORTANT:** `tier` and `isWhale` are NOT stored on the User object. They are calculated on-the-fly using `calculateTier()` and `isWhale()` functions. This prevents stale data.

---

## 4. Tier System

### Business Rules

| Tier | Total Profit | Win Rate | Copiers | All 3 required? |
|------|-------------|----------|---------|-----------------|
| Diamond | >= $200,000 | >= 65% | >= 200 | YES |
| Platinum | >= $50,000 | >= 60% | >= 50 | YES |
| Gold | >= $10,000 | >= 55% | >= 10 | YES |
| Silver | default | — | — | Always |

- Calculated on-the-fly (not stored)
- Can go up OR down
- Backend will recalculate periodically (cron) when migrated

### Verified Badge

- **Separate from tier** — a Diamond trader may NOT be verified
- **Admin-only** — cannot be earned automatically
- **Stored as `verified: boolean`** on User
- Represents: KYC passed, identity confirmed, or manually approved by admin

---

## 5. Whale Detection

### Business Rules

- **Whale** = trader with `totalInvested >= $50,000`
- **Whale Alert** = any whale action with `amount >= $10,000`
- Actions: `invested`, `withdrew`, `profit`
- Whale is NOT a tier — it's a separate boolean flag
- A Silver trader can be a whale (rich but bad stats)
- A Diamond trader may NOT be a whale (great stats, small capital)

### Whales Page Data Flow

```
1. System detects whale action (investment, withdrawal, profit)
2. createWhaleAlert() generates WhaleAlert object
3. Stored in localStorage ('whale_alerts')
4. Whales page reads from getFilteredWhaleAlerts()
5. Top Whales sidebar reads from getTopWhales()
```

---

## 6. Follow System

### Business Rules

- User can follow/unfollow any trader
- Follow state persisted in localStorage
- "Following" tab in Feed shows only events from followed traders
- Follow count shown on trader cards and profiles
- No mutual follow concept (one-directional)

### API Surface

```typescript
followTrader(traderId)    → void
unfollowTrader(traderId)  → void
isFollowing(traderId)     → boolean
getFollowing()            → string[]
getFollowerCount(traderId) → number
toggleFollow(traderId)    → boolean (new state)
```

---

## 7. Feed Generator

### Event Types

| Type | Trigger | Template |
|------|---------|----------|
| `milestone` | Trader profit crosses threshold ($1k, $5k, $10k, $25k, $50k, $100k, $250k, $500k, $1M) | "{name} reached {milestone} total profit!" |
| `whale-move` | Whale performs action >= $10k | "{name} {action} ${amount} in {botName}" |
| `rank-change` | Trader enters/exits top 10 | "{name} climbed to #{rank} on leaderboard" |
| `new-copy` | Weekly summary of copy activity | "{count} traders copied {name} this week" |

### Feed Tabs

| Tab | Data Source | Sort |
|-----|-----------|------|
| **For You** | All events | Tier weight + recency (Diamond events rank higher within same hour) |
| **Following** | Events from followed traders only | Chronological (newest first) |
| **Trending** | Events from last 24h | Most likes first |

### Interactions

- **Like** — persisted in localStorage, counter updates in real-time
- **NO comments** — remove comment section entirely
- **NO reposts** — remove repost button
- **NO bookmarks** — remove bookmark button (or keep as local-only if UI looks bare)

---

## 8. Social Interactions

### Likes Only

```typescript
toggleLike(eventId)  → boolean (new state)
isLiked(eventId)     → boolean
```

- Persisted in localStorage
- Updates like count on FeedEvent
- Shown as heart icon + count

### What NOT to implement

- Comments (removed)
- Reposts (removed)
- Shares (removed)
- Bookmarks (removed — optional: keep as local-only UI sugar)
- DMs (not in scope)
- Reviews/ratings (removed)

---

## 9. Leaderboard Algorithm

### Ranking

```
Category: profit  → sort traders by totalProfit DESC
Category: return  → sort traders by monthlyReturn DESC
Category: winRate → sort traders by winRate DESC (min 50 trades)
```

### Time Periods

For MVP (localStorage), time periods show the same data with different labels. When backend is implemented:

```
weekly   → stats from last 7 days only
monthly  → stats from last 30 days only
all-time → full history stats
```

### Search

Add trader name search to leaderboard (currently missing). Filter by username or displayName, case-insensitive.

---

## 10. Page Modifications

### 10.1 Feed Page (`app/dashboard-v2/feed/page.tsx`)

**Current:** 880 lines, mock data, comments, reposts, bookmarks, streaks
**Target:** ~500 lines, auto-generated feed, likes only, no streaks

#### REMOVE:
- Lines 8-11: `MessageCircle, Repeat2, Bookmark, BookmarkCheck` imports
- Lines 20-29: `Flame` import (used for streaks)
- Lines 33-152: ALL mock data (`mockPosts`, `whaleAlerts`, `topTraders`)
- Lines 163-164: `showComments`, `commentText` state
- Lines 207-232: `toggleBookmark`, `toggleRepost` functions
- Lines 418-454: Comment button, repost button, bookmark button from milestone post
- Lines 536-580: Comment/helpful/bookmark buttons from bot-review post
- Lines 584-655: Entire comments section
- Lines 773-803: Entire streak widget sidebar section

#### ADD:
- Import `lib/social/` modules at top
- Replace mock data with `getForYouFeed()`, `getFollowingFeed()`, `getTrendingFeed()`
- Use `toggleLike()` from social-interactions instead of local state
- Use `isLiked()` for heart fill state
- Import `getTierGradient`, `getTierIconName` from tier-utils (remove local `getTierColor`)
- Add Follow button on each post (using `toggleFollow`)
- Tabs must actually filter: For You / Following / Trending use different data sources

#### KEEP:
- Stats bar (top 4 cards)
- Feed layout (main + sidebar)
- Like button (but wire to persisted social-interactions)
- Copy Strategy button (keep as-is for now, backend will implement)
- Whale Alerts sidebar widget
- Weekly Top 3 sidebar widget
- Your Bots sidebar widget

#### POST TYPES (replace current 3 types):
- `milestone` — Trader crossed profit threshold
- `whale-move` — Whale large action (replaces whale-alert post type)
- `rank-change` — Leaderboard movement
- `new-copy` — Copy activity summary

Remove `bot-review` post type entirely (user-generated content).

### 10.2 Whales Page (`app/dashboard-v2/whales/page.tsx`)

**Current:** 530 lines, mock data
**Target:** ~400 lines, using whale-detector module

#### CHANGES:
- Lines 38-159: Replace `mockWhaleActivities` with `getFilteredWhaleAlerts(filter, minAmount)`
- Lines 208-220: Replace local `getTierColor`/`getTierIcon` with imports from `tier-utils`
- Lines 222-225: Replace `uniqueWhales` with `getTopWhales(5)`
- Add Follow button next to "Copy Strategy" button
- Keep all existing filters (activity type, min amount) — they work well

### 10.3 Traders Page (`app/dashboard-v2/traders/page.tsx`)

**Current:** 580 lines, mock data
**Target:** ~500 lines, shared types, Follow button

#### CHANGES:
- Lines 23-40: Replace local `Trader` interface with import from `types.ts`
- Lines 42-187: Replace `mockTraders` with data from TraderProfile[]
- Lines 238-250: Replace local `getTierColor`/`getTierIcon` with imports from `tier-utils`
- Add Follow/Unfollow button on each trader card (between stats and "View Profile")
- Use `calculateTier()` to compute tier from stats (not hardcoded)
- Search already works — keep as-is

### 10.4 Leaderboard Page (`app/dashboard-v2/leaderboard/page.tsx`)

**Current:** 543 lines, mock data, non-functional filters
**Target:** ~500 lines, working filters, search

#### CHANGES:
- Lines 39-138: Replace `mockLeaderboard` with `calculateLeaderboard(traders, category, timeFrame)`
- Lines 148-154: Replace local `getRankChange` with import from `leaderboard.ts`
- Lines 156-175: Replace local tier utils with imports from `tier-utils`
- **ADD: Search input** (like Traders page) for searching by trader name
- **FIX: Filters** — category and timeFrame must actually re-sort data
- "Your Position" card must use real current user data

### 10.5 Trader Profile (`app/dashboard-v2/traders/[username]/page.tsx`)

**Current:** 520 lines, hardcoded john_pro data only
**Target:** ~500 lines, dynamic data loading

#### CHANGES:
- Lines 11-85: Replace hardcoded `traderData` with dynamic lookup by `params.username`
- Use `calculateTier(stats)` to compute tier
- Use `isWhale(totalInvested)` to determine whale status
- **Follow button:** Wire to `toggleFollow(userId)` with visual state
- **Copy Strategy modal:** Keep UI, button stays as placeholder until backend
- Remove `rating` and `reviews` references (lines 25-26 in stats)
- Remove streak references (line 81 `longestStreak`)

### 10.6 Sidebar (`components/dashboard-v2/Sidebar.tsx`)

**No changes needed.** Navigation links are correct.

---

## 11. What to Remove

### From Feed Page:
- [ ] Streak widget (lines 773-803)
- [ ] Comments section (lines 584-655)
- [ ] Repost button and logic
- [ ] Bookmark button and logic
- [ ] `bot-review` post type (lines 498-581)
- [ ] `Flame` icon import (streaks)
- [ ] `MessageCircle` icon (comments)
- [ ] `Repeat2` icon (reposts)
- [ ] `Bookmark`, `BookmarkCheck` icons

### From Trader Profile:
- [ ] `rating` and `reviews` stats
- [ ] `longestStreak` stat

### From All Pages:
- [ ] Local `getTierColor()` function (4 copies) → use `tier-utils.ts`
- [ ] Local `getTierIcon()` function (4 copies) → use `tier-utils.ts`
- [ ] All mock data arrays (replace with lib/social/ calls)

---

## 12. Implementation Order

Execute in this exact order to avoid dependency issues:

### Step 1: Create type definitions
```
CREATE lib/social/types.ts
```
No dependencies. All other modules import from here.

### Step 2: Create utility modules (no cross-dependencies)
```
CREATE lib/social/tier-system.ts
CREATE lib/social/tier-utils.ts
CREATE lib/social/whale-detector.ts
CREATE lib/social/follow-system.ts
CREATE lib/social/social-interactions.ts
CREATE lib/social/leaderboard.ts
CREATE lib/social/feed-generator.ts
```
Each module only imports from `types.ts`. Can be created in parallel.

### Step 3: Update User model
```
MODIFY lib/users.ts — Add displayName, avatar, bio, verified fields
```

### Step 4: Create mock data seed
```
CREATE lib/social/mock-seed.ts
```
Function that populates localStorage with realistic mock data for all social features. Called once on first load. This replaces the hardcoded mock arrays in each page. Should create:
- 20-30 trader profiles with calculated tiers
- 50+ feed events (milestones, whale moves, rank changes)
- 30+ whale alerts
- Realistic stat distributions (NOT all profitable, NOT all high win rates)

**Realistic stat ranges:**
- Win rate: 45-75% (NOT 80%+)
- Monthly return: 2-25% (NOT 100%+)
- Include some negative months
- Some traders with losses

### Step 5: Modify pages (one at a time)
```
1. MODIFY traders/page.tsx      — Simplest, mostly data source swap + Follow button
2. MODIFY whales/page.tsx       — Data source swap + Follow button
3. MODIFY leaderboard/page.tsx  — Data source + working filters + search
4. MODIFY feed/page.tsx         — Biggest change: remove comments/streaks, new post types
5. MODIFY traders/[username]/page.tsx — Dynamic data + working buttons
```

### Step 6: Verify
```
npm run build — Must compile without errors
npm run dev — Manual visual check of all 5 pages
```

---

## Mock Data Seed Specification

### `lib/social/mock-seed.ts`

```typescript
/**
 * Seeds localStorage with realistic social data
 * Called once on first app load (check flag 'social_data_seeded')
 *
 * Creates:
 * - 25 TraderProfiles with realistic distributions
 * - 50 FeedEvents across all types
 * - 30 WhaleAlerts
 * - Some follow relationships
 */

const SEED_FLAG = 'social_data_seeded';
const TRADERS_KEY = 'social_traders';

export function seedSocialData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEED_FLAG)) return; // Already seeded

  // ... Generate data ...

  localStorage.setItem(SEED_FLAG, 'true');
}

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

export function getTraderByUsername(username: string): TraderProfile | null {
  return getSocialTraders().find(t => t.username === username) || null;
}
```

### Mock Trader Distribution (25 traders):
- 2 Diamond (top performers, high copiers)
- 4 Platinum (solid performers)
- 8 Gold (mid-tier, growing)
- 11 Silver (new/average traders)
- 3-5 are whales ($50k+)
- 4-6 are verified
- Win rates: 45-75% (bell curve around 58%)
- Monthly returns: -5% to +25% (bell curve around 8%)

---

## Notes for Backend Migration

When migrating to backend API:

1. **Replace localStorage reads** with API calls (`fetch('/api/social/traders')`)
2. **Tier calculation** moves to backend cron job (recalculate daily)
3. **Whale alerts** become real-time via WebSocket
4. **Feed events** generated by backend event system
5. **Follow/likes** become database operations
6. **Leaderboard** pre-calculated and cached in Redis
7. **Search** uses database full-text search instead of client-side filter

All localStorage keys used:
- `social_traders` — Trader profiles
- `social_feed_events` — Feed events
- `whale_alerts` — Whale alerts
- `social_follows` — Follow relationships
- `social_likes` — Like data
- `social_data_seeded` — Seed flag

---

## Checklist

- [ ] `lib/social/types.ts` created
- [ ] `lib/social/tier-system.ts` created
- [ ] `lib/social/tier-utils.ts` created
- [ ] `lib/social/whale-detector.ts` created
- [ ] `lib/social/follow-system.ts` created
- [ ] `lib/social/feed-generator.ts` created
- [ ] `lib/social/social-interactions.ts` created
- [ ] `lib/social/leaderboard.ts` created
- [ ] `lib/social/mock-seed.ts` created
- [ ] `lib/users.ts` updated with social fields
- [ ] `feed/page.tsx` refactored (no comments, no streaks, auto-generated feed)
- [ ] `whales/page.tsx` connected to whale-detector
- [ ] `traders/page.tsx` connected to shared types + Follow button
- [ ] `leaderboard/page.tsx` working filters + search
- [ ] `traders/[username]/page.tsx` dynamic data + working Follow
- [ ] All 4 `getTierColor` duplicates replaced with `tier-utils.ts`
- [ ] `npm run build` passes
- [ ] Visual check of all 5 pages
