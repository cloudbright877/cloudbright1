'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Language {
  code: string;
  name: string;
  countryCode: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'de', name: 'Deutsch', countryCode: 'de' },
  { code: 'fr', name: 'Français', countryCode: 'fr' },
  { code: 'zh', name: '中文', countryCode: 'cn' },
  { code: 'hi', name: 'हिन्दी', countryCode: 'in' },
  { code: 'cs', name: 'Čeština', countryCode: 'cz' },
  { code: 'ru', name: 'Русский', countryCode: 'ru' },
];

function FlagIcon({ countryCode, className = '' }: { countryCode: string; className?: string }) {
  return (
    <span
      className={`fi fi-${countryCode} inline-block ${className}`}
      style={{ fontSize: '1.25em', lineHeight: 1 }}
    />
  );
}

export default function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' } = {}) {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setIsOpen(false);
    console.log('Language changed to:', lang.code);
  };

  if (variant === 'mobile') {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-dark-200 font-medium transition-colors duration-300"
          aria-label="Change language"
        >
          <div className="flex items-center gap-2">
            <FlagIcon countryCode={currentLang.countryCode} />
            <span className="text-sm">{currentLang.name}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 pb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                      currentLang.code === lang.code
                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-400'
                        : 'text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <FlagIcon countryCode={lang.countryCode} />
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
        aria-label="Change language"
      >
        <FlagIcon countryCode={currentLang.countryCode} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden z-50"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-150 ${
                    currentLang.code === lang.code
                      ? 'bg-gray-50 dark:bg-dark-700'
                      : ''
                  }`}
                >
                  <FlagIcon countryCode={lang.countryCode} />
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                    {lang.name}
                  </span>
                  {currentLang.code === lang.code && (
                    <svg
                      className="ml-auto w-4 h-4 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
