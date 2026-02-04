'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'Military-Grade Encryption',
      description: 'All data transmission and storage protected by AES-256 encryption, the same standard used by governments and military organizations worldwide.',
      features: ['End-to-end encryption', 'Encrypted data storage', 'Secure SSL/TLS connections', 'Zero-knowledge architecture'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '❄️',
      title: 'Cold Storage Custody',
      description: '95% of client funds stored offline in bank-grade cold storage vaults with multi-signature protection and geographic distribution.',
      features: ['Multi-signature wallets', 'Hardware security modules', 'Geographic redundancy', 'Air-gapped systems'],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🛡️',
      title: 'Multi-Factor Authentication',
      description: 'Advanced 2FA/MFA with support for authenticator apps, biometrics, hardware keys, and SMS verification for maximum account security.',
      features: ['TOTP authenticator support', 'Biometric verification', 'Hardware key support', 'Withdrawal whitelisting'],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '💼',
      title: 'Insurance Protection',
      description: '$100M insurance coverage protecting client assets against theft, hacks, and unauthorized access through our partnership with leading insurers.',
      features: ['Lloyd\'s of London coverage', 'Crime insurance policy', 'Regulatory compliance', 'Annual security audits'],
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const compliance = [
    {
      title: 'Regulatory Compliance',
      items: [
        { name: 'SEC Registered', status: 'Verified' },
        { name: 'FinCEN MSB Licensed', status: 'Verified' },
        { name: 'GDPR Compliant', status: 'Verified' },
        { name: 'SOC 2 Type II Certified', status: 'Verified' },
      ],
    },
    {
      title: 'Security Standards',
      items: [
        { name: 'PCI DSS Level 1', status: 'Certified' },
        { name: 'ISO 27001:2013', status: 'Certified' },
        { name: 'CryptoCurrency Security Standard', status: 'Certified' },
        { name: 'NIST Cybersecurity Framework', status: 'Compliant' },
      ],
    },
  ];

  const auditReports = [
    {
      year: '2024',
      auditor: 'Deloitte Cybersecurity',
      type: 'Full Security Audit',
      result: 'AAA Rating',
      date: 'January 2024',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2024',
      auditor: 'Trail of Bits',
      type: 'Smart Contract Audit',
      result: 'No Critical Issues',
      date: 'March 2024',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      year: '2023',
      auditor: 'CertiK',
      type: 'Blockchain Security Audit',
      result: '98/100 Score',
      date: 'October 2023',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const trustBadges = [
    { name: 'Norton Secured', icon: '✓' },
    { name: 'McAfee Secure', icon: '✓' },
    { name: 'PCI DSS Compliant', icon: '✓' },
    { name: 'SSL Certified', icon: '✓' },
    { name: 'SOC 2 Type II', icon: '✓' },
    { name: 'ISO 27001', icon: '✓' },
  ];

  const securityPractices = [
    {
      title: 'Advanced Threat Detection',
      description: 'AI-powered monitoring systems detect and prevent suspicious activities in real-time, 24/7/365.',
      icon: '🎯',
    },
    {
      title: 'Regular Penetration Testing',
      description: 'Quarterly penetration tests by independent security experts to identify and fix vulnerabilities.',
      icon: '🔬',
    },
    {
      title: 'Bug Bounty Program',
      description: 'Up to $100,000 rewards for security researchers who help us maintain the highest security standards.',
      icon: '🏅',
    },
    {
      title: 'Incident Response Team',
      description: 'Dedicated security team ready to respond to any potential threats within minutes.',
      icon: '⚡',
    },
    {
      title: 'Employee Background Checks',
      description: 'Comprehensive screening and security training for all team members with access to systems.',
      icon: '👥',
    },
    {
      title: 'Data Loss Prevention',
      description: 'Automated backup systems with point-in-time recovery and disaster recovery protocols.',
      icon: '💾',
    },
  ];

  const stats = [
    { value: '$2.5B+', label: 'Assets Secured' },
    { value: '0', label: 'Security Breaches' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '24/7', label: 'Security Monitoring' },
  ];

  return (
    <>
      <Navbar />

      <PageHero
        videoSrc="/security_hero.mp4"
        videoSrcMobile="/security_hero_mobile.mp4"
        title={
          <span className="text-white drop-shadow-2xl">
            Your Assets, <span className="text-gradient">Protected</span> with Military-Grade Security
          </span>
        }
        subtitle="We employ the most advanced security infrastructure in the industry. Bank-grade encryption, cold storage custody, and $100M insurance protection—your peace of mind is our priority."
        badge={{
          text: 'Zero Security Breaches Since 2019',
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        }}
        ctaButtons={[
          { text: 'Start Investing Securely', href: '/register', variant: 'primary' },
          { text: 'Read Security Docs', href: '#docs', variant: 'secondary' },
        ]}
        overlay="dark"
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

        {/* Core Security Features */}
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
                Security Infrastructure
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Industry-Leading <span className="text-gradient">Protection</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Multi-layered security architecture designed to protect your investments from every possible threat vector.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-dark-200">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-700 rounded-full`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance & Regulations */}
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
                Compliance & Certifications
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Fully <span className="text-gradient">Regulated & Compliant</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                We maintain the highest regulatory standards and hold all necessary licenses to operate globally.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {compliance.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700"
                >
                  <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="flex items-center gap-2 text-green-500 font-bold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Audit Reports */}
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
                Third-Party Verification
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Independent <span className="text-gradient">Security Audits</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Regular audits by world-renowned security firms ensure our systems remain impenetrable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {auditReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${report.gradient} rounded-full text-white font-bold mb-4`}>
                    {report.year}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white">
                    {report.auditor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-dark-300 mb-4">
                    {report.type}
                  </p>
                  <div className="py-4 px-6 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4">
                    <p className="text-green-700 dark:text-green-400 font-bold text-center">
                      {report.result}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Completed: {report.date}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Link
                href="/legal/audit-reports"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                View All Audit Reports
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Security Practices */}
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
                Best Practices
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                Additional <span className="text-gradient">Security Measures</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityPractices.map((practice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{practice.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {practice.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">
                    {practice.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 border-y border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-black">
                    {badge.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-dark-200">
                    {badge.name}
                  </p>
                </motion.div>
              ))}
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
                Your Security is Our <span className="text-gradient">Top Priority</span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-dark-200 mb-8 max-w-2xl mx-auto">
                Sleep soundly knowing your investments are protected by the most advanced security infrastructure in the industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  Start Investing Securely
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white dark:bg-dark-800 border-2 border-gray-300 dark:border-dark-700 rounded-full font-semibold text-gray-900 dark:text-white hover:border-primary-500 transition-all duration-300 hover:scale-105"
                >
                  Speak with Security Team
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
