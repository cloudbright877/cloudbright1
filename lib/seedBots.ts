import { createUserCopy, getAllUserCopies } from './userCopies';
import { getAllDemoBots } from './demoMarketplace';

/**
 * Seeds the system with demo user copies if none exist
 * This creates 3 initial copies to demo the functionality
 */
export function seedUserCopies(): void {
  if (typeof window === 'undefined') {
    console.log('[Seed] Skipping seed (SSR environment)');
    return;
  }

  const existingCopies = getAllUserCopies();
  if (existingCopies.length > 0) {
    console.log(`[Seed] Copies already exist (${existingCopies.length}), skipping seed`);
    return;
  }

  console.log('[Seed] Creating initial user copies...');

  const demoBots = getAllDemoBots();

  // Create 3 copies of different bots with different investment amounts
  const seedData = [
    { demoBot: demoBots[0], investment: 2000 }, // BTC Scalper Pro
    { demoBot: demoBots[1], investment: 3000 }, // ETH Trend Master
    { demoBot: demoBots[3], investment: 5000 }, // SOL Breakout Hunter
  ];

  let createdCount = 0;

  seedData.forEach(({ demoBot, investment }) => {
    if (demoBot) {
      try {
        const copyId = createUserCopy(demoBot.id, investment);
        console.log(`[Seed] Created copy ${copyId} of ${demoBot.name} ($${investment})`);
        createdCount++;
      } catch (err) {
        console.error(`[Seed] Failed to create copy of ${demoBot.name}:`, err);
      }
    }
  });

  console.log(`[Seed] Successfully created ${createdCount} user copies`);
}
