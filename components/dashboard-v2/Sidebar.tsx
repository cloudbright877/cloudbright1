'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Home,
  Bot,
  Users,
  Fish,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageCircle,
  Gauge,
  ShieldCheck,
  HelpCircle,
  Wallet,
  Gift,
  Menu,
  X,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number | string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const NavItem = ({ href, icon, label, active, badge, onClick, isCollapsed }: NavItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group relative flex items-center rounded-xl
        transition-all duration-300
        ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'}
        ${active
          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-gray-900 dark:text-white'
          : 'text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800/50 border-2 border-transparent'
        }
      `}
    >
      {/* Icon */}
      <div className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        {icon}
      </div>

      {/* Label */}
      {!isCollapsed && label && (
        <span className="font-medium">{label}</span>
      )}

      {/* Badge */}
      {!isCollapsed && badge && (
        <span className="ml-auto px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
          {badge}
        </span>
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
    </Link>
  );
};

const NavDivider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-700 to-transparent my-4" />
);

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`
          hidden lg:flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          h-screen fixed left-0 top-0
          bg-gradient-to-b from-gray-50/95 to-gray-100/95 dark:from-dark-900/95 dark:to-dark-800/95
          backdrop-blur-sm border-r-2 border-gray-200 dark:border-dark-700
          transition-all duration-300 z-40
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-gray-200 dark:border-dark-700 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
          <Link href="/dashboard-v2" className="flex items-center gap-2.5 group" onClick={isCollapsed ? (e) => { e.preventDefault(); onToggle(); } : undefined}>
            <Image
              src="/logo2.svg"
              alt="CloudBright"
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="text-gray-900 dark:text-white font-semibold whitespace-nowrap" style={{ fontSize: '0.95rem', letterSpacing: '0.07rem', transform: 'scaleY(0.88)', transformOrigin: 'center' }}>
                CLOUDBRIGHT
              </span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="ml-auto p-1.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            href="/dashboard-v2"
            icon={<Gauge className="w-6 h-6" />}
            label="Dashboard"
            active={pathname === '/dashboard-v2'}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/analytics"
            icon={<BarChart3 className="w-6 h-6" />}
            label="Analytics"
            active={pathname?.startsWith('/dashboard-v2/analytics')}
            isCollapsed={isCollapsed}
          />

          <NavDivider />

          {!isCollapsed && (
            <div className="px-2 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-dark-500 uppercase tracking-wider">
                Finance
              </div>
            </div>
          )}

          <NavItem
            href="/dashboard-v2/wallets"
            icon={<Wallet className="w-6 h-6" />}
            label="Wallets"
            active={pathname?.startsWith('/dashboard-v2/wallets')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/referrals"
            icon={<Gift className="w-6 h-6" />}
            label="Referrals"
            active={pathname?.startsWith('/dashboard-v2/referrals')}
            isCollapsed={isCollapsed}
          />

          <NavDivider />

          {!isCollapsed && (
            <div className="px-2 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-dark-500 uppercase tracking-wider">
                Trading
              </div>
            </div>
          )}

          <NavItem
            href="/dashboard-v2/bots"
            icon={<Bot className="w-6 h-6" />}
            label="Bots"
            active={pathname?.startsWith('/dashboard-v2/bots')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/leaderboard"
            icon={<Users className="w-6 h-6" />}
            label="Leaderboard"
            active={pathname?.startsWith('/dashboard-v2/leaderboard') || pathname?.startsWith('/dashboard-v2/traders')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/feed"
            icon={<MessageCircle className="w-6 h-6" />}
            label="Social Feed"
            active={pathname?.startsWith('/dashboard-v2/feed')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/whales"
            icon={<Fish className="w-6 h-6" />}
            label="Whales"
            active={pathname?.startsWith('/dashboard-v2/whales')}
            isCollapsed={isCollapsed}
          />

          <NavDivider />

          {!isCollapsed && (
            <div className="px-2 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-dark-500 uppercase tracking-wider">
                System
              </div>
            </div>
          )}

          <NavItem
            href="/dashboard-v2/settings"
            icon={<Settings className="w-6 h-6" />}
            label="Settings"
            active={pathname?.startsWith('/dashboard-v2/settings')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/help"
            icon={<HelpCircle className="w-6 h-6" />}
            label="Help & FAQ"
            active={pathname?.startsWith('/dashboard-v2/help')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/admin/bots"
            icon={<ShieldCheck className="w-6 h-6" />}
            label="Bot Admin"
            active={pathname?.startsWith('/dashboard-v2/admin')}
            isCollapsed={isCollapsed}
          />
        </nav>

      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <MobileNav pathname={pathname} />
    </>
  );
}

/* ─── Mobile Navigation ─── */

const mobileMenuSections = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard-v2', icon: Gauge, label: 'Dashboard' },
      { href: '/dashboard-v2/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/dashboard-v2/wallets', icon: Wallet, label: 'Wallets' },
      { href: '/dashboard-v2/referrals', icon: Gift, label: 'Referrals' },
    ],
  },
  {
    label: 'Trading',
    items: [
      { href: '/dashboard-v2/bots', icon: Bot, label: 'Bots' },
      { href: '/dashboard-v2/leaderboard', icon: Users, label: 'Leaderboard' },
      { href: '/dashboard-v2/feed', icon: MessageCircle, label: 'Social Feed' },
      { href: '/dashboard-v2/whales', icon: Fish, label: 'Whales' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard-v2/settings', icon: Settings, label: 'Settings' },
      { href: '/dashboard-v2/help', icon: HelpCircle, label: 'Help & FAQ' },
      { href: '/dashboard-v2/admin/bots', icon: ShieldCheck, label: 'Bot Admin' },
    ],
  },
];

function isActiveLink(pathname: string | null, href: string) {
  if (href === '/dashboard-v2') return pathname === '/dashboard-v2';
  if (href === '/dashboard-v2/leaderboard') {
    return pathname?.startsWith('/dashboard-v2/leaderboard') || pathname?.startsWith('/dashboard-v2/traders');
  }
  return pathname?.startsWith(href);
}

function MobileNav({ pathname }: { pathname: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // "More" is active when current page isn't one of the bottom bar tabs
  const moreActive = !!(
    pathname &&
    pathname !== '/dashboard-v2' &&
    !pathname.startsWith('/dashboard-v2/bots') &&
    !pathname.startsWith('/dashboard-v2/wallets')
  );

  const bottomTabs = [
    { href: '/dashboard-v2', icon: Home, label: 'Home', isActive: pathname === '/dashboard-v2' },
    { href: '/dashboard-v2/bots', icon: Bot, label: 'Bots', isActive: !!pathname?.startsWith('/dashboard-v2/bots') },
    { href: '/dashboard-v2/wallets', icon: Wallet, label: 'Wallets', isActive: !!pathname?.startsWith('/dashboard-v2/wallets') },
  ];

  return (
    <div className="lg:hidden">
      {/* ── Slide-up "More" sheet ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={closeMenu}
            />

            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[75dvh] rounded-t-3xl overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
            >
              {/* Gradient accent edge */}
              <div className="h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

              <div className="bg-white/[0.97] dark:bg-dark-900/[0.97] backdrop-blur-2xl overflow-y-auto max-h-[calc(75dvh-2px)]">
                {/* Handle + close */}
                <div className="sticky top-0 bg-white/[0.97] dark:bg-dark-900/[0.97] backdrop-blur-2xl z-10 pt-3 pb-1 px-4">
                  <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 dark:bg-dark-700" />
                  <button
                    onClick={closeMenu}
                    className="absolute right-3 top-2 p-2.5 rounded-xl text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sections */}
                <nav className="px-4 pb-[calc(env(safe-area-inset-bottom,8px)+20px)]">
                  {mobileMenuSections.map((section) => (
                    <div key={section.label}>
                      {/* Section header */}
                      <div className="flex items-center gap-3 pt-5 pb-2 px-1">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-dark-500">
                          {section.label}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-dark-700 to-transparent" />
                      </div>

                      {/* Items */}
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const active = !!isActiveLink(pathname, item.href);
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMenu}
                              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                active
                                  ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20'
                                  : 'border border-transparent active:bg-gray-50 dark:active:bg-dark-800/60'
                              }`}
                            >
                              {/* Icon container */}
                              <div className={`flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-all duration-200 ${
                                active
                                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md shadow-primary-500/25'
                                  : 'bg-gray-100 dark:bg-dark-800 text-gray-500 dark:text-dark-400'
                              }`}>
                                <Icon className="w-[18px] h-[18px]" />
                              </div>

                              <span className={`text-[13px] font-medium ${
                                active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-dark-300'
                              }`}>
                                {item.label}
                              </span>

                              {/* Active dot */}
                              {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom tab bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Gradient top edge */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

        <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl">
          <div className="grid grid-cols-4 px-1 pb-[max(env(safe-area-inset-bottom,6px),6px)]">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center gap-1 pt-1.5 pb-2"
                >
                  {/* Indicator slot — always takes space, filled only when active */}
                  {tab.isActive ? (
                    <motion.div
                      layoutId="mobile-tab-indicator"
                      className="w-8 h-[3px] rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  ) : (
                    <div className="w-8 h-[3px]" />
                  )}
                  <Icon className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    tab.isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500'
                  }`} />
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                    tab.isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500'
                  }`}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}

            {/* More button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="flex flex-col items-center gap-1 pt-1.5 pb-2 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {moreActive ? (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="w-8 h-[3px] rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : (
                <div className="w-8 h-[3px]" />
              )}
              <Menu className={`w-[22px] h-[22px] transition-colors duration-200 ${
                menuOpen || moreActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500'
              }`} />
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                menuOpen || moreActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500'
              }`}>
                More
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
