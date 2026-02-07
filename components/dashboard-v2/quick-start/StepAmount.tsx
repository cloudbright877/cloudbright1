'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface StepAmountProps {
  userBalance: number;
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

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
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">How much do you want to invest?</h3>
        <p className="text-dark-400">
          Available balance: <span className="text-green-400 font-semibold">${userBalance.toLocaleString()}</span>
        </p>
      </div>

      {/* Preset amounts */}
      <div className="grid grid-cols-2 gap-3">
        {PRESET_AMOUNTS.map(amount => (
          <button
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedAmount === amount && !showCustom
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-2 border-primary-400 shadow-lg shadow-primary-500/50'
                : 'bg-dark-800 border border-dark-700 text-white hover:border-primary-500/50 hover:bg-dark-700'
            }`}
          >
            ${amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div>
        {!showCustom ? (
          <button
            onClick={handleCustomClick}
            className="w-full px-6 py-4 rounded-xl font-semibold bg-dark-800 border border-dark-700 text-white hover:border-primary-500/50 hover:bg-dark-700 transition-all"
          >
            Custom Amount
          </button>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-6 py-4 pl-12 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-2 border-primary-500 text-white text-lg font-semibold placeholder-dark-500 focus:outline-none focus:border-primary-400"
              autoFocus
            />
          </div>
        )}
      </div>

    </div>
  );
}
