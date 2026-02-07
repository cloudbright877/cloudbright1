'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Heart,
  MoreHorizontal,
  Fish,
  Gem,
  Trophy,
  Shield,
  Copy,
  Bell,
  DollarSign,
  Bot,
  BarChart3,
  Award,
  Users,
  Clock,
  AlertTriangle,
  ChevronUp,
  UserPlus,
  UserCheck
} from 'lucide-react';

// Social system imports
import type { FeedEvent, WhaleAlert } from '@/lib/social/types';
import { getForYouFeed, getFollowingFeed, getTrendingFeed } from '@/lib/social/feed-generator';
import { toggleLike as toggleLikeInStorage, isLiked } from '@/lib/social/social-interactions';
import { toggleFollow, isFollowing, getFollowing } from '@/lib/social/follow-system';
import { getTierGradient } from '@/lib/social/tier-utils';
import { getWhaleAlerts } from '@/lib/social/whale-detector';
import { seedSocialData, getSocialTraders } from '@/lib/social/mock-seed';
import { calculateLeaderboard } from '@/lib/social/leaderboard';

export default function DashboardV2Page() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [whaleAlertsList, setWhaleAlertsList] = useState<WhaleAlert[]>([]);
  const [likeStates, setLikeStates] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});

  // Load data
  useEffect(() => {
    seedSocialData();
    loadFeedData();
    loadWhaleAlerts();
  }, [activeTab]);

  const loadFeedData = () => {
    let events: FeedEvent[] = [];
    const following = getFollowing();

    switch (activeTab) {
      case 'for-you':
        events = getForYouFeed();
        break;
      case 'following':
        events = getFollowingFeed(following);
        break;
      case 'trending':
        events = getTrendingFeed();
        break;
    }
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

    // Initialize follow states
    const initialFollowStates: Record<string, boolean> = {};
    events.forEach(event => {
      initialFollowStates[event.traderId] = isFollowing(event.traderId);
    });
    setFollowStates(initialFollowStates);
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

  const handleFollowToggle = (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(userId);
    setFollowStates(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Get top 3 from leaderboard
  const topTraders = calculateLeaderboard(getSocialTraders()).slice(0, 3);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond': return <Gem className="w-4 h-4 text-blue-400" />;
      case 'Platinum': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'Gold': return <Trophy className="w-4 h-4 text-yellow-400" />;
      default: return <Award className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderFeedEvent = (event: FeedEvent, index: number) => {
    const likeState = likeStates[event.id] || { liked: false, count: event.likes };
    const isUserFollowing = followStates[event.traderId] || false;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.005, y: -2 }}
        className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/30 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 hover:from-primary-500/3 hover:to-accent-500/3 transition-all duration-300 pointer-events-none" />

        {/* Author Header */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <Link href={`/dashboard-v2/traders/${event.traderUsername}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className={`w-12 h-12 ${getTierGradient(event.traderTier)} rounded-full flex items-center justify-center text-xl font-bold shadow-md`}>
              {event.traderAvatar || event.traderUsername[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{event.traderDisplayName}</span>
                {event.traderVerified && <Shield className="w-4 h-4 text-accent-400" />}
                <span className="text-xs text-dark-400 flex items-center gap-1">
                  {getTierIcon(event.traderTier)}
                  {event.traderTier}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-dark-400">
                <Clock className="w-3 h-3" />
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleFollowToggle(event.traderId, e)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                isUserFollowing
                  ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  : 'bg-primary-500/20 border border-primary-500/30 text-primary-400 hover:bg-primary-500/30'
              }`}
            >
              {isUserFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  Follow
                </>
              )}
            </button>
            <button className="text-dark-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Event Content */}
        {event.type === 'milestone' && event.data.type === 'milestone' && (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-accent-400" />
              <h3 className="text-xl font-bold text-white">{event.data.title || 'Milestone Reached!'}</h3>
            </div>
            <p className="text-dark-200 whitespace-pre-line mb-4">{event.data.description || 'Achieved a new milestone'}</p>

            <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-dark-900/50 rounded-xl border border-dark-700">
              <div>
                <div className="text-xs text-dark-400">Milestone</div>
                <div className="text-lg font-bold text-white">{event.data.milestone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-dark-400">Value</div>
                <div className="text-lg font-bold text-green-400">${(event.data.value || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => handleLikeToggle(event.id)}
                className={`flex items-center gap-2 transition-all ${
                  likeState.liked
                    ? 'text-red-400 scale-110'
                    : 'text-dark-400 hover:text-red-400'
                }`}
              >
                <motion.div
                  animate={likeState.liked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 ${likeState.liked ? 'fill-red-400' : ''}`} />
                </motion.div>
                <span>{likeState.count}</span>
              </button>
            </div>
          </div>
        )}

        {event.type === 'whale-move' && event.data.type === 'whale-move' && (
          <div className="relative z-10">
            <div className="mb-3 px-3 py-1.5 bg-accent-500/20 border border-accent-500/30 rounded-full text-xs font-bold text-accent-400 inline-flex items-center gap-2">
              <Fish className="w-4 h-4" />
              WHALE ALERT
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{event.data.title || 'Whale Activity'}</h3>
            <p className="text-dark-200 mb-4">{event.data.description || 'Large transaction detected'}</p>

            <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-dark-400">Amount</div>
                  <div className="text-lg font-bold text-green-400">${(event.data.amount || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-400">Action</div>
                  <div className="text-lg font-bold text-white">{event.data.action || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Whale
              </button>
              <button className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Set Alert
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => handleLikeToggle(event.id)}
                className={`flex items-center gap-2 transition-all ${
                  likeState.liked
                    ? 'text-red-400 scale-110'
                    : 'text-dark-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${likeState.liked ? 'fill-red-400' : ''}`} />
                <span>{likeState.count}</span>
              </button>
            </div>
          </div>
        )}

        {event.type === 'rank-change' && event.data.type === 'rank-change' && (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">{event.data.title || 'Rank Changed'}</h3>
            </div>
            <p className="text-dark-200 mb-4">{event.data.description || 'Leaderboard position updated'}</p>

            <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 mb-4">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-xs text-dark-400">Old Rank</div>
                  <div className="text-2xl font-bold text-dark-300">#{event.data.oldRank || 0}</div>
                </div>
                <ChevronUp className="w-6 h-6 text-green-400" />
                <div className="text-center">
                  <div className="text-xs text-dark-400">New Rank</div>
                  <div className="text-2xl font-bold text-green-400">#{event.data.newRank || 0}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => handleLikeToggle(event.id)}
                className={`flex items-center gap-2 transition-all ${
                  likeState.liked
                    ? 'text-red-400 scale-110'
                    : 'text-dark-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${likeState.liked ? 'fill-red-400' : ''}`} />
                <span>{likeState.count}</span>
              </button>
            </div>
          </div>
        )}

        {event.type === 'new-copy' && event.data.type === 'new-copy' && (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary-400" />
              <h3 className="text-xl font-bold text-white">{event.data.title || 'New Copiers'}</h3>
            </div>
            <p className="text-dark-200 mb-4">{event.data.description || 'Traders started copying this strategy'}</p>

            <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-dark-400">New Copiers</div>
                  <div className="text-lg font-bold text-white">{event.data.copierCount || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-400">Total Copiers</div>
                  <div className="text-lg font-bold text-primary-400">{event.data.totalCopiers || 0}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => handleLikeToggle(event.id)}
                className={`flex items-center gap-2 transition-all ${
                  likeState.liked
                    ? 'text-red-400 scale-110'
                    : 'text-dark-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${likeState.liked ? 'fill-red-400' : ''}`} />
                <span>{likeState.count}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <Link href="/dashboard-v2/portfolio" className="block relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-primary-500/20 rounded-xl p-4 hover:border-primary-500/40 transition-all shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 hover:from-primary-500/10 hover:to-accent-500/10 transition-all duration-300 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                <DollarSign className="w-3 h-3" />
                Portfolio Value
              </div>
              <div className="text-2xl font-bold text-gradient">$28,456</div>
              <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8.3% all-time
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <div className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 hover:from-green-500/5 hover:to-emerald-500/5 transition-all duration-300 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                <BarChart3 className="w-3 h-3" />
                Today P/L
              </div>
              <div className="text-2xl font-bold text-green-400">+$234</div>
              <div className="text-xs text-dark-400 mt-1">+0.83%</div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <Link href="/dashboard-v2/portfolio" className="block relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/30 transition-all shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 hover:from-blue-500/5 hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                <Bot className="w-3 h-3" />
                Active Bots
              </div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-dark-400 mt-1">$23,000 invested</div>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <Link href="/dashboard-v2/leaderboard" className="block relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-xl p-4 hover:border-primary-500/30 transition-all shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/0 to-orange-500/0 hover:from-yellow-500/5 hover:to-orange-500/5 transition-all duration-300 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-xs text-dark-400 mb-1">
                <Trophy className="w-3 h-3" />
                Leaderboard
              </div>
              <div className="text-2xl font-bold text-white">#198</div>
              <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                <TrendingUp className="w-3 h-3" />
                +51 this week
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Main Layout: Feed + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feed Tabs */}
          <div className="flex items-center gap-2 bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-2">
            {(['for-you', 'following', 'trending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${activeTab === tab
                    ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                    : 'text-dark-400 hover:text-white'
                  }
                `}
              >
                {tab === 'for-you' && 'For You'}
                {tab === 'following' && 'Following'}
                {tab === 'trending' && 'Trending'}
              </button>
            ))}
          </div>

          {/* Feed Events */}
          {feedEvents.map((event, index) => renderFeedEvent(event, index))}

          {/* Load More */}
          <button className="w-full py-3 border border-dark-700 rounded-xl text-dark-400 hover:text-white hover:border-dark-600 transition-all">
            Load More Posts
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Whale Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Fish className="w-5 h-5 text-blue-400" />
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
                  className="group relative p-3 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-blue-500/30 transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/0 to-accent-500/0 group-hover:from-blue-500/5 group-hover:to-accent-500/5 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Fish className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{alert.traderUsername}</div>
                          <div className="text-xs text-dark-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-dark-200 mb-2 ml-10">
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
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
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
                  className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-primary-500/30 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{trader.displayName}</div>
                    <div className="text-xs text-dark-400">Profit: ${trader.stats.profit.toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-bold text-green-400">
                    {trader.stats.winRate.toFixed(1)}% WR
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <div className="text-xs text-dark-400 mb-1">Your Position</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">#198 / {calculateLeaderboard(getSocialTraders()).length}</span>
                <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <ChevronUp className="w-3 h-3" />
                  +51
                </span>
              </div>
            </div>
          </motion.div>

          {/* Your Bots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-400" />
                Your Bots (3)
              </h3>
              <Link href="/dashboard-v2/bots" className="text-xs text-primary-400 hover:text-primary-300">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard-v2/bots/alphabot" className="block p-3 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">AlphaBot Pro</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">$10,000</span>
                  <span className="text-green-400 font-bold">+$2,345</span>
                </div>
              </Link>

              <Link href="/dashboard-v2/bots/protrader" className="block p-3 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">ProTrader Elite</div>
                  <div className="text-xs text-yellow-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    Med
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">$8,000</span>
                  <span className="text-green-400 font-bold">+$1,876</span>
                </div>
              </Link>

              <Link href="/dashboard-v2/bots/sigmabot" className="block p-3 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">SigmaBot</div>
                  <div className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    <AlertTriangle className="w-3 h-3" />
                    High
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">$5,000</span>
                  <span className="text-green-400 font-bold">+$543</span>
                </div>
              </Link>
            </div>

            <Link
              href="/dashboard-v2/bots"
              className="mt-4 block text-center py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg text-sm font-semibold text-primary-400 hover:bg-primary-500/20 transition-all"
            >
              + Add New Bot
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
