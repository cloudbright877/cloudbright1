'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import { getUser, getDirectReferrals, getAllReferrals } from '@/lib/users';
import { getTotalEarned, getUserCommissions } from '@/lib/referralCommissions';
import { calculateTeamTurnover, getTurnoverStats, TURNOVER_LEVELS } from '@/lib/turnoverBonuses';
import { getBalance } from '@/lib/balances';
import { getUserCopy, getActiveUserCopies, getClosedUserCopies } from '@/lib/userCopies';


// Helper function to calculate level between two users
async function calculateReferralLevel(uplineUserId: string, referralUserId: string): Promise<number> {
  const referral = await getUser(referralUserId);
  if (!referral || !referral.referralPath) return 0;

  const pathParts = referral.referralPath.split('/').filter(Boolean);
  const uplineIndex = pathParts.indexOf(uplineUserId);

  if (uplineIndex === -1) return 0;
  return pathParts.length - uplineIndex;
}

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number | '4-10' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBonusExplainer, setShowBonusExplainer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const referralsPerPage = 5;

  // Real data state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [teamTurnover, setTeamTurnover] = useState(0);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<any[]>([]);
  const [turnoverStats, setTurnoverStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referrerUser, setReferrerUser] = useState<any>(null);

  const walletForBonus = 'USDT';

  const commissionStructure = [
    { level: 1, commission: 10 },
    { level: 2, commission: 5 },
    { level: 3, commission: 3 },
    { level: '4-10', commission: 2 },
  ];

  // Load real data
  useEffect(() => {
    async function loadData() {
      try {
        // Get current user from localStorage
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) {
          console.warn('[Referrals] No current user found');
          setIsLoading(false);
          return;
        }

        const user = await getUser(currentUserId);
        if (!user) {
          console.warn('[Referrals] User not found:', currentUserId);
          setIsLoading(false);
          return;
        }

        setCurrentUser(user);

        // Load referrer if exists
        if (user.referredBy) {
          const referrer = await getUser(user.referredBy);
          setReferrerUser(referrer);
        }

        // Load total earned
        const earned = await getTotalEarned(currentUserId);
        setTotalEarned(earned);

        // Load team turnover
        const turnover = await calculateTeamTurnover(currentUserId);
        setTeamTurnover(turnover);

        // Load turnover stats
        const stats = await getTurnoverStats(currentUserId);
        setTurnoverStats(stats);

        // Load all referrals (all levels)
        const allReferrals = await getAllReferrals(currentUserId);

        // For each referral, calculate their data
        const referralsWithData = await Promise.all(
          allReferrals.map(async (referral) => {
            // Calculate level
            const level = await calculateReferralLevel(currentUserId, referral.id);

            // Get their balance
            const balance = await getBalance(referral.id);
            const totalDeposits = balance.available + balance.frozen;

            // Get active copies count
            const activeCopies = await getActiveUserCopies(referral.id);
            const isActive = activeCopies.length > 0;

            // Calculate total commissions earned from this referral
            const commissions = await getUserCommissions(currentUserId);
            const commissionsFromReferral = commissions
              .filter(c => c.investorUserId === referral.id)
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
              avatar: null,
            };
          })
        );

        setReferrals(referralsWithData);

        // Load recent commissions (last 10)
        const commissions = await getUserCommissions(currentUserId);
        const recent = commissions
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 10)
          .map(async (c) => {
            const investor = await getUser(c.investorUserId);
            return {
              id: c.id,
              amount: c.commissionAmount,
              currency: 'USDT',
              from: investor?.username || 'Unknown',
              level: c.level,
              date: c.createdAt,
            };
          });

        const recentWithUsernames = await Promise.all(recent);
        setRecentCommissions(recentWithUsernames);

        setIsLoading(false);
      } catch (error) {
        console.error('[Referrals] Error loading data:', error);
        setIsLoading(false);
      }
    }

    loadData();

    // Auto-refresh every 30 seconds
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
    activeInvestors: referrals.filter(r => r.status === 'active').length,
    totalEarned,
    turnover: teamTurnover,
  };

  const recentBonuses = recentCommissions;
  const claimedLevels = turnoverStats?.currentLevel || 0;

  // Available currencies for bonus preference
  const bonusCurrencies = [
    { symbol: 'USDT', name: 'Tether', icon: 'Tether.svg' },
    { symbol: 'BTC', name: 'Bitcoin', icon: 'Bitcoin.svg' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ethereum.svg' },
    { symbol: 'TRX', name: 'Tron', icon: 'Tron.svg' },
    { symbol: 'BNB', name: 'BNB', icon: 'bnb.svg' },
    { symbol: 'SOL', name: 'Solana', icon: 'Solana.svg' },
  ];

  const selectedBonusCurrency = bonusCurrencies.find((c) => c.symbol === walletForBonus);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBonusCurrencyChange = (currency: string) => {
    setShowCurrencyDropdown(false);
    console.log('Bonus currency changed to:', currency);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const timeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Filter and sort referrals
  const filteredReferrals =
    activeLevel === 'all'
      ? referrals
      : activeLevel === '4-10'
      ? referrals.filter((ref: any) => ref.level >= 4 && ref.level <= 10)
      : referrals.filter((ref: any) => ref.level === activeLevel);

  // Sort by total deposits (highest first)
  const sortedReferrals = [...filteredReferrals].sort((a: any, b: any) => b.deposits - a.deposits);

  // Pagination
  const totalPages = Math.ceil(sortedReferrals.length / referralsPerPage);
  const paginatedReferrals = sortedReferrals.slice(
    (currentPage - 1) * referralsPerPage,
    currentPage * referralsPerPage
  );

  // Count referrals per level (1-3 separately, 4-10 combined)
  const levelCounts = [
    { level: 1, count: referrals.filter((ref: any) => ref.level === 1).length },
    { level: 2, count: referrals.filter((ref: any) => ref.level === 2).length },
    { level: 3, count: referrals.filter((ref: any) => ref.level === 3).length },
    {
      level: '4-10',
      count: referrals.filter((ref: any) => ref.level >= 4 && ref.level <= 10).length
    },
  ];

  // Handle level change
  const handleLevelChange = (level: number | string | 'all') => {
    setActiveLevel(level as typeof activeLevel);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-dark-300">Loading referral data...</p>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Referral Program
        </h1>
        <p className="text-dark-300">
          Earn up to 32% commissions from your referral network (10 levels deep)
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Link */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalReferrals}
                </div>
                <div className="text-sm text-dark-400">Total Referrals</div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="text-center">
                <div className="text-3xl mb-2">💼</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.activeInvestors}
                </div>
                <div className="text-sm text-dark-400">Active Investors</div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-gradient mb-1">
                  ${formatNumber(stats.totalEarned)}
                </div>
                <div className="text-sm text-dark-400">Total Earned</div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-white mb-1">
                  ${formatNumber(teamTurnover)}
                </div>
                <div className="text-sm text-dark-400">Team Turnover</div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Referral Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg text-white font-medium transition-all"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Bonus Systems Explainer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">How Bonuses Work</h3>
                <button
                  onClick={() => setShowBonusExplainer(!showBonusExplainer)}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  {showBonusExplainer ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {/* Two Bonus Systems Overview */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-dark-800/50 rounded-lg border border-primary-500/20">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-white mb-2">Direct Referral Bonuses</h4>
                  <p className="text-sm text-dark-300 mb-3">
                    Earn instant commissions when your referrals close profitable copies
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Level 1:</span>
                      <span className="text-white font-medium">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Level 2:</span>
                      <span className="text-white font-medium">5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Level 3:</span>
                      <span className="text-white font-medium">3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Levels 4-10:</span>
                      <span className="text-white font-medium">2%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-dark-800/50 rounded-lg border border-secondary-500/20">
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-bold text-white mb-2">Turnover Bonuses</h4>
                  <p className="text-sm text-dark-300 mb-3">
                    Unlock milestone rewards based on team performance
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-dark-400">Team Turnover:</span>
                      <span className="text-white font-medium">${formatNumber(teamTurnover)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-dark-400">Achieved Levels:</span>
                      <span className="text-white font-medium">{claimedLevels} / 10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-dark-400">Bonuses Earned:</span>
                      <span className="text-white font-medium">
                        ${formatNumber(turnoverStats?.totalBonusesEarned || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {showBonusExplainer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 pt-4 border-t border-dark-700"
                >
                  {/* Direct Referral Bonus Explanation */}
                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Direct Referral Bonuses - How It Works
                    </h4>
                    <div className="bg-dark-800/30 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-dark-300">
                        When someone in your referral network closes a profitable copy, you earn a commission based on their level:
                      </p>

                      <div className="space-y-2">
                        {commissionStructure.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-dark-900/50 rounded">
                            <div className="w-16 text-center">
                              <span className="text-xs text-dark-500">Level</span>
                              <div className="text-white font-bold">{item.level}</div>
                            </div>
                            <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
                                style={{ width: `${item.commission * 20}%` }}
                              />
                            </div>
                            <div className="w-12 text-right text-white font-bold">
                              {item.commission}%
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                        <p className="text-sm text-dark-200">
                          <strong className="text-white">Example:</strong> Your direct referral (Level 1) closes a copy with $1,000 profit.
                          You earn <strong className="text-primary-400">$100 instantly</strong> (10%).
                          If they refer someone who profits $1,000, you earn <strong className="text-primary-400">$50</strong> (5% from Level 2).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Turnover Bonus Explanation */}
                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      Turnover Bonuses - Milestone Rewards
                    </h4>
                    <div className="bg-dark-800/30 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-dark-300">
                        Team turnover combines all levels with weighted contributions from your referral network.
                      </p>

                      <div className="p-3 bg-secondary-500/10 border border-secondary-500/20 rounded-lg">
                        <p className="text-sm text-dark-200">
                          <strong className="text-white">Example:</strong><br/>
                          Direct referrals contribute most to your turnover, while deeper levels contribute proportionally less based on their distance from you.
                        </p>
                      </div>

                      <div className="mt-4">
                        <h5 className="text-sm font-bold text-white mb-3">Turnover Bonus Levels:</h5>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
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
                                    : 'bg-dark-900/30 border-dark-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-xs px-2 py-0.5 rounded ${
                                        isClaimed ? 'bg-green-500/20 text-green-400' :
                                        isUnlocked ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-dark-700 text-dark-400'
                                      }`}>
                                        Level {level.level}
                                      </span>
                                      {isClaimed && <span className="text-green-400 text-sm">✓ Claimed</span>}
                                      {!isClaimed && isUnlocked && <span className="text-yellow-400 text-sm">⚡ Ready!</span>}
                                    </div>
                                    <div className="text-sm text-dark-300">
                                      Turnover: ${formatNumber(level.threshold)}
                                    </div>
                                  </div>
                                  <div className={`text-lg font-bold ${
                                    isClaimed ? 'text-green-400' :
                                    isUnlocked ? 'text-yellow-400' :
                                    'text-dark-500'
                                  }`}>
                                    ${formatNumber(level.bonus)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm text-dark-200">
                          <strong className="text-white">Important:</strong> Bonuses are automatically awarded when your team reaches the turnover threshold.
                          Team turnover = sum of all positive P&L from closed copies (losses excluded).
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Referrals List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Your Referrals</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLevelChange('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeLevel === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-dark-400 hover:text-white'
                      }`}
                    >
                      All ({referrals.length})
                    </button>
                    {levelCounts.map((lc) => (
                      <button
                        key={lc.level}
                        onClick={() => handleLevelChange(lc.level)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          activeLevel === lc.level
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-800 text-dark-400 hover:text-white'
                        }`}
                      >
                        L{lc.level} ({lc.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                    placeholder="Search by username or email..."
                    className="w-full px-4 py-2.5 pl-10 bg-dark-900/50 border border-dark-700 rounded-lg text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500">
                    🔍
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {paginatedReferrals.length > 0 ? (
                <div className="space-y-3">
                  {paginatedReferrals.map((referral: any, index: number) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                          {referral.avatar ? (
                            <Image
                              src={referral.avatar}
                              alt={referral.username}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{referral.username[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{referral.username}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                referral.status === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-dark-700 text-dark-400'
                              }`}
                            >
                              Level {referral.level}
                            </span>
                            {referral.status === 'active' && (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                Active
                              </span>
                            )}
                          </div>
                          {referral.email && (
                            <div className="text-xs text-dark-500 mt-0.5">
                              📧 {referral.email}
                            </div>
                          )}
                          <div className="text-sm text-dark-400 mt-1">
                            Joined {formatDate(referral.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-dark-400">Total Deposits</div>
                        <div className="text-lg font-bold text-white">
                          ${formatNumber(referral.deposits)}
                        </div>
                        <div className="text-sm text-green-400">
                          Your Bonus: ${formatNumber(referral.bonus)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
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
                <div className="text-center py-12 text-dark-400">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-sm">No referrals yet</div>
                  <div className="text-xs mt-1">Share your link to start earning</div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column - Recent Bonuses */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-1">Recent Bonuses</h3>
              <p className="text-xs text-dark-500 mb-4">Last 10 bonuses received</p>
              <div className="space-y-3">
                {recentBonuses.length > 0 ? (
                  recentBonuses.map((bonus: any) => (
                    <div
                      key={bonus.id}
                      className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-xl">
                        💰
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-green-400">
                            +${formatNumber(bonus.amount)}
                          </div>
                          {bonus.level && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400">
                              L{bonus.level}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-dark-400 truncate">
                          from {bonus.from}
                        </div>
                        <div className="text-xs text-dark-500">{timeAgo(bonus.date)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-dark-400">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-sm">No commissions yet</div>
                    <div className="text-xs mt-1">Share your link to start earning</div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Referral Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Referral Tips</h3>
              <div className="space-y-3 text-sm text-dark-300">
                <div className="flex gap-3">
                  <span className="text-xl">🎯</span>
                  <div>
                    <div className="font-medium text-white">Share Your Link</div>
                    <div className="text-xs">Post on social media and forums</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="font-medium text-white">Explain Benefits</div>
                    <div className="text-xs">Show them how they can earn too</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-white">Build a Team</div>
                    <div className="text-xs">Help your referrals succeed</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <div className="font-medium text-white">Unlock Milestones</div>
                    <div className="text-xs">Reach turnover targets for bonuses</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Referred By Section */}
          {referrerUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                    <span>{referrerUser.username[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-dark-400">Referred By</div>
                    <div className="font-medium text-white">{referrerUser.username}</div>
                    <div className="text-xs text-dark-500">Code: {referrerUser.referralCode}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Bonus Currency Preference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-2">Bonus Currency</h3>
              <p className="text-xs text-dark-400 mb-4">Choose which currency to receive referral bonuses</p>

              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-dark-900/50 border-2 border-dark-700 rounded-xl text-white hover:border-primary-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {selectedBonusCurrency && selectedBonusCurrency.icon && (
                      <Image
                        src={`/currency/${selectedBonusCurrency.icon}`}
                        alt={selectedBonusCurrency.symbol}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{walletForBonus}</div>
                      <div className="text-xs text-dark-400">
                        {selectedBonusCurrency?.name}
                      </div>
                    </div>
                  </div>
                  <span className="text-dark-400">▼</span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showCurrencyDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2 bg-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {bonusCurrencies.map((curr) => (
                        <button
                          key={curr.symbol}
                          onClick={() => handleBonusCurrencyChange(curr.symbol)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-800 transition-colors
                            ${curr.symbol === walletForBonus ? 'bg-primary-500/10' : ''}
                          `}
                        >
                          {curr.icon && (
                            <Image
                              src={`/currency/${curr.icon}`}
                              alt={curr.symbol}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <div className="text-left">
                            <div className="font-medium text-white">{curr.symbol}</div>
                            <div className="text-xs text-dark-400">{curr.name}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
