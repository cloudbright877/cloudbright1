# Adaptive Convergence System - Specification

**Version:** 6.0 (Post-review)
**Date:** 2026-02-06
**Status:** Ready for implementation

---

## Executive Summary

**Problem:** Current master bot system requires 15+ manual parameters, uses fake price simulation, applies unrealistic gap-based slippage as a convergence hack, has no target guarantee, and is untestable (infinite parameter combinations).

**Solution:** Replace with 4-parameter preset system + real Binance prices + 6-layer intelligent convergence.

**Key metrics:**
- Setup time: 30 seconds (was 5-10 minutes)
- Parameters: 4 (was 15+)
- Target probability: 94-97% (was unknown)
- Price source: Binance WebSocket with CoinGecko + simulation fallback
- Testable combinations: 9 (was infinite)

---

## Architecture

```
Admin UI (4 parameters)
  |
  v
PresetMapper (deterministic: input -> full config)
  |
  v
BotValidator (Monte Carlo 1000-day simulation, reject if convergence < 90%)
  |
  v
Binance WebSocket (real-time prices, 3-tier fallback)
  |
  v
Technical Analysis Engine (MA20/50, RSI14, ATR14 -> favorability score 0-1)
  |
  v
6-Layer Convergence Controller (sizing, timing, TP/SL, early exit, frequency, micro-steering)
  |
  v
Trading Executor (real prices, natural TP/SL, realistic slippage)
  |
  v
Daily Target Tracker (progress %, layers active, trades remaining)
```

### Core Principles

1. **Deterministic presets** - same input always produces same config, only 9 valid combinations
2. **Real market integration** - Binance WebSocket for entry prices, real-time position tracking
3. **Hybrid outcome model** - outcomes pre-determined (shouldWin), layers minimize correction at close to look realistic
4. **Backward compatible UI** - LiveOpenPositions and ClosedTradesActivity work without changes

### Hybrid Model (critical concept)

```
Entry:   real Binance price (realistic chart)
Open:    position tracks real price movement (realistic open positions)
Close:   shouldWin pre-determined, correction applied at close
Layers:  MINIMIZE correction size so trade history looks natural
```

**shouldWin stays.** The bot pre-determines if a trade wins or loses (same as current system).
The 6 layers don't replace pre-determined outcomes — they make the correction at close SMALLER:
- Layer 2 enters when trend matches side → real price naturally moves toward TP → less correction needed
- Layer 3 adjusts TP/SL closer to where price already is → correction smaller
- Layer 4 closes when real P&L is already positive → correction = 0
- Layer 6 does final daily P&L micro-adjustment

**Correction at close:** difference between real P&L and target P&L, applied as part of slippage.
If layers worked well: correction < 0.1% (invisible in market noise).
If layers worked poorly: correction 0.3-0.5% (still within volatile slippage range).

---

## Preset System

### Admin Inputs (4 parameters)

| Parameter | Type | Default | Range |
|-----------|------|---------|-------|
| Daily Target | number | 2.5% | 0-10% |
| Trades per Day | number | 250 | 50-500 |
| Character | enum | moderate | conservative / moderate / aggressive |
| Convergence Mode | enum | guaranteed | natural / assisted / guaranteed |

Note: Realism mode (smooth/realistic/volatile) is derived from character or set as 5th optional parameter.

### Character Profiles

| Character | Win Rate | Leverage | Risk | Best for |
|-----------|----------|----------|------|----------|
| Conservative | 55% | 5-10x | Low | Stable growth, minimal drawdown |
| Moderate | 60% | 10-20x | Medium | Most scenarios (DEFAULT) |
| Aggressive | 75% | 20-50x | High | Maximum returns, accept volatility |

### Realism Modes

| Mode | Tight % | Volatility | Slippage Range | Visual |
|------|---------|------------|----------------|--------|
| Smooth | 90% | Low | 0.05-0.15% | Clean charts |
| Realistic | 80% | Medium | 0.05-0.30% | Natural swings (DEFAULT) |
| Volatile | 60% | High | 0.05-0.50% | Dramatic spikes |

### Convergence Modes

| Mode | Layers Active | Target Probability | Micro-steering |
|------|---------------|-------------------|----------------|
| Natural | 1-3 | 80-85% | Disabled |
| Assisted | 1-5 | 88-92% | Emergency only (final 5 trades) |
| Guaranteed | 1-6 | 94-97% | Final 10 trades if deviation > 10% |

### Preset Matrix (9 combinations, all testable)

| Character | Realism | WR | Leverage | Tight % | Volatility |
|-----------|---------|-----|----------|---------|------------|
| Conservative | Smooth | 55% | 5-10x | 90% | Low |
| Conservative | Realistic | 55% | 5-10x | 80% | Medium |
| Conservative | Volatile | 55% | 5-10x | 60% | High |
| Moderate | Smooth | 60% | 10-20x | 90% | Low |
| **Moderate** | **Realistic** | **60%** | **10-20x** | **80%** | **Medium** |
| Moderate | Volatile | 60% | 10-20x | 60% | High |
| Aggressive | Smooth | 75% | 20-50x | 90% | Low |
| Aggressive | Realistic | 75% | 20-50x | 80% | Medium |
| Aggressive | Volatile | 75% | 20-50x | 60% | High |

---

## 6-Layer Convergence Controller

**Goal:** Minimize correction at close so trade history looks natural. All layers reduce the gap between real P&L and target P&L.

All layers evaluate simultaneously. `getActiveLayer()` returns dominant layer for UI display only.

Undefined progress ranges default to normal behavior (1.0x multiplier, 0.6 frequency).

### Layer 1: Position Sizing

Adjust position size based on daily target progress. Bigger positions = each small correction has bigger $ impact.

| Progress | Multiplier | Rationale |
|----------|-----------|-----------|
| < 30% | 3.0x | Behind: bigger positions, each correction matters more |
| 30-60% | 1.8x | Slightly behind |
| 60-110% | 1.0x | On track, normal |
| 110-130% | 0.5x | Ahead, smaller positions to protect |
| > 130% | 0.2x | Way ahead, coast |

### Layer 2: Entry Timing

Enter when trend matches side → real price naturally moves toward TP → correction at close is smaller and more realistic.

**Favorability Score (0-1):**
- Base: 0.5
- Trend alignment (LONG + uptrend, or SHORT + downtrend): +0.3
- Medium/high volatility: +0.1 / +0.2

**Threshold logic:**
- Behind (progress < 30%): open only if favorability > 0.7 (need realistic-looking entries)
- Normal (30-110%): open if favorability > 0.4
- Ahead (> 130%): open if favorability > 0.5 AND random < 0.3
- **Emergency** (< 50 trades remaining AND progress < 80%): open if favorability > 0.2

Note: Layer 2 and Layer 5 stack. When behind, Layer 5 increases candidate pool (0.9), Layer 2 filters to high-quality entries. Effective rate ≈ 0.27. This is intentional: fewer trades but each needs less correction.

### Layer 3: TP/SL Adjustment

Adjust target P&L to be closer to where real price already is → correction smaller.

| Progress | TP Multiplier | SL Multiplier | Rationale |
|----------|--------------|--------------|-----------|
| < 30% | 2.0x | 1.0x | Bigger target wins (outcome forced anyway) |
| 30-60% | 1.3x | 1.0x | Slightly bigger wins |
| 60-110% | 1.0x | 1.0x | Normal targets |
| 110-130% | 0.6x | 1.2x | Smaller wins, wider SL |
| > 130% | 0.4x | 1.5x | Quick small wins |

Note: Since shouldWin is pre-determined, TP/SL ratio does NOT affect win probability. Layer 3 adjusts the SIZE of each win/loss, not whether it wins.

### Layer 4: Early Exit

Close winning positions early when ahead and real P&L is already positive → correction = 0 (natural close).

| Progress | Early Close Chance | Condition |
|----------|-------------------|-----------|
| < 120% | 0% | Never close early |
| 120-140% | 30% | If real P&L already positive |
| > 140% | 50% | If real P&L already positive |

### Layer 5: Frequency Control

Control candidate pool size. More trades → each correction is smaller (spread across more trades).

| Progress | Frequency | Rationale |
|----------|----------|-----------|
| < 30% | 0.9 | More candidates for Layer 2 to filter |
| 30-80% | 0.7 | Slightly above normal |
| 80-120% | 0.6 | Normal pace |
| 120-130% | 0.4 | Slow down |
| > 130% | 0.2 | Throttle |

Note: if progress < 30% but trades remaining <= 100, frequency stays 0.6 (not enough runway to boost).

### Layer 6: Micro-steering (last resort)

Tiny P&L adjustment on final trades to hit daily target exactly. Constraints:
- Only if remaining trades <= 10
- Only if deviation > 10% from target
- Max 0.08% per trade (hard limit, within market noise)
- If needed > 1.0%: log "Target unreachable", accept miss

---

## Binance Integration

### 3-Tier Fallback Chain

```
Priority 1: Binance WebSocket (real-time ~100ms)
  URL: wss://stream.binance.com:9443/stream
  Streams: btcusdt@ticker, ethusdt@ticker, solusdt@ticker
  On disconnect: exponential backoff (5s, 10s, 20s... max 10 attempts)
    |
    v (10 failed reconnects)
Priority 2: CoinGecko API (polling every 30s)
  URL: https://api.coingecko.com/api/v3/simple/price
  Free tier, no auth required
    |
    v (3 consecutive failures)
Priority 3: Price Simulation (fallback)
  Random walk from last known real price
  Volatility-based movement (+-0.1-0.5% per tick)
    |
    v (Binance/CoinGecko recovers)
Auto-resume real prices
```

Bot NEVER stops trading. `priceSource` field tracks active source: `'binance' | 'coingecko' | 'simulated'`.

### Technical Analysis Engine

Calculated from price history (last 100 candles):
- **MA(20, 50):** trend detection (MA20 > MA50 = uptrend)
- **RSI(14):** momentum, normalized to -1..+1
- **ATR(14):** volatility estimation (low/medium/high based on ATR% of price)
- **Favorability Score:** composite 0-1 score for entry timing

### Price Update Flow

```
Price source -> Update technical indicators -> Calculate favorability
  -> Update open positions (currentPrice = latest)
  -> Check TP/SL naturally (real price hits target?)
  -> Apply realistic slippage on close (random 0.05-0.3%, NOT gap-based)
```

### Critical Requirements

- **Debounce** WebSocket updates: max 1 UI re-render per 500ms
- **Web Worker** for technical indicator calculations (3360 ops/sec on main thread = lag)
- **Price validation:** price > 0 AND price < 1,000,000
- **Stale detection:** reject prices > 10 seconds old
- **WSS only** (never WS), reconnect with exponential backoff

---

## Slippage Model (replaces gap-based)

**Old (DELETE):** `slippage = (targetPnL - realPnL) / leverage` — unrealistic, forces exact outcome.

**New:** Random noise based on volatility setting:

| Volatility | Min | Max | Direction |
|-----------|-----|-----|-----------|
| Low | 0.05% | 0.15% | Random (50/50) |
| Medium | 0.05% | 0.30% | Random (50/50) |
| High | 0.05% | 0.50% | Random (50/50) |

Slippage is truly random, not outcome-dependent.

---

## Mathematical Foundation

### Base Formula (DynamicPnLCalculator, unchanged)

```
perTradeTarget = dailyTarget / trades
denominator = WR - (LR^2 / WR) * 0.7
baseWin = perTradeTarget / denominator
baseLoss = baseWin * (LR / WR) * 0.7

E[Daily] = trades * (WR * baseWin - LR * baseLoss) = dailyTarget  (QED)
```

Formula is mathematically correct. Layers apply AFTER this calculation.

### Variance Reduction

Without layers: E[X] = target, but Var[X] high -> P(within 10% of target) ~ 70-80%
With layers: E[X] = target, Var[X] reduced by factor k -> P(within 10%) ~ 94-97%

| Mode | Variance reduction factor (k) | Target probability |
|------|------|-----|
| Natural (L1-3) | ~1.5 | 80-85% |
| Assisted (L1-5) | ~2.5 | 88-92% |
| Guaranteed (L1-6) | ~4.0 | 94-97% |

---

## Daily Reset

- Reset daily progress at 00:00 UTC (`.toISOString()` comparison)
- Open positions stay open (their P&L does NOT count toward new day's progress)
- Convergence metrics reset (micro-steering counter, layer states)
- If bot was offline at reset time: catches up on next `tick()`
- **No carry-over:** missed target on Day 1 does NOT affect Day 2

---

## Edge Cases

| Edge Case | Probability | Severity | Mitigation |
|-----------|-------------|----------|------------|
| WebSocket disconnect | Medium | High | 3-tier fallback (Binance -> CoinGecko -> Simulation) |
| Invalid Binance data | Low | Medium | Validation (price > 0, < 1M) + stale detection (> 10s) |
| Flash crash -30% | Low | High | Layers 1-6 activate, accept target miss if gap > realistic limits |
| Favorability always low (sideways) | Medium | Medium | Emergency threshold 0.2 when < 50 trades remaining |
| Micro-steering overuse | Low | Low | Hard cap 0.08% per trade, only final 10 trades |
| Mixed old/new data in UI | High | Low | Default values (priceSource='simulated', favorability='N/A') |
| binancePrice vs currentPrice confusion | Medium | Medium | currentPrice = authoritative (for TP/SL), binancePrice = reference only |
| Performance with 1000+ positions | Low | High | React virtualization + debounce + React.memo |
| localStorage quota exceeded | Low | Medium | Cleanup (keep last 500-1000 trades), retry after cleanup |

### Fallback Strategy for Unreachable Target

1. Log error: "Target unreachable with realistic limits"
2. Accept target miss for this day (no forced slippage)
3. Continue trading normally (no crash)
4. Reset next day (fresh start, no penalty)
5. Admin can review daily summary and adjust preset

---

## Type Changes

### Position (add optional fields, backward compatible)

```typescript
// NEW optional fields:
binancePrice?: number;                        // Last known Binance price (reference)
priceSource?: 'simulated' | 'binance';        // Source of currentPrice (default: 'simulated')
favorabilityScore?: number;                   // 0-1 from Technical Analysis
convergenceLayer?: number;                    // 0-6, dominant layer for UI
_version?: 'v1' | 'v2';                      // Data version tag
```

### Trade (add optional fields, backward compatible)

```typescript
// NEW optional fields:
priceSource?: 'simulated' | 'binance';
favorabilityScore?: number;
technicalIndicators?: {
  ma20: number; ma50: number; rsi: number; atr: number;
  trend: 'up' | 'down' | 'sideways';
  momentum: number; volatility: 'low' | 'medium' | 'high';
};
```

### BotConfig (add preset fields)

```typescript
// NEW fields:
character?: 'conservative' | 'moderate' | 'aggressive';
realismMode?: 'smooth' | 'realistic' | 'volatile';
convergenceMode?: 'natural' | 'assisted' | 'guaranteed';
volatility?: 'low' | 'medium' | 'high';
```

---

## Performance Requirements

| Metric | Target | Mitigation |
|--------|--------|------------|
| WebSocket re-renders | Max 2/sec | Debounce 500ms |
| Technical indicators CPU | < 15% | Web Worker + throttle 1/sec |
| UI with 100+ positions | 60fps | React virtualization + memo |
| localStorage per 1000 trades | < 600KB | Cleanup strategy (keep last 1000) |

## Security Requirements

- WSS only (never WS)
- Reconnect: exponential backoff, max 10 attempts (no infinite loop)
- No `dangerouslySetInnerHTML` for new fields
- Never store API keys in localStorage

---

## Success Criteria

### Functional
- Admin creates bot in 30 seconds (4 parameters)
- All 9 preset combinations pass validation (convergence > 90%)
- Binance WebSocket provides real prices (< 200ms latency)
- Technical indicators calculate correctly
- 6-layer convergence achieves 94%+ target probability (Guaranteed mode)
- Existing UI components work without modification

### Testing
- 72+ tests pass (unit + integration + E2E)
- Coverage > 90% on core logic
- All 9 presets validated
- Edge cases covered

### Performance
- Config time < 60 seconds
- Binance uptime > 99%
- Position update latency < 500ms
- UI preview simulation < 3 seconds
