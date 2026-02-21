'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search, MessageCircle, HelpCircle } from 'lucide-react';
import { faqs } from '@/components/FAQ';

const categories = [
  'All',
  'Getting Started',
  'About Company',
  'Trading Bots',
  'Pricing & Investments',
  'Deposits & Withdrawals',
  'Referral Program',
  'Security',
];

export default function DashboardHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-6 h-6 text-primary-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Help & FAQ
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-400">
            Find answers to common questions about the platform.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenFaqIndex(null);
            }}
            className="w-full pl-12 pr-10 py-3 bg-white dark:bg-dark-800/80 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setOpenFaqIndex(null);
              }}
              className={`px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-white dark:bg-dark-800/80 text-gray-600 dark:text-dark-300 border border-gray-200 dark:border-dark-700 hover:border-primary-500/30 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 dark:text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No results found
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-400">
                Try adjusting your search or browse a different category.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index
                    ? 'bg-white dark:bg-dark-800/90 border-primary-500/40 shadow-md shadow-primary-500/5'
                    : 'bg-white/80 dark:bg-dark-800/60 border-gray-200 dark:border-dark-700/50 hover:border-primary-500/30'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-primary-500/[0.03] transition-all duration-300"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-400/70 block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">
                      {faq.question}
                    </span>
                  </div>
                  <motion.span
                    animate={{
                      rotate: openFaqIndex === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-lg text-primary-400 font-bold flex-shrink-0 ml-4"
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
                      <div className="px-5 pb-4 text-sm text-gray-700 dark:text-dark-200 leading-relaxed border-t border-gray-200/50 dark:border-dark-700/50 pt-3">
                        {faq.content ?? faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-center">
          <MessageCircle className="w-8 h-8 text-primary-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-300 mb-4">
            Our support team is available 24/7 to help you.
          </p>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/30 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
