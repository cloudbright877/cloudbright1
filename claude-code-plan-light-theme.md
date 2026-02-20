# План внедрения белой темы на Dashboard-v2

## Анализ текущего состояния

### Презентационная часть (✅ готово)
- ✅ ThemeToggle компонент существует и работает
- ✅ Все компоненты используют паттерн `dark:` для поддержки обеих тем
- ✅ Root layout имеет `bg-white dark:bg-dark-900`
- ✅ Тема сохраняется в localStorage

### Dashboard-v2 (❌ требует доработки)
- ❌ Hardcoded класс `dark` в layout.tsx (строка 24)
- ❌ Все компоненты написаны только для темной темы
- ❌ Нет ThemeToggle в интерфейсе дашборда

## Этапы внедрения

### Этап 1: Инфраструктура темы (30 мин)
**Файлы:**
- `app/dashboard-v2/layout.tsx` - убрать hardcoded `dark`, добавить динамическую загрузку темы
- `components/dashboard-v2/TopBar.tsx` - добавить ThemeToggle

**Действия:**
1. Убрать класс `dark` из div.dashboard-scope в layout.tsx
2. Добавить useEffect для загрузки темы из localStorage при монтировании
3. Интегрировать ThemeToggle в TopBar (рядом с кнопкой уведомлений)

### Этап 2: Компоненты дашборда - Layout & Navigation (45 мин)
**Файлы:**
- `components/dashboard-v2/Sidebar.tsx`
- `components/dashboard-v2/TopBar.tsx`
- `app/dashboard-v2/layout.tsx` (фоны, анимации)

**Паттерн замены:**
- `bg-dark-900` → `bg-white dark:bg-dark-900`
- `bg-dark-800` → `bg-gray-50 dark:bg-dark-800`
- `bg-dark-700` → `bg-gray-200 dark:bg-dark-700`
- `text-white` → `text-gray-900 dark:text-white`
- `text-dark-400` → `text-gray-600 dark:text-dark-400`
- `text-dark-300` → `text-gray-700 dark:text-dark-300`
- `border-dark-700` → `border-gray-200 dark:border-dark-700`
- `border-dark-600` → `border-gray-300 dark:border-dark-600`

### Этап 3: Главная страница дашборда (60 мин)
**Файлы:**
- `app/dashboard-v2/page.tsx`
- `components/dashboard-v2/NetWorthHero.tsx`
- `components/dashboard-v2/AddFundsModal.tsx`

**Действия:**
1. Обновить все карточки, используя паттерн light/dark
2. Фоновые градиенты: сделать полупрозрачными для обеих тем
3. Borders: светлые для light, темные для dark
4. Toaster: адаптировать под обе темы

### Этап 4: Страницы бота (90 мин)
**Файлы:**
- `app/dashboard-v2/bots/page.tsx` (marketplace)
- `app/dashboard-v2/bots/[slug]/page.tsx` (детали бота)
- `app/dashboard-v2/bots/compare/page.tsx`
- `app/dashboard-v2/copy-bots/page.tsx`
- `components/dashboard-v2/BotCarousel.tsx`

**Действия:**
1. Карточки ботов: белый фон в light mode
2. Бейджи (Low/Medium/High Risk): сохранить яркие цвета, адаптировать контрастность
3. Графики и статистика: использовать серый для light, белый для dark

### Этап 5: Копирование и детали (90 мин)
**Файлы:**
- `app/dashboard-v2/copy/[copyId]/page.tsx`
- `app/dashboard-v2/copy/[copyId]/archive/page.tsx`
- `components/dashboard-v2/BotSettingsModal.tsx`
- `components/dashboard-v2/CompoundingSettingsModal.tsx`
- `components/dashboard-v2/RiskMetricsCard.tsx`
- `components/dashboard-v2/RiskMetricsPreview.tsx`
- `components/dashboard-v2/ClosedTradesActivity.tsx`

**Действия:**
1. Модальные окна: белый фон для light, темный для dark
2. Таблицы: чередующиеся строки с серым/белым
3. Графики P&L: сохранить зеленый/красный, адаптировать фон

### Этап 6: Остальные страницы (60 мин)
**Файлы:**
- `app/dashboard-v2/analytics/page.tsx`
- `app/dashboard-v2/wallets/page.tsx`
- `app/dashboard-v2/wallets/withdraw/page.tsx`
- `app/dashboard-v2/quick-start/page.tsx`
- `app/dashboard-v2/feed/page.tsx`
- `app/dashboard-v2/leaderboard/page.tsx`
- `app/dashboard-v2/referrals/page.tsx`
- `app/dashboard-v2/traders/[username]/page.tsx`
- `app/dashboard-v2/notifications/page.tsx`
- `app/dashboard-v2/whales/page.tsx`

**Действия:**
1. Применить единый паттерн light/dark ко всем страницам
2. Особое внимание к графикам и таблицам
3. Адаптировать формы и инпуты

### Этап 7: Quick Start компоненты (30 мин)
**Файлы:**
- `components/dashboard-v2/quick-start/StepAmount.tsx`
- `components/dashboard-v2/quick-start/StepHorizon.tsx`
- `components/dashboard-v2/quick-start/StepResults.tsx`
- `components/dashboard-v2/quick-start/StepRisk.tsx`

## Цветовая палитра

### Light Mode
- **Фон основной:** `bg-white`
- **Фон вторичный:** `bg-gray-50`
- **Фон карточек:** `bg-white` с `border-gray-200`
- **Текст основной:** `text-gray-900`
- **Текст вторичный:** `text-gray-600`
- **Текст tertiary:** `text-gray-500`
- **Borders:** `border-gray-200`, `border-gray-300`

### Dark Mode
- **Фон основной:** `bg-dark-900`
- **Фон вторичный:** `bg-dark-800`
- **Фон карточек:** `bg-dark-800/95` с `border-dark-700`
- **Текст основной:** `text-white`
- **Текст вторичный:** `text-dark-400`
- **Текст tertiary:** `text-dark-300`
- **Borders:** `border-dark-700`, `border-dark-600`

### Акцентные цвета (одинаковые для обеих тем)
- **Primary:** `text-primary-400`, `bg-primary-500`
- **Success:** `text-green-400`, `bg-green-500`
- **Error:** `text-red-400`, `bg-red-500`
- **Warning:** `text-yellow-400`, `bg-yellow-500`

## Особенности

### 1. Фоновые анимированные блобы (layout.tsx)
```tsx
// Dark mode: primary-500/10, accent-500/10
// Light mode: primary-500/5, accent-500/5 (менее яркие)
```

### 2. Gradient borders (карточки)
```tsx
// Dark mode: rgba(255,255,255,0.20) → rgba(255,255,255,0.04)
// Light mode: rgba(0,0,0,0.08) → rgba(0,0,0,0.02)
```

### 3. Hover effects
Сохранить существующие, но адаптировать прозрачность:
- Light: `hover:bg-gray-100`
- Dark: `hover:bg-white/10`

### 4. Toast notifications (react-hot-toast)
```tsx
// Light: background: '#ffffff', color: '#111827', border: '#e5e7eb'
// Dark: background: '#1a1a2e', color: '#fff', border: '#2d2d44'
```

## Тестирование

После каждого этапа проверить:
1. ✅ Переключение темы работает
2. ✅ Тема сохраняется при перезагрузке
3. ✅ Все элементы читаемы в обеих темах
4. ✅ Контраст соответствует WCAG AA (как в презентационной части)
5. ✅ Анимации работают корректно
6. ✅ Нет артефактов при переключении темы

## Время выполнения
**Общее:** ~6 часов
- Этап 1: 30 мин
- Этап 2: 45 мин
- Этап 3: 60 мин
- Этап 4: 90 мин
- Этап 5: 90 мин
- Этап 6: 60 мин
- Этап 7: 30 мин
- Тестирование: 30 мин

## Начало работы
После подтверждения плана начну с Этапа 1 (инфраструктура темы).
