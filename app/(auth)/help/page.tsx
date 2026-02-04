'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';

type TabId = 'financial' | 'general' | 'account';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: TabId;
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'financial',
    title: 'Financial Questions',
    icon: '💰',
    items: [
      {
        id: 'how-to-deposit',
        question: 'How do I make a deposit?',
        answer:
          'To make a deposit:\n1. Go to Wallets page\n2. Click on the "Deposit" button next to your desired currency\n3. Select a cryptocurrency (USDT, BTC, ETH, etc.)\n4. Choose the network (ERC20, TRC20, BEP20, etc.)\n5. Copy the provided address or scan the QR code\n6. Send funds from your external wallet\n7. Wait for network confirmations (usually 3-30 minutes)\n\nMinimum deposit: $1.00',
      },
      {
        id: 'how-to-withdraw',
        question: 'How do I withdraw funds?',
        answer:
          'To withdraw your funds:\n1. Go to Wallets page\n2. Click on the "Withdraw" button\n3. Select currency and network\n4. Enter withdrawal amount and destination address\n5. Enter your PIN code (if enabled) or 2FA code\n6. Confirm the withdrawal\n\nProcessing time: Up to 24 hours\nMinimum withdrawal varies by currency',
      },
      {
        id: 'withdrawal-fees',
        question: 'What are the withdrawal fees?',
        answer:
          'Withdrawal fees vary by cryptocurrency and network:\n\n• USDT (TRC20): ~0.5 USDT\n• USDT (ERC20): ~2 USDT\n• USDT (BEP20): ~0.3 USDT\n• BTC: ~0.0001 BTC\n• ETH: ~0.002 ETH\n• SOL: ~0.00001 SOL\n• BNB: ~0.0005 BNB\n\nNetwork fees are deducted from your withdrawal amount.',
      },
      {
        id: 'investment-returns',
        question: 'How are investment returns calculated?',
        answer:
          'Returns are calculated based on your selected investment plan:\n\n• Essential Plan: 2.0% daily (60% monthly)\n• Professional Plan: 2.5% daily (75% monthly)\n• Ultimate Plan: 3.0% daily (90% monthly)\n\nProfits are distributed daily and credited to your balance automatically. Lock-in period is 30 days for all plans.',
      },
      {
        id: 'minimum-investment',
        question: 'What is the minimum investment amount?',
        answer:
          'Minimum investment amounts by plan:\n\n• Essential Plan: $50\n• Professional Plan: $2,500\n• Ultimate Plan: $10,000\n\nYou can invest any amount above these minimums. There is no maximum investment limit.',
      },
      {
        id: 'referral-commissions',
        question: 'How do referral commissions work?',
        answer:
          'Referral commission structure:\n\n• Level 1: 5% of their investment\n• Level 2: 3% of their investment\n• Level 3: 2% of their investment\n• Levels 4-10: 1% of their investment\n\nCommissions are lifetime - you earn from every investment your referrals make, forever! Bonuses are paid instantly when your referral makes a deposit.\n\n**Turnover Bonus System:**\nEarn additional rewards based on your team\'s total trading volume:\n\n• Bronze Level ($10,000 turnover): 0.5% bonus\n• Silver Level ($50,000 turnover): 1.0% bonus\n• Gold Level ($100,000 turnover): 1.5% bonus\n• Platinum Level ($500,000 turnover): 2.0% bonus\n• Diamond Level ($1,000,000+ turnover): 2.5% bonus\n\nYou can select your preferred bonus currency (USDT, BTC, ETH, etc.) on the Referrals page.',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Questions',
    icon: '❓',
    items: [
      {
        id: 'what-is-celestian',
        question: 'What is Celestian?',
        answer:
          'Celestian is an AI-powered cryptocurrency investment platform operated by Celestian Limited. We use advanced trading algorithms to generate consistent returns for our investors. Our automated trading bots operate 24/7 across multiple exchanges, utilizing strategies including:\n\n• Arbitrage trading\n• Liquidity provision\n• Market making\n• Options strategies\n• DeFi yield farming\n\nWe focus on delivering stable, predictable returns with minimal risk.',
      },
      {
        id: 'is-it-safe',
        question: 'Is Celestian safe and legitimate?',
        answer:
          'Yes! Celestian Limited implements industry-leading security measures:\n\n• Bank-level encryption (256-bit SSL)\n• Two-Factor Authentication (2FA)\n• Withdrawal PIN protection\n• Cold storage for investor funds\n• Regular security audits\n• 100% Insurance Fund\n\nYour funds are protected by our comprehensive security infrastructure.',
      },
      {
        id: 'how-it-works',
        question: 'How does the trading bot work?',
        answer:
          'Our AI trading system:\n\n1. Monitors 50+ cryptocurrency exchanges simultaneously\n2. Identifies profitable arbitrage opportunities in real-time\n3. Executes trades automatically within milliseconds\n4. Manages risk with stop-loss and position sizing\n5. Generates daily profits that are distributed to investors\n\nThe system operates 24/7 without human intervention, ensuring consistent performance.',
      },
      {
        id: 'countries-supported',
        question: 'Which countries are supported?',
        answer:
          'Celestian accepts investors from most countries worldwide, with a few exceptions due to regulatory restrictions:\n\n✓ Supported: USA, UK, EU countries, Canada, Australia, Singapore, UAE, and 150+ more\n\n✗ Not supported: North Korea, Iran, Syria\n\nCheck your local regulations regarding cryptocurrency investments.',
      },
      {
        id: 'customer-support',
        question: 'How can I contact customer support?',
        answer:
          'Our support team is available 24/7:\n\n• Live Chat: Click the chat icon in the bottom right corner\n• Email: support@celestian.org\n• Telegram: @CelestianSupport\n\nAverage response time: Under 2 hours\n\nFor urgent withdrawal or security issues, please use live chat for fastest response.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Management',
    icon: '⚙️',
    items: [
      {
        id: 'create-account',
        question: 'How do I create an account?',
        answer:
          'Creating an account is simple:\n\n1. Click "Sign Up" on the homepage\n2. Enter your email address and create a password\n3. Verify your email by clicking the link sent to your inbox\n4. Complete your profile (name, country)\n5. Enable 2FA for added security (recommended)\n\nAccount verification is not required to start investing.',
      },
      {
        id: 'enable-2fa',
        question: 'How do I enable Two-Factor Authentication?',
        answer:
          'To enable 2FA:\n\n1. Go to Profile → Security tab\n2. Click "Activate 2FA"\n3. Download Google Authenticator on your phone\n4. Scan the QR code shown on screen\n5. Enter the 6-digit code from the app\n6. Save your backup codes in a safe place\n\n2FA adds an extra layer of security to your account and is required for withdrawals over $5,000.',
      },
      {
        id: 'forgot-password',
        question: 'I forgot my password. What should I do?',
        answer:
          'To reset your password:\n\n1. Click "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for a reset link\n4. Click the link and create a new password\n5. Log in with your new password\n\nIf you don\'t receive the email, check your spam folder or contact support.',
      },
      {
        id: 'change-email',
        question: 'Can I change my email address?',
        answer:
          'Yes, you can change your email address:\n\n1. Go to Profile → Personal Info tab\n2. Click "Change Email"\n3. Enter your new email address\n4. Verify the new email by clicking the confirmation link\n5. Confirm the change with 2FA code (if enabled)\n\nNote: Your old email will no longer have access to the account.',
      },
      {
        id: 'withdrawal-pin',
        question: 'What is a Withdrawal PIN and should I set one?',
        answer:
          'Withdrawal PIN is a 4-digit code required for all withdrawal requests. Benefits:\n\n• Prevents unauthorized withdrawals\n• Adds extra security beyond 2FA\n• Required even if someone has your password\n\nWe strongly recommend setting a PIN:\n1. Go to Profile → Security tab\n2. Click "Set PIN Code"\n3. Enter a 4-digit PIN (don\'t use obvious numbers like 1234)\n4. Confirm the PIN\n\nYou\'ll need to enter this PIN for every withdrawal request.',
      },
      {
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer:
          'To delete your account:\n\n1. Withdraw all your funds\n2. Contact support at support@celestian.org\n3. Request account deletion\n4. Confirm your identity with 2FA code\n5. Your account will be deleted within 7 days\n\nNote: This action is permanent and cannot be undone. All data will be deleted as per GDPR regulations.',
      },
    ],
  },
];

function HelpPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('financial');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Handle URL parameters and hash
  useEffect(() => {
    const tab = searchParams?.get('tab') as TabId;
    const hash = window.location.hash.slice(1); // Remove #

    if (tab && ['financial', 'general', 'account'].includes(tab)) {
      setActiveTab(tab);
    }

    if (hash) {
      setExpandedFAQ(hash);
      // Scroll to the question after a short delay
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    router.push(`/help?tab=${tabId}`);
  };

  const handleQuestionClick = (categoryId: TabId, questionId: string) => {
    const newExpanded = expandedFAQ === questionId ? null : questionId;
    setExpandedFAQ(newExpanded);

    // Update URL with hash
    if (newExpanded) {
      router.push(`/help?tab=${categoryId}#${questionId}`);
    } else {
      router.push(`/help?tab=${categoryId}`);
    }
  };

  const activeCategory = faqCategories.find((cat) => cat.id === activeTab)!;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Help Center</h1>
        <p className="text-dark-300">Find answers to frequently asked questions</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 p-2 bg-dark-900/50 backdrop-blur-sm rounded-2xl border-2 border-dark-700 overflow-x-auto">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-2 border-primary-500/30 text-white'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border-2 border-transparent'
                }
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard>
          <div className="space-y-3">
            {activeCategory.items.map((item, index) => (
              <motion.div
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-2 rounded-xl overflow-hidden transition-all ${
                  expandedFAQ === item.id
                    ? 'border-primary-500/50 bg-primary-500/5'
                    : 'border-dark-700 hover:border-primary-500/30'
                }`}
              >
                <button
                  onClick={() => handleQuestionClick(activeCategory.id, item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        expandedFAQ === item.id
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-dark-800 text-dark-400'
                      }`}
                    >
                      <span className="text-lg">?</span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold ${
                          expandedFAQ === item.id ? 'text-white' : 'text-dark-200'
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`text-2xl transition-transform ${
                      expandedFAQ === item.id ? 'rotate-180 text-primary-400' : 'text-dark-500'
                    }`}
                  >
                    ↓
                  </div>
                </button>

                {expandedFAQ === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pl-[68px]">
                      <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                        <div className="text-dark-300 whitespace-pre-line leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Contact Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <GlassCard variant="gradient" gradient="from-primary-500/20 to-accent-500/20">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
            <p className="text-dark-300 mb-6">
              Our support team is available 24/7 to assist you with any questions
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl font-bold text-white transition-all">
                💬 Live Chat
              </button>
              <a
                href="mailto:support@celestian.org"
                className="px-8 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl font-medium text-white transition-colors"
              >
                📧 Email Support
              </a>
              <a
                href="https://t.me/CelestianSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border-2 border-[#0088cc]/30 rounded-xl font-medium text-[#0088cc] transition-colors"
              >
                📱 Telegram
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// Wrapper with Suspense boundary to satisfy Next.js 16 requirement
export default function HelpPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-dark-300">Loading...</div>
      </div>
    }>
      <HelpPageContent />
    </Suspense>
  );
}
