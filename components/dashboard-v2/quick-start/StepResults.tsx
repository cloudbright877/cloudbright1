'use client';

import { CheckCircle2, Shield, Zap, Target } from 'lucide-react';
import type { BotAllocation } from '@/lib/quickStart';

interface StepResultsProps {
  allocations: BotAllocation[];
  totalAmount: number;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function StepResults({ allocations, totalAmount, onConfirm, isProcessing }: StepResultsProps) {
  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return <Shield className="w-5 h-5 text-green-400" />;
      case 'medium':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'high':
        return <Target className="w-5 h-5 text-red-400" />;
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
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Your portfolio is ready!</h3>
        <p className="text-dark-400">
          We have selected {allocations.length} bots for your ${totalAmount.toLocaleString()} investment
        </p>
      </div>

      {/* Allocation breakdown */}
      <div className="space-y-3">
        {allocations.map((allocation, index) => (
          <div
            key={allocation.bot.id}
            className="p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-all"
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
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">{allocation.bot.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRiskColor(allocation.bot.risk)}`}>
                        {getRiskIcon(allocation.bot.risk)}
                        <span className="ml-1">{allocation.bot.risk.toUpperCase()} RISK</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">${allocation.amount.toFixed(2)}</p>
                    <p className="text-sm text-dark-400">{allocation.allocationPercent}%</p>
                  </div>
                </div>

                <p className="text-sm text-dark-400 mb-2">{allocation.bot.strategy}</p>
                <p className="text-xs text-dark-500">{allocation.rationale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark-400">Total Investment</span>
          <span className="text-xl font-bold text-white">${totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-dark-700 disabled:to-dark-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30"
      >
        {isProcessing ? 'Creating Portfolio...' : 'Start Trading'}
      </button>
    </div>
  );
}
