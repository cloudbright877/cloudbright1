/**
 * Demo Data Setup Script for Referral System
 *
 * Creates:
 * - 10-level referral tree (13 users total)
 * - Balances for each user
 * - Sample closed copies with profits/losses
 * - Commission history
 * - Turnover bonus achievements
 *
 * Usage:
 * 1. Run: npx tsx scripts/setup-demo-referrals.ts
 * 2. Open browser: http://localhost:3001/dashboard-v2/referrals
 * 3. View populated referral data
 */

import { createUser, clearAllUsers } from '../lib/users';
import { deposit, clearAllBalances } from '../lib/balances';
import { createUserCopy, updateUserCopy, clearAllUserCopies } from '../lib/userCopies';
import { distributeReferralCommissions, clearAllCommissions } from '../lib/referralCommissions';
import { checkAndAwardTurnoverBonuses, clearAllTurnoverBonuses } from '../lib/turnoverBonuses';
import { getOrCreateReferralLink } from '../lib/referralLinks';

console.log('\n🎯 Setting up demo referral data...\n');

(async () => {
  try {
    // Step 1: Clear existing data
    console.log('Step 1: Clearing existing data...');
    await clearAllUsers();
    await clearAllBalances();
    await clearAllUserCopies();
    await clearAllCommissions();
    await clearAllTurnoverBonuses();
    console.log('  ✓ Cleared\n');

    // Step 2: Create 10-level referral tree
    console.log('Step 2: Creating 10-level referral tree...');

    const userTree: Array<{ id: string; username: string; referralCode: string }> = [];

    // Create root user (Level 0)
    const root = await createUser({
      username: 'Alice_Root',
      email: 'alice@demo.com',
    });
    userTree.push({
      id: root.id,
      username: root.username,
      referralCode: root.referralCode,
    });
    await deposit(root.id, 10000);
    console.log(`  ✓ Level 0: ${root.username} (${root.referralCode})`);

    // Create chain of 10 levels
    const names = ['Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate'];

    for (let i = 0; i < 10; i++) {
      const parentCode = userTree[i].referralCode;
      const user = await createUser({
        username: `${names[i]}_L${i + 1}`,
        email: `${names[i].toLowerCase()}@demo.com`,
        referralCode: parentCode,
      });

      userTree.push({
        id: user.id,
        username: user.username,
        referralCode: user.referralCode,
      });

      await deposit(user.id, 5000 + Math.random() * 5000);

      console.log(`  ✓ Level ${i + 1}: ${user.username} (${user.referralCode})`);

      // Create referral link
      await getOrCreateReferralLink(user.id, user.referralCode);
    }

    console.log(`\n  Total: ${userTree.length} users in chain\n`);

    // Step 3: Create additional referrals at various levels (to simulate tree structure)
    console.log('Step 3: Adding branch referrals...');

    const branches = [
      { parentLevel: 0, name: 'Mike', email: 'mike@demo.com' },
      { parentLevel: 0, name: 'Nancy', email: 'nancy@demo.com' },
      { parentLevel: 1, name: 'Oliver', email: 'oliver@demo.com' },
      { parentLevel: 2, name: 'Penny', email: 'penny@demo.com' },
    ];

    for (const branch of branches) {
      const parentCode = userTree[branch.parentLevel].referralCode;
      const user = await createUser({
        username: branch.name,
        email: branch.email,
        referralCode: parentCode,
      });

      await deposit(user.id, 3000 + Math.random() * 3000);
      console.log(`  ✓ Branch: ${user.username} → Level ${branch.parentLevel}`);
    }

    console.log('');

    // Step 4: Create active copies and distribute commissions on activation
    console.log('Step 4: Creating active copies (commissions on activation)...');

    const activeCopies = [
      { userLevel: 1, invested: 4000, bot: 'demo-btc-scalper' },
      { userLevel: 2, invested: 3000, bot: 'demo-eth-trader' },
      { userLevel: 3, invested: 5000, bot: 'demo-btc-scalper' },
      { userLevel: 4, invested: 2000, bot: 'demo-bnb-flipper' },
      { userLevel: 5, invested: 3500, bot: 'demo-eth-trader' },
      { userLevel: 6, invested: 4000, bot: 'demo-btc-scalper' },
      { userLevel: 7, invested: 2500, bot: 'demo-bnb-flipper' },
      { userLevel: 8, invested: 3000, bot: 'demo-btc-scalper' },
      { userLevel: 9, invested: 3000, bot: 'demo-eth-trader' },
      { userLevel: 10, invested: 2000, bot: 'demo-btc-scalper' },
      // Extra active copies to boost turnover thresholds
      { userLevel: 1, invested: 5000, bot: 'demo-eth-trader' },
      { userLevel: 2, invested: 4000, bot: 'demo-bnb-flipper' },
      { userLevel: 3, invested: 3500, bot: 'demo-eth-trader' },
      { userLevel: 5, invested: 4500, bot: 'demo-btc-scalper' },
    ];

    for (const active of activeCopies) {
      const user = userTree[active.userLevel];
      const copyId = createUserCopy(active.bot, active.invested, user.id);

      // Distribute commissions on bot activation
      await distributeReferralCommissions(user.id, copyId, active.invested);

      console.log(`  ✓ ${user.username}: Active copy ($${active.invested}) — commissions distributed`);
    }

    console.log('');

    // Step 5: Award turnover bonuses
    console.log('Step 5: Checking turnover bonuses...');

    for (let i = 0; i < userTree.length; i++) {
      const user = userTree[i];
      await checkAndAwardTurnoverBonuses(user.id);
    }

    console.log('  ✓ Turnover bonuses awarded\n');

    // Step 6: Create some closed copies (historical, no commissions)
    console.log('Step 6: Creating historical closed copies...');

    const closedScenarios = [
      { userLevel: 10, invested: 2000, pnl: 500, bot: 'demo-btc-scalper' },
      { userLevel: 8, invested: 1500, pnl: -200, bot: 'demo-btc-scalper' },
      { userLevel: 5, invested: 3500, pnl: -300, bot: 'demo-eth-trader' },
    ];

    for (const scenario of closedScenarios) {
      const user = userTree[scenario.userLevel];
      const copyId = createUserCopy(scenario.bot, scenario.invested, user.id);

      updateUserCopy(copyId, {
        status: 'CLOSED',
        closedAt: Date.now() - Math.random() * 86400000 * 7,
        finalPnL: scenario.pnl,
        finalValue: scenario.invested + scenario.pnl,
      });

      const result = scenario.pnl >= 0 ? 'profit' : 'loss';
      console.log(`  ✓ ${user.username}: Closed copy (${result} ${scenario.pnl >= 0 ? '+' : ''}$${scenario.pnl.toFixed(0)}) — no commissions`);
    }

    console.log('');

    // Step 7: Summary
    console.log('═══════════════════════════════════════');
    console.log('DEMO DATA SETUP COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log(`✓ Users: ${userTree.length} in main chain + 4 branches`);
    console.log(`✓ Active copies: ${activeCopies.length}`);
    console.log(`✓ Closed copies: ${closedScenarios.length}`);
    console.log(`✓ Commissions: Distributed on bot activation`);
    console.log(`✓ Turnover bonuses: Awarded where applicable`);
    console.log('═══════════════════════════════════════\n');

    console.log('📋 View in browser:');
    console.log('   http://localhost:3001/dashboard-v2/referrals\n');

    console.log('🔑 Test user credentials:');
    console.log(`   Root user: ${root.username} (${root.referralCode})`);
    console.log(`   Level 1: ${userTree[1].username} (${userTree[1].referralCode})`);
    console.log(`   Level 5: ${userTree[5].username} (${userTree[5].referralCode})\n`);

    console.log('✨ Demo data ready for testing!\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
})();
