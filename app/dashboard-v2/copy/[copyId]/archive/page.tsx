'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Archive, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { botsApi } from '@/lib/api/botsApi';
import { getUserCopy } from '@/lib/userCopies';
import { getUserCopyPnLBreakdown } from '@/lib/userCopyStats';
import {
  calculateEarlyExitFee,
  getDaysSinceCreation,
  getDaysRemainingInReservation,
} from '@/lib/capitalReservation';

export default function ArchiveBotPage() {
  const params = useParams();
  const router = useRouter();
  const copyId = params.copyId as string;

  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [earlyExitInfo, setEarlyExitInfo] = useState<{
    isEarlyExit: boolean;
    fee: number;
    penaltyRate: number;
    effectiveReturn: number;
    userReceives: number;
    daysRemaining: number;
    daysSince: number;
  } | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentPnL, setCurrentPnL] = useState(0);
  const [botName, setBotName] = useState('');
  const [previouslyCollected, setPreviouslyCollected] = useState(0);
  const [uncollectedProfit, setUncollectedProfit] = useState(0);

  useEffect(() => {
    loadCopyInfo();
  }, [copyId]);

  const loadCopyInfo = async () => {
    setLoading(true);
    try {
      const copy = getUserCopy(copyId);
      if (!copy) {
        console.error('Copy not found');
        router.push('/dashboard-v2');
        return;
      }

      const stats = await botsApi.getUserCopy(copyId);
      if (!stats) {
        console.error('Copy stats not found');
        router.push('/dashboard-v2');
        return;
      }

      const breakdown = getUserCopyPnLBreakdown(copyId);

      setInvestedAmount(copy.investedAmount);
      setCurrentPnL(stats.totalPnL);
      setBotName(stats.name || 'Bot');
      setPreviouslyCollected(copy.totalCollectedPnL || 0);
      setUncollectedProfit(breakdown ? Math.max(0, breakdown.realizedPnL - (copy.totalCollectedPnL || 0)) : 0);

      const daysSince = getDaysSinceCreation(copy.createdAt);
      const daysRemaining = getDaysRemainingInReservation(copy.createdAt, copy.reservationDays);

      // Early exit fee is on investedCapital only
      const exitResult = calculateEarlyExitFee(
        copy.investedAmount,
        0,
        daysSince,
        copy.reservationDays
      );

      setEarlyExitInfo({
        isEarlyExit: exitResult.isEarlyExit,
        fee: exitResult.fee,
        penaltyRate: exitResult.penaltyRate,
        effectiveReturn: exitResult.effectiveReturn,
        userReceives: exitResult.userReceives,
        daysRemaining,
        daysSince,
      });
    } catch (error) {
      console.error('Failed to load copy info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    // For early exit, require confirmation
    if (earlyExitInfo?.isEarlyExit && confirmText !== 'ARCHIVE') {
      alert('Please type "ARCHIVE" to confirm early exit with penalty');
      return;
    }

    setArchiving(true);
    try {
      const result = await botsApi.closeUserCopy(copyId);
      console.log('Copy closed:', result);

      // Success - redirect to dashboard
      router.push('/dashboard-v2');
    } catch (error) {
      console.error('Failed to close copy:', error);
      alert(`Failed to archive bot: ${error}`);
    } finally {
      setArchiving(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Calculate final amounts (new model: user gets 100% of profit)
  const earlyExitFee = earlyExitInfo?.fee || 0;
  const capitalReturn = Math.max(0, investedAmount - earlyExitFee);
  const creditedNow = capitalReturn + uncollectedProfit;
  const totalAllTime = creditedNow + previouslyCollected;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Back Link */}
        <Link
          href={`/dashboard-v2/copy/${copyId}`}
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Bot</span>
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 lg:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
              <Archive className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Archive Bot</h1>
              <p className="text-sm text-dark-400 mt-1">{botName}</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400">
              The bot will finish all current open trades before being archived.
              Your funds will be returned after all positions are closed.
            </p>
          </div>

          {/* Early Exit Warning */}
          {earlyExitInfo?.isEarlyExit ? (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-red-400 mb-2 text-base">
                    Capital Reservation: {earlyExitInfo.daysRemaining} days remaining
                  </div>
                  <div className="text-sm text-red-200/90 mb-3">
                    You are archiving this bot before the 30-day reservation period.
                    An early exit penalty will be applied to your capital.
                  </div>
                  <div className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                    <div className="text-center mb-2">
                      <div className="text-xs text-red-300/70 mb-1">Effective Return</div>
                      <div className="text-2xl font-bold text-red-400">
                        {earlyExitInfo.effectiveReturn >= 0 ? '+' : ''}
                        {earlyExitInfo.effectiveReturn.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-xs text-red-200/70 space-y-1 border-t border-red-500/20 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>Current P&L:</span>
                        <span className={currentPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {currentPnL >= 0 ? '+' : ''}${formatNumber(currentPnL)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Early Exit Fee ({(earlyExitInfo.penaltyRate * 100).toFixed(0)}%):</span>
                        <span className="text-red-400">-${formatNumber(earlyExitInfo.fee)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-green-400 mb-1">
                    Reservation Period Complete
                  </div>
                  <div className="text-sm text-green-200/80">
                    No early exit penalty will be applied. You can archive this bot at any time.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reservation Progress */}
          {earlyExitInfo && (
            <div className="mb-6 p-4 bg-dark-900/50 rounded-lg border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-400">Reservation Progress</span>
                <span className="text-sm font-semibold text-white">
                  Day {earlyExitInfo.daysSince} of 30
                </span>
              </div>
              <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(earlyExitInfo.daysSince / 30) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    earlyExitInfo.isEarlyExit ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="space-y-3 mb-6">
            {previouslyCollected > 0 && (
              <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
                <span className="text-dark-400">Previously collected (already on balance)</span>
                <span className="font-bold text-dark-300">
                  ${formatNumber(previouslyCollected)}
                </span>
              </div>
            )}

            {uncollectedProfit > 0 && (
              <div className="flex justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-green-300">Auto-collect remaining profit</span>
                <span className="font-bold text-green-400">
                  +${formatNumber(uncollectedProfit)}
                </span>
              </div>
            )}

            <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
              <span className="text-dark-400">Capital return</span>
              <span className="font-bold text-white">
                ${formatNumber(investedAmount)}
              </span>
            </div>

            {earlyExitInfo?.isEarlyExit && earlyExitFee > 0 && (
              <div className="flex justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <span className="text-red-300">
                  Early Exit Fee ({(earlyExitInfo.penaltyRate * 100).toFixed(0)}%)
                </span>
                <span className="font-bold text-red-400">
                  -${formatNumber(earlyExitFee)}
                </span>
              </div>
            )}

            <div className="border-t border-dark-700 my-2" />
          </div>

          {/* Credited Now */}
          <div className="mb-4 p-5 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-dark-400 mb-1">Credited to your balance now</div>
                <div className="text-3xl font-bold text-gradient">
                  ${formatNumber(creditedNow)}
                </div>
              </div>
              <DollarSign className="w-10 h-10 text-primary-400" />
            </div>
          </div>

          {/* Total all-time (info only) */}
          {previouslyCollected > 0 && (
            <div className="mb-6 p-3 bg-dark-800/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-dark-400">Total received all-time</span>
                <span className="text-sm font-bold text-white">${formatNumber(totalAllTime)}</span>
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="mb-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400/80">Referral bonuses are awarded by the platform and not deducted from your profit.</p>
          </div>

          {/* Confirmation Input (Early Exit Only) */}
          {earlyExitInfo?.isEarlyExit && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Type <span className="font-bold text-amber-400">ARCHIVE</span> to confirm early exit
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type ARCHIVE"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-amber-500 transition-colors"
                disabled={archiving}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              disabled={archiving}
              className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 disabled:bg-dark-900 border border-dark-700 rounded-lg text-white font-medium transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleArchive}
              disabled={archiving || (earlyExitInfo?.isEarlyExit && confirmText !== 'ARCHIVE')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-800 disabled:to-amber-900 rounded-lg text-white font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {archiving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Archiving...
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Archive Bot
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
