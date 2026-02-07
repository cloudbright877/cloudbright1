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
