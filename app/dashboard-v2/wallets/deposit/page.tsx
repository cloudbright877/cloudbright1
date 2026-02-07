'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
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
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Deposit Funds</h1>
          <p className="text-dark-400">
            Select a currency and network to generate your deposit address
          </p>
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
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Select Currency</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            )}

            {/* Step 2: Select Network */}
            {step === 2 && selectedCurrency && (
              <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Network for {selectedCurrency.name}
                </h2>
                <p className="text-dark-400 mb-6">Choose the blockchain network for deposit</p>

                <div className="space-y-4 mb-6">
                  {selectedCurrency.networks.map((network, index) => (
                    <motion.button
                      key={network.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNetworkSelect(network)}
                      className={`
                        w-full p-6 rounded-2xl border-2 text-left transition-all
                        ${
                          selectedNetwork?.id === network.id
                            ? 'bg-primary-500/10 border-primary-500'
                            : 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50 hover:bg-dark-800'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
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
                        <div
                          className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${
                              selectedNetwork?.id === network.id
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-dark-600'
                            }
                          `}
                        >
                          {selectedNetwork?.id === network.id && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-2" />
                  Back
                </button>
              </div>
            )}

            {/* Step 3: Deposit Address & QR (Split Panel) */}
            {step === 3 && selectedCurrency && selectedNetwork && (
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Panel - QR & Address (col-span-5) */}
                <div className="lg:col-span-5">
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-white mb-6">Deposit Address</h3>

                    {/* QR Code */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-white rounded-2xl p-4 mb-4">
                        <QRCodeSVG value={depositAddress} size={256} level="H" includeMargin={true} />
                      </div>
                      <p className="text-sm text-dark-400">
                        Scan to deposit {selectedCurrency.symbol}
                      </p>
                    </div>

                    {/* Address Input */}
                    <div className="mb-4">
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
                          className="px-4 py-3 bg-primary-500/10 hover:bg-primary-500/20 border-2 border-primary-500/30 rounded-xl text-primary-400 font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={handleBack}
                      className="w-full px-6 py-3 bg-dark-800 hover:bg-dark-700 border-2 border-dark-700 rounded-xl text-white font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 inline mr-2" />
                      Back
                    </button>
                  </div>
                </div>

                {/* Right Panel - Details & Warnings (col-span-7) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Network Info */}
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Network Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-dark-400 mb-1">Currency</div>
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedCurrency.icon}
                            alt={selectedCurrency.symbol}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                          <div className="text-lg font-bold text-white">
                            {selectedCurrency.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-dark-400 mb-1">Network</div>
                        <div className="text-lg font-bold text-white">
                          {selectedNetwork.networkName}
                        </div>
                      </div>
                      <div className="p-4 bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-dark-400 mb-1">Network Fee</div>
                        <div className="text-lg font-bold text-white">{selectedNetwork.fee}</div>
                      </div>
                      <div className="p-4 bg-dark-900/50 rounded-xl">
                        <div className="text-xs text-dark-400 mb-1">Processing Time</div>
                        <div className="text-lg font-bold text-white">3-10 min</div>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Amount Warning */}
                  {selectedNetwork.minAmount && parseFloat(selectedNetwork.minAmount) > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
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
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        <div className="font-semibold mb-1">Important Network Information</div>
                        <div className="text-yellow-200/80">
                          Please ensure you send {selectedCurrency.symbol} via {selectedNetwork.name}{' '}
                          only. Sending via a different network may result in permanent loss of funds.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-400" />
                      How to Deposit
                    </h3>
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
                        <span>
                          Funds will be automatically credited to your account once confirmed
                        </span>
                      </li>
                    </ol>
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
