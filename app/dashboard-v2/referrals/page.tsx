'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Copy,
  Search,
  ChevronLeft,
  ChevronRight,
  Gift,
  Trophy,
  Zap,
  CheckCircle,
  Clock,
  Share2,
  Shield,
  Crown,
} from 'lucide-react';
import { getUser, getAllReferrals } from '@/lib/users';
import { getTotalEarned, getUserCommissions } from '@/lib/referralCommissions';
import { calculateTeamTurnover, getTurnoverStats, TURNOVER_LEVELS } from '@/lib/turnoverBonuses';
import { getBalance } from '@/lib/balances';
import { getAvatarStyle } from '@/lib/social/tier-utils';
import { getActiveUserCopies } from '@/lib/userCopies';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS (matching affiliate page)
   ═══════════════════════════════════════════════════════════════ */

const commissionStructure = [
  { level: 1, commission: 5, description: 'Direct referrals', highlight: true },
  { level: 2, commission: 3, description: 'Second level network' },
  { level: 3, commission: 2, description: 'Third level network' },
  { level: 4, commission: 1, description: 'Fourth level network' },
  { level: 5, commission: 0.5, description: 'Fifth level network' },
];

const cashflowLevels = [
  { level: 1, impact: '100%' },
  { level: 2, impact: '50%' },
  { level: 3, impact: '25%' },
  { level: 4, impact: '10%' },
  { level: 5, impact: '10%' },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

async function calculateReferralLevel(
  uplineUserId: string,
  referralUserId: string,
): Promise<number> {
  const referral = await getUser(referralUserId);
  if (!referral || !referral.referralPath) return 0;
  const pathParts = referral.referralPath.split('/').filter(Boolean);
  const uplineIndex = pathParts.indexOf(uplineUserId);
  if (uplineIndex === -1) return 0;
  return pathParts.length - uplineIndex;
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const timeAgo = (timestamp: number) => {
  const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const referralsPerPage = 5;

  // Data state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [teamTurnover, setTeamTurnover] = useState(0);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<any[]>([]);
  const [turnoverStats, setTurnoverStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referrerUser, setReferrerUser] = useState<any>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) {
          setIsLoading(false);
          return;
        }

        const user = await getUser(currentUserId);
        if (!user) {
          setIsLoading(false);
          return;
        }

        setCurrentUser(user);

        if (user.referredBy) {
          const referrer = await getUser(user.referredBy);
          setReferrerUser(referrer);
        }

        const earned = await getTotalEarned(currentUserId);
        setTotalEarned(earned);

        const turnover = await calculateTeamTurnover(currentUserId);
        setTeamTurnover(turnover);

        const stats = await getTurnoverStats(currentUserId);
        setTurnoverStats(stats);

        // Load all referrals
        const allReferrals = await getAllReferrals(currentUserId);
        const referralsWithData = await Promise.all(
          allReferrals.map(async (referral) => {
            const level = await calculateReferralLevel(currentUserId, referral.id);
            const balance = await getBalance(referral.id);
            const totalDeposits = balance.available + balance.frozen;
            const activeCopies = await getActiveUserCopies(referral.id);
            const isActive = activeCopies.length > 0;

            const commissions = await getUserCommissions(currentUserId);
            const commissionsFromReferral = commissions
              .filter((c) => c.investorUserId === referral.id)
              .reduce((sum, c) => sum + c.commissionAmount, 0);

            return {
              id: referral.id,
              username: referral.username,
              email: referral.email,
              level,
              deposits: totalDeposits,
              bonus: commissionsFromReferral,
              status: isActive ? 'active' : 'inactive',
              date: referral.createdAt,
            };
          }),
        );

        setReferrals(referralsWithData);

        // Recent commissions
        const commissions = await getUserCommissions(currentUserId);
        const recent = await Promise.all(
          commissions
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10)
            .map(async (c) => {
              const investor = await getUser(c.investorUserId);
              return {
                id: c.id,
                amount: c.commissionAmount,
                from: investor?.username || 'Unknown',
                level: c.level,
                date: c.createdAt,
              };
            }),
        );
        setRecentCommissions(recent);

        setIsLoading(false);
      } catch (error) {
        console.error('[Referrals] Error loading data:', error);
        setIsLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Referral link
  const referralLink = currentUser
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${currentUser.referralCode}`
    : '';

  // Stats
  const stats = {
    totalReferrals: referrals.length,
    activeInvestors: referrals.filter((r) => r.status === 'active').length,
    totalEarned,
    turnover: teamTurnover,
  };

  const claimedLevels = turnoverStats?.currentLevel || 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter & search referrals
  const filteredReferrals =
    activeLevel === 'all'
      ? referrals
      : referrals.filter((ref: any) => ref.level === activeLevel);

  const searchedReferrals = searchQuery
    ? filteredReferrals.filter(
        (r: any) =>
          r.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredReferrals;

  const sortedReferrals = [...searchedReferrals].sort(
    (a: any, b: any) => b.deposits - a.deposits,
  );
  const totalPages = Math.ceil(sortedReferrals.length / referralsPerPage);
  const paginatedReferrals = sortedReferrals.slice(
    (currentPage - 1) * referralsPerPage,
    currentPage * referralsPerPage,
  );

  // Level counts (1-5)
  const levelCounts = [1, 2, 3, 4, 5].map((level) => ({
    level,
    count: referrals.filter((ref: any) => ref.level === level).length,
  }));

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-950 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-700 dark:text-dark-300">Loading referral data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ══════════ STATS CARDS ══════════ */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] transition-all">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 text-center">
                <Users className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {stats.totalReferrals}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">Total Referrals</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] transition-all">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 text-center">
                <Activity className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {stats.activeInvestors}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">Active Investors</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] transition-all">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  ${formatNumber(stats.totalEarned)}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">Total Earned</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] transition-all">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  ${formatNumber(stats.turnover)}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">Team Turnover</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ── Referral Link ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary-400" />
                  Your Referral Link
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/50 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  {[
                    'No deposit required',
                    'Paid in USDT',
                    'Instant payout',
                  ].map((text) => (
                    <div
                      key={text}
                      className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-dark-300"
                    >
                      <CheckCircle className="w-3 h-3 text-primary-400" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>

            {/* ── Commission Structure (Bento Grid) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                {/* Commission Table */}
                <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Commission per Level
                  </h3>
                  <div className="space-y-2">
                    {commissionStructure.map((item) => (
                      <div
                        key={item.level}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          item.highlight
                            ? 'bg-primary-500/10 border-primary-500/30'
                            : 'bg-gray-100 dark:bg-dark-900/50 border-gray-200 dark:border-dark-700/50 hover:border-gray-300 dark:hover:border-dark-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              item.highlight
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'bg-gray-200 dark:bg-dark-800 text-gray-700 dark:text-dark-300'
                            }`}
                          >
                            L{item.level}
                          </span>
                          <div>
                            <p className="text-sm font-normal text-gray-900 dark:text-white">
                              Level {item.level}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-lg font-medium ${
                            item.highlight ? 'text-primary-400' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.commission}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                {/* Feature Cards */}
                <div className="flex flex-col gap-4">
                  <div className="flex-1 bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all flex flex-col justify-center">
                    <Zap className="w-7 h-7 text-primary-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Instant Payout
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-dark-300">
                      Commission is credited to your USDT balance the moment
                      your referral activates any trading bot. No delays, no
                      minimum thresholds.
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all flex flex-col justify-center">
                    <Shield className="w-7 h-7 text-primary-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Deposit Required
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-dark-300">
                      You don&apos;t need an active deposit to earn affiliate
                      commissions. Simply share your link and start building
                      your network.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Cashflow Levels Impact ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Cashflow Levels Impact
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-400 mb-4">
                  Each level has a different impact on your cashflow turnover.
                  The closer the referral, the higher the contribution.
                </p>
                <div className="rounded-xl border border-primary-500/20 overflow-hidden overflow-x-auto">
                  {/* Header */}
                  <div className="grid grid-cols-5 bg-primary-500/[0.06] min-w-[360px]">
                    {cashflowLevels.map((l) => (
                      <div
                        key={l.level}
                        className="px-3 py-3 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span className="text-xs text-gray-600 dark:text-dark-400 font-medium">
                          Level {l.level}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Impact row */}
                  <div className="grid grid-cols-5 border-t border-primary-500/10 min-w-[360px]">
                    {cashflowLevels.map((l, i) => (
                      <div
                        key={l.level}
                        className="px-3 py-5 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span
                          className={`text-xl sm:text-2xl font-medium ${
                            i === 0 ? 'text-primary-400' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {l.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Label row */}
                  <div className="grid grid-cols-5 border-t border-primary-500/10 min-w-[360px]">
                    {cashflowLevels.map((l) => (
                      <div
                        key={l.level}
                        className="px-3 py-2 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span className="text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider">
                          Impact
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-dark-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Turnover = sum of all active bots in your network,
                      weighted by level
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Reach turnover milestones to unlock cash bonuses in USDT
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Your Referrals ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary-400" />
                      Your Referrals
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setActiveLevel('all');
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          activeLevel === 'all'
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                        }`}
                      >
                        All ({referrals.length})
                      </button>
                      {levelCounts.map((lc) => (
                        <button
                          key={lc.level}
                          onClick={() => {
                            setActiveLevel(lc.level);
                            setCurrentPage(1);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            activeLevel === lc.level
                              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                              : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                          }`}
                        >
                          L{lc.level} ({lc.count})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-dark-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by username or email..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-dark-500 hover:text-gray-900 dark:text-white transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {paginatedReferrals.length > 0 ? (
                  <div className="space-y-3">
                    {paginatedReferrals.map(
                      (referral: any, index: number) => (
                        <motion.div
                          key={referral.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between p-3 sm:p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all"
                        >
                          <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold" style={getAvatarStyle(referral.username)}>
                              <span>
                                {referral.username[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {referral.username}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                  Level {referral.level}
                                </span>
                                {referral.status === 'active' && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-dark-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Joined {formatDate(referral.date)}
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">
                              Deposits
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                              ${formatNumber(referral.deposits)}
                            </div>
                            <div className="text-sm text-green-400 flex items-center sm:justify-end gap-1 mt-1">
                              <DollarSign className="w-3 h-3" />$
                              {formatNumber(referral.bonus)} earned
                            </div>
                          </div>
                        </motion.div>
                      ),
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                        <div className="text-sm text-gray-600 dark:text-dark-400">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setCurrentPage(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-dark-900/50 hover:bg-dark-900 disabled:bg-gray-200 dark:bg-dark-900/20 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white disabled:text-dark-600 font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-dark-900/50 hover:bg-dark-900 disabled:bg-gray-200 dark:bg-dark-900/20 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white disabled:text-dark-600 font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600 dark:text-dark-400">
                    <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      No referrals yet
                    </div>
                    <div className="text-sm">
                      Share your link to start earning
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ══════════ RIGHT COLUMN ══════════ */}
          <div className="space-y-6">
            {/* ── Turnover Bonuses Progress ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Turnover Bonuses
                  </h3>
                </div>

                {/* Current Status */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                    <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">
                      Team Turnover
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      ${formatNumber(teamTurnover)}
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700">
                    <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">
                      Bonuses Earned
                    </div>
                    <div className="text-lg font-medium text-green-400">
                      ${formatNumber(turnoverStats?.totalBonusesEarned || 0)}
                    </div>
                  </div>
                </div>

                {/* Next Level Progress */}
                {turnoverStats?.nextLevel && (
                  <div className="mb-4 p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700 dark:text-dark-300">
                        Next:{' '}
                        <span className="font-medium text-gray-900 dark:text-white">
                          Level {turnoverStats.nextLevel.level}
                        </span>
                      </span>
                      <span className="text-lg font-medium text-primary-400">
                        ${formatNumber(turnoverStats.nextLevel.bonus)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-1000"
                        style={{
                          width: `${Math.min(turnoverStats.nextLevel.progress, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-dark-500">
                      <span>${formatNumber(teamTurnover)}</span>
                      <span>
                        {turnoverStats.nextLevel.progress.toFixed(1)}%
                      </span>
                      <span>
                        ${formatNumber(turnoverStats.nextLevel.threshold)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Milestone Levels */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {TURNOVER_LEVELS.map((level) => {
                    const isUnlocked = teamTurnover >= level.threshold;
                    const isClaimed = level.level <= claimedLevels;

                    return (
                      <div
                        key={level.level}
                        className={`p-3 rounded-lg border ${
                          isClaimed
                            ? 'bg-green-500/10 border-green-500/30'
                            : isUnlocked
                              ? 'bg-yellow-500/10 border-yellow-500/30'
                              : 'bg-white dark:bg-dark-900/30 border-gray-200 dark:border-dark-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  isClaimed
                                    ? 'bg-green-500/20 text-green-400'
                                    : isUnlocked
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-dark-400'
                                }`}
                              >
                                LVL {level.level}
                              </span>
                              {isClaimed && (
                                <span className="text-green-400 text-xs">
                                  Claimed
                                </span>
                              )}
                              {!isClaimed && isUnlocked && (
                                <span className="text-yellow-400 text-xs">
                                  Ready!
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-dark-400">
                              Turnover: ${formatNumber(level.threshold)}
                            </div>
                          </div>
                          <span
                            className={`text-base font-medium ${
                              isClaimed
                                ? 'text-green-400'
                                : isUnlocked
                                  ? 'text-yellow-400'
                                  : 'text-gray-600 dark:text-dark-500'
                            }`}
                          >
                            ${formatNumber(level.bonus)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── Recent Commissions ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-400" />
                  Recent Commissions
                </h3>
                <p className="text-xs text-gray-500 dark:text-dark-500 mb-4">
                  Last 10 commissions received
                </p>
                <div className="space-y-3">
                  {recentCommissions.length > 0 ? (
                    recentCommissions.map((bonus: any) => (
                      <div
                        key={bonus.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all"
                      >
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center border border-primary-500/30">
                          <DollarSign className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-400">
                              +${formatNumber(bonus.amount)}
                            </span>
                            {bonus.level && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                L{bonus.level}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-dark-400 truncate">
                            from {bonus.from}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-dark-500">
                            {timeAgo(bonus.date)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-dark-400">
                      <DollarSign className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                      <div className="text-sm">No commissions yet</div>
                      <div className="text-xs mt-1">
                        Share your link to start earning
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── Referred By ── */}
            {referrerUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold" style={getAvatarStyle(referrerUser.username)}>
                      <span>
                        {referrerUser.username[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">
                        Referred By
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {referrerUser.username}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-dark-500">
                        Code: {referrerUser.referralCode}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
