'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function RecoveryForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(code);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Password reset successfully');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000)
    } catch (err: any) {
      console.error('[RECOVERY] Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              🔑
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-dark-300">
              Enter your new password below.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-xl"
            >
              <p className="text-green-400 text-sm text-center">{success}</p>
              <p className="text-green-400/70 text-xs text-center mt-2">Redirecting to login...</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          {!success && token && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                  required
                  disabled={loading}
                  minLength={8}
                />
                <p className="text-dark-500 text-xs mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none transition-colors"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Invalid token message */}
          {!token && (
            <div className="text-center">
              <p className="text-dark-400 mb-4">Please request a new password reset link.</p>
              <Link
                href="/forgot-password"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Request New Link
              </Link>
            </div>
          )}

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
