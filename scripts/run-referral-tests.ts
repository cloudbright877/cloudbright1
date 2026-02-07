/**
 * Test Runner for Referral System
 *
 * Runs all unit and integration tests in sequence
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const tests = [
  {
    name: 'Referral Commissions',
    path: 'tests/unit/referralCommissions.test.ts',
  },
  {
    name: 'Turnover Bonuses',
    path: 'tests/unit/turnoverBonuses.test.ts',
  },
  {
    name: 'Balance System',
    path: 'tests/unit/balances.test.ts',
  },
  {
    name: 'Referral Flow Integration',
    path: 'tests/integration/referral-flow.test.ts',
  },
];

console.log('═══════════════════════════════════════');
console.log('REFERRAL SYSTEM TEST SUITE');
console.log('═══════════════════════════════════════\n');

(async () => {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`Running: ${test.name}...`);

    try {
      const { stdout, stderr } = await execAsync(`npx tsx ${test.path}`);

      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('ExperimentalWarning')) {
        console.error(stderr);
      }

      if (stdout.includes('PASSED')) {
        passed++;
        console.log(`✅ ${test.name} PASSED\n`);
      } else {
        failed++;
        console.log(`❌ ${test.name} FAILED\n`);
      }
    } catch (error: any) {
      failed++;
      console.error(`❌ ${test.name} FAILED`);
      console.error(error.stdout || error.message);
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('TEST RESULTS');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  console.log('═══════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
})();
