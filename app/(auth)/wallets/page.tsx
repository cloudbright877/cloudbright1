'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';

const currencyGradients: Record<string, string> = {
  USDT: 'from-green-500 to-emerald-500',
  BTC: 'from-orange-500 to-yellow-500',
  ETH: 'from-blue-500 to-cyan-500',
  BNB: 'from-yellow-500 to-amber-500',
  USDC: 'from-blue-600 to-blue-400',
  SOL: 'from-purple-500 to-pink-500',
  TRX: 'from-red-500 to-orange-500',
};

// Map currency abbreviations to SVG file names
const currencyIconFiles: Record<string, string> = {
  USDT: 'Tether.svg',
  BTC: 'Bitcoin.svg',
  ETH: 'Ethereum.svg',
  BNB: 'bnb.svg',
  USDC: 'usdc.svg',
  SOL: 'Solana.svg',
  TRX: 'Tron.svg',
};


const SAMPLE_WALLETS = [
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: 15847.32,
    usdValue: 15847.32,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.05432,
    usdValue: 2716.00,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.543,
    usdValue: 5086.00,
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    balance: 12.45,
    usdValue: 3110.25,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 45.67,
    usdValue: 4567.00,
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    balance: 1234.56,
    usdValue: 123.46,
  },
];

export default function WalletsPage() {
  const wallets = SAMPLE_WALLETS;

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Wallets</h1>
      </motion.div>

      {/* Wallets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {wallets.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-dark-300">No wallets available</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet: any, index: number) => (
                  <motion.div
                    key={wallet.symbol}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard
                      variant="glow"
                      gradient={currencyGradients[wallet.symbol] || 'from-gray-500 to-gray-600'}
                      className="group"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 flex items-center justify-center">
                          {currencyIconFiles[wallet.symbol] ? (
                            <Image
                              src={`/currency/${currencyIconFiles[wallet.symbol]}`}
                              alt={wallet.symbol}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-white text-2xl font-bold">
                              {wallet.symbol[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                          <p className="text-sm text-dark-400">{wallet.symbol}</p>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="mb-4">
                        <div className="text-xs text-dark-400 mb-1">Balance</div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {formatNumber(wallet.balance, wallet.symbol === 'BTC' ? 8 : 2)} {wallet.symbol}
                        </div>
                        <div className="text-sm text-dark-400">
                          ≈ ${formatNumber(wallet.usdValue)}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/wallets/deposit"
                          className="py-2 px-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-sm text-primary-400 font-medium transition-colors text-center"
                        >
                          ↓ Deposit
                        </Link>
                        <Link
                          href="/wallets/withdraw"
                          className="py-2 px-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white font-medium transition-colors text-center"
                        >
                          ↑ Withdraw
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
