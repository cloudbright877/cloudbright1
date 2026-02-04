'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingShapes from './FloatingShapes';

const plans = [
  { name: 'Essential', dailyRate: 0.02, minAmount: 50 },
  { name: 'Professional', dailyRate: 0.025, minAmount: 2500 },
  { name: 'Ultimate', dailyRate: 0.03, minAmount: 10000 },
];

export default function Calculator() {
  const [amount, setAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState(0);

  // Static display values - no calculations
  const returns = {
    daily: 20.00,
    dailyPercent: 2.0,
    weekly: 140.00,
    weeklyPercent: 14.0,
    monthly: 600.00,
    monthlyPercent: 60.0,
    totalAfter30: 1600.00,
    profit: 600.00,
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatAmountInput = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = parseInt(value) || 0;
    setAmount(numValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value));
  };

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
    setAmount(plans[index].minAmount);
  };

  return (
    <section className="relative py-24 bg-white dark:bg-dark-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-torus-ring.png',
            size: 100,
            position: { top: '15%', left: '8%' },
            rotate: -30,
          },
          {
            src: '/images/glossy-glass-crystal.png',
            size: 150,
            position: { bottom: '20%', right: '5%' },
            rotate: 20,
          },
        ]}
      />

      {/* Animated blur orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your <span className="text-gradient">Potential Returns</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-dark-200 max-w-3xl mx-auto">
            See how much you can earn with our AI-powered trading strategies. Try different amounts to find your perfect investment.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto relative"
        >
          {/* Glow effect behind calculator */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl transform scale-105" />

          <div className="relative bg-gradient-to-br from-gray-50 dark:from-dark-800/95 to-gray-100 dark:to-dark-900/95 backdrop-blur-sm rounded-3xl border-2 border-gray-200 dark:border-dark-700 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Input Section */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Investment Amount</h3>

                {/* Plan Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-dark-300 mb-2">
                    Select Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {plans.map((plan, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlanSelect(index)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          selectedPlan === index
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                            : 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-dark-600'
                        }`}
                      >
                        {plan.name}
                        <div className="text-xs opacity-80">{plan.dailyRate * 100}%/day</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-dark-300 mb-2">
                    Enter Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary-500 dark:text-primary-400">$</span>
                    <input
                      type="text"
                      value={formatAmountInput(amount)}
                      onChange={handleAmountChange}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-900/50 border-2 border-gray-300 dark:border-dark-700 focus:border-primary-500 rounded-xl text-gray-900 dark:text-white text-2xl font-bold placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-dark-300 mb-3">
                    Or use slider to adjust amount
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="25000"
                    value={Math.min(amount, 25000)}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-300 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-dark-400 mt-2">
                    <span>$50</span>
                    <span>$25,000</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Results Section */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Projected Returns</h3>

                {/* Returns Breakdown */}
                <div className="space-y-3 mb-8">
                  {/* Daily */}
                  <div className="p-3 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-dark-300">Daily Profit</span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+{returns.dailyPercent.toFixed(1)}%</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(returns.daily)}</div>
                  </div>

                  {/* Weekly */}
                  <div className="p-3 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-dark-300">Weekly Profit</span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+{returns.weeklyPercent.toFixed(1)}%</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(returns.weekly)}</div>
                  </div>

                  {/* Monthly */}
                  <div className="p-3 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-dark-300">Monthly Profit</span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+{returns.monthlyPercent.toFixed(1)}%</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(returns.monthly)}</div>
                  </div>
                </div>

                {/* Total Return */}
                <div className="p-5 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-2 border-primary-500/30 rounded-xl">
                  <div className="text-xs text-primary-600 dark:text-primary-300 mb-2">
                    Total After 30 Days
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-1">{formatCurrency(returns.totalAfter30)}</div>
                  <div className="text-xs text-gray-600 dark:text-dark-300">Initial: {formatCurrency(amount)} + Profit: {formatCurrency(returns.profit)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-gray-500 dark:text-dark-400 mt-6"
        >
          * Returns are estimates based on historical performance. Actual returns may vary.
        </motion.p>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #0ea5e9, #d946ef);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #0ea5e9, #d946ef);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
        }
      `}</style>
    </section>
  );
}
