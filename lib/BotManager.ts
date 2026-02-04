import { TradingBot } from './trading/TradingBot';
import type { BotConfig, BotStats } from './trading/types';

/**
 * BotManager - Singleton class to manage all trading bots
 *
 * Responsibilities:
 * - Create/Delete bots
 * - Tick all bots with price updates
 * - Save/Load bots from localStorage
 * - Aggregate stats from all bots
 */
export class BotManager {
  private bots = new Map<string, TradingBot>();

  constructor() {
    // Auto-load bots from localStorage on initialization
    this.load();
  }

  /**
   * Create a new bot with given configuration
   * @param config Bot configuration
   * @param customId Optional custom ID (for Master Bots)
   * @returns Bot ID
   *
   * ⚠️ IMPORTANT: Do NOT use this to create user copies!
   * User copies are NOT TradingBot instances - they are lightweight records.
   * Use createUserCopy() from lib/userCopies.ts instead.
   */
  createBot(config: BotConfig, customId?: string): string {
    const id = customId || `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // PROTECTION: Prevent creating TradingBot instances for user copies
    if (id.startsWith('copy_')) {
      throw new Error(
        `[BotManager] Cannot create TradingBot for copy ID '${id}'!\n` +
        `User copies are lightweight records, not TradingBot instances.\n` +
        `Use createUserCopy() from lib/userCopies.ts instead.`
      );
    }

    const bot = new TradingBot(id, config);
    this.bots.set(id, bot);
    this.save();
    return id;
  }

  /**
   * Delete a bot by ID
   * @param id Bot ID
   */
  deleteBot(id: string): void {
    this.bots.delete(id);
    this.save();

    // Also clear localStorage for this bot's data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`bot_stats_${id}`);
      localStorage.removeItem(`bot_positions_${id}`);
      localStorage.removeItem(`bot_trades_${id}`);
      localStorage.removeItem(`bot_closed_${id}`);
      localStorage.removeItem(`bot_personality_${id}`);
      localStorage.removeItem(`bot_daily_${id}`);
    }
  }

  /**
   * Get a specific bot by ID
   * @param id Bot ID
   * @returns TradingBot instance or undefined
   */
  getBot(id: string): TradingBot | undefined {
    return this.bots.get(id);
  }

  /**
   * Update bot configuration
   * This ensures the config is persisted to BotManager's storage
   * @param id Bot ID
   * @param newConfig Partial config to update
   * @returns true if successful, false if bot not found
   */
  updateBotConfig(id: string, newConfig: Partial<import('./trading/types').BotConfig>): boolean {
    const bot = this.bots.get(id);
    if (!bot) {
      console.error(`[BotManager] Cannot update config: Bot ${id} not found`);
      return false;
    }

    // Update the bot's config
    bot.updateConfig(newConfig);

    // Save BotManager's list of bots (which includes updated config)
    this.save();

    console.log(`[BotManager] Config updated and saved for bot ${id}`);
    return true;
  }

  /**
   * Get all bot IDs
   * @returns Array of bot IDs
   */
  getBotIds(): string[] {
    return Array.from(this.bots.keys());
  }

  /**
   * Get total number of bots
   * @returns Number of bots
   */
  getBotCount(): number {
    return this.bots.size;
  }

  /**
   * Update all bots with new prices
   * This should be called every time prices are updated (e.g., from WebSocket)
   *
   * @param prices Record of symbol -> price (e.g., { "BTCUSDT": 50000, "ETHUSDT": 3000 })
   */
  tick(prices: Record<string, number>): void {
    const botCount = this.bots.size;
    if (botCount > 0) {
      // Log every 10 ticks to avoid spam
      if (Math.random() < 0.1) {
        console.log(`[BotManager] Tick: ${botCount} bots, prices:`, prices);
      }
    }

    this.bots.forEach(bot => {
      bot.tick(prices);
    });
  }

  /**
   * Get stats for a specific bot
   * @param id Bot ID
   * @returns Bot stats or null if bot not found
   */
  getStats(id: string): BotStats | null {
    const bot = this.bots.get(id);
    return bot ? bot.getStats() : null;
  }

  /**
   * Get stats from all bots
   * @returns Array of bot stats
   */
  getAllStats(): BotStats[] {
    return Array.from(this.bots.values()).map(bot => bot.getStats());
  }

  /**
   * Get aggregated stats across all bots
   * @returns Aggregated stats
   */
  getAggregatedStats(): {
    totalBots: number;
    totalPnL: number;
    avgWinRate: number;
    totalPositions: number;
    totalTrades: number;
  } {
    const allStats = this.getAllStats();

    if (allStats.length === 0) {
      return {
        totalBots: 0,
        totalPnL: 0,
        avgWinRate: 0,
        totalPositions: 0,
        totalTrades: 0,
      };
    }

    const totalPnL = allStats.reduce((sum, stat) => sum + stat.totalPnL, 0);
    const avgWinRate = allStats.reduce((sum, stat) => sum + stat.winRate, 0) / allStats.length;
    const totalPositions = allStats.reduce((sum, stat) => sum + stat.positions.length, 0);
    const totalTrades = allStats.reduce((sum, stat) => sum + stat.trades.length, 0);

    return {
      totalBots: allStats.length,
      totalPnL,
      avgWinRate,
      totalPositions,
      totalTrades,
    };
  }

  /**
   * Save all bots to localStorage
   * Only saves bot IDs and configs (not runtime state)
   */
  private save(): void {
    if (typeof window === 'undefined') return;

    const data = Array.from(this.bots.entries()).map(([id, bot]) => ({
      id,
      config: bot.getConfig(),
    }));

    localStorage.setItem('bots', JSON.stringify(data));
  }

  /**
   * Load bots from localStorage
   * This will restore all saved bots
   */
  load(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('bots');
      if (!data) return;

      const bots = JSON.parse(data) as Array<{ id: string; config: BotConfig }>;

      // Clear existing bots
      this.bots.clear();

      // Recreate bots from saved configs
      bots.forEach(({ id, config }) => {
        const bot = new TradingBot(id, config);
        this.bots.set(id, bot);
      });

      console.log(`[BotManager] Loaded ${bots.length} bots from localStorage`);
    } catch (error) {
      console.error('[BotManager] Error loading bots:', error);
    }
  }

  /**
   * Clear all bots and localStorage
   * WARNING: This will delete all bots permanently
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;

    // Delete all bot-related data from localStorage
    this.bots.forEach((_, id) => {
      localStorage.removeItem(`bot_stats_${id}`);
      localStorage.removeItem(`bot_positions_${id}`);
      localStorage.removeItem(`bot_trades_${id}`);
      localStorage.removeItem(`bot_closed_${id}`);
      localStorage.removeItem(`bot_personality_${id}`);
      localStorage.removeItem(`bot_daily_${id}`);
    });

    this.bots.clear();
    localStorage.removeItem('bots');

    console.log('[BotManager] All bots cleared');
  }

  /**
   * Export all bot stats as JSON
   * Useful for debugging or data analysis
   */
  exportStats(): string {
    const allStats = this.getAllStats();
    return JSON.stringify(allStats, null, 2);
  }

  /**
   * Start automatic price updates from PriceService
   * This will connect to Binance WebSocket and automatically tick all bots
   * @param priceService PriceService instance
   * @returns Unsubscribe function
   */
  startAutoPricing(priceService: any): () => void {
    // Connect to Binance
    priceService.connect();

    // Subscribe to price updates
    const unsubscribe = priceService.subscribe((prices: Record<string, number>) => {
      this.tick(prices);
    });

    console.log('[BotManager] Auto-pricing started');
    return unsubscribe;
  }
}

// Singleton instance
export const botManager = new BotManager();
