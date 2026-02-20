'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/dashboard-v2/Sidebar';
import TopBar from '@/components/dashboard-v2/TopBar';
import { Toaster } from 'react-hot-toast';

export default function DashboardV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div ref={scrollRef} className="dashboard-scope h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        containerClassName="!z-[99999]"
        toastOptions={{
          duration: 4000,
          className: '!z-[99999]',
          style: mounted ? (
            document.documentElement.classList.contains('dark') ? {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid #2d2d44',
              zIndex: 99999,
            } : {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              zIndex: 99999,
            }
          ) : {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #2d2d44',
            zIndex: 99999,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: mounted && !document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: mounted && !document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
            },
          },
        }}
      />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl"
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

      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="relative z-10 min-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-64px)] pb-20 lg:pb-8">
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
