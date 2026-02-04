'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import FloatingShapes from './FloatingShapes';

const faqs = [
  {
    question: 'How does Celestian generate consistent returns?',
    answer: 'Our proprietary AI algorithms analyze millions of data points across 25+ cryptocurrency exchanges in real-time. We utilize arbitrage opportunities, market-making strategies, and predictive analytics to generate consistent returns. Our system has been refined over 5 years and manages over $127M in assets.',
    icon: '🤖',
  },
  {
    question: 'Is my investment safe and secure?',
    answer: 'Absolutely. We employ bank-level security including cold storage for 95% of assets, multi-signature wallets, insurance coverage up to $100M, and regular third-party security audits. Your funds are protected by industry-leading encryption and our platform has never been hacked.',
    icon: '🔒',
  },
  {
    question: 'What is the minimum investment required?',
    answer: 'We offer flexible plans starting from just $50 for our Essential plan. This makes our AI-powered trading accessible to everyone. You can start small and scale up as you see consistent results and build confidence in our platform.',
    icon: '💰',
  },
  {
    question: 'Can I withdraw my funds anytime?',
    answer: 'Your funds are available for withdrawal after the 30-day lock-in period of your investment plan. Withdrawals are processed within 24 hours and you have complete control over your capital. The lock-in period ensures optimal strategy execution.',
    icon: '⚡',
  },
  {
    question: 'Do I need trading experience to use Celestian?',
    answer: 'Not at all! Our platform is designed for everyone, from complete beginners to experienced investors. The AI handles all the trading automatically—you simply deposit funds and watch your investment grow. No technical knowledge or trading experience required.',
    icon: '👤',
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply create an account (takes 2 minutes), verify your email address, deposit funds via cryptocurrency, choose your investment plan, and start earning immediately. Our support team is available 24/7 to help with onboarding.',
    icon: '🚀',
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

    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
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
        ctx.fillStyle = 'rgba(217, 70, 239, 0.6)'; // Purple accent
        ctx.fill();

        // Draw lines
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / 120) * 0.25;
            ctx.strokeStyle = `rgba(217, 70, 239, ${opacity})`;
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
      style={{ opacity: 0.3 }}
    />
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 bg-gradient-to-b from-white dark:from-dark-900 via-gray-50 dark:via-dark-800 to-white dark:to-dark-900 overflow-hidden">
      {/* Animated canvas background */}
      <AnimatedLines />

      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-cube.png',
            size: 100,
            position: { top: '30%', right: '10%' },
            rotate: -20,
          },
          {
            src: '/images/glossy-glass-sphere-floating-in.png',
            size: 150,
            position: { bottom: '25%', left: '8%' },
            rotate: 0,
          },
        ]}
      />

      {/* Animated blur orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.2, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-dark-200">
            Got questions? We've got answers about investing with Celestian.
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
                  ? 'bg-gray-100 dark:bg-dark-800/80 border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'bg-gray-50 dark:bg-dark-800/50 border-gray-200 dark:border-dark-700/50 hover:border-primary-500/30'
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
                  className="text-xl text-primary-600 dark:text-primary-400 flex-shrink-0"
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
                    <div className="px-5 pb-3 text-sm text-gray-600 dark:text-dark-200 leading-relaxed border-t border-gray-200 dark:border-dark-700/50 pt-3">
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
          <div
            className="relative p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-2xl backdrop-blur-sm overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: 'url(/cosmic-bg.jpeg)' }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm rounded-2xl"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 text-white">
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
