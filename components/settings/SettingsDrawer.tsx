'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SettingsDrawer({ isOpen, onClose, title, children }: SettingsDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const desktopPanelVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  const mobilePanelVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
  };

  const panelVariants = isMobile ? mobilePanelVariants : desktopPanelVariants;

  const panelClasses = isMobile
    ? 'fixed bottom-0 left-0 w-full max-h-[90vh] bg-dark-900 border-t border-dark-700 rounded-t-2xl z-50 flex flex-col shadow-2xl'
    : 'fixed right-0 top-0 h-full w-[480px] bg-dark-900 border-l border-dark-700 z-50 flex flex-col shadow-2xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={panelClasses}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="w-10 h-1 bg-dark-600 rounded-full mx-auto mt-2 mb-1" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
