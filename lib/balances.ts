/**
 * Balance System - Frozen vs Available Balance
 *
 * Architecture:
 * - Frozen: Capital locked in ACTIVE user copies
 * - Available: Capital that can be withdrawn or used for new copies
 * - Total Balance = Frozen + Available
 *
 * Flow:
 * 1. Deposit → Available++
 * 2. Open Copy → Available--, Frozen++
 * 3. Close Copy → Frozen--, Available++ (principal + profit - commissions)
 * 4. Withdraw → Available--
 */

import { storage } from './storage/LocalStorageAdapter';

const BALANCES_KEY = 'balances';
const BALANCE_TRANSACTIONS_KEY = 'balance_transactions';

export type BalanceTransactionType =
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'COPY_OPEN'
  | 'COPY_CLOSE'
  | 'REFERRAL_COMMISSION'
  | 'TURNOVER_BONUS';

export type BalanceType = 'frozen' | 'available';
export type TransactionDirection = 'IN' | 'OUT';

export interface Balance {
  id: string; // userId (used as primary key)
  userId: string; // Duplicate for convenience
  currency: 'USDT'; // Only USDT for now
  frozen: number; // In active copies
  available: number; // Available for withdrawal/new copies
  updatedAt: number;
}

export interface BalanceTransaction {
  id: string;
  userId: string;
  type: BalanceTransactionType;
  amount: number;
  balanceType: BalanceType; // Which balance was affected
  direction: TransactionDirection; // IN or OUT
  relatedEntityId?: string; // copyId, commissionId, etc.
  balanceBefore: number; // Balance before transaction
  balanceAfter: number; // Balance after transaction
  createdAt: number;
}

/**
 * Get or create balance for a user
 */
export async function getBalance(userId: string): Promise<Balance> {
  let balance = await storage.get<Balance>(BALANCES_KEY, userId);

  if (!balance) {
    balance = {
      id: userId, // userId is the primary key
      userId,
      currency: 'USDT',
      frozen: 0,
      available: 0,
      updatedAt: Date.now(),
    };
    await storage.create(BALANCES_KEY, balance);
  }

  return balance;
}

/**
 * Update balance (frozen and/or available)
 */
export async function updateBalance(
  userId: string,
  changes: { frozen?: number; available?: number }
): Promise<Balance> {
  const balance = await getBalance(userId);

  const updated = await storage.update<Balance>(BALANCES_KEY, userId, {
    ...changes,
    updatedAt: Date.now(),
  });

  console.log(`[Balances] Updated user ${userId}:`, changes);
  return updated;
}

/**
 * Record a balance transaction
 */
export async function recordTransaction(tx: Omit<BalanceTransaction, 'id' | 'createdAt'>): Promise<BalanceTransaction> {
  const transaction: BalanceTransaction = {
    ...tx,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  await storage.create(BALANCE_TRANSACTIONS_KEY, transaction);
  console.log(`[Balances] Transaction recorded:`, transaction);

  return transaction;
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string): Promise<BalanceTransaction[]> {
  const transactions = await storage.list<BalanceTransaction>(BALANCE_TRANSACTIONS_KEY, { userId });
  return transactions.sort((a, b) => b.createdAt - a.createdAt); // Most recent first
}

/**
 * Get recent transactions for a user (last N)
 */
export async function getRecentTransactions(userId: string, limit: number = 10): Promise<BalanceTransaction[]> {
  const transactions = await getUserTransactions(userId);
  return transactions.slice(0, limit);
}

/**
 * Deposit funds to available balance
 */
export async function deposit(userId: string, amount: number): Promise<Balance> {
  if (amount <= 0) {
    throw new Error('Deposit amount must be positive');
  }

  const balance = await getBalance(userId);
  const balanceBefore = balance.available;
  const balanceAfter = balanceBefore + amount;

  // Update balance
  const updated = await updateBalance(userId, { available: balanceAfter });

  // Record transaction
  await recordTransaction({
    userId,
    type: 'DEPOSIT',
    amount,
    balanceType: 'available',
    direction: 'IN',
    balanceBefore,
    balanceAfter,
  });

  return updated;
}

/**
 * Withdraw funds from available balance
 */
export async function withdraw(userId: string, amount: number, address: string): Promise<Balance> {
  if (amount <= 0) {
    throw new Error('Withdrawal amount must be positive');
  }

  const balance = await getBalance(userId);

  if (balance.available < amount) {
    throw new Error(`Insufficient available balance: ${balance.available} < ${amount}`);
  }

  const balanceBefore = balance.available;
  const balanceAfter = balanceBefore - amount;

  // Update balance
  const updated = await updateBalance(userId, { available: balanceAfter });

  // Record transaction
  await recordTransaction({
    userId,
    type: 'WITHDRAW',
    amount,
    balanceType: 'available',
    direction: 'OUT',
    relatedEntityId: address, // Store withdrawal address
    balanceBefore,
    balanceAfter,
  });

  return updated;
}

/**
 * Move funds from available to frozen (when opening a copy)
 */
export async function freezeFunds(userId: string, amount: number, copyId: string): Promise<Balance> {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  const balance = await getBalance(userId);

  if (balance.available < amount) {
    throw new Error(`Insufficient available balance: ${balance.available} < ${amount}`);
  }

  const availableBefore = balance.available;
  const frozenBefore = balance.frozen;

  // Update both balances
  const updated = await updateBalance(userId, {
    available: availableBefore - amount,
    frozen: frozenBefore + amount,
  });

  // Record transaction (OUT from available)
  await recordTransaction({
    userId,
    type: 'COPY_OPEN',
    amount,
    balanceType: 'available',
    direction: 'OUT',
    relatedEntityId: copyId,
    balanceBefore: availableBefore,
    balanceAfter: availableBefore - amount,
  });

  return updated;
}

/**
 * Move funds from frozen to available (when closing a copy)
 */
export async function unfreezeFunds(
  userId: string,
  investedAmount: number,
  receivedAmount: number,
  copyId: string
): Promise<Balance> {
  const balance = await getBalance(userId);

  if (balance.frozen < investedAmount) {
    throw new Error(`Insufficient frozen balance: ${balance.frozen} < ${investedAmount}`);
  }

  const availableBefore = balance.available;
  const frozenBefore = balance.frozen;

  // Update both balances
  const updated = await updateBalance(userId, {
    available: availableBefore + receivedAmount,
    frozen: frozenBefore - investedAmount,
  });

  // Record transaction (IN to available)
  await recordTransaction({
    userId,
    type: 'COPY_CLOSE',
    amount: receivedAmount,
    balanceType: 'available',
    direction: 'IN',
    relatedEntityId: copyId,
    balanceBefore: availableBefore,
    balanceAfter: availableBefore + receivedAmount,
  });

  return updated;
}

/**
 * Credit referral commission to available balance
 */
export async function creditCommission(
  userId: string,
  amount: number,
  commissionId: string
): Promise<Balance> {
  const balance = await getBalance(userId);
  const balanceBefore = balance.available;
  const balanceAfter = balanceBefore + amount;

  // Update balance
  const updated = await updateBalance(userId, { available: balanceAfter });

  // Record transaction
  await recordTransaction({
    userId,
    type: 'REFERRAL_COMMISSION',
    amount,
    balanceType: 'available',
    direction: 'IN',
    relatedEntityId: commissionId,
    balanceBefore,
    balanceAfter,
  });

  return updated;
}

/**
 * Credit turnover bonus to available balance
 */
export async function creditTurnoverBonus(
  userId: string,
  amount: number,
  bonusId: string
): Promise<Balance> {
  const balance = await getBalance(userId);
  const balanceBefore = balance.available;
  const balanceAfter = balanceBefore + amount;

  // Update balance
  const updated = await updateBalance(userId, { available: balanceAfter });

  // Record transaction
  await recordTransaction({
    userId,
    type: 'TURNOVER_BONUS',
    amount,
    balanceType: 'available',
    direction: 'IN',
    relatedEntityId: bonusId,
    balanceBefore,
    balanceAfter,
  });

  return updated;
}

/**
 * Get total balance (frozen + available)
 */
export async function getTotalBalance(userId: string): Promise<number> {
  const balance = await getBalance(userId);
  return balance.frozen + balance.available;
}

/**
 * Clear all balances (for testing)
 */
export async function clearAllBalances(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(BALANCES_KEY);
    localStorage.removeItem(BALANCE_TRANSACTIONS_KEY);
  }
  console.log('[Balances] Cleared all balances and transactions');
}
