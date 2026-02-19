'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Wallet,
  Lock,
  Receipt,
  Gift,
  ChevronLeft,
  ChevronRight,
  Link2,
  Inbox,
} from 'lucide-react';
import { TokenUSDT } from '@web3icons/react';
import { getBalance, getUserTransactions } from '@/lib/balances';
import type { BalanceTransaction } from '@/lib/balances';
import { getCurrentUserId } from '@/lib/getCurrentUserId';

type TabType = 'all' | 'replenishment' | 'withdrawals' | 'referral-bonuses';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  date: number;
  status: string;
  relatedEntityId?: string;
}

function mapTransactionType(tx: BalanceTransaction): string {
  switch (tx.type) {
    case 'DEPOSIT': return 'Replenishment';
    case 'WITHDRAW': return 'Withdrawal';
    case 'COPY_OPEN': return 'Deduction';
    case 'COPY_CLOSE': return 'Accrual';
    case 'PNL_COLLECT': return 'Accrual';
    case 'REFERRAL_COMMISSION': return 'Referral Bonus';
    case 'TURNOVER_BONUS': return 'Turnover Bonus';
    default: return tx.type;
  }
}

function mapBalanceTransaction(tx: BalanceTransaction): Transaction {
  return {
    id: tx.id,
    type: mapTransactionType(tx),
    amount: tx.amount,
    currency: 'USDT',
    date: tx.createdAt,
    status: 'completed',
    relatedEntityId: tx.relatedEntityId,
  };
}

const mockTransactions: Transaction[] = [
  { id: '0xa3f8d2e91b4c6057ef12cd38', type: 'Replenishment', amount: 5000, currency: 'USDT', date: Date.now() - 3600000, status: 'completed' },
  { id: '0x7b2e4f0a19d835c6e8f1a204', type: 'Deduction', amount: 2000, currency: 'USDT', date: Date.now() - 7200000, status: 'completed', relatedEntityId: 'AlphaBot Pro' },
  { id: '0x1c9d5e3b7a0f428e6d3c8b19', type: 'Accrual', amount: 320.50, currency: 'USDT', date: Date.now() - 14400000, status: 'completed', relatedEntityId: 'AlphaBot Pro' },
  { id: '0xe4a72f6c8d1b350a9e2f7d43', type: 'Withdrawal', amount: 1500, currency: 'USDT', date: Date.now() - 86400000, status: 'completed' },
  { id: '0x5f0b8c3d2e6a914f7b8d1e56', type: 'Referral Bonus', amount: 75, currency: 'USDT', date: Date.now() - 172800000, status: 'completed' },
  { id: '0x8d1e4a7c3f5b290d6e8c2a71', type: 'Turnover Bonus', amount: 150, currency: 'USDT', date: Date.now() - 259200000, status: 'completed' },
  { id: '0x2b6f9d0e4c8a153b7d1e6f82', type: 'Replenishment', amount: 10000, currency: 'USDT', date: Date.now() - 345600000, status: 'completed' },
  { id: '0xf3c7a1d5e9b2640f8c3d7e95', type: 'Deduction', amount: 3000, currency: 'USDT', date: Date.now() - 432000000, status: 'completed', relatedEntityId: 'GridMaster X' },
  { id: '0x6e2d8b1f4a7c053e9d2b5c08', type: 'Accrual', amount: 580.25, currency: 'USDT', date: Date.now() - 518400000, status: 'completed', relatedEntityId: 'GridMaster X' },
  { id: '0x9a4f1c7e3d6b825a0f4e8d13', type: 'Withdrawal', amount: 2500, currency: 'USDT', date: Date.now() - 604800000, status: 'pending' },
  { id: '0xd5b3e8f2a1c7496d3e0b7a24', type: 'Replenishment', amount: 3000, currency: 'USDT', date: Date.now() - 691200000, status: 'completed' },
  { id: '0x4c0a6d9e2f8b317c5a1d4e37', type: 'Referral Bonus', amount: 45, currency: 'USDT', date: Date.now() - 777600000, status: 'completed' },
];

export default function WalletsPage() {
  const [balance, setBalance] = useState<{ available: number; frozen: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    async function load() {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const userBalance = await getBalance(userId);
        setBalance(userBalance);

        const txs = await getUserTransactions(userId);
        const mapped = txs.map(mapBalanceTransaction);
        if (mapped.length > 0) setAllTransactions(mapped);

        setIsLoading(false);
      } catch (error) {
        console.error('[Wallets] Error loading:', error);
        setIsLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = allTransactions;
    switch (activeTab) {
      case 'replenishment':
        filtered = allTransactions.filter(tx => tx.type === 'Replenishment' || tx.type === 'Deduction' || tx.type === 'Accrual');
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
    setCurrentPage(1);
  }, [activeTab, allTransactions]);

  const formatNumber = (num: number, decimals = 2) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Accrual': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Replenishment': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Deduction': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Withdrawal': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Referral Bonus': return 'text-accent-400 bg-accent-500/10 border-accent-500/30';
      case 'Turnover Bonus': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-dark-400 bg-dark-800 border-dark-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-dark-400 bg-dark-800 border-dark-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalIn = filteredTransactions
    .filter(tx => tx.type === 'Accrual' || tx.type === 'Replenishment' || tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = filteredTransactions
    .filter(tx => tx.type === 'Withdrawal' || tx.type === 'Deduction')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const tabs: { id: TabType; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'all', label: 'All', icon: <Receipt className="w-4 h-4" />, count: allTransactions.length },
    { id: 'replenishment', label: 'Deposits', icon: <ArrowDownLeft className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <ArrowUpLeft className="w-4 h-4" /> },
    { id: 'referral-bonuses', label: 'Bonuses', icon: <Gift className="w-4 h-4" />, count: allTransactions.filter(tx => tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus').length },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Top Section: Left Actions + Right Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6"
        >
          {/* LEFT: Deposit/Withdraw */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 h-full">
              <Link
                href="/dashboard-v2/wallets/deposit"
                className="relative group overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-green-500/50 rounded-2xl p-5 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl opacity-100 group-hover:scale-150 transition-transform" />
                <div className="relative z-10 flex items-center justify-between h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ArrowDownLeft className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Deposit</h3>
                      <p className="text-sm text-green-400/70">Add funds</p>
                    </div>
                  </div>
                  <div className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard-v2/wallets/withdraw"
                className="relative group overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-dark-600 rounded-2xl p-5 transition-all hover:shadow-2xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-dark-500/0 to-dark-600/0 group-hover:from-dark-500/20 group-hover:to-dark-600/20 blur-xl transition-all duration-500" />
                <div className="relative z-10 flex items-center gap-4 h-full">
                  <div className="w-12 h-12 bg-dark-700/50 border border-dark-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowUpLeft className="w-6 h-6 text-dark-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Withdraw</h3>
                    <p className="text-sm text-dark-400">Transfer out</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT: 3 stat cards + Funds Flow */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Balance */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/10 via-dark-800/95 to-dark-900/95 border border-primary-500/30 rounded-2xl p-5">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-primary-400" />
                    </div>
                    <span className="text-xs text-dark-400 font-medium">Total Balance</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${formatNumber(totalBalance)}
                  </div>
                </div>
              </div>

              {/* Available */}
              <div className="relative overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-green-500/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-xs text-dark-400 font-medium">Available</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    ${formatNumber(availableBalance)}
                  </div>
                </div>
              </div>

              {/* In Copies */}
              <div className="relative overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-5">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-xs text-dark-400 font-medium">In Copies</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    ${formatNumber(frozenBalance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Funds Flow */}
            <div className="relative overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-4">
              <div className="relative flex items-center justify-center gap-8">
                <div>
                  <div className="text-xs text-dark-400 mb-0.5">Total In</div>
                  <div className="text-xl font-bold text-green-400">+${formatNumber(totalIn)}</div>
                </div>
                <div className="w-px h-10 bg-dark-700" />
                <div>
                  <div className="text-xs text-dark-400 mb-0.5">Total Out</div>
                  <div className="text-xl font-bold text-red-400">-${formatNumber(totalOut)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Tabs */}
          <div className="flex items-center gap-0.5 rounded-lg bg-dark-900/50 border border-dark-700 p-1.5 inline-flex overflow-x-auto mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-md text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-dark-700 text-dark-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Date</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Type</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Currency</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((tx, index) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="text-sm text-white">{formatDate(tx.date)}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(tx.type)}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className={`text-sm font-bold ${
                            tx.type === 'Withdrawal' || tx.type === 'Deduction' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {tx.type === 'Withdrawal' || tx.type === 'Deduction' ? '-' : '+'}{formatNumber(tx.amount)}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <TokenUSDT size={24} variant="branded" />
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          {(tx.type === 'Replenishment' || tx.type === 'Withdrawal') ? (
                            <button
                              onClick={() => navigator.clipboard.writeText(tx.id)}
                              className="flex items-center gap-2 text-xs group/tx"
                              title="Copy TX ID"
                            >
                              <Link2 className="w-4 h-4 text-dark-500 group-hover/tx:text-primary-400 transition-colors flex-shrink-0" />
                              <span className="font-mono text-primary-400 group-hover/tx:text-primary-300 transition-colors truncate max-w-[180px]">
                                {tx.id}
                              </span>
                            </button>
                          ) : (tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus') ? (
                            <span className="text-xs text-dark-400">Internal</span>
                          ) : tx.relatedEntityId ? (
                            <span className="text-xs text-dark-300">{tx.relatedEntityId}</span>
                          ) : null}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-dark-700">
                    <div className="text-sm text-dark-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-4 py-2 bg-dark-800 hover:bg-dark-700 disabled:opacity-40 border border-dark-700 rounded-lg text-sm text-white font-medium transition-all disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1.5 px-4 py-2 bg-dark-800 hover:bg-dark-700 disabled:opacity-40 border border-dark-700 rounded-lg text-sm text-white font-medium transition-all disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-dark-800 rounded-full flex items-center justify-center">
                  <Inbox className="w-8 h-8 text-dark-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
                <p className="text-dark-400">No transactions match the selected filter</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
