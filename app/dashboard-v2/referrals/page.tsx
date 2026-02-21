'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Image from 'next/image';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Copy,
  Search,
  ChevronDown,
  Gift,
  Trophy,
  Zap,
  CheckCircle,
  Clock,
  Share2,
  Shield,
  Crown,
  FileText,
  Presentation,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';
import { Pagination } from '@/components/dashboard-v2/Pagination';
import { LoadingScreen } from '@/components/dashboard-v2/LoadingScreen';
import { getUser, getAllReferrals, type User } from '@/lib/users';
import { getTotalEarned, getUserCommissions, type ReferralCommission } from '@/lib/referralCommissions';
import { calculateTeamTurnover, getTurnoverStats, TURNOVER_LEVELS } from '@/lib/turnoverBonuses';
import { getBalance } from '@/lib/balances';
import { getAvatarStyle } from '@/lib/social/tier-utils';
import { getActiveUserCopies } from '@/lib/userCopies';
import { formatNumber, formatDate, timeAgo } from '@/lib/formatters';

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

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

const MOCK_REFERRAL_NAMES = [
  'CryptoKing', 'LunaTrade', 'BlockWolf', 'SatoshiFan', 'EthMaxi',
  'DeFiDegen', 'TokenHunter', 'ChainLink99', 'WhaleAlert', 'MoonShot',
  'BullRunner', 'BearSlayer', 'HodlGang', 'StakeKing', 'YieldFarm',
  'AlphaBot', 'GigaBrain', 'PumpItUp', 'DiamondHand', 'RektProof',
];
const MOCK_DEPOSITS = [500, 1200, 3500, 8000, 250, 15000, 750, 4200, 920, 6100, 2800, 180, 11000, 340, 7500, 1900, 5600, 430, 9200, 3100];
const COMMISSION_RATES = [0.05, 0.03, 0.02, 0.01, 0.005];

const MOCK_REFERRALS = MOCK_REFERRAL_NAMES.map((name, i) => {
  const level = (i % 5) + 1;
  const deposits = MOCK_DEPOSITS[i];
  // Build parent relationships: L1 are direct referrals (no parent among mocks),
  // L2+ point to the nearest preceding mock of the previous level
  let parentId: string | null = null;
  if (level >= 2) {
    // Find the closest preceding mock with level-1
    for (let j = i - 1; j >= 0; j--) {
      if ((j % 5) + 1 === level - 1) {
        parentId = `mock-ref-${j}`;
        break;
      }
    }
  }
  return {
    id: `mock-ref-${i}`,
    username: name,
    email: `${name.toLowerCase()}@mail.com`,
    level,
    deposits,
    bonus: +(deposits * COMMISSION_RATES[level - 1]).toFixed(2),
    status: (i % 3 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
    date: Date.now() - (i + 1) * 86400000 * (2 + Math.floor(i / 3)),
    parentId,
  };
});

/* ═══════════════════════════════════════════════════════════════
   BRANCH TREE
   ═══════════════════════════════════════════════════════════════ */

interface ReferralItem {
  id: string;
  username: string;
  email: string;
  level: number;
  deposits: number;
  bonus: number;
  status: 'active' | 'inactive';
  date: number;
  parentId: string | null;
}

interface BranchNode {
  user: ReferralItem;
  children: BranchNode[];
}

interface BranchData {
  root: BranchNode;
  branchCount: number;
  branchDeposits: number;
  branchEarned: number;
  branchTurnover: number;
}

interface RecentCommissionItem {
  id: string;
  amount: number;
  from: string;
  level: number;
  date: number;
}

const CASHFLOW_WEIGHTS = [1.0, 0.5, 0.25, 0.1, 0.1];

function buildBranchTree(
  referralId: string,
  allReferrals: ReferralItem[],
): BranchData {
  const refMap = new Map(allReferrals.map((r) => [r.id, r]));
  const rootUser = refMap.get(referralId);
  if (!rootUser)
    return {
      root: { user: allReferrals[0], children: [] },
      branchCount: 0,
      branchDeposits: 0,
      branchEarned: 0,
      branchTurnover: 0,
    };

  let branchCount = 0;
  let branchDeposits = 0;
  let branchEarned = 0;
  let branchTurnover = 0;

  // Root user's own turnover contribution
  const rootWeight = CASHFLOW_WEIGHTS[Math.min(rootUser.level - 1, 4)];
  branchTurnover += rootUser.deposits * rootWeight;

  function buildChildren(parentId: string): BranchNode[] {
    const kids = allReferrals.filter((r) => r.parentId === parentId);
    return kids.map((kid) => {
      branchCount++;
      branchDeposits += kid.deposits;
      branchEarned += kid.bonus;
      const weight = CASHFLOW_WEIGHTS[Math.min(kid.level - 1, 4)];
      branchTurnover += kid.deposits * weight;
      return {
        user: kid,
        children: buildChildren(kid.id),
      };
    });
  }

  const children = buildChildren(referralId);

  return {
    root: { user: rootUser, children },
    branchCount,
    branchDeposits,
    branchEarned,
    branchTurnover,
  };
}

const BranchTreeNode = memo(function BranchTreeNode({
  node,
  depth,
  defaultExpanded,
}: {
  node: BranchNode;
  depth: number;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-left transition-colors ${
          hasChildren
            ? 'hover:bg-gray-100 dark:hover:bg-dark-800 cursor-pointer'
            : 'cursor-default'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          <ChevronRight
            className={`w-3.5 h-3.5 text-gray-500 dark:text-dark-400 transition-transform flex-shrink-0 ${
              expanded ? 'rotate-90' : ''
            }`}
          />
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Mini avatar */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-900 dark:text-white flex-shrink-0"
          style={getAvatarStyle(node.user.username)}
        >
          {node.user.username[0].toUpperCase()}
        </div>

        {/* Name + status */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-sm text-gray-900 dark:text-white truncate">
            {node.user.username}
          </span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-primary-500/15 text-primary-400 flex-shrink-0">
            L{node.user.level}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              node.user.status === 'active' ? 'bg-green-400' : 'bg-gray-400 dark:bg-dark-500'
            }`}
          />
        </div>

        {/* Deposit amount */}
        <span className="text-xs text-gray-600 dark:text-dark-400 flex-shrink-0">
          ${formatNumber(node.user.deposits)}
        </span>
      </button>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <BranchTreeNode
                key={child.user.id}
                node={child}
                depth={depth + 1}
                defaultExpanded={false}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deposits' | 'bonus' | 'date' | 'level' | 'username' | 'status'>('deposits');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const referralsPerPage = 5;

  // Data state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [teamTurnover, setTeamTurnover] = useState(0);
  const [referrals, setReferrals] = useState<ReferralItem[]>(MOCK_REFERRALS);
  const [recentCommissions, setRecentCommissions] = useState<RecentCommissionItem[]>([]);
  const [turnoverStats, setTurnoverStats] = useState<Awaited<ReturnType<typeof getTurnoverStats>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referrerUser, setReferrerUser] = useState<User | null>(null);

  // Referral drawer state
  const [selectedReferral, setSelectedReferral] = useState<ReferralItem | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);

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
              status: (isActive ? 'active' : 'inactive') as 'active' | 'inactive',
              date: referral.createdAt,
              parentId: referral.referredBy,
            };
          }),
        );

        setReferrals([...referralsWithData, ...MOCK_REFERRALS]);

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
        // Error handled silently
        setIsLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);


  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleReferralClick = (referral: ReferralItem) => {
    setSelectedReferral(referral);
    setBranchData(buildBranchTree(referral.id, referrals));
  };

  // Filter & search referrals (memoized to avoid recalculation on every render)
  const sortedReferrals = useMemo(() => {
    const filtered = activeLevel === 'all'
      ? referrals
      : referrals.filter((ref) => ref.level === activeLevel);

    const searched = searchQuery
      ? filtered.filter(
          (r) =>
            r.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.email?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : filtered;

    return [...searched].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'deposits': return (a.deposits - b.deposits) * dir;
        case 'bonus': return (a.bonus - b.bonus) * dir;
        case 'date': return (a.date - b.date) * dir;
        case 'level': return (a.level - b.level) * dir;
        case 'username': return a.username.localeCompare(b.username) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        default: return 0;
      }
    });
  }, [referrals, activeLevel, searchQuery, sortBy, sortDir]);

  const paginatedReferrals = useMemo(() => sortedReferrals.slice(
    (currentPage - 1) * referralsPerPage,
    currentPage * referralsPerPage,
  ), [sortedReferrals, currentPage, referralsPerPage]);

  // Level counts (1-5)
  const levelCounts = [1, 2, 3, 4, 5].map((level) => ({
    level,
    count: referrals.filter((ref) => ref.level === level).length,
  }));

  // Loading
  if (isLoading) {
    return <LoadingScreen message="Loading referral data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ══════════ STATS CARDS ══════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-6 text-center">
                <Users className="w-5 h-5 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                  {stats.totalReferrals}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Total Referrals</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-6 text-center">
                <Activity className="w-5 h-5 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                  {stats.activeInvestors}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Active Investors</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-6 text-center">
                <DollarSign className="w-5 h-5 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                  ${formatNumber(stats.totalEarned)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Total Earned</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px] transition-all">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-3 sm:p-6 text-center">
                <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                  ${formatNumber(stats.turnover)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">Team Turnover</div>
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
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
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
                <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all">
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
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all flex flex-col justify-center">
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
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6 transition-all flex flex-col justify-center">
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
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Cashflow Levels Impact
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-400 mb-3 sm:mb-4">
                  Each level has a different impact on your cashflow turnover.
                  The closer the referral, the higher the contribution.
                </p>
                <div className="rounded-xl border border-primary-500/20 overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-5 bg-primary-500/[0.06]">
                    {cashflowLevels.map((l) => (
                      <div
                        key={l.level}
                        className="px-1 sm:px-3 py-2 sm:py-3 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-400 font-medium">
                          <span className="sm:hidden">L{l.level}</span>
                          <span className="hidden sm:inline">Level {l.level}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Impact row */}
                  <div className="grid grid-cols-5 border-t border-primary-500/10">
                    {cashflowLevels.map((l, i) => (
                      <div
                        key={l.level}
                        className="px-1 sm:px-3 py-3 sm:py-5 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span
                          className={`text-base sm:text-2xl font-medium ${
                            i === 0 ? 'text-primary-400' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {l.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Label row */}
                  <div className="grid grid-cols-5 border-t border-primary-500/10">
                    {cashflowLevels.map((l) => (
                      <div
                        key={l.level}
                        className="px-1 sm:px-3 py-1.5 sm:py-2 text-center border-r border-primary-500/10 last:border-r-0"
                      >
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider">
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
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary-400" />
                    Your Referrals
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                    <button
                      onClick={() => {
                        setActiveLevel('all');
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-3 sm:py-1.5 rounded-lg text-sm font-medium transition-all ${
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
                        className={`px-2 py-3 sm:py-1.5 rounded-lg text-sm font-medium transition-all ${
                          activeLevel === lc.level
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-gray-100 dark:bg-dark-900/50 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-dark-700'
                        }`}
                      >
                        L{lc.level} ({lc.count})
                      </button>
                    ))}
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

                  {/* Sort controls */}
                  <div className="flex items-center gap-3 mt-3">
                    {/* Sort by dropdown */}
                    <div ref={sortDropdownRef} className="relative flex-1 sm:flex-none">
                      <button
                        onClick={() => setSortDropdownOpen(prev => !prev)}
                        className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg text-sm text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-dark-600 transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-dark-400 flex-shrink-0" />
                        <span className="flex-1 text-left">
                          {{
                            deposits: 'Deposits',
                            bonus: 'Bonus Earned',
                            date: 'Join Date',
                            level: 'Level',
                            username: 'Username',
                            status: 'Status',
                          }[sortBy]}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-dark-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {sortDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute z-[9999] top-full left-0 right-0 sm:right-auto sm:min-w-[200px] mt-1 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden"
                          >
                            {([
                              { key: 'deposits', label: 'Deposits', icon: DollarSign },
                              { key: 'bonus', label: 'Bonus Earned', icon: Gift },
                              { key: 'date', label: 'Join Date', icon: Clock },
                              { key: 'level', label: 'Level', icon: Users },
                              { key: 'username', label: 'Username', icon: Search },
                              { key: 'status', label: 'Status', icon: Activity },
                            ] as const).map((option) => {
                              const isSelected = sortBy === option.key;
                              const Icon = option.icon;
                              return (
                                <button
                                  key={option.key}
                                  onClick={() => {
                                    setSortBy(option.key);
                                    setCurrentPage(1);
                                    setSortDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                    isSelected
                                      ? 'bg-primary-500/20 text-primary-400'
                                      : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Icon className="w-4 h-4 flex-shrink-0" />
                                  <span className="flex-1 text-left">{option.label}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Direction toggle */}
                    <button
                      onClick={() => {
                        setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-700 dark:text-dark-300 hover:border-primary-500/50 transition-all"
                    >
                      {sortDir === 'desc' ? (
                        <ArrowDown className="w-4 h-4 text-primary-400" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-primary-400" />
                      )}
                      <span className="hidden sm:inline">{sortDir === 'desc' ? 'High to Low' : 'Low to High'}</span>
                    </button>

                    {/* Result count */}
                    <span className="ml-auto text-xs text-gray-500 dark:text-dark-500 hidden sm:block">
                      {sortedReferrals.length} referral{sortedReferrals.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {paginatedReferrals.length > 0 ? (
                  <div className="space-y-3">
                    {paginatedReferrals.map(
                      (referral, index) => (
                        <motion.div
                          key={referral.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleReferralClick(referral)}
                          className="group p-3 sm:p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500 hover:bg-gray-100 dark:hover:bg-dark-800/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all cursor-pointer"
                        >
                          {/* Desktop: single row */}
                          <div className="hidden sm:flex items-center gap-0 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold flex-shrink-0" style={getAvatarStyle(referral.username)}>
                                <span>
                                  {referral.username[0].toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
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
                                <div className="text-xs text-gray-500 dark:text-dark-500 flex items-center gap-1 mb-0.5">
                                  <Mail className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{referral.email}</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-dark-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 flex-shrink-0" />
                                  Joined {formatDate(referral.date)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">
                                Deposits
                              </div>
                              <div className="text-lg font-medium text-gray-900 dark:text-white">
                                ${formatNumber(referral.deposits)}
                              </div>
                              <div className="text-sm text-green-400 flex items-center justify-end gap-1 mt-1">
                                <DollarSign className="w-3 h-3" />$
                                {formatNumber(referral.bonus)} earned
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all ml-2 flex-shrink-0" />
                          </div>

                          {/* Mobile: stacked layout */}
                          <div className="sm:hidden">
                            {/* Top row: avatar + name + badges */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm flex-shrink-0" style={getAvatarStyle(referral.username)}>
                                <span>
                                  {referral.username[0].toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {referral.username}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                    Level {referral.level}
                                  </span>
                                  {referral.status === 'active' && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
                                      <Activity className="w-2.5 h-2.5" />
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-dark-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                            </div>

                            {/* Info row: email + date */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-dark-500 mb-3 pl-[52px]">
                              <div className="flex items-center gap-1 min-w-0">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{referral.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-500 mb-3 pl-[52px]">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              Joined {formatDate(referral.date)}
                            </div>

                            {/* Bottom row: deposits + earned */}
                            <div className="flex items-end justify-between pt-2.5 border-t border-gray-200 dark:border-dark-700/50">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-dark-500 mb-0.5">
                                  Deposits
                                </div>
                                <div className="text-base font-medium text-gray-900 dark:text-white">
                                  ${formatNumber(referral.deposits)}
                                </div>
                              </div>
                              <div className="text-sm text-green-400 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />$
                                {formatNumber(referral.bonus)} earned
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ),
                    )}

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalItems={sortedReferrals.length}
                      itemsPerPage={referralsPerPage}
                      onPageChange={setCurrentPage}
                      className="pt-4 border-t border-gray-200 dark:border-dark-700"
                    />
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
            {/* ── Investor Presentation ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Presentation className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Investor Presentation
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-dark-400 mb-5">
                  Download a ready-made presentation to share with potential investors. Includes platform overview, performance stats, and commission structure.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/docs/Celestian_Investor_Deck.pdf"
                    download
                    className="group flex flex-col items-center gap-2.5 p-4 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-red-400/50 dark:hover:border-red-400/50 transition-all"
                  >
                    <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center group-hover:bg-red-500/25 transition-colors">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">PDF</div>
                      <div className="text-[10px] text-gray-500 dark:text-dark-500 mt-0.5 flex items-center gap-1 justify-center">
                        <Download className="w-2.5 h-2.5" />
                        Download
                      </div>
                    </div>
                  </a>
                  <a
                    href="/docs/Celestian_Investor_Deck.pptx"
                    download
                    className="group flex flex-col items-center gap-2.5 p-4 bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-orange-400/50 dark:hover:border-orange-400/50 transition-all"
                  >
                    <div className="w-10 h-10 bg-orange-500/15 rounded-lg flex items-center justify-center group-hover:bg-orange-500/25 transition-colors">
                      <Presentation className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">PPTX</div>
                      <div className="text-[10px] text-gray-500 dark:text-dark-500 mt-0.5 flex items-center gap-1 justify-center">
                        <Download className="w-2.5 h-2.5" />
                        Download
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              </div>
            </motion.div>

            {/* ── Turnover Bonuses Progress ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
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
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-400" />
                  Recent Commissions
                </h3>
                <p className="text-xs text-gray-500 dark:text-dark-500 mb-4">
                  Last 10 commissions received
                </p>
                <div className="space-y-3">
                  {recentCommissions.length > 0 ? (
                    recentCommissions.map((bonus) => (
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
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
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

      {/* ══════════ REFERRAL NETWORK DRAWER ══════════ */}
      <SettingsDrawer
        isOpen={!!selectedReferral}
        onClose={() => {
          setSelectedReferral(null);
          setBranchData(null);
        }}
        title="Referral Network"
      >
        {selectedReferral && branchData && (
          <div className="space-y-6">
            {/* ── Profile ── */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white flex-shrink-0"
                style={getAvatarStyle(selectedReferral.username)}
              >
                {selectedReferral.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">
                  {selectedReferral.username}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                    Level {selectedReferral.level}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      selectedReferral.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-dark-400 border border-gray-300 dark:border-dark-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedReferral.status === 'active' ? 'bg-green-400' : 'bg-gray-400 dark:bg-dark-500'
                      }`}
                    />
                    {selectedReferral.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-dark-500 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Joined {formatDate(selectedReferral.date)}
                </div>
                <div className="text-xs text-gray-500 dark:text-dark-500 mt-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {selectedReferral.email}
                </div>
              </div>
            </div>

            {/* ── Branch Stats ── */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Branch Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700 text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {branchData.branchCount}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider mt-0.5">
                    People
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700 text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${branchData.branchDeposits >= 1000
                      ? `${(branchData.branchDeposits / 1000).toFixed(1)}K`
                      : formatNumber(branchData.branchDeposits)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider mt-0.5">
                    Deposits
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700 text-center">
                  <div className="text-lg font-semibold text-primary-400">
                    ${branchData.branchTurnover >= 1000
                      ? `${(branchData.branchTurnover / 1000).toFixed(1)}K`
                      : formatNumber(branchData.branchTurnover)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider mt-0.5">
                    Turnover
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700 text-center">
                  <div className="text-lg font-semibold text-green-400">
                    ${formatNumber(branchData.branchEarned)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-dark-500 uppercase tracking-wider mt-0.5">
                    Earned
                  </div>
                </div>
              </div>
            </div>

            {/* ── Network Tree ── */}
            {branchData.root.children.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Network Tree
                </h4>
                <div className="bg-gray-50 dark:bg-dark-800/30 rounded-xl border border-gray-200 dark:border-dark-700 py-1">
                  {branchData.root.children.map((child, i) => (
                    <BranchTreeNode
                      key={child.user.id}
                      node={child}
                      depth={0}
                      defaultExpanded={i === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Your Commissions ── */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Your Commissions
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700">
                  <span className="text-sm text-gray-600 dark:text-dark-400">
                    From {selectedReferral.username}:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${formatNumber(selectedReferral.bonus)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700">
                  <span className="text-sm text-gray-600 dark:text-dark-400">
                    From branch:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${formatNumber(branchData.branchEarned)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-sm font-semibold text-primary-400">
                    ${formatNumber(selectedReferral.bonus + branchData.branchEarned)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SettingsDrawer>
    </div>
  );
}
