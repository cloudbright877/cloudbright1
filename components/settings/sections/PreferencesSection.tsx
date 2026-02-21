'use client';

import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { SettingsFormSelect, type SelectOption } from '../SettingsFormSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsFormActions } from '../SettingsFormActions';
import { useToast } from '@/context/ToastContext';
import {
  getPreferencesSettings,
  savePreferencesSettings,
} from '@/lib/settings/settingsService';
import type { PreferencesSettings, Theme } from '@/lib/settings/settingsTypes';

interface PreferencesSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

const LANGUAGES = [
  { value: 'en', label: 'English', flag: 'us' },
  { value: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: 'ru' },
  { value: 'de', label: 'Deutsch', flag: 'de' },
  { value: 'fr', label: 'Fran\u00E7ais', flag: 'fr' },
  { value: 'es', label: 'Espa\u00F1ol', flag: 'es' },
  { value: 'ja', label: '\u65E5\u672C\u8A9E', flag: 'jp' },
  { value: 'zh', label: '\u4E2D\u6587', flag: 'cn' },
  { value: 'ko', label: '\uD55C\uAD6D\uC5B4', flag: 'kr' },
];

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'KRW', label: 'KRW - Korean Won' },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

export function PreferencesSection({ onSaved }: PreferencesSectionProps) {
  const toast = useToast();
  const [initialData, setInitialData] = useState<PreferencesSettings | null>(null);
  const [formData, setFormData] = useState<PreferencesSettings>({
    language: 'en',
    currency: 'USD',
    theme: 'dark',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getPreferencesSettings();
    // Sync with actual theme from localStorage (ThemeToggle may have changed it)
    const currentTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    const synced = { ...data, theme: currentTheme };
    setInitialData(synced);
    setFormData(synced);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
  const selectedLang = LANGUAGES.find((l) => l.value === formData.language) || LANGUAGES[0];

  const handleThemeChange = (theme: Theme) => {
    setFormData({ ...formData, theme });
    // Apply immediately for instant visual feedback
    applyTheme(theme);
  };

  const handleSave = () => {
    setIsSaving(true);

    try {
      savePreferencesSettings(formData);
      applyTheme(formData.theme);
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
      // Revert theme to initial
      applyTheme(initialData.theme);
    }
  };

  if (!initialData) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Language */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Language</label>
        <div ref={langRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg hover:border-gray-300 dark:hover:border-dark-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`fi fi-${selectedLang.flag} rounded-sm text-lg`} />
              <span className="text-gray-900 dark:text-white">{selectedLang.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-dark-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute z-[9999] top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden"
              >
                {LANGUAGES.map((lang) => {
                  const isSelected = lang.value === formData.language;
                  return (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, language: lang.value as any });
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        isSelected
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`fi fi-${lang.flag} rounded-sm text-lg`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                        {lang.label}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-3">Theme</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              formData.theme === 'dark'
                ? 'bg-primary-500/20 border-2 border-primary-500/30 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-dark-800/50 border-2 border-gray-200 dark:border-dark-700 text-gray-600 dark:text-dark-400 hover:border-primary-500/20'
            }`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              formData.theme === 'light'
                ? 'bg-primary-500/20 border-2 border-primary-500/30 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-dark-800/50 border-2 border-gray-200 dark:border-dark-700 text-gray-600 dark:text-dark-400 hover:border-primary-500/20'
            }`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
        </div>
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
