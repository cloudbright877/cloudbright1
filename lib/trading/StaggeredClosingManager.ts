/**
 * Staggered Closing Manager
 *
 * Prevents multiple positions from closing simultaneously, which would create
 * unrealistic "steps" in the equity curve.
 *
 * User requirement: "не закрывать много сделок одновременно, график выглядит
 * не реалистично в таком случае"
 *
 * Strategy:
 * - Track recent position closures (last 60 seconds)
 * - If 2+ positions closed in last 30s → delay next closure
 * - Add random delay (5-30s) between closures for natural spacing
 */

export interface ClosureEvent {
  positionId: string;
  timestamp: number;
  pnl: number;
}

export interface ClosingDecision {
  shouldClose: boolean;
  delayMs: number;
  reason: string;
}

export class StaggeredClosingManager {
  private recentClosures: ClosureEvent[] = [];
  private readonly MAX_HISTORY_MS = 60000; // Track last 60 seconds
  private readonly CONGESTION_WINDOW_MS = 30000; // Check last 30 seconds for congestion
  private readonly MAX_CLOSURES_IN_WINDOW = 2; // Max 2 closures in 30s

  /**
   * Record a position closure
   */
  recordClosure(positionId: string, pnl: number): void {
    const now = Date.now();

    // Add new closure
    this.recentClosures.push({
      positionId,
      timestamp: now,
      pnl,
    });

    // Clean old closures (older than 60s)
    this.recentClosures = this.recentClosures.filter(
      (closure) => now - closure.timestamp < this.MAX_HISTORY_MS
    );

    console.log(
      `📝 Staggered Closing: Recorded closure of ${positionId} ` +
      `(${this.recentClosures.length} closures in last ${this.MAX_HISTORY_MS / 1000}s)`
    );
  }

  /**
   * Determine if we should close a position now or delay it
   *
   * Returns:
   * - shouldClose: true if can close immediately
   * - delayMs: milliseconds to wait before closing
   * - reason: explanation for decision
   */
  shouldClosePosition(positionId: string): ClosingDecision {
    const now = Date.now();

    // Count closures in congestion window (last 30s)
    const recentClosuresCount = this.recentClosures.filter(
      (closure) => now - closure.timestamp < this.CONGESTION_WINDOW_MS
    ).length;

    // If we've closed too many positions recently → delay
    if (recentClosuresCount >= this.MAX_CLOSURES_IN_WINDOW) {
      // Find time until we can close (when oldest recent closure exits the window)
      const oldestRecentClosure = this.recentClosures
        .filter((closure) => now - closure.timestamp < this.CONGESTION_WINDOW_MS)
        .sort((a, b) => a.timestamp - b.timestamp)[0];

      const timeUntilSlotAvailable = oldestRecentClosure
        ? this.CONGESTION_WINDOW_MS - (now - oldestRecentClosure.timestamp)
        : 0;

      // Add random additional delay (5-15s) for natural spacing
      const randomDelay = 5000 + Math.random() * 10000;
      const totalDelay = Math.max(timeUntilSlotAvailable + randomDelay, 5000);

      return {
        shouldClose: false,
        delayMs: totalDelay,
        reason: `Too many recent closures (${recentClosuresCount} in last ${
          this.CONGESTION_WINDOW_MS / 1000
        }s). Delaying ${(totalDelay / 1000).toFixed(0)}s for natural spacing.`,
      };
    }

    // Check if last closure was very recent (< 5 seconds ago)
    const lastClosure = this.recentClosures[this.recentClosures.length - 1];
    if (lastClosure) {
      const timeSinceLastClosure = now - lastClosure.timestamp;
      if (timeSinceLastClosure < 5000) {
        // Add small random delay (3-8s) to avoid "burst" closures
        const minDelay = 3000 - timeSinceLastClosure;
        const randomDelay = minDelay + Math.random() * 5000;

        return {
          shouldClose: false,
          delayMs: randomDelay,
          reason: `Last closure was ${(timeSinceLastClosure / 1000).toFixed(1)}s ago. ` +
            `Adding ${(randomDelay / 1000).toFixed(0)}s delay to prevent burst.`,
        };
      }
    }

    // Safe to close, but add small random delay (1-5s) for natural variance
    const naturalDelay = 1000 + Math.random() * 4000;

    return {
      shouldClose: true,
      delayMs: naturalDelay,
      reason: `Safe to close. Adding ${(naturalDelay / 1000).toFixed(0)}s natural delay.`,
    };
  }

  /**
   * Get statistics about recent closing activity
   */
  getClosingStats(): {
    totalClosuresLast60s: number;
    closuresLast30s: number;
    averageTimeBetweenClosures: number;
    isCongested: boolean;
  } {
    const now = Date.now();
    const closuresLast30s = this.recentClosures.filter(
      (c) => now - c.timestamp < this.CONGESTION_WINDOW_MS
    ).length;

    // Calculate average time between closures
    let averageTimeBetweenClosures = 0;
    if (this.recentClosures.length > 1) {
      const sortedClosures = [...this.recentClosures].sort((a, b) => a.timestamp - b.timestamp);
      let totalGap = 0;
      for (let i = 1; i < sortedClosures.length; i++) {
        totalGap += sortedClosures[i].timestamp - sortedClosures[i - 1].timestamp;
      }
      averageTimeBetweenClosures = totalGap / (sortedClosures.length - 1);
    }

    return {
      totalClosuresLast60s: this.recentClosures.length,
      closuresLast30s,
      averageTimeBetweenClosures,
      isCongested: closuresLast30s >= this.MAX_CLOSURES_IN_WINDOW,
    };
  }

  /**
   * Print summary of closing activity
   */
  printSummary(): void {
    const stats = this.getClosingStats();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Staggered Closing Stats');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Closures (last 60s):  ${stats.totalClosuresLast60s}`);
    console.log(`Closures (last 30s):  ${stats.closuresLast30s}`);
    console.log(
      `Avg time between:     ${(stats.averageTimeBetweenClosures / 1000).toFixed(1)}s`
    );
    console.log(`Congestion status:    ${stats.isCongested ? '🔴 CONGESTED' : '🟢 CLEAR'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Reset history (useful for testing or new day)
   */
  reset(): void {
    this.recentClosures = [];
    console.log('🔄 Staggered Closing Manager reset');
  }

  /**
   * Save state to localStorage
   */
  save(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const state = {
        recentClosures: this.recentClosures,
      };

      localStorage.setItem(`bot_staggered_${botId}`, JSON.stringify(state));
    } catch (error) {
      console.error('[StaggeredClosingManager] Error saving state:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  load(botId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(`bot_staggered_${botId}`);
      if (!data) return;

      const state = JSON.parse(data);

      // Only load recent closures (filter out old ones)
      const now = Date.now();
      this.recentClosures = (state.recentClosures || []).filter(
        (closure: ClosureEvent) => now - closure.timestamp < this.MAX_HISTORY_MS
      );

      console.log(
        `[StaggeredClosingManager] State loaded: ${this.recentClosures.length} recent closures`
      );
    } catch (error) {
      console.error('[StaggeredClosingManager] Error loading state:', error);
    }
  }
}

// Singleton instance (can be replaced with bot-specific instances)
export const staggeredClosingManager = new StaggeredClosingManager();
