'use client';

import { Clock, Calendar, TrendingUp } from 'lucide-react';
import type { TimeHorizon } from '@/lib/quickStart';

interface StepHorizonProps {
  selectedHorizon: TimeHorizon | null;
  onSelect: (horizon: TimeHorizon) => void;
}

const HORIZON_OPTIONS: Array<{
  value: TimeHorizon;
  icon: typeof Clock;
  title: string;
  description: string;
  details: string;
  color: string;
}> = [
  {
    value: 'short',
    icon: Clock,
    title: 'Short-term',
    description: 'Days to weeks',
    details: 'Prefers high-frequency bots with more trading opportunities',
    color: 'cyan',
  },
  {
    value: 'medium',
    icon: Calendar,
    title: 'Medium-term',
    description: 'Weeks to months',
    details: 'Balanced approach with moderate frequency and returns',
    color: 'blue',
  },
  {
    value: 'long',
    icon: TrendingUp,
    title: 'Long-term',
    description: 'Months to years',
    details: 'Prefers bots with higher return potential',
    color: 'purple',
  },
];

export function StepHorizon({ selectedHorizon, onSelect }: StepHorizonProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">What is your time horizon?</h3>
        <p className="text-dark-400">How long do you plan to invest?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HORIZON_OPTIONS.map(option => {
          const Icon = option.icon;
          const isSelected = selectedHorizon === option.value;

          const selectedClass = isSelected
            ? option.color === 'cyan'
              ? 'bg-cyan-500/10 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30'
              : option.color === 'blue'
              ? 'bg-blue-500/10 border-2 border-blue-500 shadow-lg shadow-blue-500/30'
              : 'bg-purple-500/10 border-2 border-purple-500 shadow-lg shadow-purple-500/30'
            : 'bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-700';

          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`p-5 rounded-xl text-left transition-all ${selectedClass}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  option.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/30' :
                  option.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/30' :
                  'bg-purple-500/20 border border-purple-500/30'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    option.color === 'cyan' ? 'text-cyan-400' :
                    option.color === 'blue' ? 'text-blue-400' :
                    'text-purple-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{option.title}</h4>
                  <p className="text-sm text-dark-400 mb-2">{option.description}</p>
                  <p className="text-xs text-dark-500">{option.details}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
