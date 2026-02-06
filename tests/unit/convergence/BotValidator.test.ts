// ============================================================================
// BotValidator Unit Tests
// ============================================================================
// Run with: node --loader ts-node/esm tests/unit/convergence/BotValidator.test.ts

import { strict as assert } from 'assert';
import {
  validateBotConfig,
  quickValidatePreset,
  getValidationSummary
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

console.log('\n=== BotValidator Tests ===\n');

// Test 1: Valid config passes basic validation (without full Monte Carlo)
test('Valid config: moderate preset has no parameter errors', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);

  // Basic parameter checks only (no Monte Carlo)
  assert.ok(config.dailyTargetPercent > 0 && config.dailyTargetPercent <= 0.10);
  assert.ok(config.tradesPerDay >= 50 && config.tradesPerDay <= 500);
  assert.ok(config.winRate > 0 && config.winRate < 1);
});

// Test 2: Conservative preset basic validation
test('Valid config: conservative preset has no parameter errors', () => {
  const input: PresetInput = {
    dailyTarget: 2.0,
    tradesPerDay: 200,
    character: 'conservative',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);

  assert.ok(config.dailyTargetPercent > 0 && config.dailyTargetPercent <= 0.10);
  assert.ok(config.tradesPerDay >= 50 && config.tradesPerDay <= 500);
  assert.ok(config.winRate > 0 && config.winRate < 1);
});

// Test 3: Aggressive preset basic validation
test('Valid config: aggressive preset has no parameter errors', () => {
  const input: PresetInput = {
    dailyTarget: 3.0,
    tradesPerDay: 300,
    character: 'aggressive',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);

  assert.ok(config.dailyTargetPercent > 0 && config.dailyTargetPercent <= 0.10);
  assert.ok(config.tradesPerDay >= 50 && config.tradesPerDay <= 500);
  assert.ok(config.winRate > 0 && config.winRate < 1);
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

  const result = validateBotConfig(config, { simulationDays: 10 });

  assert.ok(!result.valid, 'Expected invalid');
  assert.ok(result.errors.length > 0, 'Expected errors');
  assert.ok(
    result.errors[0].includes('exceeds maximum'),
    `Expected error about max target, got: ${result.errors[0]}`
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

  const result = validateBotConfig(config, { simulationDays: 10 });

  assert.ok(!result.valid);
  assert.ok(result.errors[0].includes('greater than 0'));
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

  const result = validateBotConfig(config, { simulationDays: 10 });

  assert.ok(!result.valid);
  assert.ok(result.errors[0].includes('between 50 and 500'));
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

  const result = validateBotConfig(config, { simulationDays: 10 });

  assert.ok(!result.valid);
  assert.ok(result.errors[0].includes('between 0 and 1'));
});

// Test 8: Quick validation - valid preset
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

// Test 9: Quick validation - invalid target
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

// Test 10: Convergence score calculation
test('Convergence score: calculated correctly', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config, { simulationDays: 10 });

  assert.ok(result.convergenceScore >= 0 && result.convergenceScore <= 1,
    `Convergence score must be 0-1, got ${result.convergenceScore}`);
});

// Test 11: Validation summary - valid config
test('Validation summary: generates summary for valid config', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config, { simulationDays: 10 });
  const summary = getValidationSummary(result);

  assert.ok(summary.includes('VALID') || summary.includes('INVALID'));
  assert.ok(summary.includes('Convergence Score'));
});

// Test 12: All 9 preset combinations pass basic validation
test('All 9 presets: pass basic parameter checks', () => {
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

      // Use quick validation instead of full Monte Carlo (faster for unit tests)
      const isValid = quickValidatePreset(config);

      assert.ok(isValid,
        `Preset ${character}/${realismMode} failed basic validation`);
    }
  }
});

// Test 13: Warning for aggressive daily target
test('Warnings: shows warning for aggressive target', () => {
  const input: PresetInput = {
    dailyTarget: 6.0, // Aggressive but valid (< 10%)
    tradesPerDay: 250,
    character: 'aggressive',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);
  const result = validateBotConfig(config, { simulationDays: 10 });

  // Should be valid but have warnings
  assert.ok(result.valid, 'Config should be valid');
  assert.ok(result.warnings.length > 0, 'Should have warnings');
  assert.ok(result.warnings[0].includes('aggressive'),
    `Expected warning about aggressive target, got: ${result.warnings[0]}`);
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
