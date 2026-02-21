'use client';

import { useId } from 'react';

interface SettingsFormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export function SettingsFormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength = 500,
  disabled = false,
  error,
  hint,
}: SettingsFormTextareaProps) {
  const id = useId();

  const textareaClasses = `
    w-full px-4 py-3 bg-white dark:bg-dark-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500
    focus:outline-none focus:ring-1 transition-colors resize-none
    disabled:opacity-50
    ${
      error
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 dark:border-dark-700 focus:border-primary-500 focus:ring-primary-500/20'
    }
  `.trim();

  return (
    <div className="mb-0">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={textareaClasses}
      />

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 dark:text-dark-500 mt-1.5">{hint}</p>}

      <p className="text-xs text-gray-500 dark:text-dark-500 mt-1.5">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
}
