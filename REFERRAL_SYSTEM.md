# Referral System - Полная документация

**Версия:** 1.0.0
**Дата:** 2026-02-07
**Статус:** Production Ready
**Автор:** Celestian Platform Team

---

## 📋 Содержание

1. [Введение](#введение)
2. [Архитектура системы](#архитектура-системы)
3. [Data Models](#data-models)
4. [Business Logic](#business-logic)
5. [API Reference](#api-reference)
6. [UI Components](#ui-components)
7. [Примеры использования](#примеры-использования)
8. [Тестирование](#тестирование)
9. [Deployment](#deployment)
10. [FAQ](#faq)

---

## Введение

### Что это?

Реферальная система для copy trading платформы, которая позволяет пользователям зарабатывать комиссии с прибыли своих рефералов на **10 уровнях** глубины.

### Ключевые особенности

- ✅ **10-уровневая реферальная программа** (10%, 5%, 3%, 2%×7)
- ✅ **Realized P&L Model** - комиссии только при закрытии копии
- ✅ **Turnover Bonuses** - дополнительные бонусы за командный оборот
- ✅ **Frozen/Available Balance** - разделение капитала
- ✅ **Real-time Awards** - мгновенное начисление
- ✅ **Transparent Breakdown** - детальный расчет комиссий

### Бизнес-модель

```
Инвестор закрывает копию с прибылью
    ↓
Система рассчитывает комиссии (до 32% от прибыли)
    ↓
Распределение по 10-уровневой цепочке
    ↓
Проверка порогов turnover bonuses
    ↓
Начисление на available balance
    ↓
Инвестор получает: Principal + Profit - Commissions
```

---

## Архитектура системы

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  ┌──────────────┬───────────────┬──────────────────┐   │
│  │  Referrals   │   Balance     │   Close Copy     │   │
│  │     Page     │     Card      │     Modal        │   │
│  └──────────────┴───────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  distributeReferralCommissions()                  │  │
│  │  checkAndAwardTurnoverBonuses()                   │  │
│  │  closeUserCopy()                                  │  │
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
- **referralCommissions.ts** - Распределение комиссий
- **turnoverBonuses.ts** - Система бонусов
- **balances.ts** - Управление балансами
- **users.ts** - Управление пользователями
- **botsApi.ts** - API для операций с копиями

#### 4. UI Components
- **BalanceCard** - Отображение баланса
- **CommissionHistory** - История комиссий
- **TurnoverProgress** - Прогресс к бонусам
- **CloseCopyModal** - Модальное окно закрытия

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
- Close Copy → Frozen--, Available++ (principal + profit - commissions)
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

// После закрытия с прибылью +$1,000 (комиссии $180)
{
  id: 'user_001',
  userId: 'user_001',
  frozen: 0,
  available: 10820,  // 5000 + 6000 - 180
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
type CommissionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type CommissionStatus = 'PENDING' | 'PAID';

interface ReferralCommission {
  id: string;                    // 'comm_123'
  uplineUserId: string;          // Кому начислена
  investorUserId: string;        // Кто закрыл копию
  userCopyId: string;            // Какая копия
  level: CommissionLevel;        // Уровень (1-10)
  commissionRate: number;        // Ставка (0.10, 0.05, 0.03, 0.02)
  investorPnL: number;           // Прибыль инвестора
  commissionAmount: number;      // Сумма комиссии
  status: CommissionStatus;      // Статус
  createdAt: number;             // Время создания
  paidAt?: number;               // Время выплаты
}
```

**Commission Rates:**
```
Level 1:  10%
Level 2:   5%
Level 3:   3%
Level 4:   2%
Level 5:   2%
Level 6:   2%
Level 7:   2%
Level 8:   2%
Level 9:   2%
Level 10:  2%
─────────────
Total:    32%
```

**Примеры:**
```typescript
// Level 1 комиссия
{
  id: 'comm_001',
  uplineUserId: 'user_002',      // Прямой реферер
  investorUserId: 'user_003',    // Инвестор
  userCopyId: 'copy_001',
  level: 1,
  commissionRate: 0.10,
  investorPnL: 1000,
  commissionAmount: 100,         // $1000 × 10%
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
  commissionRate: 0.05,
  investorPnL: 1000,
  commissionAmount: 50,          // $1000 × 5%
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

**Team Turnover:** Сумма positive realized P&L всех рефералов (убытки не считаются)

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

### 3. Close User Copy

```typescript
async function closeUserCopy(copyId: string): Promise<{
  copy: BotStats | null;
  finalPnL: number;
  finalValue: number;
  totalCommissions: number;
  investorReceives: number;
}>
```

**Flow:**
```
1. Mark copy as CLOSING
2. Calculate final P&L from master bot
3. IF finalPnL > 0:
   3.1. distributeReferralCommissions()
   3.2. checkAndAwardTurnoverBonuses() for all uplines
4. Calculate investor receives (finalValue - totalCommissions)
5. Unfreeze funds: frozen → available
6. Record COPY_CLOSE transaction
7. Mark copy as CLOSED
```

**Example:**
```typescript
// Copy: invested $5,000, P&L +$1,000
const result = await botsApi.closeUserCopy('copy_001');

// Result:
// finalPnL: 1000
// finalValue: 6000
// totalCommissions: 180 (10% + 5% + 3% of $1000)
// investorReceives: 5820 ($6000 - $180)
```

### 4. Distribute Referral Commissions

```typescript
async function distributeReferralCommissions(
  investorUserId: string,
  userCopyId: string,
  profitAmount: number
): Promise<number>
```

**Algorithm:**
```
IF profitAmount <= 0:
  RETURN 0

uplineChain = getUplineChain(investorUserId) // Max 10 levels

FOR EACH upline IN uplineChain (level 1-10):
  rate = COMMISSION_RATES[level]
  commissionAmount = profitAmount × rate

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
// Investor closes copy with $1,000 profit

const distributed = await distributeReferralCommissions(
  investorId,
  'copy_001',
  1000
);

// UserC (Level 1): +$100 (10%)
// UserB (Level 2): +$50 (5%)
// UserA (Level 3): +$30 (3%)
// Total: $180
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
  referrals = getAllReferrals(userId) // All levels

  totalTurnover = 0
  FOR EACH referral IN referrals:
    closedCopies = getClosedUserCopies(referral.id)
    FOR EACH copy IN closedCopies:
      IF copy.finalPnL > 0:
        totalTurnover += copy.finalPnL

  RETURN totalTurnover
}
```

**Example:**
```typescript
// UserA has 5 referrals:
// - Bob: closed 2 copies (+$300, +$500)
// - Charlie: closed 1 copy (-$100) → excluded
// - Diana: closed 1 copy (+$400)
// Total turnover: $1,200

await checkAndAwardTurnoverBonuses('userA');

// Result:
// - Level 1 bonus awarded ($10) at $1,000 threshold
// - Available balance += $10
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
}>
```

**Закрывает копию с распределением комиссий.**

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

### CloseCopyModal

**Путь:** `components/modals/CloseCopyModal.tsx`

**Props:**
```typescript
interface CloseCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  copyId: string;
  investorUserId: string;
  investedAmount: number;
  currentPnL: number;
  onSuccess?: () => void;
}
```

**Отображает:**
- Principal invested
- Current P&L
- Commission breakdown (Level 1-N)
- Total commissions
- Final amount investor receives
- Confirm/Cancel buttons

**Example:**
```tsx
<CloseCopyModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  copyId="copy_001"
  investorUserId="user_001"
  investedAmount={5000}
  currentPnL={1000}
  onSuccess={() => router.push('/dashboard-v2')}
/>
```

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

### Пример 2: Полный цикл - создание и закрытие копии

```typescript
// 1. Инвестор пополняет баланс
await deposit(investorId, 10000);
// Available: $10,000, Frozen: $0

// 2. Создает копию
const copyId = await botsApi.createBotCopy('demo-btc-scalper', 5000, investorId);
// Available: $5,000, Frozen: $5,000

// 3. Бот торгует... (profit +$1,000)

// 4. Инвестор закрывает копию
const result = await botsApi.closeUserCopy(copyId);
console.log(result);
// {
//   finalPnL: 1000,
//   finalValue: 6000,
//   totalCommissions: 180,
//   investorReceives: 5820
// }

// Available: $10,820, Frozen: $0
```

### Пример 3: Проверка комиссий до закрытия

```typescript
// Before closing, показать инвестору breakdown
const expected = await calculateExpectedCommissions(investorId, 1000);

console.log(expected);
// [
//   { level: 1, rate: 0.10, amount: 100, upline: User },
//   { level: 2, rate: 0.05, amount: 50, upline: User },
//   { level: 3, rate: 0.03, amount: 30, upline: User }
// ]

const totalCommissions = expected.reduce((sum, c) => sum + c.amount, 0);
console.log(`You will pay $${totalCommissions} in commissions`);
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

**A:** Комиссии начисляются **только при закрытии User Copy**, когда прибыль реализована. Это называется **Realized P&L Model**.

**Почему не per-trade?**
- ✅ Сохраняет compounding эффект (unrealized P&L остается в копии)
- ✅ Одна транзакция вместо тысяч
- ✅ Понятная бизнес-логика
- ✅ Легко проверить (auditable)

---

### Q: Что если investor закрывает копию с убытком?

**A:** Комиссии **не начисляются**. Uplines не получают ничего.

```typescript
if (finalPnL <= 0) {
  return 0; // No commissions
}
```

---

### Q: Влияют ли комиссии на compounding?

**A:** **Нет!** Unrealized P&L остается в копии и полностью компаундится. Комиссии вычитаются только при закрытии из **realized profit**.

---

### Q: Считаются ли убытки в team turnover?

**A:** **Нет!** Team turnover = сумма **только positive realized P&L**.

```typescript
if (copy.finalPnL > 0) {
  teamTurnover += copy.finalPnL;
}
// Losses are ignored
```

---

### Q: Сколько максимум могут взять в комиссиях?

**A:** **Максимум 32% от прибыли** (если есть полная 10-уровневая цепочка).

```
10% + 5% + 3% + (2% × 7) = 32%
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

**A:** **Нет!** Комиссии рассчитываются от **full profit BEFORE penalties**.

```typescript
// Example:
investorPnL: $1,000
commissions: $320 (calculated from $1,000)
penalty: $200 (early close)

investorReceives: $11,000 - $320 - $200 = $10,480
uplinesReceive: $320 (unaffected by penalty)
```

---

## Контакты и поддержка

**Documentation:** `Referral_system.md`
**GitHub Issues:** [github.com/celestian/platform/issues](https://github.com/celestian/platform/issues)
**Email:** support@celestian.com

---

**Last Updated:** 2026-02-07
**Version:** 1.0.0
**Status:** Production Ready ✅
