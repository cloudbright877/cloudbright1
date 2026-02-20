'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Heart,
  Fish,
  Gem,
  Trophy,
  Shield,
  Bot,
  Award,
  Users,
  Clock,
  AlertTriangle,
  ChevronUp,
  TrendingUp,
  ArrowUpDown,
} from 'lucide-react';

// Social system imports
import type { FeedEvent, FeedEventType, WhaleAlert } from '@/lib/social/types';
import { getForYouFeed } from '@/lib/social/feed-generator';
import { toggleLike as toggleLikeInStorage, isLiked } from '@/lib/social/social-interactions';
import { getAvatarStyle } from '@/lib/social/tier-utils';
import { getWhaleAlerts } from '@/lib/social/whale-detector';
import { seedSocialData, getSocialTraders } from '@/lib/social/mock-seed';
import { calculateLeaderboard } from '@/lib/social/leaderboard';

export default function DashboardV2Page() {
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [whaleAlertsList, setWhaleAlertsList] = useState<WhaleAlert[]>([]);
  const [likeStates, setLikeStates] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | FeedEventType>('all');

  // Load data
  useEffect(() => {
    seedSocialData();
    loadFeedData();
    loadWhaleAlerts();
  }, []);

  const loadFeedData = () => {
    const events = getForYouFeed();
    setFeedEvents(events);

    // Initialize like states
    const initialLikeStates: Record<string, { liked: boolean; count: number }> = {};
    events.forEach(event => {
      initialLikeStates[event.id] = {
        liked: isLiked(event.id),
        count: event.likes
      };
    });
    setLikeStates(initialLikeStates);
  };

  const loadWhaleAlerts = () => {
    const alerts = getWhaleAlerts().slice(0, 3);
    setWhaleAlertsList(alerts);
  };

  const handleLikeToggle = (eventId: string) => {
    const wasLiked = likeStates[eventId]?.liked || false;
    toggleLikeInStorage(eventId);

    setLikeStates(prev => ({
      ...prev,
      [eventId]: {
        liked: !wasLiked,
        count: wasLiked ? (prev[eventId]?.count || 0) - 1 : (prev[eventId]?.count || 0) + 1
      }
    }));
  };

  // Get top 3 from leaderboard
  const topTraders = calculateLeaderboard(getSocialTraders()).slice(0, 3);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond': return <Gem className="w-4 h-4 text-primary-400" />;
      case 'Platinum': return <Shield className="w-4 h-4 text-primary-400" />;
      case 'Gold': return <Trophy className="w-4 h-4 text-primary-400" />;
      default: return <Award className="w-4 h-4 text-primary-400" />;
    }
  };

  const timeAgo = (ts: number) => {
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const renderFeedEvent = (event: FeedEvent, index: number) => {
    const likeState = likeStates[event.id] || { liked: false, count: event.likes };

    // Event-specific content
    let icon: React.ReactNode = null;
    let title = '';
    let description = '';
    let stats: Array<{ label: string; value: string; color: string }> = [];

    if (event.type === 'milestone' && event.data.type === 'milestone') {
      icon = <Award className="w-4 h-4 text-primary-400" />;
      title = event.data.title || 'Milestone Reached!';
      description = event.data.description || 'Achieved a new milestone';
      stats = [
        { label: 'Milestone', value: event.data.milestone || 'N/A', color: 'text-white' },
        { label: 'Value', value: `$${(event.data.value || 0).toLocaleString()}`, color: 'text-green-400' },
      ];
    } else if (event.type === 'new-copy' && event.data.type === 'new-copy') {
      icon = <Users className="w-4 h-4 text-primary-400" />;
      title = event.data.title || 'New Copiers';
      description = event.data.description || 'Traders started copying this strategy';
      stats = [
        { label: 'New Copiers', value: `+${event.data.copierCount || 0}`, color: 'text-white' },
        { label: 'Total', value: `${event.data.totalCopiers || 0}`, color: 'text-primary-400' },
      ];
    } else if (event.type === 'whale-move' && event.data.type === 'whale-move') {
      icon = <Fish className="w-4 h-4 text-primary-400" />;
      title = event.data.title || 'Whale Move';
      description = event.data.description || 'Large transaction detected';
      stats = [
        { label: 'Action', value: event.data.action || 'N/A', color: 'text-white' },
        { label: 'Amount', value: `$${(event.data.amount || 0).toLocaleString()}`, color: 'text-blue-400' },
      ];
    } else if (event.type === 'rank-change' && event.data.type === 'rank-change') {
      const improved = event.data.newRank < event.data.oldRank;
      icon = <ArrowUpDown className="w-4 h-4 text-primary-400" />;
      title = event.data.title || 'Rank Change';
      description = event.data.description || 'Leaderboard position changed';
      stats = [
        { label: 'Previous', value: `#${event.data.oldRank}`, color: 'text-dark-300' },
        { label: 'Current', value: `#${event.data.newRank}`, color: improved ? 'text-green-400' : 'text-red-400' },
      ];
    } else {
      return null;
    }

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -4 }}
      >
        <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
        <div className="relative bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-5 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/dashboard-v2/traders/${event.traderUsername}`} className="group flex-shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg group-hover:scale-110 transition-transform" style={getAvatarStyle(event.traderDisplayName)}>
              {event.traderAvatar || event.traderUsername[0].toUpperCase()}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Link href={`/dashboard-v2/traders/${event.traderUsername}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-400 transition-colors truncate">
                {event.traderDisplayName}
              </Link>
              {event.traderVerified && <Shield className="w-4 h-4 text-accent-400 flex-shrink-0" />}
              <span className="text-xs text-gray-600 dark:text-dark-400 flex items-center gap-1 flex-shrink-0">
                {getTierIcon(event.traderTier)}
                {event.traderTier}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-dark-300">
              {icon}
              <span className="font-medium text-gray-900 dark:text-white">{title}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-dark-500 flex-shrink-0">{timeAgo(event.timestamp)}</div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-dark-400 mb-3 line-clamp-2">{description}</p>

        {/* Stats + like */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-5">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs text-gray-600 dark:text-dark-400">{s.label}</div>
                <div className={`text-sm font-medium ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleLikeToggle(event.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              likeState.liked ? 'text-red-400' : 'text-dark-500 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${likeState.liked ? 'fill-red-400' : ''}`} />
            <span>{likeState.count}</span>
          </button>
        </div>
        </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 p-1.5 overflow-x-auto max-w-full">
          {([
            { key: 'all', label: 'All' },
            { key: 'milestone', label: 'Milestones' },
            { key: 'new-copy', label: 'New Copiers' },
            { key: 'whale-move', label: 'Whale Moves' },
            { key: 'rank-change', label: 'Rank Changes' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium rounded-md text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeFilter === key
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Feed + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Feed Events */}
          {feedEvents
            .filter(event => activeFilter === 'all' || event.type === activeFilter)
            .map((event, index) => renderFeedEvent(event, index))}

          {/* Load More */}
          <button className="w-full py-3 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:text-white hover:border-gray-300 dark:border-dark-600 transition-all">
            Load More Posts
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Whale Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Fish className="w-5 h-5 text-primary-400" />
                Whale Alerts
              </h3>
              <Link href="/dashboard-v2/whales" className="text-xs text-primary-400 hover:text-primary-300">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {whaleAlertsList.map((alert) => (
                <motion.div
                  key={alert.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center">
                          <Fish className="w-4 h-4 text-primary-400" />
                        </div>
                        <div>
                          <div className="text-sm font-normal text-gray-900 dark:text-white">{alert.traderUsername}</div>
                          <div className="text-xs text-gray-600 dark:text-dark-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-800 dark:text-dark-200 mb-2 ml-10">
                      {alert.action} ${alert.amount.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/dashboard-v2/whales"
              className="mt-4 block text-center py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg text-sm font-semibold text-primary-400 hover:bg-primary-500/20 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
            >
              Watch All Whales
            </Link>
          </div>
          </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-400" />
                Weekly Top 3
              </h3>
              <Link href="/dashboard-v2/leaderboard" className="text-xs text-primary-400 hover:text-primary-300">
                Full Board
              </Link>
            </div>

            <div className="space-y-3">
              {topTraders.map((trader, index) => (
                <Link
                  key={trader.userId}
                  href={`/dashboard-v2/traders/${trader.username}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center font-bold text-primary-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-normal text-gray-900 dark:text-white">{trader.displayName}</div>
                    <div className="text-xs text-gray-600 dark:text-dark-400">Profit: ${trader.stats.profit.toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-medium text-green-400">
                    {trader.stats.winRate.toFixed(1)}% WR
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Your Position</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">#{Math.min(calculateLeaderboard(getSocialTraders()).length, 50)} / {calculateLeaderboard(getSocialTraders()).length}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-dark-400 flex items-center gap-1">
                  <ChevronUp className="w-3 h-3" />
                  --
                </span>
              </div>
            </div>
          </div>
          </div>
          </motion.div>

          {/* Your Bots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-dark-800/95 dark:to-dark-900/95 backdrop-blur-sm rounded-[calc(1rem-1px)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-400" />
                Your Bots (3)
              </h3>
              <Link href="/dashboard-v2/bots" className="text-xs text-primary-400 hover:text-primary-300">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard-v2/bots/alphabot" className="block p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">AlphaBot Pro</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">$10,000</span>
                  <span className="text-green-400 font-medium">+$2,345</span>
                </div>
              </Link>

              <Link href="/dashboard-v2/bots/protrader" className="block p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">ProTrader Elite</div>
                  <div className="text-xs text-yellow-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    Med
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">$8,000</span>
                  <span className="text-green-400 font-medium">+$1,876</span>
                </div>
              </Link>

              <Link href="/dashboard-v2/bots/sigmabot" className="block p-3 bg-gray-50 dark:bg-dark-900/50 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">SigmaBot</div>
                  <div className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    High
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">$5,000</span>
                  <span className="text-green-400 font-medium">+$543</span>
                </div>
              </Link>
            </div>

            <Link
              href="/dashboard-v2/bots"
              className="mt-4 block text-center py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg text-sm font-semibold text-primary-400 hover:bg-primary-500/20 transition-all"
            >
              + Add New Bot
            </Link>
          </div>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
