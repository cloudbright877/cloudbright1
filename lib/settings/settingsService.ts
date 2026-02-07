import type {
  ProfileSettings,
  SecuritySettings,
  KYCData,
  WalletsSettings,
  NotificationSettings,
  PreferencesSettings,
  SavedWalletAddress,
  KYCStatus,
} from './settingsTypes';

import {
  DEFAULT_PROFILE,
  DEFAULT_SECURITY,
  DEFAULT_KYC,
  DEFAULT_WALLETS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PREFERENCES,
} from './settingsDefaults';

// ==========================================
// localStorage Keys
// ==========================================
const KEYS = {
  PROFILE: 'celestian_settings_profile',
  SECURITY: 'celestian_settings_security',
  KYC: 'celestian_settings_kyc',
  WALLETS: 'celestian_settings_wallets',
  NOTIFICATIONS: 'celestian_settings_notifications',
  PREFERENCES: 'celestian_settings_preferences',
};

// ==========================================
// Generic Helpers (Private)
// ==========================================

function readSettings<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return { ...defaultValue, ...parsed };
  } catch {
    return defaultValue;
  }
}

function writeSettings<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// Profile
// ==========================================

export function getProfileSettings(): ProfileSettings {
  return readSettings(KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfileSettings(data: Partial<ProfileSettings>): ProfileSettings {
  const current = getProfileSettings();
  const updated = { ...current, ...data };
  writeSettings(KEYS.PROFILE, updated);
  return updated;
}

// ==========================================
// Security
// ==========================================

export function getSecuritySettings(): SecuritySettings {
  return readSettings(KEYS.SECURITY, DEFAULT_SECURITY);
}

export function saveSecuritySettings(data: Partial<SecuritySettings>): SecuritySettings {
  const current = getSecuritySettings();
  const updated = { ...current, ...data };
  writeSettings(KEYS.SECURITY, updated);
  return updated;
}

// Generate mock TOTP secret (16-char base32)
function generateMockSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Generate 8 backup codes (8-char alphanumeric)
function generateBackupCodes(): string[] {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }
  return codes;
}

export function enable2FA(): { secret: string; backupCodes: string[] } {
  const secret = generateMockSecret();
  const backupCodes = generateBackupCodes();
  saveSecuritySettings({
    twoFactorEnabled: true,
    twoFactorSecret: secret,
    backupCodes,
  });
  return { secret, backupCodes };
}

export function disable2FA(): void {
  saveSecuritySettings({
    twoFactorEnabled: false,
    twoFactorSecret: null,
    backupCodes: [],
  });
}

export function revokeSession(sessionId: string): void {
  const current = getSecuritySettings();
  const updated = {
    ...current,
    sessions: current.sessions.filter((s) => s.id !== sessionId),
  };
  writeSettings(KEYS.SECURITY, updated);
}

// ==========================================
// KYC
// ==========================================

export function getKYCData(): KYCData {
  return readSettings(KEYS.KYC, DEFAULT_KYC);
}

export function saveKYCData(data: Partial<KYCData>): KYCData {
  const current = getKYCData();
  const updated = { ...current, ...data };
  writeSettings(KEYS.KYC, updated);
  return updated;
}

export function advanceKYCStep(currentStatus: KYCStatus): KYCStatus {
  const statusMap: Record<KYCStatus, KYCStatus> = {
    not_started: 'personal_info',
    personal_info: 'documents',
    documents: 'selfie',
    selfie: 'under_review',
    under_review: 'under_review', // stays in review
    approved: 'approved',
    rejected: 'rejected',
  };
  return statusMap[currentStatus];
}

export function submitKYCForReview(): KYCData {
  return saveKYCData({
    status: 'under_review',
    submittedAt: Date.now(),
  });
}

export function mockApproveKYC(): KYCData {
  return saveKYCData({
    status: 'approved',
    reviewedAt: Date.now(),
  });
}

// ==========================================
// Wallets
// ==========================================

export function getWalletsSettings(): WalletsSettings {
  return readSettings(KEYS.WALLETS, DEFAULT_WALLETS);
}

export function addWalletAddress(
  address: Omit<SavedWalletAddress, 'id' | 'createdAt'>
): SavedWalletAddress {
  const current = getWalletsSettings();
  if (current.addresses.length >= 10) {
    throw new Error('Maximum 10 addresses allowed');
  }
  const newAddress: SavedWalletAddress = {
    ...address,
    id: `wallet_${Date.now()}`,
    createdAt: Date.now(),
  };
  const updated = {
    addresses: [...current.addresses, newAddress],
  };
  writeSettings(KEYS.WALLETS, updated);
  return newAddress;
}

export function removeWalletAddress(addressId: string): void {
  const current = getWalletsSettings();
  const updated = {
    addresses: current.addresses.filter((a) => a.id !== addressId),
  };
  writeSettings(KEYS.WALLETS, updated);
}

export function updateWalletAddress(
  addressId: string,
  data: Partial<SavedWalletAddress>
): SavedWalletAddress {
  const current = getWalletsSettings();
  const index = current.addresses.findIndex((a) => a.id === addressId);
  if (index === -1) {
    throw new Error('Address not found');
  }
  const updatedAddress = { ...current.addresses[index], ...data };
  const addresses = [...current.addresses];
  addresses[index] = updatedAddress;
  writeSettings(KEYS.WALLETS, { addresses });
  return updatedAddress;
}

// ==========================================
// Notifications
// ==========================================

export function getNotificationSettings(): NotificationSettings {
  return readSettings(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
}

export function saveNotificationSettings(
  data: Partial<NotificationSettings>
): NotificationSettings {
  const current = getNotificationSettings();
  const updated = { ...current, ...data };
  writeSettings(KEYS.NOTIFICATIONS, updated);
  return updated;
}

// ==========================================
// Preferences
// ==========================================

export function getPreferencesSettings(): PreferencesSettings {
  return readSettings(KEYS.PREFERENCES, DEFAULT_PREFERENCES);
}

export function savePreferencesSettings(
  data: Partial<PreferencesSettings>
): PreferencesSettings {
  const current = getPreferencesSettings();
  const updated = { ...current, ...data };
  writeSettings(KEYS.PREFERENCES, updated);
  return updated;
}
