'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { selectBots, type QuizAnswers, type BotAllocation, type RiskProfile, type TimeHorizon } from '@/lib/quickStart';
import { StepAmount } from './quick-start/StepAmount';
import { StepRisk } from './quick-start/StepRisk';
import { StepHorizon } from './quick-start/StepHorizon';
import { StepResults } from './quick-start/StepResults';

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (allocations: BotAllocation[]) => Promise<void>;
  userBalance: number;
}

type Step = 1 | 2 | 3 | 4;

export function QuickStartModal({
  isOpen,
  onClose,
  onComplete,
  userBalance,
}: QuickStartModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quiz answers
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon | null>(null);

  // Computed allocations
  const [allocations, setAllocations] = useState<BotAllocation[]>([]);

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
      await onComplete(allocations);
    } catch (error) {
      console.error('[QuickStart] Error creating portfolio:', error);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      // Reset state
      setStep(1);
      setInvestmentAmount(null);
      setRiskProfile(null);
      setTimeHorizon(null);
      setAllocations([]);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Quick Start</h2>
            <p className="text-sm text-dark-400">Get started in 3 clicks</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 p-4 bg-dark-800/50">
          {[1, 2, 3, 4].map((dotStep) => (
            <div
              key={dotStep}
              className={`w-2 h-2 rounded-full transition-all ${
                dotStep === step
                  ? 'bg-primary-500 w-8'
                  : dotStep < step
                  ? 'bg-green-500'
                  : 'bg-dark-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
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
        </div>

        {/* Footer - Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between p-6 border-t border-dark-700">
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
          </div>
        )}
      </motion.div>
    </div>
  );
}
