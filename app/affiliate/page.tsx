'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);

  const commissionTiers = [
    {
      tier: 'Bronze',
      referrals: '1-10 Active Referrals',
      commission: '10%',
      bonus: 'None',
      gradient: 'from-orange-600 to-orange-400',
      icon: '🥉',
    },
    {
      tier: 'Silver',
      referrals: '11-50 Active Referrals',
      commission: '15%',
      bonus: '$500 Bonus',
      gradient: 'from-gray-400 to-gray-200',
      icon: '🥈',
      popular: true,
    },
    {
      tier: 'Gold',
      referrals: '51-100 Active Referrals',
      commission: '20%',
      bonus: '$2,000 Bonus',
      gradient: 'from-yellow-500 to-yellow-300',
      icon: '🥇',
    },
    {
      tier: 'Platinum',
      referrals: '100+ Active Referrals',
      commission: '25%',
      bonus: '$5,000 Bonus + Perks',
      gradient: 'from-purple-500 to-pink-500',
      icon: '💎',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up & Get Your Link',
      description: 'Create your free affiliate account and receive your unique referral link instantly.',
      icon: '🔗',
    },
    {
      step: '02',
      title: 'Share With Your Network',
      description: 'Promote Celestian to your audience through social media, blogs, email, or any channel you prefer.',
      icon: '📢',
    },
    {
      step: '03',
      title: 'Earn Commissions',
      description: 'Get paid up to 25% commission on every investment your referrals make. Lifetime earnings!',
      icon: '💰',
    },
  ];

  const benefits = [
    {
      icon: '💵',
      title: 'Lifetime Commissions',
      description: 'Earn recurring commissions for as long as your referrals remain active investors.',
    },
    {
      icon: '📊',
      title: 'Real-Time Dashboard',
      description: 'Track your referrals, commissions, and performance with our advanced analytics dashboard.',
    },
    {
      icon: '🎯',
      title: 'Marketing Materials',
      description: 'Access professionally designed banners, landing pages, and email templates.',
    },
    {
      icon: '💳',
      title: 'Fast Payouts',
      description: 'Get paid weekly via crypto or bank transfer. Minimum payout is just $50.',
    },
    {
      icon: '🎓',
      title: 'Dedicated Support',
      description: 'Your success is our success. Get help from our affiliate support team 24/7.',
    },
    {
      icon: '🏆',
      title: 'Performance Bonuses',
      description: 'Qualify for exclusive bonuses, rewards, and special promotions throughout the year.',
    },
  ];

  const stats = [
    { value: '$8.5M+', label: 'Paid to Affiliates' },
    { value: '12K+', label: 'Active Affiliates' },
    { value: '25%', label: 'Max Commission Rate' },
    { value: '48hrs', label: 'Average Payout Time' },
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      role: 'Tech Blogger',
      earnings: '$4,200/month',
      quote: 'The Celestian affiliate program has become my #1 income source. The conversion rate is incredible!',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Lisa Chen',
      role: 'YouTube Creator',
      earnings: '$7,800/month',
      quote: 'My audience loves Celestian. High commissions + great product = easy money. Highly recommend!',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'David Rodriguez',
      role: 'Finance Newsletter',
      earnings: '$12,500/month',
      quote: 'Best-converting offer in the crypto space. Professional tools and amazing support team.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://celestian.org/ref/YOUR_ID');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/affiliate_hero.mp4"
        videoSrcMobile="/affiliate_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Turn Your Influence Into <span className="text-gradient">Passive Income</span>
          </span>
        }
        subtitle="Join the world's highest-paying crypto trading affiliate program. Earn up to 25% lifetime commissions on every referral. No experience required."
        badge={{
          text: '$8.5M+ Paid to 12,000+ Affiliates',
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Join Affiliate Program', href: '/register?affiliate=true', variant: 'primary' },
          { text: 'See Commission Tiers', href: '#tiers', variant: 'secondary' },
        ]}
        overlay="medium"
      />

      <main className="bg-white dark:bg-dark-900">
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-y border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-black text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-dark-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section id="tiers" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Commission Structure
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Earn More as You <span className="text-gradient">Grow Your Network</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Our tiered commission structure rewards top performers. The more referrals you bring, the higher your commission rate.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {commissionTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-dark-800 rounded-3xl p-8 border-2 transition-all duration-500 hover:-translate-y-2 ${
                    tier.popular
                      ? 'border-primary-500 shadow-2xl shadow-primary-500/20'
                      : 'border-gray-200 dark:border-dark-700 hover:shadow-xl'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white text-sm font-bold">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-6xl mb-4">{tier.icon}</div>
                    <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">
                      {tier.tier}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-300 mb-6">
                      {tier.referrals}
                    </p>

                    <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                      {tier.commission}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-dark-200 mb-6">
                      Commission Rate
                    </p>

                    <div className="pt-6 border-t border-gray-200 dark:border-dark-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Performance Bonus
                      </p>
                      <p className="text-sm text-gray-600 dark:text-dark-300">
                        {tier.bonus}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                How the <span className="text-gradient">Affiliate Program Works</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Start earning in three simple steps. No technical skills required.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connecting line (hidden on mobile) */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 opacity-30" />
                  )}

                  <div className="relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {item.step}
                    </div>

                    <div className="text-6xl mb-6 mt-4">{item.icon}</div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Partner Benefits
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Why Join the <span className="text-gradient">Celestian Affiliate Program</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Success Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                What Our <span className="text-gradient">Top Affiliates Say</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${testimonial.gradient} rounded-full text-white font-bold text-sm mb-4`}>
                      {testimonial.earnings}
                    </div>
                    <p className="text-gray-700 dark:text-dark-200 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-gray-200 dark:border-dark-700">
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-dark-300">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-500 to-accent-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of affiliates earning passive income with the world's best crypto trading platform. Sign up is free and takes less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register?affiliate=true"
                  className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Join Now - It's Free
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white rounded-full font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Contact Affiliate Team
                </Link>
              </div>

              {/* Demo referral link */}
              <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white/80 text-sm mb-3">Preview your affiliate link:</p>
                <div className="flex items-center gap-3 bg-dark-900/30 rounded-lg p-4">
                  <input
                    type="text"
                    value="https://celestian.org/ref/YOUR_ID"
                    readOnly
                    className="flex-1 bg-transparent text-white outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
