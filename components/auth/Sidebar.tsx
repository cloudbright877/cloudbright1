'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavItemProps {
  href: string;
  icon: string;
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
          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
          : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
        }
      `}
    >
      {/* Icon */}
      <span className="text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        {icon}
      </span>

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
  <div className="h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent my-4" />
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userData = {
    user: {
      username: 'User',
      avatar: null,
      totalBalance: 60847.32,
    },
    activeInvestments: 3,
    unreadNotifications: 2,
  };

  const handleLogout = () => {
    router.push('/login');
  };

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
          bg-gradient-to-b from-dark-900/95 to-dark-800/95
          backdrop-blur-sm border-r-2 border-dark-700
          transition-all duration-300 z-40
        `}
      >
        {/* Logo */}
        <div className={`flex items-center p-6 border-b border-dark-700 ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'}`}>
          <Link href="/dashboard" className={`flex items-center group ${isCollapsed ? 'justify-center' : ''}`}>
            {isCollapsed ? (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl"
              >
                C
              </motion.div>
            ) : (
              <div className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                CELESTIAN
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <span className="text-dark-400">{isCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            href="/dashboard"
            icon="📊"
            label="Dashboard"
            active={pathname === '/dashboard'}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/investments"
            icon="💼"
            label="Investments"
            active={pathname?.startsWith('/investments')}
            badge={userData.activeInvestments > 0 ? userData.activeInvestments : undefined}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/copy-trades"
            icon="🔄"
            label="Copy Trades"
            active={pathname?.startsWith('/copy-trades')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/wallets"
            icon="💳"
            label="Wallets"
            active={pathname?.startsWith('/wallets')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/referrals"
            icon="👥"
            label="Referrals"
            active={pathname?.startsWith('/referrals')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/transactions"
            icon="📝"
            label="Transactions"
            active={pathname?.startsWith('/transactions')}
            isCollapsed={isCollapsed}
          />

          <NavDivider />

          <NavItem
            href="/profile"
            icon="⚙️"
            label="Settings"
            active={pathname?.startsWith('/profile')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/help"
            icon="❓"
            label="Help"
            active={pathname?.startsWith('/help')}
            isCollapsed={isCollapsed}
          />
        </nav>

        {/* User Card (Bottom) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-dark-700">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {userData.user.avatar ? (
                    <Image
                      src={userData.user.avatar}
                      alt={userData.user.username}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userData.user.username[0].toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {userData.user.username}
                  </div>
                  <div className="text-xs text-dark-400">
                    ${userData.user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-dark-900/50 hover:bg-dark-900 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>→</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-t-2 border-dark-700">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            href="/investments"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors relative ${
              pathname?.startsWith('/investments')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <span className="text-xl">💼</span>
            <span className="text-xs font-medium">Invest</span>
            {userData.activeInvestments > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-accent-500 rounded-full" />
            )}
          </Link>

          <Link
            href="/wallets"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/wallets')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <span className="text-xl">💳</span>
            <span className="text-xs font-medium">Wallet</span>
          </Link>

          <Link
            href="/referrals"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/referrals')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <span className="text-xl">👥</span>
            <span className="text-xs font-medium">Refer</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/profile')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs font-medium">More</span>
          </Link>
        </div>
      </div>
    </>
  );
}
