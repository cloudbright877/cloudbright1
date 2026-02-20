'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/ui/Stepper';
import { selectBots, type QuizAnswers, type BotAllocation, type RiskProfile, type TimeHorizon } from '@/lib/quickStart';
import { StepAmount } from '@/components/dashboard-v2/quick-start/StepAmount';
import { StepRisk } from '@/components/dashboard-v2/quick-start/StepRisk';
import { StepResults } from '@/components/dashboard-v2/quick-start/StepResults';
import { botsApi } from '@/lib/api/botsApi';
import { getBalance } from '@/lib/balances';
import { getCurrentUserId } from '@/lib/getCurrentUserId';

type Step = 1 | 2 | 3;

const STEPS = [
  { label: 'Amount', description: 'Set budget' },
  { label: 'Risk', description: 'Pick profile' },
  { label: 'Portfolio', description: 'Review bots' },
];

// Risk profile implies time horizon
const RISK_TO_HORIZON: Record<RiskProfile, TimeHorizon> = {
  conservative: 'short',
  balanced: 'medium',
  aggressive: 'long',
};

export default function QuickStartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quiz answers
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);

  // Computed allocations
  const [allocations, setAllocations] = useState<BotAllocation[]>([]);

  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;
    getBalance(userId).then((b) => setUserBalance(b.available));
  }, []);

  const handleAmountSelect = (amount: number) => {
    setInvestmentAmount(amount);
  };

  const handleRiskSelect = (risk: RiskProfile) => {
    setRiskProfile(risk);
  };

  const handleNext = () => {
    if (step === 2 && investmentAmount && riskProfile) {
      // Compute allocations before moving to results
      const answers: QuizAnswers = {
        investmentAmount,
        riskProfile,
        timeHorizon: RISK_TO_HORIZON[riskProfile],
      };

      try {
        const computed = selectBots(answers);
        setAllocations(computed);
        setStep(3);
      } catch (error) {
        console.error('[QuickStart] Error selecting bots:', error);
        alert('Failed to select bots. Please try again.');
      }
    } else {
      setStep((prev) => Math.min(3, prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/dashboard-v2');
    } else {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      // Create bot copies
      for (const alloc of allocations) {
        await botsApi.createBotCopy(alloc.bot.id, alloc.amount);
      }

      // Show success message
      alert('Portfolio created! Redirecting...');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard-v2');
      }, 2000);
    } catch (error) {
      console.error('[QuickStart] Error creating portfolio:', error);
      alert('Failed to create portfolio. Please try again.');
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return investmentAmount !== null && investmentAmount > 0;
      case 2:
        return riskProfile !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-100 dark:bg-dark-950 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Stepper steps={STEPS} currentStep={step} />
        </motion.div>

        {/* Step Content */}
        <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4 sm:p-6 lg:p-8"
          >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StepAmount
                  userBalance={userBalance}
                  selectedAmount={investmentAmount}
                  onSelect={handleAmountSelect}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StepRisk
                  selectedRisk={riskProfile}
                  onSelect={handleRiskSelect}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StepResults
                  allocations={allocations}
                  totalAmount={investmentAmount || 0}
                  onConfirm={handleConfirm}
                  isProcessing={isProcessing}
                />
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="px-6 py-3 rounded-lg bg-gray-50 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-900 dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isProcessing}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-dark-700 dark:disabled:to-dark-700 text-white font-medium disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30"
            >
              {step === 2 ? 'See Results' : 'Next'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
