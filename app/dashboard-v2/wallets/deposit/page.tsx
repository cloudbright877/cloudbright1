'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  TokenBTC,
  TokenETH,
  TokenUSDT,
  TokenBNB,
  TokenSOL,
  TokenTRX,
} from '@web3icons/react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TOKEN_ICONS: Record<string, any> = {
  BTC: TokenBTC,
  ETH: TokenETH,
  USDT: TokenUSDT,
  BNB: TokenBNB,
  SOL: TokenSOL,
  TRX: TokenTRX,
};
import { ChevronLeft, Copy, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import CurrencyCard from '@/components/wallet/CurrencyCard';
import { useToast } from '@/context/ToastContext';

interface Currency {
  symbol: string;
  name: string;
  icon: string;
  networks: Network[];
}

interface Network {
  id: string;
  name: string;
  networkName: string;
  fee: string;
  minAmount: string;
}

const CURRENCIES: Currency[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: '/currency/Tether.svg',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', networkName: 'ERC20', fee: '2 USDT', minAmount: '10' },
      { id: 'trc20', name: 'Tron (TRC20)', networkName: 'TRC20', fee: '0.5 USDT', minAmount: '5' },
      { id: 'bep20', name: 'BSC (BEP20)', networkName: 'BEP20', fee: '0.3 USDT', minAmount: '5' },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '/currency/Bitcoin.svg',
    networks: [
      { id: 'btc', name: 'Bitcoin Network', networkName: 'BTC', fee: '0.0001 BTC', minAmount: '0.001' },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/currency/Ethereum.svg',
    networks: [
      { id: 'erc20', name: 'Ethereum (ERC20)', networkName: 'ERC20', fee: '0.002 ETH', minAmount: '0.01' },
    ],
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: '/currency/bnb.svg',
    networks: [
      { id: 'bep20', name: 'BSC (BEP20)', networkName: 'BEP20', fee: '0.0005 BNB', minAmount: '0.01' },
    ],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '/currency/Solana.svg',
    networks: [
      { id: 'solana', name: 'Solana Network', networkName: 'SOL', fee: '0.00001 SOL', minAmount: '0.1' },
    ],
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    icon: '/currency/Tron.svg',
    networks: [
      { id: 'trc20', name: 'Tron Network', networkName: 'TRC20', fee: '1 TRX', minAmount: '10' },
    ],
  },
];

const STEPS = [
  { label: 'Currency', description: 'Select coin' },
  { label: 'Network', description: 'Choose network' },
  { label: 'Address', description: 'Get address' },
];

export default function DepositPage() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const toast = useToast();

  const depositAddress =
    selectedCurrency && selectedNetwork
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

  const handleCopyAddress = async () => {
    if (depositAddress) {
      await navigator.clipboard.writeText(depositAddress);
      toast.success('Address copied!', 'Deposit address copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent text-gray-900 dark:text-white">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard-v2/wallets"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Wallets
          </Link>
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

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Select Currency */}
            {step === 1 && (
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">Select Currency</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CURRENCIES.map((currency, index) => (
                    <CurrencyCard
                      key={currency.symbol}
                      symbol={currency.symbol}
                      name={currency.name}
                      icon={currency.icon}
                      networks={currency.networks.length}
                      selected={selectedCurrency?.symbol === currency.symbol}
                      onClick={() => handleCurrencySelect(currency)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Network */}
            {step === 2 && selectedCurrency && (
              <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-6">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                  Select Network for {selectedCurrency.name}
                </h2>
                <p className="text-gray-600 dark:text-dark-400 mb-6">Choose the blockchain network for deposit</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {selectedCurrency.networks.map((network, index) => (
                    <motion.button
                      key={network.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNetworkSelect(network)}
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
                        ${
                          selectedNetwork?.id === network.id
                            ? 'bg-primary-500/10 border-primary-500 shadow-lg shadow-primary-500/20'
                            : 'bg-gray-100 dark:bg-dark-800/50 border-gray-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-gray-200 dark:hover:bg-dark-800'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{network.networkName}</div>
                        <div className="text-xs text-gray-600 dark:text-dark-400 truncate">{network.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-dark-500 mt-0.5">
                          <span>Fee: {network.fee}</span>
                          {network.minAmount && parseFloat(network.minAmount) > 0 && (
                            <>
                              <span>·</span>
                              <span>Min: ${network.minAmount}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedNetwork?.id === network.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-2" />
                  Back
                </button>
                </div>
              </div>
            )}

            {/* Step 3: Deposit Address & QR (Split Panel) */}
            {step === 3 && selectedCurrency && selectedNetwork && (
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Panel - QR & Address (col-span-5) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px] lg:sticky top-6">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4 sm:p-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Deposit Address</h3>

                    {/* QR Code */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-white rounded-2xl p-3 sm:p-4 mb-4 max-w-[240px] sm:max-w-none">
                        <QRCodeSVG value={depositAddress} size={200} level="H" includeMargin={true} className="w-full h-auto max-w-[200px] sm:max-w-[256px]" />
                      </div>
                      <p className="text-sm text-dark-400">
                        Scan to deposit {selectedCurrency.symbol}
                      </p>
                    </div>

                    {/* Address Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Deposit Address
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={depositAddress}
                          readOnly
                          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white font-mono text-xs sm:text-sm truncate"
                        />
                        <button
                          onClick={handleCopyAddress}
                          className="px-4 py-3 bg-primary-500/10 hover:bg-primary-500/20 border-2 border-primary-500/30 rounded-xl text-primary-400 font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={handleBack}
                      className="w-full px-6 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 inline mr-2" />
                      Back
                    </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Details & Warnings (col-span-7) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Network Info */}
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">Network Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-gray-100 dark:bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Currency</div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const Icon = TOKEN_ICONS[selectedCurrency.symbol];
                            return Icon ? <Icon size={24} variant="branded" /> : <span className="text-gray-900 dark:text-white font-medium">{selectedCurrency.symbol.charAt(0)}</span>;
                          })()}
                          <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                            {selectedCurrency.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-100 dark:bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Network</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                          {selectedNetwork.networkName}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-100 dark:bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Network Fee</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{selectedNetwork.fee}</div>
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-100 dark:bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-dark-400 mb-1">Processing Time</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">3-10 min</div>
                      </div>
                    </div>
                    </div>
                  </div>

                  {/* Minimum Amount Warning */}
                  {selectedNetwork.minAmount && parseFloat(selectedNetwork.minAmount) > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-900 dark:text-blue-200">
                          <div className="font-medium mb-1">
                            Minimum Deposit: ${selectedNetwork.minAmount}
                          </div>
                          <div className="text-gray-700 dark:text-blue-200/80">
                            Deposits below minimum amount will not be credited to your account.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Network Warning */}
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-900 dark:text-yellow-200">
                        <div className="font-medium mb-1">Important Network Information</div>
                        <div className="text-gray-700 dark:text-yellow-200/80">
                          Please ensure you send {selectedCurrency.symbol} via {selectedNetwork.name}{' '}
                          only. Sending via a different network may result in permanent loss of funds.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.04)_75%,rgba(0,0,0,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.04)_75%,rgba(255,255,255,0.05)_100%)] p-[1.5px]">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800/95 dark:to-dark-900/95 rounded-[calc(1rem-1px)] p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-400" />
                      How to Deposit
                    </h3>
                    <ol className="space-y-3 text-gray-700 dark:text-dark-300">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-400">
                          1
                        </span>
                        <span>Copy the deposit address above or scan the QR code</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-400">
                          2
                        </span>
                        <span>
                          Open your wallet and send {selectedCurrency.symbol} to this address via{' '}
                          {selectedNetwork.name}
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-400">
                          3
                        </span>
                        <span>Wait for network confirmations (usually 3-10 minutes)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-400">
                          4
                        </span>
                        <span>
                          Funds will be automatically credited to your account once confirmed
                        </span>
                      </li>
                    </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
