/**
 * Capital Reservation — Lock-in Period System
 *
 * Purpose:
 * - Prevent users from copying bot, catching one good trade, and leaving immediately
 * - Each bot has its own lock-in period (14-180 days)
 *
 * Mechanism:
 * - Lock-in Period: user CANNOT deactivate bot during this time
 * - Archive button only appears after lock-in period ends
 * - No early exit fee — just a hard lock
 *
 * Note: Profit is auto-credited to balance when trades close (see botsApi.autoCreditOnTradeClose)
 */


/**
 * Check if copy is still within lock-in period (cannot deactivate)
 * @param createdAt Copy creation timestamp
 * @param lockInDays Lock-in period in days
 * @returns True if still locked (cannot archive)
 */
export function isLockedIn(
  createdAt: number,
  lockInDays: number
): boolean {
  return getDaysRemainingInReservation(createdAt, lockInDays) > 0;
}

/**
 * Get days remaining in lock-in period
 * @param createdAt Copy creation timestamp
 * @param lockInDays Lock-in period in days
 * @returns Days remaining (0 if expired)
 */
export function getDaysRemainingInReservation(
  createdAt: number,
  lockInDays: number
): number {
  const now = Date.now();
  const daysSinceCreated = (now - createdAt) / (1000 * 60 * 60 * 24);
  const daysRemaining = lockInDays - daysSinceCreated;

  return Math.max(0, Math.ceil(daysRemaining));
}

/**
 * Get days since copy creation
 * @param createdAt Copy creation timestamp
 * @returns Days since creation
 */
export function getDaysSinceCreation(createdAt: number): number {
  const now = Date.now();
  return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
}
