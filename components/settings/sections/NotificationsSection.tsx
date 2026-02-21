'use client';

import { useState, useEffect } from 'react';
import { SettingsFormInput } from '../SettingsFormInput';
import { SettingsToggle } from '../SettingsToggle';
import { SettingsFormActions } from '../SettingsFormActions';
import { useToast } from '@/context/ToastContext';
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@/lib/settings/settingsService';
import type { NotificationSettings } from '@/lib/settings/settingsTypes';

interface NotificationsSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

export function NotificationsSection({ onClose, onSaved }: NotificationsSectionProps) {
  const toast = useToast();
  const [initialData, setInitialData] = useState<NotificationSettings | null>(null);
  const [formData, setFormData] = useState<NotificationSettings>({
    email: '',
    loginAlerts: true,
    withdrawalConfirmations: true,
    securityChanges: true,
    weeklyReport: false,
    promoLetters: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = getNotificationSettings();
    setInitialData(data);
    setFormData(data);
  }, []);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);

    try {
      saveNotificationSettings(formData);
      toast.success('Notifications updated');
      setInitialData(formData);
      onSaved?.();
    } catch (error) {
      toast.error('Failed to save notifications', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
    }
    setErrors({});
    onClose?.();
  };

  if (!initialData) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Notification Email */}
      <div className="mb-6">
        <SettingsFormInput
          label="Notification Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="your.email@example.com"
          error={errors.email}
          hint="All notifications will be sent to this email"
        />
      </div>

      {/* Security Emails */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Security Emails</h4>
        <p className="text-xs text-gray-500 dark:text-dark-500">Stay informed about account security events</p>
      </div>
      <div className="space-y-4 mb-6">
        <SettingsToggle
          label="Login Alerts"
          description="Email when a new device logs into your account"
          checked={formData.loginAlerts}
          onChange={(checked) => setFormData({ ...formData, loginAlerts: checked })}
        />

        <SettingsToggle
          label="Withdrawal Confirmations"
          description="Email confirmation required for all withdrawals"
          checked={formData.withdrawalConfirmations}
          onChange={(checked) => setFormData({ ...formData, withdrawalConfirmations: checked })}
        />

        <SettingsToggle
          label="Security Changes"
          description="Password resets, 2FA and account setting changes"
          checked={formData.securityChanges}
          onChange={(checked) => setFormData({ ...formData, securityChanges: checked })}
        />
      </div>

      {/* Reports */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Reports</h4>
        <p className="text-xs text-gray-500 dark:text-dark-500">Periodic performance summaries</p>
      </div>
      <div className="space-y-4 mb-6">
        <SettingsToggle
          label="Weekly Report"
          description="Performance summary every Monday"
          checked={formData.weeklyReport}
          onChange={(checked) => setFormData({ ...formData, weeklyReport: checked })}
        />
      </div>

      {/* Promo */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Promotional</h4>
        <p className="text-xs text-gray-500 dark:text-dark-500">Offers, updates, and platform news</p>
      </div>
      <div className="space-y-4 mb-6">
        <SettingsToggle
          label="Promo Letters"
          description="Special offers, new features, and platform updates"
          checked={formData.promoLetters}
          onChange={(checked) => setFormData({ ...formData, promoLetters: checked })}
        />
      </div>

      {/* Actions */}
      <SettingsFormActions
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        isDisabled={!isDirty}
      />
    </div>
  );
}
