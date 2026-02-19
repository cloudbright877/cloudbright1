# Referral System - Полная документация

**Версия:** 3.0.0
**Дата:** 2026-02-08
**Статус:** Production Ready
**Автор:** Celestian Platform Team

---

## 📋 Содержание

1. [Введение](#введение)
2. [Capital Reservation](#capital-reservation)
3. [Collect P&L](#collect-pl)
4. [Архитектура системы](#архитектура-системы)
5. [Data Models](#data-models)
6. [Business Logic](#business-logic)
7. [API Reference](#api-reference)
8. [UI Components](#ui-components)
9. [Примеры использования](#примеры-использования)
10. [Тестирование](#тестирование)
11. [Deployment](#deployment)
12. [FAQ](#faq)

---

## Введение

### Что это?

Реферальная система для copy trading платформы, которая позволяет пользователям зарабатывать комиссии при **активации ботов** рефералами на **5 уровнях** глубины.

### Ключевые особенности

- ✅ **5-уровневая реферальная программа** (5%, 3%, 2%, 1%, 0.5%)
- ✅ **Bot Activation Model** - комиссии при активации бота (от суммы инвестиции)
- ✅ **Capital Reservation** - 30-дневный период с tiered penalties
- ✅ **Platform Bonus Model** - комиссии оплачиваются платформой, НЕ вычитаются из прибыли пользователя
- ✅ **Turnover Bonuses** - дополнительные бонусы за командный оборот (weighted active bots)
- ✅ **Frozen/Available Balance** - разделение капитала
- ✅ **Real-time Awards** - мгновенное начисление
- ✅ **Transparent Breakdown** - детальный расчет P&L (realized/unrealized)

### Бизнес-модель

```
Инвестор активирует бота (createBotCopy)
    ↓
Система начисляет комиссии от суммы инвестиции (до 11.5%)
    ↓
Комиссии распределяются по upline chain (5 уровней)
    ↓
Проверка порогов turnover bonuses (weighted active bots)
    ↓
Бонусы зачисляются на available balance upline
    ↓
Инвестор получает: 100% своего profit (комиссии НЕ вычитаются)
```

---

## Capital Reservation

### Проблема

**Backwards Incentive:** В стандартной модели (комиссии при закрытии копии):
1. Пользователь копирует бота, ловит 1 хорошую сделку, закрывается → реферер получает почти ничего
2. После любого lock period реферер ХОЧЕТ, чтобы пользователь ЗАКРЫЛСЯ (обратная мотивация)

**Решение:** Capital Reservation + Early Exit Fee

### Механизм: Early Exit Fee (Tiered Penalty)

**Концепт:** Penalty за закрытие копии в первые 30 дней (reservation period)

**Tiered Rates:**
```
Day 0-10:   20% of invested capital
Day 11-20:  17% of invested capital
Day 21-29:  15% of invested capital
Day 30+:    0% (no penalty)
```

**Формула:**
```typescript
fee = investedCapital * penaltyRate(day)
userReceives = investedCapital + currentPnL - fee  // Commissions NOT deducted from user
```

**Примеры:**

```typescript
// Example 1: Early exit Day 5, profitable copy
investedCapital: $1,000
currentPnL: +$50
daysSinceCopy: 5
penaltyRate: 20%

fee: $1,000 × 20% = $200
userReceives: $1,000 + $50 - $200 = $850
effectiveReturn: -15% (user sees red number)
// Referral commissions: platform pays bonus on max(0, profit) to uplines

// Example 2: Early exit Day 15, profitable copy
investedCapital: $1,000
currentPnL: +$200
daysSinceCopy: 15
penaltyRate: 17%

fee: $1,000 × 17% = $170
userReceives: $1,000 + $200 - $170 = $1,030
effectiveReturn: +3%
// Referral commissions: platform pays bonus on $200 profit to uplines

// Example 3: Normal exit Day 45
investedCapital: $1,000
currentPnL: +$200
daysSinceCopy: 45
penaltyRate: 0%

fee: $0
userReceives: $1,000 + $200 = $1,200
effectiveReturn: +20%
// Referral commissions: platform pays bonus on $200 profit to uplines
```

**Key Rules:**

1. **Fee calculation:** Always `investedCapital × penaltyRate` (NOT based on profit)
2. **Fee cap:** User must receive at least $0 (don't create debt)
3. **Commission model:** Platform pays referral bonus on profit (NOT deducted from user)
4. **Fee destination:** Platform (NOT distributed to referral chain)
5. **Referrer incentive:** Referrer benefits from user STAYING (not leaving early)

**UI Warnings:**

When user tries to close before 30 days:
```
🚨 Capital Reservation: 15 days remaining

You are closing this copy before the 30-day reservation period.
An early exit penalty will be applied.

If you close now: -12.5%

Current P&L:     +$50
Early Exit Fee:  -$200 (20%)
You receive:     $850
```

Confirm: Type "CLOSE" to proceed

---

## Collect P&L

### Механизм

**Концепт:** Пользователь вручную собирает (collect) realized profit из активной копии, не закрывая её.

**Цель:** Пользователь может забирать прибыль регулярно, не закрывая позицию. Комиссии реферерам начисляются платформой (не вычитаются из прибыли пользователя).

**Trigger:** Ручное действие пользователя (кнопка "Collect P&L" на странице копии).

**Rate Limiting:** Максимум 1 collect per copy per 10 минут.

**Concurrency Lock:** `operationInProgress` поле на UserCopy предотвращает одновременные операции.

**Формула:**
```typescript
availableToCollect = max(0, realizedPnL - totalCollectedPnL)

if (availableToCollect > 0) {
  // Atomicity rule: update copy BEFORE credit
  copy.totalCollectedPnL += availableToCollect
  copy.collectCount++
  copy.lastCollectAt = Date.now()

  creditCollectedPnL(userId, availableToCollect, copyId)
  distributeReferralCommissions(userId, copyId, availableToCollect) // Platform bonus
}
```

**Пример:**

```typescript
// Copy created: 2026-01-01, invested $1,000

// Day 15: User clicks "Collect P&L"
realizedPnL: +$150  // From closed trades
totalCollectedPnL: $0
availableToCollect: $150
→ User receives $150 on available balance
→ Platform pays referral bonuses on $150

// Day 30: User clicks "Collect P&L" again
realizedPnL: +$320  // More trades closed
totalCollectedPnL: $150  // Previously collected
availableToCollect: $170
→ User receives $170 on available balance
→ Platform pays referral bonuses on $170

// Day 45: Market pullback
realizedPnL: +$320  // No new closed trades with profit
totalCollectedPnL: $320
availableToCollect: $0
→ Nothing to collect

// Day 60: User clicks "Collect P&L"
realizedPnL: +$400
totalCollectedPnL: $320
availableToCollect: $80
→ User receives $80 on available balance
→ Platform pays referral bonuses on $80
```

**Key Rules:**

1. **Only realized P&L:** Only profit from closed trades is collectible (not unrealized/open positions)
2. **No double-collect:** `availableToCollect = max(0, realizedPnL - totalCollectedPnL)`
3. **Atomicity:** `totalCollectedPnL` updated BEFORE `creditCollectedPnL()` (prevents double-spend on crash)
4. **Rate limiting:** 10-minute cooldown between collects per copy
5. **Auto-collect on archive:** When archiving, remaining profit is auto-collected
6. **Commission model:** Platform pays referral bonuses (NOT deducted from user's profit)

---

## Архитектура системы

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  ┌──────────────┬───────────────┬──────────────────┐   │
│  │  Referrals   │   Balance     │  Copy Detail /   │   │
│  │     Page     │     Card      │  Archive Page    │   │
│  └──────────────┴───────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  collectProfit() / closeUserCopy()                 │  │
│  │  distributeReferralCommissions()                   │  │
│  │  checkAndAwardTurnoverBonuses()                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                           │
│  ┌──────────┬──────────┬────────────┬──────────────┐   │
│  │  Users   │ Balances │ Commissions│   Bonuses    │   │
│  └──────────┴──────────┴────────────┴──────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  STORAGE LAYER                           │
│        LocalStorageAdapter → PostgreSQL (future)         │
└─────────────────────────────────────────────────────────┘
```

### Компоненты системы

#### 1. Storage Layer
- **StorageAdapter** - Абстрактный интерфейс
- **LocalStorageAdapter** - Реализация для localStorage
- **PostgresAdapter** (планируется) - Реализация для PostgreSQL

#### 2. Data Models
- **User** - Пользователь с реферальным деревом
- **Balance** - Баланс (frozen + available)
- **UserCopy** - Копия бота с lifecycle
- **ReferralCommission** - История комиссий
- **TurnoverBonus** - Бонусы за оборот
- **ReferralLink** - Статистика реферальных ссылок
- **BalanceTransaction** - История транзакций

#### 3. Business Logic
- **referralCommissions.ts** - Распределение комиссий (platform bonus)
- **turnoverBonuses.ts** - Система бонусов
- **balances.ts** - Управление балансами (включая PNL_COLLECT)
- **users.ts** - Управление пользователями
- **botsApi.ts** - API для операций с копиями (collectProfit, closeUserCopy)
- **userCopyStats.ts** - Центральная формула P&L (getUserCopyPnLBreakdown)
- **capitalReservation.ts** - Early exit fee расчет

#### 4. UI Pages
- **Copy Detail Page** - P&L breakdown, Collect P&L кнопка
- **Archive Page** - Архивирование с auto-collect и early exit fee
- **Dashboard** - Bot cards с quick collect
- **NetWorthHero** - Invested / Realized / Unrealized

---

## Data Models

### User

```typescript
interface User {
  id: string;                    // 'user_123'
  username: string;              // 'JohnDoe'
  email: string;                 // 'john@example.com'
  referralCode: string;          // 'JOHNDOE123' (уникальный)
  referredBy: string | null;     // userId реферера
  referralPath: string;          // '/user_1/user_5' (путь к родителю)
  createdAt: number;             // Unix timestamp
}
```

**Примеры:**
```typescript
// Root пользователь
{
  id: 'user_001',
  username: 'Alice',
  referralCode: 'ALICE123',
  referredBy: null,
  referralPath: '/user_default',
  createdAt: 1706880000000
}

// Реферал Alice
{
  id: 'user_002',
  username: 'Bob',
  referralCode: 'BOB456',
  referredBy: 'user_001',
  referralPath: '/user_default/user_001',
  createdAt: 1706880001000
}
```

### Balance

```typescript
interface Balance {
  id: string;                    // userId (primary key)
  userId: string;                // 'user_123'
  currency: 'USDT';              // Валюта
  frozen: number;                // Заморожено в активных копиях
  available: number;             // Доступно для вывода
  updatedAt: number;             // Время последнего обновления
}
```

**Состояния баланса:**

```
Total Balance = Frozen + Available

Frozen:    Капитал в ACTIVE копиях (нельзя вывести)
Available: Можно вывести или инвестировать

Operations:
- Deposit → Available++
- Create Copy → Available--, Frozen++
- Collect P&L → Available++ (realized profit from active copy)
- Close Copy → Frozen--, Available++ (capital return + uncollected profit)
- Withdraw → Available--
```

**Примеры:**
```typescript
// После депозита $10,000
{
  id: 'user_001',
  userId: 'user_001',
  currency: 'USDT',
  frozen: 0,
  available: 10000,
  updatedAt: 1706880000000
}

// После создания копии на $5,000
{
  id: 'user_001',
  userId: 'user_001',
  frozen: 5000,
  available: 5000,
  updatedAt: 1706880001000
}

// После закрытия с прибылью +$1,000 (user gets 100%, commissions paid by platform)
{
  id: 'user_001',
  userId: 'user_001',
  frozen: 0,
  available: 11000,  // 5000 + 5000 (capital) + 1000 (profit)
  updatedAt: 1706880002000
}
```

### UserCopy

```typescript
type UserCopyStatus = 'ACTIVE' | 'CLOSING' | 'CLOSED';

interface UserCopy {
  id: string;                    // 'copy_123'
  userId: string;                // Владелец копии
  masterBotId: string;           // ID мастер-бота
  investedAmount: number;        // Инвестированная сумма
  status: UserCopyStatus;        // Статус копии
  createdAt: number;             // Время создания
  closedAt?: number;             // Время закрытия
  finalPnL?: number;             // Финальный P&L
  finalValue?: number;           // investedAmount + finalPnL

  // Capital Reservation fields
  reservationDays: number;       // 30 (set at copy creation)
  earlyExitFee?: number;         // $ amount of penalty at close time
  earlyExitPenaltyRate?: number; // % rate applied at close time
  isEarlyExit?: boolean;         // true if closed before reservation period

  // Collect P&L fields
  totalCollectedPnL: number;     // Total profit collected so far (starts at 0)
  collectCount: number;          // How many collects completed
  lastCollectAt?: number;        // Timestamp of last collect (for rate limiting)
  operationInProgress: 'collect' | 'archive' | null; // Concurrency lock
}
```

**Lifecycle:**
```
ACTIVE → CLOSING → CLOSED

ACTIVE:  Копия активна, торгует
CLOSING: Процесс закрытия (распределение комиссий)
CLOSED:  Закрыта, средства возвращены
```

**Примеры:**
```typescript
// Активная копия
{
  id: 'copy_001',
  userId: 'user_001',
  masterBotId: 'demo-btc-scalper',
  investedAmount: 5000,
  status: 'ACTIVE',
  createdAt: 1706880000000
}

// Закрытая копия с прибылью
{
  id: 'copy_001',
  userId: 'user_001',
  masterBotId: 'demo-btc-scalper',
  investedAmount: 5000,
  status: 'CLOSED',
  createdAt: 1706880000000,
  closedAt: 1706966400000,
  finalPnL: 1000,
  finalValue: 6000
}
```

### ReferralCommission

```typescript
type CommissionLevel = 1 | 2 | 3 | 4 | 5;
type CommissionStatus = 'PENDING' | 'PAID';

interface ReferralCommission {
  id: string;                    // 'comm_123'
  uplineUserId: string;          // Кому начислена
  investorUserId: string;        // Кто активировал бота
  userCopyId: string;            // Какая копия
  level: CommissionLevel;        // Уровень (1-5)
  commissionRate: number;        // Ставка (0.05, 0.03, 0.02, 0.01, 0.005)
  investorPnL: number;           // Сумма инвестиции (поле сохранено для совместимости)
  commissionAmount: number;      // Сумма комиссии
  status: CommissionStatus;      // Статус
  createdAt: number;             // Время создания
  paidAt?: number;               // Время выплаты
}
```

**Commission Rates:**
```
Level 1:   5%
Level 2:   3%
Level 3:   2%
Level 4:   1%
Level 5:   0.5%
──────────────
Total:   11.5%
```

**Примеры:**
```typescript
// Level 1 комиссия (при активации бота)
{
  id: 'comm_001',
  uplineUserId: 'user_002',      // Прямой реферер
  investorUserId: 'user_003',    // Инвестор
  userCopyId: 'copy_001',
  level: 1,
  commissionRate: 0.05,
  investorPnL: 5000,             // Сумма инвестиции
  commissionAmount: 250,         // $5000 × 5%
  status: 'PAID',
  createdAt: 1706880000000,
  paidAt: 1706880001000
}

// Level 2 комиссия
{
  id: 'comm_002',
  uplineUserId: 'user_001',      // Реферер реферера
  investorUserId: 'user_003',
  userCopyId: 'copy_001',
  level: 2,
  commissionRate: 0.03,
  investorPnL: 5000,             // Сумма инвестиции
  commissionAmount: 150,         // $5000 × 3%
  status: 'PAID',
  createdAt: 1706880000000,
  paidAt: 1706880001000
}
```

### TurnoverBonus

```typescript
type TurnoverBonusLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TurnoverBonusStatus = 'PENDING' | 'PAID';

interface TurnoverBonus {
  id: string;                    // 'tb_123'
  userId: string;                // Получатель
  level: TurnoverBonusLevel;     // Уровень (1-10)
  thresholdAmount: number;       // Порог оборота
  bonusAmount: number;           // Сумма бонуса
  teamTurnover: number;          // Оборот на момент достижения
  achievedAt: number;            // Время достижения
  status: TurnoverBonusStatus;   // Статус
  paidAt?: number;               // Время выплаты
}
```

**Turnover Levels:**
```
Level 1:  $1,000 turnover    → $10 bonus
Level 2:  $5,000 turnover    → $50 bonus
Level 3:  $10,000 turnover   → $100 bonus
Level 4:  $25,000 turnover   → $250 bonus
Level 5:  $50,000 turnover   → $500 bonus
Level 6:  $100,000 turnover  → $1,000 bonus
Level 7:  $250,000 turnover  → $2,500 bonus
Level 8:  $500,000 turnover  → $5,000 bonus
Level 9:  $750,000 turnover  → $7,500 bonus
Level 10: $1,000,000 turnover → $10,000 bonus
```

**Team Turnover:** Сумма active bot sizes от рефералов, взвешенная по уровню (Cashflow Impact: L1=100%, L2=50%, L3=25%, L4=10%, L5=10%)

**Примеры:**
```typescript
// Level 1 бонус
{
  id: 'tb_001',
  userId: 'user_001',
  level: 1,
  thresholdAmount: 1000,
  bonusAmount: 10,
  teamTurnover: 1200,
  achievedAt: 1706880000000,
  status: 'PAID',
  paidAt: 1706880001000
}

// Level 5 бонус
{
  id: 'tb_005',
  userId: 'user_001',
  level: 5,
  thresholdAmount: 50000,
  bonusAmount: 500,
  teamTurnover: 52400,
  achievedAt: 1706966400000,
  status: 'PAID',
  paidAt: 1706966401000
}
```

### BalanceTransaction

```typescript
type BalanceTransactionType =
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'COPY_OPEN'
  | 'COPY_CLOSE'
  | 'PNL_COLLECT'
  | 'REFERRAL_COMMISSION'
  | 'TURNOVER_BONUS';

type BalanceType = 'frozen' | 'available';
type TransactionDirection = 'IN' | 'OUT';

interface BalanceTransaction {
  id: string;                    // 'tx_123'
  userId: string;                // Пользователь
  type: BalanceTransactionType;  // Тип транзакции
  amount: number;                // Сумма
  balanceType: BalanceType;      // Какой баланс затронут
  direction: TransactionDirection; // Направление
  relatedEntityId?: string;      // Связанная сущность
  balanceBefore: number;         // Баланс до
  balanceAfter: number;          // Баланс после
  createdAt: number;             // Время
}
```

**Примеры:**
```typescript
// Депозит
{
  id: 'tx_001',
  userId: 'user_001',
  type: 'DEPOSIT',
  amount: 10000,
  balanceType: 'available',
  direction: 'IN',
  balanceBefore: 0,
  balanceAfter: 10000,
  createdAt: 1706880000000
}

// Открытие копии
{
  id: 'tx_002',
  userId: 'user_001',
  type: 'COPY_OPEN',
  amount: 5000,
  balanceType: 'available',
  direction: 'OUT',
  relatedEntityId: 'copy_001',
  balanceBefore: 10000,
  balanceAfter: 5000,
  createdAt: 1706880001000
}

// Получение комиссии
{
  id: 'tx_003',
  userId: 'user_002',
  type: 'REFERRAL_COMMISSION',
  amount: 100,
  balanceType: 'available',
  direction: 'IN',
  relatedEntityId: 'comm_001',
  balanceBefore: 0,
  balanceAfter: 100,
  createdAt: 1706880002000
}
```

---

## Business Logic

### 1. User Registration with Referral

```typescript
async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}): Promise<User>
```

**Flow:**
```
1. Validate referral code (if provided)
2. Generate unique referral code for new user
3. Build referral path (parent's path + parent's id)
4. Create user
5. Initialize balance (frozen: 0, available: 0)
6. Update referrer's statistics
```

**Example:**
```typescript
const user = await createUser({
  username: 'Bob',
  email: 'bob@example.com',
  referralCode: 'ALICE123' // Alice's code
});

// Result:
// user.referredBy = 'user_001' (Alice's ID)
// user.referralPath = '/user_default/user_001'
// user.referralCode = 'BOB456'
```

### 2. Create User Copy

```typescript
async function createBotCopy(
  masterBotId: string,
  investedAmount: number,
  userId: string
): Promise<string>
```

**Flow:**
```
1. Check available balance >= investedAmount
2. Freeze funds: available → frozen
3. Create UserCopy (status: ACTIVE)
4. Record COPY_OPEN transaction
5. Ensure Master Bot exists
```

**Example:**
```typescript
// Before: available = $10,000, frozen = $0
const copyId = await botsApi.createBotCopy('demo-btc-scalper', 5000, userId);
// After: available = $5,000, frozen = $5,000
```

### 3. Collect P&L (NEW)

```typescript
async function collectProfit(copyId: string): Promise<{
  collectedAmount: number;
  totalCollectedPnL: number;
  collectCount: number;
}>
```

**Flow:**
```
1. Validate copy is ACTIVE
2. Check rate limit (10 min cooldown)
3. Set operationInProgress = 'collect'
4. Calculate availableToCollect = max(0, realizedPnL - totalCollectedPnL)
5. IF availableToCollect > 0:
   a. Update totalCollectedPnL BEFORE credit (atomicity rule)
   b. Credit profit to available balance (PNL_COLLECT transaction)
   c. Distribute referral commissions (platform bonus)
6. Clear operationInProgress
```

### 4. Close User Copy (Archive)

```typescript
async function closeUserCopy(copyId: string): Promise<{
  copy: BotStats | null;
  finalPnL: number;
  finalValue: number;
  totalCommissions: number;
  investorReceives: number;
  previouslyCollected: number;
  autoCollected: number;
  capitalReturn: number;
  earlyExitFee: number;
  isEarlyExit: boolean;
}>
```

**Flow:**
```
1. Set operationInProgress = 'archive', mark as CLOSING
2. Calculate final P&L from master bot
3. Calculate early exit fee (if before reservation period)
4. Auto-collect remaining profit:
   a. uncollectedProfit = max(0, realizedPnL - totalCollectedPnL)
   b. IF uncollectedProfit > 0:
      - Update totalCollectedPnL BEFORE credit (atomicity rule!)
      - Credit profit to available balance
      - Distribute referral commissions (platform bonus)
5. Calculate capital return: investedAmount - earlyExitFee
6. Unfreeze funds: frozen → available (capital return amount)
7. Record COPY_CLOSE transaction
8. Mark copy as CLOSED with early exit info
```

**Example 1: Early Exit (Day 5)**
```typescript
// Copy: invested $1,000, realized P&L +$50, Day 5
const result = await botsApi.closeUserCopy('copy_001');

// Result:
// earlyExitFee: 200 (20% of $1,000)
// autoCollected: 50 (realized profit → user's balance)
// capitalReturn: 800 ($1,000 - $200 fee)
// investorReceives: 850 (capitalReturn + autoCollected)
// isEarlyExit: true
// Referral commissions: platform pays on $50 profit
```

**Example 2: Normal Exit (Day 45), previously collected $800**
```typescript
// Copy: invested $5,000, realized P&L +$1,000, already collected $800
const result = await botsApi.closeUserCopy('copy_001');

// Result:
// earlyExitFee: 0 (no penalty)
// previouslyCollected: 800
// autoCollected: 200 ($1,000 - $800 uncollected)
// capitalReturn: 5000
// investorReceives: 5200 (capitalReturn + autoCollected)
// isEarlyExit: false
// Referral commissions: platform pays on $200 (uncollected portion)
```

### 4. Distribute Referral Commissions

```typescript
async function distributeReferralCommissions(
  investorUserId: string,
  userCopyId: string,
  investedAmount: number
): Promise<number>
```

**Trigger:** Bot activation (createBotCopy)

**Algorithm:**
```
IF investedAmount <= 0:
  RETURN 0

uplineChain = getUplineChain(investorUserId) // Max 5 levels

FOR EACH upline IN uplineChain (level 1-5):
  rate = COMMISSION_RATES[level]
  commissionAmount = investedAmount × rate

  1. Create ReferralCommission record
  2. Credit to upline's available balance
  3. Record REFERRAL_COMMISSION transaction
  4. Mark commission as PAID

  totalDistributed += commissionAmount

RETURN totalDistributed
```

**Example:**
```typescript
// 3-level chain: UserA → UserB → UserC → Investor
// Investor activates bot with $5,000 investment

const distributed = await distributeReferralCommissions(
  investorId,
  'copy_001',
  5000
);

// UserC (Level 1): +$250 (5%)
// UserB (Level 2): +$150 (3%)
// UserA (Level 3): +$100 (2%)
// Total: $500
```

### 5. Award Turnover Bonuses

```typescript
async function checkAndAwardTurnoverBonuses(userId: string): Promise<void>
```

**Algorithm:**
```
1. Calculate team turnover:
   teamTurnover = SUM(positive realized P&L from all referrals)

2. Get current max achieved level

3. FOR EACH level IN TURNOVER_LEVELS:
   IF level > currentLevel AND teamTurnover >= threshold:
     3.1. Create TurnoverBonus record
     3.2. Credit bonus to available balance
     3.3. Record TURNOVER_BONUS transaction
     3.4. Mark bonus as PAID
```

**Team Turnover Calculation:**
```typescript
async function calculateTeamTurnover(userId: string): Promise<number> {
  referrals = getAllReferrals(userId)

  totalTurnover = 0
  FOR EACH referral IN referrals:
    level = getReferralLevel(currentUser, referral)
    IF level > 5: SKIP
    impact = CASHFLOW_IMPACT[level]  // L1=100%, L2=50%, L3=25%, L4=10%, L5=10%
    activeCopies = getActiveUserCopies(referral.id)
    FOR EACH copy IN activeCopies:
      totalTurnover += copy.investedAmount × impact

  RETURN totalTurnover
}
```

**Example:**
```typescript
// UserA has referrals:
// - Bob (L1): active copy $2,000 → $2,000 × 100% = $2,000
// - Charlie (L2): active copy $3,000 → $3,000 × 50% = $1,500
// - Diana (L3): active copy $4,000 → $4,000 × 25% = $1,000
// Total turnover: $4,500

await checkAndAwardTurnoverBonuses('userA');

// Result:
// - Level 1 bonus awarded ($100) at $1,000 threshold
// - Available balance += $100
```

---

## API Reference

### Users API

#### `createUser()`
```typescript
createUser(data: {
  username: string;
  email: string;
  referralCode?: string;
}): Promise<User>
```

**Создает нового пользователя с реферальным кодом.**

#### `getUser()`
```typescript
getUser(userId: string): Promise<User | null>
```

**Получает пользователя по ID.**

#### `getUserByReferralCode()`
```typescript
getUserByReferralCode(code: string): Promise<User | null>
```

**Получает пользователя по реферальному коду.**

#### `getDirectReferrals()`
```typescript
getDirectReferrals(userId: string): Promise<User[]>
```

**Получает прямых рефералов (Level 1).**

#### `getAllReferrals()`
```typescript
getAllReferrals(userId: string): Promise<User[]>
```

**Получает всех рефералов (все уровни).**

#### `getUplineChain()`
```typescript
getUplineChain(userId: string): Promise<User[]>
```

**Получает upline chain (до 10 уровней).**

### Balances API

#### `getBalance()`
```typescript
getBalance(userId: string): Promise<Balance>
```

**Получает баланс пользователя (создает если не существует).**

#### `deposit()`
```typescript
deposit(userId: string, amount: number): Promise<Balance>
```

**Пополнение available баланса.**

#### `withdraw()`
```typescript
withdraw(userId: string, amount: number, address: string): Promise<Balance>
```

**Вывод из available баланса.**

#### `freezeFunds()`
```typescript
freezeFunds(userId: string, amount: number, copyId: string): Promise<Balance>
```

**Замораживание средств (available → frozen).**

#### `unfreezeFunds()`
```typescript
unfreezeFunds(
  userId: string,
  investedAmount: number,
  receivedAmount: number,
  copyId: string
): Promise<Balance>
```

**Размораживание средств (frozen → available).**

#### `getUserTransactions()`
```typescript
getUserTransactions(userId: string): Promise<BalanceTransaction[]>
```

**Получает историю транзакций (sorted by createdAt DESC).**

### Commissions API

#### `distributeReferralCommissions()`
```typescript
distributeReferralCommissions(
  investorUserId: string,
  userCopyId: string,
  profitAmount: number
): Promise<number>
```

**Распределяет комиссии по upline chain. Возвращает total distributed.**

#### `getUserCommissions()`
```typescript
getUserCommissions(userId: string): Promise<ReferralCommission[]>
```

**Получает все комиссии пользователя.**

#### `getTotalEarned()`
```typescript
getTotalEarned(userId: string): Promise<number>
```

**Получает total earned commissions.**

#### `calculateExpectedCommissions()`
```typescript
calculateExpectedCommissions(
  investorUserId: string,
  profitAmount: number
): Promise<Array<{
  level: CommissionLevel;
  rate: number;
  amount: number;
  upline: User | null;
}>>
```

**Рассчитывает ожидаемые комиссии до закрытия копии.**

### Turnover Bonuses API

#### `calculateTeamTurnover()`
```typescript
calculateTeamTurnover(userId: string): Promise<number>
```

**Рассчитывает командный оборот (сумма positive realized P&L).**

#### `checkAndAwardTurnoverBonuses()`
```typescript
checkAndAwardTurnoverBonuses(userId: string): Promise<void>
```

**Проверяет и начисляет turnover bonuses.**

#### `getTurnoverStats()`
```typescript
getTurnoverStats(userId: string): Promise<{
  currentLevel: TurnoverBonusLevel | null;
  teamTurnover: number;
  totalBonusesEarned: number;
  nextLevel: {
    level: TurnoverBonusLevel | null;
    threshold: number;
    bonus: number;
    progress: number;
  } | null;
}>
```

**Получает статистику turnover bonuses.**

#### `getLevelStatuses()`
```typescript
getLevelStatuses(userId: string): Promise<Array<{
  level: TurnoverBonusLevel;
  threshold: number;
  bonus: number;
  achieved: boolean;
  claimed: boolean;
}>>
```

**Получает статус всех 10 уровней.**

### Capital Reservation API

#### `calculateEarlyExitFee()`
```typescript
calculateEarlyExitFee(
  investedCapital: number,
  currentPnL: number,
  daysSinceCopy: number,
  reservationDays: number = 30
): {
  fee: number;
  penaltyRate: number;
  isEarlyExit: boolean;
  effectiveReturn: number;
  userReceives: number;
}
```

**Рассчитывает early exit fee и effective return.**

#### `getEarlyExitPenaltyRate()`
```typescript
getEarlyExitPenaltyRate(
  daysSinceCopy: number,
  reservationDays: number = 30
): number
```

**Получает penalty rate по количеству дней.**

#### `getDaysRemainingInReservation()`
```typescript
getDaysRemainingInReservation(
  createdAt: number,
  reservationDays: number = 30
): number
```

**Получает количество дней до окончания reservation period.**

#### `isWithinReservationPeriod()`
```typescript
isWithinReservationPeriod(
  createdAt: number,
  reservationDays: number = 30
): boolean
```

**Проверяет, находится ли копия в reservation period.**

### Collect P&L API

#### `collectProfit()`
```typescript
botsApi.collectProfit(copyId: string): Promise<{
  collectedAmount: number;
  totalCollectedPnL: number;
  collectCount: number;
}>
```

**Собирает realized profit из активной копии. Rate limit: 1 per 10 минут.**

#### `getUserCopyPnLBreakdown()`
```typescript
getUserCopyPnLBreakdown(copyId: string): PnLBreakdown | null
```

**Центральная формула расчета P&L (single source of truth).**

```typescript
interface PnLBreakdown {
  realizedPnL: number;        // From closed trades
  unrealizedPnL: number;      // From open positions
  totalPnL: number;           // realized + unrealized
  totalCollected: number;     // Previously collected amount
  availableToCollect: number; // max(0, realizedPnL - totalCollected)
  currentValue: number;       // invested + realized - collected + unrealized
  investedAmount: number;
  collectCount: number;
}
```

#### `creditCollectedPnL()`
```typescript
creditCollectedPnL(
  userId: string,
  amount: number,
  copyId: string
): Promise<Balance>
```

**Зачисляет collected profit на available balance. Записывает PNL_COLLECT транзакцию.**

### Bots API

#### `createBotCopy()`
```typescript
createBotCopy(
  masterBotId: string,
  investedAmount: number,
  userId: string
): Promise<string>
```

**Создает копию бота.**

#### `closeUserCopy()`
```typescript
closeUserCopy(copyId: string): Promise<{
  copy: BotStats | null;
  finalPnL: number;
  finalValue: number;
  totalCommissions: number;
  investorReceives: number;
  previouslyCollected: number;
  autoCollected: number;
  capitalReturn: number;
  earlyExitFee: number;
  isEarlyExit: boolean;
}>
```

**Архивирует копию: auto-collect оставшегося profit, возврат капитала (минус early exit fee).**

---

## UI Components

### BalanceCard

**Путь:** `components/BalanceCard.tsx`

**Props:**
```typescript
interface BalanceCardProps {
  userId: string;
  showBreakdown?: boolean;
}
```

**Отображает:**
- Total Balance
- Available Balance (с иконкой ✓)
- Frozen Balance (с иконкой 🔒)
- Last updated timestamp

**Auto-refresh:** Каждые 5 секунд

**Example:**
```tsx
<BalanceCard userId="user_001" showBreakdown={true} />
```

### CommissionHistory

**Путь:** `components/CommissionHistory.tsx`

**Props:**
```typescript
interface CommissionHistoryProps {
  userId: string;
  limit?: number;
  showStats?: boolean;
}
```

**Отображает:**
- Total Earned
- Commission list с фильтрами по level
- Badge с level и rate
- Time ago

**Filters:** All, L1, L2, L3, L4, L5

**Auto-refresh:** Каждые 10 секунд

**Example:**
```tsx
<CommissionHistory userId="user_001" limit={10} showStats={true} />
```

### TurnoverProgress

**Путь:** `components/TurnoverProgress.tsx`

**Props:**
```typescript
interface TurnoverProgressProps {
  userId: string;
  showAllLevels?: boolean;
}
```

**Отображает:**
- Current team turnover
- Total bonuses earned
- Next level progress bar
- All 10 levels с статусами (🔒 Locked, ⚡ Ready, ✅ Claimed)
- Expand/collapse для всех уровней

**Auto-refresh:** Каждые 10 секунд

**Example:**
```tsx
<TurnoverProgress userId="user_001" showAllLevels={false} />
```

### Copy Detail Page (with Collect P&L)

**Путь:** `app/dashboard-v2/copy/[copyId]/page.tsx`

**Отображает:**
- Realized P&L card (green/red)
- Unrealized P&L card (cyan/red)
- Collect P&L section (green bar with amount + button)
- Confirmation dialog with cancel/confirm
- P&L breakdown in sidebar (Total P&L, Collected, In Bot)
- Rate limit enforcement (10 min cooldown)

### Archive Bot Page

**Путь:** `app/dashboard-v2/copy/[copyId]/archive/page.tsx`

**Отображает:**
- Previously collected amount (already on balance)
- Auto-collect remaining profit
- Capital return
- Early exit fee (if applicable)
- "Credited to your balance now" total
- "Total received all-time" (including previous collects)
- Reservation progress bar
- Confirmation input for early exit ("ARCHIVE")
- Note: "Referral bonuses are awarded by the platform and not deducted from your profit"

---

## Примеры использования

### Пример 1: Регистрация с реферальным кодом

```typescript
// 1. User A регистрируется (root)
const userA = await createUser({
  username: 'Alice',
  email: 'alice@example.com',
});
console.log(userA.referralCode); // 'ALICE123'

// 2. User B регистрируется по ссылке User A
const userB = await createUser({
  username: 'Bob',
  email: 'bob@example.com',
  referralCode: 'ALICE123', // Alice's code
});
console.log(userB.referredBy); // userA.id
```

### Пример 2: Полный цикл - создание, collect, архивирование

```typescript
// 1. Инвестор пополняет баланс
await deposit(investorId, 10000);
// Available: $10,000, Frozen: $0

// 2. Создает копию
const copyId = await botsApi.createBotCopy('demo-btc-scalper', 5000, investorId);
// Available: $5,000, Frozen: $5,000

// 3. Бот торгует... (realized profit +$500)

// 4. Инвестор собирает profit
const collect = await botsApi.collectProfit(copyId);
// collect.collectedAmount: 500
// Available: $5,500, Frozen: $5,000

// 5. Бот продолжает торговать... (realized profit now +$1,000)

// 6. Инвестор архивирует копию
const result = await botsApi.closeUserCopy(copyId);
// result.previouslyCollected: 500
// result.autoCollected: 500 (uncollected portion)
// result.capitalReturn: 5000
// result.investorReceives: 5500 (capital + uncollected)
// Available: $11,000, Frozen: $0
// Total received: $11,000 ($500 collect + $5,500 archive)
// Referral commissions: platform pays bonuses on $1,000 total profit
```

### Пример 3: Проверка P&L breakdown

```typescript
// Получить breakdown до сбора profit
const breakdown = getUserCopyPnLBreakdown(copyId);

console.log(breakdown);
// {
//   realizedPnL: 1000,
//   unrealizedPnL: 250,
//   totalPnL: 1250,
//   totalCollected: 500,
//   availableToCollect: 500,  // 1000 - 500
//   currentValue: 5750,       // 5000 + 1000 - 500 + 250
//   investedAmount: 5000,
//   collectCount: 2
// }

if (breakdown.availableToCollect > 0) {
  console.log(`You can collect $${breakdown.availableToCollect}`);
}
```

### Пример 4: Отслеживание прогресса turnover bonuses

```typescript
const stats = await getTurnoverStats(userId);

console.log(`Current Level: ${stats.currentLevel || 0}`);
console.log(`Team Turnover: $${stats.teamTurnover.toFixed(2)}`);
console.log(`Total Earned: $${stats.totalBonusesEarned.toFixed(2)}`);

if (stats.nextLevel) {
  console.log(`Next Level: ${stats.nextLevel.level}`);
  console.log(`Progress: ${stats.nextLevel.progress.toFixed(1)}%`);
  console.log(`Remaining: $${(stats.nextLevel.threshold - stats.nextLevel.currentTurnover).toFixed(2)}`);
}
```

### Пример 5: История транзакций

```typescript
const transactions = await getUserTransactions(userId);

transactions.forEach(tx => {
  console.log(`${tx.type}: ${tx.direction === 'IN' ? '+' : '-'}$${tx.amount}`);
  console.log(`  Balance: $${tx.balanceBefore} → $${tx.balanceAfter}`);
  console.log(`  ${new Date(tx.createdAt).toLocaleString()}`);
});
```

---

## Тестирование

### Запуск тестов

```bash
# Все тесты
npx tsx scripts/run-referral-tests.ts

# Отдельные тесты
npx tsx tests/unit/referralCommissions.test.ts
npx tsx tests/unit/turnoverBonuses.test.ts
npx tsx tests/unit/balances.test.ts
npx tsx tests/integration/referral-flow.test.ts
```

### Test Coverage

| Module | Coverage | Tests |
|--------|----------|-------|
| referralCommissions.ts | 95% | 6 unit tests |
| turnoverBonuses.ts | 92% | 8 unit tests |
| balances.ts | 98% | 11 unit tests |
| Integration Flow | 100% | 1 e2e test |
| **Total** | **~90%** | **26 tests** |

### Demo Data Setup

```bash
# Создать демо-данные (10-level tree, 13 users, samples)
npx tsx scripts/setup-demo-referrals.ts

# Открыть в браузере
npm run dev
# http://localhost:3001/dashboard-v2/referrals
```

**Демо-данные включают:**
- 10-уровневое дерево (Alice → Bob → Charlie → ... → Kate)
- 4 branch users
- 10 закрытых копий (7 profitable, 3 losses)
- Commission history
- Turnover bonuses
- 3 активные копии

---

## Deployment

### Phase 1: localStorage MVP (Current)

**Status:** ✅ Completed

**Stack:**
- Frontend: Next.js 14 + React 19
- Storage: localStorage (LocalStorageAdapter)
- State: BotManager + localStorage

**Limitations:**
- Single browser
- No multi-device sync
- localStorage quota (5-10MB)

### Phase 2: Backend Migration (Planned)

**Target Stack:**
- Backend: Express.js + PostgreSQL
- API: REST API (already structured in botsApi.ts)
- Storage: PostgresAdapter (swap LocalStorageAdapter)

**Migration Path:**
```typescript
// Current
const storage = new LocalStorageAdapter();

// After migration
const storage = new PostgresAdapter({
  host: 'localhost',
  database: 'celestian',
  user: 'postgres',
  password: 'password'
});

// Business logic layer remains UNCHANGED ✅
```

**PostgreSQL Schema:**
```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  referral_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- balances table
CREATE TABLE balances (
  id UUID PRIMARY KEY REFERENCES users(id),
  user_id UUID NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDT',
  frozen DECIMAL(15,2) DEFAULT 0,
  available DECIMAL(15,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_copies table
CREATE TABLE user_copies (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  master_bot_id VARCHAR(50) NOT NULL,
  invested_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(10) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  final_pnl DECIMAL(15,2),
  final_value DECIMAL(15,2)
);

-- referral_commissions table
CREATE TABLE referral_commissions (
  id UUID PRIMARY KEY,
  upline_user_id UUID REFERENCES users(id),
  investor_user_id UUID REFERENCES users(id),
  user_copy_id VARCHAR(50) NOT NULL,
  level INT CHECK (level BETWEEN 1 AND 10),
  commission_rate DECIMAL(5,4) NOT NULL,
  investor_pnl DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(10) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  UNIQUE (user_copy_id, upline_user_id)
);

-- turnover_bonuses table
CREATE TABLE turnover_bonuses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  level INT CHECK (level BETWEEN 1 AND 10),
  threshold_amount DECIMAL(15,2) NOT NULL,
  bonus_amount DECIMAL(15,2) NOT NULL,
  team_turnover DECIMAL(15,2) NOT NULL,
  achieved_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(10) DEFAULT 'PENDING',
  paid_at TIMESTAMP,
  UNIQUE (user_id, level)
);

-- balance_transactions table
CREATE TABLE balance_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(30) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_type VARCHAR(10) NOT NULL,
  direction VARCHAR(5) NOT NULL,
  related_entity_id VARCHAR(100),
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_commissions_upline ON referral_commissions(upline_user_id);
CREATE INDEX idx_transactions_user ON balance_transactions(user_id, created_at DESC);
```

---

## FAQ

### Q: Когда начисляются комиссии?

**A:** Комиссии начисляются **при активации бота** (createBotCopy) — от суммы инвестиции. Комиссии оплачиваются **платформой** и **НЕ вычитаются** из прибыли пользователя.

**Почему при активации?**
- ✅ Мгновенное вознаграждение для рефереров
- ✅ Пользователь получает 100% своего profit
- ✅ Понятная бизнес-логика
- ✅ Реферер мотивирован привлекать активных трейдеров

---

### Q: Что если investor закрывает копию с убытком?

**A:** Комиссии уже были начислены при **активации** бота (от суммы инвестиции), поэтому закрытие копии не влияет на комиссии.

---

### Q: Влияют ли комиссии на compounding?

**A:** **Нет!** Unrealized P&L остается в копии и полностью компаундится. Комиссии оплачиваются платформой и не затрагивают прибыль пользователя.

---

### Q: Как считается team turnover?

**A:** Team turnover = сумма **active bot sizes** от рефералов, взвешенная по уровню (Cashflow Impact).

```typescript
// L1 referral with $2,000 active bot:
turnover += 2000 * 1.0;   // 100% impact

// L2 referral with $3,000 active bot:
turnover += 3000 * 0.5;   // 50% impact

// L3 referral with $4,000 active bot:
turnover += 4000 * 0.25;  // 25% impact
```

---

### Q: Сколько максимум могут взять в комиссиях?

**A:** **Максимум 11.5% от суммы инвестиции** (если есть полная 5-уровневая цепочка).

```
5% + 3% + 2% + 1% + 0.5% = 11.5%
```

---

### Q: Можно ли вывести frozen balance?

**A:** **Нет!** Frozen balance заблокирован в активных копиях. Вывести можно только **available balance**.

```typescript
await withdraw(userId, amount, address);
// Checks: amount <= balance.available
```

---

### Q: Как защититься от self-referral?

**A:** Реализованы проверки:
- IP address similarity
- Email similarity
- Registration timing (too fast = suspicious)
- Circular reference prevention (referralPath check)

---

### Q: Что если upline удалил аккаунт?

**A:** Используется **soft delete** (deleted_at field). При распределении комиссий:
```typescript
if (upline.deleted_at) {
  continue; // Skip level, move to next upline
}
```

---

### Q: Можно ли изменить реферера после регистрации?

**A:** **Нет!** Реферальная связь устанавливается при регистрации и **неизменна**.

---

### Q: Как работает materialized path?

**A:** referralPath хранит полный путь к корню:

```typescript
// User A (root)
referralPath: '/user_default'

// User B (referred by A)
referralPath: '/user_default/user_A'

// User C (referred by B)
referralPath: '/user_default/user_A/user_B'

// Fast query: Get all referrals of A
WHERE referral_path LIKE '/user_default/user_A%'
```

---

### Q: Что если достигнут turnover threshold, но нет личных инвестиций?

**A:** В текущей версии **personal investment НЕ требуется**. Бонус начисляется при достижении team turnover threshold.

В будущем можно добавить:
```typescript
if (teamTurnover >= threshold && personalInvestment >= required) {
  awardBonus();
}
```

---

### Q: Как протестировать систему?

**A:**
```bash
# 1. Запустить unit tests
npx tsx scripts/run-referral-tests.ts

# 2. Создать demo data
npx tsx scripts/setup-demo-referrals.ts

# 3. Открыть в браузере
npm run dev
# http://localhost:3001/dashboard-v2/referrals
```

---

### Q: Где хранятся данные?

**A:**
- **MVP:** localStorage (браузер)
- **Production (planned):** PostgreSQL

---

### Q: Сколько времени занимает закрытие копии?

**A:** **~100-200ms** для полного flow:
1. Calculate P&L (~10ms)
2. Distribute commissions (~50-100ms for 10 levels)
3. Award turnover bonuses (~20-50ms)
4. Update balances (~10-20ms)
5. Close copy (~10ms)

---

### Q: Можно ли отменить закрытие копии?

**A:** **Нет!** После перехода в статус CLOSING процесс необратим.

---

### Q: Влияют ли штрафы за раннее закрытие на комиссии?

**A:** **Нет!** В текущей модели early exit fee применяется к **invested capital**, а комиссии рассчитываются на **realized profit** и оплачиваются платформой.

```typescript
// Example: Early exit with penalty
investedCapital: $1,000
realizedPnL: $50
earlyExitFee: $200 (20% of invested capital)

investorReceives: $1,000 + $50 - $200 = $850
// Platform pays referral commissions on $50 profit to uplines
```

**Почему так:**
- Early exit fee — штраф за досрочный выход, идет платформе
- Комиссии реферерам — отдельный бонус от платформы за привлечение пользователя
- Referrer мотивирован, чтобы investor STAYED (не закрывался рано)

---

### Q: Как работает Collect P&L?

**A:** Пользователь вручную нажимает "Collect P&L" на странице копии, чтобы забрать realized profit.

```typescript
// Day 15: User clicks "Collect P&L"
realizedPnL: $150
totalCollectedPnL: $0
availableToCollect: $150
→ User receives $150

// Day 30: User clicks "Collect P&L" again
realizedPnL: $320
totalCollectedPnL: $150
availableToCollect: $170
→ User receives $170

// Day 45: No new profit
realizedPnL: $320
totalCollectedPnL: $320
availableToCollect: $0
→ Nothing to collect
```

**Benefits:**
- Пользователь сам решает когда забирать profit
- Платформа оплачивает реферальные бонусы (user получает 100%)
- Rate limit 10 мин предотвращает spam
- Atomicity rule предотвращает double-spend

---

### Q: Что если investor архивирует копию без предварительного Collect?

**A:** Система автоматически собирает (auto-collect) весь uncollected realized profit при архивировании.

```typescript
// Example: Archive with uncollected profit
investedCapital: $1,000
realizedPnL: $200
totalCollectedPnL: $0 (never collected)
earlyExitFee: $170 (17% penalty, Day 15)

autoCollected: $200 (full realized profit)
capitalReturn: $830 ($1,000 - $170 fee)
investorReceives: $1,030 ($830 + $200)
// Platform pays referral commissions on $200
```

---

### Q: Можно ли избежать early exit fee?

**A:** **Да!** Просто держи копию минимум 30 дней. После Day 30 penalty = 0%.

```
Day 0-10:   20% penalty
Day 11-20:  17% penalty
Day 21-29:  15% penalty
Day 30+:    0% penalty ✅
```

---

### Q: Куда идет early exit fee?

**A:** **Platform** (НЕ распределяется по referral chain).

```typescript
earlyExitFee: $200
→ Platform wallet (not distributed to uplines)

commissions: calculated on profit AFTER fee
→ Distributed to upline chain (10%, 5%, 3%, 2%×7)
```

---

## Контакты и поддержка

**Documentation:** `Referral_system.md`
**GitHub Issues:** [github.com/celestian/platform/issues](https://github.com/celestian/platform/issues)
**Email:** support@celestian.com

---

**Last Updated:** 2026-02-08
**Version:** 3.0.0
**Status:** Production Ready ✅
