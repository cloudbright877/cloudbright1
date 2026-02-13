'use client';

import type { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureList({ features }: { features: FeatureItem[] }) {
  return (
    <div className="flex flex-col gap-8">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.number} className="relative flex items-start gap-4 group">
            <span className="absolute -left-1 -top-2 text-6xl font-semibold text-gray-200/40 dark:text-dark-800/20 select-none pointer-events-none leading-none">
              {feature.number}
            </span>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
              <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
