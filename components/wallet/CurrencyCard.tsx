'use client';

import { motion } from 'framer-motion';
import {
  TokenBTC,
  TokenETH,
  TokenUSDT,
  TokenBNB,
  TokenSOL,
  TokenTRX,
  TokenUSDC,
  TokenMATIC,
} from '@web3icons/react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIcon = any;

interface CurrencyCardProps {
  symbol: string;
  name: string;
  icon?: string;
  gradient?: string;
  price?: string;
  networks?: number;
  selected?: boolean;
  onClick?: () => void;
  delay?: number;
}

const DEFAULT_GRADIENTS: Record<string, string> = {
  USDT: 'from-green-500 to-emerald-500',
  BTC: 'from-orange-500 to-yellow-500',
  ETH: 'from-blue-500 to-cyan-500',
  BNB: 'from-yellow-500 to-amber-500',
  USDC: 'from-blue-600 to-blue-400',
  SOL: 'from-purple-500 to-pink-500',
  TRX: 'from-red-500 to-orange-500',
  MATIC: 'from-purple-600 to-indigo-500',
  POL: 'from-purple-600 to-indigo-500',
};

const TOKEN_ICONS: Record<string, AnyIcon> = {
  BTC: TokenBTC,
  ETH: TokenETH,
  USDT: TokenUSDT,
  BNB: TokenBNB,
  SOL: TokenSOL,
  TRX: TokenTRX,
  USDC: TokenUSDC,
  MATIC: TokenMATIC,
};

export default function CurrencyCard({
  symbol,
  name,
  icon,
  gradient,
  price,
  networks,
  selected = false,
  onClick,
  delay = 0,
}: CurrencyCardProps) {
  const cardGradient = gradient || DEFAULT_GRADIENTS[symbol] || 'from-gray-500 to-gray-600';
  const IconComponent = TOKEN_ICONS[symbol.toUpperCase()];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
        ${
          selected
            ? 'bg-dark-800/80 border-2 border-primary-500 shadow-lg shadow-primary-500/20'
            : 'bg-dark-800/50 border-2 border-dark-700 hover:border-primary-500/50 hover:bg-dark-800'
        }
      `}
    >
      {/* Glow effect when selected */}
      {selected && (
        <div
          className={`absolute -inset-0.5 bg-gradient-to-br ${cardGradient} rounded-xl blur opacity-20 -z-10`}
        />
      )}

      {/* Icon */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent size={32} variant="branded" />
        ) : (
          <span className="text-white text-lg font-bold">{symbol.charAt(0)}</span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{symbol}</span>
          {networks !== undefined && (
            <span className="text-[11px] text-dark-500">
              {networks} net{networks > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="text-xs text-dark-400 truncate">{name}</div>
      </div>

      {/* Price (optional) */}
      {price && <div className="text-xs text-dark-500 flex-shrink-0">${price}</div>}

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
