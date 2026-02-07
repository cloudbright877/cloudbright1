'use client';

interface SettingsFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  isDisabled?: boolean;
  saveText?: string;
}

export function SettingsFormActions({
  onSave,
  onCancel,
  isSaving = false,
  isDisabled = false,
  saveText = 'Save Changes',
}: SettingsFormActionsProps) {
  const saveButtonClasses = `
    px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white text-sm
    transition-all flex items-center gap-2
    ${
      isDisabled || isSaving
        ? 'opacity-50 cursor-not-allowed hover:shadow-none'
        : 'hover:shadow-lg hover:shadow-primary-500/25'
    }
  `.trim();

  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-dark-700 mt-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="px-5 py-2.5 border border-dark-600 rounded-xl text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm font-medium"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={isDisabled || isSaving}
        className={saveButtonClasses}
      >
        {isSaving && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {saveText}
      </button>
    </div>
  );
}
