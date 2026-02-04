'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, Shield, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TestBotSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
  onSave: (newConfig: any) => void;
}

type TabType = 'trading' | 'positions' | 'risk';

export function TestBotSettingsModal({ isOpen, onClose, config, onSave }: TestBotSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('trading');

  // Initialize state from config
  const [winRate, setWinRate] = useState((config.WIN_RATE || 0.75) * 100);
  const [dailyTarget, setDailyTarget] = useState(config.TARGET_DAILY_PNL_PERCENT || 2);
  const [leverage, setLeverage] = useState(config.LEVERAGE || 5);
  const [minPositionSize, setMinPositionSize] = useState(config.MIN_POSITION_SIZE || 300);
  const [maxPositionSize, setMaxPositionSize] = useState(config.MAX_POSITION_SIZE || 700);
  const [maxPositions, setMaxPositions] = useState(config.MAX_CONCURRENT_POSITIONS || 3);
  const [winPnLMin, setWinPnLMin] = useState(config.WIN_PNL_MIN || 0.8);
  const [winPnLMax, setWinPnLMax] = useState(config.WIN_PNL_MAX || 1.8);
  const [lossPnLMin, setLossPnLMin] = useState(config.LOSS_PNL_MIN || 0.4);
  const [lossPnLMax, setLossPnLMax] = useState(config.LOSS_PNL_MAX || 0.9);

  // Sync state with config when modal opens or config changes
  useEffect(() => {
    if (isOpen) {
      setWinRate((config.WIN_RATE || 0.75) * 100);
      setDailyTarget(config.TARGET_DAILY_PNL_PERCENT || 2);
      setLeverage(config.LEVERAGE || 5);
      setMinPositionSize(config.MIN_POSITION_SIZE || 300);
      setMaxPositionSize(config.MAX_POSITION_SIZE || 700);
      setMaxPositions(config.MAX_CONCURRENT_POSITIONS || 3);
      setWinPnLMin(config.WIN_PNL_MIN || 0.8);
      setWinPnLMax(config.WIN_PNL_MAX || 1.8);
      setLossPnLMin(config.LOSS_PNL_MIN || 0.4);
      setLossPnLMax(config.LOSS_PNL_MAX || 0.9);
    }
  }, [isOpen, config]);

  const handleSave = () => {
    const updates = {
      ...config,
      WIN_RATE: winRate / 100,
      TARGET_DAILY_PNL_PERCENT: dailyTarget,
      LEVERAGE: leverage,
      MIN_POSITION_SIZE: minPositionSize,
      MAX_POSITION_SIZE: maxPositionSize,
      MAX_CONCURRENT_POSITIONS: maxPositions,
      WIN_PNL_MIN: winPnLMin,
      WIN_PNL_MAX: winPnLMax,
      LOSS_PNL_MIN: lossPnLMin,
      LOSS_PNL_MAX: lossPnLMax,
    };

    onSave(updates);
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

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl opacity-50" />

                <div className="relative flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-dark-700">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Bot Settings</h2>
                      <p className="text-sm text-dark-400">Configure trading parameters</p>
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Win Rate (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={winRate}
                              onChange={(e) => setWinRate(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-primary-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Daily P&L Target (%)</label>
                            <input
                              type="number"
                              min="-5"
                              max="20"
                              step="0.5"
                              value={dailyTarget}
                              onChange={(e) => setDailyTarget(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Leverage (×)</label>
                            <input
                              type="number"
                              min="1"
                              max="125"
                              value={leverage}
                              onChange={(e) => setLeverage(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-accent-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Positions Tab */}
                    {activeTab === 'positions' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Min Position Size ($)</label>
                            <input
                              type="number"
                              min="100"
                              max="5000"
                              step="50"
                              value={minPositionSize}
                              onChange={(e) => setMinPositionSize(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Max Position Size ($)</label>
                            <input
                              type="number"
                              min="200"
                              max="50000"
                              step="100"
                              value={maxPositionSize}
                              onChange={(e) => setMaxPositionSize(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Max Concurrent Positions</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={maxPositions}
                              onChange={(e) => setMaxPositions(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Risk Tab */}
                    {activeTab === 'risk' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Win P&L Min (%)</label>
                            <input
                              type="number"
                              min="0.1"
                              max="5"
                              step="0.1"
                              value={winPnLMin}
                              onChange={(e) => setWinPnLMin(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Win P&L Max (%)</label>
                            <input
                              type="number"
                              min="1"
                              max="15"
                              step="0.1"
                              value={winPnLMax}
                              onChange={(e) => setWinPnLMax(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Loss P&L Min (%)</label>
                            <input
                              type="number"
                              min="0.1"
                              max="5"
                              step="0.1"
                              value={lossPnLMin}
                              onChange={(e) => setLossPnLMin(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white mb-2 block">Loss P&L Max (%)</label>
                            <input
                              type="number"
                              min="0.5"
                              max="15"
                              step="0.1"
                              value={lossPnLMax}
                              onChange={(e) => setLossPnLMax(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                            />
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
                          Changes will close all open positions and reset trade history. New parameters apply to future trades.
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
                        Save & Apply
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
