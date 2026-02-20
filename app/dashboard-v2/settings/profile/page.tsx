'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { ProfileSection } from '@/components/settings/sections/ProfileSection';

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-950 p-4 lg:p-6">
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
              <h1 className="text-2xl font-semibold text-white">Profile</h1>
              <p className="text-sm text-dark-400">Manage your display name, username, and bio</p>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
            <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
              <ProfileSection />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
