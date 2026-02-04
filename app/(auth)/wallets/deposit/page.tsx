'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import GlassCard from '@/components/ui/GlassCard';

// Currency icon mapping
const CURRENCY_ICONS: Record<string, string> = {
  'USDT': '₮',
  'BTC': '₿',
  'ETH': 'Ξ',
  'BNB': 'B',
  'USDC': '$',
  'SOL': '◎',
  'TRX': 'T',
  'MATIC': 'M',
  'POL': 'P',
};

// Currency gradient mapping
const CURRENCY_GRADIENTS: Record<string, string> = {
  'USDT': 'from-green-500 to-emerald-500',
  'BTC': 'from-orange-500 to-yellow-500',
  'ETH': 'from-blue-500 to-cyan-500',
  'BNB': 'from-yellow-500 to-amber-500',
  'USDC': 'from-blue-600 to-blue-400',
  'SOL': 'from-purple-500 to-pink-500',
  'TRX': 'from-red-500 to-orange-500',
  'MATIC': 'from-purple-600 to-indigo-500',
  'POL': 'from-purple-600 to-indigo-500',
};

interface Currency {
  symbol: string;
  name: string;
  price: string;
  networks: Network[];
}

interface Network {
  id: string;
  name: string;
  networkName: string;
  fee: string;
  minAmount: string;
}


const SAMPLE_CURRENCIES: Currency[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    price: '1.00',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', networkName: 'ERC20', fee: '2 USDT', minAmount: '10' },
      { id: 'trc20', name: 'Tron (TRC20)', networkName: 'TRC20', fee: '0.5 USDT', minAmount: '5' },
      { id: 'bep20', name: 'BSC (BEP20)', networkName: 'BEP20', fee: '0.3 USDT', minAmount: '5' },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '50000.00',
    networks: [
      { id: 'btc', name: 'Bitcoin Network', networkName: 'BTC', fee: '0.0001 BTC', minAmount: '0.001' },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '2000.00',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', networkName: 'ERC20', fee: '0.002 ETH', minAmount: '0.01' },
    ],
  },
];

const SAMPLE_DEPOSITS = [
  {
    id: 1,
    amount: 5000,
    currency: 'USDT',
    network: 'TRC20',
    date: Date.now() - 24 * 60 * 60 * 1000,
    status: 'completed',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j',
  },
  {
    id: 2,
    amount: 0.05,
    currency: 'BTC',
    network: 'BTC',
    date: Date.now() - 48 * 60 * 60 * 1000,
    status: 'completed',
    txHash: '0x9i8h7g6f5e4d3c2b1a0j',
  },
];

export default function DepositPage() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const currencies = SAMPLE_CURRENCIES;
  const currenciesLoading = false;
  const addressLoading = false;
  const deposits = SAMPLE_DEPOSITS;
  const historyLoading = false;

  const depositAddress = selectedCurrency && selectedNetwork
    ? 'TRX7NqM7SXfBZQ3KvN3Y9xPh8zC4jR5wD2eF3gH4iJ5k'
    : '';

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setSelectedNetwork(null);
    setStep(2);
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedNetwork(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedCurrency(null);
    }
  };

  const handleCopyAddress = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      alert('Address copied to clipboard!');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const displayedHistory = showAllHistory ? deposits : deposits.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-dark-300">Select a currency and network to generate your deposit address</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl border-2
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
                <div className="text-sm font-medium">
                  {s === 1 ? 'Currency' : s === 2 ? 'Network' : 'Address'}
                </div>
              </div>
              {s < 3 && <div className="text-dark-600">→</div>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {currenciesLoading && step === 1 && (
        <GlassCard>
          <div className="p-6 text-center">
            <div className="text-dark-400">Loading currencies...</div>
          </div>
        </GlassCard>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Select Currency */}
          {step === 1 && !currenciesLoading && (
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Select Currency</h2>
                {currencies.length === 0 ? (
                  <div className="text-center py-8 text-dark-400">
                    No currencies available. Please contact support.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currencies.map((currency, index) => (
                      <motion.button
                        key={currency.symbol}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleCurrencySelect(currency)}
                        className="p-6 bg-dark-800/50 hover:bg-dark-800 border-2 border-dark-700 hover:border-primary-500/50 rounded-2xl transition-all group"
                      >
                        <div
                          className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${
                            CURRENCY_GRADIENTS[currency.symbol] || 'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          {CURRENCY_ICONS[currency.symbol] || currency.symbol.charAt(0)}
                        </div>
                        <div className="font-bold text-white text-lg mb-1">{currency.symbol}</div>
                        <div className="text-sm text-dark-400">{currency.name}</div>
                        <div className="mt-3 text-xs text-dark-500">
                          {currency.networks.length} network{currency.networks.length > 1 ? 's' : ''}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Step 2: Select Network */}
          {step === 2 && selectedCurrency && (
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Select Network for {selectedCurrency.name}
                </h2>
                <div className="space-y-4">
                  {selectedCurrency.networks.map((network, index) => (
                    <motion.button
                      key={network.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNetworkSelect(network)}
                      className="w-full p-6 bg-dark-800/50 hover:bg-dark-800 border-2 border-dark-700 hover:border-primary-500/50 rounded-2xl transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-white mb-2">{network.name}</div>
                          <div className="flex items-center gap-4 text-sm text-dark-400">
                            <span>Fee: {network.fee}</span>
                            {network.minAmount && parseFloat(network.minAmount) > 0 && (
                              <>
                                <span>•</span>
                                <span>Min: ${network.minAmount}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-2xl text-dark-600 group-hover:text-primary-400 transition-colors">
                          →
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Step 3: Deposit Address & QR */}
          {step === 3 && selectedCurrency && selectedNetwork && (
            <div className="space-y-6">
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Deposit {selectedCurrency.name} via {selectedNetwork.name}
                  </h2>

                  {/* Loading State */}
                  {addressLoading && (
                    <div className="text-center py-8">
                      <div className="text-dark-400 mb-2">Generating your deposit address...</div>
                      <div className="text-sm text-dark-500">This may take a few seconds</div>
                    </div>
                  )}

                  {/* Address Generated */}
                  {!addressLoading && depositAddress && (
                    <>
                      {/* QR Code */}
                      <div className="flex flex-col items-center mb-8">
                        <div className="bg-white rounded-2xl p-4 mb-4">
                          <QRCodeSVG
                            value={depositAddress}
                            size={256}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <div className="text-sm text-dark-400">
                          Scan to deposit {selectedCurrency.symbol}
                        </div>
                      </div>

                      {/* Deposit Address */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Deposit Address
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={depositAddress}
                            readOnly
                            className="flex-1 px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-white font-mono text-sm"
                          />
                          <button
                            onClick={handleCopyAddress}
                            className="px-6 py-3 bg-primary-500/10 hover:bg-primary-500/20 border-2 border-primary-500/30 rounded-xl text-primary-400 font-medium transition-colors whitespace-nowrap"
                          >
                            📋 Copy
                          </button>
                        </div>
                      </div>

                      {/* Important Info */}
                      <div className="space-y-4">
                        {/* Minimum Amount */}
                        {selectedNetwork.minAmount && parseFloat(selectedNetwork.minAmount) > 0 && (
                          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <div className="flex items-start gap-3">
                              <span className="text-blue-400 text-xl">ℹ️</span>
                              <div className="text-sm text-blue-200">
                                <div className="font-semibold mb-1">
                                  Minimum Deposit: ${selectedNetwork.minAmount}
                                </div>
                                <div className="text-blue-200/80">
                                  Deposits below minimum amount will not be credited to your account.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Network Warning */}
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                          <div className="flex items-start gap-3">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                            <div className="text-sm text-yellow-200">
                              <div className="font-semibold mb-1">Important Network Information</div>
                              <div className="text-yellow-200/80">
                                Please ensure you send {selectedCurrency.symbol} via {selectedNetwork.name} only.
                                Sending via a different network may result in permanent loss of funds.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Processing Info */}
                        <div className="p-4 bg-dark-800/50 border border-dark-700 rounded-xl">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-dark-400 mb-1">Network Fee</div>
                              <div className="text-white font-semibold">{selectedNetwork.fee}</div>
                            </div>
                            <div>
                              <div className="text-dark-400 mb-1">Processing Time</div>
                              <div className="text-white font-semibold">3-10 minutes</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Error State */}
                  {!addressLoading && !depositAddress && (
                    <div className="text-center py-8">
                      <div className="text-red-400 mb-2">Failed to generate deposit address</div>
                      <div className="text-sm text-dark-500">
                        Please try again or contact support
                      </div>
                    </div>
                  )}

                  {/* Back Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Instructions */}
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">How to Deposit</h3>
                  <ol className="space-y-3 text-dark-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                        1
                      </span>
                      <span>Copy the deposit address above or scan the QR code</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                        2
                      </span>
                      <span>
                        Open your wallet and send {selectedCurrency.symbol} to this address via{' '}
                        {selectedNetwork.name}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                        3
                      </span>
                      <span>Wait for network confirmations (usually 3-10 minutes)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                        4
                      </span>
                      <span>Funds will be automatically credited to your account once confirmed</span>
                    </li>
                  </ol>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Deposit History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <GlassCard>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Deposits</h3>

            {historyLoading && (
              <div className="text-center py-8 text-dark-400">Loading deposit history...</div>
            )}

            {!historyLoading && deposits.length === 0 && (
              <div className="text-center py-8 text-dark-400">No deposits yet</div>
            )}

            {!historyLoading && deposits.length > 0 && (
              <div className="space-y-3">
                {displayedHistory.map((deposit, index) => (
                  <motion.div
                    key={deposit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl">
                        ↓
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          +{formatNumber(deposit.amount, deposit.currency === 'BTC' ? 8 : 2)}{' '}
                          {deposit.currency}
                        </div>
                        <div className="text-xs text-dark-400">
                          {deposit.network} • {formatDate(deposit.date)}
                        </div>
                        {deposit.txHash && (
                          <div className="text-xs text-dark-500 font-mono mt-1">{deposit.txHash}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                          deposit.status === 'completed'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : deposit.status === 'pending'
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {deposits.length > 10 && !showAllHistory && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllHistory(true)}
                  className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
