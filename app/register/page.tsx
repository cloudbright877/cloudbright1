'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense, useEffect } from 'react';
import { NeonGridLines, hexGridBg } from '@/components/animations/NeonGridLines';
import { ArrowLeft, Lock, Check, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createUser, getUserByReferralCode } from '@/lib/users';
import { deposit } from '@/lib/balances';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
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
    if (!formData.email || !formData.password) {
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
        username: formData.email.split('@')[0],
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
        {/* Registration card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl"
        >
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
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
              Create your account and join Cloudbright
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error message */}
            {error && (
              <div className="p-2.5 bg-red-900/20 border border-red-800 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

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
                disabled={isSubmitting}
              />
            </div>

            {/* Referral code field */}
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">
                Referral Code <span className="text-gray-500 dark:text-dark-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="referralCode"
                  type="text"
                  placeholder="JOHNDOE123"
                  value={formData.referralCode}
                  onChange={(e) => handleReferralCodeChange(e.target.value)}
                  className={`w-full px-4 py-2.5 pr-12 bg-white dark:bg-dark-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
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
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {referralCodeStatus === 'invalid' && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              {/* Referrer info */}
              {referralCodeStatus === 'valid' && referrerUsername && (
                <p className="mt-2 text-sm text-green-400">
                  Referred by: <span className="font-semibold">{referrerUsername}</span>
                </p>
              )}
              {referralCodeStatus === 'invalid' && formData.referralCode && (
                <p className="mt-2 text-sm text-red-400">
                  Invalid referral code
                </p>
              )}
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
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">Must be at least 8 characters</p>
            </div>

            {/* Confirm password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400 focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors duration-300"
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
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                  required
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-600 dark:text-dark-300">
                  I agree to the{' '}
                  <Link href="/legal/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/legal/privacy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-base text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Your data is protected by 256-bit SSL encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
