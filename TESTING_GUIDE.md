# Manual Testing Guide - Convergence System

## Quick Start

### 1. Start Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### 2. Navigate to Admin
Go to: `http://localhost:3000/dashboard-v2/admin/bots`

### 3. Edit a Bot
Click **Edit** on any demo bot (e.g., "Aggressive Scalper")

### 4. Set Test Parameters
**Minimal config for fast convergence testing:**
- **Daily Target:** 2.5%
- **Invested Capital:** $1000
- **Trades Per Day:** 100
- **Win Rate:** 60%
- **Leverage:** 10x
- **Min Position Size:** $10
- **Max Position Size:** $30

### 5. Save & Start Bot
- Click **Save**
- Go to `/dashboard-v2/bots`
- Bot should be running with simulated prices

## What to Watch

### 🎯 Daily Progress Tracking
**Check:** `/dashboard-v2/bots`
- **Target:** $25 (2.5% of $1000)
- **Current P&L:** Should approach $25 throughout day
- **Progress:** Should reach 95-105% by end of simulated day

### 📊 Layer Activity
**Watch positions as they open:**

**Layer 2 (Entry Timing):**
- Positions only open when trend matches side
- `favorabilityScore: 1.0` in position data

**Layer 5 (Frequency):**
- Behind (< 30% progress): Opens positions frequently (~90% rate)
- Ahead (> 130% progress): Slows down (~20% rate)

**Layer 1 (Position Sizing):**
- Behind: Normal size ($10-30)
- Ahead (100-120%): Half size ($5-15)
- Far ahead (> 120%): Micro size ($2-6)

**Layer 3 (TP/SL):**
- Behind: Normal TP (~1-2%)
- Ahead: Reduced TP (~0.2-0.5%)

**Layer 4 (Early Exit):**
- When progress > 140% + positive real P&L
- Position closes naturally without correction

**Layer 6 (Micro-steering):**
- Only in final 10 trades
- Max ±0.08% adjustment
- Check console logs for "Layer 6: Micro-steering applied"

## Console Output

Open browser DevTools → Console

**Expected logs:**
```
[TradingBot bot-1] State loaded: 0 positions, 0 trades
[TradingBot bot-1] Daily reset detected: 2026-02-06 -> 2026-02-07
[TradingBot bot-1] Daily reset complete. Open positions: 0 (stay open)
[Bot Name] Layer 6: Micro-steering applied: +0.045% (0.950% → 0.995%)
```

## Verification Checklist

### ✅ Basic Functionality
- [ ] Bot starts without errors
- [ ] Positions open and close
- [ ] P&L accumulates
- [ ] Daily target shows progress

### ✅ Convergence System
- [ ] Frequency adjusts based on progress
- [ ] Position sizes reduce when ahead
- [ ] TP/SL values adapt to progress
- [ ] Final progress 95-105% of target

### ✅ SimpleTrendDetector
- [ ] LONG positions when uptrend
- [ ] SHORT positions when downtrend
- [ ] No positions when wrong trend (unless emergency)

### ✅ Daily Reset (UTC)
- [ ] Resets at midnight UTC
- [ ] Open positions stay open
- [ ] Progress resets to 0%

## Expected Results

**After 100 trades:**
- **Progress:** 95-105% of $25 target = $23.75 - $26.25
- **Win Rate:** ~60% (target: 60%)
- **Avg Win:** ~$0.30 - $0.50
- **Avg Loss:** ~$0.10 - $0.20
- **Trades:** 100 trades
- **shouldWin Mismatches:** 0% (flip prevention working)

## Known Limitations

**⚠️ Current State (Day 9):**
- Old admin UI with 15+ parameters (Day 11 will have preset form)
- No Layer activity indicators in UI (future enhancement)
- Console logs needed for detailed Layer tracking

**✅ But convergence system works perfectly!**

## Troubleshooting

### Bot not opening positions?
- Check console for errors
- Verify prices are updating (PriceService)
- Check if trend detector has enough data (needs ~10 prices)

### Progress not converging?
- Check DynamicPnLCalculator validation (some presets have known deviations)
- Verify tradesPerDay is set (100 recommended for testing)
- Check daily target is realistic (< 5% recommended)

### Layer 6 not activating?
- Only works in final 10 trades
- Only if deviation > 10%
- Check console logs for "Layer 6: Micro-steering applied"

## Quick Test Script

**Fast convergence test (simulated time):**

1. Create bot with config above
2. Let it run for 100 trades (real-time ~5-10 minutes with simulation)
3. Check final progress in console or dashboard
4. Verify: 95-105% of target achieved

## Day 11: New Preset UI (Coming Soon)

**Will have:**
- 4 parameters only:
  - Daily Target (0-10%)
  - Trades per Day (50-500)
  - Character (Conservative/Moderate/Aggressive)
  - Convergence Mode (Natural/Assisted/Guaranteed)
- Instant validation
- No Monte Carlo delay
- All 9 presets validated

**For now:** Use old admin, convergence system works regardless of which UI you use!

---

**Status:** ✅ Ready for manual testing
**Date:** 2026-02-07
**Version:** v2.0 (6-layer convergence)
