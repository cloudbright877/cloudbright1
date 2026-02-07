// ============================================================================
// Migration Helpers - Backward Compatibility
// ============================================================================
// Migrates old Position/Trade data (v1) to new schema (v2) with default values

import { Position, Trade } from '../types';

/**
 * Migrates a Position from v1 (old schema) to v2 (ADAPTIVE_CONVERGENCE_SYSTEM)
 * Adds default values for new optional fields if missing
 */
export function migratePosition(position: Position): Position {
  // Already v2 - no migration needed
  if (position._version === 'v2') {
    return position;
  }

  // Migrate v1 -> v2
  return {
    ...position,
    _version: 'v2',

    // Price source defaults to 'simulated' for old positions
    priceSource: position.priceSource ?? 'simulated',

    // binancePrice is undefined for old positions (no real price tracking)
    binancePrice: position.binancePrice ?? undefined,

    // favorabilityScore is undefined for old positions (no technical analysis)
    favorabilityScore: position.favorabilityScore ?? undefined,

    // convergenceLayer is 0 for old positions (no convergence system)
    convergenceLayer: position.convergenceLayer ?? 0,
  };
}

/**
 * Migrates a Trade from v1 (old schema) to v2 (ADAPTIVE_CONVERGENCE_SYSTEM)
 * Adds default values for new optional fields if missing
 */
export function migrateTrade(trade: Trade): Trade {
  // Check if already migrated (has priceSource set)
  if (trade.priceSource !== undefined) {
    return trade;
  }

  // Migrate v1 -> v2
  return {
    ...trade,

    // Price source defaults to 'simulated' for old trades
    priceSource: 'simulated',

    // favorabilityScore is undefined for old trades
    favorabilityScore: undefined,

    // technicalIndicators is undefined for old trades
    technicalIndicators: undefined,
  };
}

/**
 * Batch migrate an array of positions
 */
export function migratePositions(positions: Position[]): Position[] {
  return positions.map(migratePosition);
}

/**
 * Batch migrate an array of trades
 */
export function migrateTrades(trades: Trade[]): Trade[] {
  return trades.map(migrateTrade);
}

/**
 * Migrates a running bot (with open positions) from v1 to v2
 *
 * CRITICAL: This function handles bots that are actively trading.
 * - Open positions are migrated with defaults (priceSource='simulated', etc.)
 * - Convergence state is reset to fresh (partial day progress is LOST)
 * - Daily target may be missed today (user is warned via console)
 *
 * Called by BotManager.load() when loading a bot with v1 positions.
 *
 * @param botId Bot ID for logging
 * @param positions Array of open positions to migrate
 * @returns Object with migrated positions and warning message
 */
export function migrateRunningBot(
  botId: string,
  positions: Position[]
): { positions: Position[]; warning: string } {
  // Migrate all positions to v2 schema
  const migratedPositions = migratePositions(positions);

  const warning = `
╔═══════════════════════════════════════════════════════════════════════╗
║ BOT MIGRATION WARNING: ${botId.substring(0, 20).padEnd(20)} (v1 → v2)  ║
╠═══════════════════════════════════════════════════════════════════════╣
║ - Convergence state has been reset (partial day progress lost)       ║
║ - Open positions migrated to v2 schema with default values           ║
║ - Today's daily target may be MISSED (day partially completed)       ║
║ - This is expected behavior during migration                         ║
║ - Tomorrow the bot will operate normally with new convergence system ║
╚═══════════════════════════════════════════════════════════════════════╝
  `.trim();

  // Log warning to console
  console.warn(warning);

  return {
    positions: migratedPositions,
    warning
  };
}
