'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Bell,
  CreditCard,
  Wallet,
  Gift,
  CheckCircle,
  Globe,
  Lock,
  Bot,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Notification {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Deposit Confirmed',
    body: 'Your deposit of <strong>$5,000.00 USDT</strong> has been confirmed and credited to your account',
    date: Date.now() - 5 * 60 * 1000,
    read: false,
  },
  {
    id: 'n2',
    title: 'Profit Credited',
    body: 'Trade closed — <strong>$312.50 USDT</strong> profit credited from copy <strong>AlphaBot Pro</strong>',
    date: Date.now() - 12 * 60 * 1000,
    read: false,
  },
  {
    id: 'n3',
    title: 'Copy Bot Started',
    body: '<strong>$2,000.00 USDT</strong> has been allocated to copy <strong>Whale Hunter X</strong>',
    date: Date.now() - 35 * 60 * 1000,
    read: false,
  },
  {
    id: 'n4',
    title: 'New Login Detected',
    body: 'New login from <strong>Chrome on Windows</strong> at IP <strong>192.168.1.42</strong>. If this wasn\'t you, secure your account immediately.',
    date: Date.now() - 1.5 * 3600 * 1000,
    read: false,
  },
  {
    id: 'n5',
    title: 'Referral Bonus Received',
    body: 'You received <strong>$75.00 USDT</strong> referral commission from <strong>mike_trader</strong>',
    date: Date.now() - 2 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n6',
    title: 'Withdrawal Processed',
    body: 'Your withdrawal of <strong>$1,500.00 USDT</strong> has been processed and sent to your wallet',
    date: Date.now() - 3 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n7',
    title: 'Copy Bot Closed',
    body: '<strong>$3,250.00 USDT</strong> has been returned from copy <strong>Grid Master</strong> (PnL: <strong class="text-green-400">+$487.50</strong>)',
    date: Date.now() - 5 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n8',
    title: 'Turnover Bonus Awarded',
    body: 'You earned <strong>$120.00 USDT</strong> turnover bonus for reaching <strong>$50,000</strong> monthly volume',
    date: Date.now() - 8 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n9',
    title: 'Bot Performance Alert',
    body: '<strong>AlphaBot Pro</strong> hit a new weekly high — <strong>+18.3%</strong> return this week. <strong>$2,745 USDT</strong> profit generated.',
    date: Date.now() - 12 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n10',
    title: 'IP Address Change',
    body: 'Your account was accessed from a new IP address <strong>85.214.132.77</strong> (Frankfurt, Germany)',
    date: Date.now() - 18 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n11',
    title: 'Deposit Confirmed',
    body: 'Your deposit of <strong>$10,000.00 USDT</strong> has been confirmed and credited to your account',
    date: Date.now() - 24 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n12',
    title: 'Investment Completed',
    body: 'Your 30-day investment in <strong>Stable Yield Fund</strong> has matured. <strong>$10,450.00 USDT</strong> returned to your balance.',
    date: Date.now() - 36 * 3600 * 1000,
    read: true,
  },
  {
    id: 'n13',
    title: 'Profit Credited',
    body: 'Trade closed — <strong>$89.20 USDT</strong> profit credited from copy <strong>Scalper Elite</strong>',
    date: Date.now() - 2 * 86400 * 1000,
    read: true,
  },
  {
    id: 'n14',
    title: 'Referral Bonus Received',
    body: 'You received <strong>$150.00 USDT</strong> referral commission from <strong>crypto_jane</strong>',
    date: Date.now() - 3 * 86400 * 1000,
    read: true,
  },
  {
    id: 'n15',
    title: 'Copy Bot Started',
    body: '<strong>$5,000.00 USDT</strong> has been allocated to copy <strong>DCA Momentum</strong>',
    date: Date.now() - 4 * 86400 * 1000,
    read: true,
  },
  {
    id: 'n16',
    title: 'Withdrawal Processed',
    body: 'Your withdrawal of <strong>$3,000.00 USDT</strong> has been processed and sent to your wallet',
    date: Date.now() - 5 * 86400 * 1000,
    read: true,
  },
  {
    id: 'n17',
    title: 'Turnover Bonus Awarded',
    body: 'You earned <strong>$200.00 USDT</strong> turnover bonus for reaching <strong>$100,000</strong> quarterly volume',
    date: Date.now() - 6 * 86400 * 1000,
    read: true,
  },
  {
    id: 'n18',
    title: 'New Login Detected',
    body: 'New login from <strong>Safari on macOS</strong> at IP <strong>10.0.0.15</strong>',
    date: Date.now() - 7 * 86400 * 1000,
    read: true,
  },
];

export default function NotificationsPage() {
  const [displayCount, setDisplayCount] = useState(15);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    setShowDeleteModal(false);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 15);
  };

  const displayedNotifications = notifications.slice(0, displayCount);
  const hasMore = notifications.length > displayCount;

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('deposit') || lowerTitle.includes('credited')) return <CreditCard className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('withdrawal')) return <Wallet className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('referral') || lowerTitle.includes('bonus')) return <Gift className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('profit') || lowerTitle.includes('credited')) return <TrendingUp className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('copy') || lowerTitle.includes('bot')) return <Bot className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('investment') || lowerTitle.includes('completed')) return <CheckCircle className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('ip')) return <Globe className="w-6 h-6 text-primary-400" />;
    if (lowerTitle.includes('login')) return <Lock className="w-6 h-6 text-primary-400" />;
    return <Bell className="w-6 h-6 text-primary-400" />;
  };

  const getNotificationColor = () => {
    return 'from-primary-500/20 to-primary-600/20 border-primary-500/30';
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-end gap-3">
          {notifications.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-all duration-300 hover:scale-105"
            >
              Delete All
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-sm text-primary-400 transition-all duration-300 hover:scale-105"
            >
              Mark all as read
            </button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {notifications.length > 0 ? (
          <>
            {displayedNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                className="cursor-pointer"
              >
                <GlassCard>
                  <div
                    className={`
                      relative flex items-start gap-4 p-4
                      ${!notification.read ? `bg-gradient-to-r ${getNotificationColor()} border-l-4` : ''}
                    `}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center text-2xl">
                        {getNotificationIcon(notification.title)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2" />
                        )}
                      </div>
                      <p
                        className="text-sm text-gray-700 dark:text-dark-300 mb-2"
                        dangerouslySetInnerHTML={{ __html: notification.body }}
                      />
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-dark-500">
                        <span>{timeAgo(notification.date)}</span>
                        <span>•</span>
                        <span>{formatDate(notification.date)}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4"
              >
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-200 dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-700 hover:border-primary-500/50 rounded-xl text-gray-900 dark:text-white font-medium transition-all hover:scale-105"
                >
                  Load More ({notifications.length - displayCount} remaining)
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <GlassCard>
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-600 dark:text-dark-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Notifications</h3>
              <p className="text-gray-700 dark:text-dark-300">You don't have any notifications yet</p>
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="border-2 border-red-500/30">
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
                    Delete All Notifications?
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-dark-300 text-center mb-6">
                    This will permanently delete all {notifications.length} notification{notifications.length > 1 ? 's' : ''}. This action cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-200 dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white font-medium transition-all hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 font-medium transition-all hover:scale-105"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
