'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import {
  getUserCommissions,
  getCommissionStats,
  type ReferralCommission,
  type CommissionLevel,
} from '@/lib/referralCommissions';

interface CommissionHistoryProps {
  userId: string;
  limit?: number;
  showStats?: boolean;
}

export default function CommissionHistory({
  userId,
  limit,
  showStats = true,
}: CommissionHistoryProps) {
  const [commissions, setCommissions] = useState<ReferralCommission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<CommissionLevel | 'all'>('all');

  useEffect(() => {
    loadCommissions();

    // Refresh every 10 seconds
    const interval = setInterval(loadCommissions, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadCommissions = async () => {
    try {
      const [commissionsData, statsData] = await Promise.all([
        getUserCommissions(userId),
        showStats ? getCommissionStats(userId) : Promise.resolve(null),
      ]);

      setCommissions(limit ? commissionsData.slice(0, limit) : commissionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load commissions:', error);
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

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredCommissions =
    filterLevel === 'all'
      ? commissions
      : commissions.filter(c => c.level === filterLevel);

  if (loading) {
    return (
      <GlassCard>
        <div className="animate-pulse">
          <div className="h-6 bg-dark-700 rounded mb-4 w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-dark-700 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Commission History</h3>
        {showStats && stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              ${formatNumber(stats.totalEarned)}
            </div>
            <div className="text-xs text-dark-400">Total Earned</div>
          </div>
        )}
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterLevel('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filterLevel === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-dark-400 hover:text-white'
          }`}
        >
          All ({commissions.length})
        </button>
        {([1, 2, 3, 4, 5] as CommissionLevel[]).map(level => {
          const count = commissions.filter(c => c.level === level).length;
          return (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filterLevel === level
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white'
              }`}
            >
              L{level} ({count})
            </button>
          );
        })}
      </div>

      {/* Commissions List */}
      {filteredCommissions.length > 0 ? (
        <div className="space-y-3">
          {filteredCommissions.map((commission, index) => (
            <motion.div
              key={commission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors"
            >
              {/* Level Badge */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-white/80">L{commission.level}</div>
                  <div className="text-xs font-bold text-white">
                    {(commission.commissionRate * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Commission Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-green-400">
                    +${formatNumber(commission.commissionAmount)}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      commission.status === 'PAID'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {commission.status}
                  </span>
                </div>
                <div className="text-xs text-dark-400 truncate">
                  From investor P&L: ${formatNumber(commission.investorPnL)}
                </div>
                <div className="text-xs text-dark-500">{timeAgo(commission.createdAt)}</div>
              </div>

              {/* Arrow Icon */}
              <div className="text-green-400 text-xl">→</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-dark-400">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-sm">No commissions yet</div>
          <div className="text-xs mt-1">Invite friends to start earning</div>
        </div>
      )}

      {/* View More Link */}
      {limit && commissions.length > limit && (
        <div className="mt-4 pt-3 border-t border-dark-700 text-center">
          <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            View All {commissions.length} Commissions →
          </button>
        </div>
      )}
    </GlassCard>
  );
}
