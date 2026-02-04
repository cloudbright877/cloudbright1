'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: string;
  currency?: string;
  planName?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  amount,
  currency,
  planName
}: SuccessModalProps) {
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative max-w-md w-full"
          >
              {/* Glass Card with Gradient Glow */}
              <div
                className="relative bg-dark-900/95 backdrop-blur-xl border-2 border-primary-500/30 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Animated Glow Background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 rounded-full blur-[120px] animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 text-center">
                  {/* Image with Glow */}
                  <div className="relative mb-6">
                    {/* Animated glow behind image */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 -m-8 bg-gradient-to-r from-primary-500/40 via-accent-500/40 to-pink-500/40 rounded-full blur-3xl"
                    />

                    {/* Image */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        duration: 0.8,
                        delay: 0.2,
                      }}
                      className="relative mx-auto w-48 h-48"
                    >
                      <Image
                        src="/stats1.webp"
                        alt="Success"
                        width={192}
                        height={192}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        priority
                      />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-white mb-3"
                  >
                    Congratulations!
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-dark-300 mb-6 leading-relaxed"
                  >
                    Your investment plan has been successfully activated!
                  </motion.p>

                  {/* Investment Details */}
                  {amount && currency && planName && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-2xl"
                    >
                      <div className="text-sm text-dark-400 mb-2">Investment</div>
                      <div className="text-2xl font-bold text-gradient mb-1">
                        {amount} {currency}
                      </div>
                      <div className="text-sm text-dark-300">{planName}</div>
                    </motion.div>
                  )}

                  {/* Thank You Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-dark-400 mb-6"
                  >
                    Thank you for choosing our platform. Your journey to financial growth starts now!
                  </motion.p>

                  {/* Dashboard Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleDashboard}
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </motion.button>

                  {/* Close hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-xs text-dark-500 mt-4"
                  >
                    Press ESC to close
                  </motion.p>
                </div>
              </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
