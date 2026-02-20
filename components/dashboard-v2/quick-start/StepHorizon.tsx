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
  range: string;
  frequency: string;
  style: string;
  barWidth: string;
}> = [
  {
    value: 'short',
    icon: Clock,
    title: 'Short-term',
    range: '1-4 weeks',
    frequency: '~10-20 trades/day',
    style: 'Scalping & Day Trading',
    barWidth: '25%',
  },
  {
    value: 'medium',
    icon: Calendar,
    title: 'Medium-term',
    range: '1-6 months',
    frequency: '~3-5 trades/day',
    style: 'Swing Trading',
    barWidth: '55%',
  },
  {
    value: 'long',
    icon: TrendingUp,
    title: 'Long-term',
    range: '6-12+ months',
    frequency: '~1-2 trades/week',
    style: 'Position Trading',
    barWidth: '100%',
  },
];

export function StepHorizon({ selectedHorizon, onSelect }: StepHorizonProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">What is your time horizon?</h3>
        <p className="text-sm text-gray-600 dark:text-dark-400">How long do you plan to invest?</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {HORIZON_OPTIONS.map(option => {
          const Icon = option.icon;
          const isSelected = selectedHorizon === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`px-4 py-3 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-primary-500/5 border-2 border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'bg-gray-50 dark:bg-dark-800/60 border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-gray-100 dark:hover:bg-dark-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                  isSelected
                    ? 'bg-primary-500/20 border-primary-500/30'
                    : 'bg-gray-200 dark:bg-dark-700 border-gray-300 dark:border-dark-600'
                }`}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-400' : 'text-gray-600 dark:text-dark-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{option.title}</h4>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-primary-400' : 'text-gray-700 dark:text-dark-300'}`}>
                      {option.range}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-400 mt-0.5">{option.frequency} · {option.style}</p>
                  {/* Time bar */}
                  <div className="h-1 rounded-full bg-gray-200 dark:bg-dark-700 overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                          : 'bg-gray-400 dark:bg-dark-600'
                      }`}
                      style={{ width: option.barWidth }}
                    />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
