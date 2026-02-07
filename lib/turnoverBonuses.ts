/**
 * Turnover Bonus System
 *
 * Concept: Additional bonuses for reaching team turnover milestones
 * Team Turnover = Sum of positive realized P&L from all referrals (losses don't count)
 * Awards: Real-time when threshold is reached
 *
 * 10 Levels:
 * Level 1: $1K turnover → $10 bonus
 * Level 2: $5K turnover → $50 bonus
 * ...
 * Level 10: $1M turnover → $10K bonus
 */

import { storage } from './storage/LocalStorageAdapter';
import { getAllReferrals, getUser } from './users';
import { getClosedUserCopies } from './userCopies';
import { creditTurnoverBonus } from './balances';

const TURNOVER_BONUSES_KEY = 'turnover_bonuses';

export type TurnoverBonusLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type TurnoverBonusStatus = 'PENDING' | 'PAID';

export interface TurnoverBonus {
  id: string;
  userId: string;
  level: TurnoverBonusLevel;
  thresholdAmount: number; // Required team turnover
  bonusAmount: number; // Fixed bonus reward
  teamTurnover: number; // Team turnover at achievement
  achievedAt: number;
  status: TurnoverBonusStatus;
  paidAt?: number;
}

export interface TurnoverLevel {
  level: TurnoverBonusLevel;
  threshold: number; // Min team turnover
  bonus: number; // Fixed payout
}

// 10 turnover bonus levels
export const TURNOVER_LEVELS: TurnoverLevel[] = [
  { level: 1, threshold: 1_000, bonus: 10 },
  { level: 2, threshold: 5_000, bonus: 50 },
  { level: 3, threshold: 10_000, bonus: 100 },
  { level: 4, threshold: 25_000, bonus: 250 },
  { level: 5, threshold: 50_000, bonus: 500 },
  { level: 6, threshold: 100_000, bonus: 1_000 },
  { level: 7, threshold: 250_000, bonus: 2_500 },
  { level: 8, threshold: 500_000, bonus: 5_000 },
  { level: 9, threshold: 750_000, bonus: 7_500 },
  { level: 10, threshold: 1_000_000, bonus: 10_000 },
];

/**
 * Calculate team turnover for a user
 * Team turnover = sum of positive realized P&L from all referrals (all levels)
 */
export async function calculateTeamTurnover(userId: string): Promise<number> {
  // Get all referrals (all levels)
  const referrals = await getAllReferrals(userId);

  let totalTurnover = 0;

  // Sum positive realized P&L from closed copies
  for (const referral of referrals) {
    const closedCopies = await getClosedUserCopies(referral.id);

    for (const copy of closedCopies) {
      if (copy.finalPnL && copy.finalPnL > 0) {
        totalTurnover += copy.finalPnL;
      }
    }
  }

  return totalTurnover;
}

/**
 * Get max achieved level for a user
 */
export async function getMaxAchievedLevel(userId: string): Promise<TurnoverBonusLevel | null> {
  const bonuses = await storage.list<TurnoverBonus>(TURNOVER_BONUSES_KEY, { userId });

  if (bonuses.length === 0) return null;

  const maxLevel = Math.max(...bonuses.map(b => b.level));
  return maxLevel as TurnoverBonusLevel;
}

/**
 * Award a turnover bonus
 */
async function awardTurnoverBonus(
  userId: string,
  levelConfig: TurnoverLevel,
  teamTurnover: number
): Promise<void> {
  // Create bonus record
  const bonus: TurnoverBonus = {
    id: `tb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    level: levelConfig.level,
    thresholdAmount: levelConfig.threshold,
    bonusAmount: levelConfig.bonus,
    teamTurnover,
    achievedAt: Date.now(),
    status: 'PENDING',
  };

  await storage.create(TURNOVER_BONUSES_KEY, bonus);

  // Credit to available balance
  await creditTurnoverBonus(userId, levelConfig.bonus, bonus.id);

  // Mark as PAID
  await storage.update<TurnoverBonus>(TURNOVER_BONUSES_KEY, bonus.id, {
    status: 'PAID',
    paidAt: Date.now(),
  });

  const user = await getUser(userId);
  console.log(
    `[TurnoverBonuses] Level ${levelConfig.level} achieved by ${user?.username}: $${levelConfig.bonus} (turnover: $${teamTurnover.toFixed(2)})`
  );
}

/**
 * Check and award turnover bonuses for a user
 * Called after a referral closes a copy
 */
export async function checkAndAwardTurnoverBonuses(userId: string): Promise<void> {
  // Calculate current team turnover
  const teamTurnover = await calculateTeamTurnover(userId);

  // Get current max achieved level
  const currentLevel = (await getMaxAchievedLevel(userId)) || 0;

  // Check for new level achievements
  for (const levelConfig of TURNOVER_LEVELS) {
    if (levelConfig.level > currentLevel && teamTurnover >= levelConfig.threshold) {
      // Award bonus
      await awardTurnoverBonus(userId, levelConfig, teamTurnover);
    }
  }
}

/**
 * Get all bonuses for a user
 */
export async function getUserBonuses(userId: string): Promise<TurnoverBonus[]> {
  const bonuses = await storage.list<TurnoverBonus>(TURNOVER_BONUSES_KEY, { userId });
  return bonuses.sort((a, b) => a.level - b.level); // Ordered by level
}

/**
 * Get next level info for a user
 */
export async function getNextLevel(userId: string): Promise<{
  level: TurnoverBonusLevel | null;
  threshold: number;
  bonus: number;
  currentTurnover: number;
  progress: number; // 0-100
} | null> {
  const currentLevel = (await getMaxAchievedLevel(userId)) || 0;

  if (currentLevel >= 10) return null; // Max level reached

  const nextLevelConfig = TURNOVER_LEVELS[currentLevel]; // currentLevel is 0-indexed for array
  const currentTurnover = await calculateTeamTurnover(userId);

  const progress = (currentTurnover / nextLevelConfig.threshold) * 100;

  return {
    level: nextLevelConfig.level,
    threshold: nextLevelConfig.threshold,
    bonus: nextLevelConfig.bonus,
    currentTurnover,
    progress: Math.min(progress, 100),
  };
}

/**
 * Get turnover bonus stats for a user
 */
export async function getTurnoverStats(userId: string): Promise<{
  currentLevel: TurnoverBonusLevel | null;
  teamTurnover: number;
  totalBonusesEarned: number;
  nextLevel: {
    level: TurnoverBonusLevel | null;
    threshold: number;
    bonus: number;
    progress: number;
  } | null;
}> {
  const currentLevel = await getMaxAchievedLevel(userId);
  const teamTurnover = await calculateTeamTurnover(userId);
  const bonuses = await getUserBonuses(userId);
  const totalBonusesEarned = bonuses
    .filter(b => b.status === 'PAID')
    .reduce((sum, b) => sum + b.bonusAmount, 0);

  const nextLevel = await getNextLevel(userId);

  return {
    currentLevel,
    teamTurnover,
    totalBonusesEarned,
    nextLevel,
  };
}

/**
 * Get all turnover levels (for UI display)
 */
export function getAllTurnoverLevels(): TurnoverLevel[] {
  return TURNOVER_LEVELS;
}

/**
 * Get bonus status for each level (for UI display)
 */
export async function getLevelStatuses(userId: string): Promise<
  Array<{
    level: TurnoverBonusLevel;
    threshold: number;
    bonus: number;
    achieved: boolean;
    claimed: boolean;
  }>
> {
  const teamTurnover = await calculateTeamTurnover(userId);
  const bonuses = await getUserBonuses(userId);
  const claimedLevels = new Set(bonuses.filter(b => b.status === 'PAID').map(b => b.level));

  return TURNOVER_LEVELS.map(config => ({
    level: config.level,
    threshold: config.threshold,
    bonus: config.bonus,
    achieved: teamTurnover >= config.threshold,
    claimed: claimedLevels.has(config.level),
  }));
}

/**
 * Clear all turnover bonuses (for testing)
 */
export async function clearAllTurnoverBonuses(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TURNOVER_BONUSES_KEY);
  }
  console.log('[TurnoverBonuses] Cleared all turnover bonuses');
}
