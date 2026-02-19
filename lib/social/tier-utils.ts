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

/**
 * Consistent avatar gradient based on name hash.
 * Returns inline style object — Tailwind JIT can't detect dynamic classes,
 * so we use real CSS values instead.
 */
const AVATAR_COLORS: Array<[string, string]> = [
  ['#fb7185', '#e11d48'], // rose
  ['#fb923c', '#ea580c'], // orange
  ['#fbbf24', '#d97706'], // amber
  ['#34d399', '#059669'], // emerald
  ['#2dd4bf', '#0d9488'], // teal
  ['#22d3ee', '#0891b2'], // cyan
  ['#60a5fa', '#2563eb'], // blue
  ['#818cf8', '#4f46e5'], // indigo
  ['#a78bfa', '#7c3aed'], // violet
  ['#c084fc', '#9333ea'], // purple
  ['#f472b6', '#db2777'], // pink
  ['#f87171', '#dc2626'], // red
  ['#a3e635', '#65a30d'], // lime
];

export function getAvatarStyle(name: string): React.CSSProperties {
  const str = name || 'A';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [from, to] = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return { background: `linear-gradient(to bottom right, ${from}, ${to})` };
}

/** @deprecated Use getAvatarStyle() instead — returns inline style for reliable colors */
export function getAvatarGradient(name: string): string {
  return '';
}
