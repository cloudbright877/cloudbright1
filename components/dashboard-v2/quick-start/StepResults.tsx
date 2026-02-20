'use client';

import { Sparkles, Shield, Zap, Target, Rocket } from 'lucide-react';
import type { BotAllocation } from '@/lib/quickStart';

interface StepResultsProps {
  allocations: BotAllocation[];
  totalAmount: number;
  onConfirm: () => void;
  isProcessing: boolean;
}

const ALLOC_COLORS = [
  'bg-primary-500',
  'bg-accent-500',
  'bg-purple-500',
  'bg-violet-500',
  'bg-indigo-500',
  'bg-fuchsia-500',
];

export function StepResults({ allocations, totalAmount, onConfirm, isProcessing }: StepResultsProps) {
  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return <Shield className="w-3.5 h-3.5 text-green-400" />;
      case 'medium':
        return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'high':
        return <Target className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'medium':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary-500/10 animate-ping" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your Portfolio is Ready!</h3>
        <p className="text-gray-600 dark:text-dark-400">
          {allocations.length} bots selected for your ${totalAmount.toLocaleString()} investment
        </p>
      </div>

      {/* Allocation bar */}
      <div className="space-y-2">
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-700">
          {allocations.map((alloc, i) => (
            <div
              key={alloc.bot.id}
              className={`${ALLOC_COLORS[i % ALLOC_COLORS.length]} first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${alloc.allocationPercent}%` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {allocations.map((alloc, i) => (
            <div key={alloc.bot.id} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-dark-400">
              <div className={`w-2 h-2 rounded-full ${ALLOC_COLORS[i % ALLOC_COLORS.length]}`} />
              <span>{alloc.bot.name} ({alloc.allocationPercent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bot cards */}
      <div className="space-y-3">
        {allocations.map((allocation) => (
          <div
            key={allocation.bot.id}
            className="p-4 bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-primary-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Bot icon */}
              <div className="flex-shrink-0">
                {typeof allocation.bot.icon === 'string' && allocation.bot.icon.startsWith('/') ? (
                  <img src={allocation.bot.icon} alt={allocation.bot.name} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center text-2xl">
                    {allocation.bot.icon}
                  </div>
                )}
              </div>

              {/* Bot details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{allocation.bot.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-dark-400">{allocation.bot.strategy}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${allocation.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-500">{allocation.allocationPercent}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(allocation.bot.risk)}`}>
                    {getRiskIcon(allocation.bot.risk)}
                    <span>{allocation.bot.risk.toUpperCase()}</span>
                  </div>
                </div>
                {allocation.rationale && (
                  <p className="text-xs text-gray-500 dark:text-dark-500 mt-2">{allocation.rationale}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-dark-400">Total Investment</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-dark-400">Bots Selected</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{allocations.length}</p>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-dark-700 disabled:to-dark-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          'Creating Portfolio...'
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            Start Copying
          </>
        )}
      </button>
    </div>
  );
}
