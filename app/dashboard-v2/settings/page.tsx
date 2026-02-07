'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  User,
  Shield,
  FileCheck,
  Wallet,
  Bell,
  Settings,
  ChevronRight,
  Lock,
  Laptop,
  Smartphone,
  Check,
} from 'lucide-react';
import { SettingsBadge } from '@/components/settings/SettingsBadge';
import {
  getProfileSettings,
  getSecuritySettings,
  getKYCData,
  getWalletsSettings,
  getNotificationSettings,
  getPreferencesSettings,
} from '@/lib/settings/settingsService';
import type { AllSettings } from '@/lib/settings/settingsTypes';

export default function SettingsPage() {
  const [data, setData] = useState<AllSettings | null>(null);

  useEffect(() => {
    setData({
      profile: getProfileSettings(),
      security: getSecuritySettings(),
      kyc: getKYCData(),
      wallets: getWalletsSettings(),
      notifications: getNotificationSettings(),
      preferences: getPreferencesSettings(),
    });
  }, []);

  if (!data) return null;

  const kycBadge = {
    not_started: { variant: 'neutral' as const, text: 'Not Started' },
    personal_info: { variant: 'info' as const, text: 'In Progress' },
    documents: { variant: 'info' as const, text: 'In Progress' },
    selfie: { variant: 'info' as const, text: 'In Progress' },
    under_review: { variant: 'warning' as const, text: 'Under Review' },
    approved: { variant: 'success' as const, text: 'Verified' },
    rejected: { variant: 'error' as const, text: 'Rejected' },
  }[data.kyc.status] || { variant: 'neutral' as const, text: 'Not Started' };

  const enabledNotifs = [data.notifications.tradeAlerts, data.notifications.securityAlerts, data.notifications.weeklyReport].filter(Boolean).length;

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Settings</h1>
            <p className="text-dark-400">Manage your account settings and preferences</p>
          </div>
        </motion.div>

        {/* Bento Grid - 12 columns like main dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Profile Card - col-span-4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="md:col-span-1 lg:col-span-4"
          >
            <Link href="/dashboard-v2/settings/profile" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Profile</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {data.profile.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{data.profile.displayName}</p>
                    <p className="text-sm text-dark-400 truncate">@{data.profile.username}</p>
                  </div>
                </div>
                {data.profile.bio && (
                  <p className="text-xs text-dark-500 line-clamp-2">{data.profile.bio}</p>
                )}
              </div>
            </Link>
          </motion.div>

          {/* Security Card - col-span-4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 lg:col-span-4"
          >
            <Link href="/dashboard-v2/settings/security" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Security</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-dark-400" />
                      <span className="text-sm text-dark-300">Two-Factor Auth</span>
                    </div>
                    <SettingsBadge
                      variant={data.security.twoFactorEnabled ? 'success' : 'warning'}
                      text={data.security.twoFactorEnabled ? 'On' : 'Off'}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-dark-400" />
                      <span className="text-sm text-dark-300">Active Sessions</span>
                    </div>
                    <span className="text-sm text-dark-400">{data.security.sessions.length}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* KYC Card - col-span-4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-1 lg:col-span-4"
          >
            <Link href="/dashboard-v2/settings/kyc" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Verification</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <SettingsBadge variant={kycBadge.variant} text={kycBadge.text} size="md" />
                </div>
                <p className="text-xs text-dark-500">
                  {data.kyc.status === 'approved'
                    ? `Verified on ${data.kyc.reviewedAt ? new Date(data.kyc.reviewedAt).toLocaleDateString() : 'N/A'}`
                    : data.kyc.status === 'not_started'
                    ? 'Complete identity verification to unlock withdrawals'
                    : data.kyc.status === 'under_review'
                    ? 'Your documents are being reviewed'
                    : 'Continue your verification process'}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Wallets Card - col-span-5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 lg:col-span-5"
          >
            <Link href="/dashboard-v2/settings/wallets" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Saved Wallets</h3>
                      <p className="text-xs text-dark-400">{data.wallets.addresses.length}/10 addresses</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                {data.wallets.addresses.length === 0 ? (
                  <p className="text-xs text-dark-500">No saved addresses. Add withdrawal addresses for quick transfers.</p>
                ) : (
                  <div className="space-y-2">
                    {data.wallets.addresses.slice(0, 3).map((addr) => (
                      <div key={addr.id} className="flex items-center gap-2 p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                        <SettingsBadge variant="info" text={addr.network} size="sm" />
                        <span className="text-xs text-white font-medium truncate">{addr.label}</span>
                        <span className="text-xs text-dark-500 font-mono truncate ml-auto">{addr.address.slice(0, 6)}...{addr.address.slice(-4)}</span>
                      </div>
                    ))}
                    {data.wallets.addresses.length > 3 && (
                      <p className="text-xs text-dark-500">+{data.wallets.addresses.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>

          {/* Notifications Card - col-span-4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="md:col-span-1 lg:col-span-4"
          >
            <Link href="/dashboard-v2/settings/notifications" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Trade Alerts', on: data.notifications.tradeAlerts },
                    { label: 'Security Alerts', on: data.notifications.securityAlerts },
                    { label: 'Weekly Report', on: data.notifications.weeklyReport },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                      <span className="text-xs text-dark-300">{item.label}</span>
                      <div className={`w-2 h-2 rounded-full ${item.on ? 'bg-green-400' : 'bg-dark-600'}`} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-dark-500 mt-3">{enabledNotifs}/3 enabled</p>
              </div>
            </Link>
          </motion.div>

          {/* Preferences Card - col-span-3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 lg:col-span-3"
          >
            <Link href="/dashboard-v2/settings/preferences" className="block h-full">
              <div className="h-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Preferences</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">Language</span>
                    <span className="text-xs text-white font-medium">{data.preferences.language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">Currency</span>
                    <span className="text-xs text-white font-medium">{data.preferences.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">Theme</span>
                    <span className="text-xs text-white font-medium">Dark</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
