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
  Copy,
  Check,
} from 'lucide-react';
import { TokenUSDT } from '@web3icons/react';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';
import { Pagination } from '@/components/dashboard-v2/Pagination';
import { LoadingScreen } from '@/components/dashboard-v2/LoadingScreen';
import { getBalance, getUserTransactions } from '@/lib/balances';
import type { BalanceTransaction } from '@/lib/balances';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { formatNumber, formatDateTime } from '@/lib/formatters';

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

function generateMockTransactions(count: number): Transaction[] {
  const types: { type: string; amountRange: [number, number]; bot?: string }[] = [
    { type: 'Replenishment', amountRange: [500, 15000] },
    { type: 'Replenishment', amountRange: [100, 3000] },
    { type: 'Withdrawal', amountRange: [200, 8000] },
    { type: 'Deduction', amountRange: [100, 5000], bot: 'AlphaBot Pro' },
    { type: 'Deduction', amountRange: [200, 4000], bot: 'GridMaster X' },
    { type: 'Deduction', amountRange: [150, 3000], bot: 'ScalpHunter AI' },
    { type: 'Accrual', amountRange: [50, 2500], bot: 'AlphaBot Pro' },
    { type: 'Accrual', amountRange: [80, 1800], bot: 'GridMaster X' },
    { type: 'Accrual', amountRange: [30, 1200], bot: 'ScalpHunter AI' },
    { type: 'Referral Bonus', amountRange: [5, 250] },
    { type: 'Turnover Bonus', amountRange: [25, 500] },
  ];
  const hexChars = '0123456789abcdef';
  const txs: Transaction[] = [];
  // Deterministic seed for consistent SSR/CSR
  let seed = 42;
  const nextRand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

  for (let i = 0; i < count; i++) {
    const tpl = types[Math.floor(nextRand() * types.length)];
    const amount = +(tpl.amountRange[0] + nextRand() * (tpl.amountRange[1] - tpl.amountRange[0])).toFixed(2);
    let hex = '0x';
    for (let h = 0; h < 24; h++) hex += hexChars[Math.floor(nextRand() * 16)];
    const hoursAgo = i * 4 + Math.floor(nextRand() * 4);
    const isPending = tpl.type === 'Withdrawal' && nextRand() < 0.15;
    txs.push({
      id: hex,
      type: tpl.type,
      amount,
      currency: 'USDT',
      date: Date.now() - hoursAgo * 3600000,
      status: isPending ? 'pending' : 'completed',
      ...(tpl.bot ? { relatedEntityId: tpl.bot } : {}),
    });
  }
  return txs;
}

const mockTransactions: Transaction[] = generateMockTransactions(200);

export default function WalletsPage() {
  const [balance, setBalance] = useState<{ available: number; frozen: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [txCopied, setTxCopied] = useState(false);
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
        // Error handled silently
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

  const handleCopyTxId = (txId: string) => {
    navigator.clipboard.writeText(txId);
    setTxCopied(true);
    setTimeout(() => setTxCopied(false), 2000);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading wallet data..." />;
  }

  const totalBalance = balance ? balance.available + balance.frozen : 0;
  const availableBalance = balance ? balance.available : 0;
  const frozenBalance = balance ? balance.frozen : 0;
  const availablePercent = totalBalance > 0 ? (availableBalance / totalBalance) * 100 : 100;


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
    <div className="min-h-screen bg-gray-100 dark:bg-transparent text-gray-900 dark:text-white">
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 h-full">
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all hover:bg-[linear-gradient(135deg,rgba(139,92,246,0.5)_0%,rgba(139,92,246,0.1)_40%,rgba(139,92,246,0.1)_60%,rgba(139,92,246,0.5)_100%)] dark:hover:bg-[linear-gradient(135deg,rgba(139,92,246,0.5)_0%,rgba(139,92,246,0.1)_40%,rgba(139,92,246,0.1)_60%,rgba(139,92,246,0.5)_100%)]">
                <Link
                  href="/dashboard-v2/wallets/deposit"
                  className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] py-5 px-3 sm:p-5 block h-full"
                >
                  <div className="relative flex items-center justify-between h-full">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 dark:bg-dark-700/50 border border-gray-300 dark:border-dark-600 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 rounded-xl flex items-center justify-center flex-shrink-0 transition-all">
                        <ArrowDownLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700 dark:text-dark-300 group-hover:text-primary-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white">Deposit</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Add funds</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </div>

              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all hover:bg-[linear-gradient(135deg,rgba(139,92,246,0.5)_0%,rgba(139,92,246,0.1)_40%,rgba(139,92,246,0.1)_60%,rgba(139,92,246,0.5)_100%)] dark:hover:bg-[linear-gradient(135deg,rgba(139,92,246,0.5)_0%,rgba(139,92,246,0.1)_40%,rgba(139,92,246,0.1)_60%,rgba(139,92,246,0.5)_100%)]">
                <Link
                  href="/dashboard-v2/wallets/withdraw"
                  className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] py-5 px-3 sm:p-5 block h-full"
                >
                  <div className="relative flex items-center justify-between h-full">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 dark:bg-dark-700/50 border border-gray-300 dark:border-dark-600 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 rounded-xl flex items-center justify-center flex-shrink-0 transition-all">
                        <ArrowUpLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700 dark:text-dark-300 group-hover:text-primary-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white">Withdraw</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Transfer out</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 stat cards + Funds Flow */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Balance */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-5">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-primary-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-dark-400 font-normal">Total Balance</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                      ${formatNumber(totalBalance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Available */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-5">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                        <ArrowDownLeft className="w-4 h-4 text-primary-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-dark-400 font-normal">Available</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                      ${formatNumber(availableBalance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* In Copies */}
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-5">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-dark-400 font-normal">In Copies</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                      ${formatNumber(frozenBalance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Funds Flow */}
            <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4">
              <div className="relative flex items-center justify-center gap-4 sm:gap-8">
                <div>
                  <div className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Total In</div>
                  <div className="text-lg sm:text-xl font-medium text-green-400">+${formatNumber(totalIn)}</div>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-dark-700" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-dark-400 mb-0.5">Total Out</div>
                  <div className="text-lg sm:text-xl font-medium text-red-400">-${formatNumber(totalOut)}</div>
                </div>
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
          <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap p-1.5 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 sm:py-3 font-medium rounded-lg sm:rounded-md text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white sm:shadow-lg sm:shadow-primary-500/30'
                    : 'bg-gray-200 dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 sm:bg-transparent sm:dark:bg-transparent sm:border-0 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-dark-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider">Date</th>
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider">Type</th>
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider hidden sm:table-cell">Currency</th>
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="text-left py-4 px-3 sm:px-5 text-xs font-medium text-gray-600 dark:text-dark-400 uppercase tracking-wider hidden lg:table-cell">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((tx, index) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedTransaction(tx)}
                        className="border-b border-gray-200 dark:border-dark-800/50 hover:bg-gray-100 dark:hover:bg-dark-800/30 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-3 sm:px-5">
                          <div className="text-sm text-gray-900 dark:text-white">{formatDateTime(tx.date)}</div>
                        </td>
                        <td className="py-4 px-3 sm:px-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor(tx.type)}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-3 sm:px-5">
                          <div className={`text-sm font-medium ${
                            tx.type === 'Withdrawal' || tx.type === 'Deduction' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {tx.type === 'Withdrawal' || tx.type === 'Deduction' ? '-' : '+'}{formatNumber(tx.amount)}
                          </div>
                        </td>
                        <td className="py-4 px-3 sm:px-5 hidden sm:table-cell">
                          <TokenUSDT size={24} variant="branded" />
                        </td>
                        <td className="py-4 px-3 sm:px-5 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 sm:px-5 hidden lg:table-cell">
                          {(tx.type === 'Replenishment' || tx.type === 'Withdrawal') ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(tx.id); }}
                              className="flex items-center gap-2 text-xs group/tx focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded"
                              aria-label="Copy transaction ID"
                              title="Copy TX ID"
                            >
                              <Link2 className="w-4 h-4 text-gray-500 dark:text-dark-500 group-hover/tx:text-primary-400 transition-colors flex-shrink-0" />
                              <span className="font-mono text-primary-400 group-hover/tx:text-primary-300 transition-colors truncate max-w-[180px]">
                                {tx.id}
                              </span>
                            </button>
                          ) : (tx.type === 'Referral Bonus' || tx.type === 'Turnover Bonus') ? (
                            <span className="text-xs text-gray-600 dark:text-dark-400">Internal</span>
                          ) : tx.relatedEntityId ? (
                            <span className="text-xs text-gray-700 dark:text-dark-300">{tx.relatedEntityId}</span>
                          ) : null}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredTransactions.length}
                  itemsPerPage={transactionsPerPage}
                  onPageChange={setCurrentPage}
                  className="px-3 sm:px-5 py-4 border-t border-gray-200 dark:border-dark-700"
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center">
                  <Inbox className="w-8 h-8 text-gray-600 dark:text-dark-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
                <p className="text-gray-600 dark:text-dark-400">No transactions match the selected filter</p>
              </div>
            )}
          </div>
          </div>
        </motion.div>

        {/* Transaction Detail Drawer */}
        <SettingsDrawer
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          title="Transaction Details"
        >
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Amount hero */}
              <div className="text-center py-4">
                <div className={`text-3xl font-bold mb-1 ${
                  selectedTransaction.type === 'Withdrawal' || selectedTransaction.type === 'Deduction'
                    ? 'text-red-400' : 'text-green-400'
                }`}>
                  {selectedTransaction.type === 'Withdrawal' || selectedTransaction.type === 'Deduction' ? '-' : '+'}
                  {formatNumber(selectedTransaction.amount)} USDT
                </div>
                <div className="text-sm text-gray-500 dark:text-dark-400">
                  {formatDateTime(selectedTransaction.date)}
                </div>
              </div>

              {/* Details list */}
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-800">
                  <span className="text-sm text-gray-500 dark:text-dark-400">Type</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-800">
                  <span className="text-sm text-gray-500 dark:text-dark-400">Amount</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatNumber(selectedTransaction.amount)}</span>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-800">
                  <span className="text-sm text-gray-500 dark:text-dark-400">Currency</span>
                  <div className="flex items-center gap-2">
                    <TokenUSDT size={20} variant="branded" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">USDT</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-800">
                  <span className="text-sm text-gray-500 dark:text-dark-400">Date</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.date).toLocaleString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-800">
                  <span className="text-sm text-gray-500 dark:text-dark-400">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                {/* Details / TX ID */}
                <div className="py-3">
                  <span className="text-sm text-gray-500 dark:text-dark-400 mb-2 block">Details</span>
                  {(selectedTransaction.type === 'Replenishment' || selectedTransaction.type === 'Withdrawal') ? (
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                      <Link2 className="w-4 h-4 text-gray-400 dark:text-dark-500 flex-shrink-0" />
                      <span className="font-mono text-xs text-primary-400 truncate flex-1">{selectedTransaction.id}</span>
                      <button
                        onClick={() => handleCopyTxId(selectedTransaction.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 dark:bg-dark-800 hover:bg-gray-300 dark:hover:bg-dark-700 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                        aria-label="Copy transaction ID"
                        title="Copy TX ID"
                      >
                        {txCopied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                        )}
                      </button>
                    </div>
                  ) : (selectedTransaction.type === 'Referral Bonus' || selectedTransaction.type === 'Turnover Bonus') ? (
                    <div className="text-sm text-gray-600 dark:text-dark-400 bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                      Internal system transaction
                    </div>
                  ) : selectedTransaction.relatedEntityId ? (
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                      Bot: {selectedTransaction.relatedEntityId}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-dark-400 bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3">
                      No additional details
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SettingsDrawer>
      </div>
    </div>
  );
}
