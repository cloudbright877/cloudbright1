'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, RefreshCw, Power, Info } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserCopy, updateUserCopy } from '@/lib/userCopies';

interface CompoundingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  copyId: string;
  botName: string;
}

export function CompoundingSettingsModal({
  isOpen,
  onClose,
  copyId,
  botName,
}: CompoundingSettingsModalProps) {
  const [compounding, setCompounding] = useState(0);
  const [autoclose, setAutoclose] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Load current settings from UserCopy
  useEffect(() => {
    if (!isOpen) return;
    const copy = getUserCopy(copyId);
    if (copy) {
      setCompounding(copy.compoundingPercent ?? 0);
      setAutoclose(copy.autocloseAfterLockIn ?? false);
    }
  }, [isOpen, copyId]);

  // Snap to nearest 1%
  const snapValue = (raw: number) => Math.round(raw);

  // Calculate value from mouse/touch position
  const calcValue = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCompounding(snapValue(pct));
  }, []);

  // Mouse drag handlers
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      calcValue(e.clientX);
    };
    const handleMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, calcValue]);

  // Touch drag handlers
  useEffect(() => {
    if (!dragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        calcValue(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => setDragging(false);

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging, calcValue]);

  const handleSave = () => {
    setSaving(true);
    updateUserCopy(copyId, {
      compoundingPercent: compounding,
      autocloseAfterLockIn: autoclose,
    });
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 300);
  };

  // Color based on compounding level
  const getCompoundingColor = () => {
    if (compounding === 0) return 'text-blue-400';
    if (compounding <= 30) return 'text-green-400';
    if (compounding <= 70) return 'text-yellow-400';
    return 'text-primary-400';
  };

  const getBarGradient = () => {
    if (compounding === 0) return 'from-blue-500 to-blue-400';
    if (compounding <= 30) return 'from-green-500 to-emerald-400';
    if (compounding <= 70) return 'from-yellow-500 to-amber-400';
    return 'from-primary-500 to-accent-500';
  };

  const getThumbBorder = () => {
    if (compounding === 0) return 'border-blue-400';
    if (compounding <= 30) return 'border-green-400';
    if (compounding <= 70) return 'border-yellow-400';
    return 'border-primary-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl opacity-50" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-white">Copy Settings</h2>
                      <p className="text-xs text-dark-400">{botName}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Compounding Slider */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <RefreshCw className="w-4 h-4 text-primary-400" />
                      <label className="text-sm font-medium text-white">
                        Compounding
                      </label>
                    </div>
                    <p className="text-xs text-dark-400 mb-4">
                      Percentage of profit to reinvest back into the bot
                    </p>

                    {/* Value display */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-dark-400">Withdraw</span>
                      <span className={`text-2xl font-medium ${getCompoundingColor()}`}>
                        {compounding}%
                      </span>
                      <span className="text-xs text-dark-400">Reinvest</span>
                    </div>

                    {/* Custom slider track */}
                    <div
                      ref={trackRef}
                      className="relative h-8 flex items-center cursor-pointer select-none"
                      onMouseDown={(e) => {
                        setDragging(true);
                        calcValue(e.clientX);
                      }}
                      onTouchStart={(e) => {
                        setDragging(true);
                        if (e.touches.length > 0) calcValue(e.touches[0].clientX);
                      }}
                    >
                      {/* Track background */}
                      <div className="absolute left-0 right-0 h-3 bg-dark-700 rounded-full overflow-hidden">
                        {/* Filled portion */}
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getBarGradient()} rounded-full`}
                          initial={false}
                          animate={{ width: `${compounding}%` }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      </div>

                      {/* Thumb */}
                      <motion.div
                        className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 ${getThumbBorder()} rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10`}
                        style={{ left: `calc(${compounding}% - 12px)` }}
                        initial={false}
                        animate={{ left: `calc(${compounding}% - 12px)` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs text-dark-500 mt-1">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>

                    {/* Quick presets */}
                    <div className="flex gap-2 mt-3">
                      {[0, 25, 50, 75, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setCompounding(val)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            compounding === val
                              ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                              : 'bg-dark-700/50 border border-dark-600 text-dark-400 hover:text-white hover:border-dark-500'
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>

                    {/* Explanation box */}
                    <div className="mt-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-dark-400">Profit to balance</span>
                        <span className="font-normal text-blue-400">
                          {100 - compounding}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-dark-400">Profit reinvested</span>
                        <span className="font-normal text-green-400">
                          {compounding}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-dark-700" />

                  {/* Autoclose Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Power className="w-4 h-4 text-amber-400" />
                          <label className="text-sm font-medium text-white">
                            Auto-close after lock-in
                          </label>
                        </div>
                        <p className="text-xs text-dark-400">
                          Automatically deactivate bot and return funds when lock-in period ends
                        </p>
                      </div>

                      {/* Toggle switch */}
                      <button
                        onClick={() => setAutoclose(!autoclose)}
                        className={`relative ml-4 w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
                          autoclose
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                            : 'bg-dark-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{ x: autoclose ? 28 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-400/90 leading-relaxed">
                      {compounding === 0
                        ? 'All profits are sent to your available balance as trades close.'
                        : compounding === 100
                          ? 'All profits are reinvested, increasing your position size over time.'
                          : `${100 - compounding}% of profit goes to your balance, ${compounding}% is reinvested to grow your position.`}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-dark-700">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg font-semibold text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="relative flex-1 group disabled:opacity-50"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 group-disabled:opacity-30" />
                    <div className="relative px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white shadow-lg">
                      {saving ? 'Saving...' : 'Save Settings'}
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
