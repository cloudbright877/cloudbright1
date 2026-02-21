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
    <>
      {/* Mobile: 2-column grid, last item spans full width (visible < sm) */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLastOdd = index === steps.length - 1 && steps.length % 2 !== 0;

          return (
            <div
              key={index}
              className={`
                flex items-center gap-2 rounded-xl px-2 py-2 transition-all duration-300
                ${isLastOdd ? 'col-span-2' : ''}
                ${
                  isCurrent
                    ? 'bg-primary-500/10 border border-primary-500/30'
                    : isCompleted
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700'
                }
              `}
            >
              <motion.div
                initial={false}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={`
                  relative w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-[10px]
                  ${
                    isCurrent
                      ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-dark-700 text-gray-500 dark:text-dark-400'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-400"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </motion.div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-semibold truncate ${
                    isCurrent ? 'text-gray-900 dark:text-white' : isCompleted ? 'text-green-400' : 'text-gray-500 dark:text-dark-500'
                  }`}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-[10px] text-gray-500 dark:text-dark-600 truncate">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal flex with connectors (visible sm+) */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-300
                    ${
                      isCurrent
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 text-gray-900 dark:text-dark-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary-400"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-gray-900 dark:text-white' : isCompleted ? 'text-green-400' : 'text-gray-900 dark:text-dark-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 dark:text-dark-600 mt-0.5">{step.description}</div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="relative w-16 h-0.5 mb-8">
                  <div className="absolute inset-0 bg-gray-300 dark:bg-dark-700 rounded-full" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
