/**
 * User Copy - Lightweight record referencing a Master Bot
 *
 * User copies do NOT trade independently. They are records that reference
 * a master bot and store the user's investment amount. Stats are calculated
 * proportionally from the master bot.
 */

export interface UserCopy {
  id: string; // copy_1234567890_abc123
  userId: string; // user_default (for now)
  masterBotId: string; // demo-btc-scalper
  investedAmount: number; // User's investment
  createdAt: number; // Unix timestamp
}

// Storage key
const USER_COPIES_KEY = 'user_copies';

/**
 * Create a new user copy
 */
export function createUserCopy(
  masterBotId: string,
  investedAmount: number,
  userId: string = 'user_default'
): string {
  const copy: UserCopy = {
    id: `copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    masterBotId,
    investedAmount,
    createdAt: Date.now(),
  };

  const copies = getAllUserCopies();
  copies.push(copy);
  localStorage.setItem(USER_COPIES_KEY, JSON.stringify(copies));

  console.log(`[UserCopies] Created copy ${copy.id} of ${masterBotId}`);
  return copy.id;
}

/**
 * Get all user copies
 */
export function getAllUserCopies(): UserCopy[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(USER_COPIES_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('[UserCopies] Failed to parse copies:', error);
    return [];
  }
}

/**
 * Get user copies by userId
 */
export function getUserCopies(userId: string = 'user_default'): UserCopy[] {
  return getAllUserCopies().filter((c) => c.userId === userId);
}

/**
 * Get single user copy by ID
 */
export function getUserCopy(copyId: string): UserCopy | null {
  return getAllUserCopies().find((c) => c.id === copyId) || null;
}

/**
 * Get all copies of a specific master bot
 */
export function getAllCopiesOfMaster(masterBotId: string): UserCopy[] {
  return getAllUserCopies().filter((c) => c.masterBotId === masterBotId);
}

/**
 * Delete a user copy
 */
export function deleteUserCopy(copyId: string): void {
  const copies = getAllUserCopies().filter((c) => c.id !== copyId);
  localStorage.setItem(USER_COPIES_KEY, JSON.stringify(copies));
  console.log(`[UserCopies] Deleted copy ${copyId}`);
}

/**
 * Clear all user copies (for testing)
 */
export function clearAllUserCopies(): void {
  localStorage.removeItem(USER_COPIES_KEY);
  console.log('[UserCopies] Cleared all copies');
}
