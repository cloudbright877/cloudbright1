'use client';

import { motion } from 'framer-motion';
import { Lock, Landmark, ShieldCheck, Building2 } from 'lucide-react';
import Image from 'next/image';


const footerLinks = {
  Product: [
    { name: 'Services', href: '/services' },
    { name: 'Marketplace', href: '/marketplace' },
  ],
  Company: [
    { name: 'Affiliate', href: '/affiliate' },
    { name: 'About', href: '/about' },
    { name: 'Contacts', href: '/contact' },
  ],
  Resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help-center' },
  ],
  Legal: [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Risk Disclosure', href: '/legal/risk-disclosure' },
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
    <footer className="relative bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 overflow-hidden">
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
                <Image
                  src="/logo2.svg"
                  alt="Cloudbright"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
                <span className="text-gradient font-bold tracking-wider" style={{ fontSize: '2rem' }}>
                  CLOUDBRIGHT
                </span>
              </div>

              <p className="text-gray-600 dark:text-dark-300 mb-6 max-w-sm leading-relaxed">
                Copy verified trading bots and earn passive income.
                Licensed company. Commission only on profit.
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
              <h3 className="text-gray-900 dark:text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-dark-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 pb-12 border-b border-gray-200 dark:border-dark-800"
        >
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400">
            <Lock className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400">
            <Landmark className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            <span className="text-sm">Licensed Company</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400">
            <ShieldCheck className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            <span className="text-sm">Security Audited</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-400">
            <Building2 className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            <span className="text-sm">HK Registered</span>
          </div>
        </motion.div>

        {/* Risk disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-gray-400 dark:text-dark-500 text-xs text-center mb-6 max-w-3xl mx-auto leading-relaxed"
        >
          Trading cryptocurrencies involves significant risk and may not be suitable for all investors. Past performance of trading bots does not guarantee future results. You should carefully consider your financial situation before investing. Only invest funds you can afford to lose.
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-gray-500 dark:text-dark-400 text-sm"
        >
          <div className="text-center">
            © {new Date().getFullYear()} HONG KONG CLOUD BRIGHT SOFTWARE LIMITED. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
