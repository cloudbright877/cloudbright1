'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface SettingsBentoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: React.ReactNode;
  onClick: () => void;
  index: number;
}

export function SettingsBentoCard({
  icon,
  title,
  description,
  status,
  onClick,
  index,
}: SettingsBentoCardProps) {
  return (
    <motion.div
      className="group relative bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-3">
        <div className="w-5 h-5 text-primary-400">{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>

      {/* Description */}
      <p className="text-sm text-dark-400 mb-3">{description}</p>

      {/* Status + Chevron */}
      <div className="flex items-center justify-between">
        <div className="flex-1">{status}</div>
        <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 transition-colors group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
