'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  DollarSign,
  Fish,
  Trophy,
  Users,
  TrendingUp,
  Award,
  Bot,
  CreditCard,
  Wallet,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Gem
} from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';

interface NotificationProps {
  id: number;
  title: string;
  body: string;
  date: number;
  read: boolean;
}

// Static user notifications
const userNotifications: NotificationProps[] = [
  {
    id: 1,
    title: 'Bot Performance Alert',
    body: 'Your bot <strong>AlphaBot Pro</strong> generated <strong>+12.5%</strong> profit today (+$1,250 USDT)',
    date: Date.now() - 900000, // 15m ago
    read: false,
  },
  {
    id: 2,
    title: 'Whale Alert',
    body: '<strong>crypto_whale_47</strong> invested <strong>$50,000</strong> in ProTrader Elite. <a href="/dashboard-v2/whales" class="text-primary-400">Copy strategy</a>',
    date: Date.now() - 3600000, // 1h ago
    read: false,
  },
  {
    id: 4,
    title: 'Leaderboard Update',
    body: 'You moved up <strong>51 positions</strong> to rank <strong>#198</strong> on the global leaderboard!',
    date: Date.now() - 10800000, // 3h ago
    read: true,
  },
  {
    id: 5,
    title: 'Trade Executed',
    body: 'AlphaBot Pro bought <strong>0.5 BTC</strong> at $43,250. Position opened successfully.',
    date: Date.now() - 14400000, // 4h ago
    read: true,
  },
  {
    id: 6,
    title: 'Deposit Confirmed',
    body: 'Your deposit of <strong>5,000 USDT</strong> has been confirmed and is ready for trading',
    date: Date.now() - 86400000, // 1d ago
    read: true,
  },
  {
    id: 7,
    title: 'Achievement Unlocked',
    body: 'You earned the <strong>Consistent Trader</strong> badge for 14-day profit streak! +500 XP',
    date: Date.now() - 172800000, // 2d ago
    read: true,
  },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>(userNotifications);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.read).length;

  const userData = {
    username: 'john_pro',
    avatar: null,
    tier: 'Diamond',
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    if (!pathname || pathname === '/dashboard-v2') return [];

    const segments = pathname.replace('/dashboard-v2/', '').split('/');
    const crumbs: Array<{ label: string; href?: string }> = [];

    const labelMap: Record<string, string> = {
      bots: 'Bots',
      traders: 'Traders',
      whales: 'Whales',
      leaderboard: 'Leaderboard',
      wallets: 'Wallets',
      feed: 'Feed',
      referrals: 'Referrals',
      notifications: 'Notifications',
      settings: 'Settings',
      analytics: 'Analytics',
      compare: 'Compare',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      copy: 'Copy',
      archive: 'Archive',
      select: 'Select',
      profile: 'Profile',
      security: 'Security',
      preferences: 'Preferences',
      kyc: 'KYC',
    };

    let path = '/dashboard-v2';
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      path += `/${seg}`;
      const label = labelMap[seg] || decodeURIComponent(seg);
      const isLast = i === segments.length - 1;
      crumbs.push({ label, href: isLast ? undefined : path });
    }

    return crumbs;
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('profit') || lowerTitle.includes('performance'))
      return <DollarSign className="w-5 h-5 text-green-400" />;
    if (lowerTitle.includes('whale'))
      return <Fish className="w-5 h-5 text-blue-400" />;
    if (lowerTitle.includes('leaderboard') || lowerTitle.includes('rank'))
      return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (lowerTitle.includes('trade') || lowerTitle.includes('executed'))
      return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (lowerTitle.includes('achievement') || lowerTitle.includes('badge'))
      return <Award className="w-5 h-5 text-accent-400" />;
    if (lowerTitle.includes('bot'))
      return <Bot className="w-5 h-5 text-primary-400" />;
    if (lowerTitle.includes('deposit') || lowerTitle.includes('credited'))
      return <CreditCard className="w-5 h-5 text-green-400" />;
    if (lowerTitle.includes('withdrawal'))
      return <Wallet className="w-5 h-5 text-red-400" />;
    return <Bell className="w-5 h-5 text-primary-400" />;
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="hidden lg:block h-16 bg-gradient-to-r from-dark-900/95 to-dark-800/95 backdrop-blur-sm border-b-2 border-dark-700 sticky top-0 z-30"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/dashboard-v2"
              className="text-dark-400 hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            {getBreadcrumbs().map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-dark-600">/</span>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-400 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-96 bg-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    <Link
                      href="/dashboard-v2/notifications"
                      className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All
                    </Link>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {displayNotifications.length > 0 ? (
                      displayNotifications.map((notif: NotificationProps) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                          className={`p-4 border-b border-dark-800 hover:bg-dark-800/50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-primary-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notif.title)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-sm font-semibold text-white">
                                  {notif.title}
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-1" />
                                )}
                              </div>
                              <div
                                className="text-xs text-dark-300 mt-1"
                                dangerouslySetInnerHTML={{ __html: notif.body }}
                              />
                              <div className="text-xs text-dark-500 mt-1">
                                {timeAgo(notif.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-dark-400 text-sm">
                        No notifications
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-dark-700 bg-dark-900/50">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="w-full py-2 text-xs text-dark-400 hover:text-white transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <LanguageSwitcher />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-dark-800 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                {userData.avatar ? (
                  <Image
                    src={userData.avatar}
                    alt={userData.username}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userData.username[0].toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm font-medium text-white hidden xl:block">
                {userData.username}
              </span>
              <ChevronDown className="w-4 h-4 text-dark-400" />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-dark-900/95 backdrop-blur-sm border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-2">
                    {/* User tier badge */}
                    <div className="px-4 py-3 mb-2 flex items-center gap-2">
                      <Gem className="w-4 h-4 text-accent-400" />
                      <span className="text-xs text-dark-400">{userData.tier} Tier</span>
                    </div>

                    <Link
                      href={`/dashboard-v2/traders/${userData.username}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-dark-400 group-hover:text-white" />
                      <span className="text-sm text-dark-300 group-hover:text-white">
                        My Profile
                      </span>
                    </Link>

                    <Link
                      href="/dashboard-v2/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 text-dark-400 group-hover:text-white" />
                      <span className="text-sm text-dark-300 group-hover:text-white">
                        Settings
                      </span>
                    </Link>

                    <div className="h-px bg-dark-700 my-2" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors group"
                    >
                      <LogOut className="w-4 h-4 text-dark-400 group-hover:text-red-400" />
                      <span className="text-sm text-dark-300 group-hover:text-red-400">
                        Logout
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
