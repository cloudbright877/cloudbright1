import { botManager } from '../BotManager';
import { priceService } from '../PriceService';
import {
  createUserCopy,
  getUserCopies as getUserCopiesStorage,
  getUserCopy as getUserCopyStorage,
  deleteUserCopy as deleteUserCopyStorage,
  updateUserCopy,
} from '../userCopies';
import {
  getUserCopyStats,
  getMasterBotAggregatedStats,
} from '../userCopyStats';
import { getAllDemoBots, getDemoBotById } from '../demoMarketplace';
import { distributeReferralCommissions } from '../referralCommissions';
import { checkAndAwardTurnoverBonuses } from '../turnoverBonuses';
import { unfreezeFunds, freezeFunds } from '../balances';
import { getUser, getUplineChain } from '../users';
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

    // Persist to localStorage via masterBotsConfig
    // Note: Master Bots are not instantiated until user creates a copy
    // So we only save to localStorage here (source of truth for Master Bot configs)
    const { saveMasterBotConfig } = await import('../masterBotsConfig');
    saveMasterBotConfig(id, config);

    // When user creates a copy, ensureMasterBot() will load the merged config
    // (default + localStorage override) automatically
    return true; // Config saved successfully

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
    investedAmount: number,
    userId: string = 'user_default'
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Ensure Master Bot instance exists before creating copy
    await this.ensureMasterBot(masterBotId);

    // Move funds from available to frozen
    await freezeFunds(userId, investedAmount, 'pending_copy');

    const copyId = createUserCopy(masterBotId, investedAmount, userId);
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
   * Close a user copy (NEW)
   *
   * Flow:
   * 1. Mark copy as CLOSING
   * 2. Calculate final P&L
   * 3. Distribute referral commissions (if profitable)
   * 4. Award turnover bonuses to upline chain
   * 5. Unfreeze funds and return to investor
   * 6. Mark copy as CLOSED
   *
   * @param copyId User copy ID
   * @returns Closed copy stats and commission breakdown
   */
  async closeUserCopy(copyId: string): Promise<{
    copy: BotStats | null;
    finalPnL: number;
    finalValue: number;
    totalCommissions: number;
    investorReceives: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 1. Get copy and validate status
    const copy = getUserCopyStorage(copyId);
    if (!copy) {
      throw new Error(`Copy ${copyId} not found`);
    }

    if (copy.status !== 'ACTIVE') {
      throw new Error(`Copy ${copyId} is not active (status: ${copy.status})`);
    }

    // 2. Mark as CLOSING
    updateUserCopy(copyId, { status: 'CLOSING' });

    // 3. Calculate final P&L
    const stats = getUserCopyStats(copyId);
    if (!stats) {
      throw new Error(`Failed to get stats for copy ${copyId}`);
    }

    const finalPnL = stats.totalPnL;
    const finalValue = copy.investedAmount + finalPnL;

    // 4. Distribute referral commissions (if profitable)
    let totalCommissions = 0;
    if (finalPnL > 0) {
      totalCommissions = await distributeReferralCommissions(
        copy.userId,
        copyId,
        finalPnL
      );

      // 5. Award turnover bonuses to all uplines
      const uplineChain = await getUplineChain(copy.userId);
      for (const upline of uplineChain) {
        await checkAndAwardTurnoverBonuses(upline.id);
      }
    }

    // 6. Calculate investor receives (principal + profit - commissions)
    const investorReceives = finalValue - totalCommissions;

    // 7. Unfreeze funds (frozen → available)
    await unfreezeFunds(
      copy.userId,
      copy.investedAmount,
      investorReceives,
      copyId
    );

    // 8. Mark as CLOSED
    updateUserCopy(copyId, {
      status: 'CLOSED',
      closedAt: Date.now(),
      finalPnL,
      finalValue,
    });

    console.log(`[botsApi] Closed copy ${copyId}:`);
    console.log(`  Principal: $${copy.investedAmount.toFixed(2)}`);
    console.log(`  P&L: $${finalPnL.toFixed(2)}`);
    console.log(`  Commissions: $${totalCommissions.toFixed(2)}`);
    console.log(`  Investor receives: $${investorReceives.toFixed(2)}`);

    return {
      copy: getUserCopyStats(copyId),
      finalPnL,
      finalValue,
      totalCommissions,
      investorReceives,
    };

    /* FUTURE:
    const response = await fetch(`/api/user/bots/${copyId}/close`, {
      method: 'POST',
    });
    return await response.json();
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

    // Load merged config (default + admin overrides from localStorage)
    const { getMergedBotConfig } = await import('../masterBotsConfig');
    const mergedConfig = getMergedBotConfig(masterBotId);

    const configToUse = mergedConfig || demoBot.config;

    console.log(`[botsApi] Creating Master Bot instance: ${masterBotId}`);
    console.log('[botsApi] Using config:', mergedConfig ? 'merged (with admin overrides)' : 'default');
    botManager.createBot(configToUse, demoBot.id);
  },
};
