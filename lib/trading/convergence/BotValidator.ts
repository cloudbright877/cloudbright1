// ============================================================================
// BotValidator - Monte Carlo validation for bot configurations
// ============================================================================
// Validates bot configs using 1000-day simulation
// Rejects configs with convergence score < 90% or unrealistic targets

import type { BotConfig } from '../types';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  convergenceScore: number;    // 0-1, % of days hitting target ±10%
  avgDeviation: number;         // Average deviation from target (%)
  errors: string[];
  warnings: string[];
}

/**
 * Validation configuration
 */
interface ValidationConfig {
  simulationDays: number;       // Number of days to simulate (default: 1000)
  convergenceThreshold: number; // Min convergence score (default: 0.90)
  maxDeviation: number;         // Max avg deviation % (default: 0.10)
  maxDailyTarget: number;       // Max daily target % (default: 0.10 = 10%)
}

const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  simulationDays: 1000,
  convergenceThreshold: 0.90,
  maxDeviation: 0.10,
  maxDailyTarget: 0.10
};

/**
 * Validates a bot configuration using Monte Carlo simulation
 *
 * Runs 1000-day simulation without convergence layers (worst case).
 * Convergence layers will IMPROVE this score in production.
 *
 * @param config BotConfig to validate
 * @param validationConfig Optional validation parameters
 * @returns ValidationResult with convergence score and errors
 */
export function validateBotConfig(
  config: BotConfig,
  validationConfig: Partial<ValidationConfig> = {}
): ValidationResult {
  const vConfig = { ...DEFAULT_VALIDATION_CONFIG, ...validationConfig };
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic parameter validation
  if (config.dailyTargetPercent > vConfig.maxDailyTarget) {
    errors.push(
      `Daily target ${(config.dailyTargetPercent * 100).toFixed(1)}% exceeds maximum ` +
      `${(vConfig.maxDailyTarget * 100).toFixed(0)}% (unrealistic)`
    );
  }

  if (config.dailyTargetPercent <= 0) {
    errors.push('Daily target must be greater than 0');
  }

  if (config.tradesPerDay < 50 || config.tradesPerDay > 500) {
    errors.push('Trades per day must be between 50 and 500');
  }

  if (config.winRate <= 0 || config.winRate >= 1) {
    errors.push('Win rate must be between 0 and 1 (exclusive)');
  }

  // If basic validation fails, return early (no point running simulation)
  if (errors.length > 0) {
    return {
      valid: false,
      convergenceScore: 0,
      avgDeviation: 0,
      errors,
      warnings
    };
  }

  // Run Monte Carlo simulation
  const simulation = runMonteCarloSimulation(config, vConfig.simulationDays);

  // Check convergence score
  if (simulation.convergenceScore < vConfig.convergenceThreshold) {
    errors.push(
      `Convergence score ${(simulation.convergenceScore * 100).toFixed(1)}% ` +
      `is below threshold ${(vConfig.convergenceThreshold * 100).toFixed(0)}%`
    );
  }

  // Check average deviation
  if (simulation.avgDeviation > vConfig.maxDeviation) {
    errors.push(
      `Average deviation ${(simulation.avgDeviation * 100).toFixed(1)}% ` +
      `exceeds maximum ${(vConfig.maxDeviation * 100).toFixed(0)}%`
    );
  }

  // Warnings (don't fail validation, but inform user)
  if (simulation.convergenceScore >= 0.90 && simulation.convergenceScore < 0.95) {
    warnings.push(
      'Convergence score is acceptable but on the lower end. ' +
      'Consider using "assisted" or "guaranteed" convergence mode.'
    );
  }

  if (config.dailyTargetPercent > 0.05) {
    warnings.push(
      `Daily target ${(config.dailyTargetPercent * 100).toFixed(1)}% is aggressive. ` +
      'Monitor performance closely.'
    );
  }

  return {
    valid: errors.length === 0,
    convergenceScore: simulation.convergenceScore,
    avgDeviation: simulation.avgDeviation,
    errors,
    warnings
  };
}

/**
 * Monte Carlo simulation result
 */
interface SimulationResult {
  convergenceScore: number;  // % of days hitting target ±10%
  avgDeviation: number;      // Average absolute deviation from target
  dailyResults: number[];    // Daily P&L for each simulated day
}

/**
 * Runs Monte Carlo simulation for N days
 * Simulates trading WITHOUT convergence layers (worst case baseline)
 *
 * @param config BotConfig to simulate
 * @param days Number of days to simulate
 * @returns SimulationResult with convergence metrics
 */
function runMonteCarloSimulation(config: BotConfig, days: number): SimulationResult {
  const dailyResults: number[] = [];
  let daysWithinTarget = 0;
  let totalDeviation = 0;

  // Calculate base P&L values using DynamicPnLCalculator formula
  const { baseWin, baseLoss } = calculateBasePnL(config);

  for (let day = 0; day < days; day++) {
    let dailyPnL = 0;

    // Simulate trades for this day
    for (let trade = 0; trade < config.tradesPerDay; trade++) {
      const isWin = Math.random() < config.winRate;

      if (isWin) {
        // Add variance to make it realistic (tight vs wide mode)
        const variance = getRandomVariance(config);
        dailyPnL += baseWin * variance;
      } else {
        const variance = getRandomVariance(config);
        dailyPnL += baseLoss * variance; // baseLoss is negative
      }
    }

    dailyResults.push(dailyPnL);

    // Check if within target ±10%
    const target = config.dailyTargetPercent;
    const deviation = Math.abs(dailyPnL - target);
    const relativeDeviation = deviation / target;

    if (relativeDeviation <= 0.10) {
      daysWithinTarget++;
    }

    totalDeviation += relativeDeviation;
  }

  return {
    convergenceScore: daysWithinTarget / days,
    avgDeviation: totalDeviation / days,
    dailyResults
  };
}

/**
 * Calculate base P&L values from config using DynamicPnLCalculator formula
 * Formula from SPEC.md:
 * ```
 * perTradeTarget = dailyTarget / trades
 * denominator = WR - (LR^2 / WR) * 0.7
 * baseWin = perTradeTarget / denominator
 * baseLoss = baseWin * (LR / WR) * 0.7
 * ```
 */
function calculateBasePnL(config: BotConfig): { baseWin: number; baseLoss: number } {
  const WR = config.winRate;
  const LR = 1 - WR;

  const perTradeTarget = config.dailyTargetPercent / config.tradesPerDay;
  const denominator = WR - (LR * LR / WR) * 0.7;
  const baseWin = perTradeTarget / denominator;
  const baseLoss = baseWin * (LR / WR) * 0.7;

  return {
    baseWin,
    baseLoss: -Math.abs(baseLoss) // Ensure loss is negative
  };
}

/**
 * Get random variance multiplier based on tight mode percentage
 * Simulates P&L variance distribution
 *
 * @param config BotConfig with pnlVariance settings
 * @returns Variance multiplier (0.8 - 1.2)
 */
function getRandomVariance(config: BotConfig): number {
  const tightModePercent = config.pnlVariance?.tightModePercent ?? 80;
  const isTightMode = Math.random() * 100 < tightModePercent;

  if (isTightMode) {
    // Tight mode: 0.95 - 1.05 (5% variance)
    return 0.95 + Math.random() * 0.10;
  } else {
    // Wide mode: 0.80 - 1.20 (20% variance)
    return 0.80 + Math.random() * 0.40;
  }
}

/**
 * Quick validation for preset configurations (used in PresetMapper)
 * Does NOT run full Monte Carlo (too slow for UI preview)
 * Only checks basic constraints
 *
 * @param config BotConfig to validate
 * @returns True if config passes basic checks
 */
export function quickValidatePreset(config: BotConfig): boolean {
  // Basic checks only
  if (config.dailyTargetPercent <= 0 || config.dailyTargetPercent > 0.10) {
    return false;
  }

  if (config.tradesPerDay < 50 || config.tradesPerDay > 500) {
    return false;
  }

  if (config.winRate <= 0 || config.winRate >= 1) {
    return false;
  }

  return true;
}

/**
 * Get human-readable validation summary
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid) {
    return `
✓ Configuration VALID
- Convergence Score: ${(result.convergenceScore * 100).toFixed(1)}%
- Avg Deviation: ${(result.avgDeviation * 100).toFixed(1)}%
${result.warnings.length > 0 ? '\nWarnings:\n' + result.warnings.map(w => `  ⚠ ${w}`).join('\n') : ''}
    `.trim();
  } else {
    return `
✗ Configuration INVALID
- Convergence Score: ${(result.convergenceScore * 100).toFixed(1)}%
- Avg Deviation: ${(result.avgDeviation * 100).toFixed(1)}%

Errors:
${result.errors.map(e => `  ✗ ${e}`).join('\n')}
    `.trim();
  }
}
