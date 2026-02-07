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
