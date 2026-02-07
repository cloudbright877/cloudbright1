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
