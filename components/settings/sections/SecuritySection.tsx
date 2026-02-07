'use client';

import { useState, useEffect } from 'react';
import { Laptop, Smartphone, Check } from 'lucide-react';
import { SettingsBadge } from '../SettingsBadge';
import { SettingsFormInput } from '../SettingsFormInput';
import { ConfirmationModal } from '@/components/dashboard-v2/ConfirmationModal';
import { useToast } from '@/context/ToastContext';
import {
  getSecuritySettings,
  enable2FA,
  disable2FA,
  revokeSession,
} from '@/lib/settings/settingsService';
import type { SecuritySettings } from '@/lib/settings/settingsTypes';

interface SecuritySectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

export function SecuritySection({ onSaved }: SecuritySectionProps) {
  const toast = useToast();
  const [securityData, setSecurityData] = useState<SecuritySettings | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secret, setSecret] = useState('');
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getSecuritySettings();
    setSecurityData(data);
  };

  const handleChangePassword = () => {
    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.current !== 'password123') {
      toast.error('Current password is incorrect');
      return;
    }

    toast.success('Password changed successfully');
    setShowPasswordForm(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleEnable2FA = () => {
    const result = enable2FA();
    setSecret(result.secret);
    setBackupCodes(result.backupCodes);
    setShow2FASetup(true);
  };

  const handleConfirm2FA = () => {
    toast.success('2FA enabled', 'Your account is now more secure');
    setShow2FASetup(false);
    loadData();
    onSaved?.();
  };

  const handleDisable2FA = () => {
    setShowDisable2FAModal(true);
  };

  const confirmDisable2FA = () => {
    disable2FA();
    toast.warning('2FA disabled', 'Your account is less secure without 2FA');
    setShowDisable2FAModal(false);
    loadData();
    onSaved?.();
  };

  const handleRevokeSession = (sessionId: string) => {
    revokeSession(sessionId);
    toast.success('Session revoked');
    loadData();
    onSaved?.();
  };

  if (!securityData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Change Password Block */}
      <div className="mb-6 p-5 bg-dark-800/50 rounded-xl border border-dark-700">
        <h3 className="text-base font-bold text-white mb-3">Change Password</h3>

        {!showPasswordForm ? (
          <button
            type="button"
            onClick={() => setShowPasswordForm(true)}
            className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm"
          >
            Change Password
          </button>
        ) : (
          <div>
            <div className="mb-4">
              <SettingsFormInput
                label="Current Password"
                type="password"
                value={passwordForm.current}
                onChange={(value) => setPasswordForm({ ...passwordForm, current: value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="mb-4">
              <SettingsFormInput
                label="New Password"
                type="password"
                value={passwordForm.new}
                onChange={(value) => setPasswordForm({ ...passwordForm, new: value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-4">
              <SettingsFormInput
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirm}
                onChange={(value) => setPasswordForm({ ...passwordForm, confirm: value })}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordForm({ current: '', new: '', confirm: '' });
                }}
                className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                Save Password
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication Block */}
      <div className="mb-6 p-5 bg-dark-800/50 rounded-xl border border-dark-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-dark-400">Add an extra layer of security to your account</p>
          </div>
          <SettingsBadge
            variant={securityData.twoFactorEnabled ? 'success' : 'warning'}
            text={securityData.twoFactorEnabled ? '2FA On' : '2FA Off'}
          />
        </div>

        {!securityData.twoFactorEnabled && !show2FASetup && (
          <button
            type="button"
            onClick={handleEnable2FA}
            className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm"
          >
            Enable 2FA
          </button>
        )}

        {show2FASetup && (
          <div>
            <div className="text-center p-8 bg-dark-800 rounded-xl border-2 border-dashed border-dark-600 mb-4">
              <p className="text-dark-400 mb-2">QR Code placeholder</p>
              <p className="font-mono text-primary-400 text-sm">{secret}</p>
            </div>

            <p className="text-sm text-dark-300 font-medium mb-3">Backup Codes (save these securely)</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="font-mono text-sm bg-dark-800 rounded-lg px-3 py-2 text-center text-white"
                >
                  {code}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleConfirm2FA}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              I have saved my backup codes
            </button>
          </div>
        )}

        {securityData.twoFactorEnabled && !show2FASetup && (
          <button
            type="button"
            onClick={handleDisable2FA}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all text-sm"
          >
            Disable 2FA
          </button>
        )}
      </div>

      {/* Active Sessions Block */}
      <div className="mb-6 p-5 bg-dark-800/50 rounded-xl border border-dark-700">
        <h3 className="text-base font-bold text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {securityData.sessions.map((session) => {
            const isMobile = session.device.includes('iPhone') || session.device.includes('Android') || session.device.includes('Mobile');
            const Icon = isMobile ? Smartphone : Laptop;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="font-semibold text-white text-sm">{session.device}</div>
                    <div className="text-xs text-dark-400">
                      {session.location} • {session.isCurrent ? 'Current session' : 'Active'}
                    </div>
                  </div>
                </div>
                {session.isCurrent ? (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Active now
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Disable 2FA Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDisable2FAModal}
        onClose={() => setShowDisable2FAModal(false)}
        onConfirm={confirmDisable2FA}
        title="Disable 2FA?"
        description="This will remove the extra security layer from your account."
        bulletPoints={[
          'Anyone with your password can access your account',
          'You will need to re-enable 2FA to protect your account',
        ]}
        confirmText="Disable 2FA"
        isDangerous={true}
      />
    </div>
  );
}
