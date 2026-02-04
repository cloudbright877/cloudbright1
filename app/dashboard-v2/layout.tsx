'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard-v2/Sidebar';
import TopBar from '@/components/dashboard-v2/TopBar';
import { Toaster } from 'react-hot-toast';

export default function DashboardV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        containerClassName="!z-[99999]"
        toastOptions={{
          duration: 4000,
          className: '!z-[99999]',
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #2d2d44',
            zIndex: 99999,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(14, 165, 233, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="relative z-10 min-h-[calc(100vh-64px)] pb-20 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
