'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

type TabId = 'financial' | 'general' | 'account';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Financial Questions', 'General Questions', 'Account Management'];

  // FAQ from /help page - structured by categories
  const faqsByCategory = [
    // Financial Questions
    {
      category: 'Financial Questions',
      question: 'How do I make a deposit?',
      answer: 'To make a deposit:\n1. Go to Wallets page\n2. Click on the "Deposit" button next to your desired currency\n3. Select a cryptocurrency (USDT, BTC, ETH, etc.)\n4. Choose the network (ERC20, TRC20, BEP20, etc.)\n5. Copy the provided address or scan the QR code\n6. Send funds from your external wallet\n7. Wait for network confirmations (usually 3-30 minutes)\n\nMinimum deposit: $1.00',
    },
    {
      category: 'Financial Questions',
      question: 'How do I withdraw funds?',
      answer: 'To withdraw your funds:\n1. Go to Wallets page\n2. Click on the "Withdraw" button\n3. Select currency and network\n4. Enter withdrawal amount and destination address\n5. Enter your PIN code (if enabled) or 2FA code\n6. Confirm the withdrawal\n\nProcessing time: Up to 24 hours\nMinimum withdrawal varies by currency',
    },
    {
      category: 'Financial Questions',
      question: 'What are the withdrawal fees?',
      answer: 'Withdrawal fees vary by cryptocurrency and network:\n\n• USDT (TRC20): ~0.5 USDT\n• USDT (ERC20): ~2 USDT\n• USDT (BEP20): ~0.3 USDT\n• BTC: ~0.0001 BTC\n• ETH: ~0.002 ETH\n• SOL: ~0.00001 SOL\n• BNB: ~0.0005 BNB\n\nNetwork fees are deducted from your withdrawal amount.',
    },
    {
      category: 'Financial Questions',
      question: 'How are investment returns calculated?',
      answer: 'Returns are calculated based on your selected investment plan:\n\n• Essential Plan: 2.0% daily (60% monthly)\n• Professional Plan: 2.5% daily (75% monthly)\n• Ultimate Plan: 3.0% daily (90% monthly)\n\nProfits are distributed daily and credited to your balance automatically. Lock-in period is 30 days for all plans.',
    },
    {
      category: 'Financial Questions',
      question: 'What is the minimum investment amount?',
      answer: 'Minimum investment amounts by plan:\n\n• Essential Plan: $50\n• Professional Plan: $2,500\n• Ultimate Plan: $10,000\n\nYou can invest any amount above these minimums. There is no maximum investment limit.',
    },
    {
      category: 'Financial Questions',
      question: 'How do referral commissions work?',
      answer: 'Referral commission structure:\n\n• Level 1: 5% of their investment\n• Level 2: 3% of their investment\n• Level 3: 2% of their investment\n• Levels 4-10: 1% of their investment\n\nCommissions are lifetime - you earn from every investment your referrals make, forever! Bonuses are paid instantly when your referral makes a deposit.\n\n**Turnover Bonus System:**\nEarn additional rewards based on your team\'s total trading volume:\n\n• Bronze Level ($10,000 turnover): 0.5% bonus\n• Silver Level ($50,000 turnover): 1.0% bonus\n• Gold Level ($100,000 turnover): 1.5% bonus\n• Platinum Level ($500,000 turnover): 2.0% bonus\n• Diamond Level ($1,000,000+ turnover): 2.5% bonus\n\nYou can select your preferred bonus currency (USDT, BTC, ETH, etc.) on the Referrals page.',
    },
    // General Questions
    {
      category: 'General Questions',
      question: 'What is Celestian?',
      answer: 'Celestian is an AI-powered cryptocurrency investment platform operated by Celestian Limited. We use advanced trading algorithms to generate consistent returns for our investors. Our automated trading bots operate 24/7 across multiple exchanges, utilizing strategies including:\n\n• Arbitrage trading\n• Liquidity provision\n• Market making\n• Options strategies\n• DeFi yield farming\n\nWe focus on delivering stable, predictable returns with minimal risk.',
    },
    {
      category: 'General Questions',
      question: 'Is Celestian safe and legitimate?',
      answer: 'Yes! Celestian Limited implements industry-leading security measures:\n\n• Bank-level encryption (256-bit SSL)\n• Two-Factor Authentication (2FA)\n• Withdrawal PIN protection\n• Cold storage for investor funds\n• Regular security audits\n• 100% Insurance Fund\n\nYour funds are protected by our comprehensive security infrastructure.',
    },
    {
      category: 'General Questions',
      question: 'How does the trading bot work?',
      answer: 'Our AI trading system:\n\n1. Monitors 50+ cryptocurrency exchanges simultaneously\n2. Identifies profitable arbitrage opportunities in real-time\n3. Executes trades automatically within milliseconds\n4. Manages risk with stop-loss and position sizing\n5. Generates daily profits that are distributed to investors\n\nThe system operates 24/7 without human intervention, ensuring consistent performance.',
    },
    {
      category: 'General Questions',
      question: 'Which countries are supported?',
      answer: 'Celestian accepts investors from most countries worldwide, with a few exceptions due to regulatory restrictions:\n\n✓ Supported: USA, UK, EU countries, Canada, Australia, Singapore, UAE, and 150+ more\n\n✗ Not supported: North Korea, Iran, Syria\n\nCheck your local regulations regarding cryptocurrency investments.',
    },
    {
      category: 'General Questions',
      question: 'How can I contact customer support?',
      answer: 'Our support team is available 24/7:\n\n• Live Chat: Click the chat icon in the bottom right corner\n• Email: support@celestian.org\n• Telegram: @CelestianSupport\n\nAverage response time: Under 2 hours\n\nFor urgent withdrawal or security issues, please use live chat for fastest response.',
    },
    // Account Management
    {
      category: 'Account Management',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple:\n\n1. Click "Sign Up" on the homepage\n2. Enter your email address and create a password\n3. Verify your email by clicking the link sent to your inbox\n4. Complete your profile (name, country)\n5. Enable 2FA for added security (recommended)\n\nAccount verification is not required to start investing.',
    },
    {
      category: 'Account Management',
      question: 'How do I enable Two-Factor Authentication?',
      answer: 'To enable 2FA:\n\n1. Go to Profile → Security tab\n2. Click "Activate 2FA"\n3. Download Google Authenticator on your phone\n4. Scan the QR code shown on screen\n5. Enter the 6-digit code from the app\n6. Save your backup codes in a safe place\n\n2FA adds an extra layer of security to your account and is required for withdrawals over $5,000.',
    },
    {
      category: 'Account Management',
      question: 'I forgot my password. What should I do?',
      answer: 'To reset your password:\n\n1. Click "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for a reset link\n4. Click the link and create a new password\n5. Log in with your new password\n\nIf you don\'t receive the email, check your spam folder or contact support.',
    },
    {
      category: 'Account Management',
      question: 'Can I change my email address?',
      answer: 'Yes, you can change your email address:\n\n1. Go to Profile → Personal Info tab\n2. Click "Change Email"\n3. Enter your new email address\n4. Verify the new email by clicking the confirmation link\n5. Confirm the change with 2FA code (if enabled)\n\nNote: Your old email will no longer have access to the account.',
    },
    {
      category: 'Account Management',
      question: 'What is a Withdrawal PIN and should I set one?',
      answer: 'Withdrawal PIN is a 4-digit code required for all withdrawal requests. Benefits:\n\n• Prevents unauthorized withdrawals\n• Adds extra security beyond 2FA\n• Required even if someone has your password\n\nWe strongly recommend setting a PIN:\n1. Go to Profile → Security tab\n2. Click "Set PIN Code"\n3. Enter a 4-digit PIN (don\'t use obvious numbers like 1234)\n4. Confirm the PIN\n\nYou\'ll need to enter this PIN for every withdrawal request.',
    },
    {
      category: 'Account Management',
      question: 'How do I delete my account?',
      answer: 'To delete your account:\n\n1. Withdraw all your funds\n2. Contact support at support@celestian.org\n3. Request account deletion\n4. Confirm your identity with 2FA code\n5. Your account will be deleted within 7 days\n\nNote: This action is permanent and cannot be undone. All data will be deleted as per GDPR regulations.',
    },
  ];

  const popularArticles = [
    {
      title: 'Complete Guide to Getting Started with Celestian',
      category: 'Tutorial',
      readTime: '10 min',
      icon: '📚',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Understanding Your Investment Dashboard',
      category: 'Tutorial',
      readTime: '5 min',
      icon: '📊',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'How to Maximize Your Returns with AI Trading',
      category: 'Strategy',
      readTime: '8 min',
      icon: '💡',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Security Best Practices for Crypto Investors',
      category: 'Security',
      readTime: '6 min',
      icon: '🔒',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Tax Reporting for Cryptocurrency Earnings',
      category: 'Legal',
      readTime: '12 min',
      icon: '📝',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Troubleshooting Common Login Issues',
      category: 'Technical',
      readTime: '4 min',
      icon: '🔧',
      gradient: 'from-pink-500 to-purple-500',
    },
  ];

  const filteredFaqs = faqsByCategory.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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
                Help Center
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                How Can We <span className="text-gradient">Help You?</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto mb-8">
                Find answers to common questions, browse helpful articles, or contact our support team.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help articles, FAQs, guides..."
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
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Popular Articles */}
        <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white">
                Popular <span className="text-gradient">Articles</span>
              </h2>
              <p className="text-gray-600 dark:text-dark-300">
                Most helpful guides and tutorials for Celestian users
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/help-center/${index + 1}`}>
                    <div className="group bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                      <div className={`w-12 h-12 bg-gradient-to-br ${article.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {article.icon}
                      </div>
                      <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-black mt-2 mb-3 text-gray-900 dark:text-white group-hover:text-gradient transition-all">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-dark-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-gray-600 dark:text-dark-300">
                Quick answers to common questions about Celestian platform
              </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300">
                    Try adjusting your search or browse different categories.
                  </p>
                </motion.div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
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
                          <div className="px-6 pb-5 text-gray-600 dark:text-dark-300 leading-relaxed border-t border-gray-200 dark:border-dark-700 pt-4 whitespace-pre-line">
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

        {/* Still Need Help CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-500 to-accent-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-6">💁</div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                Still Need Help?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Contact Support
                </Link>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  Start Live Chat
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
