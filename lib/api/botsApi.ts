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
import { distributeReferralCommissions } from '../referralCommissions';
import { checkAndAwardTurnoverBonuses } from '../turnoverBonuses';
import { unfreezeFunds, freezeFunds, creditCollectedPnL } from '../balances';
import { getUser, getUplineChain } from '../users';
import {
  calculateEarlyExitFee,
  getDaysSinceCreation,
} from '../capitalReservation';
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
   * Collect available P&L from an active copy
   *
   * User gets 100% of collected profit (no deductions).
   * Referrer gets % of collect amount as platform bonus.
   *
   * Atomicity: totalCollectedPnL updated BEFORE creditCollectedPnL().
   * Rate limiting: max 1 collect per copy per 10 minutes.
   */
  async collectProfit(copyId: string): Promise<{
    collectedAmount: number;
    totalCollectedPnL: number;
    collectCount: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 1. Validate copy is ACTIVE
    const copy = getUserCopyStorage(copyId);
    if (!copy) throw new Error(`Copy ${copyId} not found`);
    if (copy.status !== 'ACTIVE') throw new Error(`Copy ${copyId} is not active`);

    // 2. Acquire lock (before rate limit check to prevent race condition)
    if (copy.operationInProgress !== null) {
      throw new Error(`Operation "${copy.operationInProgress}" already in progress`);
    }
    updateUserCopy(copyId, { operationInProgress: 'collect' });

    try {
      // 3. Rate limit: check AFTER lock to prevent race condition
      const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
      const freshCopy = getUserCopyStorage(copyId);
      const lastCollect = freshCopy?.lastCollectAt || copy.lastCollectAt;
      if (lastCollect && Date.now() - lastCollect < RATE_LIMIT_MS) {
        const remainingSec = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastCollect)) / 1000);
        throw new Error(`Rate limited: wait ${remainingSec}s before next collect`);
      }

      // 4a. Get realized P&L from breakdown
      const breakdown = getUserCopyPnLBreakdown(copyId);
      if (!breakdown) throw new Error(`Failed to get P&L breakdown for copy ${copyId}`);

      // 4b. Calculate available to collect (early return goes through finally → lock released)
      const availableToCollect = breakdown.availableToCollect;
      if (availableToCollect <= 0) {
        return { collectedAmount: 0, totalCollectedPnL: copy.totalCollectedPnL || 0, collectCount: copy.collectCount || 0 };
      }

      // 4d. UPDATE COPY FIRST (prevents double-spend if crash after this point)
      const newTotalCollected = (copy.totalCollectedPnL || 0) + availableToCollect;
      const newCollectCount = (copy.collectCount || 0) + 1;
      updateUserCopy(copyId, {
        totalCollectedPnL: newTotalCollected,
        collectCount: newCollectCount,
        lastCollectAt: Date.now(),
      });

      // Verify update succeeded before crediting (prevents double-spend)
      // Check both totalCollectedPnL AND collectCount as monotonic nonce
      const updatedCopy = getUserCopyStorage(copyId);
      if (!updatedCopy ||
          updatedCopy.totalCollectedPnL !== newTotalCollected ||
          updatedCopy.collectCount !== newCollectCount) {
        throw new Error(`Failed to update totalCollectedPnL for copy ${copyId} — aborting credit`);
      }

      // 4e. Credit to user's available balance (user gets 100%)
      await creditCollectedPnL(copy.userId, availableToCollect, copyId);

      // 4f. Distribute referral commissions (platform bonus, not deducted from user)
      await distributeReferralCommissions(copy.userId, copyId, availableToCollect);

      // 4g. Check turnover bonuses for upline chain
      const uplineChain = await getUplineChain(copy.userId);
      for (const upline of uplineChain) {
        await checkAndAwardTurnoverBonuses(upline.id);
      }

      console.log(`[botsApi] Collected $${availableToCollect.toFixed(2)} from copy ${copyId} (total: $${newTotalCollected.toFixed(2)}, #${newCollectCount})`);

      return {
        collectedAmount: availableToCollect,
        totalCollectedPnL: newTotalCollected,
        collectCount: newCollectCount,
      };
    } finally {
      // 5. Release lock (wrapped in try-catch to prevent deadlock)
      try {
        updateUserCopy(copyId, { operationInProgress: null });
      } catch (err) {
        console.error(`[botsApi] CRITICAL: Failed to release collect lock for copy ${copyId}`, err);
      }
    }
  },

  /**
   * Close (archive) a user copy
   *
   * Flow:
   * 1. Validate copy is ACTIVE, no operation in progress
   * 2. Set operationInProgress = 'archive', status = CLOSING
   * 3. Auto-collect uncollected profit (update-before-credit rule)
   * 4. Calculate early exit fee on investedAmount
   * 5. capitalReturn = max(0, investedCapital - earlyExitFee)
   * 6. Unfreeze funds
   * 7. Mark CLOSED
   *
   * User gets 100% of profit. Referrer gets platform bonus.
   */
  async closeUserCopy(copyId: string): Promise<{
    copy: BotStats | null;
    finalPnL: number;
    finalValue: number;
    investorReceives: number;
    earlyExitFee: number;
    isEarlyExit: boolean;
    previouslyCollected: number;
    autoCollected: number;
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

    // 2. Acquire lock + mark CLOSING
    updateUserCopy(copyId, { operationInProgress: 'archive', status: 'CLOSING' });

    try {
      // 3. Get P&L breakdown
      const breakdown = getUserCopyPnLBreakdown(copyId);
      if (!breakdown) throw new Error(`Failed to get P&L breakdown for copy ${copyId}`);

      const stats = getUserCopyStats(copyId);
      const finalPnL = breakdown.totalPnL;
      const finalValue = copy.investedAmount + finalPnL;
      const previouslyCollected = copy.totalCollectedPnL || 0;

      // 4. Auto-collect uncollected realized profit
      let autoCollected = 0;
      const uncollected = Math.max(0, breakdown.realizedPnL - previouslyCollected);
      if (uncollected > 0) {
        // Update totalCollectedPnL FIRST (atomicity rule)
        const newTotalCollected = previouslyCollected + uncollected;
        updateUserCopy(copyId, {
          totalCollectedPnL: newTotalCollected,
          collectCount: (copy.collectCount || 0) + 1,
          lastCollectAt: Date.now(),
        });

        // Verify update succeeded before crediting (prevents double-spend)
        // Check both totalCollectedPnL AND collectCount as monotonic nonce
        const newCollectCount = (copy.collectCount || 0) + 1;
        const updatedCopy = getUserCopyStorage(copyId);
        if (!updatedCopy ||
            updatedCopy.totalCollectedPnL !== newTotalCollected ||
            updatedCopy.collectCount !== newCollectCount) {
          throw new Error(`Failed to update totalCollectedPnL for copy ${copyId} — aborting credit`);
        }

        // Credit to user's available balance
        await creditCollectedPnL(copy.userId, uncollected, copyId);

        // Distribute referral commissions (platform bonus)
        await distributeReferralCommissions(copy.userId, copyId, uncollected);

        autoCollected = uncollected;
        console.log(`[botsApi] Auto-collected $${uncollected.toFixed(2)} uncollected profit`);
      }

      // 5. Calculate early exit fee
      const daysSinceCopy = getDaysSinceCreation(copy.createdAt);
      const earlyExitResult = calculateEarlyExitFee(
        copy.investedAmount,
        0, // fee is on invested capital only, not profit
        daysSinceCopy,
        copy.reservationDays
      );

      // 6. Capital return = max(0, invested - earlyExitFee)
      const capitalReturn = Math.max(0, copy.investedAmount - earlyExitResult.fee);

      // 7. Unfreeze funds (frozen → available)
      await unfreezeFunds(copy.userId, copy.investedAmount, capitalReturn, copyId);

      // 8. Award turnover bonuses
      if (autoCollected > 0) {
        const uplineChain = await getUplineChain(copy.userId);
        for (const upline of uplineChain) {
          await checkAndAwardTurnoverBonuses(upline.id);
        }
      }

      // 9. Mark as CLOSED
      updateUserCopy(copyId, {
        status: 'CLOSED',
        closedAt: Date.now(),
        finalPnL,
        finalValue,
        earlyExitFee: earlyExitResult.fee,
        earlyExitPenaltyRate: earlyExitResult.penaltyRate,
        isEarlyExit: earlyExitResult.isEarlyExit,
        operationInProgress: null,
      });

      const investorReceives = capitalReturn + autoCollected;

      console.log(`[botsApi] Closed copy ${copyId}:`);
      console.log(`  Previously collected: $${previouslyCollected.toFixed(2)}`);
      console.log(`  Auto-collected now: $${autoCollected.toFixed(2)}`);
      console.log(`  Capital return: $${capitalReturn.toFixed(2)}`);
      if (earlyExitResult.isEarlyExit) {
        console.log(`  Early Exit Fee: $${earlyExitResult.fee.toFixed(2)} (${(earlyExitResult.penaltyRate * 100).toFixed(0)}%)`);
      }
      console.log(`  Credited now: $${investorReceives.toFixed(2)}`);
      console.log(`  Total all-time: $${(investorReceives + previouslyCollected).toFixed(2)}`);

      return {
        copy: getUserCopyStats(copyId),
        finalPnL,
        finalValue,
        investorReceives,
        earlyExitFee: earlyExitResult.fee,
        isEarlyExit: earlyExitResult.isEarlyExit,
        previouslyCollected,
        autoCollected,
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
