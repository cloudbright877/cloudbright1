'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpLeft, Activity } from 'lucide-react';
import BalanceHeroCard from '@/components/wallet/BalanceHeroCard';
import TransactionRow from '@/components/wallet/TransactionRow';
import { getBalance, getUserTransactions } from '@/lib/balances';
import type { BalanceTransaction } from '@/lib/balances';

const currencyIconFiles: Record<string, string> = {
  USDT: 'Tether.svg',
  BTC: 'Bitcoin.svg',
  ETH: 'Ethereum.svg',
  BNB: 'bnb.svg',
  USDC: 'usdc.svg',
  SOL: 'Solana.svg',
  TRX: 'Tron.svg',
};

export default function WalletsPage() {
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBalance() {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          console.warn('[Wallets] No current user found');
          setIsLoading(false);
          return;
        }

        const userBalance = await getBalance(userId);
        setBalance(userBalance);

        const userTx = await getUserTransactions(userId);
        setTransactions(userTx.slice(0, 10));

        setIsLoading(false);
      } catch (error) {
        console.error('[Wallets] Error loading balance:', error);
        setIsLoading(false);
      }
    }

    loadBalance();

    const interval = setInterval(loadBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-dark-300">Loading wallet data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = balance ? balance.available + balance.frozen : 0;
  const availableBalance = balance ? balance.available : 0;
  const frozenBalance = balance ? balance.frozen : 0;
  const availablePercent = totalBalance > 0 ? (availableBalance / totalBalance) * 100 : 100;

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Wallets</h1>
            <p className="text-dark-400">Manage your funds and track transactions</p>
          </div>
        </motion.div>

        {/* Bento Grid Layout - Portfolio Hub (Variant A) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Hero Balance Card - col-span-7, row-span-2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 lg:row-span-2"
          >
            <BalanceHeroCard
              totalBalance={totalBalance}
              availableBalance={availableBalance}
              frozenBalance={frozenBalance}
            />
          </motion.div>

          {/* Quick Actions - col-span-5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Deposit Card */}
              <Link
                href="/dashboard-v2/wallets/deposit"
                className="relative group overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 hover:border-green-500/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-green-500/20"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 blur-xl transition-all duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-4">
                    <ArrowDownLeft className="w-7 h-7 text-green-400" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-lg font-bold text-white mb-1">Deposit</h3>
                    <p className="text-sm text-green-400/70">Add funds to wallet</p>
                  </div>
                </div>
              </Link>

              {/* Withdraw Card */}
              <Link
                href="/dashboard-v2/wallets/withdraw"
                className="relative group overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-dark-600 rounded-2xl p-6 transition-all hover:shadow-2xl"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-dark-500/0 to-dark-600/0 group-hover:from-dark-500/20 group-hover:to-dark-600/20 blur-xl transition-all duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-dark-700/50 border border-dark-600 rounded-xl flex items-center justify-center mb-4">
                    <ArrowUpLeft className="w-7 h-7 text-dark-300" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-lg font-bold text-white mb-1">Withdraw</h3>
                    <p className="text-sm text-dark-400">Transfer funds out</p>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Balance Breakdown - col-span-5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Balance Breakdown</h3>

              {/* Currency Display */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12">
                  <Image
                    src={`/currency/${currencyIconFiles.USDT}`}
                    alt="USDT"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm text-dark-400">Tether (USDT)</div>
                  <div className="text-2xl font-bold text-white">
                    ${formatNumber(totalBalance, 2)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-dark-500 mb-2">
                  <span>Available</span>
                  <span>Frozen</span>
                </div>
                <div className="relative h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${availablePercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-dark-400 mt-2">
                  <span>{formatNumber(availablePercent, 1)}%</span>
                  <span>{formatNumber(100 - availablePercent, 1)}%</span>
                </div>
              </div>

              {/* Breakdown Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-xs text-green-400/70 mb-1">Available</div>
                  <div className="text-lg font-bold text-green-400">
                    ${formatNumber(availableBalance, 2)}
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="text-xs text-yellow-400/70 mb-1">In Copies</div>
                  <div className="text-lg font-bold text-yellow-400">
                    ${formatNumber(frozenBalance, 2)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions - col-span-12 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12"
          >
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    <p className="text-xs text-dark-400">Latest activity on your wallet</p>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="p-5">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                    <p className="text-dark-400 mb-1">No transactions yet</p>
                    <p className="text-sm text-dark-500">
                      Deposit funds or open a copy to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {transactions.map((tx, index) => (
                      <TransactionRow
                        key={tx.id}
                        type={tx.type}
                        amount={tx.amount}
                        direction={tx.direction}
                        timestamp={tx.createdAt}
                        relatedEntity={tx.relatedEntityId}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
