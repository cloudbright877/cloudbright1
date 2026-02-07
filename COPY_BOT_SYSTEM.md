# Copy Bot System Documentation

## Overview

The Copy Bot System is a **managed P&L copy-trading platform** where users can copy pre-configured "master bots" that simulate professional trading strategies. The system uses a sophisticated 6-layer convergence algorithm to ensure realistic trading patterns while meeting daily profit targets.

**Key Principles:**
- **Master Bots** = Full TradingBot instances (1 per master bot, ~10 total)
- **User Copies** = Lightweight records with proportional stats scaling
- **Managed P&L** = Pre-determined outcomes with 6-layer convergence
- **Realistic Trading** = Staggered closures, trend-based entries, dynamic TP/SL

**Current Status (2026-02-07):**
- ✅ Days 0-5: Foundation + ConvergenceController implemented
- ✅ Day 10: Wide mode P&L formula bug fixed
- ✅ Day 12: Performance optimization completed
- ⏸️ Day 2: PriceService postponed (backend migration)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     COPY BOT SYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ Master Bots  │      │ User Copies  │                    │
│  │ (10 bots)    │─────>│ (lightweight)│                    │
│  │ TradingBot   │      │ records only │                    │
│  │ instances    │      └──────────────┘                    │
│  └──────────────┘              │                           │
│         │                      │                           │
│         v                      v                           │
│  ┌──────────────────────────────────┐                     │
│  │   Convergence System (6 layers)  │                     │
│  │   - Position sizing              │                     │
│  │   - Entry timing                 │                     │
│  │   - TP/SL adjustment             │                     │
│  │   - Early exit                   │                     │
│  │   - Frequency control            │                     │
│  │   - Micro-steering               │                     │
│  └──────────────────────────────────┘                     │
│         │                                                  │
│         v                                                  │
│  ┌──────────────────────────────────┐                     │
│  │  DynamicPnLCalculator            │                     │
│  │  (Daily target → P&L ranges)     │                     │
│  └──────────────────────────────────┘                     │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │ Admin UI     │      │ User UI      │                   │
│  │ /admin/bots  │      │ /copy-bots   │                   │
│  └──────────────┘      └──────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin creates master bot** → Saved to `DEMO_BOTS` array (or localStorage override)
2. **User browses marketplace** → `/dashboard-v2/copy-bots` displays DEMO_BOTS
3. **User copies bot** → `createUserCopy()` saves lightweight record to localStorage
4. **Master bot trades** → TradingBot instance simulates trading with convergence
5. **Stats calculated** → `getUserCopyStats()` scales master stats proportionally
6. **User views details** → `/dashboard-v2/copy/[copyId]` shows real-time updates

### Critical Architecture Principle

**IMPORTANT:** User copies are **NOT** TradingBot instances!

```typescript
// ✅ CORRECT: Lightweight copy record
const copy = {
  id: 'copy_123',
  masterBotId: 'bybit-market-maker',
  investedAmount: 5000,
  status: 'ACTIVE',
};

// ❌ WRONG: Creating TradingBot for copy
const bot = new TradingBot('copy_123', config); // Throws error!
```

**Why?** Creating 1000s of TradingBot instances for user copies would:
- Consume excessive memory (each bot = full state machine)
- Require individual tick processing (performance disaster)
- Duplicate identical trading logic

**Solution:** Single master bot trades, user copies scale stats proportionally:
```typescript
userPnL = masterPnL × (userInvestment / masterCapital)
```

---

## Master Bots

### Master Bot Structure

Located in `lib/demoMarketplace.ts` → `DEMO_BOTS` array

```typescript
interface DemoBot {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Strategy description
  icon: string;                  // Icon URL (from /bots/)
  config: BotConfig;            // Full trading configuration
  stats: {
    totalPnL: number;            // Cumulative P&L ($)
    roi: number;                 // Return on investment (%)
    winRate: number;             // Win percentage
    totalTrades: number;         // Total closed trades
    activeCopiers: number;       // Number of users copying
  };
  minInvestment: number;         // Minimum copy amount
  maxInvestment: number;         // Maximum copy amount
}
```

### Pre-configured Master Bots (10 Total)

1. **Bybit Market Maker** - Aggressive, high-frequency (75% WR, 10-20x leverage)
2. **Bitfinex Leverage x10** - Conservative, stable (70% WR, 5-15x leverage)
3. **Binance Scalper** - Balanced, moderate (65% WR, 8-18x leverage)
4. **Kraken Position** - Conservative, low-risk (60% WR, 5-12x leverage)
5. **OKX Swing** - Balanced, medium-term (68% WR, 10-15x leverage)
6. **HTX Lightning** - Aggressive, high-risk (72% WR, 15-25x leverage)
7. **Gate.io Smart** - Balanced, algorithmic (67% WR, 8-16x leverage)
8. **MEXC Thunder** - Aggressive, explosive (78% WR, 12-22x leverage)
9. **Coinbase Pro** - Conservative, institutional (62% WR, 5-10x leverage)
10. **Kucoin Velocity** - Balanced, fast (69% WR, 10-18x leverage)

### Bot Configuration Parameters

```typescript
interface BotConfig {
  // Identity
  name: string;                  // Bot name

  // Capital
  capital: number;               // Starting capital ($)

  // Position sizing
  minPositionSize: number;       // Min position size ($)
  maxPositionSize: number;       // Max position size ($)

  // Duration
  minDuration: number;           // Min position hold time (ms)
  maxDuration: number;           // Max position hold time (ms)

  // Target
  winRate: number;               // Target win rate (0-1)
  dailyTargetPercent?: number;   // Daily target (% of capital)
  tradesPerDay?: number;         // Expected trades per day

  // Risk
  maxOpenPositions: number;      // Max concurrent positions
  pairs: string[];               // Trading pairs
  leverage: { min: number; max: number };

  // Style
  tradingStyle: 'conservative' | 'balanced' | 'aggressive';
  riskLevel: 'low' | 'medium' | 'high';

  // Advanced
  staggeredClosing?: {
    enabled: boolean;
    maxClosuresInWindow: number;
    windowDurationSec: number;
    minDelayBetweenSec: number;
    maxDelayBetweenSec: number;
  };
}
```

---

## User Copies

### Copy Data Structure

```typescript
interface CopyData {
  id: string;                    // Format: 'copy_${timestamp}_${random}'
  userId: string;                // User identifier
  masterBotId: string;           // Reference to master bot
  investedAmount: number;        // User's investment ($)
  currentValue: number;          // Current value (invested + P&L)
  pnl: number;                   // Profit/Loss ($)
  pnlPercent: number;            // P&L as %
  status: 'ACTIVE' | 'CLOSING' | 'CLOSED';
  createdAt: string;             // ISO timestamp
  closedAt?: string;             // ISO timestamp (if closed)
}
```

### Storage

**Location:** `localStorage` key = `'user_copies'`

```typescript
// Reading copies
const copies = getUserCopies(userId);

// Creating copy
const copy = createUserCopy(masterBotId, userId, investAmount);

// Getting stats
const stats = getUserCopyStats(copyId); // Returns BotStats

// Closing copy
closeUserCopy(copyId);

// Deleting copy
deleteUserCopy(copyId);
```

### Copy Lifecycle

```
ACTIVE
  ├─> User is actively copying
  ├─> Stats update every 2s
  ├─> Can pause/resume
  └─> Can close
      ↓
CLOSING
  ├─> User requested close
  ├─> Waiting for positions to close
  └─> Finalizing P&L
      ↓
CLOSED
  ├─> Copy stopped
  ├─> Final stats recorded
  └─> Can be deleted
```

### Stats Calculation (Proportional Scaling)

User copy stats are calculated by scaling master bot stats:

```typescript
// Example: User invested $5,000, master bot has $10,000 capital
const ratio = 5000 / 10000; // 0.5

// Scale all stats
userStats = {
  totalPnL: masterStats.totalPnL * ratio,     // $250 → $125
  roi: masterStats.roi,                        // 2.5% (same)
  winRate: masterStats.winRate,                // 75% (same)
  totalTrades: masterStats.totalTrades,        // 150 (same)

  // Scale positions
  activePositions: masterPositions.map(pos => ({
    ...pos,
    positionSize: pos.positionSize * ratio,    // $500 → $250
    pnl: pos.pnl * ratio,                      // $25 → $12.50
  })),

  // Scale trades
  trades: masterTrades.slice(0, 50).map(trade => ({
    ...trade,
    positionSize: trade.positionSize * ratio,
    pnl: trade.pnl * ratio,
  })),
};
```

**File:** `lib/userCopyStats.ts`

---

## Managed P&L System

### Overview

The system **pre-determines** trade outcomes (win/loss) based on target win rate, then uses a 6-layer convergence system to ensure daily profit targets are met while maintaining realistic trading patterns.

**Key Concept:** `shouldWin` flag

```typescript
interface Position {
  shouldWin: boolean;  // Pre-determined: true = win, false = loss
  targetPnL: number;   // Target profit % (e.g., 1.2%)
  stopLossPnL: number; // Target loss % (e.g., -0.8%)
  // ... other fields
}
```

When opening position:
1. Roll dice: `Math.random() < config.winRate` → determines `shouldWin`
2. Calculate target P&L from `DynamicPnLCalculator`
3. Open position with pre-determined outcome
4. Convergence layers guide position to target
5. Close when TP/SL reached (with slippage to match target exactly)

### DynamicPnLCalculator

**Purpose:** Convert daily target (% of capital) → individual trade P&L ranges

**Input:**
```typescript
const params = {
  dailyTargetPercent: 2.5,  // 2.5% of capital per day
  tradesPerDay: 250,        // 250 trades per day
  winRate: 0.75,            // 75% win rate
  leverageMin: 10,
  leverageMax: 20,
  tightModePercent: 80,     // 80% tight, 20% wide
};
```

**Output:**
```typescript
const pnlRange = {
  winMin: 0.8,    // Minimum win (% of capital)
  winMax: 1.6,    // Maximum win (% of capital)
  lossMin: 0.4,   // Minimum loss (% of capital)
  lossMax: 0.9,   // Maximum loss (% of capital)
  baseExpected: 1.2,  // Expected value
  mode: 'tight',  // or 'wide'
};
```

**Formula:**
```
avgWinPnL = (dailyTarget / tradesPerDay) / winRate
avgLossPnL = avgWinPnL × winRate / (1 - winRate)

Example:
  dailyTarget = 2.5% of capital
  tradesPerDay = 250
  winRate = 75%

  avgWinPnL = (2.5 / 250) / 0.75 = 0.0133% per winning trade
  avgLossPnL = 0.0133 × 0.75 / 0.25 = 0.04% per losing trade
```

**Tight vs Wide Mode:**
- **Tight (80%):** Lower variance (winMin ±60%, winMax ±60%)
- **Wide (20%):** Higher variance (winMin ±60%, winMax ±120%)

**Recent Fix (Bug #6, Day 10):**
- **Problem:** Wide mode had asymmetric distribution (winMin=0.8×base, winMax=2-4×base)
- **Result:** Average = 1.9×base → systematic +23.4% bias
- **Fix:** Symmetric distribution (winMin=base-60%, winMax=base+120%)
- **Validation:** Deviation reduced from 23.4% → 0.7%

**File:** `lib/trading/DynamicPnLCalculator.ts`

---

## 7-Layer Convergence System

The convergence system minimizes correction at close to < 0.1% (invisible slippage).

### Layer 0: Random Base P&L

**Purpose:** Generate diverse outcomes across bots

**Logic:**
```typescript
const shouldWin = Math.random() < config.winRate;
const pnlRange = dynamicPnLCalculator.generatePnLRange();

if (shouldWin) {
  targetPnL = pnlRange.winMin + Math.random() * (pnlRange.winMax - pnlRange.winMin);
} else {
  stopLossPnL = -(pnlRange.lossMin + Math.random() * (pnlRange.lossMax - pnlRange.lossMin));
}
```

**Result:** Each trade has unique P&L target within calibrated range

---

### Layer 1: Position Size Adjustment

**Purpose:** Accelerate convergence when behind, decelerate when ahead

**Formula:**
```typescript
const progress = (currentPnL / dailyTarget) * 100;

let sizeMultiplier;
if (progress < 30) {
  sizeMultiplier = 1.0;  // Normal size when behind
} else if (progress < 100) {
  sizeMultiplier = 1.0;  // Normal size approaching target
} else if (progress < 120) {
  sizeMultiplier = 0.5;  // Half size when ahead
} else {
  sizeMultiplier = 0.2;  // Tiny size when far ahead
}

positionSize = baseSize * sizeMultiplier;
```

**CRITICAL:** When behind (< 30%), multiplier is **1.0x**, NOT boosted!
- Reason: Stacking with DailyController would create 3.0x inflation
- Only personality (0.8-1.2x) varies size
- Combined max: 1.2x (not 4.29x as in old bug)

**File:** `lib/trading/convergence/ConvergenceController.ts:50-76`

---

### Layer 2: Entry Timing (Technical Analysis Filter)

**Purpose:** Only open positions when trend supports the direction

**Logic:**
```typescript
// SimpleTrendDetector
const trend = detectTrend(prices, pair);
// Returns: 'up' | 'down' | 'flat'

// Entry rules
if (side === 'LONG' && trend !== 'up') {
  return false;  // Skip LONG if not uptrend
}
if (side === 'SHORT' && trend !== 'down') {
  return false;  // Skip SHORT if not downtrend
}

// Trend matches → allow entry
return true;
```

**Implementation:** `lib/trading/SimpleTrendDetector.ts`

**Result:** Positions only open with favorable conditions (realistic trading)

---

### Layer 3: TP/SL Adjustment

**Purpose:** Adjust TP/SL based on daily progress

**Formula:**
```typescript
const progress = (currentPnL / dailyTarget) * 100;

let tpMult, slMult;
if (progress < 30) {
  tpMult = 1.0;  // Normal TP when behind
  slMult = 1.0;
} else if (progress < 100) {
  tpMult = 0.7;  // Start reducing TP
  slMult = 1.1;
} else if (progress < 120) {
  tpMult = 0.4;  // Micro-trades when ahead
  slMult = 1.3;
} else {
  tpMult = 0.2;  // Very small trades far ahead
  slMult = 1.5;
}

finalTP = baseTP * tpMult;  // Apply multiplier
finalSL = baseSL * slMult;
```

**Minimum TP Threshold (Bug Fix):**
```typescript
const MIN_TP_PERCENT = 0.5; // Never allow TP < 0.5%
finalTP = Math.max(MIN_TP_PERCENT, baseTP * tpMult);
```

**Why?** When progress > 120%, TP was 0.1-0.4%, causing micro-trades closing in 9-32s.

**File:** `lib/trading/convergence/ConvergenceController.ts:136-183`

---

### Layer 4: Early Exit

**Purpose:** Close winning positions early when ahead to prevent overperformance

**Logic:**
```typescript
const progress = (currentPnL / dailyTarget) * 100;

if (progress > 100 && shouldWin && realPnlPercent > 0) {
  // Chance to exit early increases with progress
  const exitChance = progress < 110 ? 0.3 : progress < 120 ? 0.5 : 0.7;

  if (Math.random() < exitChance) {
    closePosition();  // Natural exit (no slippage needed)
  }
}
```

**Result:** Prevents runaway profits (keeps daily target realistic)

**File:** `lib/trading/convergence/ConvergenceController.ts:185-203`

---

### Layer 5: Frequency Control

**Purpose:** Reduce trade frequency when ahead

**Logic:**
```typescript
const progress = (currentPnL / dailyTarget) * 100;

let frequencyMult;
if (progress < 100) {
  frequencyMult = 1.0;  // Normal frequency
} else if (progress < 120) {
  frequencyMult = 0.5;  // Half frequency
} else {
  frequencyMult = 0.2;  // Very low frequency
}

// Skip opening position
if (Math.random() > frequencyMult) {
  return;  // Don't open
}
```

**Result:** Fewer trades when ahead (conserves gains)

**File:** `lib/trading/convergence/ConvergenceController.ts:205-223`

---

### Layer 6: Micro-Steering (Final Adjustment)

**Purpose:** Final ±0.08% adjustment in last 10 trades if deviation > 10%

**Logic:**
```typescript
const tradesRemaining = tradesPerDay - currentTrades;
const deviation = ((currentPnL - targetPnL) / targetPnL) * 100;

if (tradesRemaining <= 10 && Math.abs(deviation) > 10) {
  // Calculate needed correction
  const correctionPerTrade = (targetPnL - currentPnL) / tradesRemaining;
  const microSteering = Math.min(0.08, Math.max(-0.08, correctionPerTrade));

  // Apply to finalPnlPercent
  finalPnlPercent += microSteering;
}
```

**CRITICAL BUG FIX (2026-02-07):**
After Layer 6 modifies `finalPnlPercent`, must recalculate `exitPrice`:

```typescript
if (microSteering !== 0) {
  finalPnlPercent += microSteering;

  // ✅ RECALCULATE exitPrice to match new finalPnlPercent
  exitPrice = recalculateExitPrice(
    entryPrice,
    finalPnlPercent,
    leverage,
    side
  );
}
```

**Why?** Before fix, `exitPrice` and `pnl` were mathematically inconsistent.

**File:** `lib/trading/convergence/ConvergenceController.ts:225-243`

---

### Convergence Metrics

```typescript
interface ConvergenceMetrics {
  dailyProgress: number;        // (currentPnL / target) × 100
  tradesRemaining: number;      // tradesPerDay - currentTrades
  deviation: number;            // % deviation from target
  activeLayer: number;          // Dominant layer (0-6)
  shouldForceStagger: boolean;  // Force staggered closing?
}
```

**File:** `lib/trading/convergence/ConvergenceController.ts:13-19`

---

## Trading Engine (TradingBot)

### TradingBot Class

**File:** `lib/trading/TradingBot.ts`

**Key Methods:**
```typescript
class TradingBot {
  tick(prices: Record<string, number>): void;
  getStats(): BotStats;
  getPositions(): Position[];
  save(): void;
  load(): void;

  private openPosition(pair: string, side: 'LONG' | 'SHORT', price: number): void;
  private managePositions(): void;
  private closePosition(pos: Position, needsSlippage: boolean, realPnlPercent: number): void;
}
```

### Position Lifecycle

```
1. OPEN
   ├─> Check convergence metrics
   ├─> Calculate target P&L (DynamicPnLCalculator)
   ├─> Determine shouldWin (random < winRate)
   ├─> Apply Layer 1 (position sizing)
   ├─> Check Layer 2 (trend filter)
   ├─> Skip if Layer 5 (frequency control)
   └─> Create position with pre-determined outcome
       ↓
2. TICK
   ├─> Update currentPrice
   ├─> Calculate realPnlPercent
   ├─> Check if minDuration passed (60s minimum)
   ├─> Check if TP/SL reached (Layer 3)
   ├─> Check Layer 4 (early exit)
   └─> Wait or close
       ↓
3. CLOSE
   ├─> Calculate slippage needed (target - real)
   ├─> Adjust exitPrice to match target
   ├─> Apply Layer 6 (micro-steering)
   ├─> Recalculate exitPrice if Layer 6 applied
   ├─> Apply flip prevention
   ├─> Record trade
   └─> Update stats
```

### Position Structure

```typescript
interface Position {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  amount: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  duration: string;

  // Managed P&L fields
  shouldWin: boolean;        // Pre-determined outcome
  targetPnL: number;         // Target profit %
  stopLossPnL: number;       // Target loss %
  scheduledCloseAt?: number; // For staggered closing

  // Convergence fields
  pnlRange?: {
    mode: 'tight' | 'wide';
    baseExpected: number;
  };
  favorabilityScore?: number;
  convergenceLayer?: number;
}
```

### Trade Structure

```typescript
interface Trade {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  duration: string;
  closedAt: string;

  // Metadata
  shouldWin: boolean;
  slippageApplied?: boolean;
  slippageReason?: string;
}
```

### Recent Bug Fixes (2026-02-07)

**Bug: P&L Mathematical Inconsistency**

**Problem:**
```typescript
// Layer 6 modified finalPnlPercent but NOT exitPrice
finalPnlPercent += microSteering;  // Changed P&L
// exitPrice unchanged! ❌

// Result: Mathematically impossible trades
// ETH SHORT: Entry $2013.67 → Exit $2013.80 (price up), P&L +$0.01
// Expected: P&L should be negative (SHORT loses when price rises)
```

**Fix:**
```typescript
private recalculateExitPrice(
  entryPrice: number,
  pnlPercent: number,
  leverage: number,
  side: 'LONG' | 'SHORT'
): number {
  const priceChangePercent = pnlPercent / (leverage * 100);
  const priceChange = entryPrice * priceChangePercent;

  return side === 'LONG'
    ? entryPrice + priceChange
    : entryPrice - priceChange;
}

// Apply after Layer 6
if (microSteering !== 0) {
  finalPnlPercent += microSteering;
  exitPrice = this.recalculateExitPrice(entryPrice, finalPnlPercent, leverage, side);
}
```

**Bug: minDuration Bypassed by TP/SL**

**Problem:**
```typescript
// OLD CODE
if (realPnlPercent >= pos.targetPnL) {
  shouldClose = true;  // Closes immediately, even if only 9s passed!
}
```

**Fix:**
```typescript
// NEW CODE
if (realPnlPercent >= pos.targetPnL) {
  if (duration >= minDuration) {
    shouldClose = true;  // Only close after minDuration
  } else {
    remainingPositions.push(pos);  // Wait
    return;
  }
}
```

---

## Admin Interface

### Location

`/dashboard-v2/admin/bots`

### Features

1. **View Master Bots** - Grid of all DEMO_BOTS
2. **Create Bot** - AdminBotModal with preset system
3. **Edit Bot** - Modify existing bot configuration
4. **Delete Bot** - Remove from DEMO_BOTS
5. **Preview** - See bot card before saving

### 4-Parameter Preset System

**File:** `lib/trading/convergence/PresetMapper.ts`

**Inputs:**
```typescript
interface PresetInputs {
  dailyTargetPercent: number;  // 1.0-5.0% (Daily target)
  tradesPerDay: number;        // 50-500 (Trading frequency)
  character: 'Conservative' | 'Balanced' | 'Aggressive';
  convergenceMode: 'Maximum Realism' | 'Balanced Convergence' | 'Fast Convergence';
}
```

**Valid Combinations:** 9 total (3 characters × 3 modes)

**Character → Parameters:**
- **Conservative:** winRate 60%, leverage 5-12x, tight mode 90%
- **Balanced:** winRate 70%, leverage 10-15x, tight mode 80%
- **Aggressive:** winRate 80%, leverage 15-25x, tight mode 70%

**Convergence Mode → Thresholds:**
- **Maximum Realism:** Layer 6 triggers at 20% deviation, 5 trades remaining
- **Balanced:** Layer 6 triggers at 10% deviation, 10 trades remaining
- **Fast:** Layer 6 triggers at 5% deviation, 20 trades remaining

**Output:** Full BotConfig (validated by BotValidator)

### AdminBotModal Component

**File:** `components/dashboard-v2/AdminBotModal.tsx`

**Sections:**
1. **Basic Info** - Name, description, icon URL
2. **Preset Selection** - 4 parameters (daily target, trades/day, character, mode)
3. **Validation Preview** - Real-time formula validation
4. **Manual Override** - Advanced users can customize all parameters

**Validation:**
```typescript
// BotValidator checks formula convergence
const validation = validateBotConfig(config);

if (validation.valid) {
  // Show: ✅ Formula converges to target
} else {
  // Show: ❌ Formula error (e.g., "avgLoss > avgWin")
  // Block saving
}
```

---

## User Marketplace

### Location

`/dashboard-v2/copy-bots`

### Features

1. **Browse Master Bots** - Grid layout with bot cards
2. **Filter/Sort** - By performance, risk, win rate
3. **Bot Details** - Click card → view full stats
4. **Copy Modal** - Click "Copy" → set investment amount
5. **Redirect** - After copy → `/dashboard-v2/copy/[copyId]`

### Bot Card Information

```typescript
<BotCard>
  <Icon src={bot.icon} />
  <Name>{bot.name}</Name>
  <Description>{bot.description}</Description>

  <Stats>
    <WinRate>{bot.stats.winRate}%</WinRate>
    <ROI>{bot.stats.roi}%</ROI>
    <TotalPnL>${bot.stats.totalPnL}</TotalPnL>
    <ActiveCopiers>{bot.stats.activeCopiers}</ActiveCopiers>
  </Stats>

  <Actions>
    <CopyButton onClick={openCopyModal} />
  </Actions>
</BotCard>
```

### CopyBotModal

**File:** `components/dashboard-v2/CopyBotModal.tsx`

**Flow:**
1. User selects master bot
2. Modal shows:
   - Bot name and stats
   - Investment amount input
   - Min/max investment limits
   - Expected ROI calculator
3. User sets amount (e.g., $5,000)
4. Validates: `amount >= minInvestment && amount <= maxInvestment`
5. Creates copy: `createUserCopy(masterBotId, userId, amount)`
6. Redirects: `/dashboard-v2/copy/[copyId]`

---

## Copy Detail Page

### Location

`/dashboard-v2/copy/[copyId]`

### Real-time Updates

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const updatedStats = getUserCopyStats(copyId);
    setStats(updatedStats);
  }, 2000); // Update every 2 seconds

  return () => clearInterval(interval);
}, [copyId]);
```

### Sections

**1. Overview Card**
- Total P&L ($ and %)
- Current value
- Invested amount
- Status badge

**2. Performance Stats**
- Today's P&L
- Win rate
- Total trades
- Average hold time
- Profit factor
- Best/worst trades

**3. Open Positions List**
```typescript
<OpenPosition>
  <Pair>BTC/USDT</Pair>
  <Side badge={side === 'LONG' ? 'green' : 'red'}>
    {side} ×{leverage}
  </Side>
  <Entry>${entryPrice}</Entry>
  <Current>${currentPrice}</Current>
  <PnL color={pnl >= 0 ? 'green' : 'red'}>
    {pnl >= 0 ? '+' : ''}${pnl} ({pnlPercent}%)
  </PnL>
  <Duration>{duration}</Duration>
</OpenPosition>
```

**4. Trade History Table**
- Entry/exit prices
- P&L
- Duration
- Pair/side/leverage
- Filters (All, Wins, Losses)
- Pagination (50 per page)

**5. Equity Curve Chart**
- X-axis: Trade number
- Y-axis: Cumulative P&L ($)
- Line chart with gradient fill

**6. Controls**
- Pause/Resume button
- Close Copy button
- View Master Bot link

---

## File Organization

```
Copy Bot System Files:
├── Core Logic
│   ├── lib/userCopies.ts                    # Copy CRUD operations
│   ├── lib/userCopyStats.ts                 # Proportional stats scaling
│   ├── lib/demoMarketplace.ts               # DEMO_BOTS array
│   ├── lib/BotManager.ts                    # Bot lifecycle + copy protection
│   └── lib/trading/TradingBot.ts            # Trading engine
│
├── Managed P&L System
│   ├── lib/trading/DynamicPnLCalculator.ts  # Daily target → P&L ranges
│   ├── lib/trading/convergence/
│   │   ├── ConvergenceController.ts         # 6-layer convergence system
│   │   ├── PresetMapper.ts                  # 4-parameter preset system
│   │   └── BotValidator.ts                  # Formula validation
│   ├── lib/trading/DailyTargetController.ts # Daily progress tracking
│   ├── lib/trading/SimpleTrendDetector.ts   # Layer 2 trend filter
│   └── lib/trading/StaggeredClosingManager.ts # Anti-batch-closure
│
├── Admin Interface
│   ├── app/dashboard-v2/admin/bots/page.tsx # Admin bot management
│   └── components/dashboard-v2/AdminBotModal.tsx
│
├── User Interface
│   ├── app/dashboard-v2/copy-bots/page.tsx  # Marketplace
│   ├── app/dashboard-v2/copy/[copyId]/page.tsx # Copy detail
│   └── components/dashboard-v2/CopyBotModal.tsx
│
└── Types
    └── types/api.ts                         # MasterBotData, CopyData, BotStats
```

---

## Development Workflow

### Adding a New Master Bot (Admin)

```typescript
// 1. Admin opens /dashboard-v2/admin/bots
// 2. Clicks "Create Bot"
// 3. Fills AdminBotModal:
const newBot = {
  name: 'Bybit Market Maker',
  description: 'High-frequency scalping strategy',
  icon: '/bots/bybit-mm.png',

  // Preset inputs
  dailyTargetPercent: 2.5,
  tradesPerDay: 250,
  character: 'Aggressive',
  convergenceMode: 'Balanced Convergence',

  // Limits
  minInvestment: 100,
  maxInvestment: 50000,
};

// 4. PresetMapper converts to BotConfig
const config = mapPresetToConfig(newBot);

// 5. BotValidator checks formula
const validation = validateBotConfig(config);
// ✅ Valid → allow save
// ❌ Invalid → show error, block save

// 6. Add to DEMO_BOTS
DEMO_BOTS.push({
  id: `master_${Date.now()}`,
  ...newBot,
  config,
  stats: initialStats,
});

// 7. Save to localStorage (override)
localStorage.setItem('demo_bots_override', JSON.stringify(DEMO_BOTS));

// 8. Create TradingBot instance
const bot = new TradingBot(newBot.id, config);
botManager.addBot(bot);
```

### User Copying a Bot

```typescript
// 1. User browses /dashboard-v2/copy-bots
// 2. Clicks "Copy" on Bybit Market Maker
// 3. CopyBotModal opens
const copy = {
  masterBotId: 'bybit-market-maker',
  investedAmount: 5000, // User input
};

// 4. Validate investment
if (copy.investedAmount < bot.minInvestment) {
  showError(`Minimum investment: $${bot.minInvestment}`);
  return;
}
if (copy.investedAmount > bot.maxInvestment) {
  showError(`Maximum investment: $${bot.maxInvestment}`);
  return;
}

// 5. Create copy record
const copyId = createUserCopy(
  copy.masterBotId,
  currentUserId,
  copy.investedAmount
);
// Saved to localStorage: 'user_copies'

// 6. Redirect to detail page
router.push(`/dashboard-v2/copy/${copyId}`);
```

### Bot Trading Simulation (Real-time)

```typescript
// Global tick loop (simulated)
setInterval(() => {
  // 1. Generate price update
  const prices = {
    'BTC/USDT': 68000 + (Math.random() - 0.5) * 200,
    'ETH/USDT': 2500 + (Math.random() - 0.5) * 10,
    'BNB/USDT': 400 + (Math.random() - 0.5) * 2,
  };

  // 2. Tick all master bots
  DEMO_BOTS.forEach(masterBot => {
    const bot = botManager.getBot(masterBot.id);
    bot.tick(prices);

    // 3. Update master bot stats
    masterBot.stats = bot.getStats();
  });

  // 4. User copies automatically get updated stats
  // (calculated on-the-fly via getUserCopyStats)

}, 2000); // Every 2 seconds
```

### User Viewing Copy Detail

```typescript
// Page: /dashboard-v2/copy/[copyId]

// 1. Load copy record
const copy = getUserCopy(copyId);

// 2. Get real-time stats (proportionally scaled from master)
const stats = getUserCopyStats(copyId);
// Returns: {
//   totalPnL: masterPnL × (userInvestment / masterCapital),
//   roi: masterROI, // Same percentage
//   winRate: masterWinRate, // Same
//   activePositions: scaled,
//   trades: scaled,
// }

// 3. Render UI with stats
<CopyDetailPage
  copy={copy}
  stats={stats}
  onClose={() => closeUserCopy(copyId)}
/>

// 4. Auto-update every 2s
useEffect(() => {
  const interval = setInterval(() => {
    const updated = getUserCopyStats(copyId);
    setStats(updated);
  }, 2000);

  return () => clearInterval(interval);
}, [copyId]);
```

---

## Testing

### Unit Tests

**Location:** `tests/unit/`

1. **DynamicPnLCalculator.test.ts**
   - Formula validation (1000 trades)
   - Tight/Wide mode convergence
   - Expected value = base value
   - Deviation < 10%

2. **convergence/ConvergenceController.test.ts**
   - Layer 1-6 individual tests
   - Metrics calculation
   - Convergence toward target

3. **TradingBot-convergence.test.ts**
   - Full bot lifecycle
   - Position opening/closing
   - Stats accuracy

4. **pnl-calculation-fix.test.ts** (NEW - 2026-02-07)
   - exitPrice/pnl mathematical consistency
   - minDuration enforcement
   - SHORT/LONG P&L sign validation
   - User scenario tests (exact bug examples)

**Run:** `npm run test:unit`

### Integration Tests

**Location:** `tests/integration/`

1. **convergence-layers.test.ts**
   - All 6 layers working together
   - Convergence to daily target
   - Realistic trading patterns

**Run:** `npm run test:integration`

### E2E Tests (Playwright)

**Location:** `tests/specs/e2e/`

**Key Scenarios:**
- User browsing marketplace
- Copying a bot
- Viewing copy detail
- Closing a copy

**Run:** `npm test`

---

## Known Issues & Fixes

### ✅ Fixed Issues

**Bug #6 (Day 10 - 2026-02-07): Wide Mode Positive Bias**
- **Problem:** Asymmetric distribution (winMin=0.8×base, winMax=2-4×base → avg=1.9×base)
- **Impact:** Actual wins 30% larger than predicted → +23.4% systematic deviation
- **Fix:** Symmetric distribution around base (±60% to ±120% variance)
- **Location:** `lib/trading/DynamicPnLCalculator.ts:122-142`
- **Result:** Deviation reduced from 23.4% → 0.7%

**Bug #4 (Earlier): Position Size Inflation**
- **Problem:** Layer 1 × DailyController × Personality = 4.29x stacking
- **Fix:** Both Layer 1 and DailyController capped at 1.0x when behind
- **Result:** Combined max 1.2x (personality only)

**P&L Mathematical Inconsistency (2026-02-07)**
- **Problem:** Layer 6 modified finalPnlPercent but not exitPrice → impossible P&L
- **Example:** ETH SHORT entry $2013.67 → exit $2013.80 (price up), P&L +$0.01 ❌
- **Expected:** P&L should be negative (SHORT loses when price rises)
- **Fix:** Added `recalculateExitPrice()` after Layer 6 and flip prevention
- **Location:** `lib/trading/TradingBot.ts:290-420`
- **Result:** exitPrice and pnl always mathematically consistent

**minDuration Bypassed by TP/SL (2026-02-07)**
- **Problem:** Positions closed in 9-32s when TP/SL reached, ignoring minDuration
- **Fix:** Enforce minDuration even for TP/SL closures
- **Location:** `lib/trading/TradingBot.ts:176-208`
- **Result:** All trades respect 60s minimum duration

**Minimum TP Threshold (2026-02-07)**
- **Problem:** TP values < 0.5% caused micro-trades (9s duration, $0.00 P&L)
- **Fix:** Added MIN_TP_PERCENT = 0.5% floor
- **Location:** `lib/trading/convergence/ConvergenceController.ts:164`
- **Result:** No more micro-trades with unrealistic P&L

### ⏸️ Postponed

**PriceService Integration (Day 2)**
- **Reason:** Waiting for backend migration
- **Current:** Simulated prices (random walk)
- **Future:** Real-time Binance/CoinGecko feeds

---

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - Move DEMO_BOTS to database
   - Server-side copy management
   - Real-time price feeds (Binance API)
   - WebSocket updates

2. **Social Features**
   - Bot comments and ratings
   - Leaderboards (top performing bots)
   - User-to-user following
   - Share copy performance

3. **Advanced Analytics**
   - Risk metrics (Sharpe ratio, max drawdown)
   - Correlation analysis
   - Backtesting tools
   - Performance attribution

4. **Risk Management**
   - Stop-loss at copy level
   - Trailing stop
   - Auto-close on target
   - Risk alerts

5. **Mobile App**
   - React Native implementation
   - Push notifications
   - Mobile-first copy flow

---

## API Interfaces

### MasterBotData

```typescript
interface MasterBotData {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: BotConfig;
  stats: BotStats;
  minInvestment: number;
  maxInvestment: number;
  createdAt: string;
  updatedAt: string;
}
```

### CopyData

```typescript
interface CopyData {
  id: string;                    // 'copy_${timestamp}_${random}'
  userId: string;                // User ID
  masterBotId: string;           // Reference to master bot
  investedAmount: number;        // User's investment ($)
  currentValue: number;          // invested + P&L
  pnl: number;                   // P&L ($)
  pnlPercent: number;            // P&L (%)
  status: 'ACTIVE' | 'CLOSING' | 'CLOSED';
  createdAt: string;             // ISO timestamp
  closedAt?: string;             // ISO timestamp (if closed)
}
```

### BotStats

```typescript
interface BotStats {
  totalPnL: number;              // Total P&L ($)
  roi: number;                   // ROI (%)
  winRate: number;               // Win rate (0-1)
  totalTrades: number;           // Total closed trades
  winningTrades: number;         // Number of wins
  losingTrades: number;          // Number of losses
  avgWin: number;                // Average win ($)
  avgLoss: number;               // Average loss ($)
  largestWin: number;            // Best trade ($)
  largestLoss: number;           // Worst trade ($)
  profitFactor: number;          // Total wins / total losses
  activePositions: OpenPosition[];
  trades: Trade[];
  equityCurve: EquityPoint[];
}
```

### OpenPosition

```typescript
interface OpenPosition {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  openedAt: number;
  duration: string;
}
```

### Trade

```typescript
interface Trade {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  positionSize: number;
  duration: string;
  closedAt: string;
}
```

---

## Code Examples

### Example 1: Creating Master Bot (Admin)

```typescript
// File: app/dashboard-v2/admin/bots/page.tsx

const handleCreateBot = async (inputs: PresetInputs) => {
  // 1. Map preset inputs to full config
  const config = PresetMapper.mapPresetToConfig(inputs);

  // 2. Validate formula
  const validation = BotValidator.validateBotConfig(config);
  if (!validation.valid) {
    alert(`Invalid config: ${validation.errors.join(', ')}`);
    return;
  }

  // 3. Create master bot
  const masterBot: DemoBot = {
    id: `master_${Date.now()}`,
    name: inputs.name,
    description: inputs.description,
    icon: inputs.icon,
    config,
    stats: {
      totalPnL: 0,
      roi: 0,
      winRate: config.winRate,
      totalTrades: 0,
      activeCopiers: 0,
      // ... initial stats
    },
    minInvestment: inputs.minInvestment,
    maxInvestment: inputs.maxInvestment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 4. Add to DEMO_BOTS
  DEMO_BOTS.push(masterBot);

  // 5. Save to localStorage (override)
  localStorage.setItem('demo_bots_override', JSON.stringify(DEMO_BOTS));

  // 6. Create TradingBot instance
  const bot = new TradingBot(masterBot.id, config);
  botManager.addBot(bot);

  alert('Master bot created successfully!');
};
```

### Example 2: User Copying Bot

```typescript
// File: components/dashboard-v2/CopyBotModal.tsx

const handleCopy = async (masterBotId: string, amount: number) => {
  // 1. Validate investment
  const masterBot = DEMO_BOTS.find(b => b.id === masterBotId);
  if (!masterBot) {
    alert('Bot not found');
    return;
  }

  if (amount < masterBot.minInvestment) {
    alert(`Minimum: $${masterBot.minInvestment}`);
    return;
  }

  if (amount > masterBot.maxInvestment) {
    alert(`Maximum: $${masterBot.maxInvestment}`);
    return;
  }

  // 2. Create copy
  const copyId = createUserCopy(
    masterBotId,
    currentUserId,
    amount
  );

  // 3. Update master bot copier count
  masterBot.stats.activeCopiers++;

  // 4. Redirect to copy detail
  router.push(`/dashboard-v2/copy/${copyId}`);
};
```

### Example 3: Getting Copy Stats (Real-time)

```typescript
// File: app/dashboard-v2/copy/[copyId]/page.tsx

const CopyDetailPage = ({ copyId }: { copyId: string }) => {
  const [stats, setStats] = useState<BotStats | null>(null);

  // Real-time updates every 2s
  useEffect(() => {
    const updateStats = () => {
      const updatedStats = getUserCopyStats(copyId);
      setStats(updatedStats);
    };

    // Initial load
    updateStats();

    // Polling interval
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [copyId]);

  if (!stats) return <Loading />;

  return (
    <div>
      <h1>Copy Performance</h1>
      <div>Total P&L: ${stats.totalPnL.toFixed(2)}</div>
      <div>ROI: {stats.roi.toFixed(2)}%</div>
      <div>Win Rate: {(stats.winRate * 100).toFixed(1)}%</div>
      <div>Trades: {stats.totalTrades}</div>

      <OpenPositionsList positions={stats.activePositions} />
      <TradeHistoryTable trades={stats.trades} />
    </div>
  );
};
```

### Example 4: Proportional Stats Calculation

```typescript
// File: lib/userCopyStats.ts

export function getUserCopyStats(copyId: string): BotStats | null {
  // 1. Get copy record
  const copy = getUserCopy(copyId);
  if (!copy) return null;

  // 2. Get master bot
  const masterBot = DEMO_BOTS.find(b => b.id === copy.masterBotId);
  if (!masterBot) return null;

  // 3. Get master bot instance
  const bot = botManager.getBot(copy.masterBotId);
  if (!bot) return null;

  // 4. Get master stats
  const masterStats = bot.getStats();

  // 5. Calculate scaling ratio
  const ratio = copy.investedAmount / masterBot.config.capital;

  // 6. Scale all stats
  return {
    totalPnL: masterStats.totalPnL * ratio,
    roi: masterStats.roi, // Same percentage
    winRate: masterStats.winRate, // Same
    totalTrades: masterStats.totalTrades, // Same count
    winningTrades: masterStats.winningTrades,
    losingTrades: masterStats.losingTrades,
    avgWin: masterStats.avgWin * ratio,
    avgLoss: masterStats.avgLoss * ratio,
    largestWin: masterStats.largestWin * ratio,
    largestLoss: masterStats.largestLoss * ratio,
    profitFactor: masterStats.profitFactor, // Same ratio

    // Scale positions
    activePositions: masterStats.activePositions.map(pos => ({
      ...pos,
      positionSize: pos.positionSize * ratio,
      pnl: pos.pnl * ratio,
    })),

    // Scale trades (limit to 50 most recent)
    trades: masterStats.trades.slice(0, 50).map(trade => ({
      ...trade,
      positionSize: trade.positionSize * ratio,
      pnl: trade.pnl * ratio,
    })),

    // Scale equity curve
    equityCurve: masterStats.equityCurve.map(point => ({
      trade: point.trade,
      equity: point.equity * ratio,
    })),
  };
}
```

---

## References

- **`PLAN.md`** - Project roadmap, completed tasks (Days 0-12)
- **`SPEC.md`** - Technical specifications
- **`CLAUDE.md`** - Development guidelines, testing approach
- **`tests/AUTOMATION_PROMPT.md`** - Testing guidelines (Day 8+)
- **`MEMORY.md`** - Critical fixes, architecture patterns
- **`tests/unit/pnl-calculation-fix.test.ts`** - Recent bug validation

---

## Summary

The Copy Bot System is a sophisticated managed P&L platform with:

✅ **10 master bots** with unique strategies
✅ **Lightweight user copies** (proportional stats scaling)
✅ **6-layer convergence** (minimal slippage at close)
✅ **4-parameter preset system** (9 valid combinations)
✅ **Real-time updates** (2s polling)
✅ **Admin interface** (create/edit/delete bots)
✅ **User marketplace** (browse/copy/manage)
✅ **Comprehensive testing** (unit/integration/E2E)
✅ **Recent bug fixes** (P&L consistency, minDuration, TP threshold)

**Key Innovation:** Pre-determined outcomes + convergence layers = realistic trading with predictable daily targets.
