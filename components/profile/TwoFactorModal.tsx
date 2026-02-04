'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  authenticatorData: {
    code: string;
    qrCode: string;
  };
  code: string;
  setCode: (code: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function TwoFactorModal({
  isOpen,
  onClose,
  authenticatorData,
  code,
  setCode,
  onSubmit,
  isLoading,
}: TwoFactorModalProps) {
  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(authenticatorData.code);
    toast.success('Code copied to clipboard!');
  };

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
        <h3 className="text-2xl font-bold text-white mb-4">Enable 2FA</h3>

        <div className="space-y-4">
          {/* QR Code */}
          <div className="bg-white rounded-xl p-4 flex items-center justify-center">
            <QRCodeSVG value={authenticatorData.qrCode} size={200} />
          </div>

          <div className="text-sm text-dark-300 text-center">
            Scan this QR code with Google Authenticator
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Or enter this code manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={authenticatorData.code}
                readOnly
                className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white font-mono text-sm"
              />
              <button
                onClick={handleCopySecret}
                className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 text-sm font-medium transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Verification Code Input */}
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

          {/* Action Buttons */}
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
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-bold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
