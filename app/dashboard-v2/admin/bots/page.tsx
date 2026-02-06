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
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DEMO_BOTS, type DemoBot } from '@/lib/demoMarketplace';
import {
  getMasterBotsConfig,
  saveMasterBotConfig,
  clearMasterBotConfig,
} from '@/lib/masterBotsConfig';
import {
  mapPresetToConfig,
  validatePresetInput,
  type PresetInput
} from '@/lib/trading/convergence/PresetMapper';
import {
  validateBotConfig,
  getValidationSummary,
  type ValidationResult
} from '@/lib/trading/convergence/BotValidator';

// Available trading pairs
const AVAILABLE_PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'MATIC/USDT'];

export default function AdminBotsPage() {
  const [bots, setBots] = useState<DemoBot[]>(DEMO_BOTS);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [presetInput, setPresetInput] = useState<PresetInput | null>(null);
  const [selectedPairs, setSelectedPairs] = useState<string[]>(AVAILABLE_PAIRS.slice(0, 3));
  const [validation, setValidation] = useState<ValidationResult | null>(null);
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

  // Validate preset input whenever it changes
  useEffect(() => {
    if (presetInput) {
      const inputErrors = validatePresetInput(presetInput);
      if (inputErrors.length > 0) {
        setValidation({
          valid: false,
          issues: inputErrors,
          warnings: [],
          maxCorrectionPercent: 0
        });
      } else {
        // Generate config and validate it
        const generatedConfig = mapPresetToConfig(presetInput, {
          tradingPairs: selectedPairs,
          tradingPair: selectedPairs[0]
        });
        const result = validateBotConfig(generatedConfig);
        setValidation(result);
      }
    }
  }, [presetInput, selectedPairs]);

  const handleEdit = (bot: DemoBot) => {
    setEditingBot(bot.id);

    const config = bot.config;

    // Extract preset input from config (or use defaults)
    const preset: PresetInput = {
      dailyTarget: (config.dailyTargetPercent || 0.025) * 100, // Convert to percentage
      tradesPerDay: config.tradesPerDay || 250,
      character: config.character || 'moderate',
      convergenceMode: config.convergenceMode || 'guaranteed',
      realismMode: config.realismMode
    };

    // Get trading pairs
    const pairs = config.tradingPairs && config.tradingPairs.length > 0
      ? config.tradingPairs
      : [config.tradingPair || 'BTC/USDT'];

    setPresetInput(preset);
    setSelectedPairs(pairs);
  };

  const handleSave = async (botId: string) => {
    if (!presetInput || !validation || !validation.valid) {
      setSavedMessage(`Cannot save: configuration has errors`);
      setTimeout(() => setSavedMessage(null), 3000);
      return;
    }

    try {
      // Get the bot for name/capital
      const bot = bots.find(b => b.id === botId);
      if (!bot) return;

      // Generate full config from preset
      const configToSave = mapPresetToConfig(presetInput, {
        name: bot.name,
        tradingPairs: selectedPairs,
        tradingPair: selectedPairs[0],
        investedCapital: bot.config.investedCapital || 10000
      });

      // Save to localStorage for persistence
      saveMasterBotConfig(botId, configToSave);

      // Update the actual Master Bot instance if it exists
      const { botsApi } = await import('@/lib/api/botsApi');
      await botsApi.updateMasterBotConfig(botId, configToSave);

      // Update local state to reflect changes
      setBots(prevBots =>
        prevBots.map(b => {
          if (b.id === botId) {
            return {
              ...b,
              config: configToSave
            };
          }
          return b;
        })
      );

      setEditingBot(null);
      setPresetInput(null);
      setValidation(null);
      setSavedMessage(`Bot ${botId} updated & saved!`);
      setTimeout(() => setSavedMessage(null), 3000);

      console.log(`[AdminBots] Bot ${botId} config saved:`, configToSave);
    } catch (error) {
      console.error('[AdminBots] Error saving bot config:', error);
      setSavedMessage(`Error updating bot ${botId}`);
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingBot(null);
    setPresetInput(null);
    setValidation(null);
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

  const updatePresetField = (field: keyof PresetInput, value: any) => {
    setPresetInput(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const togglePair = (pair: string) => {
    setSelectedPairs(prevPairs => {
      const newPairs = prevPairs.includes(pair)
        ? prevPairs.filter(p => p !== pair)
        : [...prevPairs, pair];

      // Ensure at least one pair is selected
      return newPairs.length > 0 ? newPairs : [pair];
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
            const config = bot.config;

            // Display leverage info
            const leverageDisplay = (() => {
              if (config.leverages && config.leverages.length > 0) {
                return `${Math.min(...config.leverages)}x - ${Math.max(...config.leverages)}x`;
              }
              return `${config.leverage || 5}x`;
            })();

            // Display trading pairs
            const pairsDisplay = (() => {
              if (isEditing && selectedPairs.length > 0) {
                return selectedPairs.join(', ');
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
                          disabled={!validation || !validation.valid}
                          className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            validation && validation.valid
                              ? 'bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-white'
                              : 'bg-dark-700/50 text-dark-500 cursor-not-allowed'
                          }`}
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

                    {/* Validation Status */}
                    {validation && (
                      <div className={`p-3 rounded-lg border ${
                        validation.valid
                          ? 'bg-green-900/20 border-green-500/30'
                          : 'bg-red-900/20 border-red-500/30'
                      }`}>
                        <div className="flex items-start gap-2">
                          {validation.valid ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h5 className={`text-xs font-bold mb-1 ${
                              validation.valid ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {validation.valid ? 'Configuration Valid' : 'Configuration Invalid'}
                            </h5>
                            {validation.issues.length > 0 && (
                              <div className="space-y-1 mb-2">
                                {validation.issues.map((issue, i) => (
                                  <p key={i} className="text-[10px] text-red-200/80">✗ {issue}</p>
                                ))}
                              </div>
                            )}
                            {validation.warnings.length > 0 && (
                              <div className="space-y-1">
                                {validation.warnings.map((warning, i) => (
                                  <p key={i} className="text-[10px] text-yellow-200/80">⚠ {warning}</p>
                                ))}
                              </div>
                            )}
                            {validation.valid && (
                              <p className="text-[10px] text-green-200/80">
                                Max correction: {(validation.maxCorrectionPercent * 100).toFixed(2)}% (within acceptable range)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preset Configuration Form */}
                    {presetInput && (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Daily Target */}
                        <div className="col-span-2 p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-xs text-dark-400 uppercase mb-2 block flex items-center justify-between">
                            <span>Daily Target</span>
                            <span className="text-primary-400 font-bold">{presetInput.dailyTarget.toFixed(1)}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={presetInput.dailyTarget}
                            onChange={(e) => updatePresetField('dailyTarget', parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-[10px] text-dark-500 mt-1">
                            <span>0%</span>
                            <span>10%</span>
                          </div>
                        </div>

                        {/* Trades Per Day */}
                        <div className="p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-[10px] text-dark-500 uppercase mb-1 block">Trades Per Day</label>
                          <input
                            type="number"
                            value={presetInput.tradesPerDay}
                            onChange={(e) => updatePresetField('tradesPerDay', parseInt(e.target.value))}
                            min="50"
                            max="500"
                            step="10"
                            className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                          />
                          <p className="text-[9px] text-dark-500 mt-1">Range: 50-500</p>
                        </div>

                        {/* Character */}
                        <div className="p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-[10px] text-dark-500 uppercase mb-1 block">Character</label>
                          <select
                            value={presetInput.character}
                            onChange={(e) => updatePresetField('character', e.target.value as PresetInput['character'])}
                            className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                          >
                            <option value="conservative">Conservative (55% WR, 5-10x)</option>
                            <option value="moderate">Moderate (60% WR, 10-20x)</option>
                            <option value="aggressive">Aggressive (75% WR, 20-50x)</option>
                          </select>
                        </div>

                        {/* Convergence Mode */}
                        <div className="p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-[10px] text-dark-500 uppercase mb-1 block">Convergence Mode</label>
                          <select
                            value={presetInput.convergenceMode}
                            onChange={(e) => updatePresetField('convergenceMode', e.target.value as PresetInput['convergenceMode'])}
                            className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                          >
                            <option value="natural">Natural (~80% target)</option>
                            <option value="assisted">Assisted (~90% target)</option>
                            <option value="guaranteed">Guaranteed (~95% target)</option>
                          </select>
                        </div>

                        {/* Realism Mode (Optional) */}
                        <div className="p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-[10px] text-dark-500 uppercase mb-1 block">Realism Mode (Optional)</label>
                          <select
                            value={presetInput.realismMode || 'auto'}
                            onChange={(e) => updatePresetField('realismMode', e.target.value === 'auto' ? undefined : e.target.value as PresetInput['realismMode'])}
                            className="w-full px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none"
                          >
                            <option value="auto">Auto (from character)</option>
                            <option value="smooth">Smooth (90% tight, low volatility)</option>
                            <option value="realistic">Realistic (80% tight, medium volatility)</option>
                            <option value="volatile">Volatile (60% tight, high volatility)</option>
                          </select>
                        </div>

                        {/* Info Block */}
                        <div className="col-span-2 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-400 text-xs font-bold">i</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xs font-bold text-blue-300 mb-1">Adaptive Convergence System</h5>
                              <p className="text-[10px] text-blue-200/80 leading-relaxed">
                                All other parameters (win rate, leverage, position size, TP/SL, variance) are automatically calculated
                                from these 4 preset inputs. The system uses 6-layer convergence logic to minimize corrections and maintain realism.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Trading Pairs */}
                        <div className="col-span-2 p-3 bg-dark-900/30 rounded border border-dark-700/50">
                          <label className="text-[10px] text-dark-500 uppercase mb-2 block">Trading Pairs</label>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABLE_PAIRS.map(pair => (
                              <label key={pair} className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedPairs.includes(pair)}
                                  onChange={() => togglePair(pair)}
                                  className="w-3 h-3 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-xs text-white">{pair}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
