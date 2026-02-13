'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { faqs, AnimatedLines } from '@/components/FAQ';
import { GlowButton } from '@/components/animations/GlowButton';

const categories = ['All', 'Getting Started', 'Trading Bots', 'Pricing & Investments', 'Security'];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <main className="bg-dark-900 pt-20">
        {/* ══════════ HERO ══════════ */}
        <section className="relative py-20 overflow-hidden">
          {/* Animated particles canvas */}
          <AnimatedLines />

          {/* Radial glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-primary-500" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                  Help Center
                </span>
                <div className="w-8 h-0.5 bg-primary-500" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 text-white">
                How Can We <span className="text-gradient">Help You?</span>
              </h1>
              <p className="text-base sm:text-lg text-dark-300 max-w-2xl mx-auto mb-10">
                Find answers to common questions about copy trading with Cloudbright.
              </p>

              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-dark-800 border border-dark-700 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                  />
                  <svg
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
            </motion.div>
          </div>
        </section>

        {/* ══════════ FAQ ══════════ */}
        <section className="relative pb-24 overflow-hidden">
          {/* Animated particles canvas */}
          <AnimatedLines />

          {/* Radial glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-accent-500/6 rounded-full blur-3xl" />
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-primary-500/6 rounded-full blur-3xl" />
            <div className="absolute top-[60%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setOpenFaqIndex(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-dark-800 text-dark-300 border border-dark-700 hover:border-primary-500/30 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No results found
                  </h3>
                  <p className="text-dark-400">
                    Try adjusting your search or browse a different category.
                  </p>
                </motion.div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index
                        ? 'bg-dark-800/80 border-primary-500/50 shadow-lg shadow-primary-500/10'
                        : 'bg-dark-800/50 border-dark-700/50 hover:border-primary-500/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-500/5 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-400/70 block mb-1">
                          {faq.category}
                        </span>
                        <span className="text-base font-medium text-white block">
                          {faq.question}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl text-primary-400 font-bold flex-shrink-0 ml-4"
                      >
                        ↓
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-sm text-dark-200 leading-relaxed border-t border-dark-700/50 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <img
            src="/cosmic-bg.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-dark-900 to-transparent z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white">
                Still Have Questions?
              </h2>
              <p className="text-base sm:text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to help you with anything.
              </p>
              <GlowButton href="/contact" variant="primary" size="lg">
                Contact Support
              </GlowButton>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
