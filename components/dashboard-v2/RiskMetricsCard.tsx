'use client';

import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import type { Trade, Position } from '@/lib/trading/types';

interface RiskMetricsCardProps {
  trades: Trade[];
  positions: Position[];
}

export function RiskMetricsCard({ trades, positions }: RiskMetricsCardProps) {
  // Calculate average market friction from last 10 trades
  const recentTrades = trades.slice(0, 10);
  const avgFriction = recentTrades.length > 0
    ? recentTrades.reduce((sum, t) => sum + (t.marketFriction?.total || 0), 0) / recentTrades.length
    : 0;

  // Count P&L variance modes
  const tightCount = positions.filter(p => p.pnlRange?.mode === 'tight').length;
  const wideCount = positions.filter(p => p.pnlRange?.mode === 'wide').length;
  const totalModes = tightCount + wideCount;

  // Count scheduled closures
  const scheduledCount = positions.filter(p => p.scheduledCloseAt).length;

  // Get friction breakdown from last trade
  const lastTrade = trades[0];
  const friction = lastTrade?.marketFriction;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Risk Metrics</h3>
      </div>

      <div className="space-y-6">
        {/* Market Friction */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Market Friction (Avg Last 10)</span>
            <span className={`text-sm font-semibold ${avgFriction < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {avgFriction >= 0 ? '+' : ''}{avgFriction.toFixed(3)}%
            </span>
          </div>

          {/* Friction Bar */}
          <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${Math.min(Math.abs(avgFriction) * 100, 100)}%` }}
            />
          </div>

          {/* Friction Breakdown */}
          {friction && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <span className="text-gray-400">Slippage</span>
                <span className="text-red-400">{friction.slippage.toFixed(3)}%</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <span className="text-gray-400">Spread</span>
                <span className="text-red-400">{friction.spread.toFixed(3)}%</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <span className="text-gray-400">Funding</span>
                <span className={friction.fundingRate >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {friction.fundingRate >= 0 ? '+' : ''}{friction.fundingRate.toFixed(3)}%
                </span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <span className="text-gray-400">Commission</span>
                <span className="text-red-400">{friction.commission.toFixed(3)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* P&L Variance Mode */}
        {totalModes > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L Variance Distribution</span>
            </div>

            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">🟢 Tight</span>
                  <span className="text-xs text-green-400">{tightCount}/{totalModes}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(tightCount / totalModes) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">🔴 Wide</span>
                  <span className="text-xs text-orange-400">{wideCount}/{totalModes}</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${(wideCount / totalModes) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Target: 80% Tight / 20% Wide for realistic variance
            </p>
          </div>
        )}

        {/* Staggered Closing */}
        {positions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Staggered Closing</span>
              </div>
              <span className="text-sm font-semibold text-blue-400">
                {scheduledCount} scheduled
              </span>
            </div>

            {scheduledCount > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-300">
                  {scheduledCount} position{scheduledCount > 1 ? 's' : ''} queued for delayed closing to prevent simultaneous exits
                </p>
              </div>
            )}

            {scheduledCount === 0 && positions.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-300">
                  ✓ All positions can close immediately - no congestion
                </p>
              </div>
            )}
          </div>
        )}

        {/* System Status */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Risk Management</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
