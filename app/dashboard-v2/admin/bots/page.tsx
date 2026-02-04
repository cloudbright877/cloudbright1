'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  RotateCcw,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Shield,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { DEMO_BOTS, type DemoBot } from '@/lib/demoMarketplace';

export default function AdminBotsPage() {
  const [bots, setBots] = useState<DemoBot[]>(DEMO_BOTS);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [editedConfig, setEditedConfig] = useState<any>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleEdit = (bot: DemoBot) => {
    setEditingBot(bot.id);
    setEditedConfig({
      ...bot.config,
      winRate: bot.config.winRate * 100, // Convert to percentage
    });
  };

  const handleSave = async (botId: string) => {
    if (!editedConfig) return;

    try {
      // Convert config back to decimal format
      const configToSave = {
        ...editedConfig,
        winRate: editedConfig.winRate / 100, // Convert percentage back to decimal
      };

      // Update the actual Master Bot via botsApi
      const { botsApi } = await import('@/lib/api/botsApi');
      const success = await botsApi.updateMasterBotConfig(botId, configToSave);

      if (!success) {
        console.error('[AdminBots] Failed to update bot config');
        setSavedMessage(`Failed to update bot ${botId}`);
        setTimeout(() => setSavedMessage(null), 3000);
        return;
      }

      // Update local state to reflect changes
      setBots(prevBots =>
        prevBots.map(bot => {
          if (bot.id === botId) {
            return {
              ...bot,
              config: configToSave
            };
          }
          return bot;
        })
      );

      setEditingBot(null);
      setEditedConfig(null);
      setSavedMessage(`Bot ${botId} updated successfully!`);
      setTimeout(() => setSavedMessage(null), 3000);

      console.log(`[AdminBots] Bot ${botId} config updated:`, configToSave);
    } catch (error) {
      console.error('[AdminBots] Error saving bot config:', error);
      setSavedMessage(`Error updating bot ${botId}`);
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingBot(null);
    setEditedConfig(null);
  };

  const handleReset = (bot: DemoBot) => {
    const originalBot = DEMO_BOTS.find(b => b.id === bot.id);
    if (originalBot) {
      setBots(prevBots =>
        prevBots.map(b => b.id === bot.id ? originalBot : b)
      );
      setSavedMessage(`Bot ${bot.id} reset to defaults!`);
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  const updateField = (field: string, value: any) => {
    setEditedConfig((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary-400" />
            Master Bot Management
          </h1>
          <p className="text-dark-300">
            Configure win rates, P&L ranges, trade durations, and other parameters for master bots
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">{savedMessage}</span>
          </motion.div>
        )}

        {/* Bots List */}
        <div className="space-y-6">
          {bots.map((bot) => {
            const isEditing = editingBot === bot.id;
            const config = isEditing ? editedConfig : bot.config;

            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6"
              >
                {/* Bot Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-700">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{bot.icon}</div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{bot.name}</h2>
                      <p className="text-sm text-dark-400">{bot.slug}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      bot.risk === 'low'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : bot.risk === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {bot.risk.toUpperCase()} RISK
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => handleEdit(bot)}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleReset(bot)}
                          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSave(bot.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Win Rate */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Win Rate (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.winRate}
                        onChange={(e) => updateField('winRate', parseFloat(e.target.value))}
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{(config.winRate * 100).toFixed(1)}%</div>
                    )}
                  </div>

                  {/* Daily Target % */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Target className="w-4 h-4" />
                      Daily Target (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.dailyTargetPercent}
                        onChange={(e) => updateField('dailyTargetPercent', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-green-400">{config.dailyTargetPercent}%</div>
                    )}
                  </div>

                  {/* Trades Per Day */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Clock className="w-4 h-4" />
                      Trades Per Day
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.tradesPerDay}
                        onChange={(e) => updateField('tradesPerDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{config.tradesPerDay}</div>
                    )}
                  </div>

                  {/* Win P&L Min */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Win P&L Min (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.winPnLMin}
                        onChange={(e) => updateField('winPnLMin', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-green-400">{config.winPnLMin}%</div>
                    )}
                  </div>

                  {/* Win P&L Max */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Win P&L Max (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.winPnLMax}
                        onChange={(e) => updateField('winPnLMax', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-green-400">{config.winPnLMax}%</div>
                    )}
                  </div>

                  {/* Loss P&L Min */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Shield className="w-4 h-4" />
                      Loss P&L Min (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.lossPnLMin}
                        onChange={(e) => updateField('lossPnLMin', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-red-400">{config.lossPnLMin}%</div>
                    )}
                  </div>

                  {/* Loss P&L Max */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Shield className="w-4 h-4" />
                      Loss P&L Max (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.lossPnLMax}
                        onChange={(e) => updateField('lossPnLMax', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-red-400">{config.lossPnLMax}%</div>
                    )}
                  </div>

                  {/* Min Duration */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Clock className="w-4 h-4" />
                      Min Duration (sec)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.minDuration / 1000}
                        onChange={(e) => updateField('minDuration', parseInt(e.target.value) * 1000)}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{config.minDuration / 1000}s</div>
                    )}
                  </div>

                  {/* Max Duration */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Clock className="w-4 h-4" />
                      Max Duration (sec)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.maxDuration / 1000}
                        onChange={(e) => updateField('maxDuration', parseInt(e.target.value) * 1000)}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{config.maxDuration / 1000}s</div>
                    )}
                  </div>

                  {/* Max Concurrent Positions */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <Target className="w-4 h-4" />
                      Max Positions
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.maxConcurrentPositions}
                        onChange={(e) => updateField('maxConcurrentPositions', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{config.maxConcurrentPositions}</div>
                    )}
                  </div>

                  {/* Open Frequency */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Open Frequency
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.openFrequency}
                        onChange={(e) => updateField('openFrequency', parseFloat(e.target.value))}
                        step="0.1"
                        min="0"
                        max="1"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">{(config.openFrequency * 100).toFixed(0)}%</div>
                    )}
                  </div>

                  {/* Leverage */}
                  <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Leverage
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={config.leverage || 5}
                        onChange={(e) => updateField('leverage', parseInt(e.target.value))}
                        min="1"
                        max="125"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-purple-400">{config.leverage || 5}x</div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
