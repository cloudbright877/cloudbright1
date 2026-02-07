import { DEMO_BOTS, type DemoBot } from './demoMarketplace';

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type TimeHorizon = 'short' | 'medium' | 'long';

export interface QuizAnswers {
  investmentAmount: number;
  riskProfile: RiskProfile;
  timeHorizon: TimeHorizon;
}

export interface BotAllocation {
  bot: DemoBot;
  allocationPercent: number;
  amount: number;
  rationale: string;
}

/**
 * Risk allocation matrix (ADR-2)
 */
const RISK_ALLOCATIONS: Record<RiskProfile, { low: number; medium: number; high: number }> = {
  conservative: { low: 60, medium: 30, high: 10 },
  balanced: { low: 25, medium: 50, high: 25 },
  aggressive: { low: 10, medium: 30, high: 60 },
};

/**
 * Score bots based on time horizon preference
 * - short: prefer high frequency (more trades per day)
 * - medium: balanced frequency
 * - long: prefer high returns (higher daily target)
 */
function scoreBotForTimeHorizon(bot: DemoBot, timeHorizon: TimeHorizon): number {
  const tradesPerDay = bot.config.tradesPerDay;
  const dailyTarget = bot.config.dailyTargetPercent;

  switch (timeHorizon) {
    case 'short':
      // Prefer high-frequency bots (more trades = more opportunities)
      return tradesPerDay / 100; // Normalize to 0-3 range
    case 'medium':
      // Balanced scoring
      return (tradesPerDay / 100 + dailyTarget) / 2;
    case 'long':
      // Prefer high-return bots
      return dailyTarget;
  }
}

/**
 * Select best bot from a risk tier
 */
function selectBestBotFromTier(
  bots: DemoBot[],
  riskTier: 'low' | 'medium' | 'high',
  timeHorizon: TimeHorizon
): DemoBot | null {
  const tierBots = bots.filter(bot => bot.risk === riskTier);

  if (tierBots.length === 0) return null;

  // Score and sort by time horizon preference
  const scored = tierBots.map(bot => ({
    bot,
    score: scoreBotForTimeHorizon(bot, timeHorizon),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0].bot;
}

/**
 * Generate rationale for bot selection
 */
function generateRationale(
  bot: DemoBot,
  riskTier: 'low' | 'medium' | 'high',
  timeHorizon: TimeHorizon
): string {
  const riskLabels = {
    low: 'conservative',
    medium: 'balanced',
    high: 'aggressive',
  };

  const horizonLabels = {
    short: 'short-term',
    medium: 'medium-term',
    long: 'long-term',
  };

  const reasons = [
    `${bot.name} is a ${riskLabels[riskTier]} bot`,
    `${bot.config.tradesPerDay} trades/day`,
    `${bot.stats.winRate}% win rate`,
  ];

  if (timeHorizon === 'short') {
    reasons.push('high-frequency trading');
  } else if (timeHorizon === 'long') {
    reasons.push(`${bot.config.dailyTargetPercent}% daily target`);
  }

  return reasons.join(', ');
}

/**
 * Main bot selection algorithm
 * Returns 2-3 bots with allocation based on risk profile
 */
export function selectBots(answers: QuizAnswers): BotAllocation[] {
  // Filter verified bots only
  const verifiedBots = DEMO_BOTS.filter(bot => bot.verified);

  if (verifiedBots.length === 0) {
    throw new Error('No verified bots available');
  }

  // Get risk allocation percentages
  const allocation = RISK_ALLOCATIONS[answers.riskProfile];

  // Select best bot from each tier
  const lowBot = selectBestBotFromTier(verifiedBots, 'low', answers.timeHorizon);
  const mediumBot = selectBestBotFromTier(verifiedBots, 'medium', answers.timeHorizon);
  const highBot = selectBestBotFromTier(verifiedBots, 'high', answers.timeHorizon);

  // Build allocation array (only include tiers with >0% allocation)
  const allocations: BotAllocation[] = [];

  if (lowBot && allocation.low > 0) {
    allocations.push({
      bot: lowBot,
      allocationPercent: allocation.low,
      amount: (answers.investmentAmount * allocation.low) / 100,
      rationale: generateRationale(lowBot, 'low', answers.timeHorizon),
    });
  }

  if (mediumBot && allocation.medium > 0) {
    allocations.push({
      bot: mediumBot,
      allocationPercent: allocation.medium,
      amount: (answers.investmentAmount * allocation.medium) / 100,
      rationale: generateRationale(mediumBot, 'medium', answers.timeHorizon),
    });
  }

  if (highBot && allocation.high > 0) {
    allocations.push({
      bot: highBot,
      allocationPercent: allocation.high,
      amount: (answers.investmentAmount * allocation.high) / 100,
      rationale: generateRationale(highBot, 'high', answers.timeHorizon),
    });
  }

  // Ensure we have at least 2 bots
  if (allocations.length === 0) {
    throw new Error('No suitable bots found for allocation');
  }

  return allocations;
}
