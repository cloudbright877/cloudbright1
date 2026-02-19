'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
import { ArrowLeft, Lock, Users, ShieldCheck } from 'lucide-react';

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
      <div className="absolute top-[15%] -left-[10%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to home link — fixed top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl"
        >
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-2">
              <Image
                src="/logo2.svg"
                alt="Cloudbright"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-gray-900 dark:text-white font-semibold" style={{ fontSize: '1.25rem', letterSpacing: '0.07rem', transform: 'scaleY(0.88)', transformOrigin: 'center' }}>
                CLOUDBRIGHT
              </span>
            </div>
            <p className="text-gray-600 dark:text-dark-300 text-sm">
              Sign in to access your investment dashboard
            </p>
          </div>

          {/* Login form */}
          <div className="space-y-3">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors duration-300"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors duration-300"
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
              className="block w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-base text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center"
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
