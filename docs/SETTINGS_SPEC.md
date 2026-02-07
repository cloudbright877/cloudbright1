# Settings Page -- Full Specification

**Version:** 1.0
**Date:** 2026-02-07
**Target:** Developer (Sonnet) -- complete implementation guide, zero ambiguity

---

## 1. OVERVIEW

### What we are doing

Replacing the current Settings page (`app/dashboard-v2/settings/page.tsx`) which uses a sidebar + content panel layout (~773 lines, single monolithic file) with a **Bento Card Grid + Drawer** architecture.

### Why

1. The current page is a single monolithic component with 6 inline sections, all state in `useState`, no localStorage persistence, duplicated toggle/input markup, and zero componentization.
2. The new layout provides a scannable overview of all settings at a glance (6 preview cards), with drill-down via drawer for editing. This is a better UX pattern for settings pages with many discrete sections.
3. Moving to localStorage persistence aligns with the rest of the app (wallets, users, balances all use `storage` from `lib/storage/LocalStorageAdapter.ts`).

### Key architectural decisions

- **Layout:** 6 Bento Cards on main screen. Click a card to open a Drawer on the right (desktop) or Bottom Sheet (mobile).
- **Sections (6):** Profile, Security, KYC, Wallets, Notifications, Preferences.
- **Note:** The current page has "Account" and "Trading" sections. These are **removed**. "Account" functionality (email, password) moves to Security. "Trading" settings are out of scope (controlled by BotManager, not user settings). KYC and Wallets are **new** sections.
- **State:** All settings persisted to localStorage via `storage` singleton from `lib/storage/LocalStorageAdapter.ts`.
- **Toast notifications:** via existing `useToast()` hook from `context/ToastContext.tsx`.
- **Animations:** framer-motion for drawer/sheet transitions, card hover, stagger entrance.

---

## 2. FILE STRUCTURE

All paths relative to project root (`D:\celestian --- kopiya`).

### Files to CREATE

```
lib/settings/settingsTypes.ts          -- All TypeScript interfaces
lib/settings/settingsService.ts        -- Data access layer (localStorage CRUD)
lib/settings/settingsDefaults.ts       -- Default values for all settings

components/settings/SettingsBentoCard.tsx    -- Individual bento preview card
components/settings/SettingsDrawer.tsx       -- Desktop drawer + mobile bottom sheet
components/settings/SettingsFormInput.tsx    -- Reusable text input
components/settings/SettingsFormTextarea.tsx -- Reusable textarea
components/settings/SettingsFormSelect.tsx   -- Reusable select dropdown
components/settings/SettingsToggle.tsx       -- Reusable toggle switch
components/settings/SettingsBadge.tsx        -- Status badge (Verified, Pending, etc.)
components/settings/SettingsFormActions.tsx  -- Save/Cancel button pair

components/settings/sections/ProfileSection.tsx        -- Drawer content for Profile
components/settings/sections/SecuritySection.tsx       -- Drawer content for Security
components/settings/sections/KYCSection.tsx            -- Drawer content for KYC
components/settings/sections/WalletsSection.tsx        -- Drawer content for Wallets
components/settings/sections/NotificationsSection.tsx  -- Drawer content for Notifications
components/settings/sections/PreferencesSection.tsx    -- Drawer content for Preferences
```

### Files to MODIFY

```
app/dashboard-v2/settings/page.tsx     -- Complete rewrite (bento grid + drawer orchestration)
```

### Files that remain UNCHANGED (existing dependencies)

```
components/ui/Stepper.tsx              -- Used by KYCSection
components/ui/Toast.tsx                -- Used via ToastContext
context/ToastContext.tsx                -- useToast() hook
components/dashboard-v2/ConfirmationModal.tsx  -- Used for dangerous actions
lib/users.ts                           -- getUser/updateUser for profile data
lib/storage/LocalStorageAdapter.ts     -- storage singleton
lib/storage/StorageAdapter.ts          -- StorageAdapter interface
components/Providers.tsx               -- ToastProvider already wrapping app
```

---

## 3. SHARED UI COMPONENTS

All components below go in `components/settings/`. All must be `'use client'` components.

---

### 3.1 SettingsFormInput

**File:** `components/settings/SettingsFormInput.tsx`

```typescript
interface SettingsFormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  disabled?: boolean;
  error?: string;
  hint?: string;
  prefix?: string;           // e.g., "@" for username
  maxLength?: number;
  showCharCount?: boolean;   // shows "42/500 characters"
  rightElement?: React.ReactNode;  // e.g., "Verified" badge
}
```

**Behavior:**
- Controlled input. `onChange` fires with string value (not event).
- When `error` is set, border turns `border-red-500/50`, error text appears below in `text-red-400 text-xs`.
- When focused without error, border turns `border-primary-500`.
- `prefix` renders before input inline (like "@" for username field).
- `showCharCount` renders `{value.length}/{maxLength}` below input.

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Wrapper | `mb-0` (spacing controlled by parent) |
| Label | `block text-sm font-medium text-dark-300 mb-2` |
| Input | `w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed` |
| Input (error state) | Add `border-red-500/50 focus:border-red-500 focus:ring-red-500/20` |
| Error text | `text-xs text-red-400 mt-1.5` |
| Hint text | `text-xs text-dark-500 mt-1.5` |
| Prefix | `text-dark-500 mr-1` (inside a flex wrapper with the input) |
| Char count | `text-xs text-dark-500 mt-1.5` |

---

### 3.2 SettingsFormTextarea

**File:** `components/settings/SettingsFormTextarea.tsx`

```typescript
interface SettingsFormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;              // default: 4
  maxLength?: number;         // default: 500
  disabled?: boolean;
  error?: string;
  hint?: string;
}
```

**Behavior:**
- Same validation/error pattern as FormInput.
- Always show char count: `{value.length}/{maxLength} characters`.
- `resize-none` always applied.

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Textarea | `w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors resize-none disabled:opacity-50` |

---

### 3.3 SettingsFormSelect

**File:** `components/settings/SettingsFormSelect.tsx`

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SettingsFormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  hint?: string;
}
```

**Behavior:**
- Native `<select>` element styled for dark theme.
- `onChange` fires with selected value string.

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Select | `w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors appearance-none cursor-pointer` |
| Select wrapper | `relative` (for custom dropdown arrow) |
| Arrow icon | `absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none` (use `ChevronDown` from lucide-react) |
| Option | `bg-dark-900 text-white` |

---

### 3.4 SettingsToggle

**File:** `components/settings/SettingsToggle.tsx`

```typescript
interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
```

**Behavior:**
- Full-width row with label/description on left, toggle switch on right.
- Toggle is a `<button>` with animated knob.
- Click toggles immediately (no save needed -- toggles auto-save or participate in dirty detection depending on section).

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Row wrapper | `flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-dark-700` |
| Label | `font-semibold text-white text-sm` |
| Description | `text-sm text-dark-400 mt-0.5` |
| Track (off) | `relative w-12 h-7 rounded-full bg-dark-600 transition-colors cursor-pointer` |
| Track (on) | `relative w-12 h-7 rounded-full bg-primary-500 transition-colors cursor-pointer` |
| Track (disabled) | Add `opacity-50 cursor-not-allowed` |
| Knob (off) | `absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm` |
| Knob (on) | `absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm translate-x-5` |

---

### 3.5 SettingsBadge

**File:** `components/settings/SettingsBadge.tsx`

```typescript
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface SettingsBadgeProps {
  text: string;
  variant: BadgeVariant;
  icon?: React.ReactNode;  // optional icon before text
  size?: 'sm' | 'md';     // default: 'sm'
}
```

**Tailwind classes per variant:**

| Variant | Classes |
|---------|---------|
| success | `bg-green-500/20 border border-green-500/30 text-green-400` |
| warning | `bg-yellow-500/20 border border-yellow-500/30 text-yellow-400` |
| error | `bg-red-500/20 border border-red-500/30 text-red-400` |
| info | `bg-blue-500/20 border border-blue-500/30 text-blue-400` |
| neutral | `bg-dark-700 border border-dark-600 text-dark-300` |

**Size:**
| Size | Classes |
|------|---------|
| sm | `px-2.5 py-0.5 text-xs font-semibold rounded-full` |
| md | `px-3 py-1 text-sm font-semibold rounded-lg` |

All badges: `inline-flex items-center gap-1.5`.

---

### 3.6 SettingsFormActions

**File:** `components/settings/SettingsFormActions.tsx`

```typescript
interface SettingsFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;       // shows spinner on save button
  isDisabled?: boolean;     // true when form is clean (no changes)
  saveText?: string;        // default: "Save Changes"
}
```

**Behavior:**
- Two buttons: Cancel (secondary) and Save (primary gradient).
- Save button disabled when `isDisabled` is true (no changes made).
- When `isSaving`, show a small spinner inside save button and disable both buttons.

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Wrapper | `flex justify-end gap-3 pt-6 border-t border-dark-700 mt-6` |
| Cancel button | `px-5 py-2.5 border border-dark-600 rounded-xl text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm font-medium` |
| Save button (active) | `px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all` |
| Save button (disabled) | Add `opacity-50 cursor-not-allowed hover:shadow-none` |
| Spinner | `w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin` |

---

## 4. DATA LAYER

### 4.1 TypeScript Interfaces

**File:** `lib/settings/settingsTypes.ts`

```typescript
// ==========================================
// Profile
// ==========================================
export interface ProfileSettings {
  displayName: string;
  username: string;
  bio: string;
  avatar: string;  // single uppercase letter (e.g., "J") -- not a URL for MVP
}

// ==========================================
// Security
// ==========================================
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;      // mock TOTP secret, null if 2FA not enabled
  backupCodes: string[];                // array of 8 backup codes
  sessions: Session[];
}

export interface Session {
  id: string;
  device: string;        // "Chrome on Windows", "iPhone", etc.
  location: string;       // "New York, USA"
  lastActive: number;     // Unix timestamp
  isCurrent: boolean;
}

// ==========================================
// KYC
// ==========================================
export type KYCStatus = 'not_started' | 'personal_info' | 'documents' | 'selfie' | 'under_review' | 'approved' | 'rejected';

export interface KYCData {
  status: KYCStatus;
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;     // YYYY-MM-DD format
  country: string;
  // Step 2: Documents
  documentType: 'passport' | 'id_card' | 'drivers_license' | '';
  documentUploaded: boolean;
  // Step 3: Selfie
  selfieUploaded: boolean;
  // Step 4: Review
  submittedAt: number | null;   // Unix timestamp
  reviewedAt: number | null;
  rejectionReason: string | null;
}

// ==========================================
// Wallets (saved withdrawal addresses)
// ==========================================
export type NetworkType = 'ETH' | 'BTC' | 'TRX' | 'SOL' | 'BNB';

export interface SavedWalletAddress {
  id: string;
  label: string;            // User-defined label, e.g., "My Binance"
  address: string;          // Wallet address
  network: NetworkType;
  createdAt: number;        // Unix timestamp
}

export interface WalletsSettings {
  addresses: SavedWalletAddress[];  // max 10
}

// ==========================================
// Notifications
// ==========================================
export interface NotificationSettings {
  email: string;            // notification email address
  tradeAlerts: boolean;
  securityAlerts: boolean;
  weeklyReport: boolean;
}

// ==========================================
// Preferences
// ==========================================
export type Language = 'en' | 'ru';
export type Currency = 'USD' | 'EUR' | 'RUB';
export type Theme = 'dark';  // only dark for now

export interface PreferencesSettings {
  language: Language;
  currency: Currency;
  theme: Theme;
}

// ==========================================
// Aggregate (used in service layer)
// ==========================================
export interface AllSettings {
  profile: ProfileSettings;
  security: SecuritySettings;
  kyc: KYCData;
  wallets: WalletsSettings;
  notifications: NotificationSettings;
  preferences: PreferencesSettings;
}

// ==========================================
// Bento Card metadata
// ==========================================
export type SettingsSectionId = 'profile' | 'security' | 'kyc' | 'wallets' | 'notifications' | 'preferences';
```

---

### 4.2 Default Values

**File:** `lib/settings/settingsDefaults.ts`

```typescript
import type {
  ProfileSettings,
  SecuritySettings,
  KYCData,
  WalletsSettings,
  NotificationSettings,
  PreferencesSettings,
} from './settingsTypes';

export const DEFAULT_PROFILE: ProfileSettings = {
  displayName: 'Demo User',
  username: 'demo_user',
  bio: '',
  avatar: 'D',
};

export const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  twoFactorSecret: null,
  backupCodes: [],
  sessions: [
    {
      id: 'session_current',
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: Date.now(),
      isCurrent: true,
    },
  ],
};

export const DEFAULT_KYC: KYCData = {
  status: 'not_started',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  documentType: '',
  documentUploaded: false,
  selfieUploaded: false,
  submittedAt: null,
  reviewedAt: null,
  rejectionReason: null,
};

export const DEFAULT_WALLETS: WalletsSettings = {
  addresses: [],
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: '',
  tradeAlerts: true,
  securityAlerts: true,
  weeklyReport: false,
};

export const DEFAULT_PREFERENCES: PreferencesSettings = {
  language: 'en',
  currency: 'USD',
  theme: 'dark',
};
```

---

### 4.3 Settings Service

**File:** `lib/settings/settingsService.ts`

This service uses **direct localStorage** (not the `storage` singleton from `LocalStorageAdapter`) because settings are single-object-per-key, not arrays of items. The `storage` singleton is designed for collections (users, balances) where items have `id` fields. Settings are simpler -- one JSON object per key.

**localStorage keys:**

| Key | Value type | Default |
|-----|-----------|---------|
| `celestian_settings_profile` | `ProfileSettings` | `DEFAULT_PROFILE` |
| `celestian_settings_security` | `SecuritySettings` | `DEFAULT_SECURITY` |
| `celestian_settings_kyc` | `KYCData` | `DEFAULT_KYC` |
| `celestian_settings_wallets` | `WalletsSettings` | `DEFAULT_WALLETS` |
| `celestian_settings_notifications` | `NotificationSettings` | `DEFAULT_NOTIFICATIONS` |
| `celestian_settings_preferences` | `PreferencesSettings` | `DEFAULT_PREFERENCES` |

**Function signatures:**

```typescript
import type {
  ProfileSettings,
  SecuritySettings,
  KYCData,
  WalletsSettings,
  NotificationSettings,
  PreferencesSettings,
  SavedWalletAddress,
} from './settingsTypes';

// ---- Generic helpers (private) ----

// Read a settings key. Returns default if not found or parse error.
function readSettings<T>(key: string, defaultValue: T): T;

// Write a settings key. Merges partial data with existing.
function writeSettings<T>(key: string, data: T): void;

// ---- Profile ----
export function getProfileSettings(): ProfileSettings;
export function saveProfileSettings(data: Partial<ProfileSettings>): ProfileSettings;

// ---- Security ----
export function getSecuritySettings(): SecuritySettings;
export function saveSecuritySettings(data: Partial<SecuritySettings>): SecuritySettings;
// Enable 2FA: generates mock secret + 8 backup codes, saves them
export function enable2FA(): { secret: string; backupCodes: string[] };
// Disable 2FA: clears secret + codes
export function disable2FA(): void;
// Revoke a session by ID
export function revokeSession(sessionId: string): void;

// ---- KYC ----
export function getKYCData(): KYCData;
export function saveKYCData(data: Partial<KYCData>): KYCData;
// Advance KYC to next step
export function advanceKYCStep(currentStatus: KYCStatus): KYCStatus;
// Mock: submit KYC for review (sets status to 'under_review', records submittedAt)
export function submitKYCForReview(): KYCData;
// Mock: auto-approve after "review" (sets status to 'approved' after a delay)
export function mockApproveKYC(): KYCData;

// ---- Wallets ----
export function getWalletsSettings(): WalletsSettings;
export function addWalletAddress(address: Omit<SavedWalletAddress, 'id' | 'createdAt'>): SavedWalletAddress;
export function removeWalletAddress(addressId: string): void;
export function updateWalletAddress(addressId: string, data: Partial<SavedWalletAddress>): SavedWalletAddress;

// ---- Notifications ----
export function getNotificationSettings(): NotificationSettings;
export function saveNotificationSettings(data: Partial<NotificationSettings>): NotificationSettings;

// ---- Preferences ----
export function getPreferencesSettings(): PreferencesSettings;
export function savePreferencesSettings(data: Partial<PreferencesSettings>): PreferencesSettings;
```

**Implementation notes for developer:**

1. `readSettings<T>(key, default)`: call `localStorage.getItem(key)`, parse JSON, return `{ ...default, ...parsed }` to fill missing fields. On parse error or missing, return `default`.
2. `writeSettings<T>(key, data)`: call `localStorage.setItem(key, JSON.stringify(data))`.
3. `saveProfileSettings(partial)`: read current, merge, write, return merged. Same pattern for all "save" functions.
4. `enable2FA()`: generate a mock TOTP secret (random 16-char base32 string like `JBSWY3DPEHPK3PXP`), generate 8 backup codes (each 8-char alphanumeric), save to security settings.
5. `addWalletAddress()`: check `addresses.length < 10`, throw error if at limit. Generate `id` as `wallet_${Date.now()}`. Add to array, save, return new address.
6. `advanceKYCStep()`: map from current status to next: `not_started -> personal_info -> documents -> selfie -> under_review`. Return new status.
7. All functions are synchronous (direct localStorage access). No `async/await` needed.

---

### 4.4 Syncing Profile with User model

The Profile section edits fields that also exist on the `User` model in `lib/users.ts` (displayName, username, bio, avatar). When saving profile settings, the developer MUST also call `updateUser()` to keep both in sync.

Pattern:
```typescript
// In ProfileSection.tsx handleSave:
const updated = saveProfileSettings({ displayName, username, bio, avatar });
// Also sync to user model:
const userId = localStorage.getItem('currentUserId');
if (userId) {
  await updateUser(userId, { displayName, username, bio, avatar });
}
```

The `currentUserId` key in localStorage is already used by other pages (e.g., withdraw page).

---

## 5. BENTO GRID (Main Screen)

### 5.1 Page Layout

**File:** `app/dashboard-v2/settings/page.tsx`

The page is `'use client'` and renders:

1. **Header** -- same pattern as current (title + subtitle with motion).
2. **Bento Grid** -- 6 cards in responsive grid.
3. **Drawer** -- conditionally rendered when a card is clicked.

**Grid responsive behavior:**

| Breakpoint | Grid | Card layout |
|------------|------|-------------|
| Mobile (<768px) | `grid-cols-1` | Full width, stacked |
| Tablet (768-1023px) | `grid-cols-2` | 2 columns |
| Desktop (>=1024px) | `grid-cols-3` | 3 columns, 2 rows |

**Grid Tailwind:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6`

### 5.2 SettingsBentoCard Component

**File:** `components/settings/SettingsBentoCard.tsx`

```typescript
interface SettingsBentoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: React.ReactNode;     // Badge, text, or custom element
  onClick: () => void;
  index: number;                // for stagger animation delay
}
```

**Behavior:**
- Card shows: icon (top-left), title, short description, status indicator (top-right or bottom).
- On hover: subtle scale + border glow.
- On click: opens drawer for that section.
- Stagger entrance animation: each card delayed by `index * 0.1s`.

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Card | `group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5` |
| Icon container | `w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-3` |
| Icon | `w-5 h-5 text-primary-400` |
| Title | `text-base font-bold text-white mb-1` |
| Description | `text-sm text-dark-400 mb-3` |
| Status area | `flex items-center justify-between` |
| Chevron | `w-4 h-4 text-dark-500 group-hover:text-primary-400 transition-colors group-hover:translate-x-0.5 transition-transform` (use `ChevronRight` from lucide) |

**framer-motion:**
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1, duration: 0.3 }}
whileHover={{ y: -2 }}
```

### 5.3 Card Content for Each Section

Below is exactly what each bento card shows as preview:

**Card 1: Profile**
| Field | Value |
|-------|-------|
| Icon | `User` from lucide-react |
| Title | `Profile` |
| Description | `Display name, username, bio` |
| Status | Avatar letter circle (w-8 h-8, same gradient as current) + display name text. Example: `[J] John Pro` |

**Card 2: Security**
| Field | Value |
|-------|-------|
| Icon | `Shield` from lucide-react |
| Title | `Security` |
| Description | `Password, 2FA, sessions` |
| Status | Badge: if 2FA enabled, `<SettingsBadge variant="success" text="2FA On" />`, else `<SettingsBadge variant="warning" text="2FA Off" />` |

**Card 3: KYC**
| Field | Value |
|-------|-------|
| Icon | `FileCheck` from lucide-react |
| Title | `Verification` |
| Description | `Identity verification status` |
| Status | Badge per KYC status: |

KYC status to badge mapping:

| KYC Status | Badge variant | Badge text |
|------------|--------------|------------|
| `not_started` | `neutral` | `Not Started` |
| `personal_info` / `documents` / `selfie` | `info` | `In Progress` |
| `under_review` | `warning` | `Under Review` |
| `approved` | `success` | `Verified` |
| `rejected` | `error` | `Rejected` |

**Card 4: Wallets**
| Field | Value |
|-------|-------|
| Icon | `Wallet` from lucide-react |
| Title | `Saved Wallets` |
| Description | `Withdrawal addresses` |
| Status | Text: `{addresses.length}/10 addresses` in `text-sm text-dark-400` |

**Card 5: Notifications**
| Field | Value |
|-------|-------|
| Icon | `Bell` from lucide-react |
| Title | `Notifications` |
| Description | `Email alerts and reports` |
| Status | Count of enabled toggles, e.g., `2/3 enabled` in `text-sm text-dark-400` |

**Card 6: Preferences**
| Field | Value |
|-------|-------|
| Icon | `Settings` from lucide-react |
| Title | `Preferences` |
| Description | `Language, currency, theme` |
| Status | Text summary: `EN / USD / Dark` in `text-sm text-dark-400` |

---

## 6. DRAWER / BOTTOM SHEET

### 6.1 SettingsDrawer Component

**File:** `components/settings/SettingsDrawer.tsx`

```typescript
interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**Behavior:**
- **Desktop (>=768px):** Slides in from the right. Fixed position, `right-0`, `top-0`, `h-full`, `w-[480px]`.
- **Mobile (<768px):** Slides up from bottom. Fixed position, `bottom-0`, `left-0`, `w-full`, `max-h-[90vh]`, `rounded-t-2xl`.
- **Overlay:** `fixed inset-0 bg-black/60 backdrop-blur-sm z-40`. Clicking overlay closes drawer.
- **Close button:** Top-right `X` icon button.
- **Scrollable:** Content area is `overflow-y-auto` with custom scrollbar styles.
- **Responsive detection:** Use a ref + `window.innerWidth` check on mount (or `useMediaQuery` pattern with `matchMedia`). Breakpoint at `768px`.

**framer-motion animations:**

Desktop drawer:
```typescript
// Overlay
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}

// Drawer panel
initial={{ x: '100%' }}
animate={{ x: 0 }}
exit={{ x: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 200 }}
```

Mobile bottom sheet:
```typescript
// Panel
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 200 }}
```

**Tailwind classes:**

| Element | Classes |
|---------|---------|
| Overlay | `fixed inset-0 bg-black/60 backdrop-blur-sm z-40` |
| Desktop panel | `fixed right-0 top-0 h-full w-[480px] bg-dark-900 border-l border-dark-700 z-50 flex flex-col shadow-2xl` |
| Mobile panel | `fixed bottom-0 left-0 w-full max-h-[90vh] bg-dark-900 border-t border-dark-700 rounded-t-2xl z-50 flex flex-col shadow-2xl` |
| Header | `flex items-center justify-between px-6 py-4 border-b border-dark-700 flex-shrink-0` |
| Title | `text-lg font-bold text-white` |
| Close button | `w-9 h-9 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-white transition-all` |
| Content area | `flex-1 overflow-y-auto px-6 py-6` |
| Mobile drag handle | `w-10 h-1 bg-dark-600 rounded-full mx-auto mt-2 mb-1` (visible only on mobile, at top of sheet) |

**Keyboard accessibility:**
- `Escape` key closes drawer.
- Trap focus inside drawer while open (optional for MVP, but add `Escape` listener).

**Body scroll lock:**
- When drawer is open, add `overflow-hidden` to `<body>` to prevent background scrolling.
- Remove on close. Use `useEffect` with cleanup.

---

## 7. SECTIONS (Detailed Design)

Each section below is a standalone component rendered as `children` inside `SettingsDrawer`.

---

### 7.1 ProfileSection

**File:** `components/settings/sections/ProfileSection.tsx`

```typescript
interface ProfileSectionProps {
  onClose: () => void;       // close drawer after save
  onSaved: () => void;       // refresh bento card data
}
```

**UI elements inside drawer (top to bottom):**

1. **Avatar editor**
   - Large avatar circle (w-20 h-20) with gradient `bg-gradient-to-br from-primary-500 to-accent-500` showing the letter.
   - "Change Avatar" button (purely visual for MVP -- shows toast "Avatar upload coming soon").
   - Hint: `text-xs text-dark-500`: "JPG, PNG or GIF. Max 2MB"

2. **Display Name** -- `SettingsFormInput` with `label="Display Name"`, `maxLength={50}`

3. **Username** -- `SettingsFormInput` with `label="Username"`, `prefix="@"`, `maxLength={30}`
   - Hint: `Your public profile URL: celestian.com/@{username}`

4. **Bio** -- `SettingsFormTextarea` with `label="Bio"`, `rows={4}`, `maxLength={500}`

5. **SettingsFormActions** -- Save / Cancel

**Validation rules:**
- displayName: required, min 2 chars, max 50 chars
- username: required, min 3 chars, max 30 chars, alphanumeric + underscore only (`/^[a-zA-Z0-9_]+$/`)
- bio: optional, max 500 chars

**State flow:**
1. On mount: `getProfileSettings()` to load current values into local state.
2. Edit fields --> local state updates.
3. Cancel: revert to loaded values (or close drawer).
4. Save: validate, call `saveProfileSettings(data)`, sync to User model via `updateUser()`, show toast.success("Profile updated"), call `onSaved()`, call `onClose()`.
5. Error: show toast.error with specific message.

**Dirty detection:**
- Compare current form state with initially loaded state using `JSON.stringify`.
- `SettingsFormActions.isDisabled` = true when no changes.

---

### 7.2 SecuritySection

**File:** `components/settings/sections/SecuritySection.tsx`

```typescript
interface SecuritySectionProps {
  onClose: () => void;
  onSaved: () => void;
}
```

**UI elements inside drawer (top to bottom):**

1. **Change Password** block
   - Card with `bg-dark-800/50 rounded-xl border border-dark-700 p-5`
   - Title: "Change Password" (h3, `text-base font-bold text-white`)
   - Three fields (only visible when expanded -- toggle with a "Change Password" button):
     - Current Password -- `SettingsFormInput type="password"`
     - New Password -- `SettingsFormInput type="password"`
     - Confirm New Password -- `SettingsFormInput type="password"`
   - Validation: new password min 8 chars, must match confirm. Current password checked against mock value "password123".
   - Save button inside this sub-block (not the global FormActions).
   - On success: toast.success("Password changed successfully"), collapse the block.

2. **Two-Factor Authentication** block
   - Card layout, same styling.
   - Shows current status with `SettingsBadge`.
   - **If 2FA disabled:** Button "Enable 2FA" which triggers a sub-flow:
     1. Call `enable2FA()` to get secret + backup codes.
     2. Show mock QR code area (a dark box with `text-center p-8 bg-dark-800 rounded-xl border-2 border-dashed border-dark-600` and text "QR Code placeholder" + the secret string displayed as `font-mono text-primary-400 text-sm`).
     3. Show backup codes in a grid (4x2, `font-mono text-sm bg-dark-800 rounded-lg px-3 py-2 text-center`).
     4. "I have saved my backup codes" button to confirm.
     5. After confirm: save, toast.success, refresh.
   - **If 2FA enabled:** Button "Disable 2FA" -- opens `ConfirmationModal` with `isDangerous=true`, title "Disable 2FA?", description "This will remove the extra security layer from your account.", bulletPoints: ["Anyone with your password can access your account", "You will need to re-enable 2FA to protect your account"]. On confirm: call `disable2FA()`, toast, refresh.

3. **Active Sessions** block
   - Card layout.
   - List of sessions from `getSecuritySettings().sessions`.
   - Each session row:
     - Device icon: `Laptop` for desktop-like, `Smartphone` for mobile-like (detect by device string containing "iPhone"/"Android"/"Mobile").
     - Device name (bold white), location + time (text-xs dark-400).
     - If `isCurrent`: green dot + "Active now" in green text.
     - If not current: "Revoke" button (text-xs text-red-400 hover:text-red-300).
   - Revoke: calls `revokeSession(id)`, toast.success("Session revoked"), refresh list.

**No global Save/Cancel for this section** -- each sub-block has its own action. Close drawer with X button.

---

### 7.3 KYCSection

**File:** `components/settings/sections/KYCSection.tsx`

```typescript
interface KYCSectionProps {
  onClose: () => void;
  onSaved: () => void;
}
```

**This section uses the existing `Stepper` component** from `components/ui/Stepper.tsx`.

**4-step verification flow:**

Steps array for Stepper:
```typescript
const KYC_STEPS = [
  { label: 'Personal', description: 'Basic info' },
  { label: 'Documents', description: 'ID upload' },
  { label: 'Selfie', description: 'Face check' },
  { label: 'Review', description: 'Verification' },
];
```

Map KYC status to stepper `currentStep`:
| KYC Status | currentStep |
|------------|-------------|
| `not_started` | 1 |
| `personal_info` | 1 |
| `documents` | 2 |
| `selfie` | 3 |
| `under_review` | 4 |
| `approved` | 5 (all complete) |
| `rejected` | varies (show rejected state) |

**Step 1: Personal Info**
- Fields: First Name, Last Name (SettingsFormInput), Date of Birth (SettingsFormInput type="text", placeholder "YYYY-MM-DD"), Country (SettingsFormSelect with options: "United States", "Russia", "United Kingdom", "Germany", "Japan", "Other").
- Validation: all fields required, dateOfBirth must match `YYYY-MM-DD` pattern.
- Button: "Continue" -- saves data, advances status to `documents`.

**Step 2: Documents**
- Select document type: 3 buttons (Passport, ID Card, Driver's License) styled as radio cards (same pattern as network selection in withdraw page).
- Upload area: large dashed-border zone (`border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50`). Shows `Upload` icon from lucide + "Click to upload or drag and drop" + "PNG, JPG up to 10MB".
- For MVP: clicking the upload zone sets `documentUploaded = true` and shows a mock "Document uploaded" success state (green border, checkmark icon).
- Button: "Continue" -- requires documentType selected and documentUploaded=true.

**Step 3: Selfie**
- Same upload zone pattern as Step 2 but text says "Take a selfie holding your document".
- Mock same behavior: click to "upload", sets `selfieUploaded = true`.
- Button: "Submit for Review" -- calls `submitKYCForReview()`, advances to step 4.

**Step 4: Review**
- **If under_review:** Show a card with `Clock` icon, "Your documents are being reviewed", "This usually takes 1-3 business days", and a "Check Status" button. Clicking "Check Status" calls `mockApproveKYC()` which instantly sets status to `approved` (mock behavior for demo).
- **If approved:** Show card with `CheckCircle` icon, green theme, "Identity Verified", date of approval.
- **If rejected:** Show card with `XCircle` icon, red theme, rejection reason, and "Try Again" button that resets KYC to `not_started`.

**Navigation:** Each step has "Back" (except step 1) and "Continue"/"Submit" buttons at the bottom.

---

### 7.4 WalletsSection

**File:** `components/settings/sections/WalletsSection.tsx`

```typescript
interface WalletsSectionProps {
  onClose: () => void;
  onSaved: () => void;
}
```

**UI layout:**

1. **Header area**
   - Title: "Saved Withdrawal Addresses"
   - Subtitle: `{addresses.length}/10 addresses saved`
   - "Add Address" button (primary style) -- disabled when at 10.

2. **Address list**
   - Each address row is a card:
     - Network badge (SettingsBadge with `variant="info"`, text = network name)
     - Label (bold white, text-sm)
     - Address (font-mono, text-xs, text-dark-400, truncated with ellipsis)
     - Created date (text-xs, text-dark-500)
     - Delete button (Trash2 icon from lucide, text-dark-500 hover:text-red-400)
   - Row Tailwind: `flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700`
   - Empty state: when no addresses, show centered illustration-like text: "No saved addresses yet" with description "Add withdrawal addresses for quick transfers".

3. **Add Address form** (appears below button or in a sub-section when "Add Address" is clicked)
   - `SettingsFormInput` for Label (placeholder "e.g., My Binance", maxLength 30)
   - `SettingsFormSelect` for Network (options: `ETH - Ethereum`, `BTC - Bitcoin`, `TRX - Tron`, `SOL - Solana`, `BNB - BNB Chain`)
   - `SettingsFormInput` for Address (placeholder "Enter wallet address", font-mono for the input text)
   - Address validation per network:
     - ETH/BNB: starts with `0x`, 42 chars
     - BTC: starts with `1`, `3`, or `bc1`, 26-62 chars
     - TRX: starts with `T`, 34 chars
     - SOL: 32-44 chars base58
   - "Save Address" / "Cancel" buttons
   - On save: call `addWalletAddress()`, toast.success("Address saved"), refresh list.

4. **Delete address:** clicking delete icon opens `ConfirmationModal` with `isDangerous=true`, confirms removal.

---

### 7.5 NotificationsSection

**File:** `components/settings/sections/NotificationsSection.tsx`

```typescript
interface NotificationsSectionProps {
  onClose: () => void;
  onSaved: () => void;
}
```

**UI layout:**

1. **Notification Email**
   - `SettingsFormInput` with `label="Notification Email"`, `type="email"`
   - Hint: "All notifications will be sent to this email"
   - Validation: valid email format

2. **Toggle list** (3 toggles, using `SettingsToggle`):
   - Trade Alerts: label="Trade Alerts", description="Get notified when your bots execute trades"
   - Security Alerts: label="Security Alerts", description="Login attempts and account changes"
   - Weekly Report: label="Weekly Report", description="Performance summary every Monday"

3. **SettingsFormActions** -- Save / Cancel

**State flow:**
1. On mount: load from `getNotificationSettings()`.
2. Edit email / toggle switches.
3. Save: validate email, call `saveNotificationSettings()`, toast.success("Notifications updated"), onSaved(), onClose().

---

### 7.6 PreferencesSection

**File:** `components/settings/sections/PreferencesSection.tsx`

```typescript
interface PreferencesSectionProps {
  onClose: () => void;
  onSaved: () => void;
}
```

**UI layout:**

1. **Language** -- `SettingsFormSelect`
   - Options: `{ value: 'en', label: 'English' }`, `{ value: 'ru', label: 'Russian' }`

2. **Currency** -- `SettingsFormSelect`
   - Options: `{ value: 'USD', label: 'USD - US Dollar' }`, `{ value: 'EUR', label: 'EUR - Euro' }`, `{ value: 'RUB', label: 'RUB - Russian Ruble' }`

3. **Theme** -- Two button cards (same pattern as current page)
   - Dark (selected, with `Moon` icon) -- always selected for MVP.
   - Light (disabled, with `Sun` icon) -- shows "Coming soon" text below.
   - Selected card: `bg-primary-500/20 border-2 border-primary-500/30`
   - Unselected card: `bg-dark-800/50 border-2 border-dark-700 opacity-50 cursor-not-allowed`
   - Cards: `px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2`

4. **SettingsFormActions** -- Save / Cancel

**State flow:**
- Same load/edit/save pattern as Notifications.
- On save: toast.success("Preferences saved"), onSaved(), onClose().

---

## 8. STATE MANAGEMENT PATTERN

### 8.1 Data Loading Pattern

The main `SettingsPage` component loads summary data for all 6 bento cards on mount:

```typescript
// In page.tsx
const [settingsData, setSettingsData] = useState<AllSettings | null>(null);

useEffect(() => {
  const profile = getProfileSettings();
  const security = getSecuritySettings();
  const kyc = getKYCData();
  const wallets = getWalletsSettings();
  const notifications = getNotificationSettings();
  const preferences = getPreferencesSettings();

  setSettingsData({ profile, security, kyc, wallets, notifications, preferences });
}, []);
```

`refreshSettings()` function reloads all data -- called by sections' `onSaved` callback.

### 8.2 Drawer Open/Close State

```typescript
const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);

// Bento card onClick:
const openSection = (id: SettingsSectionId) => setActiveSection(id);

// Drawer onClose:
const closeSection = () => setActiveSection(null);
```

### 8.3 Dirty Detection (per section)

Each section that has Save/Cancel buttons tracks dirty state internally:

```typescript
// Inside a section component:
const [initialData, setInitialData] = useState<T>(/* loaded from service */);
const [formData, setFormData] = useState<T>(/* copy of initial */);

const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
```

`SettingsFormActions.isDisabled` receives `!isDirty`.

### 8.4 Save/Cancel Flow

**Save:**
1. Validate all fields.
2. If validation fails: show `toast.error()` with specific message. Do NOT close drawer.
3. If validation passes: call service `save*()` function.
4. Show `toast.success()`.
5. Call `onSaved()` (parent refreshes bento card data).
6. Call `onClose()` (parent closes drawer).

**Cancel:**
1. If dirty, revert form to `initialData`.
2. Close drawer (call `onClose()`).
3. No toast needed for cancel.

### 8.5 Toast Messages

All toast messages must use `useToast()` from `context/ToastContext.tsx`.

| Action | Type | Message | Description (optional) |
|--------|------|---------|----------------------|
| Profile saved | success | "Profile updated" | -- |
| Password changed | success | "Password changed" | "Your password has been updated successfully" |
| 2FA enabled | success | "2FA enabled" | "Your account is now more secure" |
| 2FA disabled | warning | "2FA disabled" | "Your account is less secure without 2FA" |
| Session revoked | success | "Session revoked" | -- |
| KYC step completed | info | "Step completed" | "Moving to next step" |
| KYC submitted | success | "Documents submitted" | "We'll review your documents within 1-3 days" |
| KYC approved (mock) | success | "Identity verified" | "Your account is now fully verified" |
| Address saved | success | "Address saved" | -- |
| Address removed | success | "Address removed" | -- |
| Notifications saved | success | "Notifications updated" | -- |
| Preferences saved | success | "Preferences saved" | -- |
| Validation error | error | (specific message) | (specific detail) |
| Wallet limit reached | error | "Limit reached" | "Maximum 10 addresses allowed" |
| Invalid address format | error | "Invalid address" | "Please check the wallet address format" |

---

## 9. IMPLEMENTATION ORDER

The developer should implement in this exact order, verifying each step compiles before moving on.

### Phase 1: Foundation (do first)

**Step 1:** Create type definitions.
- Create `lib/settings/settingsTypes.ts` with all interfaces from Section 4.1.
- Create `lib/settings/settingsDefaults.ts` with all defaults from Section 4.2.
- **Verify:** TypeScript compiles, no errors.

**Step 2:** Create settings service.
- Create `lib/settings/settingsService.ts` with all functions from Section 4.3.
- **Verify:** Import and call `getProfileSettings()` from a temp test -- should return defaults.

**Step 3:** Create shared UI components (all 6).
- Create all files from Section 3 (FormInput, FormTextarea, FormSelect, Toggle, Badge, FormActions).
- **Verify:** Each component can be imported without errors.

### Phase 2: Shell (layout without content)

**Step 4:** Create SettingsDrawer component.
- Implement Section 6 fully (responsive detection, overlay, animations, body scroll lock, Escape key).
- **Verify:** Can open/close drawer by setting `isOpen` prop.

**Step 5:** Create SettingsBentoCard component.
- Implement Section 5.2 (card component with hover and stagger animation).
- **Verify:** Renders a single card with mock data.

**Step 6:** Rewrite `page.tsx` with bento grid + drawer orchestration.
- Remove all old code from `page.tsx`.
- Implement Section 5.1 (grid layout) using SettingsBentoCard.
- Wire up `activeSection` state to open drawer.
- Render placeholder `<div>Section: {activeSection}</div>` inside drawer.
- Wire up `settingsData` loading from service (Section 8.1).
- Wire up card status previews (Section 5.3).
- **Verify:** Page shows 6 cards with real data from localStorage defaults. Clicking opens drawer with placeholder text.

### Phase 3: Sections (implement each)

**Step 7:** ProfileSection.
- Implement Section 7.1. Wire into page.tsx.
- **Verify:** Can edit and save profile. Data persists across page reload.

**Step 8:** SecuritySection.
- Implement Section 7.2. Wire into page.tsx.
- **Verify:** Can toggle 2FA on/off, see backup codes, revoke sessions.

**Step 9:** KYCSection.
- Implement Section 7.3. Wire into page.tsx. Import and use existing `Stepper`.
- **Verify:** Can walk through all 4 KYC steps, mock approval works.

**Step 10:** WalletsSection.
- Implement Section 7.4. Wire into page.tsx.
- **Verify:** Can add/delete addresses, validation works, limit of 10 enforced.

**Step 11:** NotificationsSection.
- Implement Section 7.5. Wire into page.tsx.
- **Verify:** Can change email and toggles, persists.

**Step 12:** PreferencesSection.
- Implement Section 7.6. Wire into page.tsx.
- **Verify:** Can change language/currency, theme is locked to dark.

### Phase 4: Polish

**Step 13:** End-to-end verification.
- Reload page -- all bento card previews show correct current data.
- Open each drawer, verify all data loads correctly.
- Edit and save each section, verify bento card preview updates.
- Test on narrow viewport (mobile bottom sheet behavior).
- Check all toast messages fire correctly.
- Verify `Escape` closes drawer.
- Verify overlay click closes drawer.
- Run `npm run build` to verify no TypeScript errors.
- Run `npm run lint` to verify no lint errors.

---

## APPENDIX A: Component Import Map

For quick reference, here is exactly what each file imports:

**page.tsx:**
```
framer-motion: motion
react: useState, useEffect, useCallback
lucide-react: User, Shield, FileCheck, Wallet, Bell, Settings
components/settings/SettingsBentoCard
components/settings/SettingsDrawer
components/settings/sections/ProfileSection
components/settings/sections/SecuritySection
components/settings/sections/KYCSection
components/settings/sections/WalletsSection
components/settings/sections/NotificationsSection
components/settings/sections/PreferencesSection
lib/settings/settingsService: all get* functions
lib/settings/settingsTypes: SettingsSectionId, AllSettings
```

**SettingsDrawer.tsx:**
```
framer-motion: motion, AnimatePresence
react: useEffect, useState, useRef, useCallback
lucide-react: X
```

**SettingsBentoCard.tsx:**
```
framer-motion: motion
lucide-react: ChevronRight
```

**ProfileSection.tsx:**
```
react: useState, useEffect
components/settings/SettingsFormInput
components/settings/SettingsFormTextarea
components/settings/SettingsFormActions
context/ToastContext: useToast
lib/settings/settingsService: getProfileSettings, saveProfileSettings
lib/users: updateUser
```

**SecuritySection.tsx:**
```
react: useState, useEffect
lucide-react: Laptop, Smartphone, Check, X
components/settings/SettingsToggle
components/settings/SettingsBadge
components/settings/SettingsFormInput
components/dashboard-v2/ConfirmationModal: ConfirmationModal
context/ToastContext: useToast
lib/settings/settingsService: getSecuritySettings, enable2FA, disable2FA, revokeSession
```

**KYCSection.tsx:**
```
react: useState, useEffect
lucide-react: Upload, CheckCircle, XCircle, Clock
components/ui/Stepper
components/settings/SettingsFormInput
components/settings/SettingsFormSelect
components/settings/SettingsBadge
context/ToastContext: useToast
lib/settings/settingsService: getKYCData, saveKYCData, submitKYCForReview, mockApproveKYC
lib/settings/settingsTypes: KYCStatus, KYCData
```

**WalletsSection.tsx:**
```
react: useState, useEffect
lucide-react: Plus, Trash2
components/settings/SettingsFormInput
components/settings/SettingsFormSelect
components/settings/SettingsBadge
components/dashboard-v2/ConfirmationModal: ConfirmationModal
context/ToastContext: useToast
lib/settings/settingsService: getWalletsSettings, addWalletAddress, removeWalletAddress
lib/settings/settingsTypes: NetworkType, SavedWalletAddress
```

**NotificationsSection.tsx:**
```
react: useState, useEffect
components/settings/SettingsFormInput
components/settings/SettingsToggle
components/settings/SettingsFormActions
context/ToastContext: useToast
lib/settings/settingsService: getNotificationSettings, saveNotificationSettings
```

**PreferencesSection.tsx:**
```
react: useState, useEffect
lucide-react: Moon, Sun
components/settings/SettingsFormSelect
components/settings/SettingsFormActions
context/ToastContext: useToast
lib/settings/settingsService: getPreferencesSettings, savePreferencesSettings
```

---

## APPENDIX B: lucide-react Icons Used

Complete list of icons needed across all settings files:

```
User, Shield, FileCheck, Wallet, Bell, Settings, ChevronRight,
X, Laptop, Smartphone, Check, Moon, Sun, Upload, CheckCircle,
XCircle, Clock, Plus, Trash2, ChevronDown, Lock
```

All imported from `lucide-react`.

---

## APPENDIX C: Responsive Breakpoints Summary

| Component | Mobile (<768px) | Tablet (768-1023px) | Desktop (>=1024px) |
|-----------|-----------------|---------------------|-------------------|
| Bento Grid | 1 column | 2 columns | 3 columns |
| Drawer | Bottom sheet, 90vh | Right drawer, 480px | Right drawer, 480px |
| Card padding | p-4 | p-5 | p-5 |
| Page padding | p-4 | p-4 | p-8 |
