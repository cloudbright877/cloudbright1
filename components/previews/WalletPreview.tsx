'use client';

import { Wallet } from 'lucide-react';

const currencies = [
  { name: 'USDT', balance: '$8,450.00', img: '/currency/Tether.svg' },
  { name: 'BTC', balance: '0.2847 BTC', img: '/currency/Bitcoin.svg' },
  { name: 'ETH', balance: '2.156 ETH', img: '/currency/Ethereum.svg' },
];

export function WalletPreview() {
  return (
    <div className="w-[280px] rounded-2xl bg-white dark:bg-gradient-to-br dark:from-emerald-500/10 dark:via-green-500/5 dark:to-emerald-500/10 border border-gray-200 dark:border-emerald-500/30 p-5 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
          <Wallet className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">My Wallets</p>
          <p className="text-[10px] text-gray-400 dark:text-dark-500">3 currencies</p>
        </div>
        <span className="ml-auto text-sm font-bold text-green-400">$12,840</span>
      </div>
      <div className="space-y-2">
        {currencies.map((c) => (
          <div key={c.name} className="flex items-center gap-3 p-2.5 bg-primary-500/10 dark:bg-dark-900/50 rounded-lg border border-primary-500/20 dark:border-dark-700/50">
            <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{c.name}</p>
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-dark-200">{c.balance}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 text-center px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[11px] font-semibold text-emerald-400">
          Deposit
        </div>
        <div className="flex-1 text-center px-3 py-2 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-[11px] font-semibold text-gray-500 dark:text-dark-300">
          Withdraw
        </div>
      </div>
    </div>
  );
}
