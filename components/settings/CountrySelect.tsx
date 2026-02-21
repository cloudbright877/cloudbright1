'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const COUNTRY_LIST = Object.entries(countries.getNames('en', { select: 'official' }))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface CountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CountrySelect({ label, value, onChange, error, disabled }: CountrySelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && value && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [open, value]);

  const filtered = search
    ? COUNTRY_LIST.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRY_LIST;

  const selectedCountry = COUNTRY_LIST.find((c) => c.name === value);

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="mb-0" ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`
            w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-dark-900/50 border rounded-lg
            text-left transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 dark:hover:border-dark-600'}
            ${error
              ? 'border-red-500/50'
              : 'border-gray-200 dark:border-dark-700'
            }
          `}
        >
          <span className={selectedCountry ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-dark-500'}>
            {selectedCountry ? selectedCountry.name : 'Select country'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-dark-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute z-[9999] left-0 right-0 top-full mt-1 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden"
            >
              {/* Search */}
              <div className="p-2 border-b border-gray-200 dark:border-dark-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* List */}
              <div ref={listRef} className="max-h-52 overflow-y-auto overscroll-contain">
                {filtered.length > 0 ? (
                  filtered.map((country) => {
                    const isSelected = country.name === value;
                    return (
                      <button
                        key={country.code}
                        type="button"
                        data-selected={isSelected}
                        onClick={() => handleSelect(country.name)}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {country.name}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-dark-500">
                    No countries found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
