'use client';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface SettingsBadgeProps {
  text: string;
  variant: BadgeVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function SettingsBadge({ text, variant, icon, size = 'sm' }: SettingsBadgeProps) {
  const variantClasses = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    neutral: 'bg-dark-700 border-dark-600 text-dark-300',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold rounded-full',
    md: 'px-3 py-1 text-sm font-semibold rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {icon}
      {text}
    </span>
  );
}
