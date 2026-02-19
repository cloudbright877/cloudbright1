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
  getUserCopyPnLBreakdown,
} from '../userCopyStats';
import { getAllDemoBots, getDemoBotById } from '../demoMarketplace';
import { unfreezeFunds, freezeFunds, creditCollectedPnL } from '../balances';
import { isLockedIn } from '../capitalReservation';
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

    // Get lock-in days from bot config
    const demoBot = getDemoBotById(masterBotId);
    const lockInDays = demoBot?.lockInDays ?? 30;

    // Move funds from available to frozen
    await freezeFunds(userId, investedAmount, 'pending_copy');

    const copyId = createUserCopy(masterBotId, investedAmount, userId, lockInDays);

    // Distribute referral commissions on bot activation (non-blocking)
    try {
      const { distributeReferralCommissions } = await import('../referralCommissions');
      await distributeReferralCommissions(userId, copyId, investedAmount);
    } catch (err) {
      console.error(`[botsApi] Referral commission error for copy ${copyId}:`, err);
    }

    // Check turnover bonuses for upline (non-blocking)
    try {
      const { getUplineChain } = await import('../users');
      const { checkAndAwardTurnoverBonuses } = await import('../turnoverBonuses');
      const uplineChain = await getUplineChain(userId);
      for (let i = 0; i < Math.min(uplineChain.length, 5); i++) {
        await checkAndAwardTurnoverBonuses(uplineChain[i].id);
      }
    } catch (err) {
      console.error(`[botsApi] Turnover bonus error for copy ${copyId}:`, err);
    }

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
   * Auto-credit profit to user's available balance when a trade closes.
   * Called by BotManager's onTradeClose callback.
   *
   * Credits max(0, realizedPnL - totalAlreadyCredited) to balance.
   * No referral commissions or other deductions here.
   */
  async autoCreditOnTradeClose(masterBotId: string): Promise<void> {
    // Find all ACTIVE copies of this master bot
    const { getAllCopiesOfMaster } = await import('../userCopies');
    const copies = getAllCopiesOfMaster(masterBotId).filter(c => c.status === 'ACTIVE');

    for (const copy of copies) {
      try {
        const breakdown = getUserCopyPnLBreakdown(copy.id);
        if (!breakdown) continue;

        const totalAlreadyCredited = copy.totalCollectedPnL || 0;
        const creditAmount = Math.max(0, breakdown.realizedPnL - totalAlreadyCredited);

        if (creditAmount <= 0) continue;

        // Update copy record FIRST (prevents double-credit)
        const newTotal = totalAlreadyCredited + creditAmount;
        updateUserCopy(copy.id, { totalCollectedPnL: newTotal });

        // Verify update succeeded
        const updatedCopy = getUserCopyStorage(copy.id);
        if (!updatedCopy || updatedCopy.totalCollectedPnL !== newTotal) {
          console.error(`[botsApi] Failed to update totalCollectedPnL for copy ${copy.id} — skipping credit`);
          continue;
        }

        // Credit to user's available balance
        await creditCollectedPnL(copy.userId, creditAmount, copy.id);

        console.log(`[botsApi] Auto-credited $${creditAmount.toFixed(2)} to ${copy.userId} from copy ${copy.id}`);
      } catch (err) {
        console.error(`[botsApi] Auto-credit error for copy ${copy.id}:`, err);
      }
    }
  },

  /**
   * Close (archive) a user copy
   *
   * Flow:
   * 1. Validate copy is ACTIVE, lock-in period ended, no operation in progress
   * 2. Set operationInProgress = 'archive', status = CLOSING
   * 3. Credit any remaining uncollected profit
   * 4. Return full capital
   * 5. Unfreeze funds
   * 6. Mark CLOSED
   */
  async closeUserCopy(copyId: string): Promise<{
    copy: BotStats | null;
    finalPnL: number;
    finalValue: number;
    capitalReturn: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 1. Get copy and validate
    const copy = getUserCopyStorage(copyId);
    if (!copy) throw new Error(`Copy ${copyId} not found`);
    if (copy.status !== 'ACTIVE') throw new Error(`Copy ${copyId} is not active (status: ${copy.status})`);
    if (copy.operationInProgress !== null) {
      throw new Error(`Operation "${copy.operationInProgress}" already in progress`);
    }

    // Check lock-in period
    if (isLockedIn(copy.createdAt, copy.reservationDays)) {
      throw new Error(`Copy ${copyId} is still within lock-in period`);
    }

    // 2. Acquire lock + mark CLOSING
    updateUserCopy(copyId, { operationInProgress: 'archive', status: 'CLOSING' });

    try {
      // 3. Get P&L breakdown
      const breakdown = getUserCopyPnLBreakdown(copyId);
      if (!breakdown) throw new Error(`Failed to get P&L breakdown for copy ${copyId}`);

      const finalPnL = breakdown.totalPnL;
      const finalValue = copy.investedAmount + finalPnL;
      const totalAlreadyCredited = copy.totalCollectedPnL || 0;

      // 4. Credit any remaining uncollected realized profit
      const uncredited = Math.max(0, breakdown.realizedPnL - totalAlreadyCredited);
      if (uncredited > 0) {
        const newTotal = totalAlreadyCredited + uncredited;
        updateUserCopy(copyId, { totalCollectedPnL: newTotal });
        await creditCollectedPnL(copy.userId, uncredited, copyId);
        console.log(`[botsApi] Final credit $${uncredited.toFixed(2)} on archive for copy ${copyId}`);
      }

      // 5. Full capital return
      const capitalReturn = copy.investedAmount;

      // 6. Unfreeze funds (frozen → available)
      await unfreezeFunds(copy.userId, copy.investedAmount, capitalReturn, copyId);

      // 7. Mark as CLOSED
      updateUserCopy(copyId, {
        status: 'CLOSED',
        closedAt: Date.now(),
        finalPnL,
        finalValue,
        operationInProgress: null,
      });

      console.log(`[botsApi] Closed copy ${copyId}:`);
      console.log(`  Total auto-credited: $${(totalAlreadyCredited + uncredited).toFixed(2)}`);
      console.log(`  Capital return: $${capitalReturn.toFixed(2)}`);

      return {
        copy: getUserCopyStats(copyId),
        finalPnL,
        finalValue,
        capitalReturn,
      };
    } catch (error) {
      // On error, revert to ACTIVE (don't leave in CLOSING state)
      try {
        updateUserCopy(copyId, { operationInProgress: null, status: 'ACTIVE' });
      } catch (revertErr) {
        console.error(`[botsApi] CRITICAL: Failed to revert archive lock for copy ${copyId}`, revertErr);
      }
      throw error;
    }
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
    // Run auto-migration for user copies (Capital Reservation v2)
    const { autoMigrate } = await import('../migrations/migrateUserCopies');
    autoMigrate();

    // Load existing bots from localStorage
    botManager.load();

    // Set up auto-credit callback: when a master bot closes a trade,
    // credit proportional profit to all active user copies
    botManager.setOnTradeClose((masterBotId: string) => {
      this.autoCreditOnTradeClose(masterBotId);
    });

    // DON'T auto-create all Master Bots - only create when user copies
    // This prevents localStorage overflow

    // Connect to price service
    priceService.connect();

    // Subscribe to price updates (only tick existing bots)
    priceService.subscribe((prices) => {
      botManager.tick(prices);
    });

    console.log('[botsApi] Master bots initialized (with auto-credit on trade close)');
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
