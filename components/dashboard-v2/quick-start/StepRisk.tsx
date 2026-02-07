'use client';

import { Shield, Zap, Target } from 'lucide-react';
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
  allocation: string;
  color: string;
}> = [
  {
    value: 'conservative',
    icon: Shield,
    title: 'Conservative',
    description: 'Lower risk, steady returns',
    allocation: '60% low, 30% medium, 10% high',
    color: 'green',
  },
  {
    value: 'balanced',
    icon: Zap,
    title: 'Balanced',
    description: 'Moderate risk and returns',
    allocation: '25% low, 50% medium, 25% high',
    color: 'blue',
  },
  {
    value: 'aggressive',
    icon: Target,
    title: 'Aggressive',
    description: 'Higher risk, maximum returns',
    allocation: '10% low, 30% medium, 60% high',
    color: 'red',
  },
];

export function StepRisk({ selectedRisk, onSelect }: StepRiskProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">What is your risk profile?</h3>
        <p className="text-dark-400">Choose how you want to allocate your capital</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {RISK_OPTIONS.map(option => {
          const Icon = option.icon;
          const isSelected = selectedRisk === option.value;

          const selectedClass = isSelected
            ? option.color === 'green'
              ? 'bg-green-500/10 border-2 border-green-500 shadow-lg shadow-green-500/30'
              : option.color === 'blue'
              ? 'bg-blue-500/10 border-2 border-blue-500 shadow-lg shadow-blue-500/30'
              : 'bg-red-500/10 border-2 border-red-500 shadow-lg shadow-red-500/30'
            : 'bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-700';

          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`p-5 rounded-xl text-left transition-all ${selectedClass}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  option.color === 'green' ? 'bg-green-500/20 border border-green-500/30' :
                  option.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/30' :
                  'bg-red-500/20 border border-red-500/30'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    option.color === 'green' ? 'text-green-400' :
                    option.color === 'blue' ? 'text-blue-400' :
                    'text-red-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{option.title}</h4>
                  <p className="text-sm text-dark-400 mb-2">{option.description}</p>
                  <p className="text-xs text-dark-500">Allocation: {option.allocation}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
