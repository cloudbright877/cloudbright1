'use client';

import { Shield, Zap, Target, Lock } from 'lucide-react';
import type { RiskProfile } from '@/lib/quickStart';

interface StepRiskProps {
  selectedRisk: RiskProfile | null;
  onSelect: (risk: RiskProfile) => void;
}

const RISK_OPTIONS: Array<{
  value: RiskProfile;
  icon: typeof Shield;
  title: string;
  description: string;
  expectedReturn: string;
  lockIn: string;
  allocation: { low: number; medium: number; high: number };
  riskLevel: number; // 1-5 dots filled
  color: string;
}> = [
  {
    value: 'conservative',
    icon: Shield,
    title: 'Conservative',
    description: 'Steady returns, minimal volatility',
    expectedReturn: '20-30% / month',
    lockIn: '15-30 days',
    allocation: { low: 60, medium: 30, high: 10 },
    riskLevel: 2,
    color: 'green',
  },
  {
    value: 'balanced',
    icon: Zap,
    title: 'Balanced',
    description: 'Moderate risk, wider upside',
    expectedReturn: '30-50% / month',
    lockIn: '30-90 days',
    allocation: { low: 25, medium: 50, high: 25 },
    riskLevel: 3,
    color: 'blue',
  },
  {
    value: 'aggressive',
    icon: Target,
    title: 'Aggressive',
    description: 'Maximum upside, higher volatility',
    expectedReturn: '50-70% / month',
    lockIn: '90-180 days',
    allocation: { low: 10, medium: 30, high: 60 },
    riskLevel: 5,
    color: 'orange',
  },
];

function RiskMeter({ level, color }: { level: number; color: string }) {
  const dotColor =
    color === 'green' ? 'bg-green-400' :
    color === 'blue' ? 'bg-blue-400' :
    color === 'orange' ? 'bg-orange-400' :
    'bg-red-400';

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= level ? dotColor : 'bg-gray-300 dark:bg-dark-600'
          }`}
        />
      ))}
    </div>
  );
}

function AllocationBar({ allocation, color }: { allocation: { low: number; medium: number; high: number }; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-700">
        <div className="bg-green-500/80 rounded-l-full" style={{ width: `${allocation.low}%` }} />
        <div className="bg-blue-500/80" style={{ width: `${allocation.medium}%` }} />
        <div className="bg-orange-500/80 rounded-r-full" style={{ width: `${allocation.high}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 dark:text-dark-500">
        <span>Low {allocation.low}%</span>
        <span>Med {allocation.medium}%</span>
        <span>High {allocation.high}%</span>
      </div>
    </div>
  );
}

export function StepRisk({ selectedRisk, onSelect }: StepRiskProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">What is your risk profile?</h3>
        <p className="text-sm text-gray-600 dark:text-dark-400">Choose how you want to allocate your capital</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RISK_OPTIONS.map(option => {
          const Icon = option.icon;
          const isSelected = selectedRisk === option.value;

          const selectedBorder =
            option.color === 'green' ? 'border-green-500 shadow-lg shadow-green-500/20' :
            option.color === 'blue' ? 'border-blue-500 shadow-lg shadow-blue-500/20' :
            'border-orange-500 shadow-lg shadow-orange-500/20';

          const selectedBg =
            option.color === 'green' ? 'bg-green-500/5' :
            option.color === 'blue' ? 'bg-blue-500/5' :
            'bg-orange-500/5';

          const iconBg =
            option.color === 'green' ? 'bg-green-500/20 border-green-500/30' :
            option.color === 'blue' ? 'bg-blue-500/20 border-blue-500/30' :
            'bg-orange-500/20 border-orange-500/30';

          const iconColor =
            option.color === 'green' ? 'text-green-400' :
            option.color === 'blue' ? 'text-blue-400' :
            'text-orange-400';

          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`px-4 py-3 rounded-xl text-left transition-all ${
                isSelected
                  ? `${selectedBg} border-2 ${selectedBorder}`
                  : 'bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-gray-100 dark:hover:bg-dark-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{option.title}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <RiskMeter level={option.riskLevel} color={option.color} />
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-dark-500">
                        <Lock className="w-3 h-3" />
                        {option.lockIn}
                      </span>
                      <span className={`text-xs font-medium ${iconColor}`}>{option.expectedReturn}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-400 mt-1 mb-2">{option.description}</p>
                  <AllocationBar allocation={option.allocation} color={option.color} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
