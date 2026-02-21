'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Wallet, Sprout, TrendingUp, BarChart3, Crown } from 'lucide-react';

interface StepAmountProps {
  userBalance: number;
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

const TIERS = [
  { amount: 100, label: 'Starter', description: 'Try the platform', icon: Sprout, badge: null },
  { amount: 500, label: 'Growth', description: 'Build a portfolio', icon: TrendingUp, badge: 'Popular' },
  { amount: 1000, label: 'Premium', description: 'Diversified strategy', icon: BarChart3, badge: null },
  { amount: 5000, label: 'Professional', description: 'Maximum diversification', icon: Crown, badge: null },
];

export function StepAmount({ userBalance, selectedAmount, onSelect }: StepAmountProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = (amount: number) => {
    setShowCustom(false);
    setCustomAmount('');
    onSelect(amount);
  };

  const handleCustomClick = () => {
    setShowCustom(true);
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      onSelect(amount);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-base sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">How much do you want to invest?</h3>
        <p className="text-xs sm:text-base text-gray-600 dark:text-dark-400">Select a tier or enter a custom amount</p>
      </div>

      {/* Balance card */}
      {userBalance < 50 ? (
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-400">
                {userBalance === 0 ? 'Fund your account to get started' : `You need $${(50 - userBalance).toLocaleString()} more`}
              </p>
              <p className="text-xs text-gray-600 dark:text-dark-400">Balance: ${userBalance.toLocaleString()} &middot; Minimum: $50</p>
            </div>
            <Link
              href="/dashboard-v2/wallets/deposit?returnTo=/dashboard-v2/quick-start"
              className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg text-xs font-semibold text-white transition-all shadow-lg shadow-primary-500/30"
            >
              Deposit
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <p className="text-[11px] text-gray-600 dark:text-dark-400 leading-tight">Available Balance</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">${userBalance.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-2 gap-3">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedAmount === tier.amount && !showCustom;
          return (
            <button
              key={tier.amount}
              onClick={() => handlePresetClick(tier.amount)}
              className={`relative px-3 py-3 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-gray-200 dark:bg-dark-800/80 border-2 border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-gray-100 dark:hover:bg-dark-700/60'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full">
                  {tier.badge}
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  isSelected ? 'bg-primary-500/20' : 'bg-gray-200 dark:bg-dark-700'
                }`}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-400' : 'text-gray-600 dark:text-dark-400'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">${tier.amount.toLocaleString()}</p>
                  <p className={`text-xs ${isSelected ? 'text-primary-400' : 'text-gray-600 dark:text-dark-500'}`}>{tier.label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom amount */}
      <div>
        {!showCustom ? (
          <button
            onClick={handleCustomClick}
            className="w-full px-4 py-3 rounded-xl font-medium text-sm bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 border-dashed text-gray-700 dark:text-dark-300 hover:border-primary-500/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700/60 transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              Custom Amount
            </div>
          </button>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-dark-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-100 dark:bg-dark-900 border-2 border-primary-500 text-gray-900 dark:text-white text-base font-semibold placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-400 focus:ring-primary-500 shadow-lg shadow-primary-500/20"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
