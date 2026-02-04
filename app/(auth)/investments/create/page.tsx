'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import SuccessModal from '@/components/investments/SuccessModal';

// Plan gradients mapping
const planGradients: Record<number, string> = {
  1: 'from-blue-500 to-cyan-500',
  2: 'from-primary-500 to-accent-500',
  3: 'from-accent-500 to-pink-500',
  4: 'from-purple-500 to-pink-500',
};

type Step = 1 | 2;


const staticWallets = [
  { symbol: 'USDT', name: 'Tether', balance: 15847.32, usdValue: 15847.32 },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.5432, usdValue: 23500.00 },
  { symbol: 'ETH', name: 'Ethereum', balance: 8.543, usdValue: 17000.00 },
  { symbol: 'BNB', name: 'BNB', balance: 45.67, usdValue: 13000.00 },
  { symbol: 'SOL', name: 'Solana', balance: 123.45, usdValue: 12000.00 },
  { symbol: 'TRX', name: 'Tron', balance: 5432.10, usdValue: 543.00 },
];

const staticPlans = [
  { id: 1, name: 'Essential Plan', returnRate: '60', duration: 30, minAmount: 50, maxAmount: 2499 },
  { id: 2, name: 'Professional Plan', returnRate: '75', duration: 30, minAmount: 2500, maxAmount: 9999 },
  { id: 3, name: 'Ultimate Plan', returnRate: '90', duration: 30, minAmount: 10000, maxAmount: 1000000 },
];

const staticPrices: Record<string, number> = {
  USDT: 1.00,
  BTC: 43000.00,
  ETH: 2300.00,
  BNB: 310.00,
  SOL: 98.00,
  TRX: 0.10,
};

// Global helper function for formatting crypto amounts
function formatCryptoAmount(amount: number, currency: string): string {
  const decimals = ['USDT', 'USDC'].includes(currency) ? 2 : 8;
  return amount.toFixed(decimals);
}

function CreateInvestmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdParam = searchParams?.get('plan');

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [compounding, setCompounding] = useState(0); // 0-100%
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const walletsLoading = false;
  const plansLoading = false;
  const pricesLoading = false;

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

  // Sort currencies by USD value (highest first)
  const availableCurrencies = useMemo(() => {
    return staticWallets
      .map((wallet: any) => ({
        ...wallet,
        icon: currencyIconFiles[wallet.symbol] || null
      }))
      .sort((a, b) => b.usdValue - a.usdValue);
  }, []);

  // Set default currency to the one with highest USD balance
  useEffect(() => {
    if (availableCurrencies.length > 0 && currency === 'USDT') {
      const topCurrency = availableCurrencies[0];
      if (topCurrency && topCurrency.usdValue > 0) {
        setCurrency(topCurrency.symbol);
      }
    }
  }, [availableCurrencies]);

  // Load plan from URL param
  useEffect(() => {
    if (planIdParam) {
      const plan = staticPlans.find((p: any) => p.id === Number(planIdParam));
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [planIdParam]);

  // Get selected currency data
  const selectedCurrency = useMemo(() => {
    return availableCurrencies.find((c: any) => c.symbol === currency);
  }, [currency, availableCurrencies]);

  // Get price for selected currency
  const currentPrice = useMemo(() => {
    return staticPrices[currency] || 1;
  }, [currency]);

  // Convert plan limits to selected currency
  const planLimitsInCrypto = useMemo(() => {
    if (!selectedPlan) return { min: 0, max: 0 };

    return {
      min: selectedPlan.minAmount / currentPrice,
      max: selectedPlan.maxAmount / currentPrice,
    };
  }, [selectedPlan, currentPrice]);

  // Calculate effective MAX (минимум между балансом и лимитом плана)
  const effectiveMax = useMemo(() => {
    if (!selectedCurrency || !selectedPlan) return 0;

    const balanceInCrypto = selectedCurrency.balance;
    const maxPlanInCrypto = planLimitsInCrypto.max;

    return Math.min(balanceInCrypto, maxPlanInCrypto);
  }, [selectedCurrency, planLimitsInCrypto]);

  // Simple profit calculations for UI display
  const calculations = useMemo(() => {
    if (!selectedPlan || !amount || Number(amount) === 0) {
      return { daily: 0, weekly: 0, monthly: 0, total: 0 };
    }

    const investAmount = Number(amount);
    const totalRate = Number(selectedPlan.returnRate) / 100;
    const duration = Number(selectedPlan.duration) || 30;

    // Simple calculations based on total return rate
    const totalProfit = investAmount * totalRate;
    const dailyProfit = totalProfit / duration;
    const weeklyProfit = dailyProfit * 7;
    const monthlyProfit = dailyProfit * 30;

    // Apply compounding boost as a simple multiplier
    const compoundingBoost = 1 + (compounding / 100) * 0.1; // 10% boost per 100% compounding

    return {
      daily: dailyProfit * compoundingBoost,
      weekly: weeklyProfit * compoundingBoost,
      monthly: monthlyProfit * compoundingBoost,
      total: totalProfit * compoundingBoost
    };
  }, [selectedPlan, amount, compounding]);

  // Calculate USD values for display
  const calculationsUSD = useMemo(() => {
    return {
      daily: calculations.daily * currentPrice,
      weekly: calculations.weekly * currentPrice,
      monthly: calculations.monthly * currentPrice,
      total: calculations.total * currentPrice,
    };
  }, [calculations, currentPrice]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
      // Update USD amount
      const cryptoValue = parseFloat(value) || 0;
      const usdValue = cryptoValue * currentPrice;
      setAmountUSD(usdValue > 0 ? usdValue.toFixed(2) : '');
    }
  };

  const handleAmountUSDChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmountUSD(value);
      // Update crypto amount
      const usdValue = parseFloat(value) || 0;
      const cryptoValue = usdValue / currentPrice;
      setAmount(cryptoValue > 0 ? cryptoValue.toFixed(8) : '');
    }
  };

  const handleMaxClick = () => {
    if (selectedCurrency) {
      // Limit decimals: 2 for USDT/USDC, 8 for others
      const decimals = ['USDT', 'USDC'].includes(currency) ? 2 : 8;
      // Use floor to ensure value is always within limits (never rounds up)
      const multiplier = Math.pow(10, decimals);
      const maxValue = (Math.floor(effectiveMax * multiplier) / multiplier).toFixed(decimals);
      setAmount(maxValue);
      // Update USD amount
      const usdValue = parseFloat(maxValue) * currentPrice;
      setAmountUSD(usdValue.toFixed(2));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.push('/investments');
    }
  };

  const handleActivate = () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const successParams = new URLSearchParams({
        success: 'true',
        amount: amount,
        currency: currency,
        planName: selectedPlan.name,
      });
      router.push(`/investments?${successParams.toString()}`);
    }, 1000);
  };

  const validateStep1 = () => {
    if (!selectedPlan) return false;
    const amountNum = Number(amount);
    if (amountNum < planLimitsInCrypto.min) return false;
    if (amountNum > planLimitsInCrypto.max) return false;
    if (!selectedCurrency || selectedCurrency.balance < amountNum) return false;
    return true;
  };

  if (plansLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <div className="text-xl text-white">Loading investment plans...</div>
      </div>
    );
  }

  // Show error only after loading is complete and plan still not found
  if (!selectedPlan && !plansLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
        <button
          onClick={() => router.push('/investments')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all"
        >
          Back to Investments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Steps Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                  transition-all duration-300
                  ${
                    currentStep === step
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : currentStep > step
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                      : 'bg-dark-800 text-dark-400 border-2 border-dark-700'
                  }
                `}
              >
                {currentStep > step ? '✓' : step}
              </div>
              <span className={`text-sm font-medium ${currentStep >= step ? 'text-white' : 'text-dark-400'}`}>
                {step === 1 ? 'Investment Details' : 'Summary & Confirm'}
              </span>
              {step < 2 && (
                <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-green-500/50' : 'bg-dark-700'}`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <div className="space-y-6">
                {/* Currency Selector - MOVED TO TOP */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-dark-900/50 border-2 border-dark-700 rounded-xl text-white hover:border-primary-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {selectedCurrency && selectedCurrency.icon && (
                          <Image
                            src={`/currency/${selectedCurrency.icon}`}
                            alt={selectedCurrency.symbol}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div className="text-left">
                          <div className="font-medium">{currency}</div>
                          <div className="text-xs text-dark-400">
                            {selectedCurrency?.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-dark-400">▼</span>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showCurrencyDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-2 bg-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-xl shadow-2xl overflow-hidden"
                        >
                          {availableCurrencies.map((curr: any) => (
                            <button
                              key={curr.symbol}
                              onClick={() => {
                                setCurrency(curr.symbol);
                                setAmount('');
                                setAmountUSD('');
                                setShowCurrencyDropdown(false);
                              }}
                              className={`
                                w-full flex items-center justify-between px-4 py-3 hover:bg-dark-800 transition-colors
                                ${curr.symbol === currency ? 'bg-primary-500/10' : ''}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                {curr.icon && (
                                  <Image
                                    src={`/currency/${curr.icon}`}
                                    alt={curr.symbol}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                  />
                                )}
                                <div className="text-left">
                                  <div className="font-medium text-white">{curr.symbol}</div>
                                  <div className="text-xs text-dark-400">{curr.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                  {formatNumber(curr.balance)} {curr.symbol}
                                </div>
                                <div className="text-xs text-dark-400">
                                  ≈ ${formatNumber(curr.usdValue)}
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Investment Amount - DUAL INPUTS */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Investment Amount
                  </label>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    {/* Crypto Amount Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder={`Min: ${formatCryptoAmount(planLimitsInCrypto.min, currency)}`}
                        className="w-full px-4 py-3 pr-24 bg-dark-900/50 border-2 border-dark-700 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-sm font-medium text-dark-400">{currency}</span>
                        <button
                          onClick={handleMaxClick}
                          className="px-3 py-1 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/50 rounded-lg text-xs font-bold text-primary-400 transition-colors"
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    {/* USD Amount Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={amountUSD}
                        onChange={(e) => handleAmountUSDChange(e.target.value)}
                        placeholder={`Min: ${selectedPlan.minAmount.toFixed(2)}`}
                        className="w-full px-4 py-3 pr-16 bg-dark-900/50 border-2 border-dark-700 rounded-xl text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="text-sm font-medium text-dark-400">USD</span>
                      </div>
                    </div>
                  </div>

                  {selectedCurrency && (
                    <div className="flex items-center justify-between text-xs text-dark-400">
                      <span>Available: {formatNumber(selectedCurrency.balance)} {currency}</span>
                      <span>Max: {formatCryptoAmount(planLimitsInCrypto.max, currency)} {currency}</span>
                    </div>
                  )}
                </div>

                {/* Compounding Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-white">
                        Compounding %
                      </label>
                      {/* Info Badge */}
                      <div className="relative inline-block">
                        <div
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                          className="flex items-center justify-center w-5 h-5 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/50 rounded-full cursor-help transition-colors"
                        >
                          <span className="text-xs font-bold text-primary-400">?</span>
                        </div>
                        {/* Tooltip */}
                        {showTooltip && (
                          <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl shadow-2xl z-50 pointer-events-none">
                            <div className="text-xs text-white leading-relaxed">
                              <strong>Compounding</strong> reinvests your profit back into the deposit automatically. Higher % = faster growth but less immediate income.
                              <br /><br />
                              You can <span className="text-primary-400 font-semibold">change this at any time</span> after activation.
                            </div>
                            {/* Arrow */}
                            <div className="absolute -top-2 left-4 w-4 h-4 bg-dark-900 border-l border-t border-dark-700 transform rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gradient">
                      {compounding}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={compounding}
                    onChange={(e) => setCompounding(Number(e.target.value))}
                    className="w-full h-2 bg-dark-800 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-gradient-to-r
                      [&::-webkit-slider-thumb]:from-primary-500
                      [&::-webkit-slider-thumb]:to-accent-500
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex items-center justify-between text-xs text-dark-400 mt-2">
                    <span>0% (All profit to balance)</span>
                    <span>100% (Full reinvest)</span>
                  </div>
                </div>

                {/* Profit Calculator */}
                <div className="border-t border-dark-700 pt-6">
                  <h3 className="text-sm font-bold text-white mb-4">Expected Profits</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-900/50 rounded-xl p-4">
                      <div className="text-xs text-dark-400 mb-1">Daily Profit</div>
                      <div className="text-2xl font-bold text-green-400">
                        +{formatCryptoAmount(calculations.daily, currency)} {currency}
                      </div>
                      <div className="text-xs text-dark-500 mt-1">
                        ≈ ${formatNumber(calculationsUSD.daily)}
                      </div>
                    </div>
                    <div className="bg-dark-900/50 rounded-xl p-4">
                      <div className="text-xs text-dark-400 mb-1">Weekly Profit</div>
                      <div className="text-2xl font-bold text-green-400">
                        +{formatCryptoAmount(calculations.weekly, currency)} {currency}
                      </div>
                      <div className="text-xs text-dark-500 mt-1">
                        ≈ ${formatNumber(calculationsUSD.weekly)}
                      </div>
                    </div>
                    <div className="bg-dark-900/50 rounded-xl p-4">
                      <div className="text-xs text-dark-400 mb-1">Monthly Profit</div>
                      <div className="text-2xl font-bold text-green-400">
                        +{formatCryptoAmount(calculations.monthly, currency)} {currency}
                      </div>
                      <div className="text-xs text-dark-500 mt-1">
                        ≈ ${formatNumber(calculationsUSD.monthly)}
                      </div>
                    </div>
                    <div className="bg-dark-900/50 rounded-xl p-4">
                      <div className="text-xs text-dark-400 mb-1">Total ({selectedPlan.duration} days)</div>
                      <div className="text-2xl font-bold text-gradient">
                        +{formatCryptoAmount(calculations.total, currency)} {currency}
                      </div>
                      <div className="text-xs text-dark-500 mt-1">
                        ≈ ${formatNumber(calculationsUSD.total)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl font-semibold text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!validateStep1()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Review & Confirm →
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Investment Summary</h2>

                {/* Summary Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Plan</span>
                    <span className="text-white font-bold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Amount</span>
                    <span className="text-white font-bold">
                      {formatCryptoAmount(parseFloat(amount), currency)} {currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Total Return</span>
                    <span className="text-green-400 font-bold">{selectedPlan.returnRate}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Compounding %</span>
                    <span className="text-primary-400 font-bold">{compounding}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Investment Period</span>
                    <span className="text-white font-bold">{selectedPlan.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Expected Daily Profit</span>
                    <span className="text-green-400 font-bold">
                      +{formatCryptoAmount(calculations.daily, currency)} {currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-300">Expected Total Profit</span>
                    <span className="text-xl text-gradient font-bold">
                      +{formatCryptoAmount(calculations.total, currency)} {currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-dark-300">Total Amount (Profit + Deposited)</span>
                    <span className="text-xl text-green-400 font-bold">
                      {formatCryptoAmount(parseFloat(amount) + calculations.total, currency)} {currency}
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1 text-sm">
                      <div className="font-bold text-white mb-1">Important Notice</div>
                      <div className="text-dark-300">
                        By activating this investment, you agree to lock your funds for {selectedPlan.duration} days.
                        Make sure you understand the terms before proceeding.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl font-semibold text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleActivate}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Activating...' : '✓ Activate Investment'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={amount}
        currency={currency}
        planName={selectedPlan?.name}
      />
    </div>
  );
}

// Wrapper with Suspense boundary to satisfy Next.js 16 requirement
export default function CreateInvestmentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-dark-300">Loading...</div>
      </div>
    }>
      <CreateInvestmentPageContent />
    </Suspense>
  );
}
