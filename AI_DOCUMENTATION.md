# Celestian Copy Trading Platform - AI Technical Documentation

## META_INFO
```yaml
project_name: "Celestian Copy Trading Platform"
version: "2.0.0-alpha"
framework: "Next.js 16.0.10 (Turbopack)"
language: "TypeScript 5.9.3"
build_status: "PASSING"
completion: "~30%"
architecture: "Client-side trading engine + Mock API layer"
deployment_ready: "NO"
```

---

## CRITICAL_PATHS

### Entry Points
```typescript
// Main Dashboard Entry
FILE: app/dashboard-v2/page.tsx
ROUTE: /dashboard-v2
PURPOSE: Main user dashboard with portfolio overview

// Bot Marketplace
FILE: app/dashboard-v2/bots/page.tsx
ROUTE: /dashboard-v2/bots
PURPOSE: Browse available master bots

// Bot Detail Page
FILE: app/dashboard-v2/bots/[slug]/page.tsx
ROUTE: /dashboard-v2/bots/:slug
PURPOSE: Master bot details + copy functionality

// User Copy Instance
FILE: app/dashboard-v2/copy/[copyId]/page.tsx
ROUTE: /dashboard-v2/copy/:copyId
PURPOSE: Individual user's copied bot instance

// Admin Bot Management
FILE: app/dashboard-v2/admin/bots/page.tsx
ROUTE: /dashboard-v2/admin/bots
PURPOSE: Configure master bot parameters
```

---

## CORE_ARCHITECTURE

### Layer 1: Trading Engine (Client-Side)
```
lib/trading/
├── TradingBot.ts          # Core bot logic, position management
├── DailyTargetController.ts # Daily profit target tracking
├── types.ts               # Type definitions (Position, Trade, BotConfig)
└── BotConfig.ts           # Bot configuration utilities
```

**KEY_CLASS: TradingBot**
```typescript
LOCATION: lib/trading/TradingBot.ts
METHODS:
  - tick(prices): Main loop, called every second
  - managePositions(prices): Check open positions, close if needed
  - tryOpenNewPosition(prices): Open new positions based on frequency
  - closePosition(position, price): Close position with slippage control
  - getStats(): Return bot statistics
  - updateBotConfig(config): Update configuration
CRITICAL: Position closing applies slippage (0.05-0.15%) to control win/loss
```

### Layer 2: Bot Manager
```
lib/BotManager.ts          # Singleton managing all bot instances
lib/api/botsApi.ts         # API abstraction layer
lib/demoMarketplace.ts     # Master bot definitions (10 bots)
```

**KEY_CLASS: BotManager**
```typescript
LOCATION: lib/BotManager.ts
METHODS:
  - createBot(config, id?): Create new bot instance
  - getBot(id): Get bot by ID
  - tick(prices): Tick all bots
  - save(): Persist to localStorage
  - load(): Load from localStorage
STORAGE: localStorage key 'trading-bots'
```

### Layer 3: Price Service
```
lib/PriceService.ts        # WebSocket connection to price feeds
hooks/useBinancePrices.ts  # React hook for price subscription
```

**KEY_CLASS: PriceService**
```typescript
LOCATION: lib/PriceService.ts
PURPOSE: Simulated real-time price updates
METHOD: subscribe(callback): Register price update listener
INTERVAL: Updates every 1000ms
PAIRS: BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT, MATIC/USDT
```

### Layer 4: Copy Trading Logic
```
lib/userCopies.ts          # User copy instances management
lib/userCopyStats.ts       # Statistics for copied bots
lib/seedBots.ts            # Seed initial bot data
```

**KEY_FUNCTIONS:**
```typescript
// Create user copy
FUNCTION: createUserCopy(masterBotId, investedAmount)
LOCATION: lib/userCopies.ts:15
RETURNS: string (copyId)
SIDE_EFFECT: Creates new TradingBot instance in BotManager

// Get copy statistics
FUNCTION: getUserCopyStats(copyId)
LOCATION: lib/userCopyStats.ts:45
RETURNS: BotStats | null
```

---

## DATA_MODELS

### Position
```typescript
LOCATION: lib/trading/types.ts:5-23
{
  id: string                  // Unique position ID
  pair: string                // e.g., "BTC/USDT"
  side: 'LONG' | 'SHORT'      // Position direction
  leverage: number            // 1-125x
  entryPrice: number          // Entry price in USD
  currentPrice: number        // Current market price
  pnl: number                 // Profit/Loss in USD
  pnlPercent: number          // P&L percentage
  positionSize: number        // Position value in USD
  amount: number              // Asset amount
  stopLoss: number            // Stop loss price
  takeProfit: number          // Take profit price
  openedAt: number            // Unix timestamp
  duration: string            // Human-readable duration
  shouldWin: boolean          // Pre-determined outcome
  targetPnL: number           // Target P&L percent
  stopLossPnL: number         // Stop loss P&L percent
}
```

### Trade
```typescript
LOCATION: lib/trading/types.ts:25-42
{
  id: string
  pair: string
  side: 'LONG' | 'SHORT'
  leverage: number
  entryPrice: number
  exitPrice: number           // Exit price (with slippage applied)
  amount: number
  positionSize: number
  pnl: number
  pnlPercent: number
  duration: string
  closedAt: string
  expectedOutcome: 'WIN' | 'LOSS'
  actualOutcome: 'WIN' | 'LOSS'
  hadSlippage: boolean        // If slippage was applied
  slippageAmount?: number     // Slippage in USD
}
```

### BotConfig
```typescript
LOCATION: lib/trading/types.ts:44-81
{
  name: string
  tradingPair: string
  investedCapital: number
  createdAt?: number

  // Trading Parameters
  leverage?: number           // Default: random [3,5,10]
  allowedSides?: 'LONG' | 'SHORT' | 'BOTH'

  // Performance Targets
  winRate: number             // 0-1 (e.g., 0.75 = 75%)
  dailyTargetPercent: number  // Daily profit target
  tradesPerDay: number

  // Position Sizing
  minPositionSize: number     // Min position in USD
  maxPositionSize: number     // Max position in USD

  // P&L Ranges (per trade %)
  winPnLMin: number
  winPnLMax: number
  lossPnLMin: number
  lossPnLMax: number

  // Duration Control
  minDuration: number         // Milliseconds
  maxDuration: number         // Milliseconds

  // Position Management
  maxConcurrentPositions: number  // 1-10
  openFrequency: number       // 0-1 (chance to open)

  // Risk Management
  maxSlippage?: number        // Default: 0.5%
  maxTradesHistory?: number   // Default: 100
}
```

### DemoBot
```typescript
LOCATION: lib/demoMarketplace.ts:7-34
{
  id: string
  slug: string                // URL identifier
  name: string
  icon: string                // Emoji
  risk: 'low' | 'medium' | 'high'
  strategy: string
  description: string
  verified: boolean
  trending: boolean
  ageMonths: number
  tags: string[]
  config: BotConfig
  stats: {
    rating: number            // 1-5
    reviews: number
    copiers: number
    minInvestment: number
    return7d: number
    return30d: number
    return90d: number
    return1y: number
    winRate: number
    maxDD: number             // Max drawdown
    sharpeRatio: number
  }
  performanceData: number[]   // 30-day chart data
}
```

---

## STATE_MANAGEMENT

### localStorage Keys
```typescript
'trading-bots'              // BotManager serialized state
'user-copies'               // User copy instances
'demo-marketplace-stats'    // Marketplace statistics
```

### No Global State Management
```
ISSUE: No Zustand/Redux/Context
STATUS: Each component manages own state
IMPACT: Difficult to sync data across components
```

---

## API_LAYER

### Mock API (Current)
```typescript
LOCATION: lib/api/botsApi.ts
PURPOSE: Abstraction layer for future backend integration

METHODS:
  getMasterBots(): Promise<DemoBot[]>
  getMasterBot(id): Promise<DemoBot | null>
  getMasterBotStats(id): Promise<AggregatedMasterBotStats>
  createBotCopy(masterBotId, amount): Promise<string>
  getUserCopies(userId?): Promise<BotStats[]>
  getUserCopy(copyId): Promise<BotStats | null>
  deleteUserCopy(copyId): Promise<void>
  initializeMasterBots(): Promise<void>

CURRENT: Uses localStorage + BotManager
FUTURE: Will use fetch() to Express API
```

### Backend Integration Points (TODO)
```http
GET    /api/marketplace/bots           # List master bots
GET    /api/marketplace/bots/:id       # Get master bot
GET    /api/marketplace/bots/:id/stats # Get bot statistics
POST   /api/user/bots                  # Copy bot
GET    /api/user/bots                  # List user copies
GET    /api/user/bots/:copyId/stats    # Get copy stats
DELETE /api/user/bots/:copyId          # Delete copy
PATCH  /api/marketplace/bots/:id       # Update bot config (admin)
```

---

## COMPONENT_STRUCTURE

### Dashboard Components
```
components/dashboard-v2/
├── Sidebar.tsx              # Left navigation
├── TopBar.tsx               # Top bar with user info
├── BotCarousel.tsx          # Trending bots carousel
├── CopyBotModal.tsx         # Copy bot modal
├── BotSettingsModal.tsx     # Bot settings editor
├── AddFundsModal.tsx        # Add funds to copy
├── ConfirmationModal.tsx    # Generic confirmation
├── LiveOpenPositions.tsx    # Live positions display
├── ClosedTradesActivity.tsx # Recent trades
└── MiniChart.tsx            # Small performance chart
```

### Key Component Props
```typescript
// CopyBotModal
PROPS: {
  isOpen: boolean
  onClose: () => void
  demoBot: DemoBot | MasterBotData
  userBalance?: number
}

// LiveOpenPositions
PROPS: {
  positions: LivePosition[]
}
INTERFACE LivePosition: {
  id, pair, side, leverage, entryPrice, currentPrice,
  pnl, pnlPercent, stopLoss, takeProfit, openedAt,
  duration, priceDirection?, type?
}
```

---

## ROUTING_MAP

```yaml
LAYOUT: app/dashboard-v2/layout.tsx
AUTH: No authentication (demo mode)

ROUTES:
  /dashboard-v2:
    PAGE: app/dashboard-v2/page.tsx
    PURPOSE: Main dashboard
    DATA: User portfolio, active copies, recent trades

  /dashboard-v2/bots:
    PAGE: app/dashboard-v2/bots/page.tsx
    PURPOSE: Master bot marketplace
    DATA: DEMO_BOTS from lib/demoMarketplace.ts

  /dashboard-v2/bots/[slug]:
    PAGE: app/dashboard-v2/bots/[slug]/page.tsx
    PURPOSE: Master bot detail + copy action
    PARAMS: slug (e.g., 'btc-scalper')
    DATA: Bot config, stats, positions, trades

  /dashboard-v2/copy/[copyId]:
    PAGE: app/dashboard-v2/copy/[copyId]/page.tsx
    PURPOSE: User's copied bot instance
    PARAMS: copyId (UUID)
    DATA: Copy stats, positions, trades

  /dashboard-v2/portfolio:
    PAGE: app/dashboard-v2/portfolio/page.tsx
    PURPOSE: All user copies overview

  /dashboard-v2/analytics:
    PAGE: app/dashboard-v2/analytics/page.tsx
    PURPOSE: Performance analytics

  /dashboard-v2/admin/bots:
    PAGE: app/dashboard-v2/admin/bots/page.tsx
    PURPOSE: Admin panel for bot config
    ACCESS: No auth check (TODO)

PLACEHOLDER_ROUTES (Not implemented):
  /dashboard-v2/feed
  /dashboard-v2/traders
  /dashboard-v2/whales
  /dashboard-v2/leaderboard
  /dashboard-v2/settings
```

---

## CRITICAL_BUGS_INDEX

```yaml
BUG_001:
  TITLE: "Master bot copy creates independent instance"
  FILE: lib/userCopies.ts:15-30
  SEVERITY: CRITICAL
  STATUS: BROKEN

BUG_002:
  TITLE: "Real-time updates not working on master bot page"
  FILE: app/dashboard-v2/bots/[slug]/page.tsx:500-600
  SEVERITY: CRITICAL
  STATUS: ACTIVE

BUG_003:
  TITLE: "Win rate control lost after refactoring"
  FILE: lib/trading/TradingBot.ts:closePosition
  SEVERITY: CRITICAL
  STATUS: REGRESSION

BUG_004:
  TITLE: "Bot settings don't apply"
  FILE: app/dashboard-v2/admin/bots/page.tsx
  SEVERITY: HIGH
  STATUS: NO_PERSISTENCE

BUG_005:
  TITLE: "Position sizing incorrect"
  FILE: app/dashboard-v2/bots/[slug]/page.tsx:677-683
  SEVERITY: MEDIUM
  STATUS: LOGIC_ERROR

BUG_006:
  TITLE: "Recent trades not limited to 3"
  FILE: app/dashboard-v2/page.tsx
  SEVERITY: LOW
  STATUS: MISSING_SLICE
```

---

## DEPENDENCY_GRAPH

```mermaid
TradingBot
  ├─ depends on → BotConfig (types)
  ├─ depends on → DailyTargetController
  └─ used by → BotManager

BotManager
  ├─ manages → TradingBot[]
  ├─ depends on → localStorage
  └─ used by → botsApi

botsApi
  ├─ depends on → BotManager
  ├─ depends on → demoMarketplace
  ├─ depends on → userCopies
  └─ used by → React components

PriceService
  ├─ provides → price updates
  └─ consumed by → BotManager.tick()

React Components
  ├─ depend on → botsApi
  ├─ depend on → useBinancePrices hook
  └─ render → UI based on bot state
```

---

## SLIPPAGE_MECHANISM

### Core Logic
```typescript
LOCATION: lib/trading/TradingBot.ts:100-150 (closePosition method)
PURPOSE: Control trade outcomes via exit price manipulation

ALGORITHM:
1. Calculate actual P&L based on real market price
2. Determine if position should win (based on shouldWin flag)
3. If outcome doesn't match desired:
   - Apply slippage (0.05% - 0.15%)
   - Adjust exit price to force desired outcome
4. Record slippage in trade history

DETECTION_RISK: Very low
REASON:
  - Uses real market prices
  - Slippage within normal range
  - Applied at exit only
  - Looks like normal market execution

CURRENT_STATUS: BROKEN (lost after refactoring)
TODO: Re-implement in closePosition() method
```

---

## BUILD_COMMANDS

```bash
# Development
npm run dev                 # Start dev server (port 3001)

# Production
npm run build              # Next.js build
npm run start              # Start production server

# Type checking
npx tsc --noEmit           # TypeScript validation
```

---

## ENV_VARS

```bash
# None currently used
# Future API integration will need:
# NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_WS_URL
```

---

## KEY_ALGORITHMS

### Daily Target Controller
```
LOCATION: lib/trading/DailyTargetController.ts
PURPOSE: Ensure bot reaches daily profit target

LOGIC:
1. Track daily P&L
2. If target not reached by 80% of day:
   - Force winning trades
   - Increase position sizes
3. If target exceeded:
   - Reduce trading frequency
   - Close positions early

STATUS: Implemented but needs tuning
```

### Position Opening Logic
```
LOCATION: lib/trading/TradingBot.ts:tryOpenNewPosition

STEPS:
1. Check if max concurrent positions reached
2. Check open frequency (random chance)
3. Check daily target status
4. Select random trading pair
5. Determine position side (LONG/SHORT)
6. Calculate position size based on personality
7. Determine if should win (based on winRate)
8. Calculate target P&L and stop loss
9. Create position and record

PERSONALITY_FACTORS:
- Aggression: Affects position size (0.7x to 1.3x)
- Patience: Affects hold time (0.7x to 1.3x)
- Risk tolerance: Affects SL distance
```

---

## TESTING_STATUS

```yaml
UNIT_TESTS: 0
INTEGRATION_TESTS: 0
E2E_TESTS: 0
MANUAL_TESTING: YES
TEST_FRAMEWORK: None configured

RECOMMENDATION: Add Vitest for unit tests
```

---

## PERFORMANCE_METRICS

```yaml
BUILD_TIME: ~10-15 seconds
BUNDLE_SIZE: Not optimized
LIGHTHOUSE_SCORE: Not measured
REAL_TIME_UPDATES: 1 FPS (1000ms interval)
MEMORY_USAGE: Not profiled

OPTIMIZATION_TODO:
  - Implement React.memo for heavy components
  - Virtualize long trade lists
  - Debounce real-time updates
  - Code splitting for admin pages
```

---

## QUICK_SEARCH_INDEX

### Find specific functionality:
```
WIN_RATE_CONTROL: lib/trading/TradingBot.ts:100-150
POSITION_CLOSE: lib/trading/TradingBot.ts:closePosition
COPY_BOT_LOGIC: lib/userCopies.ts:createUserCopy
MASTER_BOT_DATA: lib/demoMarketplace.ts:DEMO_BOTS
PRICE_UPDATES: lib/PriceService.ts:subscribe
BOT_STATS_CALC: lib/userCopyStats.ts:getUserCopyStats
ADMIN_CONFIG: app/dashboard-v2/admin/bots/page.tsx
TRADE_HISTORY: component LiveOpenPositions / ClosedTradesActivity
```

### Find UI components:
```
COPY_MODAL: components/dashboard-v2/CopyBotModal.tsx
POSITION_LIST: components/dashboard-v2/LiveOpenPositions.tsx
TRADE_HISTORY: components/dashboard-v2/ClosedTradesActivity.tsx
BOT_CARD: components/dashboard-v2/BotCarousel.tsx
```

---

## ARCHITECTURE_DECISIONS

### Why Client-Side Trading Engine?
```
REASON: Demo/prototype phase
BENEFIT: Fast iteration, no backend needed
DRAWBACK: No persistence, no multi-user sync
FUTURE: Move to backend websocket + database
```

### Why No State Management Library?
```
REASON: Early stage, simple state
DRAWBACK: Difficult to sync across components
TODO: Add Zustand when complexity increases
```

### Why localStorage for Persistence?
```
REASON: Quick solution for demo
DRAWBACK: Data lost across devices, limited size
TODO: Migrate to backend database
```

---

## MIGRATION_PLAN

### Phase 1: Stabilize Frontend
```
1. Fix real-time updates
2. Fix copy mechanism
3. Restore WR control
4. Remove broken buttons
5. Add proper error handling
```

### Phase 2: Backend Integration
```
1. Design REST API spec
2. Implement Express/NestJS backend
3. Add PostgreSQL database
4. Migrate bot logic to backend
5. WebSocket for real-time updates
6. Replace localStorage with API calls
```

### Phase 3: Production Ready
```
1. Add authentication (JWT)
2. User management system
3. Payment integration
4. KYC/AML compliance
5. Admin dashboard for monitoring
6. Analytics and reporting
```

---

## CODE_STYLE

```typescript
// Naming conventions
FILE_NAMES: PascalCase for components, camelCase for utils
VARIABLES: camelCase
CONSTANTS: UPPER_SNAKE_CASE
INTERFACES: PascalCase
TYPES: PascalCase

// TypeScript usage
STRICT_MODE: Enabled
ANY_USAGE: Minimal (mostly in chart configs)
NULL_CHECKS: Inconsistent (needs improvement)
```

---

## CONTACT_POINTS

### Critical Files to Review
```
1. lib/trading/TradingBot.ts        # Core trading logic
2. lib/BotManager.ts                # Bot instance management
3. lib/api/botsApi.ts               # API abstraction
4. lib/userCopies.ts                # Copy mechanism
5. app/dashboard-v2/bots/[slug]/page.tsx  # Master bot UI
6. KNOWN_BUGS.md                    # Full bug list
```

### Start Here for Different Tasks
```
FIXING_BUGS: Read KNOWN_BUGS.md first
ADDING_FEATURES: Check lib/trading/types.ts for data models
UI_CHANGES: Look in components/dashboard-v2/
API_INTEGRATION: Start with lib/api/botsApi.ts
UNDERSTANDING_FLOW: Follow tick() method in BotManager
```

---

## AI_ASSISTANT_NOTES

```yaml
CONTEXT_WINDOW_PRIORITY:
  HIGH:
    - lib/trading/TradingBot.ts
    - lib/BotManager.ts
    - lib/api/botsApi.ts
    - KNOWN_BUGS.md
  MEDIUM:
    - app/dashboard-v2/bots/[slug]/page.tsx
    - components/dashboard-v2/CopyBotModal.tsx
  LOW:
    - Placeholder pages (feed, whales, etc)

COMMON_TASKS:
  FIX_REALTIME_UPDATES: "Check useEffect dependencies in bots/[slug]/page.tsx"
  FIX_COPY_MECHANISM: "Refactor createUserCopy to reference master bot instead of creating new instance"
  RESTORE_WR_CONTROL: "Re-implement slippage logic in TradingBot.closePosition()"
  ADD_PERSISTENCE: "Replace localStorage with API calls in botsApi.ts"

CODEBASE_HEALTH:
  ARCHITECTURE: 6/10 (needs refactoring)
  CODE_QUALITY: 7/10 (decent but rushed)
  DOCUMENTATION: 4/10 (minimal inline docs)
  TESTING: 0/10 (no tests)
  COMPLETION: 3/10 (~30% done)
```

---

**END_OF_DOCUMENTATION**

---

## QUICK_REFERENCE_COMMANDS

```bash
# Find all TODOs
grep -r "TODO" --include="*.ts" --include="*.tsx" .

# Find all FIXMEs
grep -r "FIXME" --include="*.ts" --include="*.tsx" .

# Count lines of code
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Find unused exports
npx ts-prune

# Check for type errors
npx tsc --noEmit

# Bundle analysis
npm run build && npx @next/bundle-analyzer
```
