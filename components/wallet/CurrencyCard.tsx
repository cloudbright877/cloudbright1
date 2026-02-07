'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CurrencyCardProps {
  symbol: string;
  name: string;
  icon?: string; // Path to SVG icon (e.g., '/currency/Tether.svg')
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

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl transition-all duration-300
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
          className={`absolute -inset-0.5 bg-gradient-to-br ${cardGradient} rounded-2xl blur opacity-20 -z-10`}
        />
      )}

      {/* Icon */}
      <div
        className={`
          w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
          bg-gradient-to-br ${cardGradient}
          shadow-lg transition-transform duration-300
          ${selected ? 'scale-110' : 'group-hover:scale-110'}
        `}
      >
        {icon ? (
          <Image
            src={icon}
            alt={symbol}
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <span className="text-white text-2xl font-bold">{symbol.charAt(0)}</span>
        )}
      </div>

      {/* Symbol */}
      <div className="font-bold text-white text-lg mb-1">{symbol}</div>

      {/* Name */}
      <div className="text-sm text-dark-400">{name}</div>

      {/* Price (optional) */}
      {price && <div className="text-xs text-dark-500 mt-1">${price}</div>}

      {/* Networks count (optional) */}
      {networks !== undefined && (
        <div className="mt-3 text-xs text-dark-500">
          {networks} network{networks > 1 ? 's' : ''}
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
