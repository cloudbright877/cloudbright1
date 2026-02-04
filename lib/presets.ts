import type { BotConfig } from './trading/types';

/**
 * Risk profile definitions
 */
const RISK_PROFILES = {
  conservative: {
    leverage: 3,
    winRate: [0.70, 0.80],
    dailyTarget: [1.0, 2.0],
    capital: [3000, 5000],
    tradesPerDay: [30, 40],
  },
  moderate: {
    leverage: 5,
    winRate: [0.75, 0.85],
    dailyTarget: [2.0, 4.0],
    capital: [5000, 7000],
    tradesPerDay: [40, 60],
  },
  aggressive: {
    leverage: 10,
    winRate: [0.55, 0.70],
    dailyTarget: [4.0, 8.0],
    capital: [7000, 10000],
    tradesPerDay: [60, 80],
  },
} as const;

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'] as const;

/**
 * Calculate optimal P&L ranges based on win rate and daily target
 */
function calculatePnLRanges(
  winRate: number,
  dailyTargetPercent: number,
  tradesPerDay: number,
  leverage: number
): {
  winPnLMin: number;
  winPnLMax: number;
  lossPnLMin: number;
  lossPnLMax: number;
} {
  const expectedTrades = tradesPerDay;
  const wins = expectedTrades * winRate;
  const losses = expectedTrades * (1 - winRate);

  const avgWinNeeded = losses > 0 ? (dailyTargetPercent / wins) * (1 + losses / wins) : dailyTargetPercent / wins;

  const winPnLMin = avgWinNeeded * 0.5;
  const winPnLMax = avgWinNeeded * 1.5;

  const avgLoss = avgWinNeeded * (winRate / (1 - winRate)) * 0.8;
  const lossPnLMin = avgLoss * 0.5;
  const lossPnLMax = avgLoss * 1.5;

  return {
    winPnLMin: Math.max(0.5, winPnLMin),
    winPnLMax: Math.max(1.0, winPnLMax),
    lossPnLMin: Math.max(0.3, lossPnLMin),
    lossPnLMax: Math.max(0.5, lossPnLMax),
  };
}

/**
 * Generate a single bot configuration
 */
function generateBotConfig(
  risk: keyof typeof RISK_PROFILES,
  pair: typeof PAIRS[number],
  num: number
): BotConfig {
  const profile = RISK_PROFILES[risk];

  // Random values within ranges
  const winRate = random(profile.winRate[0], profile.winRate[1]);
  const dailyTarget = random(profile.dailyTarget[0], profile.dailyTarget[1]);
  const capital = randomInt(profile.capital[0], profile.capital[1]);
  const tradesPerDay = randomInt(profile.tradesPerDay[0], profile.tradesPerDay[1]);

  const ranges = calculatePnLRanges(winRate, dailyTarget, tradesPerDay, profile.leverage);

  // Duration based on risk (aggressive = faster, conservative = slower)
  let minDuration, maxDuration, maxPositions, openFreq;
  if (risk === 'conservative') {
    minDuration = 120000;  // 2min
    maxDuration = 600000;  // 10min
    maxPositions = 2;
    openFreq = 0.5;
  } else if (risk === 'moderate') {
    minDuration = 60000;   // 1min
    maxDuration = 300000;  // 5min
    maxPositions = 3;
    openFreq = 0.6;
  } else {
    minDuration = 30000;   // 30s
    maxDuration = 180000;  // 3min
    maxPositions = 4;
    openFreq = 0.7;
  }

  return {
    name: `${capitalize(risk)} Bot #${num}`,
    tradingPair: pair,
    investedCapital: capital,
    leverage: profile.leverage,
    allowedSides: 'BOTH',
    winRate,
    dailyTargetPercent: dailyTarget,
    tradesPerDay,
    minPositionSize: capital * 0.06,
    maxPositionSize: capital * 0.14,
    ...ranges,
    minDuration,
    maxDuration,
    maxConcurrentPositions: maxPositions,
    openFrequency: openFreq,
    maxSlippage: 0.5,
    maxTradesHistory: 100,
  };
}

/**
 * Generate 10 preset bot configurations
 * - 3 Conservative (3x leverage)
 * - 4 Moderate (5x leverage)
 * - 3 Aggressive (10x leverage)
 */
export function generatePresets(): BotConfig[] {
  const presets: BotConfig[] = [];

  // 3 Conservative bots
  presets.push(generateBotConfig('conservative', 'BTC/USDT', 1));
  presets.push(generateBotConfig('conservative', 'ETH/USDT', 2));
  presets.push(generateBotConfig('conservative', 'BNB/USDT', 3));

  // 4 Moderate bots
  presets.push(generateBotConfig('moderate', 'BTC/USDT', 1));
  presets.push(generateBotConfig('moderate', 'ETH/USDT', 2));
  presets.push(generateBotConfig('moderate', 'SOL/USDT', 3));
  presets.push(generateBotConfig('moderate', 'BNB/USDT', 4));

  // 3 Aggressive bots
  presets.push(generateBotConfig('aggressive', 'BTC/USDT', 1));
  presets.push(generateBotConfig('aggressive', 'ETH/USDT', 2));
  presets.push(generateBotConfig('aggressive', 'SOL/USDT', 3));

  return presets;
}

/**
 * Get a random preset config (for single bot creation)
 */
export function getRandomPreset(): BotConfig {
  const risks: Array<keyof typeof RISK_PROFILES> = ['conservative', 'moderate', 'aggressive'];
  const risk = risks[Math.floor(Math.random() * risks.length)];
  const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
  const num = Math.floor(Math.random() * 100) + 1;

  return generateBotConfig(risk, pair, num);
}

// Utility functions
function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max));
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
