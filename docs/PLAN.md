# Implementation Plan - Adaptive Convergence System

**Version:** 3.0 (Consolidated)
**Date:** 2026-02-06
**Strategy:** Clean Slate (replace, don't integrate)

---

## Strategy

### What We Delete
- Gap-based slippage logic (TradingBot.ts:208-252)
- Fake price simulation (replaced by Binance WebSocket)
- Old Admin UI form (15+ fields)

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
  BotValidator.ts                 <- Monte Carlo validation
  BinanceWebSocket.ts             <- 3-tier fallback price source
  TechnicalAnalysis.ts            <- MA/RSI/ATR + favorability
  ConvergenceController.ts        <- Layers 1-6
  migration.ts                    <- migratePosition(), migrateTrade()

workers/
  technicalAnalysis.worker.ts     <- Offload calculations from main thread

app/dashboard-v2/admin/bots/new/
  page.tsx                        <- REWRITE: 4-parameter preset form
```

### What We Modify

```
lib/trading/types.ts              <- ADD optional fields (Position, Trade, BotConfig)
lib/trading/TradingBot.ts         <- REWRITE: constructor, tick, tryOpenNewPosition, closePosition
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

## Timeline: 14 Days

### Day 0: Foundation (4 hours)

**types.ts update:**
- Add optional fields to Position (binancePrice, priceSource, favorabilityScore, convergenceLayer, _version)
- Add optional fields to Trade (priceSource, favorabilityScore, technicalIndicators)
- Add preset fields to BotConfig (character, realismMode, convergenceMode, volatility)

**migration.ts:**
- `migratePosition(pos)`: add defaults for old positions (_version='v2', priceSource='simulated')
- `migrateTrade(trade)`: add defaults for old trades

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
- `validate(config): ValidationResult` - run 1000-day Monte Carlo
- Reject if convergence score < 90%
- Reject if deviation > 10% of target
- Reject unrealistic targets (> 10% daily)

**Tests:** 8 unit tests (determinism, all 9 presets valid, validation rejects bad configs)

---

### Day 2: BinanceWebSocket (8 hours)

**BinanceWebSocket.ts:**
- WSS connection to `wss://stream.binance.com:9443/stream`
- Subscribe to btcusdt@ticker, ethusdt@ticker, solusdt@ticker
- Price validation (> 0, < 1M)
- Stale price detection (> 10s old)
- Debounced price notifications (500ms)
- Reconnect: exponential backoff (5s base, max 10 attempts)
- Fallback to CoinGecko API (30s polling) after max reconnects
- Fallback to simulation after 3 CoinGecko failures
- Auto-resume when real source recovers
- `getPriceSource()`: 'binance' | 'coingecko' | 'simulated'

**Tests:** 5 integration tests (connect, validate, reconnect, fallback chain, stale prices)

---

### Day 3: TechnicalAnalysisEngine (8 hours)

**TechnicalAnalysis.ts:**
- Price history storage (Map, last 100 candles per pair)
- `calculateMA(prices, period)`: simple moving average
- `calculateRSI(prices, period)`: relative strength index
- `calculateATR(prices, period)`: average true range
- `getIndicators(pair)`: returns TechnicalIndicators object
- `getFavorabilityScore(pair, side)`: composite 0-1 score
- Persistence callback for price history (main thread saves to localStorage)
- `loadPriceHistory()` / `getPriceHistory()` for save/restore

**Web Worker wrapper:**
- `technicalAnalysis.worker.ts`: update, getIndicators, getFavorabilityScore messages

**Tests:** 5 unit tests (MA, RSI, ATR correctness, favorability LONG uptrend, favorability SHORT downtrend)

---

### Day 4-5: ConvergenceController (16 hours)

**ConvergenceController.ts:**
- Layer 1: `adjustPositionSize(baseSize, progress)` -> multiplied size
- Layer 2: `getFavorabilityThreshold()` -> dynamic threshold with emergency mode
- Layer 3: `adjustTPSL(baseTP, baseSL, progress)` -> adjusted targets
- Layer 4: `shouldExitEarly(position, currentPnL)` -> boolean
- Layer 5: `getOpenFrequency()` -> 0-1 frequency
- Layer 6: `getMicroSteering(currentPnL)` -> adjustment amount (capped 0.08%)
- `getActiveLayer()` -> dominant layer number for UI
- `resetDaily()` -> clear micro-steering state
- `save()` / `load()` -> persist convergence metrics to localStorage

**Tests:** 7 unit tests (each layer + emergency threshold + micro-steering cap + deviation check)

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

**Tests:** 10 integration tests (Binance price usage, layer activation, slippage model, micro-steering)

---

### Day 8-9: Admin UI (8 hours)

**New preset form (replaces old 15+ field form):**
- Daily Target slider (0-10%)
- Trades per Day input
- Character select (Conservative/Moderate/Aggressive)
- Convergence Mode select (Natural/Assisted/Guaranteed)
- Optional: Realism Mode select
- Preview: 30-day simulation with convergence score
- Validation before save

---

### Day 10-11: Testing (16 hours)

**Update existing tests (5-8 of 42):**
- bot-admin.spec.ts: new preset form selectors
- bot-simulation.spec.ts: realistic slippage assertions
- positions-display.spec.ts: check new optional fields don't break

**Write new tests (~35):**
- Convergence layers: 10 tests (each layer behavior at different progress levels)
- Binance integration: 5 tests (connect, fallback, stale, CoinGecko, simulation)
- Technical analysis: 5 tests (MA, RSI, ATR, favorability)
- Preset system: 9 tests (all combinations valid)
- Edge cases: 8 tests (flash crash, sideways, mixed data, quota, target unreachable, daily reset, price sync, CoinGecko fallback)
- Persistence: 5 tests (TA history, convergence metrics, load/restore, daily reset clears state)
- Performance: 4 tests (debounce frequency, indicators calc time, localStorage size, 30-day simulation)

**Target: 76 tests total** (42 updated + 35 new - 5 removed + 4 performance)

---

### Day 12: Performance Optimization (8 hours)

- Debounce WebSocket updates (500ms)
- React.memo on PositionRow components (re-render only if pnl/price changed)
- Web Worker for technical indicators
- React virtualization for 100+ positions (e.g. @tanstack/react-virtual)
- localStorage cleanup strategy (keep last 1000 trades, handle QuotaExceededError)

---

## Timeline Summary

| Week | Days | Deliverable |
|------|------|-------------|
| 1 | 0-3 | Foundation: types, PresetMapper, BinanceWebSocket, TechnicalAnalysis |
| 2 | 4-7 | Core: ConvergenceController, TradingBot rewrite |
| 3 | 8-12 | UI + Testing + Performance |
| Buffer | 13-14 | Edge cases, debugging, documentation |

**Total: 14 days (2 weeks + buffer)**

---

## Breaking Changes

| Component | Change | Impact |
|-----------|--------|--------|
| TradingBot.ts | Methods rewritten | Old bot configs won't work |
| Admin UI | 15+ fields -> 4 fields | Form completely different |
| Slippage | Gap-based -> random | P&L results will differ |
| BotConfig | New preset fields required | Old configs need reconfigure |
| Price source | Fake -> Binance | Positions track real prices |

**Existing bots:** Will NOT work automatically. Require reconfigure through new preset form.

**Existing UI components:** Work without changes (only use base Position/Trade fields).

**Existing trades in localStorage:** Compatible (new fields are optional, undefined = defaults).

---

## Test Execution Order

```bash
# Phase 1: Unit tests (Day 1-5 deliverables)
npm run test:unit          # 20 tests: PresetMapper, Validator, TA, Convergence

# Phase 2: Integration tests (Day 6-7 deliverables)
npm run test:integration   # 20 tests: Binance, TradingBot+Convergence, Persistence

# Phase 3: E2E tests (Day 8-11 deliverables)
npm run test:e2e           # 32 tests: updated existing + new

# Phase 4: Performance tests
npm run test:performance   # 4 tests: debounce, calc time, storage, simulation

# All tests
npm test                   # 76 total
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
[ ] All 76 tests pass
[ ] 9 preset combinations validated
[ ] Binance WebSocket connects and falls back correctly
[ ] Daily reset works (no carry-over)
[ ] Performance: < 20% CPU with 50 positions + WebSocket
[ ] localStorage: < 1MB with 1000 trades
[ ] Old trades render with "N/A" for missing fields
[ ] No console errors
[ ] Git backup branch exists
```
