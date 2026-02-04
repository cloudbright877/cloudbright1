'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  TrendingUp,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Fish,
  Gem,
  Trophy,
  Shield,
  Check,
  Copy,
  Bell,
  Flame,
  DollarSign,
  Bot,
  BarChart3,
  Award,
  Users,
  Clock,
  AlertTriangle,
  ChevronUp
} from 'lucide-react';

// Mock data
const mockPosts = [
  {
    id: 1,
    type: 'milestone',
    author: {
      username: 'john_pro',
      avatar: 'J',
      tier: 'Diamond',
      verified: true,
    },
    timestamp: '2 hours ago',
    content: {
      title: 'Just hit $50,000 total profit!',
      text: `Started 2 years ago with $10k, now at $187k portfolio (+1,770%)\n\nMy strategy: 40/40/20 allocation\nLow/Med/High risk bots\nNever panic, let bots work!`,
      stats: {
        startAmount: '$10,000',
        currentAmount: '$187,000',
        roi: '+1,770%',
        timeframe: '2 years',
      }
    },
    engagement: {
      likes: 1247,
      comments: 234,
      reposts: 89,
    }
  },
  {
    id: 2,
    type: 'whale-alert',
    author: {
      username: 'Whale_8x7f',
      avatar: 'W',
      tier: 'Diamond Whale',
      verified: true,
    },
    timestamp: '5 hours ago',
    content: {
      title: 'WHALE ALERT: $100,000 Investment',
      allocation: [
        { bot: 'AlphaBot Pro', percentage: 50, amount: '$50,000' },
        { bot: 'ProTrader Elite', percentage: 30, amount: '$30,000' },
        { bot: 'ThetaGang', percentage: 20, amount: '$20,000' },
      ],
      stats: {
        winRate: '94%',
        totalProfit: '$847k',
        followers: '2,345',
      }
    },
    engagement: {
      copies: 428,
      watching: 1234,
    }
  },
  {
    id: 3,
    type: 'bot-review',
    author: {
      username: 'mike_trader',
      avatar: 'M',
      tier: 'Platinum',
      verified: false,
    },
    timestamp: '1 day ago',
    content: {
      title: 'AlphaBot vs ProTrader - My 6 Month Test',
      text: 'I ran both bots side-by-side with $5k each. Here are my results...',
      comparison: [
        {
          name: 'AlphaBot',
          pros: ['More consistent', 'Lower stress', 'Better for beginners'],
          stats: { avgReturn: '+12.5%', maxDD: '-4.2%', winRate: '87%' }
        },
        {
          name: 'ProTrader',
          pros: ['Higher returns', 'Good for growth'],
          stats: { avgReturn: '+18.3%', maxDD: '-8.5%', winRate: '82%' }
        }
      ]
    },
    engagement: {
      likes: 2134,
      comments: 445,
      helpful: 892,
    }
  },
];

const whaleAlerts = [
  {
    id: 1,
    whale: 'Whale_8x7f',
    action: 'invested $100k',
    bot: 'AlphaBot',
    timestamp: '2m ago',
    copies: 428,
  },
  {
    id: 2,
    whale: 'Whale_3a9d',
    action: 'rebalanced portfolio',
    timestamp: '15m ago',
    changes: 'Reduced SigmaBot 30% → 15%',
  },
  {
    id: 3,
    whale: 'Whale_1f5p',
    action: 'started copying',
    bot: 'ThetaGang',
    amount: '$50k',
    timestamp: '1h ago',
  },
];

const topTraders = [
  { rank: 1, username: 'john_pro', profit: '+$8,234', roi: '+42.1%' },
  { rank: 2, username: 'emma_crypto', profit: '+$6,890', roi: '+38.7%' },
  { rank: 3, username: 'mike_trader', profit: '+$5,123', roi: '+29.4%' },
];

export default function DashboardV2Page() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');
  const [postEngagement, setPostEngagement] = useState<Record<number, {
    liked: boolean;
    bookmarked: boolean;
    likes: number;
    reposted: boolean;
    reposts: number;
  }>>({});
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  // Initialize engagement state
  const getEngagement = (postId: number) => {
    if (!postEngagement[postId]) {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        setPostEngagement(prev => ({
          ...prev,
          [postId]: {
            liked: false,
            bookmarked: false,
            likes: post.engagement.likes || 0,
            reposted: false,
            reposts: post.engagement.reposts || 0,
          }
        }));
        return {
          liked: false,
          bookmarked: false,
          likes: post.engagement.likes || 0,
          reposted: false,
          reposts: post.engagement.reposts || 0,
        };
      }
    }
    return postEngagement[postId];
  };

  const toggleLike = (postId: number) => {
    setPostEngagement(prev => {
      const current = getEngagement(postId);
      return {
        ...prev,
        [postId]: {
          ...current,
          liked: !current.liked,
          likes: current.liked ? current.likes - 1 : current.likes + 1,
        }
      };
    });
  };

  const toggleBookmark = (postId: number) => {
    setPostEngagement(prev => {
      const current = getEngagement(postId);
      return {
        ...prev,
        [postId]: {
          ...current,
          bookmarked: !current.bookmarked,
        }
      };
    });
  };

  const toggleRepost = (postId: number) => {
    setPostEngagement(prev => {
      const current = getEngagement(postId);
      return {
        ...prev,
        [postId]: {
          ...current,
          reposted: !current.reposted,
          reposts: current.reposted ? current.reposts - 1 : current.reposts + 1,
        }
      };
    });
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
                {tab === 'trending' && (
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Trending
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Feed Posts */}
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.005, y: -2 }}
              className="relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 hover:border-primary-500/30 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Glowing background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 hover:from-primary-500/3 hover:to-accent-500/3 transition-all duration-300 pointer-events-none" />
              {/* Author Header */}
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{post.author.username}</span>
                      {post.author.verified && <Shield className="w-4 h-4 text-accent-400" />}
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <Gem className="w-3 h-3 text-accent-400" />
                        {post.author.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-dark-400">
                      <Clock className="w-3 h-3" />
                      {post.timestamp}
                    </div>
                  </div>
                </div>
                <button className="text-dark-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              {post.type === 'milestone' && (
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-accent-400" />
                    <h3 className="text-xl font-bold text-white">{post.content.title}</h3>
                  </div>
                  <p className="text-dark-200 whitespace-pre-line mb-4">{post.content.text}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                    <div>
                      <div className="text-xs text-dark-400">Started</div>
                      <div className="text-lg font-bold text-white">{post.content.stats?.startAmount || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-dark-400">Now</div>
                      <div className="text-lg font-bold text-green-400">{post.content.stats?.currentAmount || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-dark-400">ROI</div>
                      <div className="text-lg font-bold text-gradient">{post.content.stats?.roi || '0%'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-dark-400">Time</div>
                      <div className="text-lg font-bold text-white">{post.content.stats?.timeframe || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-all ${
                        getEngagement(post.id)?.liked
                          ? 'text-red-400 scale-110'
                          : 'text-dark-400 hover:text-red-400'
                      }`}
                    >
                      <motion.div
                        animate={getEngagement(post.id)?.liked ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className={`w-5 h-5 ${getEngagement(post.id)?.liked ? 'fill-red-400' : ''}`} />
                      </motion.div>
                      <span>{getEngagement(post.id)?.likes || post.engagement.likes}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-dark-400 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.engagement.comments}</span>
                    </button>
                    <button
                      onClick={() => toggleRepost(post.id)}
                      className={`flex items-center gap-2 transition-all ${
                        getEngagement(post.id)?.reposted
                          ? 'text-green-400'
                          : 'text-dark-400 hover:text-green-400'
                      }`}
                    >
                      <Repeat2 className="w-5 h-5" />
                      <span>{getEngagement(post.id)?.reposts || post.engagement.reposts}</span>
                    </button>
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`flex items-center gap-2 transition-all ${
                        getEngagement(post.id)?.bookmarked
                          ? 'text-yellow-400'
                          : 'text-dark-400 hover:text-yellow-400'
                      }`}
                      title="Bookmark"
                    >
                      {getEngagement(post.id)?.bookmarked ? (
                        <BookmarkCheck className="w-5 h-5 fill-yellow-400" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                    <button className="ml-auto px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Strategy
                    </button>
                  </div>
                </div>
              )}

              {post.type === 'whale-alert' && (
                <div className="relative z-10">
                  <div className="mb-3 px-3 py-1.5 bg-accent-500/20 border border-accent-500/30 rounded-full text-xs font-bold text-accent-400 inline-flex items-center gap-2">
                    <Fish className="w-4 h-4" />
                    WHALE ALERT
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{post.content.title}</h3>

                  <div className="space-y-2 mb-4">
                    {post.content.allocation?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                        <div>
                          <div className="font-semibold text-white">{item.bot}</div>
                          <div className="text-xs text-dark-400">{item.percentage}% allocation</div>
                        </div>
                        <div className="text-lg font-bold text-green-400">{item.amount}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                    <div className="text-sm text-dark-300">
                      <span className="font-bold text-white">{post.engagement.copies} people</span> copied this in last 5 minutes
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Whale
                    </button>
                    <button className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Set Alert
                    </button>
                  </div>
                </div>
              )}

              {post.type === 'bot-review' && (
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                    <h3 className="text-xl font-bold text-white">{post.content.title}</h3>
                  </div>
                  <p className="text-dark-200 mb-4">{post.content.text}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {post.content.comparison?.map((bot, i) => (
                      <div key={i} className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                        <div className="font-bold text-white mb-3">{bot.name}</div>
                        <div className="space-y-2 mb-3">
                          {bot.pros.map((pro, j) => (
                            <div key={j} className="text-xs text-green-400 flex items-center gap-2">
                              <Check className="w-3 h-3" />
                              <span>{pro}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-dark-400">Avg Return:</span>
                            <span className="text-green-400 font-semibold">{bot.stats.avgReturn}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-dark-400">Win Rate:</span>
                            <span className="text-white font-semibold">{bot.stats.winRate}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-dark-400">Max DD:</span>
                            <span className="text-red-400 font-semibold">{bot.stats.maxDD}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-all ${
                        getEngagement(post.id)?.liked
                          ? 'text-red-400 scale-110'
                          : 'text-dark-400 hover:text-red-400'
                      }`}
                    >
                      <motion.div
                        animate={getEngagement(post.id)?.liked ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className={`w-5 h-5 ${getEngagement(post.id)?.liked ? 'fill-red-400' : ''}`} />
                      </motion.div>
                      <span>{getEngagement(post.id)?.likes || post.engagement.likes}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-dark-400 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.engagement.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-dark-400 hover:text-green-400 transition-colors">
                      <Check className="w-4 h-4" />
                      <span>Helpful</span>
                      <span>{post.engagement.helpful}</span>
                    </button>
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`ml-auto flex items-center gap-2 transition-all ${
                        getEngagement(post.id)?.bookmarked
                          ? 'text-yellow-400'
                          : 'text-dark-400 hover:text-yellow-400'
                      }`}
                      title="Bookmark"
                    >
                      {getEngagement(post.id)?.bookmarked ? (
                        <BookmarkCheck className="w-5 h-5 fill-yellow-400" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {showComments === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-dark-700"
                >
                  {/* Comment Input */}
                  <div className="mb-4 flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      You
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setShowComments(null)}
                          className="px-4 py-1 text-sm text-dark-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Add comment logic
                            setCommentText('');
                            setShowComments(null);
                          }}
                          disabled={!commentText.trim()}
                          className="px-4 py-1 text-sm bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mock Comments */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">sarah_m</span>
                          <span className="text-xs text-dark-500">2h ago</span>
                        </div>
                        <p className="text-sm text-dark-200">Congrats! What bots are you using?</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        M
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">mike_trader</span>
                          <span className="text-xs text-dark-500">1h ago</span>
                        </div>
                        <p className="text-sm text-dark-200">Amazing results! Keep it up 🚀</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

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
              {whaleAlerts.map((alert) => (
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
                          <div className="text-sm font-semibold text-white">{alert.whale}</div>
                          <div className="text-xs text-dark-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-dark-200 mb-2 ml-10">{alert.action}</div>

                    {alert.copies && (
                      <div className="ml-10 px-2 py-1 bg-accent-500/20 border border-accent-500/30 rounded text-xs text-accent-400 inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {alert.copies} people copied
                      </div>
                    )}
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
              {topTraders.map((trader) => (
                <div key={trader.rank} className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                    {trader.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{trader.username}</div>
                    <div className="text-xs text-dark-400">{trader.profit}</div>
                  </div>
                  <div className="text-sm font-bold text-green-400">{trader.roi}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <div className="text-xs text-dark-400 mb-1">Your Position</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">#198 / 15,247</span>
                <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <ChevronUp className="w-3 h-3" />
                  +51
                </span>
              </div>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Your Streak
            </h3>

            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-gradient mb-2">14 Days</div>
              <div className="text-sm text-dark-400">Longest: 28 days</div>
            </div>

            <div className="flex gap-1 mb-4">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="flex-1 h-8 bg-gradient-to-t from-primary-500 to-accent-500 rounded"></div>
              ))}
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex-1 h-8 bg-dark-700 rounded"></div>
              ))}
            </div>

            <div className="p-3 bg-dark-900/50 rounded-lg border border-dark-700">
              <div className="text-xs text-dark-400 mb-1">Next Reward (Day 30)</div>
              <div className="text-sm font-semibold text-white">$25 bonus + Bot trial</div>
            </div>
          </motion.div>

          {/* Your Bots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
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
