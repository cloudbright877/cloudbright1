/**
 * Risk Metrics Preview Component
 *
 * Shows real-time prediction of trading outcomes based on bot configuration:
 * - Expected Win Rate (after Market Friction impact)
 * - Expected Loss Rate
 * - Expected Net P&L per trade
 * - Risk/Reward Ratio
 *
 * Updates live as user changes settings in Bot Admin Edit.
 */

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface RiskMetricsPreviewProps {
  config: {
    winRate: number;              // Base win rate (0-100)
    winPnLMin: number;            // Min win %
    winPnLMax: number;            // Max win %
    lossPnLMin: number;           // Min loss %
    lossPnLMax: number;           // Max loss %
    dailyTargetPercent: number;   // Daily target %
    tradesPerDay: number;         // Trades per day
    leverageMin?: number;         // Min leverage
    leverageMax?: number;         // Max leverage
    marketFriction?: {
      enabled: boolean;
      forceVolatility?: 'auto' | 'low' | 'medium' | 'high';
    };
    pnlVariance?: {
      tightModePercent: number;   // % of trades in tight mode
    };
  };
}

interface CalculatedMetrics {
  baseWinRate: number;           // Original win rate (%)
  marketFrictionCost: number;    // Avg friction cost per trade (%)
  netAvgWin: number;             // Avg win after friction (%)
  netAvgLoss: number;            // Avg loss (%)
  winsBecomingLosses: number;    // % of wins that become losses due to friction
  finalWinRate: number;          // Actual win rate after friction (%)
  finalLossRate: number;         // Actual loss rate after friction (%)
  expectedNetPnLPerTrade: number;// Expected P&L per trade (%)
  riskRewardRatio: number;       // R:R ratio
  expectedDailyPnL: number;      // Expected daily P&L (%)
  profitProbability: 'High' | 'Medium' | 'Low' | 'Negative'; // Overall assessment
}

export default function RiskMetricsPreview({ config }: RiskMetricsPreviewProps) {
  const metrics = calculateMetrics(config);

  // Color coding based on profit probability
  const getProbabilityColor = (prob: string) => {
    switch (prob) {
      case 'High': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Negative': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-dark-400 bg-dark-800/30 border-dark-700/50';
    }
  };

  return (
    <div className="mb-4 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Expected Trading Outcomes
          </h3>
          <p className="text-[10px] text-dark-400 mt-0.5">
            Live prediction based on current settings
          </p>
        </div>
        <div className={`px-3 py-1 rounded border ${getProbabilityColor(metrics.profitProbability)}`}>
          <span className="text-xs font-bold">{metrics.profitProbability} Profit Probability</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Win Rate */}
        <div className="p-3 bg-dark-900/50 rounded border border-dark-700/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-dark-500 uppercase">Win Rate</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {metrics.finalWinRate.toFixed(1)}%
              </span>
              {metrics.winsBecomingLosses > 0 && (
                <span className="text-[10px] text-red-400">
                  (-{metrics.winsBecomingLosses.toFixed(1)}%)
                </span>
              )}
            </div>
            {metrics.winsBecomingLosses > 0 && (
              <div className="text-[9px] text-dark-500">
                Base: {metrics.baseWinRate.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Loss Rate */}
        <div className="p-3 bg-dark-900/50 rounded border border-dark-700/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-dark-500 uppercase">Loss Rate</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {metrics.finalLossRate.toFixed(1)}%
              </span>
              {metrics.winsBecomingLosses > 0 && (
                <span className="text-[10px] text-orange-400">
                  (+{metrics.winsBecomingLosses.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Net P&L per Trade */}
        <div className="p-3 bg-dark-900/50 rounded border border-dark-700/50">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-dark-500 uppercase">Net P&L/Trade</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${
                metrics.expectedNetPnLPerTrade > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.expectedNetPnLPerTrade > 0 ? '+' : ''}{metrics.expectedNetPnLPerTrade.toFixed(2)}%
              </span>
            </div>
            {config.marketFriction?.enabled && (
              <div className="text-[9px] text-orange-400">
                Friction: -{metrics.marketFrictionCost.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {/* R:R Ratio */}
        <div className="p-3 bg-dark-900/50 rounded border border-dark-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-dark-500 uppercase">R:R Ratio</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${
                metrics.riskRewardRatio >= 1.5 ? 'text-green-400' :
                metrics.riskRewardRatio >= 1.0 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                1:{metrics.riskRewardRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-3 p-2 bg-dark-900/30 rounded border border-dark-700/30">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-dark-500">Avg Win (gross):</span>
            <span className="text-green-400 font-semibold">
              +{(metrics.netAvgWin + metrics.marketFrictionCost).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Expected Daily P&L:</span>
            <span className={`font-semibold ${
              metrics.expectedDailyPnL > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.expectedDailyPnL > 0 ? '+' : ''}{metrics.expectedDailyPnL.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Avg Win (net):</span>
            <span className={`font-semibold ${
              metrics.netAvgWin > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.netAvgWin > 0 ? '+' : ''}{metrics.netAvgWin.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Daily Target:</span>
            <span className="text-blue-400 font-semibold">
              {config.dailyTargetPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Avg Loss:</span>
            <span className="text-red-400 font-semibold">
              -{metrics.netAvgLoss.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Deviation:</span>
            <span className={`font-semibold ${
              Math.abs(metrics.expectedDailyPnL - config.dailyTargetPercent) < config.dailyTargetPercent * 0.1
                ? 'text-green-400'
                : 'text-yellow-400'
            }`}>
              {(metrics.expectedDailyPnL - config.dailyTargetPercent) > 0 ? '+' : ''}
              {(metrics.expectedDailyPnL - config.dailyTargetPercent).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {metrics.profitProbability === 'Negative' && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400">
          ⚠️ <strong>WARNING:</strong> Current settings will likely result in losses.
          {config.marketFriction?.enabled && metrics.netAvgWin < 0.1 && (
            <> Market Friction is too high for your P&L ranges. Increase Win P&L or disable Market Friction.</>
          )}
        </div>
      )}

      {metrics.profitProbability === 'Low' && (
        <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] text-orange-400">
          ⚠️ <strong>CAUTION:</strong> Low profit probability. Consider increasing Win Rate or Win P&L ranges.
        </div>
      )}
    </div>
  );
}

/**
 * Calculate all metrics based on current configuration
 * Uses DynamicPnLCalculator to simulate real bot behavior
 */
function calculateMetrics(config: RiskMetricsPreviewProps['config']): CalculatedMetrics {
  // Import DynamicPnLCalculator logic inline (simplified)
  // This matches what TradingBot.ts actually uses!

  const baseWinRate = config.winRate; // Already in % (0-100)

  // Calculate leverage range
  const leverageMin = config.leverageMin ?? 3;
  const leverageMax = config.leverageMax ?? 10;
  const avgLeverage = (leverageMin + leverageMax) / 2;

  // Calculate market friction cost
  let marketFrictionCost = 0;
  if (config.marketFriction?.enabled) {
    const volatility = config.marketFriction.forceVolatility ?? 'medium';
    marketFrictionCost = volatility === 'low' ? 0.15
      : volatility === 'high' ? 0.5
      : 0.3; // medium or auto
  }

  // STEP 1: Calculate base P&L using DynamicPnLCalculator formula
  // Formula: baseWinPnL = (dailyTarget / tradesPerDay / winRate) / avgLeverage
  const baseWinPnLPercent = (config.dailyTargetPercent / config.tradesPerDay / (config.winRate / 100)) / avgLeverage;

  // Calculate base loss P&L (using risk-reward ratio)
  const asymmetryFactor = 0.7;
  const baseLossPnLPercent = baseWinPnLPercent * ((config.winRate / 100) / (1 - config.winRate / 100)) * asymmetryFactor;

  // STEP 2: Simulate variance (tight/wide mode distribution)
  const tightModePercent = config.pnlVariance?.tightModePercent ?? 80;

  // Simulate 100 trades to get realistic averages
  let totalWinPnL = 0;
  let totalLossPnL = 0;
  let winCount = 0;
  let lossCount = 0;

  const SIMULATION_TRADES = 100;

  for (let i = 0; i < SIMULATION_TRADES; i++) {
    const isTightMode = (i / SIMULATION_TRADES) < (tightModePercent / 100);
    const shouldWin = (i / SIMULATION_TRADES) < (config.winRate / 100);

    let winMin: number, winMax: number, lossMin: number, lossMax: number;

    if (isTightMode) {
      // Tight mode: ±30% variance
      const winVariance = 0.3;
      winMin = baseWinPnLPercent * (1 - winVariance);
      winMax = baseWinPnLPercent * (1 + winVariance);

      const lossVariance = 0.3;
      lossMin = baseLossPnLPercent * (1 - lossVariance);
      lossMax = baseLossPnLPercent * (1 + lossVariance);
    } else {
      // Wide mode: 2x-4x variance
      const randomMultiplier = 2.0 + Math.random() * 2.0; // 2-4x
      winMin = baseWinPnLPercent * 0.8;
      winMax = baseWinPnLPercent * randomMultiplier;

      lossMin = baseLossPnLPercent * 0.6;
      lossMax = baseLossPnLPercent * (1 + (randomMultiplier - 1) * 0.5);
    }

    if (shouldWin) {
      const winPnL = winMin + Math.random() * (winMax - winMin);
      totalWinPnL += winPnL;
      winCount++;
    } else {
      const lossPnL = lossMin + Math.random() * (lossMax - lossMin);
      totalLossPnL += lossPnL;
      lossCount++;
    }
  }

  const avgWinGross = winCount > 0 ? totalWinPnL / winCount : 0;
  const avgLoss = lossCount > 0 ? totalLossPnL / lossCount : 0;

  // STEP 3: Apply market friction
  const netAvgWin = avgWinGross - marketFrictionCost;
  const netAvgLoss = avgLoss;

  // STEP 4: Calculate how many wins become losses due to friction
  let winsBecomingLosses = 0;
  if (config.marketFriction?.enabled && netAvgWin < 0.1) {
    if (netAvgWin <= 0) {
      winsBecomingLosses = baseWinRate * 0.7; // 70% of wins become losses
    } else {
      const affectRatio = 1 - (netAvgWin / 0.1);
      winsBecomingLosses = baseWinRate * affectRatio * 0.5;
    }
  }

  // STEP 5: Final win/loss rate
  const finalWinRate = Math.max(0, baseWinRate - winsBecomingLosses);
  const finalLossRate = 100 - finalWinRate;

  // STEP 6: Expected net P&L per trade
  const expectedNetPnLPerTrade =
    (finalWinRate / 100 * netAvgWin) - (finalLossRate / 100 * netAvgLoss);

  // STEP 7: Risk/Reward ratio
  const riskRewardRatio = netAvgWin > 0 ? netAvgWin / netAvgLoss : 0;

  // STEP 8: Expected daily P&L
  const expectedDailyPnL = expectedNetPnLPerTrade * config.tradesPerDay;

  // STEP 9: Profit probability assessment
  let profitProbability: 'High' | 'Medium' | 'Low' | 'Negative';
  if (expectedNetPnLPerTrade < 0 || expectedDailyPnL < 0) {
    profitProbability = 'Negative';
  } else if (finalWinRate >= 50 && riskRewardRatio >= 1.2 && expectedDailyPnL >= config.dailyTargetPercent * 0.8) {
    profitProbability = 'High';
  } else if (finalWinRate >= 40 && riskRewardRatio >= 0.8) {
    profitProbability = 'Medium';
  } else {
    profitProbability = 'Low';
  }

  return {
    baseWinRate,
    marketFrictionCost,
    netAvgWin,
    netAvgLoss,
    winsBecomingLosses,
    finalWinRate,
    finalLossRate,
    expectedNetPnLPerTrade,
    riskRewardRatio,
    expectedDailyPnL,
    profitProbability,
  };
}
