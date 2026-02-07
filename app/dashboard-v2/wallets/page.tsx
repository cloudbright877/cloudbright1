'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { getBalance, getUserTransactions } from '@/lib/balances';

const currencyGradients: Record<string, string> = {
  USDT: 'from-green-500 to-emerald-500',
  BTC: 'from-orange-500 to-yellow-500',
  ETH: 'from-blue-500 to-cyan-500',
  BNB: 'from-yellow-500 to-amber-500',
  USDC: 'from-blue-600 to-blue-400',
  SOL: 'from-purple-500 to-pink-500',
  TRX: 'from-red-500 to-orange-500',
};

// Map currency abbreviations to SVG file names
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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load balance data
  useEffect(() => {
    async function loadBalance() {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          console.warn('[Wallets] No current user found');
          setIsLoading(false);
          return;
        }

        setCurrentUserId(userId);

        const userBalance = await getBalance(userId);
        setBalance(userBalance);

        const userTx = await getUserTransactions(userId);
        setTransactions(userTx.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10));

        setIsLoading(false);
      } catch (error) {
        console.error('[Wallets] Error loading balance:', error);
        setIsLoading(false);
      }
    }

    loadBalance();

    // Auto-refresh every 10 seconds
    const interval = setInterval(loadBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  // Create wallet object for display (always show USDT, even if $0)
  const wallets = [{
    symbol: 'USDT',
    name: 'Tether',
    balance: balance ? (balance.available + balance.frozen) : 0,
    available: balance ? balance.available : 0,
    frozen: balance ? balance.frozen : 0,
    usdValue: balance ? (balance.available + balance.frozen) : 0,
  }];

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return '↓';
      case 'WITHDRAW':
        return '↑';
      case 'COPY_OPEN':
        return '🔒';
      case 'COPY_CLOSE':
        return '🔓';
      case 'REFERRAL_COMMISSION':
        return '💰';
      case 'TURNOVER_BONUS':
        return '🏆';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'COPY_CLOSE':
      case 'REFERRAL_COMMISSION':
      case 'TURNOVER_BONUS':
        return 'text-green-400';
      case 'WITHDRAW':
      case 'COPY_OPEN':
        return 'text-red-400';
      default:
        return 'text-dark-400';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-dark-300">Loading wallet data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Wallets</h1>
        <p className="text-dark-300">Manage your funds and track transactions</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Wallets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallets Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {wallets.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-dark-300">No wallets available</div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {wallets.map((wallet: any, index: number) => (
                  <motion.div
                    key={wallet.symbol}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard
                      variant="glow"
                      gradient={currencyGradients[wallet.symbol] || 'from-gray-500 to-gray-600'}
                      className="group"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 flex items-center justify-center">
                          {currencyIconFiles[wallet.symbol] ? (
                            <Image
                              src={`/currency/${currencyIconFiles[wallet.symbol]}`}
                              alt={wallet.symbol}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-white text-2xl font-bold">
                              {wallet.symbol[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                          <p className="text-sm text-dark-400">{wallet.symbol}</p>
                        </div>
                      </div>

                      {/* Total Balance */}
                      <div className="mb-4">
                        <div className="text-xs text-dark-400 mb-1">Total Balance</div>
                        <div className="text-2xl font-bold text-white mb-2">
                          ${formatNumber(wallet.balance, 2)}
                        </div>

                        {/* Frozen/Available Split */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-dark-400 flex items-center gap-1">
                              <span>✓</span> Available
                            </span>
                            <span className="text-green-400 font-medium">
                              ${formatNumber(wallet.available, 2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-dark-400 flex items-center gap-1">
                              <span>🔒</span> In Active Copies
                            </span>
                            <span className="text-yellow-400 font-medium">
                              ${formatNumber(wallet.frozen, 2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/dashboard-v2/wallets/deposit"
                          className="py-2 px-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-sm text-primary-400 font-medium transition-colors text-center"
                        >
                          ↓ Deposit
                        </Link>
                        <Link
                          href="/dashboard-v2/wallets/withdraw"
                          className="py-2 px-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white font-medium transition-colors text-center disabled:opacity-50"
                        >
                          ↑ Withdraw
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-1">Recent Transactions</h3>
              <p className="text-xs text-dark-500 mb-4">Last 10 transactions</p>
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg"
                    >
                      <div className={`text-2xl ${getTransactionColor(tx.type)}`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {tx.type.replace(/_/g, ' ')}
                          </span>
                          {tx.direction === 'IN' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                              +
                            </span>
                          )}
                          {tx.direction === 'OUT' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                              -
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-dark-400">
                          ${formatNumber(tx.amount, 2)}
                        </div>
                        <div className="text-xs text-dark-500">
                          {formatTime(tx.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-dark-400">
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-sm">No transactions yet</div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Balance Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Balance Info</h3>
              <div className="space-y-3 text-sm text-dark-300">
                <div className="flex gap-3">
                  <span className="text-xl">✓</span>
                  <div>
                    <div className="font-medium text-white">Available Balance</div>
                    <div className="text-xs">Funds you can withdraw or invest in new copies</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <div className="font-medium text-white">Frozen Balance</div>
                    <div className="text-xs">Capital currently invested in active copy trading positions</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-medium text-white">Commission Earnings</div>
                    <div className="text-xs">Instantly credited to available balance when referrals close profitable copies</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
