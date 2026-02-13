'use client';

import { Gauge, TrendingUp } from 'lucide-react';

export function DashboardPreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-5 shadow-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-dark-400 font-medium">Net Worth</p>
          <p className="text-[10px] text-gray-400 dark:text-dark-500">Total portfolio value</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$16,856.40</p>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-bold">+$4,856</span>
        </div>
        <span className="text-xs text-green-400/70">+40.47%</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700">
          <p className="text-[9px] text-gray-500 dark:text-dark-400">Invested</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">$12,000</p>
        </div>
        <div className="p-2.5 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700">
          <p className="text-[9px] text-gray-500 dark:text-dark-400">Realized</p>
          <p className="text-sm font-bold text-green-400">+$3,240</p>
        </div>
      </div>
      <div className="p-2.5 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700 mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-gray-500 dark:text-dark-400">Active Bots</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">3 / 3</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold">All Running</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-gray-400 dark:text-dark-500 uppercase tracking-wider font-semibold">Equity · 30d</span>
          <span className="text-[10px] text-green-400 font-bold">+40.47%</span>
        </div>
        <svg viewBox="0 0 240 50" className="w-full h-10">
          <defs>
            <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(79,70,229)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,42 C10,40 20,37 35,34 S55,30 70,27 S90,22 105,18 S120,20 135,15 S155,11 170,8 S190,5 210,4 S230,2 240,1 L240,50 L0,50 Z"
            fill="url(#dash-fill)"
          />
          <path
            d="M0,42 C10,40 20,37 35,34 S55,30 70,27 S90,22 105,18 S120,20 135,15 S155,11 170,8 S190,5 210,4 S230,2 240,1"
            fill="none"
            stroke="rgb(79,70,229)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="240" cy="1" r="3" fill="rgb(79,70,229)" />
        </svg>
      </div>
    </div>
  );
}
