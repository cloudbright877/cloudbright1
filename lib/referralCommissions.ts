/**
 * Referral Commission System
 *
 * Commission Structure:
 * - Level 1 (Direct): 10%
 * - Level 2: 5%
 * - Level 3: 3%
 * - Levels 4-10: 2% each
 * - Total max: 32% of profit
 *
 * Trigger: When a user closes a profitable copy (realized P&L)
 * Payment: Instant credit to upline's available balance
 */

import { storage } from './storage/LocalStorageAdapter';
import { getUplineChain, type User } from './users';
import { creditCommission } from './balances';

const REFERRAL_COMMISSIONS_KEY = 'referral_commissions';

export type CommissionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CommissionStatus = 'PENDING' | 'PAID';

export interface ReferralCommission {
  id: string;
  uplineUserId: string; // Who receives the commission
  investorUserId: string; // Who closed the copy
  userCopyId: string; // Which copy was closed
  level: CommissionLevel; // 1-10
  commissionRate: number; // 0.10, 0.05, 0.03, 0.02
  investorPnL: number; // Investor's profit (before commissions)
  commissionAmount: number; // Commission paid to upline
  status: CommissionStatus;
  createdAt: number;
  paidAt?: number;
}

// Commission rates by level
const COMMISSION_RATES: Record<CommissionLevel, number> = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.03, // 3%
  4: 0.02, // 2%
  5: 0.02, // 2%
  6: 0.02, // 2%
  7: 0.02, // 2%
  8: 0.02, // 2%
  9: 0.02, // 2%
  10: 0.02, // 2%
};

/**
 * Distribute referral commissions when a copy is closed
 * Returns total amount distributed to uplines
 */
export async function distributeReferralCommissions(
  investorUserId: string,
  userCopyId: string,
  profitAmount: number
): Promise<number> {
  // No profit = no commissions
  if (profitAmount <= 0) {
    console.log(`[ReferralCommissions] No profit for copy ${userCopyId}, skipping commission distribution`);
    return 0;
  }

  // Get upline chain (max 10 levels)
  const uplineChain = await getUplineChain(investorUserId);

  if (uplineChain.length === 0) {
    console.log(`[ReferralCommissions] No upline for user ${investorUserId}, skipping commission distribution`);
    return 0;
  }

  let totalDistributed = 0;

  // Distribute to each level
  for (let i = 0; i < uplineChain.length && i < 10; i++) {
    const upline = uplineChain[i];
    const level = (i + 1) as CommissionLevel;
    const rate = COMMISSION_RATES[level];
    const commissionAmount = profitAmount * rate;

    try {
      // Create commission record
      const commission: ReferralCommission = {
        id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uplineUserId: upline.id,
        investorUserId,
        userCopyId,
        level,
        commissionRate: rate,
        investorPnL: profitAmount,
        commissionAmount,
        status: 'PENDING',
        createdAt: Date.now(),
      };

      await storage.create(REFERRAL_COMMISSIONS_KEY, commission);

      // Credit to upline's available balance
      await creditCommission(upline.id, commissionAmount, commission.id);

      // Mark as PAID
      await storage.update<ReferralCommission>(REFERRAL_COMMISSIONS_KEY, commission.id, {
        status: 'PAID',
        paidAt: Date.now(),
      });

      totalDistributed += commissionAmount;

      console.log(
        `[ReferralCommissions] Level ${level}: $${commissionAmount.toFixed(2)} (${(rate * 100).toFixed(0)}%) → ${upline.username}`
      );
    } catch (error) {
      console.error(`[ReferralCommissions] Failed to distribute to level ${level}:`, error);
    }
  }

  console.log(`[ReferralCommissions] Total distributed: $${totalDistributed.toFixed(2)} for copy ${userCopyId}`);
  return totalDistributed;
}

/**
 * Get all commissions for a user (as upline)
 */
export async function getUserCommissions(userId: string): Promise<ReferralCommission[]> {
  const commissions = await storage.list<ReferralCommission>(REFERRAL_COMMISSIONS_KEY, { uplineUserId: userId });
  return commissions.sort((a, b) => b.createdAt - a.createdAt); // Most recent first
}

/**
 * Get total earned commissions for a user
 */
export async function getTotalEarned(userId: string): Promise<number> {
  const commissions = await getUserCommissions(userId);
  return commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
}

/**
 * Get commissions by level
 */
export async function getCommissionsByLevel(userId: string, level: CommissionLevel): Promise<ReferralCommission[]> {
  const allCommissions = await getUserCommissions(userId);
  return allCommissions.filter(c => c.level === level);
}

/**
 * Get recent commissions (last N)
 */
export async function getRecentCommissions(userId: string, limit: number = 10): Promise<ReferralCommission[]> {
  const commissions = await getUserCommissions(userId);
  return commissions.slice(0, limit);
}

/**
 * Get commission stats for a user
 */
export async function getCommissionStats(userId: string): Promise<{
  totalEarned: number;
  totalCommissions: number;
  byLevel: Record<CommissionLevel, { count: number; total: number }>;
}> {
  const commissions = await getUserCommissions(userId);
  const paidCommissions = commissions.filter(c => c.status === 'PAID');

  const totalEarned = paidCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalCommissions = paidCommissions.length;

  // Group by level
  const byLevel: Record<CommissionLevel, { count: number; total: number }> = {
    1: { count: 0, total: 0 },
    2: { count: 0, total: 0 },
    3: { count: 0, total: 0 },
    4: { count: 0, total: 0 },
    5: { count: 0, total: 0 },
    6: { count: 0, total: 0 },
    7: { count: 0, total: 0 },
    8: { count: 0, total: 0 },
    9: { count: 0, total: 0 },
    10: { count: 0, total: 0 },
  };

  paidCommissions.forEach(c => {
    byLevel[c.level].count++;
    byLevel[c.level].total += c.commissionAmount;
  });

  return { totalEarned, totalCommissions, byLevel };
}

/**
 * Get commissions for a specific copy (all levels)
 */
export async function getCommissionsForCopy(userCopyId: string): Promise<ReferralCommission[]> {
  const commissions = await storage.list<ReferralCommission>(REFERRAL_COMMISSIONS_KEY, { userCopyId });
  return commissions.sort((a, b) => a.level - b.level); // Ordered by level
}

/**
 * Calculate expected commissions for a given profit (before closing)
 * Returns breakdown by level
 */
export async function calculateExpectedCommissions(
  investorUserId: string,
  profitAmount: number
): Promise<Array<{ level: CommissionLevel; rate: number; amount: number; upline: User | null }>> {
  if (profitAmount <= 0) return [];

  const uplineChain = await getUplineChain(investorUserId);
  const expected: Array<{ level: CommissionLevel; rate: number; amount: number; upline: User | null }> = [];

  for (let i = 0; i < Math.min(uplineChain.length, 10); i++) {
    const level = (i + 1) as CommissionLevel;
    const rate = COMMISSION_RATES[level];
    const amount = profitAmount * rate;
    const upline = uplineChain[i] || null;

    expected.push({ level, rate, amount, upline });
  }

  return expected;
}

/**
 * Clear all commissions (for testing)
 */
export async function clearAllCommissions(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_COMMISSIONS_KEY);
  }
  console.log('[ReferralCommissions] Cleared all commissions');
}
