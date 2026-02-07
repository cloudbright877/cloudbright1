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
