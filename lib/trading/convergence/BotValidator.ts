// ============================================================================
// BotValidator - Simple mathematical validation for bot configurations
// ============================================================================
// NO Monte Carlo - we control outcomes (shouldWin), no uncertainty
// Validates: math formula converges, corrections within realistic limits

import type { BotConfig } from '../types';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  maxCorrectionPercent: number; // Max expected correction per trade
}

/**
 * Validation configuration
 */
interface ValidationConfig {
  maxCorrectionPercent: number;  // Max correction before visible (default: 0.3%)
  maxDailyTarget: number;         // Max daily target % (default: 0.10 = 10%)
}

const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  maxCorrectionPercent: 0.003,  // 0.3% - within volatile slippage range
  maxDailyTarget: 0.10          // 10% daily max
};

/**
 * Validates a bot configuration using simple math
 *
 * Checks:
 * 1. Math formula converges (DynamicPnLCalculator formula)
 * 2. Per-trade P&L is within realistic bounds
 * 3. Max correction stays below visibility threshold
 * 4. Parameters are within safe ranges
 *
 * @param config BotConfig to validate
 * @param validationConfig Optional validation parameters
 * @returns ValidationResult with issues and warnings
 */
export function validateBotConfig(
  config: BotConfig,
  validationConfig: Partial<ValidationConfig> = {}
): ValidationResult {
  const vConfig = { ...DEFAULT_VALIDATION_CONFIG, ...validationConfig };
  const issues: string[] = [];
  const warnings: string[] = [];

  // === Basic parameter validation ===

  if (config.dailyTargetPercent > vConfig.maxDailyTarget) {
    issues.push(
      `Daily target ${(config.dailyTargetPercent * 100).toFixed(1)}% exceeds maximum ` +
      `${(vConfig.maxDailyTarget * 100).toFixed(0)}% (unrealistic)`
    );
  }

  if (config.dailyTargetPercent <= 0) {
    issues.push('Daily target must be greater than 0');
  }

  if (config.tradesPerDay < 50 || config.tradesPerDay > 500) {
    issues.push('Trades per day must be between 50 and 500');
  }

  if (config.winRate <= 0 || config.winRate >= 1) {
    issues.push('Win rate must be between 0 and 1 (exclusive)');
  }

  // If basic validation fails, return early
  if (issues.length > 0) {
    return { valid: false, issues, warnings, maxCorrectionPercent: 0 };
  }

  // === Mathematical formula validation ===

  const WR = config.winRate;
  const LR = 1 - WR;

  // Check formula denominator (from DynamicPnLCalculator)
  const denominator = WR - (LR * LR / WR) * 0.7;

  if (denominator <= 0) {
    issues.push(
      `Win rate ${(WR * 100).toFixed(0)}% is too low - formula does not converge. ` +
      `Minimum win rate for this system: ~42%`
    );
  }

  // Calculate per-trade P&L values
  const perTradeTarget = config.dailyTargetPercent / config.tradesPerDay;
  const baseWin = perTradeTarget / denominator;
  const baseLoss = Math.abs(baseWin * (LR / WR) * 0.7);

  // === Per-trade P&L checks ===

  // Check if per-trade target is too small (< 0.001% = invisible)
  if (perTradeTarget < 0.00001) {
    warnings.push(
      `Per-trade target ${(perTradeTarget * 100).toFixed(4)}% is extremely small. ` +
      `Consider fewer trades or higher daily target.`
    );
  }

  // Check if per-trade target is too large (> 0.05% = visible patterns)
  if (perTradeTarget > 0.0005) {
    warnings.push(
      `Per-trade target ${(perTradeTarget * 100).toFixed(3)}% is large. ` +
      `Consider more trades to distribute target better.`
    );
  }

  // === Max correction calculation ===

  // Worst case: price moves against position by typical volatility (0.2% per 5min for BTC)
  const typicalPriceMove = 0.002; // 0.2%
  const maxCorrectionNeeded = Math.abs(baseWin) + typicalPriceMove;

  if (maxCorrectionNeeded > vConfig.maxCorrectionPercent) {
    issues.push(
      `Max correction ${(maxCorrectionNeeded * 100).toFixed(2)}% exceeds visibility threshold ` +
      `${(vConfig.maxCorrectionPercent * 100).toFixed(1)}%. Corrections will be noticeable. ` +
      `Increase trades/day or decrease daily target.`
    );
  }

  // === Time between trades ===

  const minutesPerTrade = (24 * 60) / config.tradesPerDay;

  if (minutesPerTrade < 2) {
    warnings.push(
      `Only ${minutesPerTrade.toFixed(1)} minutes between trades. ` +
      `High frequency may trigger burst protection.`
    );
  }

  if (minutesPerTrade > 30) {
    warnings.push(
      `${minutesPerTrade.toFixed(0)} minutes between trades. ` +
      `Low frequency may cause progress tracking issues at end of day.`
    );
  }

  // === Daily target realism ===

  if (config.dailyTargetPercent > 0.05) {
    warnings.push(
      `Daily target ${(config.dailyTargetPercent * 100).toFixed(1)}% is aggressive. ` +
      `Monitor performance closely during high volatility.`
    );
  }

  // === Win rate vs target ===

  // With high win rate, avg win can be small (good for hiding corrections)
  if (WR > 0.70 && baseWin < 0.0002) {
    warnings.push(
      `Win rate ${(WR * 100).toFixed(0)}% with small avg win ${(baseWin * 100).toFixed(3)}%. ` +
      `Excellent for hiding corrections, but requires many small wins.`
    );
  }

  // With low win rate, avg win must be large (harder to hide)
  if (WR < 0.55 && baseWin > 0.0005) {
    warnings.push(
      `Win rate ${(WR * 100).toFixed(0)}% requires large avg win ${(baseWin * 100).toFixed(3)}%. ` +
      `Corrections may be more visible. Consider increasing win rate.`
    );
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    maxCorrectionPercent: maxCorrectionNeeded
  };
}

/**
 * Quick validation for preset configurations (used in UI preview)
 * Only checks basic constraints, no math validation
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
- Max correction: ${(result.maxCorrectionPercent * 100).toFixed(2)}%
${result.warnings.length > 0 ? '\nWarnings:\n' + result.warnings.map(w => `  ⚠ ${w}`).join('\n') : ''}
    `.trim();
  } else {
    return `
✗ Configuration INVALID

Errors:
${result.issues.map(e => `  ✗ ${e}`).join('\n')}
${result.warnings.length > 0 ? '\nWarnings:\n' + result.warnings.map(w => `  ⚠ ${w}`).join('\n') : ''}
    `.trim();
  }
}

/**
 * Calculate expected P&L distribution for debugging
 * Shows what avg win/loss will be for given config
 */
export function calculatePnLDistribution(config: BotConfig): {
  perTradeTarget: number;
  avgWin: number;
  avgLoss: number;
  denominator: number;
} {
  const WR = config.winRate;
  const LR = 1 - WR;

  const perTradeTarget = config.dailyTargetPercent / config.tradesPerDay;
  const denominator = WR - (LR * LR / WR) * 0.7;
  const avgWin = perTradeTarget / denominator;
  const avgLoss = Math.abs(avgWin * (LR / WR) * 0.7);

  return {
    perTradeTarget,
    avgWin,
    avgLoss,
    denominator
  };
}
