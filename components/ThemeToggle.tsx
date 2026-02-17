'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' } = {}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return variant === 'mobile' ? <div className="h-10 w-full" /> : <div className="w-10 h-10" />;
  }

  const sunIcon = (
    <svg
      className={variant === 'mobile' ? 'w-5 h-5 text-primary-500 dark:text-primary-400' : 'w-6 h-6 text-primary-500 dark:text-primary-400'}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const moonIcon = (
    <svg
      className={variant === 'mobile' ? 'w-5 h-5 text-primary-600 dark:text-primary-400' : 'w-6 h-6 text-primary-600 dark:text-primary-400'}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-dark-200 font-medium transition-colors duration-300"
        aria-label="Toggle theme"
      >
        <div className="flex items-center gap-2">
          {theme === 'dark' ? sunIcon : moonIcon}
          <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className={`w-11 h-6 flex items-center rounded-full px-0.5 transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? sunIcon : moonIcon}
    </button>
  );
}
