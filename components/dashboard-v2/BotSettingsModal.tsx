'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Target, DollarSign, Shield, Clock, Zap, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { BotConfig } from '@/lib/trading/types';
import type { TradingBot } from '@/lib/trading/TradingBot';

interface BotSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: TradingBot;
}

type TabType = 'trading' | 'positions' | 'risk';

export function BotSettingsModal({ isOpen, onClose, bot }: BotSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('trading');
  const config = bot.getConfig();

  // Trading Parameters
  const [leverage, setLeverage] = useState(config.leverage || 5);
  const [allowedSides, setAllowedSides] = useState<'LONG' | 'SHORT' | 'BOTH'>(config.allowedSides || 'BOTH');
  const [winRate, setWinRate] = useState(config.winRate * 100); // Convert to %
  const [dailyTarget, setDailyTarget] = useState(config.dailyTargetPercent);
  const [tradesPerDay, setTradesPerDay] = useState(config.tradesPerDay);

  // Position Management
  const [minPositionSize, setMinPositionSize] = useState(config.minPositionSize);
  const [maxPositionSize, setMaxPositionSize] = useState(config.maxPositionSize);
  const [maxConcurrentPositions, setMaxConcurrentPositions] = useState(config.maxConcurrentPositions);
  const [openFrequency, setOpenFrequency] = useState((config.openFrequency || 0.7) * 100); // Convert to %

  // Risk Management
  const [winPnLMin, setWinPnLMin] = useState(config.winPnLMin);
  const [winPnLMax, setWinPnLMax] = useState(config.winPnLMax);
  const [lossPnLMin, setLossPnLMin] = useState(config.lossPnLMin);
  const [lossPnLMax, setLossPnLMax] = useState(config.lossPnLMax);
  const [minDuration, setMinDuration] = useState(config.minDuration / 1000); // Convert to seconds
  const [maxDuration, setMaxDuration] = useState(config.maxDuration / 1000); // Convert to seconds
  const [maxSlippage, setMaxSlippage] = useState((config.maxSlippage || 0.5) * 100); // Convert to %

  const handleSave = () => {
    const updates: Partial<BotConfig> = {
      leverage,
      allowedSides,
      winRate: winRate / 100,
      dailyTargetPercent: dailyTarget,
      tradesPerDay,
      minPositionSize,
      maxPositionSize,
      maxConcurrentPositions,
      openFrequency: openFrequency / 100,
      winPnLMin,
      winPnLMax,
      lossPnLMin,
      lossPnLMax,
      minDuration: minDuration * 1000,
      maxDuration: maxDuration * 1000,
      maxSlippage: maxSlippage / 100,
    };

    bot.updateConfig(updates);
    onClose();
  };

  const tabs = [
    { id: 'trading' as TabType, label: 'Trading', icon: TrendingUp },
    { id: 'positions' as TabType, label: 'Positions', icon: Target },
    { id: 'risk' as TabType, label: 'Risk', icon: Shield },
  ];

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
              className="relative w-full max-w-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl opacity-50" />

              <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Bot Settings</h2>
                    <p className="text-sm text-dark-400">{config.name}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 px-6 pt-4 border-b border-dark-700">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-dark-700 text-white border-t border-x border-dark-600'
                          : 'text-dark-400 hover:text-white hover:bg-dark-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Trading Tab */}
                  {activeTab === 'trading' && (
                    <>
                      {/* Leverage */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Leverage</label>
                          <span className="text-xl font-bold text-primary-400">×{leverage}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="125"
                          value={leverage}
                          onChange={(e) => setLeverage(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>×1</span>
                          <span>×25</span>
                          <span>×50</span>
                          <span>×125</span>
                        </div>
                      </div>

                      {/* Allowed Sides */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">Allowed Sides</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['LONG', 'SHORT', 'BOTH'] as const).map((side) => (
                            <button
                              key={side}
                              onClick={() => setAllowedSides(side)}
                              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                allowedSides === side
                                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                                  : 'bg-dark-700 text-dark-400 hover:text-white hover:bg-dark-600'
                              }`}
                            >
                              {side}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Win Rate */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Win Rate Target</label>
                          <span className="text-xl font-bold text-green-400">{winRate.toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          step="0.5"
                          value={winRate}
                          onChange={(e) => setWinRate(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>50%</span>
                          <span>70%</span>
                          <span>95%</span>
                        </div>
                      </div>

                      {/* Daily Target */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Daily P&L Target</label>
                          <span className="text-xl font-bold text-accent-400">{dailyTarget.toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="20"
                          step="0.1"
                          value={dailyTarget}
                          onChange={(e) => setDailyTarget(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>0.5%</span>
                          <span>10%</span>
                          <span>20%</span>
                        </div>
                      </div>

                      {/* Trades Per Day */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Trades Per Day</label>
                          <span className="text-xl font-bold text-blue-400">{tradesPerDay}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={tradesPerDay}
                          onChange={(e) => setTradesPerDay(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>10</span>
                          <span>100</span>
                          <span>200</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Positions Tab */}
                  {activeTab === 'positions' && (
                    <>
                      {/* Position Size Range */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">Position Size Range</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Minimum</span>
                              <span className="text-sm font-bold text-white">${minPositionSize.toFixed(0)}</span>
                            </div>
                            <input
                              type="range"
                              min="100"
                              max="5000"
                              step="50"
                              value={minPositionSize}
                              onChange={(e) => setMinPositionSize(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Maximum</span>
                              <span className="text-sm font-bold text-white">${maxPositionSize.toFixed(0)}</span>
                            </div>
                            <input
                              type="range"
                              min="200"
                              max="50000"
                              step="100"
                              value={maxPositionSize}
                              onChange={(e) => setMaxPositionSize(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Max Concurrent Positions */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Max Concurrent Positions</label>
                          <span className="text-xl font-bold text-primary-400">{maxConcurrentPositions}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={maxConcurrentPositions}
                          onChange={(e) => setMaxConcurrentPositions(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>1</span>
                          <span>5</span>
                          <span>10</span>
                        </div>
                      </div>

                      {/* Open Frequency */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Open Frequency</label>
                          <span className="text-xl font-bold text-accent-400">{openFrequency.toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={openFrequency}
                          onChange={(e) => setOpenFrequency(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>10% Rare</span>
                          <span>50%</span>
                          <span>100% Always</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Risk Tab */}
                  {activeTab === 'risk' && (
                    <>
                      {/* Win P&L Range */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">Win P&L Range (%)</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Minimum Win</span>
                              <span className="text-sm font-bold text-green-400">+{winPnLMin.toFixed(2)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="5"
                              step="0.1"
                              value={winPnLMin}
                              onChange={(e) => setWinPnLMin(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Maximum Win</span>
                              <span className="text-sm font-bold text-green-400">+{winPnLMax.toFixed(2)}%</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="15"
                              step="0.1"
                              value={winPnLMax}
                              onChange={(e) => setWinPnLMax(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Loss P&L Range */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">Loss P&L Range (%)</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Minimum Loss</span>
                              <span className="text-sm font-bold text-red-400">{lossPnLMin.toFixed(2)}%</span>
                            </div>
                            <input
                              type="range"
                              min="-5"
                              max="-0.1"
                              step="0.1"
                              value={lossPnLMin}
                              onChange={(e) => setLossPnLMin(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Maximum Loss</span>
                              <span className="text-sm font-bold text-red-400">{lossPnLMax.toFixed(2)}%</span>
                            </div>
                            <input
                              type="range"
                              min="-15"
                              max="-1"
                              step="0.1"
                              value={lossPnLMax}
                              onChange={(e) => setLossPnLMax(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Duration Range */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">Duration Range (seconds)</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Minimum</span>
                              <span className="text-sm font-bold text-white">{minDuration}s</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="300"
                              step="5"
                              value={minDuration}
                              onChange={(e) => setMinDuration(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-dark-400">Maximum</span>
                              <span className="text-sm font-bold text-white">{maxDuration}s</span>
                            </div>
                            <input
                              type="range"
                              min="30"
                              max="600"
                              step="10"
                              value={maxDuration}
                              onChange={(e) => setMaxDuration(Number(e.target.value))}
                              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Max Slippage */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-white">Max Slippage</label>
                          <span className="text-xl font-bold text-yellow-400">{(maxSlippage / 100).toFixed(2)}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={maxSlippage}
                          onChange={(e) => setMaxSlippage(Number(e.target.value))}
                          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-2">
                          <span>0.1%</span>
                          <span>1%</span>
                          <span>2%</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Warning */}
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400 mb-1">Important Notice</p>
                      <p className="text-xs text-yellow-400/80">
                        Changes apply immediately to all future trades. Open positions maintain their existing parameters.
                      </p>
                    </div>
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
                    onClick={handleSave}
                    className="relative flex-1 group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
                    <div className="relative px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white shadow-lg">
                      Save Changes
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
