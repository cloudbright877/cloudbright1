'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

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
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gradient-to-br dark:from-dark-800 dark:to-dark-900 rounded-3xl border-2 border-gray-200 dark:border-primary-500/20 p-8 shadow-2xl"
        >
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo2.svg"
                alt="CloudBright"
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-all duration-300"
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-all duration-300"
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
                  className="w-4 h-4 rounded border-gray-300 dark:border-dark-600 bg-gray-100 dark:bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 dark:text-dark-300">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300"
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
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-semibold transition-colors duration-300"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400">
              <span>🔒</span>
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
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>15K+ Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
