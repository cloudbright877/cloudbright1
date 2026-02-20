# CLOUDBRIGHT Website Redesign — Content & UI Update Plan
## Crypto Copy Trading Bot Marketplace

---

## Company Facts

- **Brand**: CLOUDBRIGHT (official)
- **Legal entity**: HONG KONG CLOUD BRIGHT SOFTWARE LIMITED (HKCBS)
- **HQ**: Hong Kong
- **Team**: 40+ employees
- **Founded**: December 25, 2025
- **Launch**: ~February 2026
- **Product**: Bot marketplace + social copy trading platform
- **Revenue model**: Commission 1-2% on profit withdrawal
- **Tech stack**: Non-custodial, Web3, smart contracts, blockchain-based

---

## Product Reality (from dashboard-v2)

Dashboard-v2 is the **source of truth** for all product features and business logic.

**What the platform actually is:**
- **Bot Marketplace** — users browse, compare, and copy trading bots
- **Social Trading** — social features, community, shared strategies
- **Detailed Bot Analytics** — deep info on each bot (performance, trades, risk metrics)
- **Copy Trading** — users copy bot trades to their own exchange accounts
- **Non-custodial** — users keep funds on their own exchange (API keys, not deposits)

**What the platform is NOT:**
- ~~Staking plans with guaranteed daily returns~~ (old model, completely wrong)
- ~~$50/$2500/$10000 deposits with 2-3% daily~~ (remove)
- ~~Fund management~~ (non-custodial, company doesn't hold funds)
- ~~Investment calculator with promised returns~~ (remove)

---

## Target Audience

**Segment 1: "Passive Investor" (Primary — 45%)**
- Age: 30-50
- Profile: Working professionals, medium/high income
- Motivation: Passive income without learning trading
- Pain: No time for market analysis, fear of losses, distrust of "black boxes"
- Message: "Your portfolio on autopilot — professional strategies, zero effort"

**Segment 2: "Crypto Enthusiast" (Secondary — 30%)**
- Age: 25-40
- Profile: Already trades crypto (Binance, Bybit, OKX)
- Motivation: Strategy diversification, profit scaling
- Pain: Emotional trading, missed trades during sleep/work
- Message: "24/7 automation — algorithms don't sleep or panic"

**Segment 3: "Crypto Newcomer" (Tertiary — 25%)**
- Age: 25-45
- Profile: Heard about crypto, wants to start but fears complexity
- Motivation: Simple entry into crypto investing
- Pain: Doesn't understand terminology, fears scams
- Message: "Start in 5 minutes — no experience required"

---

## Key USPs

1. **Bot Marketplace** — browse, compare, pick the best trading bots (not manual trader following)
2. **Algorithmic, not emotional** — data-driven strategies with full transparency
3. **Non-custodial** — your funds stay on YOUR exchange. We never hold your crypto.
4. **Deep analytics** — every bot has detailed performance data, trade history, risk metrics
5. **Social trading** — community-driven insights and shared strategies
6. **1-click copy** — simplest onboarding in the industry
7. **Web3 native** — blockchain, smart contracts, audited security
8. **HK-based startup** — legitimate company, 40+ team, security audits passed

---

## Scope

### V1: Core 5 Pages (this iteration)

| Page | Current State | Action |
|------|--------------|--------|
| `/` (Homepage) | Exists but wrong content (staking plans, fake stats, calculator) | **Full rewrite** |
| `/about` | Exists but fake team, fake stats | **Full rewrite** with real company story |
| `/features` | Does NOT exist | **Create new** — bento grid of actual platform features |
| `/security` | Does NOT exist | **Create new** — Web3, non-custodial, smart contracts, audits |
| `/pricing` | Does NOT exist (old StakingPlans component is wrong) | **Create new** — commission model explanation |

### V2: Additional Pages (later)

| Page | Action |
|------|--------|
| `/how-it-works` | Step-by-step: Connect Exchange → Browse Bots → Copy → Earn |
| `/performance` | Rewrite to match real bot marketplace metrics |
| `/affiliate` | Rewrite with real affiliate program if exists |
| `/blog` | Update content to match actual product |
| `/contact` | Update with real contact info |
| `/legal/*` | Update legal pages (terms, privacy, risk-disclosure) |

### Pages to handle now:
- **Remove from navigation**: Performance, Affiliate (keep code, hide links)
- **Remove component**: Calculator (StakingPlans component — replace with bot marketplace preview)
- **Keep**: Blog, Contact, Register, Login, Legal pages (update later)

---

## Content Strategy

### Tone of Voice
- Confident but not aggressive
- Tech-forward but accessible
- Trustworthy (NEVER promise specific returns or percentages)
- Emphasis on automation, simplicity, transparency, Web3

### Content Rules
1. **NEVER** promise specific ROI, daily %, or guaranteed returns
2. **ALWAYS** use "past performance does not guarantee future results" disclaimers
3. **ALWAYS** include risk disclosure on pages with financial information
4. Use "potential", "historical", "up to" — never "guaranteed" or "earn X% daily"
5. Stats must be real or clearly labeled as projections

### About Page — Company Story Direction
- Founded December 2025 in Hong Kong
- 40+ team members
- Ambitious Web3 startup focused on democratizing algorithmic trading
- Mission: make professional-grade trading bots accessible to everyone
- Non-custodial philosophy: your keys, your crypto
- All security audits passed
- Copyrighter has full creative freedom to craft compelling narrative

### i18n
- **NO translations for V1** — English only
- Language switcher: keep as placeholder/stub for future
- Structure code to be i18n-ready but don't translate content

---

## Technical Stack

### Already installed (keep):
- `framer-motion` 12.x — animations (NOT "motion.dev", already in package.json)
- `next-intl` 4.6 — i18n framework (configured, no translations yet)
- `lucide-react` — icons
- `recharts` + `apexcharts` — charts
- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 3.4

### Add new:
- `embla-carousel-react` — carousels (testimonials, bot showcase)
- `@number-flow/react` — animated number counters
- `react-intersection-observer` — scroll-triggered animations

### Design tokens (KEEP existing):
- Primary: #4F46E5 (Indigo)
- Accent: #06B6D4 (Cyan)
- Dark BG: #0f172a
- Font: Zalando Sans + Inter
- Gradient: primary-500 → accent-500
- Rounded corners: 2xl/3xl
- Existing CSS utilities: .text-gradient, .glow-effect, .card-hover

### UI Patterns to implement:
- **Bento Grid** — features page (Apple/Linear/Vercel style)
- **ScrambleText** — hero headlines (letter-by-letter decryption)
- **Animated Counters** — stats sections (team size, bots available, etc.)
- **Marquee** — bot/exchange logos ticker
- **Glassmorphism cards** — bot cards, stats
- **RevealOnScroll** — section entrance animations
- **TiltCard** — 3D hover effect on feature cards

### Performance targets:
- LCP < 2.5s
- CLS < 0.1
- Lighthouse Performance > 90
- `prefers-reduced-motion` support
- SSR-compatible animations
- Lazy-load animation components

---

## Animation Map

| Section | Animation |
|---------|-----------|
| Hero headline | ScrambleText (letter-by-letter decryption) |
| Hero background | Gradient mesh + subtle parallax |
| Stats counters | @number-flow/react animated counting |
| Feature bento grid | Stagger reveal on scroll |
| How it works | Step-by-step sequential reveal |
| Bot showcase | Embla carousel + fade transitions |
| Exchange logos | Marquee / infinite horizontal scroll |
| CTA sections | Pulse + glow on hover |
| FAQ accordion | Smooth height animation |
| Footer | Fade in on scroll |
| Cards | 3D tilt on hover + glassmorphism |

### Reusable Components to create:

```
components/animations/
├── ScrambleText.tsx        — letter-by-letter decryption effect
├── AnimatedCounter.tsx     — number count-up with @number-flow/react
├── BentoGrid.tsx           — responsive bento layout with stagger reveal
├── RevealOnScroll.tsx      — fade+slide on viewport enter
├── Marquee.tsx             — infinite horizontal scroll
├── ParallaxSection.tsx     — subtle depth effect
├── TiltCard.tsx            — 3D tilt on hover with glassmorphism
├── GlowButton.tsx          — pulsing glow CTA button
└── Carousel.tsx            — embla-carousel wrapper with autoplay
```

All must: support prefers-reduced-motion, SSR-compatible, TypeScript strict, lazy-loadable.

---

## Agent Team Architecture

Uses Claude Code Agent Teams (experimental feature).
Requires: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.

### Team Structure

**Leader**: Coordinator (delegate mode — does NOT write code, only orchestrates)

**Teammates:**

| Agent | Type | Role | Output |
|-------|------|------|--------|
| analyst | Explore | Analyze dashboard-v2 → extract features, flows, terminology, bot types | product-brief.md |
| auditor | Explore | Audit current site → design tokens, routing, components to keep/remove | site-audit.md |
| content | general-purpose | Write all content for 5 core pages (EN) | content files in src/content/ |
| animator | general-purpose | Create 9 reusable animation components | components/animations/*.tsx |
| builder | general-purpose | Integrate content + animations into pages | Updated page files |

### Execution Phases

```
PHASE 0: Research (analyst + auditor — parallel)
  ├── analyst: reads dashboard-v2, creates product-brief.md
  └── auditor: reads current site, creates site-audit.md + migration-map.md
  → Output: docs/product-brief.md, docs/site-audit.md, docs/migration-map.md

PHASE 1: Content + Animation Components (content + animator — parallel)
  ├── content: writes text for 5 pages based on product-brief.md
  │   (Homepage, About, Features, Security, Pricing)
  └── animator: creates 9 animation components
  → Output: src/content/*.ts + components/animations/*.tsx

PHASE 2: Integration (builder — sequential, page by page)
  └── builder: assembles pages with content + animations
      1. Homepage (remove calculator, StakingPlans; add bot marketplace hero)
      2. About (company story, team section, milestones)
      3. Features (bento grid of real features from dashboard-v2)
      4. Security (Web3, non-custodial, smart contracts, audits)
      5. Pricing (commission model, comparison)
      + Update Navbar (hide Performance/Affiliate links)
      + Update Footer if needed
  → Output: updated page files

PHASE 3: QA (leader reviews)
  └── leader verifies each page, requests fixes
```

### Key Coordination Rules
- analyst and auditor MUST finish before content starts (content needs product-brief.md)
- animator can start immediately (components are product-agnostic)
- builder waits for BOTH content and animator to finish
- All teammates read CLAUDE.md for project conventions
- No two teammates edit the same file
- Leader uses delegate mode (Shift+Tab) — only orchestrates

---

## Page Specifications

### Homepage (/)
**Remove:** Calculator, StakingPlans, fake stats ($127M AUM, 90% ROI, 15K investors)
**Keep:** Hero section structure, FAQ, Blog preview, video backgrounds
**Add/Rewrite:**
- Hero: ScrambleText headline about bot marketplace
- Sub-hero: What CLOUDBRIGHT actually does (3 key points)
- Bot showcase: carousel/grid of featured bots with real metrics from dashboard-v2
- How it works: 3-step process (Connect Exchange → Browse Bots → Start Copying)
- Social proof: real metrics (bots available, exchanges supported, team size)
- Trust signals: Non-custodial, Security audits, HK registered
- CTA: "Get Started" → /register

### About (/about)
**Remove:** Fake team (Dr. Michael Chen etc.), fake stats ($2.5B AUM)
**Rewrite completely:**
- Company story (founded Dec 2025, HK, 40+ team, Web3 vision)
- Mission & Values (democratize algorithmic trading, non-custodial philosophy)
- Why Hong Kong (fintech hub, Web3 friendly regulation)
- Milestones timeline (founding → audit → beta → launch)
- Team section: general roles without fake names (or skip if no real names)
- Stats: only real numbers (team size, bots on platform, supported exchanges)

### Features (/features) — NEW PAGE
**Bento grid layout** with all actual features from dashboard-v2:
- Bot Marketplace (browse, compare, filter)
- Deep Bot Analytics (performance, trades, risk)
- 1-Click Copy Trading
- Multi-Exchange Support (list actual exchanges)
- Social Features (community, shared strategies)
- Real-Time Dashboard (live P&L, positions)
- Non-Custodial Security
- Smart Contract Integration
- Mobile-Ready (future app mention, icons if they exist)

### Security (/security) — NEW PAGE
- Non-custodial architecture explanation
- Web3 / blockchain foundation
- Smart contract audits (passed)
- Information security audits (passed)
- API key encryption (never stored plain)
- No access to user funds
- Data protection practices
- HK regulatory context

### Pricing (/pricing) — NEW PAGE
- Simple model: Free to use, 1-2% commission on profit withdrawal
- Comparison with competitors (who charge subscriptions, high fees)
- "You only pay when you profit" messaging
- FAQ about fees
- No tiers/plans with guaranteed returns

---

## Critical Constraints

1. **NEVER promise specific returns** — "potential returns" not "guaranteed 50% monthly"
2. **Risk disclosure** on every page with financial information
3. **No fake data** — only real stats or clearly marked projections
4. **Performance** — animations must not slow mobile devices
5. **prefers-reduced-motion** — disable animations for users with this setting
6. **SSR compatibility** — all animations must work with Next.js SSR
7. **Keep existing design system** — colors, fonts, spacing, rounded corners
8. **Dashboard-v2 is source of truth** — all features/claims must match actual product
9. **Brand consistency** — use "CLOUDBRIGHT" everywhere, "HKCBS" only in legal/footer

---

## Pre-Flight Checklist

Before starting, ensure:
- [ ] `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set
- [ ] `npm install embla-carousel-react @number-flow/react react-intersection-observer`
- [ ] Current CLAUDE.md is backed up (plan adds to it, doesn't replace)
- [ ] Dashboard-v2 is accessible for analyst agent to read
