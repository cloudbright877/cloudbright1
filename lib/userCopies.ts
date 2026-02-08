/**
 * User Copy - Lightweight record referencing a Master Bot
 *
 * ⚠️ CRITICAL ARCHITECTURE CONCEPT:
 *
 * User copies are NOT TradingBot instances! They are lightweight records
 * that reference a Master Bot and store the user's investment amount.
 *
 * Architecture:
 * ```
 * Master Bot (1 TradingBot instance)
 *   ├── User Copy 1 (lightweight record: { masterBotId, investedAmount })
 *   ├── User Copy 2 (lightweight record)
 *   └── User Copy 3 (lightweight record)
 * ```
 *
 * How it works:
 * - Master Bot trades and generates positions/trades
 * - User copies DON'T trade - they just reference the master
 * - Stats are calculated on-the-fly from master bot (see lib/userCopyStats.ts)
 * - Positions are scaled proportionally to user's invested amount
 *
 * ❌ WRONG: Creating TradingBot instance for each copy (defeats the purpose)
 * ✅ RIGHT: Creating lightweight record that references master bot ID
 */

export type UserCopyStatus = 'ACTIVE' | 'CLOSING' | 'CLOSED';

export interface UserCopy {
  id: string; // copy_1234567890_abc123
  userId: string; // user_default (for now)
  masterBotId: string; // demo-btc-scalper
  investedAmount: number; // User's investment
  status: UserCopyStatus; // Lifecycle: ACTIVE → CLOSING → CLOSED
  createdAt: number; // Unix timestamp
  closedAt?: number; // Unix timestamp when closed
  finalPnL?: number; // Final P&L in USDT when closed
  finalValue?: number; // investedAmount + finalPnL

  // Capital Reservation fields
  reservationDays: number; // 30 (set at copy creation)
  earlyExitFee?: number; // $ amount of penalty at close time
  earlyExitPenaltyRate?: number; // % rate applied at close time
  isEarlyExit?: boolean; // true if closed before reservation period

  // Collect P&L fields
  totalCollectedPnL: number; // total profit already withdrawn by user
  collectCount: number; // how many times user collected
  lastCollectAt?: number; // timestamp of last collect (for rate limiting)

  // Concurrency lock (future-proof for Firestore/PostgreSQL)
  operationInProgress: 'collect' | 'archive' | null;

  // Legacy fields (kept for migration compatibility)
  lastSettledPnL?: number;
  lastSettlementAt?: number;
  settlementCount?: number;
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
  const now = Date.now();

  const copy: UserCopy = {
    id: `copy_${now}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    masterBotId,
    investedAmount,
    status: 'ACTIVE', // Default status
    createdAt: now,

    // Capital Reservation
    reservationDays: 30,

    // Collect P&L
    totalCollectedPnL: 0,
    collectCount: 0,
    operationInProgress: null,
  };

  const copies = getAllUserCopies();
  copies.push(copy);
  localStorage.setItem(USER_COPIES_KEY, JSON.stringify(copies));

  console.log(`[UserCopies] Created copy ${copy.id} of ${masterBotId} (status: ACTIVE, reservation: ${copy.reservationDays}d)`);
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
 * Get active user copies by userId
 */
export function getActiveUserCopies(userId: string = 'user_default'): UserCopy[] {
  return getAllUserCopies().filter((c) => c.userId === userId && c.status === 'ACTIVE');
}

/**
 * Get closed user copies by userId
 */
export function getClosedUserCopies(userId: string = 'user_default'): UserCopy[] {
  return getAllUserCopies().filter((c) => c.userId === userId && c.status === 'CLOSED');
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
 * Update a user copy
 */
export function updateUserCopy(copyId: string, data: Partial<UserCopy>): UserCopy | null {
  const copies = getAllUserCopies();
  const index = copies.findIndex((c) => c.id === copyId);

  if (index === -1) {
    console.error(`[UserCopies] Copy ${copyId} not found`);
    return null;
  }

  copies[index] = { ...copies[index], ...data };
  localStorage.setItem(USER_COPIES_KEY, JSON.stringify(copies));

  console.log(`[UserCopies] Updated copy ${copyId}`, data);
  return copies[index];
}

/**
 * Delete a user copy (only for CLOSED copies)
 */
export function deleteUserCopy(copyId: string): void {
  const copy = getUserCopy(copyId);

  if (copy && copy.status !== 'CLOSED') {
    throw new Error(`Cannot delete copy ${copyId}: status is ${copy.status}, must be CLOSED`);
  }

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
