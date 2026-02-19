'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  DollarSign,
  AlertCircle,
  Clock,
  Shield,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';
import { botsApi } from '@/lib/api/botsApi';
import { getDemoBotBySlug } from '@/lib/demoMarketplace';
import { getBalance } from '@/lib/balances';
import type { DemoBot } from '@/lib/demoMarketplace';

export default function CopyBotPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [bot, setBot] = useState<DemoBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReservationInfo, setShowReservationInfo] = useState(true);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    loadBot();
    const userId = localStorage.getItem('currentUserId') || 'user_default';
    getBalance(userId).then(b => setUserBalance(b.available));
  }, [slug]);

  const loadBot = () => {
    setLoading(true);
    try {
      const botData = getDemoBotBySlug(slug);
      if (!botData) {
        console.error(`Bot ${slug} not found`);
        router.push('/dashboard-v2/bots');
        return;
      }
      setBot(botData);
    } catch (err) {
      console.error('[CopyBotPage] Error loading bot:', err);
      router.push('/dashboard-v2/bots');
    } finally {
      setLoading(false);
    }
  };

  const minInvestment = 50;
  const maxInvestment = userBalance;

  const handleAmountChange = (value: string) => {
    setInvestmentAmount(value);
    setError('');

    const amount = parseFloat(value);
    if (isNaN(amount)) return;

    if (amount < minInvestment) {
      setError(`Minimum investment is $${minInvestment}`);
    } else if (amount > maxInvestment) {
      setError(`Insufficient balance. Available: $${maxInvestment.toLocaleString()}`);
    }
  };

  const handleConfirm = async () => {
    const amount = parseFloat(investmentAmount);

    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < minInvestment) {
      setError(`Minimum investment is $${minInvestment}`);
      return;
    }

    if (amount > maxInvestment) {
      setError(`Insufficient balance. Available: $${maxInvestment.toLocaleString()}`);
      return;
    }

    if (!bot) return;

    try {
      setIsProcessing(true);

      // Create user copy
      const userId = localStorage.getItem('currentUserId') || 'user_default';
      const copyId = await botsApi.createBotCopy(bot.id, amount, userId);

      console.log(`[CopyBotPage] Created copy: ${copyId}`);

      // Redirect to copy page
      router.push(`/dashboard-v2/copy/${copyId}`);
    } catch (err) {
      console.error('[CopyBotPage] Error:', err);
      setError('Failed to create copy. Please try again.');
      setIsProcessing(false);
    }
  };

  const getRiskIcon = () => {
    if (!bot) return null;
    switch (bot.risk) {
      case 'low':
        return <Shield className="w-5 h-5 text-green-400" />;
      case 'medium':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'high':
        return <Target className="w-5 h-5 text-red-400" />;
    }
  };

  const getRiskColor = () => {
    if (!bot) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    switch (bot.risk) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  if (loading || !bot) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Back Link */}
        <Link
          href={`/dashboard-v2/bots/${slug}`}
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Bot Details</span>
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 lg:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {typeof bot.icon === 'string' && bot.icon.startsWith('/') ? (
              <img src={bot.icon} alt={bot.name} className="w-14 h-14 object-contain" />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {bot.icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Copy {bot.name}</h1>
              <p className="text-sm text-dark-400 mt-1">{bot.strategy}</p>
            </div>
          </div>

          {/* Bot Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
              <p className="text-xs text-dark-400 mb-1">Return</p>
              <p className="text-sm font-bold text-green-400">
                +{bot.stats.return1y?.toFixed(0) || '0'}%
              </p>
            </div>
            <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
              <p className="text-xs text-dark-400 mb-1">Win Rate</p>
              <p className="text-sm font-bold text-white">
                {bot.stats.winRate?.toFixed(0) || '0'}%
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${getRiskColor()}`}>
              <p className="text-xs opacity-70 mb-1">Risk</p>
              <div className="flex items-center gap-1">
                {getRiskIcon()}
                <p className="text-sm font-bold capitalize">{bot.risk}</p>
              </div>
            </div>
          </div>

          {/* Investment Amount Input */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Investment Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DollarSign className="w-5 h-5 text-dark-400" />
                </div>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={`Min: $${minInvestment}`}
                  className="w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[500, 1000, 2500, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountChange(amount.toString())}
                  disabled={amount > userBalance}
                  className="flex-1 px-3 py-2 bg-dark-700/50 hover:bg-primary-500/20 border border-dark-600 hover:border-primary-500/50 rounded-lg text-xs font-semibold text-dark-300 hover:text-primary-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-dark-700/50 disabled:hover:border-dark-600 disabled:hover:text-dark-300"
                >
                  ${(amount / 1000).toFixed(amount >= 1000 ? 1 : 0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Balance Info */}
          <div className="flex items-center justify-between p-4 bg-dark-900/30 rounded-lg border border-dark-700 mb-6">
            <span className="text-sm text-dark-400">Available Balance</span>
            <span className="text-sm font-bold text-white">
              ${userBalance.toLocaleString()}
            </span>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
            <p className="text-xs text-blue-400 leading-relaxed">
              Your bot will automatically copy {bot.name}'s trading strategy. Profits are credited to your balance as trades close.
            </p>
          </div>

          {/* Capital Reservation Info */}
          <div className="border border-dark-700 rounded-lg overflow-hidden mb-6">
            <button
              onClick={() => setShowReservationInfo(!showReservationInfo)}
              className="w-full p-4 bg-dark-900/30 hover:bg-dark-900/50 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Capital Reservation: {bot.lockInDays} Days</span>
              </div>
              <motion.div
                animate={{ rotate: showReservationInfo ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-4 h-4 text-dark-400" />
              </motion.div>
            </button>

            {showReservationInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-dark-900/50 border-t border-dark-700 space-y-4"
              >
                <p className="text-xs text-dark-400 leading-relaxed">
                  Your capital will be locked for <strong className="text-white">{bot.lockInDays} days</strong> after activation. During this period you cannot deactivate the bot. This gives the strategy enough time to demonstrate its performance.
                </p>

                <div className="p-3 bg-dark-800/50 border border-dark-700 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-400">Lock-in period</span>
                    <span className="font-semibold text-white">{bot.lockInDays} days</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-400">Deactivation available</span>
                    <span className="font-semibold text-green-400">After day {bot.lockInDays}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-400">Capital return</span>
                    <span className="font-semibold text-green-400">100%</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400">
                    Profits from closed trades are auto-credited to your available balance throughout the copy period.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 rounded-lg font-semibold text-dark-300 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!investmentAmount || !!error || isProcessing}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-semibold text-white shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-500 disabled:hover:to-accent-500 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Copy...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Start Copying
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
