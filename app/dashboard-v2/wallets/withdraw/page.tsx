'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  Info,
} from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import { useToast } from '@/context/ToastContext';
import { getBalance } from '@/lib/balances';

interface Network {
  id: string;
  name: string;
  fee: string;
  minAmount: number;
}

const NETWORKS: Network[] = [
  { id: 'erc20', name: 'Ethereum (ERC20)', fee: '2 USDT', minAmount: 10 },
  { id: 'trc20', name: 'Tron (TRC20)', fee: '0.5 USDT', minAmount: 5 },
  { id: 'bep20', name: 'BSC (BEP20)', fee: '0.3 USDT', minAmount: 5 },
];

const STEPS = [
  { label: 'Details', description: 'Amount & address' },
  { label: 'Security', description: 'Verify identity' },
  { label: 'Confirm', description: 'Review & submit' },
];

export default function WithdrawPage() {
  const [step, setStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(NETWORKS[1]); // Default to TRC20
  const [amount, setAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [pinCode, setPinCode] = useState(['', '', '', '']);
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const userHasPIN = true;
  const userHas2FA = false;

  useEffect(() => {
    async function loadBalance() {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const balance = await getBalance(userId);
        setAvailableBalance(balance.available);
        setIsLoading(false);
      } catch (error) {
        console.error('[Withdraw] Error loading balance:', error);
        setIsLoading(false);
      }
    }

    loadBalance();
  }, []);

  const handleMaxAmount = () => {
    const feeNum = parseFloat(selectedNetwork.fee.split(' ')[0]);
    const maxAmount = Math.max(0, availableBalance - feeNum);
    setAmount(maxAmount.toString());
  };

  const handleContinueToSecurity = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < selectedNetwork.minAmount) {
      toast.error('Invalid amount', `Minimum withdrawal: ${selectedNetwork.minAmount} USDT`);
      return;
    }

    if (amountNum > availableBalance) {
      toast.error('Insufficient balance', 'You do not have enough available balance');
      return;
    }

    if (!withdrawAddress) {
      toast.error('Address required', 'Please enter a withdrawal address');
      return;
    }

    setStep(2);
  };

  const handleContinueToConfirm = () => {
    if (userHasPIN && pinCode.some((digit) => digit === '')) {
      toast.error('PIN required', 'Please enter your 4-digit PIN code');
      return;
    }

    if (userHas2FA && twoFACode.some((digit) => digit === '')) {
      toast.error('2FA required', 'Please enter your 6-digit 2FA code');
      return;
    }

    setStep(3);
  };

  const handleSubmitWithdrawal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = () => {
    toast.success(
      'Withdrawal submitted!',
      'Your withdrawal request is being processed. Processing time: up to 24 hours'
    );
    setShowConfirmModal(false);
    setTimeout(() => {
      window.location.href = '/dashboard-v2/wallets';
    }, 2000);
  };

  const handlePinInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pinCode];
    newPin[index] = value.slice(-1);
    setPinCode(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handle2FAInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...twoFACode];
    newCode[index] = value.slice(-1);
    setTwoFACode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(selectedNetwork.fee.split(' ')[0]);
    return Math.max(0, amountNum - feeNum);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard-v2/wallets"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Wallets
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Withdraw Funds</h1>
          <p className="text-dark-400">Transfer your crypto to an external wallet</p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Stepper steps={STEPS} currentStep={step} />
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Form Area - col-span-7 */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Withdrawal Details */}
                {step === 1 && (
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Withdrawal Details</h2>

                    {/* Network Selection */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-3">
                        Select Network
                      </label>
                      <div className="space-y-2">
                        {NETWORKS.map((network) => (
                          <button
                            key={network.id}
                            onClick={() => setSelectedNetwork(network)}
                            className={`
                              w-full p-4 rounded-xl border-2 text-left transition-all
                              ${
                                selectedNetwork.id === network.id
                                  ? 'bg-primary-500/10 border-primary-500'
                                  : 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-white">{network.name}</div>
                                <div className="text-sm text-dark-400">Fee: {network.fee}</div>
                              </div>
                              <div
                                className={`
                                  w-5 h-5 rounded-full border-2
                                  ${
                                    selectedNetwork.id === network.id
                                      ? 'border-primary-500 bg-primary-500'
                                      : 'border-dark-600'
                                  }
                                `}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-3">
                        Amount (USDT)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*\.?\d*$/.test(val)) setAmount(val);
                          }}
                          placeholder="0.00"
                          className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white outline-none pr-20"
                        />
                        <button
                          onClick={handleMaxAmount}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 text-sm font-medium transition-colors"
                        >
                          MAX
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-dark-400">
                        Minimum: {selectedNetwork.minAmount} USDT • Available:{' '}
                        {formatNumber(availableBalance, 2)} USDT
                      </div>
                    </div>

                    {/* Withdrawal Address */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-3">
                        Withdrawal Address
                      </label>
                      <input
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white outline-none"
                      />
                    </div>

                    {/* Warning */}
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200">
                          <div className="font-semibold mb-1">Important</div>
                          <div className="text-yellow-200/80">
                            Please double-check the withdrawal address. Cryptocurrency transactions
                            are irreversible.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinueToSecurity}
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 2: Security Verification */}
                {step === 2 && (
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Security Verification</h2>
                        <p className="text-sm text-dark-400">Verify your identity to continue</p>
                      </div>
                    </div>

                    {/* PIN Code */}
                    {userHasPIN && (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">
                          Withdrawal PIN Code
                        </label>
                        <div className="flex gap-3 justify-center">
                          {pinCode.map((digit, index) => (
                            <input
                              key={index}
                              id={`pin-${index}`}
                              type="password"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handlePinInput(index, e.target.value)}
                              className="w-16 h-16 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white text-center text-2xl outline-none"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2FA Code */}
                    {userHas2FA && (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">
                          2FA Code (Google Authenticator)
                        </label>
                        <div className="flex gap-2 justify-center">
                          {twoFACode.map((digit, index) => (
                            <input
                              key={index}
                              id={`2fa-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handle2FAInput(index, e.target.value)}
                              className="w-12 h-12 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white text-center text-xl outline-none"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-200">
                          <div className="font-semibold mb-1">Security Check</div>
                          <div className="text-blue-200/80">
                            We use PIN verification to protect your funds from unauthorized
                            withdrawals.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-2" />
                        Back
                      </button>
                      <button
                        onClick={handleContinueToConfirm}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Review Withdrawal</h2>

                    {/* Processing Time Info */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-200">
                          <div className="font-semibold mb-1">Processing Time</div>
                          <div className="text-blue-200/80">
                            Withdrawals are processed within 24 hours. You will receive an email
                            confirmation.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 inline mr-2" />
                        Back
                      </button>
                      <button
                        onClick={handleSubmitWithdrawal}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                      >
                        Submit Withdrawal
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Summary Sidebar - col-span-5, sticky */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Withdrawal Summary</h3>

                {/* Currency Icon */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-dark-700">
                  <Image
                    src="/currency/Tether.svg"
                    alt="USDT"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="text-sm text-dark-400">Currency</div>
                    <div className="text-xl font-bold text-white">USDT (Tether)</div>
                  </div>
                </div>

                {/* Summary Details */}
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-400">Network</span>
                    <span className="font-bold text-white">{selectedNetwork.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-400">Amount</span>
                    <span className="font-bold text-white">
                      {amount || '0.00'} USDT
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-dark-700">
                    <span className="text-dark-400">Network Fee</span>
                    <span className="font-bold text-red-400">- {selectedNetwork.fee}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-dark-800/50 px-4 -mx-2 rounded-xl">
                    <span className="font-bold text-white">You will receive</span>
                    <span className="font-bold text-green-400">
                      {formatNumber(calculateTotal(), 2)} USDT
                    </span>
                  </div>
                  {withdrawAddress && (
                    <div className="flex justify-between py-3 border-t border-dark-700">
                      <span className="text-dark-400">Destination</span>
                      <span className="font-mono text-sm text-white max-w-[200px] truncate">
                        {withdrawAddress}
                      </span>
                    </div>
                  )}
                </div>

                {/* Available Balance */}
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-xs text-green-400/70 mb-1">Available Balance</div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatNumber(availableBalance, 2)} USDT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Shield className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Withdrawal</h3>
                <p className="text-dark-300">
                  You are about to withdraw{' '}
                  <span className="font-bold text-white">{amount} USDT</span>
                </p>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-dark-800/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Processing Time</span>
                  <span className="text-white font-medium">Up to 24 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Status</span>
                  <span className="text-yellow-400 font-medium">Pending Review</span>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
                <p className="text-sm text-yellow-200">
                  This action cannot be undone. Please make sure all details are correct.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmWithdrawal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
