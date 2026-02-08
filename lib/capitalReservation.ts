/**
 * Capital Reservation — Early Exit Fee System
 *
 * Purpose:
 * - Prevent users from copying bot, catching one good trade, and leaving immediately
 * - Align incentives: referrers benefit from users STAYING (not leaving)
 *
 * Mechanism:
 * - Early Exit Fee (Tiered Penalty): 0-30 days after copy creation
 * - Penalty rate decreases over time (20% → 17% → 15% → 0%)
 * - Fee is always on investedCapital (not profit)
 * - Fee goes to platform (not distributed to referral chain)
 *
 * Note: Periodic Settlement has been replaced by manual "Collect P&L" (see botsApi.collectProfit)
 */


// ============================================================================
// Early Exit Fee (Tiered Penalty)
// ============================================================================

/**
 * Tiered penalty rates by day range
 * Day 0-10: 20% of invested capital
 * Day 11-20: 17% of invested capital
 * Day 21-29: 15% of invested capital
 * Day 30+: 0% (no penalty)
 */
const EARLY_EXIT_PENALTY_TIERS = [
  { minDay: 0, maxDay: 10, rate: 0.20 },   // 20%
  { minDay: 11, maxDay: 20, rate: 0.17 },  // 17%
  { minDay: 21, maxDay: 29, rate: 0.15 },  // 15%
];

/**
 * Get early exit penalty rate based on days since copy creation
 * @param daysSinceCopy Days since copy was created
 * @param reservationDays Reservation period (default 30)
 * @returns Penalty rate (0.0 - 0.20)
 */
export function getEarlyExitPenaltyRate(
  daysSinceCopy: number,
  reservationDays: number = 30
): number {
  // No penalty after reservation period
  if (daysSinceCopy >= reservationDays) {
    return 0;
  }

  // Find matching tier
  for (const tier of EARLY_EXIT_PENALTY_TIERS) {
    if (daysSinceCopy >= tier.minDay && daysSinceCopy <= tier.maxDay) {
      return tier.rate;
    }
  }

  // Default: no penalty (safety fallback)
  return 0;
}

/**
 * Calculate early exit fee and effective return
 *
 * @param investedCapital Amount user invested
 * @param currentPnL Current profit/loss
 * @param daysSinceCopy Days since copy was created
 * @param reservationDays Reservation period (default 30)
 * @returns Early exit fee details
 */
export function calculateEarlyExitFee(
  investedCapital: number,
  currentPnL: number,
  daysSinceCopy: number,
  reservationDays: number = 30
): {
  fee: number;                // Early exit fee amount
  penaltyRate: number;        // Penalty rate applied
  isEarlyExit: boolean;       // Whether this is early exit
  effectiveReturn: number;    // What user sees as return %
  userReceives: number;       // Total amount user receives
} {
  const isEarlyExit = daysSinceCopy < reservationDays;

  if (!isEarlyExit) {
    // No penalty after reservation period
    return {
      fee: 0,
      penaltyRate: 0,
      isEarlyExit: false,
      effectiveReturn: (currentPnL / investedCapital) * 100,
      userReceives: investedCapital + currentPnL,
    };
  }

  // Calculate base fee
  const penaltyRate = getEarlyExitPenaltyRate(daysSinceCopy, reservationDays);
  let fee = investedCapital * penaltyRate;

  // Cap fee: user must receive at least 0 (don't create debt)
  const maxFee = investedCapital + currentPnL;
  if (fee > maxFee) {
    fee = Math.max(0, maxFee);
  }

  const userReceives = investedCapital + currentPnL - fee;
  const effectiveReturn = ((userReceives - investedCapital) / investedCapital) * 100;

  return {
    fee,
    penaltyRate,
    isEarlyExit: true,
    effectiveReturn,
    userReceives,
  };
}

// ============================================================================
// Periodic Settlement — REMOVED (replaced by manual Collect P&L)
// See botsApi.collectProfit() for the new mechanism.
// ============================================================================

/**
 * Get days remaining in reservation period
 * @param createdAt Copy creation timestamp
 * @param reservationDays Reservation period (default 30)
 * @returns Days remaining (0 if expired)
 */
export function getDaysRemainingInReservation(
  createdAt: number,
  reservationDays: number = 30
): number {
  const now = Date.now();
  const daysSinceCreated = (now - createdAt) / (1000 * 60 * 60 * 24);
  const daysRemaining = reservationDays - daysSinceCreated;

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

/**
 * Check if copy is within reservation period
 * @param createdAt Copy creation timestamp
 * @param reservationDays Reservation period (default 30)
 * @returns True if still within reservation period
 */
export function isWithinReservationPeriod(
  createdAt: number,
  reservationDays: number = 30
): boolean {
  return getDaysRemainingInReservation(createdAt, reservationDays) > 0;
}

