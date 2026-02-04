'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

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
    title: 'Investment Profit Credited',
    body: 'Your investment <strong>Professional Plan #1523</strong> has generated a profit of <strong>$187.50 USDT</strong>',
    date: Date.now() - 3600000,
    read: false,
  },
  {
    id: 2,
    title: 'Referral Bonus Received',
    body: 'You received a <strong>$125.00 USDT</strong> referral bonus from <strong>user_john</strong> (Level 1)',
    date: Date.now() - 7200000,
    read: false,
  },
  {
    id: 3,
    title: 'Deposit Confirmed',
    body: 'Your deposit of <strong>1000.00 USDT</strong> via TRC20 has been confirmed and credited to your account',
    date: Date.now() - 10800000,
    read: true,
  },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [locale, setLocale] = useState('en');
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
    username: 'User',
    avatar: null,
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname?.startsWith('/investments')) return 'Investments';
    if (pathname?.startsWith('/wallets')) return 'Wallets';
    if (pathname?.startsWith('/referrals')) return 'Referrals';
    if (pathname?.startsWith('/profile')) return 'Profile';
    if (pathname?.startsWith('/notifications')) return 'Notifications';
    return 'Dashboard';
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('profit') || lowerTitle.includes('income')) return '💰';
    if (lowerTitle.includes('referral') || lowerTitle.includes('bonus')) return '🎁';
    if (lowerTitle.includes('deposit') || lowerTitle.includes('credited')) return '💳';
    if (lowerTitle.includes('withdrawal')) return '💸';
    if (lowerTitle.includes('investment') || lowerTitle.includes('completed')) return '✓';
    if (lowerTitle.includes('login') || lowerTitle.includes('ip')) return '🔐';
    return '🔔';
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
              href="/dashboard"
              className="text-dark-400 hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            {pathname !== '/dashboard' && (
              <>
                <span className="text-dark-600">/</span>
                <span className="text-white font-medium">{getPageTitle()}</span>
              </>
            )}
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
              <span className="text-xl">🔔</span>
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
                      href="/notifications"
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
                            <div className="text-2xl">
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

          {/* Language Selector */}
          <div className="relative">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white hover:bg-dark-700 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="de">🇩🇪 DE</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
          </div>

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
              <span className="text-dark-400 text-xs">▼</span>
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
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="text-lg">👤</span>
                      <span className="text-sm text-dark-300 group-hover:text-white">
                        Profile
                      </span>
                    </Link>

                    <Link
                      href="/profile?tab=security"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="text-lg">🔒</span>
                      <span className="text-sm text-dark-300 group-hover:text-white">
                        Security
                      </span>
                    </Link>

                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="text-lg">❓</span>
                      <span className="text-sm text-dark-300 group-hover:text-white">
                        Help & Support
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
                      <span className="text-lg">→</span>
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
