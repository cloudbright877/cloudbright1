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
import {
  getMasterBotsConfig,
  saveMasterBotConfig,
  clearMasterBotConfig,
} from '@/lib/masterBotsConfig';
import RangeSlider from '@/components/dashboard-v2/RangeSlider';

// Available trading pairs
const AVAILABLE_PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'MATIC/USDT'];

// Possible leverage values for array generation
const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 20, 25, 50, 75, 100, 125];

export default function AdminBotsPage() {
  const [bots, setBots] = useState<DemoBot[]>(DEMO_BOTS);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [editedConfig, setEditedConfig] = useState<any>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Load saved configs on mount
  useEffect(() => {
    const configOverrides = getMasterBotsConfig();
    if (configOverrides.size > 0) {
      setBots(prevBots =>
        prevBots.map(bot => {
          const override = configOverrides.get(bot.id);
          if (override) {
            return {
              ...bot,
              config: {
                ...bot.config,
                ...override,
              },
            };
          }
          return bot;
        })
      );
      console.log(`[AdminBots] Loaded ${configOverrides.size} config overrides from localStorage`);
    }
  }, []);

  const handleEdit = (bot: DemoBot) => {
    setEditingBot(bot.id);

    // Prepare config with proper format for editing
    const config = bot.config;

    // Convert leverages array to min/max or use single leverage
    let leverageMin = 3;
    let leverageMax = 10;
    if (config.leverages && config.leverages.length > 0) {
      leverageMin = Math.min(...config.leverages);
      leverageMax = Math.max(...config.leverages);
    } else if (config.leverage) {
      leverageMin = config.leverage;
      leverageMax = config.leverage;
    }

    // Get trading pairs (array or single)
    const selectedPairs = config.tradingPairs && config.tradingPairs.length > 0
      ? config.tradingPairs
      : [config.tradingPair];

    setEditedConfig({
      ...config,
      winRate: config.winRate * 100, // Convert to percentage
      leverageMin,
      leverageMax,
      selectedPairs,
    });
  };

  const handleSave = async (botId: string) => {
    if (!editedConfig) return;

    try {
      // Generate leverages array from min/max
      const leveragesArray = LEVERAGE_OPTIONS.filter(
        lev => lev >= editedConfig.leverageMin && lev <= editedConfig.leverageMax
      );

      // Convert config back to proper format
      const configToSave = {
        ...editedConfig,
        winRate: editedConfig.winRate / 100, // Convert percentage back to decimal
        leverages: leveragesArray.length > 1 ? leveragesArray : undefined,
        leverage: leveragesArray.length === 1 ? leveragesArray[0] : undefined,
        tradingPairs: editedConfig.selectedPairs.length > 1 ? editedConfig.selectedPairs : undefined,
        tradingPair: editedConfig.selectedPairs[0], // Keep primary pair for backward compat
      };

      // Remove temp fields
      delete configToSave.leverageMin;
      delete configToSave.leverageMax;
      delete configToSave.selectedPairs;

      // Save to localStorage for persistence
      saveMasterBotConfig(botId, configToSave);

      // Update the actual Master Bot instance if it exists
      const { botsApi } = await import('@/lib/api/botsApi');
      await botsApi.updateMasterBotConfig(botId, configToSave);

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
      setSavedMessage(`Bot ${botId} updated & saved!`);
      setTimeout(() => setSavedMessage(null), 3000);

      console.log(`[AdminBots] Bot ${botId} config saved:`, {
        leverages: leveragesArray,
        pairs: editedConfig.selectedPairs,
      });
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

  const handleReset = async (bot: DemoBot) => {
    const originalBot = DEMO_BOTS.find(b => b.id === bot.id);
    if (originalBot) {
      // Clear localStorage override
      clearMasterBotConfig(bot.id);

      // Update Master Bot instance if it exists
      const { botsApi } = await import('@/lib/api/botsApi');
      await botsApi.updateMasterBotConfig(bot.id, originalBot.config);

      // Update local state
      setBots(prevBots =>
        prevBots.map(b => b.id === bot.id ? originalBot : b)
      );

      setSavedMessage(`Bot ${bot.id} reset to defaults!`);
      setTimeout(() => setSavedMessage(null), 3000);
      console.log(`[AdminBots] Bot ${bot.id} reset to default config`);
    }
  };

  const updateField = (field: string, value: any) => {
    setEditedConfig((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePair = (pair: string) => {
    setEditedConfig((prev: any) => {
      const currentPairs = prev.selectedPairs || [];
      const newPairs = currentPairs.includes(pair)
        ? currentPairs.filter((p: string) => p !== pair)
        : [...currentPairs, pair];

      // Ensure at least one pair is selected
      return {
        ...prev,
        selectedPairs: newPairs.length > 0 ? newPairs : [pair]
      };
    });
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
            Configure win rates, P&L ranges, trade durations, leverage ranges, and trading pairs for master bots
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
        <div className="space-y-3">
          {bots.map((bot) => {
            const isEditing = editingBot === bot.id;
            const config = isEditing ? editedConfig : bot.config;

            // Display leverage info
            const leverageDisplay = (() => {
              if (isEditing) {
                return `${config.leverageMin}x - ${config.leverageMax}x`;
              }
              if (config.leverages && config.leverages.length > 0) {
                return `${Math.min(...config.leverages)}x - ${Math.max(...config.leverages)}x`;
              }
              return `${config.leverage || 5}x`;
            })();

            // Display trading pairs
            const pairsDisplay = (() => {
              if (isEditing) {
                return config.selectedPairs.join(', ');
              }
              if (config.tradingPairs && config.tradingPairs.length > 0) {
                return config.tradingPairs.join(', ');
              }
              return config.tradingPair;
            })();

            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={isEditing
                  ? "bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6"
                  : "bg-dark-800/50 border border-dark-700/50 rounded-lg p-3 hover:bg-dark-800/70 transition-colors"
                }
              >
                {/* Compact View (Not Editing) */}
                {!isEditing ? (
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Bot Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {bot.icon.startsWith('/') ? (
                        <img src={bot.icon} alt={bot.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="text-2xl">{bot.icon}</div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{bot.name}</h3>
                        <p className="text-xs text-dark-500">{bot.slug}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                        bot.risk === 'low'
                          ? 'bg-green-500/20 text-green-400'
                          : bot.risk === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {bot.risk.toUpperCase()}
                      </span>
                    </div>

                    {/* Middle: Key Stats */}
                    <div className="flex items-center gap-4 text-xs text-dark-300">
                      <div className="text-center">
                        <div className="text-[10px] text-dark-500 uppercase">WR</div>
                        <div className="font-semibold text-white">{(config.winRate * 100).toFixed(0)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-dark-500 uppercase">Target</div>
                        <div className="font-semibold text-green-400">{config.dailyTargetPercent}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-dark-500 uppercase">Leverage</div>
                        <div className="font-semibold text-purple-400">{leverageDisplay}</div>
                      </div>
                      <div className="text-center min-w-[120px]">
                        <div className="text-[10px] text-dark-500 uppercase">Pairs</div>
                        <div className="font-semibold text-blue-400 truncate">{pairsDisplay}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-dark-500 uppercase">Trades/Day</div>
                        <div className="font-semibold text-white">{config.tradesPerDay}</div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(bot)}
                        className="px-3 py-1.5 bg-primary-500/20 hover:bg-primary-500 text-primary-300 hover:text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleReset(bot)}
                        className="px-3 py-1.5 bg-dark-700/50 hover:bg-dark-600 text-dark-400 hover:text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-2 border-b border-dark-700/50">
                      <div className="flex items-center gap-3">
                        {bot.icon.startsWith('/') ? (
                        <img src={bot.icon} alt={bot.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="text-2xl">{bot.icon}</div>
                      )}
                        <div>
                          <h3 className="text-sm font-bold text-white">{bot.name}</h3>
                          <p className="text-xs text-dark-500">{bot.slug}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bot.risk === 'low'
                            ? 'bg-green-500/20 text-green-400'
                            : bot.risk === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {bot.risk.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(bot.id)}
                          className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Compact Configuration Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Row 1: Basic Settings */}
                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <label className="text-[10px] text-dark-500 uppercase mb-1 block">Win Rate (%)</label>
                        <input
                          type="number"
                          value={config.winRate}
                          onChange={(e) => updateField('winRate', parseFloat(e.target.value))}
                          step="0.1"
                          min="0"
                          max="100"
                          className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                        />
                      </div>

                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <label className="text-[10px] text-dark-500 uppercase mb-1 block">Daily Target (%)</label>
                        <input
                          type="number"
                          value={config.dailyTargetPercent}
                          onChange={(e) => updateField('dailyTargetPercent', parseFloat(e.target.value))}
                          step="0.1"
                          className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                        />
                      </div>

                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <label className="text-[10px] text-dark-500 uppercase mb-1 block">Trades Per Day</label>
                        <input
                          type="number"
                          value={config.tradesPerDay}
                          onChange={(e) => updateField('tradesPerDay', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                        />
                      </div>

                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <label className="text-[10px] text-dark-500 uppercase mb-1 block">Max Positions</label>
                        <input
                          type="number"
                          value={config.maxConcurrentPositions}
                          onChange={(e) => updateField('maxConcurrentPositions', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                        />
                      </div>

                      {/* Row 2: Leverage & Win P&L */}
                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <RangeSlider
                          min={1}
                          max={125}
                          step={1}
                          valueMin={config.leverageMin}
                          valueMax={config.leverageMax}
                          onChange={(min, max) => {
                            updateField('leverageMin', min);
                            updateField('leverageMax', max);
                          }}
                          label="Leverage Range"
                          unit="x"
                        />
                      </div>

                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <RangeSlider
                          min={0.1}
                          max={15}
                          step={0.1}
                          valueMin={config.winPnLMin}
                          valueMax={config.winPnLMax}
                          onChange={(min, max) => {
                            updateField('winPnLMin', min);
                            updateField('winPnLMax', max);
                          }}
                          label="Win Profit Range (per trade)"
                          unit="%"
                        />
                      </div>

                      {/* Row 3: Max Loss & Duration */}
                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <RangeSlider
                          min={0.1}
                          max={15}
                          step={0.1}
                          valueMin={config.lossPnLMin}
                          valueMax={config.lossPnLMax}
                          onChange={(min, max) => {
                            updateField('lossPnLMin', min);
                            updateField('lossPnLMax', max);
                          }}
                          label="Max Loss Range (per trade)"
                          unit="%"
                        />
                      </div>

                      <div className="p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <RangeSlider
                          min={5}
                          max={300}
                          step={5}
                          valueMin={config.minDuration / 1000}
                          valueMax={config.maxDuration / 1000}
                          onChange={(min, max) => {
                            updateField('minDuration', min * 1000);
                            updateField('maxDuration', max * 1000);
                          }}
                          label="Duration Range"
                          unit="s"
                        />
                      </div>

                      {/* Row 4: Position Size (full width) */}
                      <div className="col-span-2 p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <RangeSlider
                          min={100}
                          max={2000}
                          step={50}
                          valueMin={config.minPositionSize}
                          valueMax={config.maxPositionSize}
                          onChange={(min, max) => {
                            updateField('minPositionSize', min);
                            updateField('maxPositionSize', max);
                          }}
                          label="Position Size Range"
                          unit="$"
                        />
                      </div>

                      {/* Row 5: Trading Pairs */}
                      <div className="col-span-2 p-2 bg-dark-900/30 rounded border border-dark-700/50">
                        <label className="text-[10px] text-dark-500 uppercase mb-2 block">Trading Pairs</label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_PAIRS.map(pair => (
                            <label key={pair} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.selectedPairs.includes(pair)}
                                onChange={() => togglePair(pair)}
                                className="w-3 h-3 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                              />
                              <span className="text-xs text-white">{pair}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
