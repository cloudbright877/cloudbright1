import type { TraderProfile, WhaleAlert } from './types';

const WHALE_THRESHOLD = 50000;        // $50k+ invested = whale
const WHALE_ALERT_MIN_AMOUNT = 10000; // Actions $10k+ generate alerts

const WHALE_ALERTS_KEY = 'whale_alerts';

/**
 * Check if a trader qualifies as a whale
 */
export function isWhale(totalInvested: number): boolean {
  return totalInvested >= WHALE_THRESHOLD;
}

/**
 * Check if an action should generate a whale alert
 */
export function shouldGenerateAlert(
  totalInvested: number,
  actionAmount: number
): boolean {
  return isWhale(totalInvested) && actionAmount >= WHALE_ALERT_MIN_AMOUNT;
}

/**
 * Create a whale alert
 */
export function createWhaleAlert(
  trader: TraderProfile,
  action: 'invested' | 'withdrew' | 'profit',
  amount: number,
  botName: string,
  botSlug: string
): WhaleAlert | null {
  if (!shouldGenerateAlert(trader.stats.totalInvested, amount)) {
    return null;
  }

  const alert: WhaleAlert = {
    id: `whale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    traderId: trader.userId,
    traderUsername: trader.username,
    traderDisplayName: trader.displayName,
    traderTier: trader.tier,
    traderVerified: trader.verified,
    traderAvatar: trader.avatar,
    action,
    amount,
    botName,
    botSlug,
    timestamp: Date.now(),
    totalInvested: trader.stats.totalInvested,
    totalProfit: trader.stats.totalProfit,
  };

  // Persist
  const alerts = getWhaleAlerts();
  alerts.unshift(alert);
  // Keep only last 100 alerts
  const trimmed = alerts.slice(0, 100);
  if (typeof window !== 'undefined') {
    localStorage.setItem(WHALE_ALERTS_KEY, JSON.stringify(trimmed));
  }

  return alert;
}

/**
 * Get all whale alerts
 */
export function getWhaleAlerts(): WhaleAlert[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(WHALE_ALERTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Get whale alerts filtered by criteria
 */
export function getFilteredWhaleAlerts(
  filter: 'all' | 'invested' | 'profit' | 'withdrew' = 'all',
  minAmount: number = 0
): WhaleAlert[] {
  return getWhaleAlerts().filter(alert => {
    if (filter !== 'all' && alert.action !== filter) return false;
    if (alert.amount < minAmount) return false;
    return true;
  });
}

/**
 * Get top whales by total invested (unique traders)
 */
export function getTopWhales(limit: number = 5): WhaleAlert[] {
  const alerts = getWhaleAlerts();
  const uniqueMap = new Map<string, WhaleAlert>();

  for (const alert of alerts) {
    const existing = uniqueMap.get(alert.traderId);
    if (!existing || alert.totalInvested > existing.totalInvested) {
      uniqueMap.set(alert.traderId, alert);
    }
  }

  return Array.from(uniqueMap.values())
    .sort((a, b) => b.totalInvested - a.totalInvested)
    .slice(0, limit);
}

export { WHALE_THRESHOLD, WHALE_ALERT_MIN_AMOUNT };
