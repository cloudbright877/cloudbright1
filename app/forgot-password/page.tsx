'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-dark-900/80 backdrop-blur-xl border-2 border-dark-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-3xl"
            >
              🔐
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-dark-300">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="button"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all transform hover:scale-[1.02]"
            >
              Send Reset Link
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-dark-500 text-sm mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
