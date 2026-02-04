import type { BotStats, Position, Trade } from './trading/types';

/**
 * Storage utility functions for persisting bot data to localStorage
 *
 * Key format:
 * - bots: Main bot list (IDs + configs)
 * - bot_stats_{botId}: Bot statistics
 * - bot_positions_{botId}: Open positions
 * - bot_trades_{botId}: Trade history
 */

// ============================================================================
// Bot Stats
// ============================================================================

export function saveBotStats(botId: string, stats: BotStats): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `bot_stats_${botId}`;
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (error) {
    console.error(`[Storage] Error saving stats for bot ${botId}:`, error);
  }
}

export function loadBotStats(botId: string): BotStats | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `bot_stats_${botId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[Storage] Error loading stats for bot ${botId}:`, error);
    return null;
  }
}

// ============================================================================
// Positions
// ============================================================================

export function saveBotPositions(botId: string, positions: Position[]): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `bot_positions_${botId}`;
    localStorage.setItem(key, JSON.stringify(positions));
  } catch (error) {
    console.error(`[Storage] Error saving positions for bot ${botId}:`, error);
  }
}

export function loadBotPositions(botId: string): Position[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `bot_positions_${botId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[Storage] Error loading positions for bot ${botId}:`, error);
    return null;
  }
}

// ============================================================================
// Trades
// ============================================================================

export function saveBotTrades(botId: string, trades: Trade[]): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `bot_trades_${botId}`;
    // Only save last 100 trades to avoid localStorage limits
    const limitedTrades = trades.slice(0, 100);
    localStorage.setItem(key, JSON.stringify(limitedTrades));
  } catch (error) {
    console.error(`[Storage] Error saving trades for bot ${botId}:`, error);
  }
}

export function loadBotTrades(botId: string): Trade[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `bot_trades_${botId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[Storage] Error loading trades for bot ${botId}:`, error);
    return null;
  }
}

// ============================================================================
// Storage Info
// ============================================================================

/**
 * Get localStorage usage information
 * @returns Object with used/total storage in bytes
 */
export function getStorageInfo(): {
  usedBytes: number;
  usedKB: number;
  usedMB: number;
  estimatedLimit: number;
  percentUsed: number;
} {
  if (typeof window === 'undefined') {
    return { usedBytes: 0, usedKB: 0, usedMB: 0, estimatedLimit: 5242880, percentUsed: 0 };
  }

  let usedBytes = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      usedBytes += key.length + (localStorage[key]?.length || 0);
    }
  }

  const estimatedLimit = 5 * 1024 * 1024; // 5 MB (typical browser limit)
  const usedKB = usedBytes / 1024;
  const usedMB = usedKB / 1024;
  const percentUsed = (usedBytes / estimatedLimit) * 100;

  return {
    usedBytes,
    usedKB: Math.round(usedKB * 100) / 100,
    usedMB: Math.round(usedMB * 100) / 100,
    estimatedLimit,
    percentUsed: Math.round(percentUsed * 100) / 100,
  };
}

/**
 * Clear all bot-related data from localStorage
 * WARNING: This will delete ALL bot data
 */
export function clearAllBotData(): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  const botKeys = keys.filter(key =>
    key.startsWith('bot_') || key === 'bots'
  );

  botKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log(`[Storage] Cleared ${botKeys.length} bot-related keys from localStorage`);
}

/**
 * Export all bot data as JSON string
 * Useful for debugging or backup
 */
export function exportAllBotData(): string {
  if (typeof window === 'undefined') return '{}';

  const data: Record<string, any> = {};

  const keys = Object.keys(localStorage);
  const botKeys = keys.filter(key =>
    key.startsWith('bot_') || key === 'bots'
  );

  botKeys.forEach(key => {
    try {
      data[key] = JSON.parse(localStorage[key]);
    } catch {
      data[key] = localStorage[key];
    }
  });

  return JSON.stringify(data, null, 2);
}

/**
 * Import bot data from JSON string
 * WARNING: This will overwrite existing data
 */
export function importBotData(jsonString: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = JSON.parse(jsonString);

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('bot_') || key === 'bots') {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    console.log('[Storage] Successfully imported bot data');
    return true;
  } catch (error) {
    console.error('[Storage] Error importing bot data:', error);
    return false;
  }
}
