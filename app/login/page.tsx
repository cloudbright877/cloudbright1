'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
import { ArrowLeft, Lock, Users, ShieldCheck, Star } from 'lucide-react';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Hex grid background + neon lines */}
      <div className="absolute inset-0 pointer-events-none" style={hexGridBg} />
      <NeonGridLines />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home link */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl"
        >
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
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
            <p className="text-gray-600 dark:text-dark-300">
              Sign in to access your investment dashboard
            </p>
          </div>

          {/* Login form */}
          <div className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors duration-300"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors duration-300"
                required
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 dark:text-dark-300">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Link
              href="/dashboard"
              className="block w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center"
            >
              Sign In
            </Link>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-dark-300">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Protected by 256-bit SSL encryption</span>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-dark-400"
        >
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary-400" />
            <span>15K+ Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-primary-400" />
            <span>4.9/5 Rating</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
