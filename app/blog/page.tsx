'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'AI Trading', 'Market Analysis', 'Crypto News', 'Education', 'Platform Updates'];

  const blogPosts = [
    {
      id: 1,
      title: 'How AI is Revolutionizing Cryptocurrency Trading in 2024',
      excerpt: 'Discover how machine learning algorithms are transforming the crypto trading landscape and delivering unprecedented returns for investors.',
      category: 'AI Trading',
      author: 'Dr. Michael Chen',
      date: 'December 15, 2024',
      readTime: '5 min read',
      image: '/blog/ai-trading.jpg',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Bitcoin Halving 2024: What Investors Need to Know',
      excerpt: 'A comprehensive analysis of the upcoming Bitcoin halving event and its potential impact on cryptocurrency markets and your portfolio.',
      category: 'Market Analysis',
      author: 'Sarah Williams',
      date: 'December 12, 2024',
      readTime: '7 min read',
      image: '/blog/bitcoin-halving.jpg',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 3,
      title: 'Understanding Smart Contract Security: A Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of smart contract security and how Celestian protects your investments through advanced auditing and encryption.',
      category: 'Education',
      author: 'Emily Rodriguez',
      date: 'December 10, 2024',
      readTime: '6 min read',
      image: '/blog/smart-contracts.jpg',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      title: 'Q4 2024 Market Report: Record-Breaking Performance',
      excerpt: 'Our AI trading algorithms achieved 21.3% returns in November. Here\'s how we did it and what to expect in the coming months.',
      category: 'Platform Updates',
      author: 'David Park',
      date: 'December 8, 2024',
      readTime: '4 min read',
      image: '/blog/market-report.jpg',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 5,
      title: 'DeFi vs Traditional Finance: The Future of Investing',
      excerpt: 'Comparing decentralized finance with traditional banking systems and why DeFi is becoming the preferred choice for savvy investors.',
      category: 'Crypto News',
      author: 'Dr. Michael Chen',
      date: 'December 5, 2024',
      readTime: '8 min read',
      image: '/blog/defi.jpg',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      id: 6,
      title: 'Portfolio Diversification Strategies for Crypto Investors',
      excerpt: 'Expert tips on building a balanced cryptocurrency portfolio that maximizes returns while minimizing risk exposure.',
      category: 'Education',
      author: 'Sarah Williams',
      date: 'December 3, 2024',
      readTime: '6 min read',
      image: '/blog/portfolio.jpg',
      gradient: 'from-pink-500 to-purple-500',
    },
    {
      id: 7,
      title: 'The Rise of Institutional Crypto Adoption in 2024',
      excerpt: 'How major financial institutions are embracing cryptocurrency and what it means for retail investors like you.',
      category: 'Market Analysis',
      author: 'David Park',
      date: 'November 28, 2024',
      readTime: '5 min read',
      image: '/blog/institutional.jpg',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 8,
      title: 'Mastering Technical Analysis for Crypto Trading',
      excerpt: 'Learn how to read charts, identify trends, and make informed trading decisions using proven technical analysis techniques.',
      category: 'Education',
      author: 'Emily Rodriguez',
      date: 'November 25, 2024',
      readTime: '10 min read',
      image: '/blog/technical-analysis.jpg',
      gradient: 'from-red-500 to-orange-500',
    },
    {
      id: 9,
      title: 'Celestian Platform Update: New Features & Enhancements',
      excerpt: 'Announcing our latest platform updates including enhanced security features, improved UI, and new trading pairs.',
      category: 'Platform Updates',
      author: 'Sarah Williams',
      date: 'November 22, 2024',
      readTime: '3 min read',
      image: '/blog/platform-update.jpg',
      gradient: 'from-emerald-500 to-green-500',
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <>
      <Navbar />

      <main className="bg-white dark:bg-dark-900 pt-20">
        {/* Header Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-b border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Celestian Blog
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Insights, News & <span className="text-gradient">Education</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto mb-8">
                Stay informed with the latest trends in AI trading, cryptocurrency markets, and platform updates from our expert team.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <svg
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-gray-200 dark:border-dark-800 sticky top-20 bg-white dark:bg-dark-900 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-gradient">Featured Article</span>
                <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </h2>

              <Link href={`/blog/${featuredPost.id}`}>
                <div className="group relative bg-white dark:bg-dark-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-700 hover:shadow-2xl transition-all duration-500">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="relative h-80 md:h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 rounded-2xl overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        📰
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className={`inline-block px-4 py-2 bg-gradient-to-r ${featuredPost.gradient} rounded-full text-white font-bold text-sm mb-4 w-fit`}>
                        {featuredPost.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white group-hover:text-gradient transition-all">
                        {featuredPost.title}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-dark-300 mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-dark-400">
                        <span className="font-semibold">{featuredPost.author}</span>
                        <span>•</span>
                        <span>{featuredPost.date}</span>
                        <span>•</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
                <span className="text-gray-500 dark:text-dark-400 font-normal ml-3 text-lg">
                  ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
                </span>
              </h2>
            </motion.div>

            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-dark-300">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="group bg-white dark:bg-dark-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                        {/* Image Placeholder */}
                        <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                          <div className="absolute inset-0 flex items-center justify-center text-5xl">
                            📝
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <span className={`inline-block px-3 py-1 bg-gradient-to-r ${post.gradient} rounded-full text-white font-bold text-xs mb-3 w-fit`}>
                            {post.category}
                          </span>
                          <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-gradient transition-all line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-dark-300 mb-4 leading-relaxed line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-400 pt-4 border-t border-gray-200 dark:border-dark-700">
                            <span className="font-semibold">{post.author}</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-500 to-accent-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-6">📬</div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                Never Miss an Update
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest insights, market analysis, and platform updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                Join 50,000+ subscribers. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
