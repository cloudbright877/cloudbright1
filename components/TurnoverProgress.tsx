'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import {
  getTurnoverStats,
  getLevelStatuses,
  getAllTurnoverLevels,
  type TurnoverBonusLevel,
} from '@/lib/turnoverBonuses';

interface TurnoverProgressProps {
  userId: string;
  showAllLevels?: boolean;
}

export default function TurnoverProgress({
  userId,
  showAllLevels = false,
}: TurnoverProgressProps) {
  const [stats, setStats] = useState<any>(null);
  const [levelStatuses, setLevelStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState(false);

  useEffect(() => {
    loadData();

    // Refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadData = async () => {
    try {
      const [statsData, statusesData] = await Promise.all([
        getTurnoverStats(userId),
        getLevelStatuses(userId),
      ]);

      setStats(statsData);
      setLevelStatuses(statusesData);
    } catch (error) {
      console.error('Failed to load turnover data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatNumberDetailed = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="animate-pulse">
          <div className="h-6 bg-dark-700 rounded mb-4 w-32"></div>
          <div className="h-24 bg-dark-700 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-700 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!stats) return null;

  const { currentLevel, teamTurnover, totalBonusesEarned, nextLevel } = stats;

  // Show next 3 levels or all levels if expanded
  const visibleLevels = expandedLevels
    ? levelStatuses
    : levelStatuses.slice(0, Math.min(currentLevel || 0 + 3, 10));

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Turnover Bonuses</h3>
        <span className="text-2xl">🏆</span>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-dark-800/50 rounded-lg border border-primary-500/20">
          <div className="text-xs text-dark-400 mb-1">Team Turnover</div>
          <div className="text-xl font-bold text-white">
            {formatNumberDetailed(teamTurnover)}
          </div>
        </div>
        <div className="p-3 bg-dark-800/50 rounded-lg border border-secondary-500/20">
          <div className="text-xs text-dark-400 mb-1">Bonuses Earned</div>
          <div className="text-xl font-bold text-green-400">
            ${formatNumberDetailed(totalBonusesEarned)}
          </div>
        </div>
      </div>

      {/* Next Level Progress */}
      {nextLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm text-dark-300">Next Level:</span>
              <span className="text-lg font-bold text-white ml-2">
                Level {nextLevel.level}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-400">
                ${formatNumberDetailed(nextLevel.bonus)}
              </div>
              <div className="text-xs text-dark-400">Bonus Reward</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-dark-400 mb-1">
              <span>{formatNumber(nextLevel.currentTurnover)}</span>
              <span>{nextLevel.progress.toFixed(1)}%</span>
              <span>{formatNumber(nextLevel.threshold)}</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nextLevel.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
              />
            </div>
          </div>

          <div className="text-xs text-dark-400 text-center">
            ${formatNumberDetailed(nextLevel.threshold - nextLevel.currentTurnover)} more needed
          </div>
        </motion.div>
      )}

      {/* Level List */}
      <div className="space-y-2">
        {visibleLevels.map((level: any, index: number) => {
          const isClaimed = level.claimed;
          const isAchieved = level.achieved && !isClaimed;
          const isLocked = !level.achieved;

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border ${
                isClaimed
                  ? 'bg-green-500/10 border-green-500/30'
                  : isAchieved
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-dark-900/30 border-dark-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  <div className="text-2xl">
                    {isClaimed ? '✅' : isAchieved ? '⚡' : '🔒'}
                  </div>

                  {/* Level Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          isClaimed
                            ? 'bg-green-500/20 text-green-400'
                            : isAchieved
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-dark-700 text-dark-400'
                        }`}
                      >
                        Level {level.level}
                      </span>
                      {isClaimed && (
                        <span className="text-xs text-green-400">Claimed</span>
                      )}
                      {isAchieved && (
                        <span className="text-xs text-yellow-400">Ready!</span>
                      )}
                    </div>
                    <div className="text-xs text-dark-400">
                      Turnover: {formatNumber(level.threshold)}
                    </div>
                  </div>
                </div>

                {/* Bonus Amount */}
                <div
                  className={`text-lg font-bold ${
                    isClaimed
                      ? 'text-green-400'
                      : isAchieved
                      ? 'text-yellow-400'
                      : 'text-dark-500'
                  }`}
                >
                  ${formatNumberDetailed(level.bonus)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      {!showAllLevels && levelStatuses.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpandedLevels(!expandedLevels)}
            className="text-sm text-primary-400 hover:text-primary-300 font-medium"
          >
            {expandedLevels ? 'Show Less' : `Show All ${levelStatuses.length} Levels`} {expandedLevels ? '↑' : '↓'}
          </button>
        </div>
      )}
    </GlassCard>
  );
}
