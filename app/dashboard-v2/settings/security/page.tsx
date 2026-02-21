'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { SecuritySection } from '@/components/settings/sections/SecuritySection';

export default function SecuritySettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard-v2/settings"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Settings</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Security</h1>
              <p className="text-sm text-gray-600 dark:text-dark-400">Password, two-factor authentication, and sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-bento-border dark:bg-bento-border-dark p-[1.5px]">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
              <SecuritySection />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
