'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import FloatingShapes from './FloatingShapes';

const footerLinks = {
  Product: [
    { name: 'Services', href: '/services' },
    { name: 'Security', href: '/security' },
    { name: 'Performance', href: '/performance' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Affiliate Program', href: '/affiliate' },
    { name: 'Contact Us', href: '/contact' },
  ],
  Resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help-center' },
  ],
  Legal: [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Risk Disclosure', href: '/legal/risk-disclosure' },
    { name: 'Compliance', href: '/legal/compliance' },
  ],
};

const socialLinks = [
  { name: 'X (Twitter)', icon: '/social/x.svg', href: '#' },
  { name: 'Telegram', icon: '/social/telegram-app.svg', href: '#' },
  { name: 'YouTube', icon: '/social/youtube.svg', href: '#' },
  { name: 'Instagram', icon: '/social/instagram.svg', href: '#' },
  { name: 'Facebook', icon: '/social/facebook.svg', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative bg-dark-900 border-t border-dark-800 overflow-hidden">
      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-torus-ring.png',
            size: 150,
            position: { top: '10%', right: '5%' },
            rotate: 45,
          },
          {
            src: '/images/glossy-glass-octahedron.png',
            size: 100,
            position: { bottom: '40%', left: '10%' },
            rotate: -15,
          },
        ]}
      />

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gradient font-bold tracking-wider" style={{ fontSize: '2rem' }}>
                  CELESTIAN
                </span>
              </div>

              <p className="text-dark-300 mb-6 max-w-sm leading-relaxed">
                Empowering investors worldwide with AI-driven cryptocurrency trading.
                Earn consistent daily returns with cutting-edge technology.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.name}
                    whileHover={{ scale: 1.15 }}
                    className="relative group"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Icon */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={32}
                        height={32}
                        className="transition-all duration-300"
                      />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter subscription with image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-3xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0 items-center">
            {/* Left side - Text Content */}
            <div className="px-6 py-8 lg:px-8 lg:py-6 flex items-center justify-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                  Stay Updated with <span className="text-gradient">Market Insights</span>
                </h3>
                <p className="text-dark-200 mb-4 leading-relaxed">
                  Get exclusive access to expert analysis, AI trading strategies, and real-time market updates. Stay ahead of the curve with insights from our team of crypto and AI specialists.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Subscribe to Newsletter
                </button>
              </div>
            </div>

            {/* Right side - Image at bottom */}
            <div className="relative h-[300px] lg:h-[380px] flex items-end">
              {/* Gradient glow behind image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-full blur-3xl"></div>
              </div>

              {/* Image */}
              <div className="relative w-full h-full z-10">
                <Image
                  src="/man-sphere.png"
                  alt="Market insights visualization"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12 pb-12 border-b border-dark-800"
        >
          <div className="flex items-center gap-2 text-dark-400">
            <span className="text-2xl">🔒</span>
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm">$100M Insured</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400">
            <span className="text-2xl">✓</span>
            <span className="text-sm">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400">
            <span className="text-2xl">⭐</span>
            <span className="text-sm">4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-dark-400 text-sm"
        >
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Celestian Limited. All rights reserved.
          </div>
          <div className="text-center md:text-right">
            <p className="mb-1">
              <span className="text-dark-500">Disclaimer:</span> Cryptocurrency trading involves risk.
              Past performance does not guarantee future results.
            </p>
            <p className="text-dark-500">
              Investment returns may vary. Always invest responsibly.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
