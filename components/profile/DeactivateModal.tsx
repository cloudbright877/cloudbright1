'use client';

import { motion } from 'framer-motion';

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (code: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function DeactivateModal({
  isOpen,
  onClose,
  code,
  setCode,
  onSubmit,
  isLoading,
}: DeactivateModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !isLoading && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-900 border-2 border-dark-700 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Deactivate 2FA</h3>

        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="text-sm text-red-200">
              ⚠️ Warning: Disabling 2FA will make your account less secure. Please enter your
              current 2FA code to confirm.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Enter 6-digit code from your app:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white text-center text-2xl font-mono focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl font-semibold text-dark-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading || code.length !== 6}
              className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl font-semibold text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Deactivate'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
