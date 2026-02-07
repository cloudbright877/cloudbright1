/**
 * Referral Link Management
 *
 * Tracks:
 * - Referral link clicks
 * - Successful registrations via referral code
 * - Conversion statistics
 */

import { storage } from './storage/LocalStorageAdapter';

const REFERRAL_LINKS_KEY = 'referral_links';

export interface ReferralLink {
  id: string; // Same as userId (required by storage adapter)
  userId: string;
  code: string; // 'JOHNDOE123'
  clicks: number; // Total link clicks
  registrations: number; // Successful sign-ups
  url: string; // Full URL (e.g., '/register?ref=JOHNDOE123')
  createdAt: number;
}

/**
 * Create or get referral link for a user
 */
export async function getOrCreateReferralLink(
  userId: string,
  referralCode: string
): Promise<ReferralLink> {
  let link = await storage.get<ReferralLink>(REFERRAL_LINKS_KEY, userId);

  if (!link) {
    link = {
      id: userId,
      userId,
      code: referralCode,
      clicks: 0,
      registrations: 0,
      url: `/register?ref=${referralCode}`,
      createdAt: Date.now(),
    };
    await storage.create(REFERRAL_LINKS_KEY, link);
  }

  return link;
}

/**
 * Get referral link for a user
 */
export async function getReferralLink(userId: string): Promise<ReferralLink | null> {
  return storage.get<ReferralLink>(REFERRAL_LINKS_KEY, userId);
}

/**
 * Increment click count
 */
export async function incrementClicks(userId: string): Promise<void> {
  const link = await getReferralLink(userId);

  if (link) {
    await storage.update<ReferralLink>(REFERRAL_LINKS_KEY, userId, {
      clicks: link.clicks + 1,
    });
    console.log(`[ReferralLinks] Click recorded for ${userId}`);
  }
}

/**
 * Increment registration count
 */
export async function incrementRegistrations(userId: string): Promise<void> {
  const link = await getReferralLink(userId);

  if (link) {
    await storage.update<ReferralLink>(REFERRAL_LINKS_KEY, userId, {
      registrations: link.registrations + 1,
    });
    console.log(`[ReferralLinks] Registration recorded for ${userId}`);
  }
}

/**
 * Get conversion rate for a user (registrations / clicks)
 */
export async function getConversionRate(userId: string): Promise<number> {
  const link = await getReferralLink(userId);

  if (!link || link.clicks === 0) return 0;

  return (link.registrations / link.clicks) * 100;
}

/**
 * Get referral link statistics
 */
export async function getReferralStats(userId: string): Promise<{
  clicks: number;
  registrations: number;
  conversionRate: number;
  url: string;
} | null> {
  const link = await getReferralLink(userId);

  if (!link) return null;

  const conversionRate = await getConversionRate(userId);

  return {
    clicks: link.clicks,
    registrations: link.registrations,
    conversionRate,
    url: link.url,
  };
}

/**
 * Clear all referral links (for testing)
 */
export async function clearAllReferralLinks(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_LINKS_KEY);
  }
  console.log('[ReferralLinks] Cleared all referral links');
}
