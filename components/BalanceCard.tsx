'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import { getBalance, type Balance } from '@/lib/balances';

interface BalanceCardProps {
  userId: string;
  showBreakdown?: boolean;
}

export default function BalanceCard({ userId, showBreakdown = true }: BalanceCardProps) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();

    // Refresh every 5 seconds
    const interval = setInterval(loadBalance, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadBalance = async () => {
    try {
      const data = await getBalance(userId);
      setBalance(data);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="animate-pulse">
          <div className="h-6 bg-dark-700 rounded mb-4 w-24"></div>
          <div className="h-10 bg-dark-700 rounded mb-2 w-40"></div>
          <div className="h-4 bg-dark-700 rounded w-32"></div>
        </div>
      </GlassCard>
    );
  }

  if (!balance) {
    return (
      <GlassCard>
        <div className="text-center py-8 text-dark-400">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-sm">Balance not available</div>
        </div>
      </GlassCard>
    );
  }

  const totalBalance = balance.frozen + balance.available;

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Balance</h3>
        <span className="text-2xl">💰</span>
      </div>

      {/* Total Balance */}
      <div className="mb-4">
        <div className="text-sm text-dark-400 mb-1">Total Balance</div>
        <div className="text-3xl font-bold text-gradient">
          ${formatNumber(totalBalance)}
        </div>
      </div>

      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Available Balance */}
          <div className="p-3 bg-dark-800/50 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✓</span>
              <span className="text-xs text-dark-400">Available</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              ${formatNumber(balance.available)}
            </div>
            <div className="text-xs text-dark-500 mt-1">
              Ready to withdraw or invest
            </div>
          </div>

          {/* Frozen Balance */}
          <div className="p-3 bg-dark-800/50 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🔒</span>
              <span className="text-xs text-dark-400">In Active Copies</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">
              ${formatNumber(balance.frozen)}
            </div>
            <div className="text-xs text-dark-500 mt-1">
              Invested in trading bots
            </div>
          </div>
        </motion.div>
      )}

      {/* Last Update */}
      <div className="mt-4 pt-3 border-t border-dark-700 text-xs text-dark-500 text-center">
        Last updated: {new Date(balance.updatedAt).toLocaleTimeString()}
      </div>
    </GlassCard>
  );
}
