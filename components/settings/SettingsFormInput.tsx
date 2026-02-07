'use client';

import { useId } from 'react';

interface SettingsFormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  disabled?: boolean;
  error?: string;
  hint?: string;
  prefix?: string;
  maxLength?: number;
  showCharCount?: boolean;
  rightElement?: React.ReactNode;
}

export function SettingsFormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  hint,
  prefix,
  maxLength,
  showCharCount = false,
  rightElement,
}: SettingsFormInputProps) {
  const id = useId();

  const inputClasses = `
    w-full px-4 py-3 bg-dark-900/50 border rounded-xl text-white placeholder-dark-500
    focus:outline-none focus:ring-1 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    ${
      error
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-dark-700 focus:border-primary-500 focus:ring-primary-500/20'
    }
  `.trim();

  return (
    <div className="mb-0">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-dark-300">
          {label}
        </label>
        {rightElement}
      </div>

      {prefix ? (
        <div className="flex items-center">
          <span className="text-dark-500 mr-1">{prefix}</span>
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={inputClasses}
          />
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={inputClasses}
        />
      )}

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-dark-500 mt-1.5">{hint}</p>}
      {showCharCount && maxLength && (
        <p className="text-xs text-dark-500 mt-1.5">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
