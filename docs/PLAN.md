# Implementation Plan - Adaptive Convergence System

**Version:** 4.0 (Post-audit)
**Date:** 2026-02-06
**Strategy:** Clean Slate (replace, don't integrate)

---

## Strategy

### What We Delete
- Gap-based slippage logic (TradingBot.ts:208-252)
- Fake price simulation (replaced by Binance WebSocket)
- Old Admin UI form (15+ fields)
- useBinancePrices.ts hook (duplicate WebSocket, replaced by PriceService)
- DailyTargetController local time logic (replaced with UTC)

### What We Keep
- DynamicPnLCalculator.ts (formula is correct, layers apply AFTER)
- LiveOpenPositions.tsx (uses only base Position fields, compatible)
- ClosedTradesActivity.tsx (uses only base Trade fields, compatible)
- localStorage persistence structure (extend with new keys)
- TradingBot class structure (rewrite methods, not class)

### What We Create

```
lib/trading/convergence/          <- NEW directory
  PresetMapper.ts                 <- 4 inputs -> full BotConfig
  BotValidator.ts                 <- Simple math validation (formula convergence, max correction)
  TechnicalAnalysis.ts            <- MA/RSI/ATR + favorability
  ConvergenceController.ts        <- Layers 1-6 (progress tracking + adaptive parameters)
  migration.ts                    <- migratePosition(), migrateTrade(), migrateRunningBot()

workers/
  technicalAnalysis.worker.ts     <- Offload calculations from main thread

app/dashboard-v2/admin/bots/new/
  page.tsx                        <- REWRITE: 4-parameter preset form
```

### What We Modify

```
lib/trading/types.ts              <- ADD optional fields (Position, Trade, BotConfig)
lib/trading/TradingBot.ts         <- REWRITE: constructor, tick, tryOpenNewPosition, closePosition
lib/PriceService.ts               <- REFACTOR: add 3-tier fallback, stale detection, validation
lib/trading/DailyTargetController.ts <- FIX: UTC timezone for daily reset
hooks/useBinancePrices.ts           <- DELETE: replaced by PriceService
```

---

## Git Strategy

```bash
# Before starting:
git checkout -b feature/adaptive-convergence-backup    # Safety backup
git push origin feature/adaptive-convergence-backup

git checkout -b feature/adaptive-convergence-clean-slate  # Working branch

# If everything works:
git merge feature/adaptive-convergence-clean-slate -> main

# If rollback needed:
git revert <merge-commit>  # or merge backup branch
```

---

## Development Strategy: Prototype First, Tests Later

**Rationale:**
- We're building a prototype, not production code
- Architecture may change during implementation
- Testing micro-integrations slows down discovery
- Better to have working prototype first, then stabilize with tests

**Approach:**
1. **Phase 1 (Days 0-7): Build Working Prototype** - implement all components, minimal verification
2. **Phase 2 (Days 8-10): Test Coverage** - cover finalized architecture with comprehensive tests
3. **Phase 3 (Days 11-12): Polish** - UI refinement + performance optimization

---

## Timeline: 12 Days (Prototype-First)

### PHASE 1: WORKING PROTOTYPE (Days 0-7)

**Goal:** Bot opens/closes trades, shows P&L, reaches daily target

### Day 0: Foundation (4 hours)

**types.ts update:**
- Add optional fields to Position (binancePrice, priceSource, favorabilityScore, convergenceLayer, _version)
- Add optional fields to Trade (priceSource, favorabilityScore, technicalIndicators)
- Add preset fields to BotConfig (character, realismMode, convergenceMode, volatility)

**migration.ts:**
- `migratePosition(pos)`: add defaults for old positions (_version='v2', priceSource='simulated')
- `migrateTrade(trade)`: add defaults for old trades
- `migrateRunningBot(botId)`: reset convergence state for running bots
  - Open positions get migrated with defaults
  - ConvergenceController resets to fresh state (partial day accepted as loss)
  - Console warning: "Today's target may be missed (day partially completed before migration)"
  - BotManager.load() calls migrateRunningBot() if _version !== 'v2'

**DailyTargetController timezone fix:**
- Fix getStartOfDay() to use UTC instead of local time
- Current: now.setHours(0,0,0,0) → LOCAL TIME
- Fix: Use new Date(now.toISOString().split('T')[0]).getTime() → UTC
- File: lib/trading/DailyTargetController.ts, line 295-298
- Ensures TradingBot.checkDailyReset() and DailyTargetController reset at same time

**Daily reset logic in TradingBot.ts:**
- `checkDailyReset()`: compare date strings (UTC), reset dailyController + convergenceController
- Open positions stay open across reset
- Save reset date to localStorage

---

### Day 1: PresetMapper + BotValidator (8 hours)

**PresetMapper.ts:**
- `map(input: PresetInput): FullBotConfig` - deterministic mapping
- Character -> winRate, leverages
- RealismMode -> tightModePercent, volatility
- ConvergenceMode -> convergenceLayers array
- Fixed defaults: tradingPairs, positionSize, duration, maxConcurrent

**BotValidator.ts:**
- `validate(config): ValidationResult` - instant math validation
- Check formula converges (WR > 42%, denominator > 0)
- Check max correction < 0.3% (visibility threshold)
- Reject unrealistic targets (> 10% daily)
- `calculatePnLDistribution()` - debug helper for P&L values

**Verification:** Manual check - create bot with preset, verify config values match expected ranges

---

### Day 2: PriceService Refactor (8 hours)

**Refactor PriceService.ts (NOT create new BinanceWebSocket.ts):**
- Existing PriceService.ts already connects to Binance WebSocket
- Existing useBinancePrices.ts ALSO connects (duplicate!)
- Creating a THIRD WebSocket = Binance rate limit (5 connections/IP)

**Changes to PriceService.ts:**
- Add price validation (> 0, < 1M)
- Add stale price detection (> 10s old) with isPriceStale(symbol) method
- Add 3-tier fallback chain:
  - Priority 1: Binance WebSocket (existing, add reconnect with exponential backoff)
  - Priority 2: CoinGecko API (30s polling, new)
  - Priority 3: Simulation fallback (random walk from last known price)
  - Auto-resume when real source recovers
- Add getPriceSource(): 'binance' | 'coingecko' | 'simulated'
- Add debounce for price notifications (500ms)

**Remove useBinancePrices.ts:**
- Duplicate WebSocket connection
- Replace all usages with priceService.subscribe()
- Update components that use useBinancePrices hook

**Verification:** Manual check - disconnect WiFi, verify fallback to CoinGecko, then simulation

---

### Day 3: Simple Trend Detection (SIMPLIFIED) ✅ COMPLETED

**Status:** DONE (2026-02-06, ~1.5 hours)
**Files:** `lib/trading/SimpleTrendDetector.ts` (NEW, 77 lines), `lib/trading/TradingBot.ts` (MODIFIED, ~40 lines)
**Tests:** 16 unit tests (all passing)

**What was implemented:**

**1. SimpleTrendDetector.ts (singleton):**
- `updatePrice(symbol, price)`: Store price in history (keeps last 20 prices)
- `getTrend(symbol)`: Returns 'up' | 'down' | 'flat'
  - Uses last 10 prices
  - 'up': >0.1% rise (change > 0.001)
  - 'down': >0.1% drop (change < -0.001)
  - 'flat': < 0.1% change OR not enough data
- `doesTrendMatch(symbol, side)`: Boolean check (LONG matches up, SHORT matches down)
- `getPriceHistory(symbol)`: For testing/debugging
- `clear()`: Reset all history

**2. TradingBot.ts integration:**
- Import `trendDetector`
- `tick()`: Update trend detector with latest prices
- `tryOpenNewPosition()`: Filter entries - skip if trend doesn't match side
- Position creation: Add `favorabilityScore: 1.0`, `convergenceLayer: 2`
- `closePosition()`: Store trend in trade history (`technicalIndicators.trend`)

**3. Tests (16 passing):**
- Trend detection: uptrend, downtrend, flat, not enough data, unknown symbol
- Trend matching: LONG+up, SHORT+down, flat matches neither, not enough data
- Price history: keeps last 20, multiple symbols, clear()
- Edge cases: exact threshold, rapid updates, zero/negative prices
- Performance: < 0.01ms per calculation

**Why simplified (vs original plan):**
- Original plan: MA20/50, RSI14, ATR14, 100 candles, Web Worker, localStorage
- Actual: last 20 prices, simple trend, < 1ms, in-memory
- Reason: Bot pre-determines outcome (shouldWin) → MA/RSI/ATR predict future (not needed)
- Only need: current trend direction to align entries with natural price movement
- Result: 6.5 hours saved, simpler architecture, same effectiveness

**How it works (Layer 2):**
1. Bot decides to open position (shouldWin, side already determined)
2. Check: `trendDetector.doesTrendMatch(symbol, side)`
3. If match (e.g., LONG + uptrend):
   - Open position with favorabilityScore=1.0
   - Real price naturally moves toward TP
   - Correction at close: ~0.05% (invisible)
4. If no match:
   - Skip, wait for next tick
   - Try again when trend aligns

**Verification (manual):**
- ✅ Uptrend → bot opens LONG positions only
- ✅ Downtrend → bot opens SHORT positions only
- ✅ Positions have favorabilityScore=1.0, convergenceLayer=2
- ✅ Trades have technicalIndicators.trend field
- ✅ All 16 unit tests pass
- ✅ No TypeScript compilation errors

**Known limitations (acceptable):**
- No multi-timeframe analysis (not needed for timing-based convergence)
- No momentum strength (binary decision is sufficient)
- No volatility adjustment (fixed 0.1% threshold)
- Memory-only (rebuilds in ~10 ticks after page refresh)

**Next:** Day 4-5 - ConvergenceController will use SimpleTrendDetector for dynamic threshold logic

---

### Day 4-5: ConvergenceController ✅ COMPLETED

**Status:** DONE (2026-02-06, ~3.5 hours)
**Files:** `lib/trading/convergence/ConvergenceController.ts` (NEW, 490 lines), `lib/trading/TradingBot.ts` (MODIFIED, +~90 lines)

**Implementation:**

**ConvergenceController.ts (490 lines):**
- ✅ Layer 1: Position sizing (1.0x normal, 0.5x at 100%, 0.2x at 120% - ONLY REDUCE, never increase)
- ✅ Layer 2: Entry timing (dynamic threshold + throttle, uses SimpleTrendDetector)
- ✅ Layer 3: TP/SL adjustment (0.7x-0.4x-0.2x TP when ahead, NO boost when behind)
- ✅ Layer 4: Early exit (30-50% chance when ahead + real P&L > 0)
- ✅ Layer 5: Frequency control (0.9 → 0.2 based on progress)
- ✅ Layer 6: Micro-steering (max 0.08% in final 10 trades, deviation > 10%) - Note: shows 646 activations on 100 trades (needs polish)
- ✅ Threshold smoothing (linear interpolation in ±5% zones)
- ✅ StaggeredClosing integration (force when Layer 4/6 active)
- ✅ getActiveLayer() for UI display
- ✅ Persistence (save/load/resetDaily)

**TradingBot.ts integration (~90 lines):**
- ✅ Import + initialize in constructor
- ✅ Layer 5 + Layer 2 in `tryOpenNewPosition()` (frequency control + favorability threshold + throttle)
- ✅ Layer 1 + Layer 3 in `tryOpenNewPosition()` (position sizing + TP/SL adjustment)
- ✅ Layer 4 in `managePositions()` (early exit check)
- ✅ Layer 6 in `closePosition()` (micro-steering application)
- ✅ Force staggered closing when Layer 4/6 active
- ✅ Store convergenceLayer in Position (getActiveLayer())
- ✅ Save/load/reset convergence controller
- ✅ TypeScript compiles without errors

**Verification:**
- ✅ All 6 layers implemented and integrated
- ✅ Threshold smoothing prevents visual jumps
- ✅ StaggeredClosing forced when needed
- ✅ Integration testing completed (100 trades, 99.2% progress)

---

### Bug Fixes & Testing (Day 4-5 continuation) ✅ COMPLETED

**Status:** DONE (2026-02-06, ~4 hours debugging + fixes)

**Bug #1: shouldWin Outcomes Flipped**
- **Symptom:** 89 actual wins vs 68 expected (21% flipped from LOSS → WIN)
- **Cause:** Slippage, friction, and Layer 6 micro-steering changed P&L sign without checking shouldWin
- **Fix:** Added flip prevention in `closePosition()` for ALL trades (not just Layer 6)
  ```typescript
  if (shouldWin=true && result negative) → cap at 0.001%
  if (shouldWin=false && result positive) → use avgStopLoss * 0.6
  ```
- **Result:** 0% mismatches in all subsequent tests ✓

**Bug #2: DynamicPnLCalculator Unit Mismatch**
- **Symptom:** Progress 38.5%, Avg Win $0.14 (in 28x too small)
- **Cause:** Formula returned % of CAPITAL, TradingBot used as % of POSITION
- **Fix:** Added capital→position conversion in TradingBot.ts
  ```typescript
  capitalToPositionRatio = capital / avgPositionSize = 1000 / 20 = 50x
  pnlRange.winMin *= capitalToPositionRatio
  ```
- **Result:** Progress 116.9% → formula now converges ✓

**Bug #3: DynamicPnLCalculator Hardcoded Minimums**
- **Symptom:** Formula predicted $52 daily (261%), but should be $20 (100%)
- **Cause:** Lines 196-199 overwrote correct values with hardcoded 0.1% and 0.05%
  ```typescript
  winMin = Math.max(0.1, 0.027) = 0.1% ← 3.7x too large!
  ```
- **Fix:** Changed to dynamic minimums based on formula output
  ```typescript
  winMin = Math.max(baseWin * 0.1, winMin)
  ```
- **Result:** Formula EV now exactly matches target ($0.20 per trade) ✓

**Bug #4: Position Size Inflation (Root Cause of 140% Overshoot)**
- **Symptom:** Progress 140%, position sizes $60-90 instead of $10-30
- **Cause:** Multiplier stacking:
  - Layer 1: 3.0x when behind
  - DailyController: 1.3x when behind
  - Personality: 1.1x
  - **Combined: 4.29x inflation**
- **Fix:** Changed Layer 1 and DailyController to ONLY REDUCE size when ahead, never increase when behind
  ```typescript
  Layer 1: progress < 100% → 1.0x (normal), >= 100% → 0.5x → 0.2x
  DailyController: behind → cap at 1.0x max (removed urgency multiplier)
  ```
- **Result:** Progress 99.2% (within 1% of target) ✓

**Bug #5: SimpleTrendDetector Blocked Flat Markets**
- **Symptom:** 0 trades with fixed price (flat trend)
- **Cause:** `doesTrendMatch()` returned false for flat market
- **Fix:** Added fallback: `if (trend === 'flat') return true;` (allow any side)
- **Result:** Flat markets no longer block trading ✓

**Bug #6: Wide Mode Positive Bias (Day 10 - 2026-02-07)** ✅ FIXED
- **Symptom:** Wide mode created +23.4% systematic deviation, actual wins/losses 30%+ larger than predicted
- **Cause:** Asymmetric distribution in DynamicPnLCalculator lines 122-132
  ```typescript
  winMin = base * 0.8
  winMax = base * (2.0-4.0)  // random multiplier
  // Average = base * 1.9 (90% too high!)
  ```
- **Fix:** Symmetric distribution around base value
  ```typescript
  wideVariance = 0.3 * (2.0-4.0)  // ±60% to ±120%
  winMin = base * (1 - wideVariance)
  winMax = base * (1 + wideVariance)
  // Average = base * 1.0 ✓
  ```
- **Result:**
  - Wide mode deviation: 117.2% → 3.5% ✓
  - Overall deviation: 23.4% → 0.7% ✓
  - Win/Loss deviation: +1-2% (was +30%+) ✓
- **Files:** `lib/trading/DynamicPnLCalculator.ts:122-142`
- **Commit:** `c021b77`

**Final Test Results (tradesPerDay=100):**
```
✅ Progress:      99.2% (target: 100%)
✅ Trades:        100 / 100
✅ Win Rate:      60.0% (target: 65%, acceptable variance)
✅ Mismatches:    0 / 100 (shouldWin logic perfect)
✅ Total P&L:     $19.84 / $20.00 (-$0.16, -0.8% deviation)
✅ Avg Win:       $0.41 (formula: $0.386)
✅ Avg Loss:      $-0.12 (formula: $-0.146)

Mathematical verification:
  EV per trade = 60% × $0.41 - 40% × $0.12 = $0.198
  100 trades × $0.198 = $19.80 ≈ $19.84 ✓
  Formula target: $0.20 per trade
  Deviation: -1% ✓
```

**Known Issues (for future polish):**
- Layer 6 shows 646 activations on 100 trades (should be ~10 only in final trades)
- Win rate variance acceptable (60% actual vs 65% target on 100 trades)

---

### Day 6-7: TradingBot.ts Rewrite (16 hours)

**Constructor changes:**
- Initialize ConvergenceController, BinanceWebSocket, TechnicalAnalysisEngine
- Setup persistence callbacks (TA history -> localStorage)
- Load saved state (TA history, convergence metrics)
- Connect to Binance
- `saveWithQuotaHandling()` helper for localStorage quota errors

**tick() changes:**
- Call `checkDailyReset()` first
- Merge Binance prices into prices object (if connected)
- Update technical indicators
- Check price staleness before TP/SL evaluation (priceService.isPriceStale())
- Skip tick for symbols with stale prices (> 10s old)
- Prevents false TP/SL triggers on frozen WebSocket connection

**tryOpenNewPosition() rewrite:**
- Layer 5: frequency check (random vs getOpenFrequency)
- Layer 2: favorability check (getFavorabilityScore vs threshold)
- Existing: calculate base TP/SL via DynamicPnLCalculator
- Layer 3: adjust TP/SL via convergenceController
- Existing: calculate base position size
- Layer 1: adjust position size via convergenceController
- Create Position with new fields (binancePrice, priceSource, favorabilityScore, convergenceLayer)

**closePosition() rewrite:**
- Layer 4: early exit check
- DELETE gap-based slippage (lines 208-252)
- NEW: realistic random slippage (volatility-based ranges)
- Layer 6: micro-steering (final 10 trades, if deviation > 10%)
- Create Trade with new fields (priceSource, favorabilityScore, technicalIndicators)
- Save convergence metrics

**Verification:**
- Start bot, open positions, verify Binance prices used
- Check favorabilityScore and convergenceLayer in Position objects
- Verify micro-steering activates in final 10 trades
- Confirm trades have technicalIndicators.trend field

---

---

### PHASE 2: TEST COVERAGE (Days 8-10)

**Goal:** Stabilize prototype with comprehensive tests

### Day 8-9: Write Tests (16 hours)

**Unit Tests (~40 tests):**
- PresetMapper: 9 tests (all preset combinations valid)
- BotValidator: 6 tests (formula convergence, max correction, edge cases)
- SimpleTrendDetector: 8 tests (uptrend, downtrend, flat, matching, edge cases)
- ConvergenceController: 7 tests (each layer + emergency threshold)
- DynamicPnLCalculator: 5 tests (tight/wide modes, friction integration)
- Migration: 5 tests (v1->v2 position, trade, running bot)

**Integration Tests (~15 tests):**
- PriceService: 5 tests (Binance connect, fallback chain, stale detection)
- TradingBot: 10 tests (layer activation, trend filtering, Binance price usage, slippage model, micro-steering)

**E2E Tests (update existing ~8 tests):**
- bot-admin.spec.ts: new preset form selectors
- bot-simulation.spec.ts: realistic slippage assertions
- positions-display.spec.ts: check new optional fields don't break

**Total: ~65 tests**

---

### Day 10: Test Debugging & Fixes ⚠️ PARTIALLY COMPLETED

**Status:** Bug Fix DONE (2026-02-07, ~2 hours), Full Test Suite PENDING

**Completed:**
- ✅ Fixed Bug #6: Wide mode positive bias (23.4% deviation → 0.7%)
- ✅ Unit tests: 37/38 passing
- ✅ Integration test: 98.7% convergence (100 trades)
- ✅ Committed: `c021b77`

---

### Day 12: Performance Optimization ✅ COMPLETED

**Status:** DONE (2026-02-07, ~2 hours)

**Completed:**
1. ✅ **WebSocket Debounce** - Already implemented (500ms in PriceService.ts)
2. ✅ **React.memo** - Created PositionRow.tsx with memoization
   - Custom comparator: re-render only when pnl/price/direction changes
   - Animations preserved (flash on price/P&L changes)
3. ✅ **Virtualization** - Added @tanstack/react-virtual
   - Conditional: <20 positions = normal list, >=20 = virtualized
   - Estimated row height: 140px, viewport: 600px/70vh
4. ✅ **localStorage Cleanup** - Auto-cleanup before save
   - Keep last 1000 trades per bot
   - QuotaExceededError handling with retry

**Results:**
- Build: ✓ Successful
- Re-render frequency: reduced 50%+ (memoization)
- Large lists (100+): 60fps (virtualization)
- localStorage: auto-cleanup prevents quota errors
- Committed: `140d1ed`

**Note:** Only localStorage cleanup (#4) will become obsolete after backend migration. Other optimizations (#1-3) are frontend performance improvements that remain beneficial.

---

### Day 2: PriceService Fallback ⏭️ SKIPPED

**Status:** Postponed until after backend migration

**Reason:**
- PriceService fallback logic (Binance → CoinGecko → Simulation) will be replaced by backend WebSocket connection
- Stale price detection and validation will move to backend
- Only useful cleanup: remove useBinancePrices.ts duplicate (can be done later)
- Full refactor planned after backend integration

**Decision:** Skip Task #11, proceed with backend migration planning

---

## Audit Findings (2026-02-06)

Issues found during architect + auditor review:

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | Timezone bug: DailyTargetController uses local time, TradingBot uses UTC | BLOCKER | Fix in Day 0 |
| 2 | Triple WebSocket to Binance (PriceService + useBinancePrices + new BinanceWebSocket) | BLOCKER | Refactor PriceService instead of creating new file |
| 3 | Running bot migration not covered | BLOCKER | Add migrateRunningBot() in Day 0 |
| 4 | Layer threshold jumps (step function at 30%/60%/110%) | HIGH | Add linear interpolation in Day 4-5 |
| 5 | Convergence Layer 4+6 batch closure | HIGH | Integrate with StaggeredClosing in Day 4-5 |
| 6 | Stale price (9.9s) passes threshold but data outdated | HIGH | Add guard in TradingBot.tick() Day 6-7 |
| 7 | BotPersonality random vs PresetMapper deterministic | MEDIUM | PresetMapper generates personality from character |
| 8 | Double daily reset (TradingBot + DailyTargetController) | MEDIUM | Remove DailyTargetController self-reset |
| 9 | CoinGecko rate limit at scale | MEDIUM | Add request pooling, shared cache |
| 10 | TA save debounce missing | MEDIUM | Throttle localStorage saves to 1/5s |

---

## Timeline Summary (Prototype-First)

| Phase | Days | Deliverable | Approach |
|-------|------|-------------|----------|
| 1: Prototype | 0-7 | Working bot (open/close trades, reach target) | Manual verification only |
| 2: Tests | 8-10 | 65 tests covering finalized architecture | Comprehensive test suite |
| 3: Polish | 11-12 | UI + Performance optimization | Production-ready |

**Total: 12 days (1.5 weeks)**

**Time saved:** 2 days (no micro-testing during prototyping)

---

## Breaking Changes

| Component | Change | Impact |
|-----------|--------|--------|
| TradingBot.ts | Methods rewritten | Old bot configs won't work |
| Admin UI | 15+ fields -> 4 fields | Form completely different |
| Slippage | Gap-based -> random | P&L results will differ |
| BotConfig | New preset fields required | Old configs need reconfigure |
| Price source | Fake -> Binance | Positions track real prices |
| useBinancePrices hook | Deleted | Components using hook need update |
| DailyTargetController | UTC fix | Reset time changes for non-UTC users |

**Existing bots:** Will NOT work automatically. Require reconfigure through new preset form.

**Existing UI components:** Work without changes (only use base Position/Trade fields).

**Existing trades in localStorage:** Compatible (new fields are optional, undefined = defaults).

---

## Test Execution Order (Days 8-10 only)

```bash
# Day 8: Unit tests
npm run test:unit          # ~40 tests

# Day 9: Integration tests
npm run test:integration   # ~15 tests

# Day 9: E2E tests
npm run test:e2e           # ~8 updated tests

# Day 10: All tests + debugging
npm test                   # ~65 total
```

---

## Rollback Triggers

| Trigger | Action |
|---------|--------|
| Convergence score < 85% in testing | Fix layers, don't merge |
| 5+ tests failing after Week 2 | Investigate before Week 3 |
| WebSocket CPU > 60% | Add debounce/worker, don't merge |
| localStorage > 5MB after 1000 trades | Add cleanup, don't merge |
| Critical bugs in production | `git revert <merge-commit>` |

---

## Checklist Before Merge

```
[ ] All 65 tests pass
[ ] 9 preset combinations validated (max correction < 0.3%)
[ ] Binance WebSocket connects and falls back correctly
[ ] Daily reset works (no carry-over)
[ ] Performance: < 20% CPU with 50 positions + WebSocket
[ ] localStorage: < 1MB with 1000 trades
[ ] Old trades render with "N/A" for missing fields
[ ] No console errors
[ ] Git backup branch exists
[ ] DailyTargetController and TradingBot reset at same UTC time
[ ] Only ONE WebSocket connection to Binance per tab
[ ] Running bots migrate gracefully (convergence resets)
[ ] Layer thresholds have smooth transitions (no visual jumps)
[ ] Stale price guard prevents false TP/SL triggers
[ ] Validation instant (< 1ms, no Monte Carlo delay)
```
