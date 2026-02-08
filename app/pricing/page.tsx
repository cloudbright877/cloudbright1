'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { RevealOnScroll, GlowButton } from '@/components/animations';
import {
  Check,
  X,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Zap,
  Shield,
  Wallet,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const includedFeatures = [
  'Full access to bot marketplace',
  'Browse and compare all bots',
  'Real-time analytics dashboard',
  'Copy any bot, any time',
  'Social features & leaderboards',
  'Multi-exchange support (9+ exchanges)',
  '24/7 automated trading',
  'No minimum investment',
  'No lock-up periods',
  'No withdrawal fees from platform',
];

const steps = [
  {
    number: '01',
    title: 'Trade for Free',
    description:
      'Browse bots, copy strategies, trade on your exchange. No upfront cost.',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    title: 'Profit Together',
    description:
      'When your copied bot generates profit, we take a small 1-2% commission.',
    icon: Wallet,
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    number: '03',
    title: 'Withdraw Anytime',
    description:
      'Your profits minus commission go straight to your exchange wallet. No lock-ups.',
    icon: Shield,
    gradient: 'from-emerald-500 to-green-500',
  },
];

const comparisonRows: {
  feature: string;
  cloudbright: string;
  competitors: string;
  cloudbrightPositive: boolean;
}[] = [
  {
    feature: 'Monthly Fee',
    cloudbright: 'Free',
    competitors: '$29 - $199/mo',
    cloudbrightPositive: true,
  },
  {
    feature: 'Commission Model',
    cloudbright: '1-2% on profit only',
    competitors: '10-30% on profit',
    cloudbrightPositive: true,
  },
  {
    feature: 'Minimum Investment',
    cloudbright: 'None',
    competitors: '$100 - $10,000',
    cloudbrightPositive: true,
  },
  {
    feature: 'Lock-up Period',
    cloudbright: 'None',
    competitors: '30 - 90 days',
    cloudbrightPositive: true,
  },
  {
    feature: 'Withdrawal Fees',
    cloudbright: 'None',
    competitors: '1-5%',
    cloudbrightPositive: true,
  },
  {
    feature: 'Fund Custody',
    cloudbright: 'Non-custodial (your exchange)',
    competitors: 'Custodial (they hold funds)',
    cloudbrightPositive: true,
  },
  {
    feature: 'Bot Access',
    cloudbright: 'All bots included',
    competitors: 'Tiered / limited',
    cloudbrightPositive: true,
  },
];

const faqs: { question: string; answer: string }[] = [
  {
    question: 'When do I pay?',
    answer:
      'Only when your copied bot generates profit. No profit = no fee.',
  },
  {
    question: 'How is the commission calculated?',
    answer:
      '1-2% is deducted from your realized profit when you collect earnings.',
  },
  {
    question: 'Are there any hidden fees?',
    answer:
      'No. No subscription, no setup fee, no withdrawal fee from our platform. Exchange trading fees apply as normal.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Stop copying a bot at any time. There are no contracts or commitments.',
  },
  {
    question: 'Is there a minimum investment?',
    answer:
      'No minimum. Start with any amount you are comfortable with.',
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion Item                                                     */
/* ------------------------------------------------------------------ */

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border border-gray-200 dark:border-dark-700 rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700/60 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary-500 shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-dark-400 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0 text-gray-600 dark:text-dark-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <PageHero
        videoSrc="/services_hero.mp4"
        videoSrcMobile="/services_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Simple, Transparent{' '}
            <span className="text-gradient">Pricing</span>
          </span>
        }
        subtitle="No subscriptions. No hidden fees. You only pay when you profit."
        badge={{
          text: 'Pay Only When You Profit',
          icon: (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ),
        }}
        ctaButtons={[
          { text: 'Get Started Free', href: '/register', variant: 'primary' },
        ]}
        overlay="medium"
      />

      <main className="bg-white dark:bg-dark-900">
        {/* ── Main Pricing Card ──────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <RevealOnScroll>
              <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-primary-500 via-accent-500 to-primary-500">
                <div className="bg-white dark:bg-dark-800 rounded-[22px] p-8 sm:p-12">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                      One Simple Model
                    </span>
                    <div className="mt-6 flex items-baseline justify-center gap-2">
                      <span className="text-6xl sm:text-7xl font-black text-gradient">
                        1-2%
                      </span>
                    </div>
                    <p className="mt-3 text-lg text-gray-600 dark:text-dark-300">
                      Commission on Profits Only
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-dark-600 to-transparent mb-10" />

                  {/* Features */}
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                    {includedFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700 dark:text-dark-200">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="text-center">
                    <GlowButton href="/register" size="lg">
                      Start Trading Free
                      <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                    </GlowButton>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────── */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  How It Works
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Three Simple{' '}
                  <span className="text-gradient">Steps</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  Start trading in minutes. No credit card required.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <RevealOnScroll key={step.number} delay={index * 0.15}>
                    <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700 h-full group hover:shadow-xl transition-shadow duration-300">
                      {/* Step number */}
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} text-white font-bold text-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="text-xs font-bold text-gray-400 dark:text-dark-400 uppercase tracking-widest mb-2">
                        Step {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Connecting arrow (hidden on last item and mobile) */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                          <ArrowRight className="w-6 h-6 text-gray-300 dark:text-dark-600" />
                        </div>
                      )}
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Why Cloudbright
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  See How We{' '}
                  <span className="text-gradient">Compare</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
                  Transparent pricing that puts you first.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-700">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-dark-800">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">
                        Feature
                      </th>
                      <th className="text-center px-6 py-4">
                        <span className="text-sm font-bold text-gradient uppercase tracking-wide">
                          Cloudbright
                        </span>
                      </th>
                      <th className="text-center px-6 py-4 text-sm font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wide">
                        Typical Competitors
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <motion.tr
                        key={row.feature}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.06,
                        }}
                        className="border-t border-gray-100 dark:border-dark-700/60"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                            <Check className="w-4 h-4" />
                            {row.cloudbright}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-2 text-gray-500 dark:text-dark-400">
                            <X className="w-4 h-4 text-red-400" />
                            {row.competitors}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  FAQ
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Common{' '}
                  <span className="text-gradient">Questions</span>
                </h2>
              </div>
            </RevealOnScroll>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Risk Disclosure ─────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
                      Risk Disclosure
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed">
                      Cryptocurrency trading involves substantial risk of loss.
                      Past performance of trading bots does not guarantee future
                      results. You should only invest what you can afford to
                      lose. CLOUDBRIGHT does not provide financial advice.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────── */}
        <section className="py-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Ready to{' '}
                <span className="text-gradient">Start?</span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Join thousands of traders using Cloudbright. Free to start, you
                only pay when you profit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton href="/register" size="lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                </GlowButton>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white dark:bg-dark-800 border-2 border-gray-300 dark:border-dark-700 rounded-full font-semibold text-gray-900 dark:text-white hover:border-primary-500 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
