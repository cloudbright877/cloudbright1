'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { ProfileSection } from '@/components/settings/sections/ProfileSection';

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back + Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard-v2/settings"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Settings</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <p className="text-sm text-dark-400">Manage your display name, username, and bio</p>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6"
        >
          <ProfileSection />
        </motion.div>
      </div>
    </div>
  );
}
