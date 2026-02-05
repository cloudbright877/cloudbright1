/**
 * Test Script for Risk Management System
 *
 * Проверяет работу:
 * - DynamicPnLCalculator
 * - MarketFrictionSimulator
 * - StaggeredClosingManager
 */

import { TradingBot } from './lib/trading/TradingBot.ts';
import { dynamicPnLCalculator } from './lib/trading/DynamicPnLCalculator.ts';
import { marketFrictionSimulator } from './lib/trading/MarketFrictionSimulator.ts';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 Testing Risk Management System');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: DynamicPnLCalculator
console.log('1️⃣ Testing DynamicPnLCalculator');
console.log('─────────────────────────────────');

const pnlRange = dynamicPnLCalculator.calculatePnLRange({
  dailyTargetPercent: 4.5,
  tradesPerDay: 8,
  winRate: 0.65,
  leverageMin: 10,
  leverageMax: 15,
  currentDailyPnL: 0,
  tradesRemainingToday: 8,
});

console.log(`📊 P&L Range Calculated:`);
console.log(`   Mode: ${pnlRange.mode}`);
console.log(`   Win Range: ${pnlRange.winMin.toFixed(3)}% - ${pnlRange.winMax.toFixed(3)}%`);
console.log(`   Loss Range: ${pnlRange.lossMin.toFixed(3)}% - ${pnlRange.lossMax.toFixed(3)}%`);
console.log(`   Base Expected: ${pnlRange.baseExpected.toFixed(3)}%\n`);

// Test validation
const validation = dynamicPnLCalculator.validateConfiguration({
  dailyTargetPercent: 4.5,
  tradesPerDay: 8,
  winRate: 0.65,
  leverageMin: 10,
  leverageMax: 15,
});

if (validation) {
  console.log(`❌ Configuration Invalid:\n${validation}\n`);
} else {
  console.log(`✅ Configuration Valid\n`);
}

// Test 2: MarketFrictionSimulator
console.log('2️⃣ Testing MarketFrictionSimulator');
console.log('─────────────────────────────────');

const friction = marketFrictionSimulator.calculateFriction({
  tradingPair: 'BTC/USDT',
  positionSizeUSD: 1000,
  leverage: 10,
  side: 'LONG',
  volatility: 'medium',
});

console.log(`💸 Market Friction:`);
console.log(`   Slippage: ${friction.slippage.toFixed(4)}%`);
console.log(`   Spread: ${friction.spread.toFixed(4)}%`);
console.log(`   Funding Rate: ${friction.fundingRate >= 0 ? '+' : ''}${friction.fundingRate.toFixed(4)}%`);
console.log(`   Commission: ${friction.commission.toFixed(4)}%`);
console.log(`   ─────────────────────────`);
console.log(`   Total: ${friction.total >= 0 ? '+' : ''}${friction.total.toFixed(4)}%\n`);

// Test P&L with friction
const testPnL = 5.0;
const finalPnL = marketFrictionSimulator.applyFrictionToPnL(testPnL, friction);
console.log(`📉 P&L Application:`);
console.log(`   Before Friction: +${testPnL.toFixed(2)}%`);
console.log(`   After Friction: ${finalPnL >= 0 ? '+' : ''}${finalPnL.toFixed(2)}%`);
console.log(`   Impact: ${(finalPnL - testPnL).toFixed(3)}%\n`);

// Test 3: Create TradingBot and run simulation
console.log('3️⃣ Testing TradingBot with Risk Management');
console.log('─────────────────────────────────────────');

const testBot = new TradingBot('test-risk-bot', {
  name: 'Risk Management Test Bot',
  tradingPair: 'BTC/USDT',
  investedCapital: 10000,
  dailyTargetPercent: 4.5,
  tradesPerDay: 8,
  winRate: 0.65,
  leverage: 10,
  minPositionSize: 500,
  maxPositionSize: 1000,
  winPnLMin: 0.5,
  winPnLMax: 1.5,
  lossPnLMin: 0.3,
  lossPnLMax: 0.8,
  minDuration: 5000,   // 5 seconds for testing
  maxDuration: 20000,  // 20 seconds for testing
  maxConcurrentPositions: 3,
  openFrequency: 1.0,  // Always try to open
});

console.log(`🤖 Created Test Bot: ${testBot.id}`);
console.log(`   Capital: $${testBot.config.investedCapital}`);
console.log(`   Daily Target: ${testBot.config.dailyTargetPercent}%`);
console.log(`   Win Rate: ${(testBot.config.winRate * 100).toFixed(0)}%\n`);

// Simulate price feed
const prices = {
  BTCUSDT: 50000,
};

console.log('🔄 Running 20 simulation ticks (2s each)...\n');

let tickCount = 0;
const maxTicks = 20;

const simulationInterval = setInterval(() => {
  tickCount++;

  // Simulate price movement (-0.5% to +0.5%)
  const priceChange = (Math.random() - 0.5) * 0.01;
  prices.BTCUSDT *= (1 + priceChange);

  // Run bot tick
  testBot.tick(prices);

  // Get stats
  const stats = testBot.getStats();

  if (tickCount % 5 === 0) {
    console.log(`⏱️  Tick ${tickCount}/${maxTicks}`);
    console.log(`   BTC Price: $${prices.BTCUSDT.toFixed(2)}`);
    console.log(`   Open Positions: ${stats.positions.length}`);
    console.log(`   Total Trades: ${stats.tradesCount}`);
    console.log(`   Total P&L: ${stats.totalPnL >= 0 ? '+' : ''}$${stats.totalPnL.toFixed(2)}`);
    console.log(`   Win Rate: ${stats.winRate.toFixed(1)}%\n`);
  }

  if (tickCount >= maxTicks) {
    clearInterval(simulationInterval);

    // Final report
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Final Results');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const finalStats = testBot.getStats();
    console.log(`Total Trades: ${finalStats.tradesCount}`);
    console.log(`Wins: ${finalStats.winsCount} (${finalStats.winRate.toFixed(1)}%)`);
    console.log(`Losses: ${finalStats.lossesCount}`);
    console.log(`Total P&L: ${finalStats.totalPnL >= 0 ? '+' : ''}$${finalStats.totalPnL.toFixed(2)}`);
    console.log(`Avg Win: +$${finalStats.avgWin.toFixed(2)}`);
    console.log(`Avg Loss: $${finalStats.avgLoss.toFixed(2)}`);

    // Check recent trades for friction data
    console.log('\n💰 Recent Trades with Market Friction:');
    finalStats.trades.slice(0, 3).forEach((trade, i) => {
      console.log(`\n   Trade ${i + 1}:`);
      console.log(`   ${trade.side} ${trade.pair} @${trade.leverage}x`);
      console.log(`   Entry: $${trade.entryPrice.toFixed(2)} → Exit: $${trade.exitPrice.toFixed(2)}`);
      console.log(`   P&L: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)} (${trade.pnlPercent.toFixed(2)}%)`);

      if (trade.marketFriction) {
        console.log(`   Market Friction: ${trade.marketFriction.total.toFixed(3)}%`);
        console.log(`     - Slippage: ${trade.marketFriction.slippage.toFixed(3)}%`);
        console.log(`     - Spread: ${trade.marketFriction.spread.toFixed(3)}%`);
        console.log(`     - Funding: ${trade.marketFriction.fundingRate >= 0 ? '+' : ''}${trade.marketFriction.fundingRate.toFixed(3)}%`);
        console.log(`     - Commission: ${trade.marketFriction.commission.toFixed(3)}%`);
      }

      if (trade.hadSlippage) {
        console.log(`   Slippage Applied: ${trade.slippageAmount?.toFixed(3)}%`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Risk Management System Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  }
}, 2000); // 2 seconds per tick
