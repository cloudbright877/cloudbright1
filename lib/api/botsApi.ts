import { botManager } from '../BotManager';
import { priceService } from '../PriceService';
import {
  createUserCopy,
  getUserCopies as getUserCopiesStorage,
  getUserCopy as getUserCopyStorage,
  deleteUserCopy as deleteUserCopyStorage,
} from '../userCopies';
import {
  getUserCopyStats,
  getMasterBotAggregatedStats,
} from '../userCopyStats';
import { getAllDemoBots, getDemoBotById } from '../demoMarketplace';
import type { DemoBot } from '../demoMarketplace';
import type { BotConfig, BotStats } from '../trading/types';
import type { AggregatedMasterBotStats } from '../userCopyStats';

/**
 * Bots API - Abstraction layer for bot operations
 *
 * CURRENT: Uses botManager + localStorage
 * FUTURE: Will use fetch() to call Express API
 */
export const botsApi = {
  // ============================================================================
  // Master Bot Methods
  // ============================================================================

  /**
   * Get all master bots from marketplace
   */
  async getMasterBots(): Promise<DemoBot[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getAllDemoBots();

    /* FUTURE:
    const response = await fetch('/api/marketplace/bots');
    return await response.json();
    */
  },

  /**
   * Get specific master bot
   */
  async getMasterBot(id: string): Promise<DemoBot | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getDemoBotById(id) || null;

    /* FUTURE:
    const response = await fetch(`/api/marketplace/bots/${id}`);
    return await response.json();
    */
  },

  /**
   * Get aggregated stats for marketplace display
   */
  async getMasterBotStats(id: string): Promise<AggregatedMasterBotStats> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Ensure Master Bot exists
    await this.ensureMasterBot(id);

    return getMasterBotAggregatedStats(id);

    /* FUTURE:
    const response = await fetch(`/api/marketplace/bots/${id}/stats`);
    return await response.json();
    */
  },

  /**
   * Update master bot configuration (for settings page)
   */
  async updateMasterBotConfig(
    id: string,
    config: Partial<BotConfig>
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return botManager.updateBotConfig(id, config);

    /* FUTURE:
    const response = await fetch(`/api/marketplace/bots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.ok;
    */
  },

  // ============================================================================
  // User Copy Methods
  // ============================================================================

  /**
   * Create a copy of a master bot
   */
  async createBotCopy(
    masterBotId: string,
    investedAmount: number
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Ensure Master Bot instance exists before creating copy
    await this.ensureMasterBot(masterBotId);

    const copyId = createUserCopy(masterBotId, investedAmount);
    return copyId;

    /* FUTURE:
    const response = await fetch('/api/user/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterBotId, investedAmount }),
    });
    const data = await response.json();
    return data.copyId;
    */
  },

  /**
   * Get all user copies with stats
   */
  async getUserCopies(userId?: string): Promise<BotStats[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const copies = getUserCopiesStorage(userId);
    return copies
      .map((copy) => getUserCopyStats(copy.id))
      .filter(Boolean) as BotStats[];

    /* FUTURE:
    const response = await fetch('/api/user/bots');
    return await response.json();
    */
  },

  /**
   * Get single user copy with stats
   */
  async getUserCopy(copyId: string): Promise<BotStats | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getUserCopyStats(copyId);

    /* FUTURE:
    const response = await fetch(`/api/user/bots/${copyId}/stats`);
    return await response.json();
    */
  },

  /**
   * Delete user copy
   */
  async deleteUserCopy(copyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    deleteUserCopyStorage(copyId);

    /* FUTURE:
    await fetch(`/api/user/bots/${copyId}`, { method: 'DELETE' });
    */
  },

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Initialize master bots (load and start trading)
   */
  async initializeMasterBots(): Promise<void> {
    // Load existing bots from localStorage
    botManager.load();

    // DON'T auto-create all Master Bots - only create when user copies
    // This prevents localStorage overflow

    // Connect to price service
    priceService.connect();

    // Subscribe to price updates (only tick existing bots)
    priceService.subscribe((prices) => {
      botManager.tick(prices);
    });

    console.log('[botsApi] Master bots initialized');
  },

  /**
   * Ensure Master Bot exists (create if needed)
   * @internal
   */
  async ensureMasterBot(masterBotId: string): Promise<void> {
    const existingBot = botManager.getBot(masterBotId);
    if (existingBot) return; // Already exists

    // Find demo bot config
    const demoBot = getDemoBotById(masterBotId);
    if (!demoBot) {
      throw new Error(`Demo bot ${masterBotId} not found`);
    }

    console.log(`[botsApi] Creating Master Bot instance: ${masterBotId}`);
    botManager.createBot(demoBot.config, demoBot.id);
  },
};
