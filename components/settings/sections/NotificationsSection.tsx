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
    tradeAlerts: true,
    securityAlerts: true,
    weeklyReport: false,
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
    return <div className="text-white">Loading...</div>;
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

      {/* Toggle List */}
      <div className="space-y-4 mb-6">
        <SettingsToggle
          label="Trade Alerts"
          description="Get notified when your bots execute trades"
          checked={formData.tradeAlerts}
          onChange={(checked) => setFormData({ ...formData, tradeAlerts: checked })}
        />

        <SettingsToggle
          label="Security Alerts"
          description="Login attempts and account changes"
          checked={formData.securityAlerts}
          onChange={(checked) => setFormData({ ...formData, securityAlerts: checked })}
        />

        <SettingsToggle
          label="Weekly Report"
          description="Performance summary every Monday"
          checked={formData.weeklyReport}
          onChange={(checked) => setFormData({ ...formData, weeklyReport: checked })}
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
