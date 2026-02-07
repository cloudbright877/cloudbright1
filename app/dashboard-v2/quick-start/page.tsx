'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check } from 'lucide-react';
import { selectBots, type QuizAnswers, type BotAllocation, type RiskProfile, type TimeHorizon } from '@/lib/quickStart';
import { StepAmount } from '@/components/dashboard-v2/quick-start/StepAmount';
import { StepRisk } from '@/components/dashboard-v2/quick-start/StepRisk';
import { StepHorizon } from '@/components/dashboard-v2/quick-start/StepHorizon';
import { StepResults } from '@/components/dashboard-v2/quick-start/StepResults';
import { botsApi } from '@/lib/api/botsApi';

type Step = 1 | 2 | 3 | 4;

export default function QuickStartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quiz answers
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon | null>(null);

  // Computed allocations
  const [allocations, setAllocations] = useState<BotAllocation[]>([]);

  const userBalance = 10000; // TODO: Get from user profile

  const handleAmountSelect = (amount: number) => {
    setInvestmentAmount(amount);
  };

  const handleRiskSelect = (risk: RiskProfile) => {
    setRiskProfile(risk);
  };

  const handleHorizonSelect = (horizon: TimeHorizon) => {
    setTimeHorizon(horizon);
  };

  const handleNext = () => {
    if (step === 3 && investmentAmount && riskProfile && timeHorizon) {
      // Compute allocations before moving to results
      const answers: QuizAnswers = {
        investmentAmount,
        riskProfile,
        timeHorizon,
      };

      try {
        const computed = selectBots(answers);
        setAllocations(computed);
        setStep(4);
      } catch (error) {
        console.error('[QuickStart] Error selecting bots:', error);
        alert('Failed to select bots. Please try again.');
      }
    } else {
      setStep((prev) => Math.min(4, prev + 1) as Step);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1) as Step);
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
        return timeHorizon !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            href="/dashboard-v2"
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-dark-400 hover:text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Quick Start</h1>
            <p className="text-dark-300">Create your portfolio in 3 simple steps</p>
          </div>
        </motion.div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          {[1, 2, 3, 4].map((dotStep) => (
            <div key={dotStep} className="flex items-center">
              <div className="relative">
                {dotStep < step ? (
                  // Completed step - green check
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                ) : dotStep === step ? (
                  // Current step - primary gradient with pulse
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center animate-pulse">
                    <span className="text-white font-bold">{dotStep}</span>
                  </div>
                ) : (
                  // Future step - dark gray
                  <div className="w-10 h-10 rounded-full bg-dark-800 border-2 border-dark-700 flex items-center justify-center">
                    <span className="text-dark-500 font-bold">{dotStep}</span>
                  </div>
                )}
              </div>
              {dotStep < 4 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    dotStep < step ? 'bg-green-500' : 'bg-dark-700'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-8 mb-6"
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
                <StepHorizon
                  selectedHorizon={timeHorizon}
                  onSelect={handleHorizonSelect}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
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

        {/* Navigation */}
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={handleBack}
              disabled={step === 1 || isProcessing}
              className="px-6 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isProcessing}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-dark-700 disabled:to-dark-700 text-white font-medium disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30"
            >
              {step === 3 ? 'See Results' : 'Next'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
