'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Shield, Zap, Target, DollarSign, AlertCircle } from 'lucide-react';
import { botsApi } from '@/lib/api/botsApi';
import type { DemoBot } from '@/lib/demoMarketplace';
import type { MasterBotData } from '@/types/api';

interface CopyBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoBot: DemoBot | MasterBotData;
  userBalance?: number;
}

export function CopyBotModal({
  isOpen,
  onClose,
  demoBot,
  userBalance = 10000, // Default balance if not provided
}: CopyBotModalProps) {
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Support both DemoBot and MasterBotData types
  const minInvestment = ('minInvestment' in demoBot ? demoBot.minInvestment : demoBot.stats?.minInvestment) || 500;
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

    try {
      setIsProcessing(true);

      // Create user copy (NOT a full bot)
      const copyId = await botsApi.createBotCopy(demoBot.id, amount);

      console.log(`[CopyBotModal] Created copy: ${copyId}`);

      // Redirect to copy page
      router.push(`/dashboard-v2/copy/${copyId}`);

      onClose();
    } catch (err) {
      console.error('[CopyBotModal] Error:', err);
      setError('Failed to create copy. Please try again.');
      setIsProcessing(false);
    }
  };

  const getRiskIcon = () => {
    switch (demoBot.risk) {
      case 'low':
        return <Shield className="w-5 h-5 text-green-400" />;
      case 'medium':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'high':
        return <Target className="w-5 h-5 text-red-400" />;
    }
  };

  const getRiskColor = () => {
    switch (demoBot.risk) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg mx-4 pointer-events-auto"
            >
            <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-dark-700">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {demoBot.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1">
                        Copy {demoBot.name}
                      </h2>
                      <p className="text-sm text-dark-400">{demoBot.strategy}</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 transition-all"
                  >
                    <X className="w-5 h-5 text-dark-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Bot Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                    <p className="text-xs text-dark-400 mb-1">Return</p>
                    <p className="text-sm font-bold text-green-400">
                      +{('return1y' in demoBot.stats ? demoBot.stats.return1y.toFixed(0) : '0')}%
                    </p>
                  </div>
                  <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                    <p className="text-xs text-dark-400 mb-1">Win Rate</p>
                    <p className="text-sm font-bold text-white">
                      {demoBot.stats?.winRate.toFixed(0)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border ${getRiskColor()}`}>
                    <p className="text-xs opacity-70 mb-1">Risk</p>
                    <div className="flex items-center gap-1">
                      {getRiskIcon()}
                      <p className="text-sm font-bold capitalize">{demoBot.risk}</p>
                    </div>
                  </div>
                </div>

                {/* Investment Amount Input */}
                <div className="space-y-3">
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
                <div className="flex items-center justify-between p-4 bg-dark-900/30 rounded-lg border border-dark-700">
                  <span className="text-sm text-dark-400">Available Balance</span>
                  <span className="text-sm font-bold text-white">
                    ${userBalance.toLocaleString()}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400 leading-relaxed">
                    💡 Your bot will automatically copy {demoBot.name}'s trading strategy. You can stop or adjust settings anytime.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-dark-700 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 rounded-lg font-semibold text-dark-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!investmentAmount || !!error || isProcessing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-semibold text-white shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-500 disabled:hover:to-accent-500"
                >
                  {isProcessing ? 'Creating Copy...' : 'Start Copying'}
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
