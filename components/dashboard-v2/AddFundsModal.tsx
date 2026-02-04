'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: {
    id: string;
    name: string;
    invested: number;
  };
  availableBalance: number;
  onAddFunds: (amount: number) => void;
}

export function AddFundsModal({ isOpen, onClose, bot, availableBalance, onAddFunds }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [100, 500, 1000, 2500];

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');

    // Validate
    const numAmount = parseFloat(numericValue);

    if (numericValue === '') {
      setAmount('');
      setError('');
      return;
    }

    if (isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount <= 0) {
      setError('Amount must be greater than 0');
      setAmount(numericValue);
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Insufficient balance. Available: $${availableBalance.toLocaleString('en-US')}`);
      setAmount(numericValue);
      return;
    }

    setAmount(numericValue);
    setError('');
  };

  const handleQuickAmount = (quickAmount: number) => {
    if (quickAmount > availableBalance) {
      setError(`Insufficient balance. Available: $${availableBalance.toLocaleString('en-US')}`);
      return;
    }
    setAmount(quickAmount.toString());
    setError('');
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Insufficient balance. Available: $${availableBalance.toLocaleString('en-US')}`);
      return;
    }

    onAddFunds(numAmount);
    // Note: Parent component handles closing the modal after successful add
  };

  const newInvestment = bot.invested + (parseFloat(amount) || 0);

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl opacity-50" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Add Funds</h2>
                      <p className="text-xs text-dark-400">{bot.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Current Investment */}
                  <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                    <p className="text-xs text-dark-400 mb-1">Current Investment</p>
                    <p className="text-2xl font-bold text-white">${bot.invested.toLocaleString('en-US')}</p>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Add Amount
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 font-bold text-lg">
                        $
                      </div>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-10 pr-4 py-3 bg-dark-800 border ${
                          error ? 'border-red-500/50' : 'border-dark-700'
                        } rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-green-500/50 transition-colors`}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Quick Amounts */}
                  <div>
                    <p className="text-xs text-dark-400 mb-2">Quick amounts</p>
                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => handleQuickAmount(quickAmount)}
                          disabled={quickAmount > availableBalance}
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                            quickAmount > availableBalance
                              ? 'bg-dark-800 border-dark-700 text-dark-600 cursor-not-allowed'
                              : 'bg-dark-800 border-dark-600 text-dark-300 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400'
                          }`}
                        >
                          ${quickAmount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-dark-700" />

                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Available Balance</span>
                      <span className="font-semibold text-white">${availableBalance.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">New Investment</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-400">${newInvestment.toLocaleString('en-US')}</span>
                        {amount && !error && (
                          <div className="flex items-center gap-1 text-xs text-green-400/70">
                            <TrendingUp className="w-3 h-3" />
                            +{((parseFloat(amount) / bot.invested) * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-400/90 leading-relaxed">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>New funds will be used for future positions only</li>
                        <li>Current open positions remain unchanged</li>
                        <li>Bot continues trading with increased capital</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-dark-700">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg font-semibold text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!amount || !!error || parseFloat(amount) <= 0}
                    className="relative flex-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 group-disabled:opacity-30" />
                    <div className="relative px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-white shadow-lg">
                      Add ${parseFloat(amount) || 0}
                    </div>
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
