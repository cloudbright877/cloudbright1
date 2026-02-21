'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Check, X, ShieldOff, Lock, KeyRound, Hash } from 'lucide-react';
import { SettingsBadge } from '../SettingsBadge';
import { SettingsFormInput } from '../SettingsFormInput';
import { useToast } from '@/context/ToastContext';
import {
  getSecuritySettings,
  enable2FA,
  disable2FA,
  enablePIN,
  disablePIN,
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
  const [disableForm, setDisableForm] = useState({ password: '', code: '' });
  const [disableErrors, setDisableErrors] = useState({ password: '', code: '' });
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [showPINSetup, setShowPINSetup] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinConfirmDigits, setPinConfirmDigits] = useState(['', '', '', '']);
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
  const [pinError, setPinError] = useState('');
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pinConfirmRefs = useRef<(HTMLInputElement | null)[]>([]);
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
    setDisableForm({ password: '', code: '' });
    setDisableErrors({ password: '', code: '' });
    setCodeDigits(['', '', '', '', '', '']);
    setShowDisable2FAModal(true);
  };

  const handleCodeDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    if (val && !/^\d$/.test(val)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = val;
    setCodeDigits(newDigits);
    setDisableForm((prev) => ({ ...prev, code: newDigits.join('') }));
    setDisableErrors((prev) => ({ ...prev, code: '' }));

    if (val && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setCodeDigits(newDigits);
    setDisableForm((prev) => ({ ...prev, code: newDigits.join('') }));
    setDisableErrors((prev) => ({ ...prev, code: '' }));
    const focusIdx = Math.min(pasted.length, 5);
    codeInputRefs.current[focusIdx]?.focus();
  };

  const confirmDisable2FA = () => {
    const errors = { password: '', code: '' };
    let hasError = false;

    if (!disableForm.password) {
      errors.password = 'Password is required';
      hasError = true;
    } else if (disableForm.password !== 'password123') {
      errors.password = 'Incorrect password';
      hasError = true;
    }

    const code = codeDigits.join('');
    if (code.length !== 6) {
      errors.code = 'Enter all 6 digits';
      hasError = true;
    } else if (code !== '000000') {
      errors.code = 'Invalid verification code';
      hasError = true;
    }

    if (hasError) {
      setDisableErrors(errors);
      return;
    }

    disable2FA();
    toast.warning('2FA disabled', 'Your account is less secure without 2FA');
    setShowDisable2FAModal(false);
    loadData();
    onSaved?.();
  };

  const handleStartPINSetup = () => {
    setPinDigits(['', '', '', '']);
    setPinConfirmDigits(['', '', '', '']);
    setPinStep('enter');
    setPinError('');
    setShowPINSetup(true);
  };

  const handlePinDigitChange = (
    index: number,
    val: string,
    digits: string[],
    setDigits: (d: string[]) => void,
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ) => {
    if (val.length > 1) val = val.slice(-1);
    if (val && !/^\d$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    setPinError('');

    if (val && index < 3) {
      refs.current?.[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    digits: string[],
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current?.[index - 1]?.focus();
    }
  };

  const handlePinContinue = () => {
    const pin = pinDigits.join('');
    if (pin.length !== 4) {
      setPinError('Enter all 4 digits');
      return;
    }
    setPinStep('confirm');
    setPinConfirmDigits(['', '', '', '']);
    setTimeout(() => pinConfirmRefs.current?.[0]?.focus(), 100);
  };

  const handlePinConfirm = () => {
    const pin = pinDigits.join('');
    const confirm = pinConfirmDigits.join('');
    if (confirm.length !== 4) {
      setPinError('Enter all 4 digits');
      return;
    }
    if (pin !== confirm) {
      setPinError('PIN codes do not match');
      setPinConfirmDigits(['', '', '', '']);
      setTimeout(() => pinConfirmRefs.current?.[0]?.focus(), 100);
      return;
    }
    enablePIN(pin);
    toast.success('PIN enabled', 'Your withdrawal PIN has been set');
    setShowPINSetup(false);
    loadData();
    onSaved?.();
  };

  const handleDisablePIN = () => {
    disablePIN();
    toast.warning('PIN disabled', 'Withdrawal PIN has been removed');
    loadData();
    onSaved?.();
  };

  const handleChangePIN = () => {
    handleStartPINSetup();
  };

  const handleRevokeSession = (sessionId: string) => {
    revokeSession(sessionId);
    toast.success('Session revoked');
    loadData();
    onSaved?.();
  };

  if (!securityData) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Change Password Block */}
      <div className="mb-6 p-5 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Change Password</h3>

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
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-dark-500 transition-all text-sm"
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
      <div className="mb-6 p-5 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 dark:text-dark-400">Add an extra layer of security to your account</p>
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
            <div className="text-center p-8 bg-gray-100 dark:bg-dark-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-600 mb-4">
              <p className="text-gray-500 dark:text-dark-400 mb-2">QR Code placeholder</p>
              <p className="font-mono text-primary-400 text-sm">{secret}</p>
            </div>

            <p className="text-sm text-gray-700 dark:text-dark-300 font-medium mb-3">Backup Codes (save these securely)</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="font-mono text-sm bg-gray-100 dark:bg-dark-800 rounded-lg px-3 py-2 text-center text-gray-900 dark:text-white"
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

      {/* Withdrawal PIN Block */}
      <div className="mb-6 p-5 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Withdrawal PIN Code</h3>
            <p className="text-sm text-gray-600 dark:text-dark-400">4-digit PIN required for every withdrawal</p>
          </div>
          <SettingsBadge
            variant={securityData.pinEnabled ? 'success' : 'warning'}
            text={securityData.pinEnabled ? 'PIN On' : 'PIN Off'}
          />
        </div>

        {!securityData.pinEnabled && !showPINSetup && (
          <button
            type="button"
            onClick={handleStartPINSetup}
            className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm"
          >
            Set Up PIN
          </button>
        )}

        {securityData.pinEnabled && !showPINSetup && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleChangePIN}
              className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm"
            >
              Change PIN
            </button>
            <button
              type="button"
              onClick={handleDisablePIN}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all text-sm"
            >
              Disable PIN
            </button>
          </div>
        )}

        <AnimatePresence>
          {showPINSetup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 bg-gray-100 dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700">
                {pinStep === 'enter' ? (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-300 mb-3">
                      <Hash className="w-4 h-4" />
                      Enter new 4-digit PIN
                    </label>
                    <div className="flex gap-3 justify-center mb-4">
                      {pinDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { pinInputRefs.current[i] = el; }}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handlePinDigitChange(i, e.target.value, pinDigits, setPinDigits, pinInputRefs)}
                          onKeyDown={(e) => handlePinKeyDown(i, e, pinDigits, pinInputRefs)}
                          className={`w-14 h-14 text-center text-2xl font-bold bg-white dark:bg-dark-900/50 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-all ${
                            pinError
                              ? 'border-red-500/50 focus:border-red-500'
                              : 'border-gray-300 dark:border-dark-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                          }`}
                        />
                      ))}
                    </div>
                    {pinError && <p className="text-xs text-red-400 text-center mb-3">{pinError}</p>}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPINSetup(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-dark-500 transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handlePinContinue}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-300 mb-3">
                      <Hash className="w-4 h-4" />
                      Confirm your PIN
                    </label>
                    <div className="flex gap-3 justify-center mb-4">
                      {pinConfirmDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { pinConfirmRefs.current[i] = el; }}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handlePinDigitChange(i, e.target.value, pinConfirmDigits, setPinConfirmDigits, pinConfirmRefs)}
                          onKeyDown={(e) => handlePinKeyDown(i, e, pinConfirmDigits, pinConfirmRefs)}
                          className={`w-14 h-14 text-center text-2xl font-bold bg-white dark:bg-dark-900/50 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-all ${
                            pinError
                              ? 'border-red-500/50 focus:border-red-500'
                              : 'border-gray-300 dark:border-dark-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                          }`}
                        />
                      ))}
                    </div>
                    {pinError && <p className="text-xs text-red-400 text-center mb-3">{pinError}</p>}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setPinStep('enter'); setPinError(''); }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-dark-500 transition-all text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePinConfirm}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                      >
                        Confirm PIN
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Sessions Block */}
      <div className="mb-6 p-5 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-200 dark:border-dark-700">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {securityData.sessions.map((session) => {
            const isMobile = session.device.includes('iPhone') || session.device.includes('Android') || session.device.includes('Mobile');
            const Icon = isMobile ? Smartphone : Laptop;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{session.device}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-400">
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

      {/* Disable 2FA Verification Modal */}
      <AnimatePresence>
        {showDisable2FAModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisable2FAModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Danger glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl opacity-50" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <ShieldOff className="w-5 h-5 text-red-400" />
                      </div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Disable 2FA</h2>
                    </div>
                    <button
                      onClick={() => setShowDisable2FAModal(false)}
                      className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600 flex items-center justify-center text-gray-400 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-sm text-gray-600 dark:text-dark-300 leading-relaxed">
                      To disable two-factor authentication, verify your identity by entering your password and the current code from your authenticator app.
                    </p>

                    {/* Password */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <input
                        type="password"
                        value={disableForm.password}
                        onChange={(e) => {
                          setDisableForm((prev) => ({ ...prev, password: e.target.value }));
                          setDisableErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="Enter your password"
                        className={`w-full px-4 py-3 bg-white dark:bg-dark-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none transition-all ${
                          disableErrors.password
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-gray-300 dark:border-dark-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                        }`}
                      />
                      {disableErrors.password && (
                        <p className="text-xs text-red-400 mt-1.5">{disableErrors.password}</p>
                      )}
                    </div>

                    {/* 6-digit code */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        <KeyRound className="w-4 h-4" />
                        Authenticator Code
                      </label>
                      <div className="flex gap-2 justify-between" onPaste={handleCodePaste}>
                        {codeDigits.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { codeInputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeDigitChange(i, e.target.value)}
                            onKeyDown={(e) => handleCodeKeyDown(i, e)}
                            className={`w-full aspect-square max-w-[52px] text-center text-xl font-bold bg-white dark:bg-dark-900/50 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-all ${
                              disableErrors.code
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-gray-300 dark:border-dark-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
                            }`}
                          />
                        ))}
                      </div>
                      {disableErrors.code && (
                        <p className="text-xs text-red-400 mt-1.5">{disableErrors.code}</p>
                      )}
                    </div>

                    {/* Warning */}
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <ul className="space-y-2">
                        <li className="text-sm text-red-400/90 flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          <span>Anyone with your password can access your account</span>
                        </li>
                        <li className="text-sm text-red-400/90 flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          <span>You will need to re-enable 2FA to protect your account</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-dark-700">
                    <button
                      onClick={() => setShowDisable2FAModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600 rounded-lg font-semibold text-gray-700 dark:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDisable2FA}
                      className="relative flex-1 group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
                      <div className="relative px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold text-white shadow-lg">
                        Disable 2FA
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
