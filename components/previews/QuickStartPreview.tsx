'use client';

import { Zap } from 'lucide-react';

export function QuickStartPreview() {
  return (
    <div className="w-full max-w-[340px] rounded-2xl bg-white dark:bg-gradient-to-br dark:from-violet-500/10 dark:via-purple-500/5 dark:to-violet-500/10 border border-gray-200 dark:border-violet-500/30 p-5 shadow-2xl shadow-violet-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">Quick Start</p>
          <p className="text-[10px] text-gray-400 dark:text-dark-500">Portfolio builder</p>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 dark:text-dark-400 mb-3 uppercase tracking-wider font-semibold">Select Risk Profile</p>
      <div className="space-y-2">
        {[
          { label: 'Conservative', color: 'green', desc: 'Low risk, steady growth', active: false },
          { label: 'Balanced', color: 'blue', desc: 'Medium risk, solid returns', active: true },
          { label: 'Aggressive', color: 'red', desc: 'High risk, max potential', active: false },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
              opt.active
                ? 'border-blue-500/50 bg-blue-500/10'
                : 'border-gray-200 dark:border-dark-700/50 bg-gray-50 dark:bg-dark-900/40'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                opt.active ? 'border-blue-400' : 'border-gray-300 dark:border-dark-600'
              }`}
            >
              {opt.active && <div className="w-2 h-2 rounded-full bg-blue-400" />}
            </div>
            <div>
              <p className={`text-[11px] font-semibold ${opt.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-dark-300'}`}>
                {opt.label}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-dark-500">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 w-full text-center px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg text-[11px] font-semibold text-white">
        Build My Portfolio
      </div>
    </div>
  );
}
