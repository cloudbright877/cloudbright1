// ============================================================================
// PresetMapper - Deterministic 4-parameter preset system
// ============================================================================
// Maps 4 admin inputs to full BotConfig with all trading parameters
// CRITICAL: Same input MUST always produce same output (deterministic)

import type { BotConfig } from '../types';

/**
 * Admin inputs (4 parameters)
 */
export interface PresetInput {
  dailyTarget: number;        // 0-10% (default: 2.5)
  tradesPerDay: number;       // 50-500 (default: 250)
  character: 'conservative' | 'moderate' | 'aggressive'; // default: moderate
  convergenceMode: 'natural' | 'assisted' | 'guaranteed'; // default: guaranteed
  realismMode?: 'smooth' | 'realistic' | 'volatile'; // optional, derived from character if not set
}

/**
 * Character profile configuration
 */
interface CharacterProfile {
  winRate: number;
  leverageMin: number;
  leverageMax: number;
  risk: 'low' | 'medium' | 'high';
  defaultRealism: 'smooth' | 'realistic' | 'volatile';
}

/**
 * Realism mode configuration
 */
interface RealismProfile {
  tightModePercent: number;  // % of positions in tight mode (0-100)
  volatility: 'low' | 'medium' | 'high';
  slippageMin: number;
  slippageMax: number;
}

/**
 * Character profiles from SPEC.md
 */
const CHARACTER_PROFILES: Record<PresetInput['character'], CharacterProfile> = {
  conservative: {
    winRate: 0.55,
    leverageMin: 5,
    leverageMax: 10,
    risk: 'low',
    defaultRealism: 'realistic'
  },
  moderate: {
    winRate: 0.60,
    leverageMin: 10,
    leverageMax: 20,
    risk: 'medium',
    defaultRealism: 'realistic'
  },
  aggressive: {
    winRate: 0.75,
    leverageMin: 20,
    leverageMax: 50,
    risk: 'high',
    defaultRealism: 'volatile'
  }
};

/**
 * Realism mode profiles from SPEC.md
 */
const REALISM_PROFILES: Record<'smooth' | 'realistic' | 'volatile', RealismProfile> = {
  smooth: {
    tightModePercent: 90,
    volatility: 'low',
    slippageMin: 0.05,
    slippageMax: 0.15
  },
  realistic: {
    tightModePercent: 80,
    volatility: 'medium',
    slippageMin: 0.05,
    slippageMax: 0.30
  },
  volatile: {
    tightModePercent: 60,
    volatility: 'high',
    slippageMin: 0.05,
    slippageMax: 0.50
  }
};

/**
 * Convergence mode configuration
 */
interface ConvergenceProfile {
  layersActive: number[];     // Which layers are enabled (1-6)
  targetProbability: number;  // Expected convergence probability (0-1)
  microSteeringEnabled: boolean;
}

/**
 * Convergence mode profiles from SPEC.md
 */
const CONVERGENCE_PROFILES: Record<PresetInput['convergenceMode'], ConvergenceProfile> = {
  natural: {
    layersActive: [1, 2, 3],
    targetProbability: 0.825,  // 80-85%
    microSteeringEnabled: false
  },
  assisted: {
    layersActive: [1, 2, 3, 4, 5],
    targetProbability: 0.90,   // 88-92%
    microSteeringEnabled: false // Only emergency (Layer 5 handles frequency)
  },
  guaranteed: {
    layersActive: [1, 2, 3, 4, 5, 6],
    targetProbability: 0.955,  // 94-97%
    microSteeringEnabled: true // Layer 6 active
  }
};

/**
 * Maps 4-parameter preset input to full BotConfig
 * DETERMINISTIC: same input always produces same output
 *
 * @param input PresetInput with 4 required parameters
 * @param baseConfig Optional base config (name, tradingPairs, investedCapital)
 * @returns Complete BotConfig ready for TradingBot
 */
export function mapPresetToConfig(
  input: PresetInput,
  baseConfig?: Partial<BotConfig>
): BotConfig {
  // Get profiles
  const character = CHARACTER_PROFILES[input.character];
  const realismMode = input.realismMode || character.defaultRealism;
  const realism = REALISM_PROFILES[realismMode];
  const convergence = CONVERGENCE_PROFILES[input.convergenceMode];

  // Generate leverages array (deterministic range)
  const leverages = generateLeverages(character.leverageMin, character.leverageMax);

  // Default trading pairs
  const defaultPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];

  // Build full BotConfig
  const config: BotConfig = {
    // Base info (from baseConfig or defaults)
    name: baseConfig?.name || 'Unnamed Bot',
    tradingPair: baseConfig?.tradingPair || defaultPairs[0], // deprecated, for backwards compat
    tradingPairs: baseConfig?.tradingPairs || defaultPairs,
    investedCapital: baseConfig?.investedCapital || 10000,
    createdAt: Date.now(),

    // Trading Parameters
    leverages,
    allowedSides: 'BOTH',

    // Performance Targets
    winRate: character.winRate,
    dailyTargetPercent: input.dailyTarget / 100, // Convert % to decimal (2.5 -> 0.025)
    tradesPerDay: input.tradesPerDay,

    // Position Sizing (fixed for presets)
    minPositionSize: 100,
    maxPositionSize: 1000,

    // Duration Control (fixed for presets)
    minDuration: 60 * 1000,     // 1 min
    maxDuration: 120 * 60 * 1000, // 2 hours

    // Position Management
    maxConcurrentPositions: 5,
    openFrequency: 0.6,         // Base frequency (Layer 5 adjusts dynamically)

    // Risk Management
    maxSlippage: realism.slippageMax,
    maxTradesHistory: 1000,

    // Advanced Risk Management
    staggeredClosing: {
      enabled: true,            // Always enabled for presets
      maxClosuresInWindow: 3,
      windowDurationSec: 30,
      minDelayBetweenSec: 2,
      maxDelayBetweenSec: 10
    },
    pnlVariance: {
      tightModePercent: realism.tightModePercent
    },
    marketFriction: {
      enabled: true,
      forceVolatility: realism.volatility
    },

    // Preset System (ADAPTIVE_CONVERGENCE_SYSTEM)
    character: input.character,
    realismMode: realismMode,
    convergenceMode: input.convergenceMode,
    volatility: realism.volatility
  };

  return config;
}

/**
 * Generate leverages array from min/max range
 * DETERMINISTIC: always returns [min, mid, max]
 *
 * Example: (5, 10) -> [5, 7, 10]
 */
function generateLeverages(min: number, max: number): number[] {
  const mid = Math.round((min + max) / 2);
  return [min, mid, max];
}

/**
 * Validates preset input parameters
 * @param input PresetInput to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validatePresetInput(input: PresetInput): string[] {
  const errors: string[] = [];

  // Daily target validation
  if (input.dailyTarget < 0 || input.dailyTarget > 10) {
    errors.push('Daily target must be between 0% and 10%');
  }

  // Trades per day validation
  if (input.tradesPerDay < 50 || input.tradesPerDay > 500) {
    errors.push('Trades per day must be between 50 and 500');
  }

  // Character validation (TypeScript should catch this, but for runtime safety)
  const validCharacters = ['conservative', 'moderate', 'aggressive'];
  if (!validCharacters.includes(input.character)) {
    errors.push('Character must be conservative, moderate, or aggressive');
  }

  // Convergence mode validation
  const validModes = ['natural', 'assisted', 'guaranteed'];
  if (!validModes.includes(input.convergenceMode)) {
    errors.push('Convergence mode must be natural, assisted, or guaranteed');
  }

  // Realism mode validation (optional)
  if (input.realismMode) {
    const validRealism = ['smooth', 'realistic', 'volatile'];
    if (!validRealism.includes(input.realismMode)) {
      errors.push('Realism mode must be smooth, realistic, or volatile');
    }
  }

  return errors;
}

/**
 * Get human-readable description of a preset configuration
 */
export function getPresetDescription(input: PresetInput): string {
  const character = CHARACTER_PROFILES[input.character];
  const realismMode = input.realismMode || character.defaultRealism;
  const convergence = CONVERGENCE_PROFILES[input.convergenceMode];

  return `
${input.character.toUpperCase()} Bot
- Win Rate: ${(character.winRate * 100).toFixed(0)}%
- Leverage: ${character.leverageMin}-${character.leverageMax}x
- Daily Target: ${input.dailyTarget.toFixed(1)}%
- Trades/Day: ${input.tradesPerDay}
- Realism: ${realismMode}
- Convergence: ${input.convergenceMode} (${(convergence.targetProbability * 100).toFixed(0)}% target probability)
  `.trim();
}
