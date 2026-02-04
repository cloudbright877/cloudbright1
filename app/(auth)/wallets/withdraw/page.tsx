'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

interface Wallet {
  symbol: string;
  name: string;
  balance: number;
  icon: string;
  gradient: string;
  networks: Network[];
}

interface Network {
  id: string;
  name: string;
  fee: string;
  minAmount: number;
}

interface SavedAddress {
  id: number;
  address: string;
  label: string;
  network: string;
  lastUsed: number;
}

const wallets: Wallet[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: 15847.32,
    icon: '₮',
    gradient: 'from-green-500 to-emerald-500',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', fee: '2 USDT', minAmount: 10 },
      { id: 'trc20', name: 'Tron (TRC20)', fee: '0.5 USDT', minAmount: 5 },
      { id: 'bep20', name: 'BSC (BEP20)', fee: '0.3 USDT', minAmount: 5 },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.05432,
    icon: '₿',
    gradient: 'from-orange-500 to-yellow-500',
    networks: [
      { id: 'btc', name: 'Bitcoin Network', fee: '0.0001 BTC', minAmount: 0.001 },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.543,
    icon: 'Ξ',
    gradient: 'from-blue-500 to-cyan-500',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', fee: '0.002 ETH', minAmount: 0.01 },
    ],
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    balance: 12.45,
    icon: 'B',
    gradient: 'from-yellow-500 to-amber-500',
    networks: [
      { id: 'bep20', name: 'BSC (BEP20)', fee: '0.0005 BNB', minAmount: 0.01 },
    ],
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 5000.0,
    icon: '$',
    gradient: 'from-blue-600 to-blue-400',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', fee: '2 USDC', minAmount: 10 },
      { id: 'polygon', name: 'Polygon', fee: '0.01 USDC', minAmount: 5 },
    ],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 45.67,
    icon: '◎',
    gradient: 'from-purple-500 to-pink-500',
    networks: [
      { id: 'solana', name: 'Solana Network', fee: '0.00001 SOL', minAmount: 0.1 },
    ],
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    balance: 1234.56,
    icon: 'T',
    gradient: 'from-red-500 to-orange-500',
    networks: [
      { id: 'trc20', name: 'Tron Network', fee: '1 TRX', minAmount: 10 },
    ],
  },
];

const savedAddresses: SavedAddress[] = [
  {
    id: 1,
    address: 'TRX7NqM7SXfBZQ3KvN3Y9xPh8zC4jR5wD2',
    label: 'My Binance Wallet',
    network: 'TRC20',
    lastUsed: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    label: 'Hardware Wallet',
    network: 'ERC20',
    lastUsed: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 3,
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    label: 'Cold Storage',
    network: 'BTC',
    lastUsed: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
];

export default function WithdrawPage() {
  const [step, setStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [twoFACode, setTwoFACode] = useState('');

  const userHasPIN = true;
  const userHas2FA = false;

  const handleWalletSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setSelectedNetwork(wallet.networks[0]);
    setAmount('');
    setWithdrawAddress('');
  };

  const handleMaxAmount = () => {
    if (selectedWallet && selectedNetwork) {
      const maxAmount = selectedWallet.balance - parseFloat(selectedNetwork.fee.split(' ')[0]);
      setAmount(maxAmount > 0 ? maxAmount.toString() : '0');
    }
  };

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setWithdrawAddress(address.address);
    setShowSavedAddresses(false);
  };

  const handleContinue = () => {
    // Validation
    if (!selectedWallet || !selectedNetwork || !amount || !withdrawAddress) {
      alert('Please fill all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < selectedNetwork.minAmount) {
      alert(`Minimum withdrawal: ${selectedNetwork.minAmount} ${selectedWallet.symbol}`);
      return;
    }

    if (amountNum > selectedWallet.balance) {
      alert('Insufficient balance');
      return;
    }

    setStep(2);
  };

  const handleSubmitWithdrawal = () => {
    // Validation for security
    if (userHasPIN && pinCode.length !== 4) {
      alert('Please enter 4-digit PIN code');
      return;
    }

    if (userHas2FA && twoFACode.length !== 6) {
      alert('Please enter 6-digit 2FA code');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    alert('Withdrawal request submitted! Processing time: up to 24 hours');
    setShowConfirmModal(false);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const calculateTotal = () => {
    if (!selectedNetwork || !amount) return 0;
    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(selectedNetwork.fee.split(' ')[0]);
    return Math.max(0, amountNum - feeNum);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/wallets"
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-400 hover:text-white"
          >
            ← Back
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Withdraw Funds</h1>
        <p className="text-dark-300">Transfer your crypto to an external wallet</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`
                  flex items-center gap-3 px-6 py-2 rounded-xl border-2
                  ${
                    s === step
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-primary-500 text-white'
                      : s < step
                      ? 'bg-dark-800 border-green-500/50 text-green-400'
                      : 'bg-dark-900/50 border-dark-700 text-dark-400'
                  }
                `}
              >
                <div className="text-xl font-bold">{s}</div>
                <div className="text-sm font-medium">{s === 1 ? 'Details' : 'Confirm'}</div>
              </div>
              {s < 2 && <div className="text-dark-600">→</div>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
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
            <GlassCard>
              <div className="p-6 space-y-6">
                {/* Select Currency */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-3">Select Currency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.symbol}
                        onClick={() => handleWalletSelect(wallet)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedWallet?.symbol === wallet.symbol
                            ? 'bg-primary-500/10 border-primary-500'
                            : 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${wallet.gradient} rounded-xl flex items-center justify-center text-white text-xl font-bold`}
                        >
                          {wallet.icon}
                        </div>
                        <div className="font-bold text-white text-sm">{wallet.symbol}</div>
                        <div className="text-xs text-dark-400 mt-1">{formatNumber(wallet.balance, 2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedWallet && (
                  <>
                    {/* Select Network */}
                    {selectedWallet.networks.length > 1 && (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">Select Network</label>
                        <div className="space-y-2">
                          {selectedWallet.networks.map((network) => (
                            <button
                              key={network.id}
                              onClick={() => setSelectedNetwork(network)}
                              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                selectedNetwork?.id === network.id
                                  ? 'bg-primary-500/10 border-primary-500'
                                  : 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-white">{network.name}</div>
                                  <div className="text-sm text-dark-400">Fee: {network.fee}</div>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 ${
                                    selectedNetwork?.id === network.id
                                      ? 'border-primary-500 bg-primary-500'
                                      : 'border-dark-600'
                                  }`}
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-3">Amount</label>
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
                      {selectedNetwork && (
                        <div className="mt-2 text-sm text-dark-400">
                          Minimum: {selectedNetwork.minAmount} {selectedWallet.symbol} • Available:{' '}
                          {formatNumber(selectedWallet.balance, 2)} {selectedWallet.symbol}
                        </div>
                      )}
                    </div>

                    {/* Wallet Address */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-3">
                        Withdrawal Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          placeholder="Enter wallet address"
                          className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white outline-none pr-32"
                        />
                        <button
                          onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 rounded-lg text-accent-400 text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          📌 Saved
                        </button>
                      </div>

                      {/* Saved Addresses Dropdown */}
                      <AnimatePresence>
                        {showSavedAddresses && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 overflow-hidden"
                          >
                            <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl space-y-2">
                              <div className="text-xs font-medium text-dark-400 mb-2">SAVED ADDRESSES</div>
                              {savedAddresses.map((saved) => (
                                <button
                                  key={saved.id}
                                  onClick={() => handleSelectSavedAddress(saved)}
                                  className="w-full p-3 bg-dark-900/50 hover:bg-dark-900 border border-dark-700 hover:border-primary-500/50 rounded-lg text-left transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-white text-sm mb-1">{saved.label}</div>
                                      <div className="text-xs text-dark-400 font-mono truncate">
                                        {saved.address}
                                      </div>
                                      <div className="text-xs text-dark-500 mt-1">
                                        {saved.network} • Last used{' '}
                                        {Math.floor((Date.now() - saved.lastUsed) / (24 * 60 * 60 * 1000))} days
                                        ago
                                      </div>
                                    </div>
                                    <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      →
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Warning */}
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                        <div className="text-sm text-yellow-200">
                          <div className="font-semibold mb-1">Important</div>
                          <div className="text-yellow-200/80">
                            Please double-check the withdrawal address. Cryptocurrency transactions are
                            irreversible. Sending to an incorrect address will result in permanent loss of funds.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                    >
                      Continue →
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && selectedWallet && selectedNetwork && (
            <div className="space-y-6">
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Withdrawal Summary</h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b border-dark-700">
                      <span className="text-dark-400">Currency</span>
                      <span className="font-bold text-white">{selectedWallet.symbol}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-dark-700">
                      <span className="text-dark-400">Network</span>
                      <span className="font-bold text-white">{selectedNetwork.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-dark-700">
                      <span className="text-dark-400">Amount</span>
                      <span className="font-bold text-white">
                        {amount} {selectedWallet.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-dark-700">
                      <span className="text-dark-400">Network Fee</span>
                      <span className="font-bold text-red-400">- {selectedNetwork.fee}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-dark-800/50 px-4 rounded-xl">
                      <span className="font-bold text-white">You will receive</span>
                      <span className="font-bold text-green-400">
                        {formatNumber(calculateTotal(), 8)} {selectedWallet.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-t border-dark-700">
                      <span className="text-dark-400">Destination Address</span>
                      <span className="font-mono text-sm text-white max-w-[200px] truncate">
                        {withdrawAddress}
                      </span>
                    </div>
                  </div>

                  {/* Security Verification */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Security Verification</h3>

                    {/* PIN Code */}
                    {userHasPIN && (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Withdrawal PIN Code
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={pinCode}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) setPinCode(val);
                          }}
                          placeholder="Enter 4-digit PIN"
                          className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white text-center text-2xl tracking-widest outline-none"
                        />
                      </div>
                    )}

                    {/* 2FA Code */}
                    {userHas2FA && (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          2FA Code (Google Authenticator)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={twoFACode}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) setTwoFACode(val);
                          }}
                          placeholder="Enter 6-digit code"
                          className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl text-white text-center text-2xl tracking-widest outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Processing Time Info */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400 text-xl flex-shrink-0">ℹ️</span>
                      <div className="text-sm text-blue-200">
                        <div className="font-semibold mb-1">Processing Time</div>
                        <div className="text-blue-200/80">
                          Withdrawals are processed within 24 hours. You will receive an email confirmation once
                          your withdrawal is processed.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSubmitWithdrawal}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                    >
                      Submit Withdrawal
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
              className="max-w-md w-full"
            >
              <GlassCard>
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Confirm Withdrawal</h3>
                    <p className="text-dark-300">
                      You are about to withdraw{' '}
                      <span className="font-bold text-white">
                        {amount} {selectedWallet?.symbol}
                      </span>
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
                      This action cannot be undone. Please make sure all details are correct before confirming.
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
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-2xl rounded-xl text-white font-bold transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
