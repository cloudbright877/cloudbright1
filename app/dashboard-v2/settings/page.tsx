'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'notifications' | 'security' | 'trading' | 'preferences'>('profile');

  // Mock user data
  const [profileData, setProfileData] = useState({
    displayName: 'John Pro',
    username: 'john_pro',
    bio: 'Professional crypto trader since 2021. Focus on low-risk strategies with consistent returns.',
    avatar: 'J',
  });

  const [accountData, setAccountData] = useState({
    email: 'john.pro@example.com',
    phone: '+1 (555) 123-4567',
    verified: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    tradeAlerts: true,
    botUpdates: true,
    whaleAlerts: false,
    weeklyReport: true,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    apiKeysCount: 2,
  });

  const [tradingSettings, setTradingSettings] = useState({
    autoRebalance: false,
    riskLimit: 'medium',
    dailyLossLimit: 5,
    maxBotsActive: 5,
    copyWhales: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'UTC-5',
    theme: 'dark',
  });

  const sections = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'account', label: '🔐 Account', icon: '🔐' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'security', label: '🛡️ Security', icon: '🛡️' },
    { id: 'trading', label: '🤖 Trading', icon: '🤖' },
    { id: 'preferences', label: '⚙️ Preferences', icon: '⚙️' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </motion.div>

      {/* Layout: Sidebar + Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 sticky top-6">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg font-medium transition-all
                    ${activeSection === section.id
                      ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                    }
                  `}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label.replace(/^[^ ]+ /, '')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

                {/* Avatar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {profileData.avatar}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm">
                        Change Avatar
                      </button>
                      <p className="text-xs text-dark-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Username */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Username</label>
                  <div className="flex items-center gap-2">
                    <span className="text-dark-500">@</span>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-xs text-dark-500 mt-2">Your public profile URL: celestian.com/@{profileData.username}</p>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  />
                  <p className="text-xs text-dark-500 mt-2">{profileData.bio.length}/500 characters</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3">
                  <button className="px-6 py-3 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                      className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                    />
                    {accountData.verified && (
                      <span className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
                  <button className="px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-400 hover:text-white hover:border-dark-600 transition-all">
                    Change Password
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                  <h3 className="text-lg font-bold text-red-400 mb-3">Danger Zone</h3>
                  <p className="text-sm text-dark-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all">
                    Delete Account
                  </button>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-6 py-3 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  {/* Email Alerts */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Email Alerts</div>
                      <div className="text-sm text-dark-400">Receive email notifications about your account</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, emailAlerts: !notificationSettings.emailAlerts })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.emailAlerts ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.emailAlerts ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Push Notifications</div>
                      <div className="text-sm text-dark-400">Get push notifications on desktop and mobile</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, pushNotifications: !notificationSettings.pushNotifications })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.pushNotifications ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.pushNotifications ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Trade Alerts */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Trade Alerts</div>
                      <div className="text-sm text-dark-400">Notify when your bots execute trades</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, tradeAlerts: !notificationSettings.tradeAlerts })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.tradeAlerts ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.tradeAlerts ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Bot Updates */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Bot Updates</div>
                      <div className="text-sm text-dark-400">Algorithm updates and performance changes</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, botUpdates: !notificationSettings.botUpdates })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.botUpdates ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.botUpdates ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Whale Alerts */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">🐋 Whale Alerts</div>
                      <div className="text-sm text-dark-400">Get notified of large investor movements</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, whaleAlerts: !notificationSettings.whaleAlerts })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.whaleAlerts ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.whaleAlerts ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Weekly Report */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Weekly Performance Report</div>
                      <div className="text-sm text-dark-400">Summary of your portfolio every Monday</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, weeklyReport: !notificationSettings.weeklyReport })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.weeklyReport ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.weeklyReport ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                    <div>
                      <div className="font-semibold text-white">Marketing Emails</div>
                      <div className="text-sm text-dark-400">Tips, news, and promotional content</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, marketingEmails: !notificationSettings.marketingEmails })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${notificationSettings.marketingEmails ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${notificationSettings.marketingEmails ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-6 py-3 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

                {/* Two-Factor Authentication */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-dark-400">Add an extra layer of security to your account</p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${securitySettings.twoFactorEnabled
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                      }
                    `}>
                      {securitySettings.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all">
                    {securitySettings.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </button>
                </div>

                {/* Login Alerts */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Login Alerts</h3>
                      <p className="text-sm text-dark-400">Get notified of new login attempts</p>
                    </div>
                    <button
                      onClick={() => setSecuritySettings({ ...securitySettings, loginAlerts: !securitySettings.loginAlerts })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${securitySettings.loginAlerts ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${securitySettings.loginAlerts ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>
                </div>

                {/* API Keys */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">API Keys</h3>
                      <p className="text-sm text-dark-400">Manage your API keys for trading bots</p>
                    </div>
                    <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-xs font-bold text-primary-400">
                      {securitySettings.apiKeysCount} active
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all">
                    Manage API Keys
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">💻 Chrome on Windows</div>
                        <div className="text-xs text-dark-400">New York, USA • Current session</div>
                      </div>
                      <span className="text-xs text-green-400">Active now</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">📱 iPhone</div>
                        <div className="text-xs text-dark-400">New York, USA • 2 hours ago</div>
                      </div>
                      <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trading Section */}
            {activeSection === 'trading' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Trading Preferences</h2>

                {/* Auto-Rebalance */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Auto-Rebalance Portfolio</h3>
                      <p className="text-sm text-dark-400">Automatically rebalance your portfolio weekly</p>
                    </div>
                    <button
                      onClick={() => setTradingSettings({ ...tradingSettings, autoRebalance: !tradingSettings.autoRebalance })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${tradingSettings.autoRebalance ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${tradingSettings.autoRebalance ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>
                </div>

                {/* Risk Limit */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-3">Default Risk Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setTradingSettings({ ...tradingSettings, riskLimit: level })}
                        className={`
                          px-4 py-3 rounded-lg font-semibold transition-all capitalize
                          ${tradingSettings.riskLimit === level
                            ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                            : 'bg-dark-900/50 border border-dark-700 text-dark-400 hover:text-white'
                          }
                        `}
                      >
                        {level === 'low' && '⚠️'} {level === 'medium' && '⚠️⚠️'} {level === 'high' && '⚠️⚠️⚠️'} {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Loss Limit */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-3">Daily Loss Limit (%)</label>
                  <input
                    type="number"
                    value={tradingSettings.dailyLossLimit}
                    onChange={(e) => setTradingSettings({ ...tradingSettings, dailyLossLimit: Number(e.target.value) })}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-dark-500 mt-2">Stop all bots if daily loss exceeds this percentage</p>
                </div>

                {/* Max Bots Active */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-3">Max Active Bots</label>
                  <input
                    type="number"
                    value={tradingSettings.maxBotsActive}
                    onChange={(e) => setTradingSettings({ ...tradingSettings, maxBotsActive: Number(e.target.value) })}
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-dark-500 mt-2">Maximum number of bots running simultaneously</p>
                </div>

                {/* Copy Whales */}
                <div className="mb-6 p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">🐋 Auto-Copy Whales</h3>
                      <p className="text-sm text-dark-400">Automatically copy whale strategies above $50k</p>
                    </div>
                    <button
                      onClick={() => setTradingSettings({ ...tradingSettings, copyWhales: !tradingSettings.copyWhales })}
                      className={`
                        relative w-14 h-8 rounded-full transition-colors
                        ${tradingSettings.copyWhales ? 'bg-primary-500' : 'bg-dark-700'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${tradingSettings.copyWhales ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-6 py-3 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">App Preferences</h2>

                {/* Language */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="ja">🇯🇵 日本語</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Display Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="RUB">RUB - Russian Ruble</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="UTC-8">UTC-8 (Pacific Time)</option>
                    <option value="UTC-5">UTC-5 (Eastern Time)</option>
                    <option value="UTC+0">UTC+0 (London)</option>
                    <option value="UTC+3">UTC+3 (Moscow)</option>
                    <option value="UTC+8">UTC+8 (Singapore)</option>
                    <option value="UTC+9">UTC+9 (Tokyo)</option>
                  </select>
                </div>

                {/* Theme */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                      className={`
                        px-4 py-3 rounded-lg font-semibold transition-all
                        ${preferences.theme === 'dark'
                          ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                          : 'bg-dark-900/50 border border-dark-700 text-dark-400 hover:text-white'
                        }
                      `}
                    >
                      🌙 Dark
                    </button>
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                      className={`
                        px-4 py-3 rounded-lg font-semibold transition-all
                        ${preferences.theme === 'light'
                          ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                          : 'bg-dark-900/50 border border-dark-700 text-dark-400 hover:text-white'
                        }
                      `}
                    >
                      ☀️ Light
                    </button>
                  </div>
                  <p className="text-xs text-dark-500 mt-2">Light theme coming soon</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-6 py-3 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
