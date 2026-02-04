'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';

type TabType = 'all' | 'accruals' | 'replenishment' | 'withdrawals' | 'referral-bonuses';

interface Transaction {
  id: number;
  investmentId?: string;
  type: string;
  amount: number;
  currency: string;
  date: number;
  status: string;
  planId?: number;
  planName?: string;
  hash?: string;
  referralUser?: string;
  level?: number;
  totalProfit?: number;
  investmentAmount?: number;
  daysElapsed?: number;
  totalDays?: number;
  nextAccrual?: number;
}


const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    investmentId: '#1001',
    type: 'Accrual',
    amount: 125.50,
    currency: 'USDT',
    date: Date.now() - 2 * 60 * 60 * 1000,
    status: 'completed',
    planName: 'Premium Plan',
    totalProfit: 1255.00,
    daysElapsed: 5,
    totalDays: 30,
  },
  {
    id: 2,
    type: 'Referral Bonus',
    amount: 50.00,
    currency: 'USDT',
    date: Date.now() - 5 * 60 * 60 * 1000,
    status: 'completed',
    referralUser: 'alice_investor',
    level: 1,
  },
  {
    id: 3,
    type: 'Replenishment',
    amount: 5000.00,
    currency: 'USDT',
    date: Date.now() - 24 * 60 * 60 * 1000,
    status: 'completed',
    hash: '0x1a2b3c4d...9e8f',
  },
  {
    id: 4,
    type: 'Withdrawal',
    amount: 1000.00,
    currency: 'USDT',
    date: Date.now() - 48 * 60 * 60 * 1000,
    status: 'pending',
  },
  {
    id: 5,
    investmentId: '#1002',
    type: 'Accrual',
    amount: 87.30,
    currency: 'USDT',
    date: Date.now() - 50 * 60 * 60 * 1000,
    status: 'completed',
    planName: 'Standard Plan',
    totalProfit: 873.00,
    daysElapsed: 3,
    totalDays: 20,
  },
];

function TransactionsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'all');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Filter transactions based on active tab
  useEffect(() => {
    let filtered = allTransactions;

    switch (activeTab) {
      case 'accruals':
        filtered = allTransactions.filter(tx => tx.type === 'Accrual');
        break;
      case 'replenishment':
        filtered = allTransactions.filter(tx => tx.type === 'Replenishment' || tx.type === 'Deduction');
        break;
      case 'withdrawals':
        filtered = allTransactions.filter(tx => tx.type === 'Withdrawal');
        break;
      case 'referral-bonuses':
        filtered = allTransactions.filter(tx => tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus');
        break;
      default:
        filtered = allTransactions;
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeTab, allTransactions]);

  // Sync tab with URL param
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs = [
    { id: 'all', label: 'All Transactions', icon: '📋', count: allTransactions.length },
    { id: 'accruals', label: 'Accruals', icon: '💰', count: allTransactions.filter(tx => tx.type === 'Accrual').length },
    { id: 'replenishment', label: 'Deposits', icon: '↓' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '↑' },
    { id: 'referral-bonuses', label: 'Referral Bonuses', icon: '🎁', count: allTransactions.filter(tx => tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus').length },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Accrual':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Replenishment':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Deduction':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Withdrawal':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Referral Bonus':
        return 'text-accent-400 bg-accent-500/10 border-accent-500/30';
      case 'Turnover Bonus':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-dark-400 bg-dark-800 border-dark-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-dark-400 bg-dark-800 border-dark-700';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(num);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Transaction History
        </h1>
        <p className="text-dark-300">
          View all your transactions and activities
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 p-2 bg-dark-900/50 backdrop-blur-sm rounded-2xl border-2 border-dark-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Currency</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-dark-800 hover:bg-dark-900/50 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-white">{formatDate(tx.date)}</div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <div className={`text-sm font-bold ${
                          tx.type === 'Withdrawal' || tx.type === 'Deduction' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {tx.type === 'Withdrawal' || tx.type === 'Deduction' ? '-' : '+'}{formatNumber(tx.amount)}
                        </div>
                      </td>

                      {/* Currency */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-white font-medium">{tx.currency}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-4">
                        <div className="text-xs text-dark-400 space-y-1">
                          {tx.investmentId && (
                            <div className="flex items-center gap-1">
                              <span>🆔</span>
                              <span className="font-mono font-bold text-white">{tx.investmentId}</span>
                            </div>
                          )}
                          {tx.planName && (
                            <div className="flex items-center gap-1">
                              <span>💼</span>
                              <span>{tx.planName}</span>
                            </div>
                          )}
                          {tx.totalProfit !== undefined && (
                            <div className="flex items-center gap-1">
                              <span>📊</span>
                              <span>Total profit: {formatNumber(tx.totalProfit)} {tx.currency}</span>
                            </div>
                          )}
                          {tx.daysElapsed !== undefined && tx.totalDays !== undefined && (
                            <div className="flex items-center gap-1">
                              <span>📅</span>
                              <span>Day {tx.daysElapsed}/{tx.totalDays}</span>
                            </div>
                          )}
                          {tx.hash && (
                            <div className="flex items-center gap-1">
                              <span>🔗</span>
                              <span className="font-mono">{tx.hash}</span>
                            </div>
                          )}
                          {tx.referralUser && (
                            <div className="flex items-center gap-1">
                              <span>👤</span>
                              <span>{tx.referralUser}</span>
                              {tx.level && <span className="text-accent-400">(Level {tx.level})</span>}
                            </div>
                          )}
                          {(tx.type === 'Replenishment' || tx.type === 'Deduction') && (
                            <div className="flex items-center gap-1">
                              <span>⛓️</span>
                              <span className="text-dark-500">Blockchain transaction</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-700">
                  <div className="text-sm text-dark-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-dark-800 hover:bg-dark-700 disabled:bg-dark-900/50 border border-dark-700 rounded-lg text-white disabled:text-dark-600 font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-dark-800 hover:bg-dark-700 disabled:bg-dark-900/50 border border-dark-700 rounded-lg text-white disabled:text-dark-600 font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
              <p className="text-dark-300">
                No transactions match the selected filter
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Summary Stats (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-4">
          <div className="text-xs text-dark-400 mb-1">Total In</div>
          <div className="text-2xl font-bold text-green-400">
+${formatNumber(
              filteredTransactions
                .filter(tx => tx.type === 'Accrual' || tx.type === 'Replenishment' || tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus')
                .reduce((sum, tx) => sum + tx.amount, 0)
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-4">
          <div className="text-xs text-dark-400 mb-1">Total Out</div>
          <div className="text-2xl font-bold text-red-400">
            -${formatNumber(
              filteredTransactions
                .filter(tx => tx.type === 'Withdrawal' || tx.type === 'Deduction')
                .reduce((sum, tx) => sum + tx.amount, 0)
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-4">
          <div className="text-xs text-dark-400 mb-1">Net Change</div>
          <div className="text-2xl font-bold text-gradient">
{(() => {
              const totalIn = filteredTransactions
                .filter(tx => tx.type !== 'Withdrawal' && tx.type !== 'Deduction')
                .reduce((sum, tx) => sum + tx.amount, 0);
              const totalOut = filteredTransactions
                .filter(tx => tx.type === 'Withdrawal' || tx.type === 'Deduction')
                .reduce((sum, tx) => sum + tx.amount, 0);
              const net = totalIn - totalOut;
              return `${net >= 0 ? '+' : ''}$${formatNumber(net)}`;
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Wrapper with Suspense boundary to satisfy Next.js 16 requirement
export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-dark-300">Loading...</div>
      </div>
    }>
      <TransactionsPageContent />
    </Suspense>
  );
}
