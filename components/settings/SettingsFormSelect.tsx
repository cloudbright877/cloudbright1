'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SettingsFormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export function SettingsFormSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error,
  hint,
}: SettingsFormSelectProps) {
  const id = useId();

  const selectClasses = `
    w-full px-4 py-3 bg-dark-900/50 border rounded-xl text-white
    focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer
    ${
      error
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-dark-700 focus:border-primary-500 focus:ring-primary-500/20'
    }
  `.trim();

  return (
    <div className="mb-0">
      <label htmlFor={id} className="block text-sm font-medium text-dark-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={selectClasses}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-900 text-white">
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
      </div>

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-dark-500 mt-1.5">{hint}</p>}
    </div>
  );
}
