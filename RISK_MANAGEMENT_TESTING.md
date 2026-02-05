# Risk Management System - Manual Testing Guide

## ✅ Что реализовано

1. **DynamicPnLCalculator** (`lib/trading/DynamicPnLCalculator.ts`)
   - Математически точные P&L диапазоны
   - Учитывает leverage в формулах
   - Автокоррекция при превышении daily target
   - 80/20 tight/wide variance для реализма

2. **MarketFrictionSimulator** (`lib/trading/MarketFrictionSimulator.ts`)
   - Slippage: -0.05% до -0.3%
   - Spread: -0.02% до -0.12%
   - Funding rate: ±0.01%
   - Commission: -0.05%
   - Total: 0.2-0.4% реалистичные затраты

3. **StaggeredClosingManager** (`lib/trading/StaggeredClosingManager.ts`)
   - Предотвращает одновременное закрытие >2 позиций за 30s
   - Добавляет задержки 3-15s между закрытиями
   - Плавный и реалистичный график

## 🧪 Как проверить работу системы

### Метод 1: Через браузер (рекомендуется)

1. **Запустить dev server:**
   ```bash
   npm run dev
   ```

2. **Открыть браузер:**
   - Перейти на http://localhost:3000/dashboard-v2

3. **Открыть Developer Console** (F12)

4. **Открыть любую bot details page:**
   - Нажать на любого бота в Marketplace
   - Или перейти на `/dashboard-v2/bots/[bot-slug]`

5. **Что смотреть:**

   **Логирование убрано для чистоты консоли.**

   Система работает в "тихом" режиме - данные сохраняются но не логируются.

   Для проверки используй методы ниже (localStorage или Trade objects).

6. **Проверить Trades:**
   - Прокрутить вниз до "Recent Trades"
   - Каждая сделка теперь должна иметь:
     - `marketFriction` объект с компонентами
     - Более реалистичные P&L значения

### Метод 2: Через localStorage

1. Открыть Console (F12)

2. Проверить последние trades:
   ```javascript
   // Получить все боты
   const bots = JSON.parse(localStorage.getItem('bots') || '{}');
   const botId = Object.keys(bots)[0];

   // Получить trades первого бота
   const trades = JSON.parse(localStorage.getItem(`bot_trades_${botId}`) || '[]');

   // Проверить последнюю сделку
   console.log('Last trade:', trades[0]);

   // Должно быть поле marketFriction:
   // {
   //   slippage: -0.123,
   //   spread: -0.045,
   //   fundingRate: -0.008,
   //   commission: -0.050,
   //   total: -0.226
   // }
   ```

3. Проверить Staggered Closing state:
   ```javascript
   // Посмотреть недавние закрытия
   const staggered = JSON.parse(localStorage.getItem(`bot_staggered_${botId}`) || '{}');
   console.log('Recent closures:', staggered.recentClosures);
   ```

### Метод 3: Через Admin Panel

1. Перейти на `/dashboard-v2/admin/bots`

2. Открыть Edit для любого бота

3. В консоли после сохранения должны появляться логи:
   - DailyTargetController обновления
   - Validation конфигурации
   - P&L range calculations

## 🔍 Что проверять

### ✅ DynamicPnLCalculator

**Признаки работы:**
- [ ] Win/Loss P&L более вариативные (не фиксированные значения)
- [ ] 80% сделок с tight range, 20% с wide (большие "прыжки")
- [ ] При превышении daily target появляются коррекции
- [ ] Console logs содержат "P&L Correction Applied"

**Как проверить математику:**
1. Открыть Console
2. Выполнить:
   ```javascript
   import { dynamicPnLCalculator } from './lib/trading/DynamicPnLCalculator';

   const range = dynamicPnLCalculator.calculatePnLRange({
     dailyTargetPercent: 4.5,
     tradesPerDay: 8,
     winRate: 0.65,
     leverageMin: 10,
     leverageMax: 15,
     currentDailyPnL: 0,
     tradesRemainingToday: 8,
   });

   console.log('P&L Range:', range);
   // Должно вернуть winMin, winMax, lossMin, lossMax, mode
   ```

### ✅ MarketFrictionSimulator

**Признаки работы:**
- [ ] Каждая сделка имеет поле `marketFriction` в Trade объекте
- [ ] Total friction ~0.2-0.4%
- [ ] P&L уменьшается на величину friction
- [ ] Console logs содержат "Market friction applied"

**Как проверить:**
1. Открыть любую bot details page
2. Подождать пока закроется сделка
3. В консоли должно быть:
   ```
   💸 Market friction applied: 5.23% → 4.98% (-0.250%)
   ```

### ✅ StaggeredClosingManager

**Признаки работы:**
- [ ] Позиции не закрываются одновременно (max 2 за 30s)
- [ ] График P&L плавный, без "ступенек"
- [ ] Console logs содержат "scheduled to close in Xs"
- [ ] localStorage содержит `bot_staggered_{botId}` с recentClosures

**Как проверить:**
1. Открыть bot details page с 3+ открытыми позициями
2. Подождать пока они начнут закрываться
3. Если несколько позиций должны закрыться одновременно:
   - Первая закроется сразу
   - Вторая закроется через 3-8s
   - Третья закроется через 8-15s после первой

## 📊 Expected Results

### Daily Target Convergence

При правильной работе:
- Daily P&L должен сходиться к target ±10%
- Win rate должен соответствовать config (±5%)
- Avg win/loss ratio соответствует risk-reward

### Реалистичность

- Trades имеют realistic friction costs
- График не имеет резких "ступенек" от одновременных закрытий
- P&L variance делает график "живым" (80% smooth, 20% spiky)

## 🐛 Troubleshooting

### Проблема: Логи не появляются

**Решение:**
- Убедись что открыт bot details page (не dashboard)
- Refresh страницу
- Очисти localStorage и перезагрузи

### Проблема: Сделки закрываются одновременно

**Решение:**
- Проверь что StaggeredClosingManager загружается:
  ```javascript
  // Console:
  const bot = window.bots[0]; // Или как ты получаешь бота
  console.log(bot.staggeredClosingManager);
  // Должен быть объект, не undefined
  ```

### Проблема: marketFriction всегда одинаковый

**Решение:**
- Это нормально - friction имеет небольшую случайную вариацию
- Проверь что разные trading pairs имеют разные spreads
- BTC/ETH должны иметь меньше spread чем altcoins

## 🎯 Success Criteria

Система работает правильно если:

✅ **DynamicPnLCalculator:**
- P&L ranges динамические (меняются)
- Появляются коррекции при превышении target
- Validation проходит без ошибок

✅ **MarketFrictionSimulator:**
- Все trades имеют marketFriction
- Total friction 0.2-0.4%
- P&L уменьшается после применения friction

✅ **StaggeredClosingManager:**
- Max 2 закрытия за 30s
- График плавный
- localStorage содержит recentClosures

✅ **Integration:**
- Боты работают без ошибок
- Daily target сходится
- Win rate соответствует config
- Нет console errors

## 📝 Summary

**Реализованные features:**
1. ✅ Dynamic P&L calculation с leverage
2. ✅ Auto-correction при превышении daily target
3. ✅ Market friction (slippage, spread, funding, commission)
4. ✅ Staggered position closing
5. ✅ 80/20 tight/wide variance
6. ✅ Instance-per-bot для StaggeredClosingManager

**Integration points:**
- `TradingBot.tryOpenNewPosition()` - DynamicPnLCalculator
- `TradingBot.closePosition()` - MarketFrictionSimulator
- `TradingBot.managePositions()` - StaggeredClosingManager

**Storage:**
- `bot_staggered_{botId}` - StaggeredClosingManager state
- `bot_trades_{botId}` - Trades с marketFriction data
- `bot_positions_{botId}` - Positions с pnlRange и scheduledCloseAt
