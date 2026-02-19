'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Archive, CheckCircle, DollarSign } from 'lucide-react';
import { botsApi } from '@/lib/api/botsApi';
import { getUserCopy } from '@/lib/userCopies';
import { isLockedIn } from '@/lib/capitalReservation';

export default function ArchiveBotPage() {
  const params = useParams();
  const router = useRouter();
  const copyId = params.copyId as string;

  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentPnL, setCurrentPnL] = useState(0);
  const [botName, setBotName] = useState('');
  const [totalCredited, setTotalCredited] = useState(0);

  useEffect(() => {
    loadCopyInfo();
  }, [copyId]);

  const loadCopyInfo = async () => {
    setLoading(true);
    try {
      const copy = getUserCopy(copyId);
      if (!copy) {
        router.push('/dashboard-v2');
        return;
      }

      // If still locked in, redirect back — shouldn't be on this page
      if (isLockedIn(copy.createdAt, copy.reservationDays)) {
        router.push(`/dashboard-v2/copy/${copyId}`);
        return;
      }

      const stats = await botsApi.getUserCopy(copyId);
      if (!stats) {
        router.push('/dashboard-v2');
        return;
      }

      setInvestedAmount(copy.investedAmount);
      setCurrentPnL(stats.totalPnL);
      setBotName(stats.name || 'Bot');
      setTotalCredited(copy.totalCollectedPnL || 0);
    } catch (error) {
      console.error('Failed to load copy info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await botsApi.closeUserCopy(copyId);
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
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Deactivate Bot</h1>
              <p className="text-sm text-dark-400 mt-1">{botName}</p>
            </div>
          </div>

          {/* Reservation Complete */}
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-green-400 mb-1">
                  Capital Reservation Complete
                </div>
                <div className="text-sm text-green-200/80">
                  The lock-in period has ended. You can deactivate this bot and receive your full capital back.
                </div>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400">
              The bot will stop trading. Your invested capital will be returned in full to your available balance.
            </p>
          </div>

          {/* Financial Summary */}
          <div className="space-y-3 mb-6">
            {totalCredited > 0 && (
              <div className="flex justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-green-300">Profit auto-credited to balance</span>
                <span className="font-bold text-green-400">
                  +${formatNumber(totalCredited)}
                </span>
              </div>
            )}

            <div className="flex justify-between p-3 bg-dark-800/50 rounded-lg">
              <span className="text-dark-400">Invested capital</span>
              <span className="font-bold text-white">
                ${formatNumber(investedAmount)}
              </span>
            </div>

            <div className="border-t border-dark-700 my-2" />
          </div>

          {/* Capital Return */}
          <div className="mb-6 p-5 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-dark-400 mb-1">Capital returned to balance</div>
                <div className="text-3xl font-bold text-gradient">
                  ${formatNumber(investedAmount)}
                </div>
              </div>
              <DollarSign className="w-10 h-10 text-primary-400" />
            </div>
          </div>

          {/* Info note */}
          <div className="mb-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400/80">Profit from closed trades was automatically credited to your balance throughout the copy period.</p>
          </div>

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
              disabled={archiving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-800 disabled:to-amber-900 rounded-lg text-white font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {archiving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Deactivate Bot
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
