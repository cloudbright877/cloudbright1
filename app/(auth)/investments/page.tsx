'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import InvestmentPlans from '@/components/investments/InvestmentPlans';
import InvestmentCountdown from '@/components/investments/InvestmentCountdown';
import SuccessModal from '@/components/investments/SuccessModal';
import GlassCard from '@/components/ui/GlassCard';
type Tab = 'create' | 'active' | 'history';

// Compounding Slider Component
function CompoundingSlider({
  investmentId,
  initialValue,
  onUpdate
}: {
  investmentId: number;
  initialValue: number;
  onUpdate: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-dark-400">Compounding %</span>
        <span className="text-sm font-bold text-primary-400">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(e) => handleSliderChange(parseInt(e.target.value))}
        className="
          w-full h-2 rounded-full appearance-none cursor-pointer
          bg-dark-900 hover:bg-dark-800
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gradient-to-r
          [&::-webkit-slider-thumb]:from-primary-500
          [&::-webkit-slider-thumb]:to-accent-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-gradient-to-r
          [&::-moz-range-thumb]:from-primary-500
          [&::-moz-range-thumb]:to-accent-500
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:transition-all
          [&::-moz-range-thumb]:hover:scale-110
          [&::-moz-range-thumb]:shadow-lg
        "
        style={{
          background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${value}%, rgb(17, 24, 39) ${value}%, rgb(17, 24, 39) 100%)`
        }}
      />
    </div>
  );
}


const activeInvestmentsData = [
  {
    id: 1,
    name: 'Professional Plan',
    amount: 15000,
    currency: 'USDT',
    return: '75.0',
    nextPayout: Date.now() + 3600000,
    totalProfit: 5625.00,
    lastProfit: 187.50,
    daysTotal: 30,
    daysElapsed: 15,
    progress: 50,
    compounding: 25,
  },
  {
    id: 2,
    name: 'Essential Plan',
    amount: 10000,
    currency: 'BTC',
    return: '60.0',
    nextPayout: Date.now() + 7200000,
    totalProfit: 2000.00,
    lastProfit: 200.00,
    daysTotal: 30,
    daysElapsed: 10,
    progress: 33,
    compounding: 50,
  },
  {
    id: 3,
    name: 'Ultimate Plan',
    amount: 15000,
    currency: 'ETH',
    return: '90.0',
    nextPayout: Date.now() + 1800000,
    totalProfit: 900.00,
    lastProfit: 450.00,
    daysTotal: 30,
    daysElapsed: 2,
    progress: 7,
    compounding: 0,
  },
];

const completedInvestmentsData = [
  {
    id: 4,
    name: 'Essential Plan',
    currency: 'USDT',
    return: '60.0',
    totalProfit: 3000.00,
    amount: 5000,
    startDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
    endDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 5,
    name: 'Professional Plan',
    currency: 'BTC',
    return: '75.0',
    totalProfit: 3750.00,
    amount: 5000,
    startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
    endDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
];

function InvestmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as Tab | null;

  // Use static data
  const active = activeInvestmentsData;
  const completed = completedInvestmentsData;
  const refresh = () => {}; // No-op function

  // Set default tab based on whether user has active plans
  const defaultTab: Tab = (active && active.length > 0) ? 'active' : 'create';
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || defaultTab);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: string;
    currency: string;
    planName: string;
  } | null>(null);

  // Check for success param from redirect
  useEffect(() => {
    const success = searchParams?.get('success');
    const amount = searchParams?.get('amount');
    const currency = searchParams?.get('currency');
    const planName = searchParams?.get('planName');

    if (success === 'true' && amount && currency && planName) {
      setSuccessData({ amount, currency, planName });
      setShowSuccessModal(true);
      // Clean URL params
      router.replace('/investments?tab=active');
    }
  }, [searchParams, router]);

  // Sync tab with URL param
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Update default tab when active plans load (only if user hasn't interacted)
  useEffect(() => {
    // Only update if there's no URL param, user hasn't interacted, and user has active plans
    if (!tabParam && !hasUserInteracted && active && active.length > 0 && activeTab === 'create') {
      setActiveTab('active');
    }
  }, [active, tabParam, activeTab, hasUserInteracted]);

  const handleSelectPlan = (planId: number) => {
    router.push(`/investments/create?plan=${planId}`);
  };

  // Simple formatting helpers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get gradient based on plan name or percent
  const getGradient = (index: number) => {
    const gradients = [
      'from-primary-500 to-accent-500',
      'from-accent-500 to-pink-500',
      'from-pink-500 to-purple-500',
      'from-purple-500 to-primary-500',
    ];
    return gradients[index % gradients.length];
  };

  // Reorder tabs based on whether user has active plans
  const tabs = (active && active.length > 0)
    ? [
        { id: 'active', label: 'Active Plans', icon: '💼', badge: active.length },
        { id: 'create', label: 'Create New', icon: '➕' },
        { id: 'history', label: 'History', icon: '📜' },
      ]
    : [
        { id: 'create', label: 'Create New', icon: '➕' },
        { id: 'active', label: 'Active Plans', icon: '💼', badge: active?.length || 0 },
        { id: 'history', label: 'History', icon: '📜' },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Investment Management
        </h1>
        <p className="text-dark-300">
          Create new investments or manage your active plans
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 p-2 bg-dark-900/50 backdrop-blur-sm rounded-2xl border-2 border-dark-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tab);
                setHasUserInteracted(true);
              }}
              className={`
                relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
                }
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Create New Tab */}
        {activeTab === 'create' && (
          <div>
            <InvestmentPlans onSelectPlan={handleSelectPlan} />
          </div>
        )}

        {/* Active Plans Tab */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {active.length > 0 ? (
              active.map((deposit: any, index: number) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard variant="glow" gradient={getGradient(index)}>
                    <div>
                      {/* Plan Info */}
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white">{deposit.name}</h3>
                              <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-xs font-semibold text-green-400">
                                Active
                              </span>
                            </div>
                            <div className="text-sm text-dark-300 flex items-center gap-2">
                              <span>{formatNumber(deposit.amount)} {deposit.currency} • {parseFloat(deposit.return).toFixed(1)}% Total</span>
                              <span className="text-dark-500">•</span>
                              <InvestmentCountdown nextdate={deposit.nextPayout} />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-dark-400 mb-1">Total Profit</div>
                            <div className="text-2xl font-bold text-green-400">
                              +{formatNumber(deposit.totalProfit)}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-dark-400 mb-2">
                            <span>Progress</span>
                            <span>
                              {deposit.daysElapsed}/{deposit.daysTotal} days
                            </span>
                          </div>
                          <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${deposit.progress}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className={`h-full bg-gradient-to-r ${getGradient(index)} rounded-full`}
                            />
                          </div>
                        </div>

                        {/* Stats Grid with Compounding on the Right */}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Left: Stats Grid (2x2) */}
                          <div className="col-span-2 grid grid-cols-2 gap-3">
                            <div className="bg-dark-900/50 rounded-lg p-3">
                              <div className="text-xs text-dark-400 mb-1">Investment</div>
                              <div className="text-sm font-bold text-white">
                                {formatNumber(deposit.amount)}
                              </div>
                            </div>
                            <div className="bg-dark-900/50 rounded-lg p-3">
                              <div className="text-xs text-dark-400 mb-1">Last Profit</div>
                              <div className="text-sm font-bold text-green-400">
                                +{formatNumber(deposit.lastProfit)}
                              </div>
                            </div>
                            <div className="bg-dark-900/50 rounded-lg p-3">
                              <div className="text-xs text-dark-400 mb-1">Days Left</div>
                              <div className="text-sm font-bold text-white">{deposit.daysTotal - deposit.daysElapsed}</div>
                            </div>
                            <div className="bg-dark-900/50 rounded-lg p-3">
                              <div className="text-xs text-dark-400 mb-1">Return</div>
                              <div className="text-sm font-bold text-accent-400">
                                {parseFloat(deposit.return).toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          {/* Right: Compounding Slider + Button */}
                          <div className="flex flex-col gap-3">
                            {/* Compounding Slider */}
                            <div className="bg-dark-900/50 rounded-lg p-3 flex-1">
                              <CompoundingSlider
                                investmentId={deposit.id}
                                initialValue={deposit.compounding}
                                onUpdate={() => refresh()}
                              />
                            </div>

                            {/* Action Button */}
                            <Link
                              href={`/transactions?tab=plan-id&id=${deposit.id}`}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-sm text-primary-400 transition-colors"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <GlassCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Active Investments</h3>
                  <p className="text-dark-300 mb-6">
                    Start earning passive income with our investment plans
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setHasUserInteracted(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all duration-300"
                  >
                    Create Investment
                  </button>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {completed.length > 0 ? (
              completed.map((deposit: any, index: number) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl">
                          ✓
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{deposit.name}</h3>
                            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-xs font-semibold text-green-400 capitalize">
                              Completed
                            </span>
                          </div>
                          <div className="text-sm text-dark-300 mb-2">
                            {formatNumber(deposit.amount)} {deposit.currency} • {parseFloat(deposit.return).toFixed(1)}% Total
                          </div>
                          <div className="text-xs text-dark-500">
                            {formatDate(deposit.startDate)} → {formatDate(deposit.endDate)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-dark-400 mb-1">Total Profit</div>
                        <div className="text-2xl font-bold text-green-400">
                          +{formatNumber(deposit.totalProfit)}
                        </div>
                        <div className="text-xs text-dark-500 mt-1">
                          Initial: ${formatNumber(deposit.amount)}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <GlassCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
                  <p className="text-dark-300">
                    Your completed investments will appear here
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </motion.div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={successData?.amount}
        currency={successData?.currency}
        planName={successData?.planName}
      />
    </div>
  );
}

// Wrapper with Suspense boundary to satisfy Next.js 16 requirement
export default function InvestmentsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-dark-300">Loading...</div>
      </div>
    }>
      <InvestmentsPageContent />
    </Suspense>
  );
}
