'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { GlowButton } from '@/components/animations/GlowButton';

/* ── Withdrawal fees data ── */
const withdrawalFees = [
  { currency: 'USDT', network: 'TRC-20', fixed: '1 USDT', min: '10 USDT' },
  { currency: 'USDT', network: 'ERC-20', fixed: '5 USDT', min: '20 USDT' },
  { currency: 'BTC', network: 'Bitcoin', fixed: '0.0002 BTC', min: '0.001 BTC' },
  { currency: 'ETH', network: 'ERC-20', fixed: '0.001 ETH', min: '0.01 ETH' },
  { currency: 'BNB', network: 'BEP-20', fixed: '0.005 BNB', min: '0.05 BNB' },
  { currency: 'USDC', network: 'ERC-20', fixed: '5 USDC', min: '20 USDC' },
  { currency: 'SOL', network: 'Solana', fixed: '0.01 SOL', min: '0.1 SOL' },
  { currency: 'TRX', network: 'TRC-20', fixed: '1 TRX', min: '10 TRX' },
];

function WithdrawalFeesTable() {
  return (
    <div className="mt-4 space-y-4">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200/50 dark:border-dark-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100/80 dark:bg-dark-800/80">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">Currency</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">Network</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">Fixed Fee</th>
              <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">Commission</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">Min. Withdrawal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
            {withdrawalFees.map((row, i) => (
              <tr key={i} className="hover:bg-primary-500/[0.03] transition-colors">
                <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{row.currency}</td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-dark-400">{row.network}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-dark-200">{row.fixed}</td>
                <td className="px-4 py-2.5 text-center text-primary-500 font-medium">2%</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-dark-200">{row.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {withdrawalFees.map((row, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200/50 dark:border-dark-700/50 bg-gray-50/50 dark:bg-dark-800/40 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">{row.currency}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-500">{row.network}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-500 mb-0.5">Fixed Fee</span>
                <span className="text-gray-700 dark:text-dark-200">{row.fixed}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-500 mb-0.5">Commission</span>
                <span className="text-primary-500 font-medium">2%</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-500 mb-0.5">Min. Payout</span>
                <span className="text-gray-700 dark:text-dark-200">{row.min}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface FaqItem {
  question: string;
  answer: string;
  icon: string;
  category: string;
  content?: ReactNode;
}

export const faqs: FaqItem[] = [
  // Top 5 — shown on home page
  {
    question: 'How does Cloudbright work?',
    answer: 'It\'s simple: deposit crypto to your protected wallet, browse verified trading bots in our marketplace, and copy the one you like with one click. The master bot trades automatically 24/7 with your capital — you just watch the trades, track live stats, and collect profits. Full transparency: see every active trade, trade history, equity curves, and detailed bot statistics in real time.',
    icon: '🤖',
    category: 'Getting Started',
  },
  {
    question: 'Who creates the trading bots?',
    answer: 'Every bot on Cloudbright is a real trading algorithm developed by our in-house quantitative research team or by verified Strategy Providers — professional traders and quant firms who pass our rigorous vetting process. Our team builds strategies using machine learning, technical analysis, and market microstructure data. External providers must demonstrate a verified track record and meet strict risk management criteria before their strategies are accepted. All bots execute trades automatically across 9+ major exchanges via secure API connections.',
    icon: '🧠',
    category: 'Trading Bots',
  },
  {
    question: 'Is my money safe with Cloudbright?',
    answer: 'Yes. Cloudbright is operated by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED, a licensed Hong Kong company registered in Hong Kong. Your funds are protected in encrypted custodial wallets with AES-256 encryption, 2FA authentication, and hardware security modules. We have passed third-party security audits. Every trade and transaction is fully transparent — you can verify everything in real time from your dashboard.',
    icon: '🔒',
    category: 'Security',
  },
  {
    question: 'What does it cost to use the platform?',
    answer: 'Cloudbright is free to use. No monthly subscriptions, no setup fees, no hidden charges. The only fee is a flat 2% commission on withdrawals. Deposits are free, and there are no charges on your trading profits.',
    icon: '💰',
    category: 'Pricing & Investments',
  },
  {
    question: 'Do I need any experience?',
    answer: 'Not at all. Cloudbright is designed for passive income — the bot does all the trading for you. Each bot has transparent performance data: equity curves, trade history, win rate, Sharpe ratio, and max drawdown. Our Quick Start wizard recommends bots based on your goals in just 4 steps. You copy the bot and watch it work — no trading knowledge required.',
    icon: '👤',
    category: 'Getting Started',
  },
  // Extended — shown in help center
  {
    question: 'How are bots verified before entering the marketplace?',
    answer: 'Every strategy goes through a multi-stage verification pipeline before it reaches users. First, we run 12+ months of historical backtesting across different market conditions — bull runs, corrections, and sideways markets. Next, the strategy undergoes live paper trading to validate real-world execution. Our risk team evaluates max drawdown, Sharpe ratio, and tail risk exposure. Only strategies that pass all stages receive a "Verified" badge. After launch, we continuously monitor performance — if a bot underperforms its risk parameters, it gets flagged or removed from the marketplace.',
    icon: '✅',
    category: 'Trading Bots',
  },
  {
    question: 'What is capital reservation?',
    answer: 'When you copy a bot, you choose a capital reservation period from 15 to 180 days. Longer periods typically offer higher potential returns. You can collect realized profits anytime. Once the reservation period ends, your full investment is available for withdrawal.',
    icon: '⚡',
    category: 'Pricing & Investments',
  },
  {
    question: 'Is there a minimum deposit amount?',
    answer: 'There is no minimum deposit — you can top up your wallet with any amount. We support USDT, BTC, ETH, BNB, USDC, SOL, TRX, and other major cryptocurrencies. Deposits are processed automatically and credited within minutes. The minimum amount to activate a trading bot is $50.',
    icon: '🌐',
    category: 'Pricing & Investments',
  },
  {
    question: 'How does my balance work?',
    answer: 'You can deposit funds in any supported cryptocurrency — USDT, BTC, ETH, BNB, USDC, SOL, TRX. Once received, all deposits are automatically converted to USDT, which is the base currency used across the platform for bot activation, profit tracking, and all internal operations. When you withdraw, you choose any supported currency — the platform converts your USDT balance to the selected coin at the current market rate. Referral commissions and turnover bonuses are also credited automatically in USDT.',
    icon: '💵',
    category: 'Deposits & Withdrawals',
  },
  {
    question: 'What makes Cloudbright different?',
    answer: 'Full transparency and community. Unlike other platforms, you see everything: every active trade the bot makes, full trade history, live P&L, and detailed statistical data. Plus, Cloudbright is a social copy trading community — follow top bots, compare strategies on leaderboards, and learn from the community. A wide selection of verified bots, custodial wallets for multiple cryptocurrencies, and no fees until you withdraw.',
    icon: '🌟',
    category: 'Getting Started',
  },
  // About Company
  {
    question: 'Who operates Cloudbright and where is the company based?',
    answer: 'Cloudbright is operated by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED, a licensed company registered in Hong Kong. Our team includes quantitative researchers, software engineers, and financial professionals with backgrounds in AI, fintech, and algorithmic trading. We maintain robust infrastructure to ensure platform reliability and uptime around the clock.',
    icon: '🏢',
    category: 'About Company',
  },
  {
    question: 'Which cryptocurrencies does Cloudbright support?',
    answer: 'Cloudbright supports deposits and withdrawals in major cryptocurrencies including USDT, BTC, ETH, BNB, USDC, SOL, and TRX. Our trading bots operate across 9+ exchanges and trade the most liquid crypto pairs — including BTC/USDT, ETH/USDT, SOL/USDT, and others — to ensure optimal execution and minimal slippage.',
    icon: '💎',
    category: 'About Company',
  },
  {
    question: 'Where can I view live trading statistics?',
    answer: 'All trading statistics are available in real time on your personal dashboard. You can view every active trade a bot makes, full trade history, equity curves, P&L charts, win rate, Sharpe ratio, and maximum drawdown. Each bot also has a public profile page with verified performance data — so you can evaluate strategies before copying them.',
    icon: '📊',
    category: 'About Company',
  },
  // Deposits & Withdrawals
  {
    question: 'How do I deposit funds?',
    answer: 'Depositing is simple: log into your account, go to the Wallet section, select your preferred cryptocurrency, and send funds to the generated wallet address. Deposits are processed automatically and typically credited within minutes, depending on network confirmations. There are no deposit fees from Cloudbright — you only pay the standard blockchain network fee.',
    icon: '📥',
    category: 'Deposits & Withdrawals',
  },
  {
    question: 'How do withdrawals work and how long do they take?',
    answer: 'To withdraw, navigate to your Wallet, choose the cryptocurrency and amount, and confirm the transaction with 2FA. Withdrawal requests are processed within 24 hours. Most withdrawals are completed within 1–2 hours during business hours. There is no limit on the number of withdrawals. Your realized profits are available for withdrawal at any time, even during an active capital reservation period. Withdrawal fees: a fixed network fee + 2% of the withdrawal amount applies to all cryptocurrencies.',
    content: (
      <>
        <p>To withdraw, navigate to your Wallet, choose the cryptocurrency and amount, and confirm the transaction with 2FA. Withdrawal requests are processed within 24 hours. Most withdrawals are completed within 1–2 hours during business hours. There is no limit on the number of withdrawals. Your realized profits are available for withdrawal at any time, even during an active capital reservation period.</p>
        <p className="mt-3 font-medium text-gray-900 dark:text-white">Withdrawal fees: fixed network fee + 2% of the withdrawal amount.</p>
        <WithdrawalFeesTable />
      </>
    ),
    icon: '📤',
    category: 'Deposits & Withdrawals',
  },
  {
    question: 'Can I withdraw my capital during a capital reservation period?',
    answer: 'Your initial capital is reserved for the duration of the chosen capital reservation period (15–180 days) to allow the bot to execute its strategy effectively. However, realized profits generated during this period can be withdrawn at any time. Once the reservation period expires, your full capital is released and available for withdrawal or reinvestment.',
    icon: '🔐',
    category: 'Deposits & Withdrawals',
  },
  {
    question: 'What happens if a bot performs poorly or loses money?',
    answer: 'Every bot on Cloudbright operates within strict risk parameters including maximum drawdown limits. If a bot exceeds its risk thresholds, it is automatically paused and flagged for review. Our risk management team monitors all strategies continuously. While no investment is risk-free, our multi-stage verification process and real-time monitoring are designed to minimize losses and protect your capital.',
    icon: '⚠️',
    category: 'Trading Bots',
  },
  {
    question: 'Can I deactivate a bot before the capital reservation ends?',
    answer: 'No, early deactivation is not available. Once you activate a bot and select a capital reservation period (15–180 days), the capital remains allocated to the bot until the period expires. This is by design — trading strategies require a consistent capital base to execute properly and deliver expected returns. You can still withdraw realized profits at any time during the reservation period. When the period ends, your full capital is released automatically.',
    icon: '🚫',
    category: 'Trading Bots',
  },
  {
    question: 'Can I copy multiple bots at the same time?',
    answer: 'Yes, you can diversify by copying multiple bots simultaneously. Each bot operates independently with its own allocated capital and reservation period. This allows you to spread risk across different strategies, timeframes, and trading pairs. Many experienced users run 3–5 bots with different risk profiles to balance returns and stability.',
    icon: '🔀',
    category: 'Trading Bots',
  },
  // Compounding
  {
    question: 'How does compounding work on Cloudbright?',
    answer: 'Compounding allows you to automatically reinvest a portion of your realized profits back into the active bot. You can enable or disable compounding at any time from your bot dashboard. When enabled, you set the compounding percentage yourself — from 1% to 100% of each profit payout. For example, if you set compounding to 60%, then 60% of every profit is reinvested and 40% goes to your available balance. Adjusting the percentage takes effect from the next profit distribution. This gives you full control over the balance between growing your capital and taking profits.',
    icon: '🔄',
    category: 'Pricing & Investments',
  },
  // Referral Program
  {
    question: 'Does Cloudbright have a referral program?',
    answer: 'Yes! Cloudbright offers a 5-level affiliate program. Share your unique referral link and earn a commission every time someone in your network activates a trading bot. Level 1 (direct referrals) pays 5%, Level 2 — 3%, Level 3 — 2%, Level 4 — 1%, Level 5 — 0.5%. Commissions are paid instantly in USDT and can be withdrawn immediately. No active deposit is required to participate — just sign up and share your link.',
    icon: '🤝',
    category: 'Referral Program',
  },
  {
    question: 'How are referral rewards calculated and paid out?',
    answer: 'You earn a commission each time a referral in your network activates a bot. The commission is a percentage of the bot activation amount, based on the referral level: 5% for Level 1, 3% for Level 2, 2% for Level 3, 1% for Level 4, and 0.5% for Level 5. On top of that, you earn turnover cash bonuses — as your network\'s active bots accumulate turnover (weighted by level: L1 = 100%, L2 = 50%, L3 = 25%, L4–L5 = 10%), you unlock milestone rewards ranging from $20 to $20,000 in USDT (2% of the turnover threshold). All commissions and bonuses are credited to your balance instantly.',
    icon: '💸',
    category: 'Referral Program',
  },
  // Account & Security
  {
    question: 'Is KYC verification required?',
    answer: 'KYC is not required to use Cloudbright. You can deposit, trade, and withdraw without identity verification. However, unverified accounts have a daily withdrawal limit of $5,000 USDT equivalent. To increase this limit, you can complete KYC voluntarily — go to Settings, upload a valid government-issued ID and a selfie. Verification is typically completed within a few hours.',
    icon: '🪪',
    category: 'Security',
  },
  {
    question: 'What should I do if I lose access to my account?',
    answer: 'If you lose access, use the "Forgot Password" option on the login page to reset your password via email. If you\'ve lost access to your 2FA device, contact our 24/7 support team with your registered email and identity verification details. Our security team will guide you through the account recovery process, which typically takes 24–48 hours to ensure your account\'s safety.',
    icon: '🔑',
    category: 'Security',
  },
  {
    question: 'Am I eligible to use Cloudbright?',
    answer: 'To use Cloudbright, you must be of legal age in your country of residence and comply with the terms outlined in our User Agreement. The platform is available to users worldwide, subject to local regulations. Some jurisdictions may have restrictions on cryptocurrency investments. Please review our Terms of Service for detailed eligibility requirements, or contact our support team for assistance.',
    icon: '📋',
    category: 'Getting Started',
  },
  // Rules & Compliance
  {
    question: 'Are multiple accounts allowed?',
    answer: 'No. Each user is allowed only one account on Cloudbright. Creating multiple accounts (multi-accounting) is strictly prohibited and will result in permanent suspension of all associated accounts and forfeiture of balances. This policy also applies to abusing the affiliate program — any form of self-referral, fake referral activity, or manipulation of the referral system will lead to immediate account termination and loss of all commissions. We use advanced fraud detection systems to monitor and enforce these rules.',
    icon: '⛔',
    category: 'Security',
  },
];

// Animated lines background
export function AnimatedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.8)'; // Primary blue
        ctx.fill();

        // Draw lines
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / 160) * 0.4;
            ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function FAQ({ limit }: { limit?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const displayFaqs = limit ? faqs.slice(0, limit) : faqs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 sm:py-20 bg-white dark:bg-dark-900 overflow-hidden">
      {/* Animated canvas background */}
      <AnimatedLines />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300">
            Everything you need to know about copy trading with Cloudbright.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-2">
          {displayFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? 'bg-white/80 dark:bg-dark-800/80 border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'bg-gray-50/50 dark:bg-dark-800/50 border-gray-200/50 dark:border-dark-700/50 hover:border-primary-500/30'
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-primary-500/5 transition-all duration-300"
              >
                <span className="text-base font-medium text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl text-primary-400 font-bold flex-shrink-0"
                >
                  ↓
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-3 text-sm text-gray-700 dark:text-dark-200 leading-relaxed border-t border-gray-200/50 dark:border-dark-700/50 pt-3">
                      {faq.content ?? faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <div className="relative p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-2xl backdrop-blur-sm overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Still Have Questions?
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-300 mb-5">
                Browse our complete FAQ library or contact our 24/7 support team
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <GlowButton href="/help-center" variant="primary" size="md">
                  Visit Help Center
                </GlowButton>
                <GlowButton variant="secondary" size="md">
                  Chat with Support
                </GlowButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
