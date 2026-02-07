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
