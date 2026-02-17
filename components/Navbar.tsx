'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  BarChart3,
  Store,
  BookOpen,
  HelpCircle,
  Users,
  Phone,
  Gift,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface NavChild {
  name: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavPlainLink {
  name: string;
  href: string;
}

interface NavDropdown {
  name: string;
  children: NavChild[];
}

type NavItem = NavPlainLink | NavDropdown;

function isDropdown(item: NavItem): item is NavDropdown {
  return 'children' in item;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Products',
    children: [
      {
        name: 'Services',
        href: '/services',
        description: 'Copy-trading solutions',
        icon: BarChart3,
      },
      {
        name: 'Marketplace',
        href: '/marketplace',
        description: 'Browse top bots',
        icon: Store,
      },
    ],
  },
  {
    name: 'Company',
    children: [
      {
        name: 'About',
        href: '/about',
        description: 'Our story & team',
        icon: Users,
      },
      {
        name: 'Contacts',
        href: '/contact',
        description: 'Get in touch',
        icon: Phone,
      },
      {
        name: 'Affiliate',
        href: '/affiliate',
        description: 'Partner program',
        icon: Gift,
      },
    ],
  },
  {
    name: 'Resources',
    children: [
      {
        name: 'Blog',
        href: '/blog',
        description: 'News & insights',
        icon: BookOpen,
      },
      {
        name: 'Help Center',
        href: '/help-center',
        description: 'Guides & FAQ',
        icon: HelpCircle,
      },
    ],
  },
];

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavDropdown;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGroupActive = item.children.some(
    (child) =>
      pathname === child.href ||
      (child.href !== '/' && pathname.startsWith(child.href))
  );

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 font-medium transition-colors duration-300 ${
          isGroupActive
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400'
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.name}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
          >
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-lg shadow-black/5 dark:shadow-black/20 min-w-[240px] py-2">
              {item.children.map((child) => {
                const Icon = child.icon;
                const isActive =
                  pathname === child.href ||
                  (child.href !== '/' && pathname.startsWith(child.href));

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-400'
                        : 'hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-dark-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{child.name}</div>
                      <div className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                        {child.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileAccordion({
  item,
  pathname,
  onNavigate,
}: {
  item: NavDropdown;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium py-2"
      >
        {item.name}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 flex flex-col gap-1 pb-2">
              {item.children.map((child) => {
                const Icon = child.icon;
                const isActive =
                  pathname === child.href ||
                  (child.href !== '/' && pathname.startsWith(child.href));

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-400'
                        : 'text-gray-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{child.name}</div>
                      <div className="text-xs text-gray-500 dark:text-dark-400">
                        {child.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo2.svg"
              alt="Cloudbright"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-gray-900 dark:text-white font-semibold" style={{ fontSize: '1.25rem', letterSpacing: '0.07rem', transform: 'scaleY(0.88)', transformOrigin: 'center' }}>
              CLOUDBRIGHT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <DesktopDropdown
                  key={item.name}
                  item={item}
                  pathname={pathname}
                />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="px-6 py-2.5 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:scale-105 active:scale-95 transition-all duration-200">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200 dark:border-dark-800"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) =>
                  isDropdown(item) ? (
                    <MobileAccordion
                      key={item.name}
                      item={item}
                      pathname={pathname}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`font-medium py-2 block transition-colors duration-300 ${
                        pathname === item.href
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
                <div className="flex flex-col gap-1 pt-4 border-t border-gray-200 dark:border-dark-800">
                  <ThemeToggle variant="mobile" />
                  <LanguageSwitcher variant="mobile" />
                  <div className="flex gap-3">
                    <Link href="/login" className="flex-1 py-2.5 border border-gray-300 dark:border-dark-600 rounded-xl font-semibold text-gray-700 dark:text-white hover:border-primary-500 dark:hover:border-primary-400 active:scale-95 transition-all duration-200 text-center" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/register" className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:scale-105 active:scale-95 transition-all duration-200 text-center" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
