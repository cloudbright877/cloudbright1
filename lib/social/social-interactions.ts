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
