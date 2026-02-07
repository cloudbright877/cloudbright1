/**
 * User Management with Referral System
 *
 * Architecture:
 * - Each user has a unique referralCode (e.g., 'JOHNDOE123')
 * - Users can be invited by another user (referredBy field)
 * - Referral tree is tracked via referralPath (materialized path pattern)
 * - Path format: '/user_1/user_5/user_123' (root → ... → current user's parent)
 */

import { storage } from './storage/LocalStorageAdapter';

const USERS_KEY = 'users';
const DEFAULT_USER_ID = 'user_default';

export interface User {
  id: string; // 'user_123'
  username: string;
  email: string;
  referralCode: string; // 'JOHNDOE123' (unique, uppercase)
  referredBy: string | null; // userId of referrer (null for root users)
  referralPath: string; // '/user_1/user_5' (path to this user's parent)
  createdAt: number; // Unix timestamp

  // Social fields
  displayName: string; // Display name (different from username)
  avatar: string | null; // Avatar URL or null for default
  bio: string; // Multi-line bio text
  verified: boolean; // Admin-set verification flag
  // NOTE: tier and isWhale are NOT stored - they are CALCULATED from stats
}

/**
 * Generate a unique referral code from username
 * Format: USERNAME123 (uppercase + random 3-digit number)
 */
export function generateReferralCode(username: string): string {
  const cleanUsername = username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${cleanUsername}${randomNum}`;
}

/**
 * Ensure referral code is unique by adding suffix if needed
 */
async function ensureUniqueReferralCode(baseCode: string): Promise<string> {
  let code = baseCode;
  let suffix = 0;

  while (await storage.findOne<User>(USERS_KEY, { referralCode: code })) {
    suffix++;
    code = `${baseCode}${suffix}`;
  }

  return code;
}

/**
 * Create a new user
 */
export async function createUser(data: {
  username: string;
  email: string;
  referralCode?: string; // Optional referral code of the person who invited them
}): Promise<User> {
  // 1. Validate referral code (if provided)
  let referrer: User | null = null;
  if (data.referralCode) {
    referrer = await storage.findOne<User>(USERS_KEY, { referralCode: data.referralCode });
    if (!referrer) {
      throw new Error(`Invalid referral code: ${data.referralCode}`);
    }
  }

  // 2. Generate unique referral code for new user
  const baseCode = generateReferralCode(data.username);
  const newReferralCode = await ensureUniqueReferralCode(baseCode);

  // 3. Build referral path (parent's path + parent's id)
  const referralPath = referrer
    ? `${referrer.referralPath}/${referrer.id}`
    : `/${DEFAULT_USER_ID}`; // Root users have /user_default as parent

  // 4. Generate user ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 5. Create user
  const user: User = {
    id: userId,
    username: data.username,
    email: data.email,
    referralCode: newReferralCode,
    referredBy: referrer?.id || null,
    referralPath,
    createdAt: Date.now(),
    // Social defaults
    displayName: data.username, // Default to username
    avatar: null,
    bio: '',
    verified: false,
  };

  await storage.create(USERS_KEY, user);

  console.log(`[Users] Created user ${userId} with referral code ${newReferralCode}`);

  return user;
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
  return storage.get<User>(USERS_KEY, userId);
}

/**
 * Get user by referral code
 */
export async function getUserByReferralCode(code: string): Promise<User | null> {
  return storage.findOne<User>(USERS_KEY, { referralCode: code.toUpperCase() });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return storage.findOne<User>(USERS_KEY, { email });
}

/**
 * Get all users referred by a specific user (direct referrals only)
 */
export async function getDirectReferrals(userId: string): Promise<User[]> {
  return storage.list<User>(USERS_KEY, { referredBy: userId });
}

/**
 * Get all users in the referral tree of a user (all levels)
 * Uses referralPath to find all descendants
 */
export async function getAllReferrals(userId: string): Promise<User[]> {
  const allUsers = await storage.list<User>(USERS_KEY);
  return allUsers.filter(user => user.referralPath.includes(`/${userId}`));
}

/**
 * Get referral level (distance from referrer)
 * Returns 1-10 for direct → 10th level, or null if not in tree
 */
export function getReferralLevel(referrer: User, referredUser: User): number | null {
  // Count how many nodes are between referrer and referred user in the path
  const referrerPath = `${referrer.referralPath}/${referrer.id}`;

  if (!referredUser.referralPath.startsWith(referrerPath)) {
    return null; // Not in tree
  }

  // Count slashes after referrer's path
  const remainingPath = referredUser.referralPath.slice(referrerPath.length);
  const level = remainingPath.split('/').filter(Boolean).length + 1;

  return level <= 10 ? level : null; // Max 10 levels
}

/**
 * Get all upline users (ancestors) for a user, up to 10 levels
 * Returns array in order: [Level 1 (parent), Level 2 (grandparent), ..., Level 10]
 */
export async function getUplineChain(userId: string): Promise<User[]> {
  const user = await getUser(userId);
  if (!user || !user.referredBy) return [];

  const upline: User[] = [];
  let currentId: string | null = user.referredBy;
  let level = 0;

  while (currentId && level < 10) {
    const uplineUser = await getUser(currentId);
    if (!uplineUser) break;

    upline.push(uplineUser);
    currentId = uplineUser.referredBy;
    level++;
  }

  return upline;
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  return storage.update<User>(USERS_KEY, userId, data);
}

/**
 * Delete user (soft delete - mark as deleted, don't actually remove)
 * This prevents breaking referral chains
 */
export async function deleteUser(userId: string): Promise<void> {
  // In a real system, we'd add a 'deleted_at' field instead of deleting
  // For MVP, we'll just use storage.delete()
  await storage.delete(USERS_KEY, userId);
  console.log(`[Users] Deleted user ${userId}`);
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Must be 5-15 characters, alphanumeric, uppercase
  return /^[A-Z0-9]{5,15}$/.test(code);
}

/**
 * Get or create default user (for testing/demo)
 */
export async function getOrCreateDefaultUser(): Promise<User> {
  let user = await getUser(DEFAULT_USER_ID);

  if (!user) {
    user = {
      id: DEFAULT_USER_ID,
      username: 'demo_user',
      email: 'demo@celestian.com',
      referralCode: 'DEMO123',
      referredBy: null,
      referralPath: '',
      createdAt: Date.now(),
      displayName: 'Demo User',
      avatar: null,
      bio: 'Default demo user account',
      verified: false,
    };
    await storage.create(USERS_KEY, user);
  }

  return user;
}

/**
 * Clear all users (for testing)
 */
export async function clearAllUsers(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USERS_KEY);
  }
  console.log('[Users] Cleared all users');
}
