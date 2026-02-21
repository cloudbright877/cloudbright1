'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label ?? value;

  return (
    <div className="mb-0">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
        {label}
      </label>

      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(prev => !prev)}
          className={`
            w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-dark-900/50 border rounded-lg
            text-gray-900 dark:text-white text-left transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 dark:hover:border-dark-600'}
            ${error
              ? 'border-red-500/50'
              : 'border-gray-200 dark:border-dark-700'
            }
          `}
        >
          <span>{selectedLabel}</span>
          <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-dark-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute z-[9999] top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 dark:text-dark-500 mt-1.5">{hint}</p>}
    </div>
  );
}
