'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { SettingsFormSelect, type SelectOption } from '../SettingsFormSelect';
import { SettingsFormActions } from '../SettingsFormActions';
import { useToast } from '@/context/ToastContext';
import {
  getPreferencesSettings,
  savePreferencesSettings,
} from '@/lib/settings/settingsService';
import type { PreferencesSettings } from '@/lib/settings/settingsTypes';

interface PreferencesSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
];

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
];

export function PreferencesSection({ onSaved }: PreferencesSectionProps) {
  const toast = useToast();
  const [initialData, setInitialData] = useState<PreferencesSettings | null>(null);
  const [formData, setFormData] = useState<PreferencesSettings>({
    language: 'en',
    currency: 'USD',
    theme: 'dark',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = getPreferencesSettings();
    setInitialData(data);
    setFormData(data);
  }, []);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSave = () => {
    setIsSaving(true);

    try {
      savePreferencesSettings(formData);
      toast.success('Preferences saved');
      setInitialData(formData);
      onSaved?.();
    } catch (error) {
      toast.error('Failed to save preferences', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
    }
    if (initialData) setFormData(initialData);
  };

  if (!initialData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Language */}
      <div className="mb-6">
        <SettingsFormSelect
          label="Language"
          value={formData.language}
          onChange={(value) => setFormData({ ...formData, language: value as any })}
          options={LANGUAGE_OPTIONS}
        />
      </div>

      {/* Currency */}
      <div className="mb-6">
        <SettingsFormSelect
          label="Currency"
          value={formData.currency}
          onChange={(value) => setFormData({ ...formData, currency: value as any })}
          options={CURRENCY_OPTIONS}
        />
      </div>

      {/* Theme */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-300 mb-3">Theme</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-primary-500/20 border-2 border-primary-500/30 text-white"
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
          <button
            type="button"
            disabled
            className="px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-dark-800/50 border-2 border-dark-700 text-dark-400 opacity-50 cursor-not-allowed"
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
        </div>
        <p className="text-xs text-dark-500 mt-2">Light theme coming soon</p>
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
