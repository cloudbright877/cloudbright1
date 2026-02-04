'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface SubLink {
  name: string;
  href: string;
  description?: string;
  icon?: string;
}

interface NavLink {
  name: string;
  href?: string;
  subLinks?: SubLink[];
}

const navLinks: NavLink[] = [
  {
    name: 'Company',
    subLinks: [
      { name: 'About Us', href: '/about', description: 'Learn about our mission and team', icon: '/menu/About.svg' },
      { name: 'Affiliate Program', href: '/affiliate', description: 'Earn with our partnership', icon: '/menu/Affiliate.svg' },
    ],
  },
  {
    name: 'Product',
    subLinks: [
      { name: 'Services', href: '/services', description: 'AI-powered trading solutions', icon: '/menu/Services.svg' },
      { name: 'Security', href: '/security', description: 'Your funds protected', icon: '/menu/Security.svg' },
      { name: 'Performance', href: '/performance', description: 'Track record & metrics', icon: '/menu/Performance.svg' },
    ],
  },
  {
    name: 'Resources',
    subLinks: [
      { name: 'Blog', href: '/blog', description: 'Latest insights & updates', icon: '/menu/Blog.svg' },
      { name: 'Help Center', href: '/help-center', description: 'Get support & answers', icon: '/menu/Help-center.svg' },
      { name: 'Contact Us', href: '/contact', description: 'Get in touch with us', icon: '/menu/Contacts.svg' },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              CELESTIAN
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.href ? (
                  <a
                    href={link.href}
                    className="text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                ) : (
                  <button
                    className="text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium flex items-center gap-1"
                  >
                    {link.name}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {link.subLinks && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-700 overflow-hidden"
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subLink.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 border-b border-gray-100 dark:border-dark-700 last:border-b-0"
                        >
                          {subLink.icon && (
                            <div className="flex-shrink-0 w-[46px] h-[46px] flex items-center justify-center">
                              <Image
                                src={subLink.icon}
                                alt={subLink.name}
                                width={46}
                                height={46}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {subLink.name}
                            </div>
                            {subLink.description && (
                              <div className="text-sm text-gray-500 dark:text-dark-300 mt-0.5">
                                {subLink.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="px-6 py-2.5 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300">
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
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <div key={index}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium py-2 block"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                          className="text-gray-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium py-2 flex items-center justify-between w-full"
                        >
                          {link.name}
                          <svg
                            className={`w-4 h-4 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {link.subLinks && activeDropdown === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 flex flex-col gap-2 mt-2"
                            >
                              {link.subLinks.map((subLink, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subLink.href}
                                  className="flex items-center gap-3 text-gray-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 py-2"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subLink.icon && (
                                    <div className="flex-shrink-0 w-[46px] h-[46px] flex items-center justify-center">
                                      <Image
                                        src={subLink.icon}
                                        alt={subLink.name}
                                        width={46}
                                        height={46}
                                      />
                                    </div>
                                  )}
                                  <span>{subLink.name}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-dark-800">
                  <div className="flex justify-start gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                  <Link href="/login" className="px-6 py-2.5 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-medium text-left" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-lg transition-all duration-300 text-center" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
