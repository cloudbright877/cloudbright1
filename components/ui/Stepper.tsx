'use client';

import { motion } from 'framer-motion';

interface StepperProps {
  steps: {
    label: string;
    description?: string;
  }[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${
                    isCurrent
                      ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                      : 'bg-dark-800 border-2 border-dark-700 text-dark-400'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}

                {/* Animated ring for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-400"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-dark-500'
                  }`}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-dark-600 mt-0.5">{step.description}</div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="relative w-16 h-0.5 mb-8">
                {/* Background line */}
                <div className="absolute inset-0 bg-dark-700 rounded-full" />
                {/* Progress line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isCompleted ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
