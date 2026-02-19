# Celestian Marketplace — Bot Types & Architecture

## Vision

Marketplace where every bot feels like a **real trader with unique personality and strategy**.
Investor chooses not just "risk level" but a complete trading philosophy — and sees the difference
in real-time equity curves, trade frequency, position sizes, and daily behavior.

The convergence system (6 layers) ensures each bot hits its targets while maintaining
visual authenticity. Different parameter combinations create genuinely different "trading characters".

---

## System Capabilities (Parameter Space)

Each bot is configured by 25+ parameters. The key axes that create perceptible differences:

| Axis | Range | What Investor Sees |
|------|-------|--------------------|
| tradesPerDay | 1-50+ | Activity level (notifications, chart updates) |
| leverage | 1x-125x | Position P&L volatility |
| dailyTargetPercent | 0.1-3.0% | Daily growth speed |
| maxConcurrentPositions | 1-10 | Diversification |
| positionSize | 1-35% of capital | Concentration risk |
| allowedSides | LONG / SHORT / BOTH | Market flexibility |
| winRate | 55-95% | Win/loss pattern |
| pnlVariance | tight:wide ratio | Equity curve smoothness |
| minDuration / maxDuration | seconds-hours | How long positions stay open |
| character | conservative / moderate / aggressive | Personality behavior |
| volatility | low / medium / high | Intraday fluctuations |

**Planned additions:**
- weeklyTargetPercent — weekly convergence (allows multi-day positions)
- intradayShocks — controlled sharp drawdowns/pumps within a day
- marketRegime — different behavior in bull/bear/sideways

---

## Bot Classification: 5 Categories, 15 Types

### Category Overview

| # | Category | Types | Risk Range | Investor Profile |
|---|----------|-------|------------|-----------------|
| 1 | Scalpers | 3 | Low-Medium | Want to see constant activity |
| 2 | Day Traders | 3 | Medium-High | Want daily results |
| 3 | Swing Traders | 3 | Medium-High | Patient, understand multi-day cycles |
| 4 | Specialized | 3 | Low-Medium | Want specific strategy logic |
| 5 | Premium | 3 | All | High capital, maximum returns |

---

## Category 1: SCALPERS

> **Identity:** Many small trades, fast results, constant activity.
> Investor opens the app and always sees something happening.

### 1.1 Micro Scalper — "The Ant"

**Philosophy:** Many tiny trades, extreme consistency. Like a savings account on steroids.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 30-50 | High frequency = smooth equity curve |
| leverage | 3-5x | Low leverage = low per-trade risk |
| dailyTargetPercent | 0.3-0.8% | ~9-24% monthly |
| maxConcurrentPositions | 3-5 | Several small positions always open |
| positionSize | 3-5% | Small, distributed |
| allowedSides | BOTH | Trades both directions |
| winRate | 85-90% | Mostly wins, rare small losses |
| pnlVariance | 90% tight / 10% wide | Very smooth curve |
| minDuration | 30s | Quick trades |
| maxDuration | 10min | Never holds long |
| character | conservative | Careful, disciplined |
| volatility | low | Minimal fluctuations |
| **Min investment** | **$100** | |
| **Lock-up** | **14 days** | |
| **Platform fee** | **2.0%** | |

**Equity curve character:** Almost straight line up with tiny wiggles.
**Best market:** Any — works in all conditions.
**Worst scenario:** Extreme volatility (spread widens, slippage eats profit).

---

### 1.2 Aggressive Scalper — "The Shark"

**Philosophy:** Same high frequency but with leverage. Higher reward, sharper teeth.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 20-40 | Slightly less than Micro but bigger |
| leverage | 10-20x | Aggressive leverage |
| dailyTargetPercent | 0.5-1.5% | ~15-45% monthly |
| maxConcurrentPositions | 2-4 | Fewer but larger |
| positionSize | 5-8% | Medium concentration |
| allowedSides | BOTH | Bidirectional |
| winRate | 78-84% | Lower WR, bigger wins |
| pnlVariance | 75% tight / 25% wide | Some noticeable swings |
| minDuration | 20s | Very fast |
| maxDuration | 15min | Quick exits |
| character | aggressive | Bold entries |
| volatility | medium | Visible ups and downs |
| **Min investment** | **$250** | |
| **Lock-up** | **14 days** | |
| **Platform fee** | **2.0%** | |

**Equity curve character:** Staircase pattern — flat periods, then quick jumps.
**Best market:** Volatile trending days.
**Worst scenario:** Dead sideways market with no movement.

---

### 1.3 Sniper Scalper — "The Sniper"

**Philosophy:** Few but precise high-conviction scalps. Quality over quantity.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 10-18 | Selective entries only |
| leverage | 15-25x | High leverage per trade |
| dailyTargetPercent | 0.8-2.0% | ~24-60% monthly |
| maxConcurrentPositions | 1-2 | Concentrated |
| positionSize | 10-15% | Big positions |
| allowedSides | BOTH | Waits for clear direction |
| winRate | 72-80% | Lower WR but big wins |
| pnlVariance | 65% tight / 35% wide | Noticeable variance |
| minDuration | 1min | Slightly longer holds |
| maxDuration | 20min | Lets winners run |
| character | moderate | Patient but decisive |
| volatility | medium-high | Sharp moves visible |
| **Min investment** | **$500** | |
| **Lock-up** | **21 day** | |
| **Platform fee** | **1.8%** | |

**Equity curve character:** Periods of nothing, then sharp up-moves. Occasional visible dips.
**Best market:** Clear intraday trends.
**Worst scenario:** Choppy, no-trend market.

---

## Category 2: DAY TRADERS

> **Identity:** Moderate frequency, closes everything by end of day.
> Investor checks results once per evening and sees clear daily progress.

### 2.1 Balanced Day Trader — "The Professional"

**Philosophy:** Textbook day trading. Consistent, methodical, no surprises.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 8-15 | Moderate activity |
| leverage | 5-10x | Balanced risk |
| dailyTargetPercent | 0.5-1.2% | ~15-36% monthly |
| maxConcurrentPositions | 2-4 | Diversified intraday |
| positionSize | 8-12% | Medium size |
| allowedSides | BOTH | Flexible |
| winRate | 75-82% | Solid win rate |
| pnlVariance | 80% tight / 20% wide | Mostly smooth |
| minDuration | 5min | Holds positions |
| maxDuration | 2hr | Reasonable duration |
| character | moderate | Balanced personality |
| volatility | medium | Natural variation |
| **Min investment** | **$500** | |
| **Lock-up** | **30 days** | |
| **Platform fee** | **1.8%** | |

**Equity curve character:** Steady upward slope with natural daily variance.
**Best market:** Regular trending days (most common).
**Worst scenario:** Flash crashes (but recovers within days).

---

### 2.2 Momentum Trader — "The Wave Rider"

**Philosophy:** Catches momentum bursts. Quiet until the move, then aggressive.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 5-12 | Clustered around momentum events |
| leverage | 10-20x | Strong leverage on conviction |
| dailyTargetPercent | 0.8-2.0% | ~24-60% monthly |
| maxConcurrentPositions | 2-3 | Quick stacking on momentum |
| positionSize | 10-18% | Significant per trade |
| allowedSides | BOTH | Rides both directions |
| winRate | 68-76% | Lower WR, larger wins |
| pnlVariance | 60% tight / 40% wide | Visible variance |
| minDuration | 2min | Quick on some |
| maxDuration | 1hr | Rides the wave |
| character | aggressive | Bold, decisive |
| volatility | high | Big swings intraday |
| **Min investment** | **$750** | |
| **Lock-up** | **30 days** | |
| **Platform fee** | **1.5%** | |

**Equity curve character:** Flat, flat, flat... JUMP. Flat, flat... JUMP. Irregular but upward.
**Best market:** News-driven volatile days.
**Worst scenario:** Dead weekends, low-volume sessions.

---

### 2.3 Volatility Hunter — "The Storm Chaser"

**Philosophy:** Profits from chaos. The wilder the market, the better.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 5-10 | Fewer but explosive |
| leverage | 20-35x | High leverage |
| dailyTargetPercent | 1.0-2.5% | ~30-75% monthly |
| maxConcurrentPositions | 1-2 | Concentrated bets |
| positionSize | 12-20% | Large positions |
| allowedSides | BOTH | Catches both directions |
| winRate | 62-72% | Lower WR, big payoffs |
| pnlVariance | 50% tight / 50% wide | Maximum visible variance |
| minDuration | 30s | Flash trades possible |
| maxDuration | 45min | Rides volatility |
| character | aggressive | Thrives on chaos |
| volatility | high | Sharp intraday swings |
| **Min investment** | **$1,000** | |
| **Lock-up** | **30 days** | |
| **Platform fee** | **1.5%** | |

**Equity curve character:** Roller coaster. Big dips, bigger recoveries. Not for the faint-hearted.
**Best market:** CPI releases, FOMC, liquidation cascades.
**Worst scenario:** Stable boring market.

---

## Category 3: SWING TRADERS

> **Identity:** Fewer trades, longer holds, bigger moves.
> Investor trusts the process and checks weekly, not hourly.

### 3.1 Conservative Swing — "The Farmer"

**Philosophy:** Plant seeds, wait, harvest. Slow and steady.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 2-4 | Few deliberate trades |
| leverage | 2-5x | Conservative leverage |
| dailyTargetPercent | 0.3-0.8% | ~9-24% monthly |
| maxConcurrentPositions | 2-4 | Multiple positions held |
| positionSize | 15-20% | Significant allocation |
| allowedSides | LONG-biased (70/30) | Mostly long, some hedges |
| winRate | 70-78% | Solid |
| pnlVariance | 85% tight / 15% wide | Very smooth |
| minDuration | 30min | Holds positions |
| maxDuration | 8hr | Extended holds |
| character | conservative | Patient, methodical |
| volatility | low | Calm equity curve |
| **Min investment** | **$1,000** | |
| **Lock-up** | **60 days** | |
| **Platform fee** | **1.5%** | |

**Equity curve character:** Gentle upward curve with minimal noise. "Boring" in the best way.
**Best market:** Stable uptrend.
**Worst scenario:** Sharp bear market reversal.

---

### 3.2 Growth Swing — "The Builder"

**Philosophy:** Bigger moves, bigger ambitions. Accepts drawdowns for growth.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 3-6 | Moderate activity |
| leverage | 5-15x | Medium-high leverage |
| dailyTargetPercent | 0.8-1.8% | ~24-54% monthly |
| maxConcurrentPositions | 2-5 | Building positions |
| positionSize | 15-25% | Large allocations |
| allowedSides | BOTH | Flexible direction |
| winRate | 65-75% | Accepts more losses |
| pnlVariance | 70% tight / 30% wide | Moderate variance |
| minDuration | 15min | Medium holds |
| maxDuration | 6hr | Longer holds |
| character | moderate-aggressive | Growth-oriented |
| volatility | medium-high | Visible swings |
| **Min investment** | **$2,000** | |
| **Lock-up** | **60 days** | |
| **Platform fee** | **1.2%** | |

**Equity curve character:** Strong upward trend with noticeable pullbacks. Two steps forward, one step back.
**Best market:** Trending markets (bull or bear).
**Worst scenario:** Extended choppy sideways.

---

### 3.3 Breakout Hunter — "The Ambush Predator"

**Philosophy:** Waits for breakout, strikes hard. Long periods of nothing, then explosion.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 1-4 (some days 0) | Extremely selective |
| leverage | 15-30x | Max leverage on conviction |
| dailyTargetPercent | 1.0-3.0% (uneven) | ~30-90% monthly (highly variable) |
| maxConcurrentPositions | 1-2 | All-in on breakout |
| positionSize | 20-30% | Concentrated |
| allowedSides | BOTH | Catches both break-up and break-down |
| winRate | 58-68% | Lower WR, huge wins |
| pnlVariance | 40% tight / 60% wide | Maximum variance |
| minDuration | 5min | Quick if wrong |
| maxDuration | 4hr | Rides breakouts |
| character | aggressive | Explosive entries |
| volatility | high | Sharp equity moves |
| **Min investment** | **$1,500** | |
| **Lock-up** | **60 days** | |
| **Platform fee** | **1.2%** | |

**Equity curve character:** Flat... flat... flat... SPIKE. Flat... DIP... SPIKE SPIKE. Dramatic.
**Best market:** Range-then-breakout patterns.
**Worst scenario:** False breakouts, whipsaw market.

---

## Category 4: SPECIALIZED STRATEGIES

> **Identity:** Specific trading logic that's recognizable and educationally interesting.
> Investor chooses because they understand and believe in the strategy concept.

### 4.1 Grid Bot — "The Machine"

**Philosophy:** Place buy/sell orders at fixed intervals. Profit from any movement within range.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 15-30 | Many grid fills |
| leverage | 2-3x | Low leverage |
| dailyTargetPercent | 0.2-0.5% | ~6-15% monthly |
| maxConcurrentPositions | 5-10 | Full grid active |
| positionSize | 3-5% per grid level | Distributed |
| allowedSides | BOTH | Buy low, sell high automatically |
| winRate | 88-94% | Very high WR, tiny profits |
| pnlVariance | 95% tight / 5% wide | Ultra-smooth |
| minDuration | 1min | Quick fills |
| maxDuration | 30min | Grid cycles |
| character | conservative | Mechanical, no emotion |
| volatility | low | Minimal fluctuation |
| **Min investment** | **$500** | |
| **Lock-up** | **30 days** | |
| **Platform fee** | **1.8%** | |

**Equity curve character:** Almost perfectly straight line up. The most boring, most consistent.
**Best market:** Sideways / ranging market.
**Worst scenario:** Strong breakout in one direction (grid gets one-sided).

---

### 4.2 DCA Accumulator — "The Turtle"

**Philosophy:** Systematic buying. Lowest risk, longest horizon. "Crypto savings account."

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 1-3 | Minimal activity |
| leverage | 1x | No leverage at all |
| dailyTargetPercent | 0.1-0.3% | ~3-9% monthly |
| maxConcurrentPositions | 1-2 | Simple |
| positionSize | 10-20% | Standard buys |
| allowedSides | LONG only | Only buys |
| winRate | 90-95% | Almost always "wins" (buys dips) |
| pnlVariance | 95% tight / 5% wide | Near-zero variance |
| minDuration | 10min | Holds longer |
| maxDuration | 4hr | Patient |
| character | conservative | Ultra-conservative |
| volatility | low | Flattest possible curve |
| **Min investment** | **$100** | |
| **Lock-up** | **30 days** | |
| **Platform fee** | **2.0%** | |

**Equity curve character:** Barely visible upward slope. Like watching grass grow, but it grows.
**Best market:** Any (DCA works everywhere over time).
**Worst scenario:** Extended bear market (still accumulates, just slower growth).

---

### 4.3 Market Neutral / Hedged — "The Diplomat"

**Philosophy:** Long and short simultaneously. Profits from spread, not direction.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 6-12 | Moderate (pairs of trades) |
| leverage | 3-5x per side | Moderate but doubled (long+short) |
| dailyTargetPercent | 0.3-0.8% | ~9-24% monthly |
| maxConcurrentPositions | 4-8 | Always balanced |
| positionSize | 8-12% | Distributed across legs |
| allowedSides | BOTH (balanced) | Equal long/short exposure |
| winRate | 78-85% | Hedging reduces losses |
| pnlVariance | 85% tight / 15% wide | Smooth |
| minDuration | 5min | Medium holds |
| maxDuration | 2hr | Position pairs |
| character | moderate | Calculated, balanced |
| volatility | low | Hedging dampens swings |
| **Min investment** | **$2,000** | |
| **Lock-up** | **60 days** | |
| **Platform fee** | **1.5%** | |

**Equity curve character:** Very smooth upward. Crashes barely affect it. Uncorrelated with market.
**Best market:** Any — that's the point.
**Worst scenario:** Extreme correlation breakdown (both legs lose simultaneously).

---

## Category 5: PREMIUM

> **Identity:** High minimum, exclusive access, best conditions.
> For investors who want maximum returns and are willing to commit capital and time.

### 5.1 Multi-Strategy — "The Architect"

**Philosophy:** Combines scalping + swing + trend. Diversified across strategies, not just assets.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 12-25 | Mix of frequencies |
| leverage | 5-15x (adaptive) | Varies by sub-strategy |
| dailyTargetPercent | 1.0-2.0% | ~30-60% monthly |
| maxConcurrentPositions | 5-8 | Multiple strategies running |
| positionSize | 5-15% | Distributed |
| allowedSides | BOTH | Full flexibility |
| winRate | 72-80% | Blended across strategies |
| pnlVariance | 70% tight / 30% wide | Moderate variance (smoothed by diversification) |
| minDuration | 30s-30min (mixed) | Strategy-dependent |
| maxDuration | 4hr | Caps individual trades |
| character | moderate-aggressive | Adaptive personality |
| volatility | medium | Smoothed by mix |
| **Min investment** | **$10,000** | |
| **Lock-up** | **90 days** | |
| **Platform fee** | **1.0%** | |

**Equity curve character:** Steady upward with moderate noise. Feels "institutional" — no wild swings, no boring flatline.
**Best market:** Any — diversification handles regime changes.
**Worst scenario:** Black swan event (all strategies correlate to downside).

---

### 5.2 Alpha Generator — "The Predator"

**Philosophy:** Maximum returns, high risk tolerance. For experienced investors who can stomach drawdowns.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 5-12 | Selective high-conviction |
| leverage | 20-50x | Aggressive leverage |
| dailyTargetPercent | 1.5-3.0% | ~45-90% monthly |
| maxConcurrentPositions | 2-4 | Concentrated |
| positionSize | 15-25% | Large positions |
| allowedSides | BOTH | Aggressive both ways |
| winRate | 60-70% | Lower WR, massive wins |
| pnlVariance | 50% tight / 50% wide | High variance |
| minDuration | 1min | Quick exits if wrong |
| maxDuration | 2hr | Rides big moves |
| character | aggressive | Maximum aggression |
| volatility | high | Wild swings expected |
| **Min investment** | **$10,000** | |
| **Lock-up** | **90 days** | |
| **Platform fee** | **1.0%** | |

**Equity curve character:** Sharp up, sharp down, sharper up. Net strongly positive. Adrenaline chart.
**Best market:** High-volatility trending market.
**Worst scenario:** Unexpected reversal at max leverage.

---

### 5.3 Institutional — "The Whale"

**Philosophy:** Large capital, patient execution, premium service. VIP-only access.

| Parameter | Value | Why |
|-----------|-------|-----|
| tradesPerDay | 8-18 | Balanced frequency |
| leverage | 5-20x | Adaptive to conditions |
| dailyTargetPercent | 1.2-2.5% | ~36-75% monthly |
| maxConcurrentPositions | 4-8 | Portfolio approach |
| positionSize | 8-18% | Diversified |
| allowedSides | BOTH | Full market access |
| winRate | 70-78% | Solid institutional WR |
| pnlVariance | 65% tight / 35% wide | Controlled variance |
| minDuration | 2min-15min | Mixed duration |
| maxDuration | 4hr | Institutional patience |
| character | moderate | Professional, disciplined |
| volatility | medium | Controlled |
| **Min investment** | **$25,000** | |
| **Lock-up** | **180 days** | |
| **Platform fee** | **0.8%** | |

**Equity curve character:** Smooth, confident upward trajectory. Like a well-managed hedge fund.
**Best market:** All conditions (adaptive allocation).
**Worst scenario:** Systemic market crash (even hedges fail).

---

## Summary Table

| # | Bot Name | Category | Trades/Day | Leverage | Daily Target | WR | Min Invest | Lock-up | Fee |
|---|----------|----------|------------|----------|-------------|-----|------------|---------|-----|
| 1 | Micro Scalper | Scalper | 30-50 | 3-5x | 0.3-0.8% | 85-90% | $100 | 14d | 2.0% |
| 2 | Aggressive Scalper | Scalper | 20-40 | 10-20x | 0.5-1.5% | 78-84% | $250 | 14d | 2.0% |
| 3 | Sniper Scalper | Scalper | 10-18 | 15-25x | 0.8-2.0% | 72-80% | $500 | 21d | 1.8% |
| 4 | Balanced Day Trader | Day Trader | 8-15 | 5-10x | 0.5-1.2% | 75-82% | $500 | 30d | 1.8% |
| 5 | Momentum Trader | Day Trader | 5-12 | 10-20x | 0.8-2.0% | 68-76% | $750 | 30d | 1.5% |
| 6 | Volatility Hunter | Day Trader | 5-10 | 20-35x | 1.0-2.5% | 62-72% | $1,000 | 30d | 1.5% |
| 7 | Conservative Swing | Swing | 2-4 | 2-5x | 0.3-0.8% | 70-78% | $1,000 | 60d | 1.5% |
| 8 | Growth Swing | Swing | 3-6 | 5-15x | 0.8-1.8% | 65-75% | $2,000 | 60d | 1.2% |
| 9 | Breakout Hunter | Swing | 1-4 | 15-30x | 1.0-3.0% | 58-68% | $1,500 | 60d | 1.2% |
| 10 | Grid Bot | Specialized | 15-30 | 2-3x | 0.2-0.5% | 88-94% | $500 | 30d | 1.8% |
| 11 | DCA Accumulator | Specialized | 1-3 | 1x | 0.1-0.3% | 90-95% | $100 | 30d | 2.0% |
| 12 | Market Neutral | Specialized | 6-12 | 3-5x | 0.3-0.8% | 78-85% | $2,000 | 60d | 1.5% |
| 13 | Multi-Strategy | Premium | 12-25 | 5-15x | 1.0-2.0% | 72-80% | $10,000 | 90d | 1.0% |
| 14 | Alpha Generator | Premium | 5-12 | 20-50x | 1.5-3.0% | 60-70% | $10,000 | 90d | 1.0% |
| 15 | Institutional | Premium | 8-18 | 5-20x | 1.2-2.5% | 70-78% | $25,000 | 180d | 0.8% |

---

## Lock-up Architecture

### Replace Penalty System with Fixed Lock-ups

**Current system (deprecated):**
- 30-day universal lock-up
- 20% / 17% / 15% tiered penalty for early exit

**New system:**
- Fixed lock-up period per bot type (14d / 21d / 30d / 60d / 90d / 180d)
- NO early exit at all during lock-up (button disabled / greyed out)
- After lock-up: free to exit anytime, no penalty
- Lock-up period displayed prominently on bot card before investment

### Why Fixed Lock-up > Penalty

| Aspect | Penalty System | Fixed Lock-up |
|--------|---------------|---------------|
| UX Perception | Punitive ("they're taking my money") | Transparent ("I agreed to this") |
| Decision quality | Panic exits with penalty = regret | Can't panic exit = forced patience |
| Support load | "Why did you charge me 20%?" | No disputes — clear terms |
| Investor retention | Exit + negative review | Stay → see results → reinvest |
| Legal clarity | Grey area (is it a fee or fine?) | Clean contract: lock-up period |

### Lock-up Duration Logic

| Lock-up | Bot Types | Reasoning |
|---------|-----------|-----------|
| 14 days | Micro Scalper, Aggressive Scalper | Results visible in 3-5 days. Short lock-up = low barrier to enter |
| 21 days | Sniper Scalper | Slightly lower frequency needs more time |
| 30 days | Balanced DT, Momentum, Volatility Hunter, Grid, DCA | Standard month — enough to see daily pattern |
| 60 days | Conservative Swing, Growth Swing, Breakout, Market Neutral | Multi-day holds need 2+ months to demonstrate strategy |
| 90 days | Multi-Strategy, Alpha Generator | Complex strategies need a full quarter |
| 180 days | Institutional | Hedge fund standard. Commitment = access to best terms |

### Bonus for Longer Lock-up (Positive Incentive)

Investors who CHOOSE a longer lock-up tier get lower fees:

| Tier | Lock-up | Fee Discount |
|------|---------|-------------|
| Base | Default bot lock-up | Standard fee |
| Extended | 2x default | -15% fee |
| Committed | 3x default | -25% fee |

Example: Balanced Day Trader (30d default, 1.8% fee)
- 30d lock-up → 1.8% fee
- 60d lock-up → 1.53% fee
- 90d lock-up → 1.35% fee

---

## Marketplace UX

### Bot Card (What Investor Sees)

```
┌──────────────────────────────────────────┐
│  🦈 Aggressive Scalper                   │
│  ★★★★☆  4.2  |  2,847 copiers           │
│                                          │
│  ╭────────────────────────╮              │
│  │  📈 Equity Curve (30d) │              │
│  │  ~~~~/\~~~~~/\~~~~~↗   │              │
│  ╰────────────────────────╯              │
│                                          │
│  30d Return: +18.7%    Monthly: 12-45%   │
│  Win Rate: 81%         Trades/day: 28    │
│  Max DD: -8.2%         Leverage: 10-20x  │
│                                          │
│  🔒 Lock-up: 14 days                     │
│  💰 Min: $250                            │
│  📊 Risk: ██░░░  Medium                  │
│                                          │
│  [Copy This Bot]                         │
└──────────────────────────────────────────┘
```

### Filtering System

**Primary filters (tabs):**
- All Bots | Scalpers | Day Traders | Swing | Specialized | Premium

**Secondary filters (dropdowns/sliders):**
- Risk level: 1-5
- Min investment: $100-$25,000
- Lock-up: 14d-180d
- Monthly return: range slider
- Trades/day: 1-50+

**Sorting options:**
- Popular (most copiers)
- Highest return (30d)
- Lowest risk (max drawdown)
- Newest
- Highest win rate

### Bot Comparison

Side-by-side comparison of 2-3 bots:
- Overlay equity curves on same chart
- Parameter difference table
- Risk-adjusted return (Sharpe ratio)
- "Which one is right for you?" quiz link

### Bot Detail Page

- Full equity curve (7d / 30d / 90d / All time)
- Live open positions
- Recent trades list
- Monthly return breakdown (calendar heatmap)
- Drawdown chart
- Trade distribution (win/loss histogram)
- Copier growth chart
- Reviews & ratings
- Similar bots section

---

## Investor Journey & Retention Funnel

### Stage 1: Discovery (Day 0)

**Goal:** Low barrier entry, immediate engagement.

- New user sees marketplace
- Filtered by "Beginner Friendly" tag → shows DCA ($100) and Micro Scalper ($100)
- 14-30 day lock-up feels safe
- User invests $100 in Micro Scalper

### Stage 2: First Results (Day 1-14)

**Goal:** Build trust through visible results.

- Push notifications: "Your bot completed 43 trades today. +$2.40"
- Daily summary email with equity curve
- After 7 days: "Your bot has earned +$8.50 (+8.5%)"
- Social: "Share your results" button

### Stage 3: Graduation (Day 14-30)

**Goal:** Upsell to bigger investment or longer lock-up.

- Lock-up ends. Banner: "Your lock-up is complete! You're free to withdraw."
- But also: "Upgrade to Balanced Day Trader? 2x returns, only $500 min."
- Or: "Extend lock-up 60 more days → save 15% on fees"
- Historical data: "If you had invested $500 in Day Trader 90 days ago: +$247"

### Stage 4: Portfolio Building (Month 2-3)

**Goal:** Multi-bot diversification = higher retention.

- Suggestion: "Diversify your portfolio — add a Swing bot for stability"
- Portfolio view showing combined equity curve
- Auto-rebalance suggestions
- "Your portfolio Sharpe ratio: 2.1. Add Market Neutral to improve to 2.8"

### Stage 5: Premium Access (Month 3+)

**Goal:** Upgrade to premium tier.

- After 3 months of consistent investing → unlock Premium category
- "You've earned access to Multi-Strategy. Min $10,000, but projected +45%/mo"
- Exclusive badge on profile
- Priority support channel

### Stage 6: Whale Territory (Month 6+)

**Goal:** Maximum capital retention.

- Institutional bot invitation (by referral or capital threshold)
- Personal account manager (human or AI)
- Custom bot parameters (negotiate leverage, target, lock-up)
- Lowest fees (0.8%)

---

## Retention Mechanics Beyond Lock-up

### 1. Streak Bonuses
- 30 days of continuous investment → 0.1% fee reduction
- 90 days → 0.2% reduction
- 180 days → 0.3% reduction
- Resets if capital drops to $0

### 2. Loyalty Tiers
| Tier | Requirement | Benefit |
|------|------------|---------|
| Bronze | $100+ invested | Standard access |
| Silver | $1,000+ or 60 days | Unlock all bots, -5% fees |
| Gold | $5,000+ or 120 days | Premium bots, -15% fees, priority support |
| Platinum | $25,000+ or 180 days | Institutional access, -25% fees, custom bots |

### 3. Referral Multiplier
- Refer investor → 10% of their platform fees for 12 months
- Refer 5+ → bonus 5% on top
- Referral earnings compound with loyalty tier

### 4. Achievement System
- "First Trade" → badge
- "10-Bot Portfolio" → badge + fee discount
- "Survived a -15% Drawdown" → "Diamond Hands" badge
- "$10,000 Lifetime Profit" → "Five Figures Club"
- Badges visible on public profile → social proof

### 5. Seasonal / Limited Edition Bots
- "Bull Run Special" — available only during BTC uptrend
- "Halving Strategy" — launches 3 months before halving
- "Black Friday Bot" — limited 48hr access, lower min investment
- Creates urgency and FOMO
- Lock-up still applies (prevents pump-and-dump behavior)

### 6. Reinvestment Incentives
- Compound toggle: auto-reinvest profits into same bot
- "Profit Split": 50% compound, 50% to wallet
- Compounding investors get additional 0.1% fee reduction

---

## Revenue Model

### Revenue Streams Per Bot Type

| Source | Description | % of Revenue |
|--------|------------|-------------|
| Platform fee | 0.8-2.0% of invested capital (monthly) | 60% |
| Performance fee | 10-20% of profits (monthly) | 25% |
| Early unlock | Pay to unlock early (premium feature, optional) | 5% |
| Premium access | Monthly subscription for Premium category | 5% |
| Custom bots | Enterprise/whale custom configuration fee | 5% |

### Platform Fee Schedule

| Bot Category | Platform Fee | Performance Fee |
|-------------|-------------|----------------|
| Scalpers | 2.0% | 15% of profit |
| Day Traders | 1.5-1.8% | 15% of profit |
| Swing Traders | 1.2-1.5% | 12% of profit |
| Specialized | 1.5-2.0% | 12% of profit |
| Premium | 0.8-1.0% | 20% of profit |

Note: Higher performance fee on Premium compensates for lower platform fee.
Premium bots make more profit → 20% of more = more revenue.

### Revenue Per Investor Tier (Estimated)

| Tier | Avg Capital | Monthly Revenue/User |
|------|------------|---------------------|
| Bronze ($100) | $100-500 | $2-15 |
| Silver ($1,000) | $1,000-5,000 | $15-100 |
| Gold ($5,000) | $5,000-25,000 | $75-500 |
| Platinum ($25,000) | $25,000+ | $350+ |

---

## Risk Labels & Compliance

### Risk Score System (1-5)

| Score | Label | Max Drawdown | Leverage | Suitable For |
|-------|-------|-------------|----------|-------------|
| 1 | Very Low | <5% | 1-3x | Risk-averse, first-time investors |
| 2 | Low | 5-10% | 3-10x | Conservative investors |
| 3 | Medium | 10-20% | 10-20x | Experienced investors |
| 4 | High | 20-35% | 20-35x | Active traders, risk-tolerant |
| 5 | Very High | 35%+ | 35x+ | Professionals only |

### Bot Risk Scores

| Bot | Risk Score |
|-----|-----------|
| DCA Accumulator | ★☆☆☆☆ (1) |
| Micro Scalper | ★☆☆☆☆ (1) |
| Grid Bot | ★★☆☆☆ (2) |
| Conservative Swing | ★★☆☆☆ (2) |
| Market Neutral | ★★☆☆☆ (2) |
| Balanced Day Trader | ★★★☆☆ (3) |
| Aggressive Scalper | ★★★☆☆ (3) |
| Sniper Scalper | ★★★☆☆ (3) |
| Momentum Trader | ★★★★☆ (4) |
| Growth Swing | ★★★★☆ (4) |
| Multi-Strategy | ★★★★☆ (4) |
| Institutional | ★★★★☆ (4) |
| Breakout Hunter | ★★★★★ (5) |
| Volatility Hunter | ★★★★★ (5) |
| Alpha Generator | ★★★★★ (5) |

### Mandatory Disclaimers (Per Bot Card)

- "Past performance does not guarantee future results"
- "Maximum drawdown of X% means you could temporarily lose X% of your investment"
- "Lock-up period: you cannot withdraw for X days after investing"
- Risk acknowledgment checkbox before first investment

---

## Bot Differentiation Matrix

How each bot FEELS different to the investor:

| Dimension | Scalpers | Day Traders | Swing | Specialized | Premium |
|-----------|---------|------------|-------|-------------|---------|
| **Check frequency** | Every hour | Once/day | Every few days | Once/week | Once/month |
| **Notifications** | Many small wins | Daily summary | Position updates | Strategy updates | Portfolio report |
| **Equity curve** | Smooth line | Daily steps | Multi-day waves | Strategy-specific | Institutional smooth |
| **Emotional experience** | Dopamine (many wins) | Satisfaction (daily growth) | Patience (delayed gratification) | Intellectual (strategy logic) | Confidence (professional) |
| **Worst day** | -0.5% | -2% | -5% | Varies | -3% (diversified) |
| **Best day** | +1.5% | +3% | +8% | Varies | +4% |
| **Position duration** | Seconds-minutes | Minutes-hours | Hours-days | Strategy-dependent | Mixed |

---

## Expansion Roadmap

### Phase 1: Core 15 Bots (Current Plan)
- Implement all 15 bot types with distinct configurations
- Fixed lock-up system replacing penalty system
- Basic marketplace with filtering and sorting

### Phase 2: Personalization
- Risk questionnaire → recommended bot portfolio
- "Build Your Own" custom bot (mix parameters within bounds)
- Auto-portfolio: "Invest $5,000 and we'll distribute across 3-5 bots"

### Phase 3: Social Features
- Bot leaderboard (monthly competition)
- Copier reviews and ratings
- "Follow" a top investor's portfolio
- Public profiles with achievement badges

### Phase 4: Advanced Bots
- AI-adaptive bots (change strategy based on market regime)
- Multi-asset bots (BTC + ETH + SOL combined)
- Seasonal / event-based limited edition bots
- Community-created bots (governance token holders can propose parameters)

### Phase 5: Institutional
- API access for programmatic investing
- Custom bot configuration (negotiate parameters)
- Multi-sig wallet support
- Compliance reporting and tax documents
- White-label marketplace for partners
