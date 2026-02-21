'use client';

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: SettingsToggleProps) {
  const trackClasses = `
    relative w-12 h-7 rounded-full transition-colors
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'}
  `.trim();

  const knobClasses = `
    absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm
    ${checked ? 'translate-x-5' : 'translate-x-0'}
  `.trim();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700">
      <div className="flex-1 mr-4">
        <div className="font-semibold text-gray-900 dark:text-white text-sm">{label}</div>
        {description && <div className="text-sm text-gray-600 dark:text-dark-400 mt-0.5">{description}</div>}
      </div>

      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={trackClasses}
        aria-label={label}
      >
        <span className={knobClasses} />
      </button>
    </div>
  );
}
