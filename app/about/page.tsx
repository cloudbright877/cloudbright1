'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { value: '$2.5B+', label: 'Assets Under Management' },
    { value: '150K+', label: 'Active Investors' },
    { value: '99.7%', label: 'Uptime Guarantee' },
    { value: '24/7', label: 'Customer Support' },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI technology to stay ahead of market trends and deliver superior returns.',
    },
    {
      icon: '🔒',
      title: 'Security & Trust',
      description: 'Your capital security is our top priority. Bank-grade encryption and multi-layered protection.',
    },
    {
      icon: '📈',
      title: 'Proven Results',
      description: 'Consistent daily returns backed by transparent performance metrics and real-time reporting.',
    },
    {
      icon: '🤝',
      title: 'Client-Centric',
      description: 'Every decision we make is guided by one question: What is best for our investors?',
    },
  ];

  const team = [
    {
      name: 'Dr. Michael Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Head of AI at Goldman Sachs. PhD in Machine Learning from MIT.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Sarah Williams',
      role: 'CTO & Co-Founder',
      bio: '15 years in quantitative trading. Led engineering teams at Citadel.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'David Park',
      role: 'Head of AI Research',
      bio: 'Published 30+ papers on algorithmic trading. Former Stanford professor.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Chief Security Officer',
      bio: 'Ex-NSA cybersecurity expert. Protecting billions in digital assets.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const milestones = [
    { year: '2019', event: 'Founded with $5M seed funding', description: 'Started our journey to revolutionize crypto trading' },
    { year: '2020', event: 'Launched AI Trading Platform', description: 'Deployed proprietary machine learning algorithms' },
    { year: '2021', event: 'Reached $100M AUM', description: '10,000+ investors joined our platform' },
    { year: '2022', event: 'Global Expansion', description: 'Opened offices in Singapore, London, and Dubai' },
    { year: '2023', event: '$1B+ AUM Milestone', description: 'Became one of the fastest-growing AI trading platforms' },
    { year: '2024', event: 'Industry Leadership', description: 'Serving 150K+ investors with $2.5B+ in managed assets' },
  ];

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/about_hero.mp4"
        poster="/about_hero_img.jpg"
        title={
          <span className="text-white drop-shadow-2xl">
            Pioneering the Future of{' '}
            <span className="text-gradient">AI-Powered</span> Crypto Trading
          </span>
        }
        subtitle="We're on a mission to democratize wealth creation through intelligent, automated cryptocurrency trading. Join thousands of investors who trust Celestian to grow their capital."
        badge={{
          text: 'Trusted by 150,000+ Investors Worldwide',
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Start Investing Today', href: '/register', variant: 'primary' },
          { text: 'See Our Performance', href: '/performance', variant: 'secondary' },
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

        {/* Mission Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Our Mission
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                  Making Wealth Creation <span className="text-gradient">Accessible to Everyone</span>
                </h2>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  At Celestian, we believe that everyone deserves access to sophisticated investment strategies that were once exclusive to hedge funds and institutional investors.
                </p>
                <p className="text-lg text-gray-700 dark:text-dark-200 mb-6 leading-relaxed">
                  Our proprietary AI algorithms analyze millions of data points every second, executing trades with precision and speed impossible for human traders. The result? Consistent daily returns for our investors, regardless of market conditions.
                </p>
                <p className="text-lg text-gray-700 dark:text-dark-200 leading-relaxed">
                  We're not just a trading platform—we're your partner in building lasting wealth through the power of artificial intelligence and cryptocurrency innovation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-3xl overflow-hidden">
                  <Image
                    src="/man-sphere.png"
                    alt="AI Technology"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Core Values
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                What Drives Us <span className="text-gradient">Every Day</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Our values aren't just words on a wall—they're the foundation of every decision we make and every line of code we write.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Our Leadership
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Meet the <span className="text-gradient">Visionaries</span> Behind Celestian
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                World-class experts in AI, finance, and cybersecurity united by one mission: revolutionizing cryptocurrency trading.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group relative"
                >
                  <div className="relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    {/* Animated gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Decorative corner element */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${member.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      {/* Avatar placeholder with gradient */}
                      <div className="mb-6 relative">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-black shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {/* Animated ring */}
                        <div className={`absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${member.gradient} opacity-20 animate-ping`} style={{ animationDuration: '3s' }} />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white group-hover:text-gradient transition-all duration-300">
                          {member.name}
                        </h3>
                        <div className={`text-sm font-bold mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent uppercase tracking-wide`}>
                          {member.role}
                        </div>
                        <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>

                      {/* Decorative line */}
                      <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${member.gradient} transition-all duration-700 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-600 dark:text-dark-300 mb-6">
                Want to join our world-class team?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                View Open Positions
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
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
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                From Startup to <span className="text-gradient">Industry Leader</span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

              {/* Timeline items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col md:gap-16`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                      <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 ml-16 md:ml-0">
                        <div className="text-2xl font-black text-gradient mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {milestone.event}
                        </h3>
                        <p className="text-gray-600 dark:text-dark-300">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-white dark:border-dark-900" />

                    {/* Empty space on other side */}
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Ready to <span className="text-gradient">Join the Future</span> of Investing?
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Start earning daily returns with our AI-powered trading platform. Join 150,000+ investors who trust Celestian.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white dark:bg-dark-800 border-2 border-gray-300 dark:border-dark-700 rounded-full font-semibold text-gray-900 dark:text-white hover:border-primary-500 transition-all duration-300 hover:scale-105"
                >
                  Contact Our Team
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
