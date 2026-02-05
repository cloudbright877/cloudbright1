# Backend-Ready Architecture Refactor Plan v2.0

**Status:** READY FOR EXECUTION
**Version:** 2.0.0
**Updated:** 2026-02-05 (After ULTRATHINK analysis)
**Est. Time:** 35-45 hours (split over 5-6 sessions)

---

## 🔍 CHANGELOG FROM V1.0

### Critical Issues Found & Fixed:
1. ✅ **Name Conflict:** `lib/storage.ts` exists → renamed plan to `storageAdapter.ts`
2. ✅ **Missing Components:** DailyTargetController, PriceService, BotManager lifecycle
3. ✅ **No Migration Strategy:** Added Phase 0 for data migration
4. ✅ **Trading Engine Lifecycle:** Added TradingEngineService
5. ✅ **TradingBot Refactor:** Added Phase 1.5 for TradingBot updates
6. ✅ **Feature Flags:** Added Phase -1 for safe rollback
7. ✅ **Real-time Strategy:** Added Phase 4.5 for backend communication
8. ✅ **Circular Dependencies:** Documented and solutions provided
9. ✅ **Testing Strategy:** Expanded Phase 6 with mocking
10. ✅ **Cleanup Phase:** Added Phase 7 for production readiness

---

## 🎯 OBJECTIVE

Transform current client-side architecture into production-ready backend structure.

**Current Problems:**
- Logic scattered across 18+ files in lib/
- Multiple persistence layers (lib/storage.ts, BotManager, userCopies, masterBotsConfig)
- Master Bot instances created lazily (causes bugs)
- No separation of concerns
- localStorage direct access everywhere
- No lifecycle management
- Not backend-ready
- Hard to scale and maintain
- No rollback strategy

**Goals:**
- ✅ Single Source of Truth
- ✅ Clear separation: Data → Services → API → UI
- ✅ Easy to migrate to backend (Express/FastAPI)
- ✅ Testable architecture
- ✅ No breaking changes to existing functionality
- ✅ Safe rollback with feature flags
- ✅ Production-ready code quality

---

## 📁 CURRENT CODEBASE AUDIT

### Existing Files in lib/ (18 files)

```
lib/
├── api/
│   ├── botsApi.ts                    ← Main API (to be wrapped)
│   └── marketplace.ts                ← Mock marketplace API
│
├── trading/
│   ├── TradingBot.ts                 ← Core bot logic (needs refactor)
│   ├── DailyTargetController.ts      ← Daily P&L tracking (has persistence)
│   ├── PriceAdjustmentEngine.ts      ← Price manipulation (keep as-is)
│   ├── SlowGrowthStrategy.ts         ← Strategy profile (keep as-is)
│   ├── BotConfig.ts                  ← Config utilities (keep as-is)
│   └── types.ts                      ← Type definitions (keep as-is)
│
├── mock/
│   └── marketplace-data.ts           ← Mock data (audit usage)
│
├── BotManager.ts                      ← Bot instance manager (needs lifecycle)
├── PriceService.ts                    ← WebSocket to Binance (needs service)
├── demoMarketplace.ts                 ← DEMO_BOTS definitions (keep as-is)
├── masterBotsConfig.ts                ← Admin overrides (→ Repository)
├── userCopies.ts                      ← User copy records (→ Repository)
├── userCopyStats.ts                   ← Stats calculation (→ Service)
├── storage.ts                         ← localStorage utils (integrate)
├── seedBots.ts                        ← Seeding utility (audit usage)
└── presets.ts                         ← Preset configs (audit usage)
```

### localStorage Keys Currently Used

```typescript
// Bot Manager
'trading-bots'                    // BotManager bot list

// Bot Data (per bot)
'bot_stats_{botId}'               // BotStats
'bot_positions_{botId}'           // Position[]
'bot_trades_{botId}'              // Trade[]
'bot_closed_{botId}'              // Closed position IDs
'bot_personality_{botId}'         // Bot personality
'bot_daily_{botId}'               // DailyTargetController state

// User Data
'user_copies'                     // UserCopy[]
'master_bots_config'              // Map<botId, configOverrides>
```

---

## 📋 UPDATED EXECUTION PHASES

### PHASE -1: Preparation & Safety 🛡️ ⏱️ 2-3 hours

**Goal:** Set up infrastructure for safe refactoring with rollback capability

#### -1.1 Create Feature Flags

**File:** `lib/config/featureFlags.ts`

```typescript
/**
 * Feature Flags for Architecture Refactor
 *
 * Toggle new/old code paths during migration
 */
export const FEATURE_FLAGS = {
  // Master switch (disable all new features)
  USE_NEW_ARCHITECTURE: false,

  // Data Layer
  USE_REPOSITORIES: false,           // Use new Repositories instead of direct localStorage
  USE_STORAGE_ADAPTER: false,        // Use storageAdapter.ts instead of storage.ts

  // Service Layer
  USE_SERVICE_LAYER: false,          // Use Services instead of direct Repository calls
  USE_TRADING_ENGINE_SERVICE: false, // Use TradingEngineService for lifecycle

  // API Layer
  USE_NEW_API_CLIENT: false,         // Use lib/api/index.ts instead of botsApi.ts
  USE_HTTP_MODE: false,              // Use fetch() instead of direct service calls

  // Development
  DEBUG_MODE: false,                 // Extra logging
  DRY_RUN: false,                    // Don't persist to storage (testing)
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // If master switch is off, all features are disabled
  if (!FEATURE_FLAGS.USE_NEW_ARCHITECTURE && flag !== 'USE_NEW_ARCHITECTURE') {
    return false;
  }

  return FEATURE_FLAGS[flag];
}

/**
 * Enable feature (for testing)
 */
export function enableFeature(flag: FeatureFlag): void {
  if (typeof window === 'undefined') return;

  const flags = { ...FEATURE_FLAGS, [flag]: true };
  localStorage.setItem('feature_flags_override', JSON.stringify(flags));
  console.log(`[FeatureFlags] ✅ Enabled: ${flag}`);
}

/**
 * Disable feature
 */
export function disableFeature(flag: FeatureFlag): void {
  if (typeof window === 'undefined') return;

  const flags = { ...FEATURE_FLAGS, [flag]: false };
  localStorage.setItem('feature_flags_override', JSON.stringify(flags));
  console.log(`[FeatureFlags] ❌ Disabled: ${flag}`);
}

/**
 * Load feature flag overrides from localStorage (for testing)
 */
export function loadFeatureFlagOverrides(): void {
  if (typeof window === 'undefined') return;

  const data = localStorage.getItem('feature_flags_override');
  if (!data) return;

  try {
    const overrides = JSON.parse(data);
    Object.assign(FEATURE_FLAGS, overrides);
    console.log('[FeatureFlags] Loaded overrides from localStorage');
  } catch (error) {
    console.error('[FeatureFlags] Error loading overrides:', error);
  }
}

// Auto-load on import
loadFeatureFlagOverrides();
```

**Checklist:**
- [ ] Create `lib/config/` directory
- [ ] Implement feature flags system
- [ ] Add localStorage persistence for overrides
- [ ] Test enable/disable functionality
- [ ] Document usage in README

---

#### -1.2 Create Dependency Graph

**File:** `docs/DEPENDENCY_GRAPH.md`

```markdown
# Codebase Dependency Graph

## Import Analysis

### lib/trading/TradingBot.ts
**Imports:**
- `./types` (BotConfig, Position, Trade, BotStats)
- `./DailyTargetController`
- `../storage` (saveBotStats, loadBotPositions, saveBotTrades)

**Exported:**
- `TradingBot` class

**Used By:**
- `lib/BotManager.ts`

---

### lib/BotManager.ts
**Imports:**
- `./trading/TradingBot`
- `./trading/types` (BotConfig, BotStats)

**Exported:**
- `BotManager` class
- `botManager` singleton

**Used By:**
- `lib/api/botsApi.ts`
- `lib/userCopyStats.ts`

---

### lib/PriceService.ts
**Imports:** (none - WebSocket only)

**Exported:**
- `PriceService` class
- `priceService` singleton

**Used By:**
- `lib/api/botsApi.ts` (initialization)
- `hooks/useBinancePrices.ts`

---

[Continue for all 18 files...]
```

**Checklist:**
- [ ] Analyze all imports in lib/
- [ ] Create dependency graph document
- [ ] Identify circular dependencies
- [ ] Plan refactoring order

---

#### -1.3 Current State Snapshot

**File:** `docs/CURRENT_STATE_SNAPSHOT.md`

```markdown
# Current State Snapshot (Before Refactor)

**Date:** 2026-02-05
**Commit:** [current git hash]

## Functionality Checklist

### ✅ Working Features
- [ ] Master Bot marketplace display
- [ ] Master Bot detail page
- [ ] Copy bot functionality
- [ ] User copies dashboard
- [ ] Admin bot configuration
- [ ] Real-time price updates
- [ ] Trading simulation
- [ ] Daily P&L tracking
- [ ] Win rate control
- [ ] Position management
- [ ] localStorage persistence

### 📊 Performance Metrics
- localStorage usage: [X] KB
- Number of bots: [X]
- Number of user copies: [X]
- Average page load: [X] ms

### 🐛 Known Issues
1. Admin panel error: "Cannot update config: Bot not found"
2. Master Bot instances created on every page load
3. [Add others from KNOWN_BUGS.md]

## localStorage Data Backup

```json
{
  "trading-bots": [...],
  "user_copies": [...],
  "master_bots_config": {...}
}
```
[Export using lib/storage.ts:exportAllBotData()]
```

**Checklist:**
- [ ] Test all features manually
- [ ] Document current behavior
- [ ] Export localStorage data
- [ ] Create git tag for rollback
- [ ] Take screenshots of UI

---

### PHASE 0: Data Migration 🔄 ⏱️ 3-4 hours

**Goal:** Safely migrate existing localStorage data to new schema

#### 0.1 Create Migration Script

**File:** `lib/migrations/migrateToV2.ts`

```typescript
import { storage } from '../storage'; // Old utilities
import { masterBotRepository } from '../data/MasterBotRepository';
import { userCopyRepository } from '../data/UserCopyRepository';
import { tradingDataRepository } from '../data/TradingDataRepository';

export interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  backupPath: string;
}

/**
 * Migrate localStorage data to new repository structure
 */
export async function migrateToV2Schema(): Promise<MigrationResult> {
  console.log('[Migration] Starting migration to v2 schema...');

  const result: MigrationResult = {
    success: false,
    migratedKeys: [],
    errors: [],
    backupPath: '',
  };

  try {
    // Step 1: Create backup
    result.backupPath = await createBackup();
    console.log(`[Migration] ✅ Backup created: ${result.backupPath}`);

    // Step 2: Migrate master_bots_config → MasterBotRepository
    const configMigrated = await migrateMasterBotsConfig();
    if (configMigrated) {
      result.migratedKeys.push('master_bots_config');
    }

    // Step 3: Migrate user_copies → UserCopyRepository
    const copiesMigrated = await migrateUserCopies();
    if (copiesMigrated) {
      result.migratedKeys.push('user_copies');
    }

    // Step 4: Migrate bot_* keys → TradingDataRepository
    const botKeysMigrated = await migrateBotKeys();
    result.migratedKeys.push(...botKeysMigrated);

    // Step 5: Verify integrity
    const isValid = await verifyMigration();
    if (!isValid) {
      throw new Error('Migration verification failed');
    }

    result.success = true;
    console.log('[Migration] ✅ Migration completed successfully');
    console.log(`[Migration] Migrated ${result.migratedKeys.length} keys`);

    return result;
  } catch (error) {
    console.error('[Migration] ❌ Migration failed:', error);
    result.errors.push(String(error));

    // Rollback
    await rollbackMigration(result.backupPath);
    return result;
  }
}

/**
 * Create backup of all localStorage data
 */
async function createBackup(): Promise<string> {
  const timestamp = Date.now();
  const data = storage.exportAllBotData();
  const backupKey = `migration_backup_${timestamp}`;

  if (typeof window !== 'undefined') {
    localStorage.setItem(backupKey, data);
  }

  return backupKey;
}

/**
 * Migrate master_bots_config to MasterBotRepository
 */
async function migrateMasterBotsConfig(): Promise<boolean> {
  const data = localStorage.getItem('master_bots_config');
  if (!data) return false;

  try {
    const configMap = JSON.parse(data);

    // MasterBotRepository handles this now
    // Just verify it's accessible
    Object.entries(configMap).forEach(([botId, config]) => {
      console.log(`[Migration] Migrated config for ${botId}`);
    });

    return true;
  } catch (error) {
    console.error('[Migration] Error migrating master_bots_config:', error);
    return false;
  }
}

/**
 * Migrate user_copies to UserCopyRepository
 */
async function migrateUserCopies(): Promise<boolean> {
  const data = localStorage.getItem('user_copies');
  if (!data) return false;

  try {
    const copies = JSON.parse(data);

    // UserCopyRepository uses same key, no migration needed
    // Just validate structure
    console.log(`[Migration] Validated ${copies.length} user copies`);
    return true;
  } catch (error) {
    console.error('[Migration] Error migrating user_copies:', error);
    return false;
  }
}

/**
 * Migrate bot_* keys to TradingDataRepository
 */
async function migrateBotKeys(): Promise<string[]> {
  const keys = Object.keys(localStorage).filter(key => key.startsWith('bot_'));
  const migrated: string[] = [];

  for (const key of keys) {
    try {
      const data = localStorage.getItem(key);
      if (!data) continue;

      // TradingDataRepository uses same keys
      // Just validate structure
      JSON.parse(data);
      migrated.push(key);
    } catch (error) {
      console.error(`[Migration] Error migrating ${key}:`, error);
    }
  }

  console.log(`[Migration] Validated ${migrated.length} bot keys`);
  return migrated;
}

/**
 * Verify migration integrity
 */
async function verifyMigration(): Promise<boolean> {
  try {
    // Check that repositories can read data
    const bots = await masterBotRepository.findAll();
    const copies = userCopyRepository.findAll();

    console.log(`[Migration] Verification: ${bots.length} bots, ${copies.length} copies`);
    return true;
  } catch (error) {
    console.error('[Migration] Verification failed:', error);
    return false;
  }
}

/**
 * Rollback migration using backup
 */
async function rollbackMigration(backupKey: string): Promise<void> {
  console.log('[Migration] Rolling back...');

  try {
    const backup = localStorage.getItem(backupKey);
    if (!backup) {
      throw new Error('Backup not found');
    }

    storage.importBotData(backup);
    console.log('[Migration] ✅ Rollback completed');
  } catch (error) {
    console.error('[Migration] ❌ Rollback failed:', error);
  }
}

/**
 * Clean up old migration backups (keep last 3)
 */
export function cleanupMigrationBackups(): void {
  const backupKeys = Object.keys(localStorage)
    .filter(key => key.startsWith('migration_backup_'))
    .sort()
    .reverse();

  // Keep last 3, delete rest
  backupKeys.slice(3).forEach(key => {
    localStorage.removeItem(key);
    console.log(`[Migration] Cleaned up backup: ${key}`);
  });
}
```

**Checklist:**
- [ ] Create `lib/migrations/` directory
- [ ] Implement migration script
- [ ] Implement backup/restore
- [ ] Test on development data
- [ ] Test rollback functionality
- [ ] Document migration process

---

#### 0.2 Migration Command

**File:** `lib/migrations/index.ts`

```typescript
import { migrateToV2Schema, cleanupMigrationBackups } from './migrateToV2';

/**
 * Run migration from browser console
 */
(window as any).runMigration = async () => {
  console.log('🚀 Starting migration...');
  const result = await migrateToV2Schema();

  if (result.success) {
    console.log('✅ Migration completed successfully!');
    console.log(`📦 Backup: ${result.backupPath}`);
    console.log(`📊 Migrated ${result.migratedKeys.length} keys`);
  } else {
    console.error('❌ Migration failed!');
    console.error('Errors:', result.errors);
  }

  return result;
};

(window as any).cleanupBackups = cleanupMigrationBackups;

console.log('💡 Migration tools available:');
console.log('  - runMigration(): Migrate to v2 schema');
console.log('  - cleanupBackups(): Clean old backups');
```

**Usage:**
```javascript
// In browser console:
await runMigration()
```

**Checklist:**
- [ ] Expose migration functions to window
- [ ] Test in browser console
- [ ] Document in README

---

### PHASE 1: Data Layer (Repositories) ⏱️ 5-7 hours

**Goal:** Abstract data storage, prepare for DB migration

#### 1.1 Create Storage Adapter

**File:** `lib/data/storageAdapter.ts` ⚠️ (Renamed to avoid conflict)

```typescript
/**
 * Storage Adapter - Abstracts localStorage (future: PostgreSQL)
 *
 * ⚠️ NOTE: This is different from lib/storage.ts (old utilities)
 *     lib/storage.ts = specialized bot data utilities
 *     lib/data/storageAdapter.ts = generic storage interface
 */
export interface IStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

class LocalStorageAdapter implements IStorage {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[StorageAdapter] Error reading key "${key}":`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageAdapter] Error writing key "${key}":`, error);

      // Check if quota exceeded
      if (error instanceof DOMException && error.code === 22) {
        console.error('[StorageAdapter] localStorage quota exceeded!');
        // TODO: Implement cleanup or migration to backend
      }
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }

  has(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) !== null;
  }
}

// Singleton instance
export const storageAdapter: IStorage = new LocalStorageAdapter();

// Future: PostgreSQL adapter
/*
class PostgresAdapter implements IStorage {
  constructor(private pool: pg.Pool) {}

  async get<T>(key: string): Promise<T | null> {
    const result = await this.pool.query(
      'SELECT value FROM key_value_store WHERE key = $1',
      [key]
    );
    return result.rows[0]?.value || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.pool.query(
      'INSERT INTO key_value_store (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, JSON.stringify(value)]
    );
  }

  // ... other methods
}

export const storageAdapter: IStorage = new PostgresAdapter(pool);
*/
```

**Checklist:**
- [ ] Create `lib/data/` directory
- [ ] Implement `IStorage` interface
- [ ] Implement `LocalStorageAdapter`
- [ ] Add error handling for quota exceeded
- [ ] Add `has()` method
- [ ] Export singleton instance
- [ ] Write unit tests

---

#### 1.2 Create TradingDataRepository

**File:** `lib/data/TradingDataRepository.ts`

```typescript
import { storageAdapter } from './storageAdapter';
import type { Position, Trade, BotStats } from '../trading/types';

/**
 * Repository for trading data (positions, trades, stats)
 *
 * Integrates with existing lib/storage.ts utilities
 */
export class TradingDataRepository {
  /**
   * Get bot positions
   */
  getPositions(botId: string): Position[] {
    return storageAdapter.get<Position[]>(`bot_positions_${botId}`) || [];
  }

  /**
   * Save bot positions
   */
  savePositions(botId: string, positions: Position[]): void {
    storageAdapter.set(`bot_positions_${botId}`, positions);
  }

  /**
   * Get bot trades
   */
  getTrades(botId: string): Trade[] {
    return storageAdapter.get<Trade[]>(`bot_trades_${botId}`) || [];
  }

  /**
   * Save bot trades
   */
  saveTrades(botId: string, trades: Trade[]): void {
    storageAdapter.set(`bot_trades_${botId}`, trades);
  }

  /**
   * Get bot stats (cached)
   */
  getStats(botId: string): BotStats | null {
    return storageAdapter.get<BotStats>(`bot_stats_${botId}`);
  }

  /**
   * Save bot stats (cache)
   */
  saveStats(botId: string, stats: BotStats): void {
    storageAdapter.set(`bot_stats_${botId}`, stats);
  }

  /**
   * Get DailyTargetController state
   * ⚠️ NEW: Added to support DailyTargetController persistence
   */
  getDailyState(botId: string): any | null {
    return storageAdapter.get(`bot_daily_${botId}`);
  }

  /**
   * Save DailyTargetController state
   * ⚠️ NEW: Added to support DailyTargetController persistence
   */
  saveDailyState(botId: string, state: any): void {
    storageAdapter.set(`bot_daily_${botId}`, state);
  }

  /**
   * Get closed position IDs
   */
  getClosedPositionIds(botId: string): string[] {
    return storageAdapter.get<string[]>(`bot_closed_${botId}`) || [];
  }

  /**
   * Save closed position IDs
   */
  saveClosedPositionIds(botId: string, ids: string[]): void {
    storageAdapter.set(`bot_closed_${botId}`, ids);
  }

  /**
   * Get bot personality
   */
  getPersonality(botId: string): any | null {
    return storageAdapter.get(`bot_personality_${botId}`);
  }

  /**
   * Save bot personality
   */
  savePersonality(botId: string, personality: any): void {
    storageAdapter.set(`bot_personality_${botId}`, personality);
  }

  /**
   * Clear all trading data for bot
   */
  clearBotData(botId: string): void {
    storageAdapter.delete(`bot_positions_${botId}`);
    storageAdapter.delete(`bot_trades_${botId}`);
    storageAdapter.delete(`bot_stats_${botId}`);
    storageAdapter.delete(`bot_closed_${botId}`);
    storageAdapter.delete(`bot_personality_${botId}`);
    storageAdapter.delete(`bot_daily_${botId}`);

    console.log(`[TradingDataRepository] Cleared all data for bot ${botId}`);
  }

  /**
   * Check if bot has any data
   */
  hasBotData(botId: string): boolean {
    return storageAdapter.has(`bot_stats_${botId}`) ||
           storageAdapter.has(`bot_positions_${botId}`) ||
           storageAdapter.has(`bot_trades_${botId}`);
  }
}

// Singleton instance
export const tradingDataRepository = new TradingDataRepository();
```

**Checklist:**
- [ ] Create `TradingDataRepository` class
- [ ] Implement getters/setters for all bot data types
- [ ] Add `getDailyState()` / `saveDailyState()` for DailyTargetController
- [ ] Add `clearBotData()` and `hasBotData()`
- [ ] Export singleton
- [ ] Write unit tests with mocked storageAdapter

---

[Continuing in next response due to length...]

**Total Plan Length:** ~2500+ lines
**Est. completion:** 2-3 hours to write full document

Продолжить создание полного плана?
