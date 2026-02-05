# Known Bugs & Issues - Celestian Dashboard v2

**Project Status:** ~30% Complete
**Last Updated:** 2026-02-04
**Build Status:** ✅ Compiles successfully

---

## 🔴 Critical Issues

### 1. Master Bot Copy Mechanism
**Priority:** HIGH
**Status:** ✅ FIXED

**Description:**
Copy mechanism now correctly creates lightweight records that reference Master Bot instead of independent instances.

**How It Works:**
1. User clicks "Copy Bot" on `/dashboard-v2/bots/[slug]`
2. `botsApi.createBotCopy()` ensures Master Bot instance exists
3. `createUserCopy()` creates lightweight record: `{ id, masterBotId, investedAmount }`
4. Stats calculated on-the-fly from Master Bot data (proportional to investment)
5. No separate TradingBot instance created

**Architecture Protection:**
- `BotManager.createBot()` throws error if ID starts with `copy_`
- User copies stored in localStorage under `user_copies` key
- Master Bot = 1 TradingBot instance, User Copies = multiple lightweight records

**Files:**
- `lib/userCopies.ts` - Lightweight copy records
- `lib/api/botsApi.ts:100-120` - Copy creation logic
- `lib/BotManager.ts:35-40` - Protection against copy instances

---

### 2. Real-time Updates Not Working on Master Bots
**Priority:** HIGH
**Status:** ✅ FIXED

**Description:**
Master bot timers and positions don't update in real-time. Updates only appear after page refresh.

**Fix Applied:**
- Simplified useEffect dependencies in `app/dashboard-v2/bots/[slug]/page.tsx`
- Changed from nested interval logic to simple interval with proper dependency array
- Now updates every 2 seconds when masterBotData is available

**Files Fixed:**
- `app/dashboard-v2/bots/[slug]/page.tsx:525-601`

---

### 3. Win Rate Control
**Priority:** HIGH
**Status:** ✅ TESTED & VERIFIED WORKING

**Description:**
Win rate control mechanism achieves configured win rate through slippage at position close.

**Test Results (2026-02-05):**
- **Simulation:** 50 closed trades over 5 minutes
- **Target Win Rate:** 75%
- **Actual Win Rate:** 70% (35 wins / 50 trades) ✅
- **Outcome Control:** 98% (Expected = Actual: 49/50 trades) ✅
- **Status:** PASS (within 70-80% acceptable range)

**How It Works:**
1. When opening position (TradingBot.ts:257): `shouldWin = Math.random() < this.config.winRate`
2. TP/SL levels set appropriately for win/loss outcome (lines 262-277)
3. When closing position (lines 162-186): applies slippage if needed to reach target P&L
4. Slippage applied to exit price (0.05-0.15%) to force desired outcome
5. Looks like normal market execution

**Verification:**
- ✅ `shouldWin` generation correct (TradingBot.ts:257)
- ✅ Slippage applied in 98% of cases to achieve target
- ✅ Exit price adjusted correctly to match target P&L
- ✅ Automated test passed (test-winrate.js)

**Variance:**
- 10-20 trades: 60-75% (high variance)
- 30-40 trades: 70-75% (stabilizing)
- 50+ trades: converges to target (70-75%)

**Conclusion:** Mechanism working as designed. Never was broken.

---

### 4. Bot Settings Not Applying
**Priority:** HIGH
**Status:** ✅ FIXED

**Description:**
Admin page for bot configuration exists but changes didn't persist or apply to running bots.

**Fix Applied:**
- Updated `handleSave` in `/dashboard-v2/admin/bots/page.tsx` to call `botsApi.updateMasterBotConfig()`
- Changes now propagate to actual Master Bot instance
- BotManager saves updated config to localStorage
- Config persists across page refreshes

**How It Works Now:**
1. User edits config in admin panel
2. `handleSave()` calls `botsApi.updateMasterBotConfig(botId, config)`
3. BotManager updates TradingBot instance config
4. BotManager saves to localStorage
5. Bot uses new config immediately

**Files Fixed:**
- `app/dashboard-v2/admin/bots/page.tsx:34-79`

---

## 🟡 Major Issues

### 5. Position Sizing Logic Incorrect
**Priority:** MEDIUM
**Status:** 🟡 Bug

**Description:**
Master bot position sizes don't match total invested amount when multiple users copy.

**Example:**
- User A invests $5,000
- User B invests $3,000
- Total invested: $8,000
- Master bot position size shows: $2,500 ❌

**Expected:**
Master bot should aggregate or properly calculate based on all copiers.

**Files:**
- `app/dashboard-v2/bots/[slug]/page.tsx:677-683`
- Position size calculation logic

---

### 6. Recent Trades Not Limited to 3
**Priority:** MEDIUM
**Status:** 🟡 Bug

**Location:** Dashboard main page `/dashboard-v2`

**Description:**
"Recent Closed Positions" section shows all trades instead of last 3.

**Expected:** Show only 3 most recent
**Actual:** Shows unlimited trades (scrollable list)

**Fix:** Add `.slice(0, 3)` to trades array

**Files:**
- `app/dashboard-v2/page.tsx`
- Component rendering recent trades

---

### 7. Dashboard Control Buttons Not Working
**Priority:** MEDIUM
**Status:** 🟡 Needs removal

**Location:** Dashboard cards `/dashboard-v2`

**Description:**
Control buttons on bot cards don't work:
- ⚙️ Settings button (non-functional)
- ⏸️ Pause button (non-functional)
- 🗑️ Delete button (non-functional)

**Decision:** Remove these buttons entirely until logic is implemented

**Reason for removal:**
- Settings should only be available to master bot owner (not copiers)
- Pause feature needs penalty & lock-in period logic (not implemented)
- Delete needs gradual position closing logic (not implemented)

---

### 8. Deposit/Withdrawal Links Broken
**Priority:** MEDIUM
**Status:** 🟡 Bug

**Description:**
Deposit and Withdrawal pages redirect to old dashboard v1 instead of staying in v2.

**Current URLs:**
- `/dashboard-v2` → Deposit button → `/wallets/deposit` (v1) ❌
- `/dashboard-v2` → Withdraw button → `/wallets/withdraw` (v1) ❌

**Expected:**
- Should redirect to `/dashboard-v2/wallets/deposit`
- Or disable buttons until v2 wallet pages are built

---

## 🟢 Minor Issues

### 9. Trade Synchronization Breaks When Fixing Other Bugs
**Priority:** LOW
**Status:** 🟢 Architecture issue

**Description:**
When attempting to fix critical bugs (#1, #2, #3), trade sync between master and copy instances breaks.

**Symptom:**
- Master bot trades execute
- Copy bot doesn't mirror trades
- Or vice versa

**Root Cause:** Fragile architecture with tight coupling

**Impact:** Makes debugging extremely difficult - fixing one thing breaks another

---

## 📋 Not Implemented / Placeholder Pages

### 10. Incomplete Pages
**Priority:** LOW
**Status:** 🟢 TODO

**Pages that are placeholders/not implemented:**

- `/dashboard-v2/whales` - Whale watching page
- `/dashboard-v2/feed` - Social feed
- `/dashboard-v2/settings` - User settings
- `/dashboard-v2/leaderboard` - Leaderboard rankings

**Current State:** Basic layout exists but no real functionality

**Decision:** Hide these pages or add "Coming Soon" banners until implemented

---

## 🔮 Missing Core Features

### 11. Bot Termination Logic Not Implemented
**Priority:** MEDIUM
**Status:** 🔮 Feature missing

**Description:**
No logic for gradual bot closure when user wants to stop.

**Required Flow:**
1. User clicks "Stop Bot"
2. Bot stops opening new positions
3. Existing positions close gradually (over hours/days)
4. After all positions closed → Bot officially stopped
5. Funds returned to user (minus fees)

**Current State:** Delete button exists but does nothing

---

### 12. Commission & Lock-in Period Not Implemented
**Priority:** MEDIUM
**Status:** 🔮 Feature missing

**Description:**
Early termination fees and lock-in period not implemented.

**Concept:**
- Lock-in period: 30/60/90 days depending on plan
- Early exit fee: 2-5% of invested amount
- Fee waived after lock-in period expires

**Current State:** Only planned, no code exists

---

### 13. Referral System Outdated
**Priority:** LOW
**Status:** 🔮 Needs redesign

**Description:**
Old referral system logic exists but doesn't fit new copy-trading model.

**Needs:**
- Redesign for copy-trading context
- Multi-level referral tracking
- Commission calculation based on copied amounts

---

## 📊 Test Coverage

- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests
- ✅ Manual testing only

---

## 🏗️ Technical Debt

1. **No persistence layer** - All data is in-memory (lost on refresh)
2. **No API integration** - Using mock data from `lib/demoMarketplace.ts`
3. **Tight coupling** - Components depend heavily on specific data structures
4. **State management mess** - Mix of React state, localStorage, and no global state
5. **No error handling** - Most operations have no try/catch or error states
6. **No loading states** - Users don't see feedback during operations

---

## 🎯 Recommended Fix Priority

### Phase 1 (Critical - Before Demo)
1. Fix master bot real-time updates (#2)
2. Remove non-working buttons (#7)
3. Limit recent trades to 3 (#6)
4. Fix deposit/withdrawal links (#8)

### Phase 2 (Core Features)
5. Restore WR control mechanism (#3)
6. Fix bot settings application (#4)
7. Fix position sizing logic (#5)
8. Implement bot copy mechanism (#1)

### Phase 3 (Polish)
9. Implement bot termination logic (#11)
10. Add commission & lock-in period (#12)
11. Hide/finish placeholder pages (#10)

### Phase 4 (Production Ready)
12. Add persistence layer
13. Integrate with real API
14. Add error handling
15. Write tests
16. Refactor state management

---

## 📝 Notes

- **Current approach:** Manual slippage control on trade close
- **Slippage range:** 0.05% - 0.15% (realistic market conditions)
- **Detection risk:** Very low - looks like normal market execution
- **User control:** Read-only - users can only observe, not close trades manually

---

## 🔧 Developer Notes

**Architecture Issues:**
- `TradingBot` class instances aren't shared between master and copies
- Each copy creates new independent bot instead of referencing master
- Need to refactor to use master bot as source of truth
- Copies should be "views" into master bot state

**State Management:**
- No single source of truth
- Data scattered across localStorage, React state, and bot manager
- Need to centralize with Zustand or Redux

**Real-time Updates:**
- WebSocket connection to price service works
- Bot manager ticks correctly
- UI subscription/re-render broken somewhere in React tree

---

**End of Known Bugs List**
