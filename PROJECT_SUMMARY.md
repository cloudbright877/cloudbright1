# Celestian — Project Summary

> Copy-trading платформа. Next.js 14 (App Router), TypeScript strict, Tailwind CSS, localStorage → будущая миграция на Express + DB.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, `'use client'` pages)
- **Language:** TypeScript strict
- **Styling:** Tailwind CSS + custom theme (primary=indigo, accent=cyan, dark=slate)
- **Animations:** Framer Motion + custom components (RevealOnScroll, TiltCard, Marquee, ScrambleText)
- **Icons:** Lucide React
- **State:** localStorage + BotManager singleton (НЕ useState для персистентных данных)
- **Font:** Zalando Sans (custom)

---

## Архитектура страниц

### Dashboard (`app/dashboard-v2/`)

| Страница | Описание |
|----------|----------|
| `page.tsx` | Главный дашборд: портфолио, активные боты, последние сделки |
| `bots/page.tsx` | Маркетплейс ботов: карусель рекомендаций + ранжированный список |
| `bots/[slug]/page.tsx` | Детали бота: статистика, графики, тикер, кнопка Copy |
| `bots/[slug]/copy/page.tsx` | Визард копирования: сумма, настройки риска |
| `bots/compare/page.tsx` | Сравнение ботов бок о бок |
| `portfolio/page.tsx` | Обзор портфеля с метриками |
| `analytics/page.tsx` | Глубокая аналитика: графики, метрики |
| `copy-bots/page.tsx` | Управление активными копиями |
| `copy/[copyId]/page.tsx` | Детали копии: P&L в реальном времени, сбор прибыли |
| `copy/[copyId]/archive/page.tsx` | Закрытие копии с расчётом штрафа за раннее закрытие |
| `quick-start/page.tsx` | 3-шаговый визард: сумма → риск → горизонт → результат |
| `transactions/page.tsx` | История транзакций (deposit, withdraw, P&L collect и т.д.) |
| `traders/page.tsx` | Обзор всех трейдеров |
| `traders/[username]/page.tsx` | Профиль трейдера |
| `whales/page.tsx` | Трекер китов ($50k+ инвестиций) |
| `leaderboard/page.tsx` | Рейтинг трейдеров по профиту/доходности/winRate |
| `feed/page.tsx` | Социальная лента: milestones, whale-moves, rank-changes |
| `notifications/page.tsx` | Центр уведомлений (генерируются из транзакций) |
| `referrals/page.tsx` | Реферальная программа: комиссии, статистика |
| `wallets/page.tsx` | Кошелёк: frozen/available баланс |
| `wallets/deposit/page.tsx` | Пополнение |
| `wallets/withdraw/page.tsx` | Вывод |
| `settings/page.tsx` | Хаб настроек (bento layout) |
| `settings/profile/page.tsx` | Профиль: имя, username, bio, аватар |
| `settings/security/page.tsx` | 2FA, сессии, бэкап-коды |
| `settings/kyc/page.tsx` | 4-шаговая KYC верификация |
| `settings/wallets/page.tsx` | Сохранённые адреса вывода |
| `settings/notifications/page.tsx` | Email уведомления |
| `settings/preferences/page.tsx` | Язык, валюта, тема |
| `admin/bots/page.tsx` | Админка: управление мастер-ботами |

### Публичные (`app/`)

| Страница | Описание |
|----------|----------|
| `page.tsx` | Лендинг: hero, how it works, featured bots, FAQ |
| `about/page.tsx` | О компании |
| `features/page.tsx` | Возможности платформы |
| `pricing/page.tsx` | Тарифы |
| `security/page.tsx` | Безопасность |
| `login/page.tsx` | Вход |
| `register/page.tsx` | Регистрация |
| `forgot-password/page.tsx` | Восстановление пароля |
| `legal/*` | Privacy, Terms, Cookies, Risk Disclosure, Compliance |
| `help-center/page.tsx` | Центр помощи |

---

## Ключевые модели данных

### DemoBot (маркетплейс)
```typescript
interface DemoBot {
  id: string;
  slug: string;
  name: string;
  icon: string;              // emoji
  risk: 'low' | 'medium' | 'high';
  strategy: string;
  description: string;
  verified: boolean;
  trending: boolean;
  tags: string[];
  config: BotConfig;         // торговые параметры
  stats: {
    rating: number;          // 1-5
    copiers: number;
    minInvestment: number;
    return7d / return30d / return90d / return1y: number; // %
    winRate: number;         // %
    maxDD: number;           // %
    sharpeRatio: number;
  };
  performanceData: number[]; // 30-дневный график
}
```

### UserCopy (копия бота)
```typescript
interface UserCopy {
  id: string;
  userId: string;
  masterBotId: string;       // → DemoBot.id
  investedAmount: number;
  status: 'ACTIVE' | 'CLOSING' | 'CLOSED';
  reservationDays: number;   // 30 дней
  earlyExitFee?: number;
  totalCollectedPnL: number; // собранная прибыль
  collectCount: number;
  operationInProgress: 'collect' | 'archive' | null; // блокировка
}
```

### Balance (баланс)
```typescript
interface Balance {
  userId: string;
  currency: 'USDT';
  frozen: number;     // заблокировано в активных копиях
  available: number;  // доступно для вывода/новых копий
}

type BalanceTransactionType =
  | 'DEPOSIT' | 'WITHDRAW'
  | 'COPY_OPEN' | 'COPY_CLOSE'
  | 'PNL_COLLECT'
  | 'REFERRAL_COMMISSION' | 'TURNOVER_BONUS';
```

### Position / Trade (торговля)
```typescript
interface Position {
  pair: string;              // 'BTCUSDT'
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice / currentPrice: number;
  pnl / pnlPercent: number;
  shouldWin: boolean;        // заранее определённый исход
  targetPnL: number;
}

interface Trade {
  pair: string;
  side: 'LONG' | 'SHORT';
  pnl / pnlPercent: number;
  openFee / closeFee / totalFees: number;
  netPnl: number;
}
```

### User + Referral
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  referralCode: string;      // 'JOHNDOE123'
  referredBy: string | null;
  referralPath: string;      // '/user_1/user_5' (materialized path)
}
```

### TraderProfile (социалка)
```typescript
interface TraderProfile {
  userId: string;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  isWhale: boolean;          // $50k+
  stats: {
    totalProfit: number;
    monthlyReturn: number;
    winRate: number;
    rank: number;
    followers / copiers: number;
  };
}
```

---

## Бизнес-логика

### Master Bot vs User Copy
- **Master Bot** = 1 экземпляр TradingBot (генерирует сделки)
- **User Copy** = лёгкая запись, ссылается на Master Bot + сумма инвестиции
- Статистика копии считается on-the-fly масштабированием сделок мастер-бота

### Поток баланса
```
Deposit → Available++
Open Copy → Available--, Frozen++
Collect P&L → Available++ (только прибыль, капитал остаётся frozen)
Close Copy → Frozen--, Available++ (капитал - штраф)
Withdraw → Available--
```

### Capital Reservation (30 дней)
- Все копии имеют 30-дневный период резервации
- Штраф за раннее закрытие: линейное снижение 100%→0% за 30 дней
- Пример: закрытие через 15 дней = 50% штраф на инвестированный капитал
- Прибыль НЕ штрафуется

### Manual Profit Collection
- Пользователь собирает реализованную прибыль пока копия ACTIVE
- Rate limit: 1 сбор в 10 минут на копию
- При сборе начисляются реферальные комиссии (10%/5%/2% upline)

### Referral система
- 3 уровня: Direct 10%, 2-й 5%, 3-й 2%
- Комиссии платятся при collect операциях
- Turnover бонусы: $50k/$100k/$250k/$500k (Bronze/Silver/Gold/Platinum)

### Convergence System (6 слоёв)
Система адаптивной конвергенции для реалистичного достижения целевой доходности:
- DynamicPnLCalculator → диапазоны win/loss
- DailyTargetController → отслеживание дневного прогресса
- SimpleTrendDetector → рыночная благоприятность
- StaggeredClosingManager → предотвращение одновременных закрытий
- ConvergenceController → оркестрация с микро-корректировками

---

## Lib файлы (справочник)

### Торговый движок
| Файл | Назначение |
|------|-----------|
| `BotManager.ts` | Синглтон-менеджер всех TradingBot (create, tick, save/load) |
| `PriceService.ts` | WebSocket к Binance для real-time цен |
| `demoMarketplace.ts` | 10 демо-ботов с полной статистикой |
| `seedBots.ts` | Создание демо-копий при первом запуске |
| `trading/TradingBot.ts` | Ядро: позиции, сделки, конвергенция, дневной сброс |
| `trading/types.ts` | Position, Trade, BotConfig, BotStats |
| `trading/DynamicPnLCalculator.ts` | Расчёт win/loss на основе dailyTarget/winRate |
| `trading/DailyTargetController.ts` | Контроль дневного прогресса |
| `trading/convergence/ConvergenceController.ts` | 6-слойная система конвергенции |

### Пользователи и балансы
| Файл | Назначение |
|------|-----------|
| `users.ts` | CRUD пользователей + реферальное дерево |
| `userCopies.ts` | CRUD копий (lightweight records) |
| `userCopyStats.ts` | Расчёт P&L копий из сделок мастер-бота |
| `balances.ts` | Баланс: frozen/available, транзакции |
| `capitalReservation.ts` | 30-дневная резервация + штрафы |
| `getCurrentUserId.ts` | Единая точка получения userId |

### API фасад
| Файл | Назначение |
|------|-----------|
| `api/botsApi.ts` | Все операции с ботами. `/* FUTURE: fetch('/api/...') */` |

### Реферальная система
| Файл | Назначение |
|------|-----------|
| `referralLinks.ts` | Генерация реферальных ссылок |
| `referralCommissions.ts` | Распределение комиссий (3 уровня) |
| `turnoverBonuses.ts` | Бонусы за оборот (Bronze → Platinum) |

### Социальная система
| Файл | Назначение |
|------|-----------|
| `social/types.ts` | TraderProfile, FeedEvent, WhaleAlert |
| `social/tier-system.ts` | Уровни: Diamond/Platinum/Gold/Silver |
| `social/feed-generator.ts` | Генерация событий ленты |
| `social/leaderboard.ts` | Рейтинг трейдеров |

### Настройки
| Файл | Назначение |
|------|-----------|
| `settings/settingsTypes.ts` | Все интерфейсы настроек |
| `settings/settingsService.ts` | Load/save из localStorage |

### Storage
| Файл | Назначение |
|------|-----------|
| `storage/StorageAdapter.ts` | Абстрактный интерфейс хранилища |
| `storage/LocalStorageAdapter.ts` | Реализация для localStorage |

---

## UI компоненты

### Общие
| Компонент | Описание |
|-----------|----------|
| `ui/GlassCard.tsx` | Glassmorphism карточка (default/gradient/glow) |
| `ui/Stepper.tsx` | Навигация мульти-шаговых визардов |
| `ui/Toast.tsx` | Всплывающие уведомления |

### Dashboard
| Компонент | Описание |
|-----------|----------|
| `dashboard-v2/Sidebar.tsx` | Левый сайдбар навигации |
| `dashboard-v2/TopBar.tsx` | Верхняя панель: юзер-меню, нотификации |
| `dashboard-v2/NetWorthHero.tsx` | Большая карточка стоимости портфеля |
| `dashboard-v2/BotCarousel.tsx` | Горизонтальный скролл карточек ботов |
| `dashboard-v2/LiveOpenPositions.tsx` | Таблица открытых позиций real-time |
| `dashboard-v2/ClosedTradesActivity.tsx` | Список последних закрытых сделок |
| `dashboard-v2/MiniChart.tsx` | Мини-график производительности |
| `dashboard-v2/RiskMetricsCard.tsx` | Карточка метрик риска |

### Анимации
| Компонент | Описание |
|-----------|----------|
| `animations/RevealOnScroll.tsx` | Появление при скролле (up/down/left/right) |
| `animations/ScrambleText.tsx` | Matrix-эффект текста |
| `animations/TiltCard.tsx` | 3D наклон при наведении |
| `animations/Marquee.tsx` | Бесконечный скролл |
| `animations/Carousel.tsx` | Карусель (embla) |
| `animations/GlowButton.tsx` | Кнопка с glow-эффектом |
| `animations/AnimatedCounter.tsx` | Анимированный счётчик |
| `animations/BentoGrid.tsx` | Bento-сетка |

---

## localStorage ключи

| Ключ | Данные |
|------|--------|
| `bots` | Список ботов и конфигов |
| `user_copies` | Все копии пользователей |
| `balances` | Балансы |
| `balance_transactions` | История транзакций |
| `users` | Пользователи |
| `referral_commissions` | Комиссии |
| `turnover_bonuses` | Бонусы за оборот |
| `follow_data` | Подписки |
| `feed_events` | Лента событий |
| `bot_stats_<botId>` | Статистика бота |
| `bot_positions_<botId>` | Открытые позиции |
| `bot_trades_<botId>` | История сделок |
| `settings_*` | Настройки пользователя |
| `currentUserId` | ID текущего пользователя |

---

## Подготовка к бэкенду

Все точки интеграции помечены `// BACKEND MIGRATION:` комментариями.

**Единая точка auth:** `lib/getCurrentUserId.ts` → заменить на JWT/session.

**API фасад:** `lib/api/botsApi.ts` — каждый метод содержит `/* FUTURE: fetch('/api/...') */`.

**Storage абстракция:** `lib/storage/StorageAdapter.ts` → реализовать DB adapter.

Поиск всех точек миграции:
```bash
grep -r "BACKEND MIGRATION" app/ lib/
grep -r "FUTURE:" lib/api/
```
