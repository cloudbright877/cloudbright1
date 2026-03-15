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
 * Minimum investment per bot ($50)
 */
const MIN_PER_BOT = 50;

/**
 * Risk allocation matrix (ADR-2)
 * Tiers are sorted by priority (highest % first) for each profile
 */
const RISK_ALLOCATIONS: Record<RiskProfile, { low: number; medium: number; high: number }> = {
  conservative: { low: 60, medium: 30, high: 10 },
  balanced: { low: 25, medium: 50, high: 25 },
  aggressive: { low: 10, medium: 30, high: 60 },
};

/**
 * Primary tier for each risk profile (used when only 1 bot fits)
 */
const PRIMARY_TIER: Record<RiskProfile, 'low' | 'medium' | 'high'> = {
  conservative: 'low',
  balanced: 'medium',
  aggressive: 'high',
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
 * Returns 1-3 bots with allocation based on risk profile and investment amount.
 *
 * Logic:
 * - Each bot must receive at least $50 (MIN_PER_BOT)
 * - $50-99  → 1 bot  (primary tier for the profile)
 * - $100-149 → 2 bots (two tiers with highest %)
 * - $150+   → 3 bots (all tiers; $50 guaranteed per bot, remainder split by %)
 */
export function selectBots(answers: QuizAnswers): BotAllocation[] {
  const verifiedBots = DEMO_BOTS.filter(bot => bot.verified);

  if (verifiedBots.length === 0) {
    throw new Error('No verified bots available');
  }

  const { investmentAmount, riskProfile, timeHorizon } = answers;
  const allocation = RISK_ALLOCATIONS[riskProfile];

  // Select best bot from each tier
  const botsByTier: Record<'low' | 'medium' | 'high', DemoBot | null> = {
    low: selectBestBotFromTier(verifiedBots, 'low', timeHorizon),
    medium: selectBestBotFromTier(verifiedBots, 'medium', timeHorizon),
    high: selectBestBotFromTier(verifiedBots, 'high', timeHorizon),
  };

  type Tier = 'low' | 'medium' | 'high';
  type TierEntry = { tier: Tier; percent: number };

  // Sort tiers by allocation % descending to prioritize
  const allTiers: TierEntry[] = [
    { tier: 'low' as Tier, percent: allocation.low },
    { tier: 'medium' as Tier, percent: allocation.medium },
    { tier: 'high' as Tier, percent: allocation.high },
  ];
  const tiers = allTiers
    .filter((t): t is TierEntry => t.percent > 0 && botsByTier[t.tier] !== null)
    .sort((a, b) => b.percent - a.percent);

  // Determine how many bots we can afford (each needs MIN_PER_BOT)
  const maxBots = Math.min(tiers.length, Math.floor(investmentAmount / MIN_PER_BOT));

  if (maxBots === 0) {
    throw new Error(`Minimum investment is $${MIN_PER_BOT}`);
  }

  // If we can't fit all tiers, keep only the highest-priority ones
  // But always include the primary tier for the profile
  let selectedTiers = tiers.slice(0, maxBots);
  const primary = PRIMARY_TIER[riskProfile];
  const hasPrimary = selectedTiers.some(t => t.tier === primary);
  if (!hasPrimary) {
    const primaryTier = tiers.find(t => t.tier === primary);
    if (primaryTier) {
      selectedTiers[selectedTiers.length - 1] = primaryTier;
    }
  }

  // Recalculate percentages proportionally among selected tiers
  const totalPercent = selectedTiers.reduce((sum, t) => sum + t.percent, 0);

  // Reserve MIN_PER_BOT for each bot, distribute remainder by proportional %
  const reserved = maxBots * MIN_PER_BOT;
  const remainder = investmentAmount - reserved;

  const allocations: BotAllocation[] = selectedTiers.map(({ tier, percent }) => {
    const bot = botsByTier[tier]!;
    const proportionalPercent = (percent / totalPercent) * 100;
    const amount = MIN_PER_BOT + (remainder * percent) / totalPercent;

    return {
      bot,
      allocationPercent: Math.round(proportionalPercent * 10) / 10,
      amount: Math.round(amount * 100) / 100,
      rationale: generateRationale(bot, tier, timeHorizon),
    };
  });

  return allocations;
}
