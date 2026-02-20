'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  Wallet,

  Gift,
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
              className="ml-auto p-1.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0"
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

          <NavDivider />

          <NavItem
            href="/dashboard-v2/whales"
            icon={<Fish className="w-6 h-6" />}
            label="Whales"
            active={pathname?.startsWith('/dashboard-v2/whales')}
            isCollapsed={isCollapsed}
          />

          <NavDivider />

          <NavItem
            href="/dashboard-v2/settings"
            icon={<Settings className="w-6 h-6" />}
            label="Settings"
            active={pathname?.startsWith('/dashboard-v2/settings')}
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-50/95 dark:bg-dark-900/95 backdrop-blur-sm border-t-2 border-gray-200 dark:border-dark-700">
        <div className="grid grid-cols-4 gap-1 p-2 pb-[env(safe-area-inset-bottom,8px)]">
          <Link
            href="/dashboard-v2"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard-v2'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-600 dark:text-dark-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Feed</span>
          </Link>

          <Link
            href="/dashboard-v2/bots"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/bots')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-600 dark:text-dark-400'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs font-medium">Bots</span>
          </Link>

          <Link
            href="/dashboard-v2/leaderboard"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/leaderboard') || pathname?.startsWith('/dashboard-v2/traders')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-600 dark:text-dark-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Leaderboard</span>
          </Link>

          <Link
            href="/dashboard-v2/settings"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/settings')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-600 dark:text-dark-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}
