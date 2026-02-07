'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Lock,
  Unlock,
  Gift,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import type { BalanceTransactionType } from '@/lib/balances';

interface TransactionRowProps {
  type: BalanceTransactionType;
  amount: number;
  direction: 'IN' | 'OUT';
  timestamp: number;
  relatedEntity?: string;
  delay?: number;
}

const TRANSACTION_CONFIG: Record<
  BalanceTransactionType,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  DEPOSIT: {
    icon: ArrowDownLeft,
    label: 'Deposit',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  WITHDRAW: {
    icon: ArrowUpLeft,
    label: 'Withdrawal',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  COPY_OPEN: {
    icon: Lock,
    label: 'Copy Opened',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  COPY_CLOSE: {
    icon: Unlock,
    label: 'Copy Closed',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  REFERRAL_COMMISSION: {
    icon: Gift,
    label: 'Referral Commission',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  TURNOVER_BONUS: {
    icon: Trophy,
    label: 'Turnover Bonus',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
};

export default function TransactionRow({
  type,
  amount,
  direction,
  timestamp,
  relatedEntity,
  delay = 0,
}: TransactionRowProps) {
  const config = TRANSACTION_CONFIG[type] || {
    icon: HelpCircle,
    label: type.replace(/_/g, ' '),
    color: 'text-dark-400',
    bgColor: 'bg-dark-700/10',
  };

  const Icon = config.icon;

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 bg-dark-800/50 hover:bg-dark-800 rounded-lg transition-colors"
    >
      {/* Icon */}
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${config.bgColor}
        `}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{config.label}</span>
          {direction === 'IN' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold">
              +
            </span>
          )}
          {direction === 'OUT' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">
              -
            </span>
          )}
        </div>
        <div className="text-sm font-semibold text-white mt-0.5">
          ${formatAmount(amount)}
        </div>
        <div className="text-xs text-dark-500 mt-0.5">{formatTime(timestamp)}</div>
        {relatedEntity && (
          <div className="text-xs text-dark-600 font-mono mt-0.5 truncate">
            {relatedEntity}
          </div>
        )}
      </div>
    </motion.div>
  );
}
