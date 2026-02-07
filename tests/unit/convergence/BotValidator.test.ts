// ============================================================================
// BotValidator Unit Tests (Simple Math Validation)
// ============================================================================
// Run with: npx tsx tests/unit/convergence/BotValidator.test.ts

import { strict as assert } from 'assert';
import {
  validateBotConfig,
  quickValidatePreset,
  getValidationSummary,
  calculatePnLDistribution
} from '../../../lib/trading/convergence/BotValidator';
import { mapPresetToConfig } from '../../../lib/trading/convergence/PresetMapper';
import type { PresetInput } from '../../../lib/trading/convergence/PresetMapper';
import type { BotConfig } from '../../../lib/trading/types';

// Test counter
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result.then(() => {
        passed++;
        console.log(`✓ ${name}`);
      }).catch((error) => {
        failed++;
        console.error(`✗ ${name}`);
        console.error(`  ${error.message}`);
      });
    } else {
      passed++;
      console.log(`✓ ${name}`);
    }
  } catch (error: any) {
    failed++;
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
  }
}

// ============================================================================
// Test Suite
// ============================================================================

console.log('\n=== BotValidator Tests (Simple Math) ===\n');

// Test 1: Valid moderate preset
test('Valid config: moderate preset passes validation', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);

  assert.ok(result.valid, `Expected valid, got issues: ${result.issues.join(', ')}`);
  assert.ok(result.maxCorrectionPercent > 0, 'Should calculate max correction');
  assert.ok(result.maxCorrectionPercent < 0.01, 'Max correction should be reasonable');
});

// Test 2: Conservative preset
test('Valid config: conservative preset passes validation', () => {
  const input: PresetInput = {
    dailyTarget: 2.0,
    tradesPerDay: 200,
    character: 'conservative',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);

  assert.ok(result.valid, `Expected valid, got issues: ${result.issues.join(', ')}`);
});

// Test 3: Aggressive preset
test('Valid config: aggressive preset passes validation', () => {
  const input: PresetInput = {
    dailyTarget: 3.0,
    tradesPerDay: 300,
    character: 'aggressive',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);

  assert.ok(result.valid, `Expected valid, got issues: ${result.issues.join(', ')}`);
});

// Test 4: Rejects daily target > 10%
test('Invalid config: rejects daily target > 10%', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 0.60,
    dailyTargetPercent: 0.15, // 15% - unrealistic
    tradesPerDay: 250,
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const result = validateBotConfig(config);

  assert.ok(!result.valid, 'Expected invalid');
  assert.ok(result.issues.length > 0, 'Expected issues');
  assert.ok(
    result.issues[0].includes('exceeds maximum'),
    `Expected error about max target, got: ${result.issues[0]}`
  );
});

// Test 5: Rejects daily target <= 0
test('Invalid config: rejects daily target <= 0', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 0.60,
    dailyTargetPercent: 0, // Invalid
    tradesPerDay: 250,
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const result = validateBotConfig(config);

  assert.ok(!result.valid);
  assert.ok(result.issues[0].includes('greater than 0'));
});

// Test 6: Rejects trades per day out of range
test('Invalid config: rejects trades per day < 50', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 0.60,
    dailyTargetPercent: 0.025,
    tradesPerDay: 10, // Too low
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const result = validateBotConfig(config);

  assert.ok(!result.valid);
  assert.ok(result.issues[0].includes('between 50 and 500'));
});

// Test 7: Rejects win rate out of range
test('Invalid config: rejects win rate >= 1', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 1.0, // Invalid (must be < 1)
    dailyTargetPercent: 0.025,
    tradesPerDay: 250,
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const result = validateBotConfig(config);

  assert.ok(!result.valid);
  assert.ok(result.issues[0].includes('between 0 and 1'));
});

// Test 8: Formula convergence check (win rate too low)
test('Invalid config: rejects win rate that breaks formula', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 0.30, // Too low - formula denominator <= 0
    dailyTargetPercent: 0.025,
    tradesPerDay: 250,
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const result = validateBotConfig(config);

  assert.ok(!result.valid);
  assert.ok(result.issues[0].includes('does not converge'));
});

// Test 9: Quick validation - valid preset
test('Quick validation: accepts valid preset', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const isValid = quickValidatePreset(config);

  assert.ok(isValid, 'Expected quick validation to pass');
});

// Test 10: Quick validation - invalid target
test('Quick validation: rejects invalid daily target', () => {
  const config: BotConfig = {
    name: 'Invalid Bot',
    tradingPair: 'BTC/USDT',
    investedCapital: 10000,
    winRate: 0.60,
    dailyTargetPercent: 0.15, // > 10%
    tradesPerDay: 250,
    minPositionSize: 100,
    maxPositionSize: 1000,
    minDuration: 60000,
    maxDuration: 7200000,
    maxConcurrentPositions: 5,
    leverages: [10, 15, 20]
  };

  const isValid = quickValidatePreset(config);

  assert.ok(!isValid, 'Expected quick validation to fail');
});

// Test 11: Max correction calculation
test('Max correction: calculated correctly', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);

  assert.ok(result.maxCorrectionPercent > 0, 'Should calculate max correction');
  assert.ok(result.maxCorrectionPercent < 0.01, 'Max correction should be < 1%');
});

// Test 12: Validation summary generation
test('Validation summary: generates summary for valid config', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);
  const summary = getValidationSummary(result);

  assert.ok(summary.includes('VALID') || summary.includes('INVALID'));
  assert.ok(summary.includes('Max correction'));
});

// Test 13: All 9 preset combinations pass validation
test('All 9 presets: pass basic validation', () => {
  const characters: Array<'conservative' | 'moderate' | 'aggressive'> =
    ['conservative', 'moderate', 'aggressive'];
  const realismModes: Array<'smooth' | 'realistic' | 'volatile'> =
    ['smooth', 'realistic', 'volatile'];

  for (const character of characters) {
    for (const realismMode of realismModes) {
      const input: PresetInput = {
        dailyTarget: 2.5,
        tradesPerDay: 250,
        character,
        convergenceMode: 'guaranteed',
        realismMode
      };

      const config = mapPresetToConfig(input);
      const result = validateBotConfig(config);

      assert.ok(result.valid,
        `Preset ${character}/${realismMode} failed: ${result.issues.join(', ')}`);
    }
  }
});

// Test 14: P&L distribution calculation
test('P&L distribution: calculates correctly', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const dist = calculatePnLDistribution(config);

  assert.ok(dist.perTradeTarget > 0, 'Per-trade target should be positive');
  assert.ok(dist.avgWin > 0, 'Avg win should be positive');
  assert.ok(dist.avgLoss > 0, 'Avg loss should be positive');
  assert.ok(dist.denominator > 0, 'Denominator should be positive');

  // Check formula: E[daily] = trades * (WR * avgWin - LR * avgLoss)
  const expected = config.tradesPerDay *
    (config.winRate * dist.avgWin - (1 - config.winRate) * dist.avgLoss);

  const actual = config.dailyTargetPercent;
  const error = Math.abs(expected - actual) / actual;

  assert.ok(error < 0.05, `Formula error ${(error * 100).toFixed(2)}% too high`);
});

// Test 15: Warning for aggressive daily target
test('Warnings: shows warning for aggressive target', () => {
  const input: PresetInput = {
    dailyTarget: 6.0, // Aggressive but valid (< 10%)
    tradesPerDay: 250,
    character: 'aggressive',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config);

  // Should be valid but have warnings
  assert.ok(result.valid, 'Config should be valid');
  assert.ok(result.warnings.length > 0, 'Should have warnings');
});

// ============================================================================
// Run Tests and Print Summary
// ============================================================================

setTimeout(() => {
  console.log(`\n=== Test Summary ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}, 100);
