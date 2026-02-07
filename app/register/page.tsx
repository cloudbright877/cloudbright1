'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createUser, getUserByReferralCode } from '@/lib/users';
import { deposit } from '@/lib/balances';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeToTerms: false,
  });

  const [referralCodeStatus, setReferralCodeStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [referrerUsername, setReferrerUsername] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-populate referral code from URL query param
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.trim().toUpperCase() }));
      validateReferralCode(refCode.trim().toUpperCase());
    }
  }, [searchParams]);

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code || code.length === 0) {
      setReferralCodeStatus('idle');
      setReferrerUsername(null);
      return;
    }

    setReferralCodeStatus('validating');

    try {
      const referrer = await getUserByReferralCode(code);
      if (referrer) {
        setReferralCodeStatus('valid');
        setReferrerUsername(referrer.username);
      } else {
        setReferralCodeStatus('invalid');
        setReferrerUsername(null);
      }
    } catch (err) {
      setReferralCodeStatus('invalid');
      setReferrerUsername(null);
    }
  };

  const handleReferralCodeChange = (value: string) => {
    const upperValue = value.trim().toUpperCase();
    setFormData(prev => ({ ...prev, referralCode: upperValue }));

    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateReferralCode(upperValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.referralCode && referralCodeStatus === 'invalid') {
      setError('Invalid referral code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user with referral code (if provided)
      const user = await createUser({
        username: formData.fullName,
        email: formData.email,
        referralCode: formData.referralCode || undefined,
      });

      // Give new user $10,000 demo balance (for testing)
      await deposit(user.id, 10000);

      // Store user session (simplified - in production use proper auth)
      localStorage.setItem('currentUserId', user.id);
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Redirect to dashboard
      router.push('/dashboard-v2');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
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

        {/* Registration card */}
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
              Create your account and join CloudBright
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Full name field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-all duration-300"
                required
                disabled={isSubmitting}
              />
            </div>

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
                disabled={isSubmitting}
              />
            </div>

            {/* Referral code field (NEW) */}
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                Referral Code <span className="text-gray-500 dark:text-dark-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="referralCode"
                  type="text"
                  placeholder="JOHNDOE123"
                  value={formData.referralCode}
                  onChange={(e) => handleReferralCodeChange(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none transition-all duration-300 ${
                    referralCodeStatus === 'valid'
                      ? 'border-green-500 focus:border-green-500'
                      : referralCodeStatus === 'invalid'
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-dark-600 focus:border-primary-500'
                  }`}
                  disabled={isSubmitting}
                />
                {/* Status indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {referralCodeStatus === 'validating' && (
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {referralCodeStatus === 'valid' && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                  {referralCodeStatus === 'invalid' && (
                    <span className="text-red-500 text-xl">✗</span>
                  )}
                </div>
              </div>
              {/* Referrer info */}
              {referralCodeStatus === 'valid' && referrerUsername && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Referred by: <span className="font-semibold">{referrerUsername}</span>
                </p>
              )}
              {referralCodeStatus === 'invalid' && formData.referralCode && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Invalid referral code
                </p>
              )}
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
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">Must be at least 8 characters</p>
            </div>

            {/* Confirm password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-all duration-300"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Terms agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-dark-600 bg-gray-100 dark:bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                  required
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-600 dark:text-dark-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-dark-300">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-semibold transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400">
              <span>🔒</span>
              <span>Your data is protected by 256-bit SSL encryption</span>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
