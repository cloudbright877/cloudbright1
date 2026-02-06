// ============================================================================
// PresetMapper Unit Tests
// ============================================================================
// Run with: node --loader ts-node/esm tests/unit/convergence/PresetMapper.test.ts

import { strict as assert } from 'assert';
import {
  mapPresetToConfig,
  validatePresetInput,
  getPresetDescription,
  type PresetInput
} from '../../../lib/trading/convergence/PresetMapper';

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

console.log('\n=== PresetMapper Tests ===\n');

// Test 1: Determinism - same input produces same output
test('Determinism: same input produces identical output', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const config1 = mapPresetToConfig(input);
  const config2 = mapPresetToConfig(input);

  // Compare key fields (ignore timestamps)
  assert.equal(config1.winRate, config2.winRate);
  assert.deepEqual(config1.leverages, config2.leverages);
  assert.equal(config1.character, config2.character);
  assert.equal(config1.realismMode, config2.realismMode);
  assert.equal(config1.convergenceMode, config2.convergenceMode);
});

// Test 2: Character profiles - conservative
test('Character: conservative has correct profile', () => {
  const input: PresetInput = {
    dailyTarget: 2.0,
    tradesPerDay: 200,
    character: 'conservative',
    convergenceMode: 'natural'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.winRate, 0.55);
  assert.deepEqual(config.leverages, [5, 8, 10]); // min, mid=Math.round((5+10)/2)=8, max
  assert.equal(config.realismMode, 'realistic'); // default for conservative
});

// Test 3: Character profiles - moderate
test('Character: moderate has correct profile', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'assisted'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.winRate, 0.60);
  assert.deepEqual(config.leverages, [10, 15, 20]);
  assert.equal(config.realismMode, 'realistic');
});

// Test 4: Character profiles - aggressive
test('Character: aggressive has correct profile', () => {
  const input: PresetInput = {
    dailyTarget: 3.0,
    tradesPerDay: 300,
    character: 'aggressive',
    convergenceMode: 'guaranteed'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.winRate, 0.75);
  assert.deepEqual(config.leverages, [20, 35, 50]);
  assert.equal(config.realismMode, 'volatile'); // default for aggressive
});

// Test 5: Realism mode - smooth
test('Realism: smooth mode has correct settings', () => {
  const input: PresetInput = {
    dailyTarget: 2.0,
    tradesPerDay: 200,
    character: 'conservative',
    convergenceMode: 'natural',
    realismMode: 'smooth'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.realismMode, 'smooth');
  assert.equal(config.pnlVariance?.tightModePercent, 90);
  assert.equal(config.volatility, 'low');
});

// Test 6: Realism mode - realistic
test('Realism: realistic mode has correct settings', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'assisted',
    realismMode: 'realistic'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.realismMode, 'realistic');
  assert.equal(config.pnlVariance?.tightModePercent, 80);
  assert.equal(config.volatility, 'medium');
});

// Test 7: Realism mode - volatile
test('Realism: volatile mode has correct settings', () => {
  const input: PresetInput = {
    dailyTarget: 3.0,
    tradesPerDay: 300,
    character: 'aggressive',
    convergenceMode: 'guaranteed',
    realismMode: 'volatile'
  };

  const config = mapPresetToConfig(input);

  assert.equal(config.realismMode, 'volatile');
  assert.equal(config.pnlVariance?.tightModePercent, 60);
  assert.equal(config.volatility, 'high');
});

// Test 8: All 9 preset combinations are valid
test('All 9 preset combinations produce valid configs', () => {
  const characters: Array<'conservative' | 'moderate' | 'aggressive'> = ['conservative', 'moderate', 'aggressive'];
  const realismModes: Array<'smooth' | 'realistic' | 'volatile'> = ['smooth', 'realistic', 'volatile'];

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

      // Basic validation
      assert.ok(config.winRate > 0 && config.winRate < 1);
      assert.ok(config.leverages && config.leverages.length === 3);
      assert.ok(config.dailyTargetPercent === 0.025); // 2.5% converted to decimal
      assert.ok(config.tradesPerDay === 250);
    }
  }
});

// Test 9: Input validation - valid input
test('Input validation: accepts valid input', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const errors = validatePresetInput(input);
  assert.equal(errors.length, 0);
});

// Test 10: Input validation - rejects invalid daily target
test('Input validation: rejects invalid daily target', () => {
  const input: PresetInput = {
    dailyTarget: 15, // > 10%
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const errors = validatePresetInput(input);
  assert.ok(errors.length > 0);
  assert.ok(errors[0].includes('Daily target'));
});

// Test 11: Input validation - rejects invalid trades per day
test('Input validation: rejects invalid trades per day', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 1000, // > 500
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const errors = validatePresetInput(input);
  assert.ok(errors.length > 0);
  assert.ok(errors[0].includes('Trades per day'));
});

// Test 12: Base config override
test('Base config: can override name, pairs, capital', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const baseConfig = {
    name: 'Custom Bot',
    tradingPairs: ['SOL/USDT', 'DOGE/USDT'],
    investedCapital: 50000
  };

  const config = mapPresetToConfig(input, baseConfig);

  assert.equal(config.name, 'Custom Bot');
  assert.deepEqual(config.tradingPairs, ['SOL/USDT', 'DOGE/USDT']);
  assert.equal(config.investedCapital, 50000);
});

// Test 13: Description generation
test('Description: generates human-readable summary', () => {
  const input: PresetInput = {
    dailyTarget: 2.5,
    tradesPerDay: 250,
    character: 'moderate',
    convergenceMode: 'guaranteed'
  };

  const description = getPresetDescription(input);

  assert.ok(description.includes('MODERATE'));
  assert.ok(description.includes('60%')); // win rate
  assert.ok(description.includes('10-20x')); // leverage
  assert.ok(description.includes('2.5%')); // daily target
  assert.ok(description.includes('250')); // trades/day
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
