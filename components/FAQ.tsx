'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
const faqs = [
  {
    question: 'How does Cloudbright work?',
    answer: 'It\'s simple: deposit crypto to your protected wallet, browse 100+ verified trading bots in our marketplace, and copy the one you like with one click. The master bot trades automatically 24/7 with your capital — you just watch the trades, track live stats, and collect profits. Full transparency: see every active trade, trade history, equity curves, and detailed bot statistics in real time.',
    icon: '🤖',
  },
  {
    question: 'Is my money safe with Cloudbright?',
    answer: 'Yes. Cloudbright is operated by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED, a licensed Hong Kong company registered in Hong Kong. Your funds are protected in encrypted custodial wallets with AES-256 encryption, 2FA authentication, and hardware security modules. We have passed third-party security audits. Every trade and transaction is fully transparent — you can verify everything in real time from your dashboard.',
    icon: '🔒',
  },
  {
    question: 'What does it cost to use the platform?',
    answer: 'Cloudbright is free to use. No monthly subscriptions, no setup fees, no hidden charges. We charge a small commission only when you collect realized profit. If you don\'t profit, you don\'t pay. It\'s that simple.',
    icon: '💰',
  },
  {
    question: 'Do I need any experience?',
    answer: 'Not at all. Cloudbright is designed for passive income — the bot does all the trading for you. Each bot has transparent performance data: equity curves, trade history, win rate, Sharpe ratio, and max drawdown. Our Quick Start wizard recommends bots based on your goals in just 4 steps. You copy the bot and watch it work — no trading knowledge required.',
    icon: '👤',
  },
  {
    question: 'What are the lock-in periods?',
    answer: 'When you copy a bot, you choose a lock-in period from 7 to 180 days. Longer lock-in periods typically offer higher potential returns. You can collect realized profits anytime. Once the lock-in period ends, your full investment is available for withdrawal.',
    icon: '⚡',
  },
  {
    question: 'What is the minimum investment?',
    answer: 'Minimum investment is $50. We support deposits in USDT, BTC, ETH, BNB, USDC, SOL, TRX, and other major cryptocurrencies. Deposits are credited instantly to your protected wallet. Start small and scale as you grow.',
    icon: '🌐',
  },
  {
    question: 'What makes Cloudbright different?',
    answer: 'Full transparency and community. Unlike other platforms, you see everything: every active trade the bot makes, full trade history, live P&L, and detailed statistical data. Plus, Cloudbright is a social copy trading community — follow top bots, compare strategies on leaderboards, and learn from the community. 100+ verified bots, custodial wallets for 7+ cryptocurrencies, and commission only on profit.',
    icon: '🌟',
  },
];

// Animated lines background
function AnimatedLines() {
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 bg-dark-900 overflow-hidden">
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
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-base text-dark-200">
            Everything you need to know about copy trading with Cloudbright.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? 'bg-dark-800/80 border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'bg-dark-800/50 border-dark-700/50 hover:border-primary-500/30'
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-primary-500/5 transition-all duration-300"
              >
                <span className="text-base font-medium text-white pr-4">
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
                    <div className="px-5 pb-3 text-sm text-dark-200 leading-relaxed border-t border-dark-700/50 pt-3">
                      {faq.answer}
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
              <h3 className="text-lg font-semibold mb-2 text-white">
                Still Have Questions?
              </h3>
              <p className="text-sm text-dark-300 mb-5">
                Browse our complete FAQ library or contact our 24/7 support team
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/help-center"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-medium text-sm text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                >
                  Visit Help Center
                </a>
                <button className="px-5 py-2.5 bg-transparent border-2 border-primary-500 rounded-full font-medium text-sm text-primary-400 hover:bg-primary-500/10 transition-all duration-300">
                  Chat with Support
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
