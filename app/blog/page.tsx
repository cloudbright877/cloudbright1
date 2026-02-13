'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Search, BookOpen, Cpu } from 'lucide-react';
import { categories, blogPosts } from './data';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <>
      <Navbar />

      <main className="bg-dark-900">
        {/* ══════════ HERO ══════════ */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <img
            src="/blog-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-medium text-primary-300">
                  Cloudbright Blog
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
                <span className="text-white drop-shadow-2xl">
                  Insights, News &{' '}
                  <span className="text-gradient">Education</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-100 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                Stay informed with the latest trends in crypto trading, market analysis, and platform updates from our team.
              </p>

              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-dark-800/80 backdrop-blur-md border border-dark-700 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ CATEGORY FILTER ══════════ */}
        <div className="sticky top-20 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === cat.label
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                        : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════ FEATURED POST ══════════ */}
        {selectedCategory === 'All' && !searchQuery && (
          <section className="py-16 bg-gradient-to-b from-dark-900 to-dark-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-0.5 bg-primary-500" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                    Featured
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.id}`}>
                  <div className="group relative rounded-2xl overflow-hidden border border-dark-700/50 hover:border-primary-500/30 transition-all duration-500">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500`} />

                    <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-10">
                      {/* Left: image placeholder */}
                      <div className="relative h-72 md:h-full min-h-[280px] rounded-xl overflow-hidden bg-dark-800 border border-dark-700/50">
                        <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-20`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-16 h-16 text-white/20" />
                        </div>
                      </div>

                      {/* Right: content */}
                      <div className="flex flex-col justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${featuredPost.gradient} rounded-full text-white text-xs font-bold mb-4 w-fit`}>
                          {featuredPost.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 group-hover:text-gradient transition-all leading-tight">
                          {featuredPost.title}
                        </h3>
                        <p className="text-dark-300 leading-relaxed mb-6">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-dark-400">
                          <span className="font-semibold text-dark-200">{featuredPost.author}</span>
                          <span className="w-1 h-1 rounded-full bg-dark-500" />
                          <span>{featuredPost.date}</span>
                          <span className="w-1 h-1 rounded-full bg-dark-500" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 text-primary-400 font-medium text-sm group-hover:gap-3 transition-all">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            </div>
          </section>
        )}

        {/* ══════════ BLOG GRID ══════════ */}
        <section className="relative py-16 overflow-hidden">
          {/* Radial glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-semibold text-white">
                  {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
                  <span className="text-dark-500 font-normal ml-3 text-base">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                </h2>
              </div>
            </RevealOnScroll>

            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  No articles found
                </h3>
                <p className="text-dark-400">
                  Try adjusting your search or browse a different category.
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="group relative h-full rounded-2xl bg-dark-800/50 border border-dark-700/50 overflow-hidden hover:border-primary-500/30 transition-all duration-500 flex flex-col">
                        {/* Hover gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

                        {/* Image placeholder */}
                        <div className="relative h-48 bg-dark-800 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-500`} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white/10 group-hover:text-white/20 transition-colors" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r ${post.gradient} rounded-full text-white text-[10px] font-bold uppercase tracking-wider`}>
                              {post.category}
                            </span>
                            <span className="text-[11px] text-dark-500">{post.readTime}</span>
                          </div>

                          <h3 className="text-lg font-semibold text-white mb-3 leading-snug group-hover:text-gradient transition-all line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-sm text-dark-300 leading-relaxed line-clamp-3 flex-1 mb-4">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-dark-700/50">
                            <span className="text-xs font-semibold text-dark-200">{post.author}</span>
                            <span className="text-xs text-dark-500">{post.date}</span>
                          </div>
                        </div>

                        {/* Bottom hover line */}
                        <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${post.gradient} transition-all duration-700`} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══════════ NEWSLETTER CTA ══════════ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <img
            src="/blog-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-white">
                Never Miss an{' '}
                <span className="text-gradient">Update</span>
              </h2>
              <p className="text-base sm:text-lg text-dark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter and get the latest insights, market analysis, and platform updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-dark-800/80 backdrop-blur-md border border-dark-700 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-dark-500 text-sm mt-4">
                Join 26,000+ subscribers. Unsubscribe anytime.
              </p>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
