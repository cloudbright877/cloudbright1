'use client';

import { useState, useEffect } from 'react';
import { SettingsFormInput } from '../SettingsFormInput';
import { SettingsFormTextarea } from '../SettingsFormTextarea';
import { SettingsFormActions } from '../SettingsFormActions';
import { useToast } from '@/context/ToastContext';
import { getProfileSettings, saveProfileSettings } from '@/lib/settings/settingsService';
import { updateUser } from '@/lib/users';
import type { ProfileSettings } from '@/lib/settings/settingsTypes';

interface ProfileSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

export function ProfileSection({ onClose, onSaved }: ProfileSectionProps) {
  const toast = useToast();
  const [initialData, setInitialData] = useState<ProfileSettings | null>(null);
  const [formData, setFormData] = useState<ProfileSettings>({
    displayName: '',
    username: '',
    bio: '',
    avatar: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = getProfileSettings();
    setInitialData(data);
    setFormData(data);
  }, []);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName || formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be at most 50 characters';
    }

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be at most 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be at most 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);

    try {
      // Save to settings
      saveProfileSettings(formData);

      // Sync to user model
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        await updateUser(userId, {
          displayName: formData.displayName,
          username: formData.username,
          bio: formData.bio,
          avatar: formData.avatar,
        });
      }

      toast.success('Profile updated');
      setInitialData(formData);
      onSaved?.();
    } catch (error) {
      toast.error('Failed to save profile', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
    }
    setErrors({});
    onClose?.();
  };

  const handleAvatarChange = () => {
    toast.info('Avatar upload coming soon');
  };

  if (!initialData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      {/* Avatar Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-300 mb-3">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {formData.avatar}
          </div>
          <div>
            <button
              type="button"
              onClick={handleAvatarChange}
              className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-semibold hover:bg-primary-500/30 transition-all text-sm"
            >
              Change Avatar
            </button>
            <p className="text-xs text-dark-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
          </div>
        </div>
      </div>

      {/* Display Name */}
      <div className="mb-6">
        <SettingsFormInput
          label="Display Name"
          value={formData.displayName}
          onChange={(value) => setFormData({ ...formData, displayName: value })}
          maxLength={50}
          error={errors.displayName}
        />
      </div>

      {/* Username */}
      <div className="mb-6">
        <SettingsFormInput
          label="Username"
          value={formData.username}
          onChange={(value) => setFormData({ ...formData, username: value })}
          prefix="@"
          maxLength={30}
          error={errors.username}
          hint={`Your public profile URL: celestian.com/@${formData.username}`}
        />
      </div>

      {/* Bio */}
      <div className="mb-6">
        <SettingsFormTextarea
          label="Bio"
          value={formData.bio}
          onChange={(value) => setFormData({ ...formData, bio: value })}
          rows={4}
          maxLength={500}
          error={errors.bio}
        />
      </div>

      {/* Actions */}
      <SettingsFormActions
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        isDisabled={!isDirty}
      />
    </div>
  );
}
