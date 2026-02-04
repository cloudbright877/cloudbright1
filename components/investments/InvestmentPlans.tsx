'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

// Investment plan options
const plans = [
  {
    id: 1,
    name: 'Essential',
    minAmount: 50,
    dailyRate: 2.0,
    monthlyRate: 60,
    duration: 30,
    features: [
      'Automated trading strategies',
      'Portfolio diversification',
      'Risk management systems',
      'Daily performance reports',
      '24/7 monitoring',
    ],
    popular: false,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Professional',
    minAmount: 2500,
    dailyRate: 2.5,
    monthlyRate: 75,
    duration: 30,
    features: [
      'All Essential features',
      'Advanced trading algorithms',
      'Multi-exchange support',
      'Priority customer support',
      'Detailed analytics dashboard',
      'Custom strategy options',
    ],
    popular: true,
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    id: 3,
    name: 'Ultimate',
    minAmount: 10000,
    dailyRate: 3.0,
    monthlyRate: 90,
    duration: 30,
    features: [
      'All Professional features',
      'Premium trading strategies',
      'Dedicated account manager',
      'Institutional-grade execution',
      'Custom risk parameters',
      'VIP support line',
      'Exclusive market insights',
    ],
    popular: false,
    gradient: 'from-accent-500 to-pink-500',
  },
];

interface InvestmentPlansProps {
  onSelectPlan: (planId: number) => void;
}

export default function InvestmentPlans({ onSelectPlan }: InvestmentPlansProps) {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            className="relative"
          >
            {/* Popular badge */}
            {plan.popular && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20"
              >
                <div className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-xs font-bold text-white shadow-lg">
                  🔥 Most Popular
                </div>
              </motion.div>
            )}

            <GlassCard
              variant="glow"
              gradient={plan.gradient}
              className={`h-full transition-all duration-300 ${
                plan.popular ? 'scale-105 border-primary-500/40' : ''
              } ${hoveredPlan === plan.id ? 'scale-105' : ''}`}
            >
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-sm text-dark-400">Plan #{plan.id}</div>
              </div>

              {/* Minimum Investment */}
              <div className="mb-6">
                <div className="text-xs text-dark-400 mb-1">Minimum Investment</div>
                <div className="text-3xl font-bold text-gradient">
                  ${plan.minAmount.toLocaleString('en-US')}
                </div>
              </div>

              {/* Returns */}
              <div className="mb-6 p-4 bg-dark-900/50 rounded-xl border border-primary-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-dark-400">Daily Rate:</span>
                  <span className="text-lg font-bold text-green-400">{plan.dailyRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Monthly Potential:</span>
                  <span className="text-lg font-bold text-green-400">{plan.monthlyRate}%</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-primary-400 mb-3 uppercase tracking-wide">
                  Plan Features:
                </h4>
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-400 mt-0.5 text-xs">▸</span>
                      <span className="text-dark-300 text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration */}
              <div className="mb-6 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-dark-400">🔒</span>
                  <span className="text-white text-sm font-medium">{plan.duration} Days Duration</span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => onSelectPlan(plan.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-3 rounded-xl font-semibold text-center transition-all duration-300
                  ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg hover:shadow-2xl'
                      : 'bg-dark-700 text-white hover:bg-dark-600'
                  }
                `}
              >
                Select Plan
              </motion.button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Insurance Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl"
      >
        <span className="text-3xl">🛡️</span>
        <div>
          <div className="font-bold text-green-400 mb-1">100% Investment Insurance Protection</div>
          <div className="text-sm text-dark-400">
            Your entire investment is fully insured by our company's reserve fund
          </div>
        </div>
      </motion.div>
    </div>
  );
}
