/**
 * Migrations for UserCopy records
 *
 * v2: Capital Reservation + Periodic Settlement fields
 * v3: Collect P&L fields (rename settlement → collect, add operationInProgress)
 */

import { getAllUserCopies, updateUserCopy } from '../userCopies';
import type { UserCopy } from '../userCopies';

// ============================================================================
// v2: Capital Reservation (legacy, kept for completeness)
// ============================================================================

export function migrateUserCopiesToV2(): number {
  const allCopies = getAllUserCopies();
  let migrated = 0;

  const copiesToMigrate = allCopies.filter(
    (c) => !('reservationDays' in c)
  ) as UserCopy[];

  copiesToMigrate.forEach((copy) => {
    const isClosed = copy.status === 'CLOSED';
    const closedAt = copy.closedAt;
    const createdAt = copy.createdAt;

    const updates: Partial<UserCopy> = {
      reservationDays: 30,
    };

    if (isClosed && closedAt) {
      const daysSinceCopy = Math.floor((closedAt - createdAt) / (1000 * 60 * 60 * 24));
      updates.isEarlyExit = daysSinceCopy < 30;
    }

    updateUserCopy(copy.id, updates);
    migrated++;
  });

  if (migrated > 0) {
    console.log(`[Migration] Migrated ${migrated} user copies to v2 (Capital Reservation)`);
  }
  return migrated;
}

// ============================================================================
// v3: Collect P&L (settlement → collect rename + operationInProgress lock)
// ============================================================================

export function migrateUserCopiesToV3(): number {
  const allCopies = getAllUserCopies();
  let migrated = 0;

  const copiesToMigrate = allCopies.filter(
    (c) => !('totalCollectedPnL' in c)
  ) as (UserCopy & { lastSettledPnL?: number; settlementCount?: number })[];

  copiesToMigrate.forEach((copy) => {
    const updates: Partial<UserCopy> = {
      // Migrate old settlement fields to collect fields
      totalCollectedPnL: (copy as any).lastSettledPnL || 0,
      collectCount: (copy as any).settlementCount || 0,
      operationInProgress: null,
    };

    updateUserCopy(copy.id, updates);
    migrated++;
  });

  if (migrated > 0) {
    console.log(`[Migration] Migrated ${migrated} user copies to v3 (Collect P&L)`);
  }
  return migrated;
}

// ============================================================================
// Migration checks
// ============================================================================

export function needsMigrationV2(): boolean {
  const copies = getAllUserCopies();
  return copies.some((c) => !('reservationDays' in c));
}

export function needsMigrationV3(): boolean {
  const copies = getAllUserCopies();
  return copies.some((c) => !('totalCollectedPnL' in c));
}

/**
 * Run all migrations if needed (idempotent)
 */
export function autoMigrate(): void {
  if (needsMigrationV2()) {
    console.log('[Migration] Running v2 migration...');
    migrateUserCopiesToV2();
  }
  if (needsMigrationV3()) {
    console.log('[Migration] Running v3 migration (Collect P&L)...');
    migrateUserCopiesToV3();
  }
}
