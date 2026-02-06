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
