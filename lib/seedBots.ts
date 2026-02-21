import { createUserCopy, getAllUserCopies } from './userCopies';
import { getAllDemoBots } from './demoMarketplace';

/**
 * Seeds the system with demo user copies if none exist
 * This creates 3 initial copies to demo the functionality
 */
export function seedUserCopies(): void {
  if (typeof window === 'undefined') return;

  const existingCopies = getAllUserCopies();
  if (existingCopies.length > 0) return;

  const demoBots = getAllDemoBots();

  const seedData = [
    { demoBot: demoBots[0], investment: 2000 },
    { demoBot: demoBots[1], investment: 3000 },
    { demoBot: demoBots[3], investment: 5000 },
  ];

  seedData.forEach(({ demoBot, investment }) => {
    if (demoBot) {
      try {
        createUserCopy(demoBot.id, investment);
      } catch {
        // silently skip failed seeds
      }
    }
  });
}
