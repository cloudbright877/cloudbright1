'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface Notification {
  id: number;
  title: string;
  body: string;
  date: number;
  read: boolean;
}

// User notifications
const userNotifications: Notification[] = [
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
  {
    id: 4,
    title: 'Investment Completed',
    body: 'Your investment <strong>Essential Plan #1489</strong> has completed successfully. Total profit: <strong>$3000.00 USDT</strong>',
    date: Date.now() - 86400000,
    read: true,
  },
  {
    id: 5,
    title: 'New Login Detected',
    body: 'New login from <strong>Chrome on Windows</strong> at IP <strong>192.168.1.100</strong>',
    date: Date.now() - 172800000,
    read: true,
  },
];

export default function NotificationsPage() {
  const [displayCount, setDisplayCount] = useState(15);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(userNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    setShowDeleteModal(false);
  };

  const handleMarkAsRead = (id: number) => {
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
    if (lowerTitle.includes('deposit') || lowerTitle.includes('credited')) return '💳';
    if (lowerTitle.includes('withdrawal')) return '💸';
    if (lowerTitle.includes('referral') || lowerTitle.includes('bonus')) return '🎁';
    if (lowerTitle.includes('investment') || lowerTitle.includes('completed')) return '✓';
    if (lowerTitle.includes('ip')) return '🌐';
    if (lowerTitle.includes('login')) return '🔐';
    return '🔔';
  };

  const getNotificationColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('deposit') || lowerTitle.includes('credited')) {
      return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    }
    if (lowerTitle.includes('withdrawal')) {
      return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
    }
    if (lowerTitle.includes('referral') || lowerTitle.includes('bonus')) {
      return 'from-accent-500/20 to-pink-500/20 border-accent-500/30';
    }
    if (lowerTitle.includes('investment') || lowerTitle.includes('completed')) {
      return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
    }
    if (lowerTitle.includes('ip')) {
      return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    }
    if (lowerTitle.includes('login')) {
      return 'from-primary-500/20 to-primary-600/20 border-primary-500/30';
    }
    return 'from-dark-700/20 to-dark-800/20 border-dark-600/30';
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Notifications</h1>
          <div className="flex items-center gap-3">
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
        </div>
        <p className="text-dark-300">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
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
                      ${!notification.read ? `bg-gradient-to-r ${getNotificationColor(notification.title)} border-l-4` : ''}
                    `}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-dark-900/50 rounded-xl flex items-center justify-center text-2xl">
                        {getNotificationIcon(notification.title)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white">{notification.title}</h3>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2" />
                        )}
                      </div>
                      <p
                        className="text-sm text-dark-300 mb-2"
                        dangerouslySetInnerHTML={{ __html: notification.body }}
                      />
                      <div className="flex items-center gap-3 text-xs text-dark-500">
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
                  className="px-8 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 hover:border-primary-500/50 rounded-xl text-white font-medium transition-all hover:scale-105"
                >
                  Load More ({notifications.length - displayCount} remaining)
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <GlassCard>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
              <p className="text-dark-300">You don't have any notifications yet</p>
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
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    Delete All Notifications?
                  </h3>

                  {/* Description */}
                  <p className="text-dark-300 text-center mb-6">
                    This will permanently delete all {notifications.length} notification{notifications.length > 1 ? 's' : ''}. This action cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-all hover:scale-105"
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
