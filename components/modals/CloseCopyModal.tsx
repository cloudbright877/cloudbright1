'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateExpectedCommissions } from '@/lib/referralCommissions';
import { botsApi } from '@/lib/api/botsApi';

interface CloseCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  copyId: string;
  investorUserId: string;
  investedAmount: number;
  currentPnL: number;
  onSuccess?: () => void;
}

export default function CloseCopyModal({
  isOpen,
  onClose,
  copyId,
  investorUserId,
  investedAmount,
  currentPnL,
  onSuccess,
}: CloseCopyModalProps) {
  const [commissionBreakdown, setCommissionBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen && currentPnL > 0) {
      loadCommissionBreakdown();
    }
  }, [isOpen, investorUserId, currentPnL]);

  const loadCommissionBreakdown = async () => {
    setLoading(true);
    try {
      const breakdown = await calculateExpectedCommissions(investorUserId, currentPnL);
      setCommissionBreakdown(breakdown);
    } catch (error) {
      console.error('Failed to load commission breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      const result = await botsApi.closeUserCopy(copyId);
      console.log('Copy closed:', result);

      // Success - call callback and close modal
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to close copy:', error);
      alert(`Failed to close copy: ${error}`);
    } finally {
      setClosing(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const finalValue = investedAmount + currentPnL;
  const totalCommissions = commissionBreakdown.reduce((sum, c) => sum + c.amount, 0);
  const investorReceives = finalValue - totalCommissions;

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
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-dark-900 border-2 border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Close Copy</h3>
                <button
                  onClick={onClose}
                  className="text-dark-400 hover:text-white text-2xl leading-none"
                  disabled={closing}
                >
                  ×
                </button>
              </div>

              {/* Warning */}
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-bold text-yellow-400 mb-1">
                      Are you sure?
                    </div>
                    <div className="text-sm text-yellow-200/80">
                      Closing this copy will stop all trading and return your balance.
                      This action cannot be undone.
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
                  <span className="text-dark-400">Principal Invested</span>
                  <span className="font-bold text-white">
                    ${formatNumber(investedAmount)}
                  </span>
                </div>

                <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
                  <span className="text-dark-400">Current P&L</span>
                  <span
                    className={`font-bold ${
                      currentPnL >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {currentPnL >= 0 ? '+' : ''}${formatNumber(currentPnL)}
                  </span>
                </div>

                <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
                  <span className="text-dark-400">Total Value</span>
                  <span className="font-bold text-white">
                    ${formatNumber(finalValue)}
                  </span>
                </div>
              </div>

              {/* Commission Breakdown (only if profitable) */}
              {currentPnL > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">
                      Referral Commissions
                    </h4>
                    <span className="text-xs text-dark-400">
                      {commissionBreakdown.length} levels
                    </span>
                  </div>

                  {loading ? (
                    <div className="text-center py-4 text-dark-400">
                      <div className="animate-spin text-2xl mb-2">⏳</div>
                      <div className="text-sm">Calculating...</div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {commissionBreakdown.map((commission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-dark-800/30 rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-dark-700 rounded text-dark-400">
                              L{commission.level}
                            </span>
                            <span className="text-dark-400">
                              {commission.upline?.username || 'Unknown'}
                            </span>
                            <span className="text-dark-500">
                              ({(commission.rate * 100).toFixed(0)}%)
                            </span>
                          </div>
                          <span className="text-yellow-400 font-medium">
                            -${formatNumber(commission.amount)}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between p-2 bg-yellow-500/10 rounded font-bold text-sm">
                        <span className="text-white">Total Commissions</span>
                        <span className="text-yellow-400">
                          -${formatNumber(totalCommissions)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Final Amount */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-dark-400 mb-1">
                      You will receive
                    </div>
                    <div className="text-3xl font-bold text-gradient">
                      ${formatNumber(investorReceives)}
                    </div>
                  </div>
                  <span className="text-4xl">💰</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={closing}
                  className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 disabled:bg-dark-900 border border-dark-700 rounded-lg text-white font-medium transition-colors disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClose}
                  disabled={closing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-800 disabled:to-red-900 rounded-lg text-white font-medium transition-all disabled:cursor-not-allowed"
                >
                  {closing ? 'Closing...' : 'Close Copy'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
