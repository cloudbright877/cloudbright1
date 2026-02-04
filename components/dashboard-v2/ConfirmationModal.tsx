'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  bulletPoints: string[];
  confirmText: string;
  confirmButtonClass?: string;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  bulletPoints,
  confirmText,
  confirmButtonClass = 'from-primary-500 to-accent-500',
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 ${
                isDangerous
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20'
                  : 'bg-gradient-to-r from-primary-500/20 to-accent-500/20'
              } blur-xl opacity-50`} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <div className="flex items-center gap-3">
                    {icon && (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        isDangerous
                          ? 'bg-red-500/20 border-red-500/30'
                          : 'bg-primary-500/20 border-primary-500/30'
                      }`}>
                        {icon}
                      </div>
                    )}
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Description */}
                  <p className="text-sm text-dark-300 leading-relaxed">
                    {description}
                  </p>

                  {/* Bullet Points */}
                  <div className={`p-4 rounded-xl border ${
                    isDangerous
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    {isDangerous && (
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <p className="text-sm font-semibold text-red-400">What happens:</p>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {bulletPoints.map((point, index) => (
                        <li key={index} className={`text-sm leading-relaxed flex items-start gap-2 ${
                          isDangerous ? 'text-red-400/90' : 'text-blue-400/90'
                        }`}>
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-dark-700">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg font-semibold text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="relative flex-1 group"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${confirmButtonClass} rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300`} />
                    <div className={`relative px-4 py-3 bg-gradient-to-r ${confirmButtonClass} rounded-lg font-semibold text-white shadow-lg`}>
                      {confirmText}
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
