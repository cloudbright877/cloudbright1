'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import toast from 'react-hot-toast';
import TwoFactorModal from '@/components/profile/TwoFactorModal';
import DeactivateModal from '@/components/profile/DeactivateModal';
import { countries } from 'countries-list';

type Tab = 'personal' | 'security' | 'preferences';

interface Authenticator2FAData {
  code: string;
  qrCode: string;
  enabled: boolean;
}

interface UserProfile {
  username: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  telegram: string;
  preferredCurrency: string;
  language: string;
  avatar: string | null;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  username: 'johndoe',
  email: 'john@example.com',
  name: 'John Doe',
  phone: '+1 234 567 8900',
  country: 'United States',
  telegram: '@johndoe',
  preferredCurrency: 'USDT',
  language: 'en',
  avatar: null,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [saving, setSaving] = useState(false);

  // 2FA Modal States
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDeactivate2FA, setShowDeactivate2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [is2FALoading, setIs2FALoading] = useState(false);

  // 2FA Data
  const [authenticatorData, setAuthenticatorData] = useState<Authenticator2FAData | null>(null);
  const [has2FA, setHas2FA] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  const [formData, setFormData] = useState({
    name: DEFAULT_USER_PROFILE.name,
    email: DEFAULT_USER_PROFILE.email,
    phone: DEFAULT_USER_PROFILE.phone,
    country: DEFAULT_USER_PROFILE.country,
    telegram: DEFAULT_USER_PROFILE.telegram,
  });

  const [emailNotifications, setEmailNotifications] = useState({
    referralActivity: true,
    newsletter: true,
    deposit: true,
    withdrawal: true,
    twoFactorEnabled: true,
    twoFactorDisabled: true,
    newLogin: true,
    passwordChange: true,
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  // Get country list as array for select
  const countryList = Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.name,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const handleOpen2FASetup = () => {
    const mockAuthData: Authenticator2FAData = {
      code: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,mock-qr-code',
      enabled: false,
    };
    setAuthenticatorData(mockAuthData);
    setShow2FASetup(true);
  };

  const handleEnable2FA = () => {
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setIs2FALoading(true);

    setTimeout(() => {
      toast.success('2FA enabled successfully!');
      setHas2FA(true);
      setShow2FASetup(false);
      setTwoFACode('');
      setIs2FALoading(false);
    }, 1000);
  };

  const handleDisable2FA = () => {
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setIs2FALoading(true);

    setTimeout(() => {
      toast.success('2FA disabled successfully!');
      setHas2FA(false);
      setShowDeactivate2FA(false);
      setTwoFACode('');
      setIs2FALoading(false);
    }, 1000);
  };

  const handleSave = () => {
    setSaving(true);

    setTimeout(() => {
      toast.success('Profile updated successfully!');

      setUserProfile({
        ...userProfile,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        telegram: formData.telegram,
      });
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-dark-300">Manage your account settings and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="flex items-center gap-2 p-2 bg-dark-900/50 backdrop-blur-sm rounded-2xl border-2 border-dark-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === 'personal' && (
          <GlassCard>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={userProfile.username}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-dark-700 rounded-xl text-dark-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Email
                    <span className="ml-2 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                      Verified ✓
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-dark-700 rounded-xl text-dark-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a country</option>
                    {countryList.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    placeholder="@username"
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'security' && (
          <GlassCard>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-white mb-2">Security Settings</h3>
              <p className="text-dark-400 mb-6">Manage your account security and authentication</p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
                  <div className="text-left">
                    <div className="font-medium text-white">Two-Factor Authentication</div>
                    <div className="text-sm text-dark-400">
                      {has2FA ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <button
                    onClick={has2FA ? () => setShowDeactivate2FA(true) : handleOpen2FASetup}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      has2FA
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
                    }`}
                  >
                    {has2FA ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Language</h3>
              <select className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white focus:border-primary-500 focus:outline-none transition-colors">
                <option value="en">🇬🇧 English</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Security Notifications</h3>
              <p className="text-sm text-dark-400 mb-6">Important security alerts (recommended to keep enabled)</p>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🔐
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">2FA Enabled</div>
                      <div className="text-xs text-dark-400">Get notified when 2FA is activated on your account</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.twoFactorEnabled}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, twoFactorEnabled: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🔓
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">2FA Disabled</div>
                      <div className="text-xs text-dark-400">Get notified when 2FA is deactivated on your account</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.twoFactorDisabled}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, twoFactorDisabled: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🌐
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">New Device Login</div>
                      <div className="text-xs text-dark-400">Get notified when your account is accessed from a new device</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.newLogin}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, newLogin: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🔑
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">Password Change</div>
                      <div className="text-xs text-dark-400">Get notified when your password is changed</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.passwordChange}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, passwordChange: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Transaction Notifications</h3>
              <p className="text-sm text-dark-400 mb-6">Get notified about your financial activities</p>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      💳
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">Deposit Notifications</div>
                      <div className="text-xs text-dark-400">Get notified when your deposits are credited</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.deposit}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, deposit: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      💸
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">Withdrawal Notifications</div>
                      <div className="text-xs text-dark-400">Get notified about withdrawal status updates</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.withdrawal}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, withdrawal: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      🎁
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">Referral Transactions</div>
                      <div className="text-xs text-dark-400">Get notified when your referrals create investments</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.referralActivity}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, referralActivity: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Marketing & Updates</h3>
              <p className="text-sm text-dark-400 mb-6">Stay informed about new features and promotions</p>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border-2 border-dark-700 cursor-pointer hover:border-primary-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      📧
                    </div>
                    <div>
                      <div className="font-medium text-white mb-0.5">Newsletter</div>
                      <div className="text-xs text-dark-400">Receive updates about new features and promotions</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications.newsletter}
                    onChange={(e) => setEmailNotifications({ ...emailNotifications, newsletter: e.target.checked })}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                </label>
              </div>
            </GlassCard>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSaving(true);
                  setTimeout(() => {
                    toast.success('Preferences saved successfully!');
                    setSaving(false);
                  }, 1000);
                }}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {show2FASetup && authenticatorData && (
          <TwoFactorModal
            isOpen={show2FASetup}
            onClose={() => {
              setShow2FASetup(false);
              setTwoFACode('');
            }}
            authenticatorData={authenticatorData}
            code={twoFACode}
            setCode={setTwoFACode}
            onSubmit={handleEnable2FA}
            isLoading={is2FALoading}
          />
        )}

        {showDeactivate2FA && (
          <DeactivateModal
            isOpen={showDeactivate2FA}
            onClose={() => {
              setShowDeactivate2FA(false);
              setTwoFACode('');
            }}
            code={twoFACode}
            setCode={setTwoFACode}
            onSubmit={handleDisable2FA}
            isLoading={is2FALoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
