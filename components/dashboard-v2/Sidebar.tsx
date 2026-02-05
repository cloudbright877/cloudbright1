'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Briefcase,
  Bot,
  Users,
  Fish,
  Trophy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gem,
  BarChart3,
  MessageCircle,
  Gauge,
  ShieldCheck,
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
          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
          : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
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
  <div className="h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent my-4" />
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userData = {
    user: {
      username: 'john_pro',
      avatar: null,
      totalBalance: 60847.32,
      tier: 'Diamond',
    },
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
        <div className="relative flex items-center justify-center p-6 border-b border-dark-700">
          <Link href="/dashboard-v2" className="flex items-center justify-center group">
            <Image
              src="/logo2.svg"
              alt="CloudBright"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-4 p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
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

          <NavItem
            href="/dashboard-v2/bots"
            icon={<Bot className="w-6 h-6" />}
            label="Bots"
            active={pathname?.startsWith('/dashboard-v2/bots')}
            isCollapsed={isCollapsed}
          />

          <NavItem
            href="/dashboard-v2/traders"
            icon={<Users className="w-6 h-6" />}
            label="Traders"
            active={pathname?.startsWith('/dashboard-v2/traders')}
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

          <NavItem
            href="/dashboard-v2/leaderboard"
            icon={<Trophy className="w-6 h-6" />}
            label="Leaderboard"
            active={pathname?.startsWith('/dashboard-v2/leaderboard')}
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
                  <div className="text-xs text-dark-400 flex items-center gap-1">
                    <Gem className="w-3 h-3 text-accent-400" />
                    {userData.user.tier}
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-3 p-3 bg-dark-900/50 rounded-lg">
                <div className="text-xs text-dark-400 mb-1">Total Balance</div>
                <div className="text-lg font-bold text-gradient">
                  ${userData.user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-dark-900/50 hover:bg-dark-900 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
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
            href="/dashboard-v2"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard-v2'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Feed</span>
          </Link>

          <Link
            href="/dashboard-v2/portfolio"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/portfolio')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs font-medium">Portfolio</span>
          </Link>

          <Link
            href="/dashboard-v2/bots"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/bots')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs font-medium">Bots</span>
          </Link>

          <Link
            href="/dashboard-v2/traders"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/traders')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Traders</span>
          </Link>

          <Link
            href="/dashboard-v2/settings"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              pathname?.startsWith('/dashboard-v2/settings')
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400'
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
