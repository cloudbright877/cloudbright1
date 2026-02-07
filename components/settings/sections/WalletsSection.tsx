'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SettingsFormInput } from '../SettingsFormInput';
import { SettingsFormSelect, type SelectOption } from '../SettingsFormSelect';
import { SettingsBadge } from '../SettingsBadge';
import { ConfirmationModal } from '@/components/dashboard-v2/ConfirmationModal';
import { useToast } from '@/context/ToastContext';
import {
  getWalletsSettings,
  addWalletAddress,
  removeWalletAddress,
} from '@/lib/settings/settingsService';
import type { SavedWalletAddress, NetworkType } from '@/lib/settings/settingsTypes';

interface WalletsSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

const NETWORK_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select network' },
  { value: 'ETH', label: 'ETH - Ethereum' },
  { value: 'BTC', label: 'BTC - Bitcoin' },
  { value: 'TRX', label: 'TRX - Tron' },
  { value: 'SOL', label: 'SOL - Solana' },
  { value: 'BNB', label: 'BNB - BNB Chain' },
];

export function WalletsSection({ onSaved }: WalletsSectionProps) {
  const toast = useToast();
  const [addresses, setAddresses] = useState<SavedWalletAddress[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    network: '' as NetworkType | '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getWalletsSettings();
    setAddresses(data.addresses);
  };

  const validateAddress = (address: string, network: NetworkType): boolean => {
    if (!address) return false;

    switch (network) {
      case 'ETH':
      case 'BNB':
        return address.startsWith('0x') && address.length === 42;
      case 'BTC':
        return (
          (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) &&
          address.length >= 26 &&
          address.length <= 62
        );
      case 'TRX':
        return address.startsWith('T') && address.length === 34;
      case 'SOL':
        return address.length >= 32 && address.length <= 44;
      default:
        return false;
    }
  };

  const handleAddAddress = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.label || formData.label.length < 1 || formData.label.length > 30) {
      newErrors.label = 'Label must be between 1 and 30 characters';
    }

    if (!formData.network) {
      newErrors.network = 'Please select a network';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.network && !validateAddress(formData.address, formData.network as NetworkType)) {
      newErrors.address = 'Invalid address format for selected network';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        addWalletAddress({
          label: formData.label,
          network: formData.network as NetworkType,
          address: formData.address,
        });
        toast.success('Address saved');
        setShowAddForm(false);
        setFormData({ label: '', network: '', address: '' });
        setErrors({});
        loadData();
        onSaved?.();
      } catch (error) {
        if (error instanceof Error && error.message.includes('Maximum 10')) {
          toast.error('Limit reached', 'Maximum 10 addresses allowed');
        } else {
          toast.error('Failed to save address');
        }
      }
    }
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      removeWalletAddress(addressToDelete);
      toast.success('Address removed');
      setDeleteModalOpen(false);
      setAddressToDelete(null);
      loadData();
      onSaved?.();
    }
  };

  const truncateAddress = (addr: string) => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Saved Withdrawal Addresses</h3>
        <p className="text-sm text-dark-400 mb-4">{addresses.length}/10 addresses saved</p>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          disabled={addresses.length >= 10 || showAddForm}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
            addresses.length >= 10 || showAddForm
              ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="mb-6 p-5 bg-dark-800/50 rounded-xl border border-dark-700">
          <h4 className="text-base font-bold text-white mb-4">Add New Address</h4>

          <div className="space-y-4 mb-4">
            <SettingsFormInput
              label="Label"
              value={formData.label}
              onChange={(value) => setFormData({ ...formData, label: value })}
              placeholder="e.g., My Binance"
              maxLength={30}
              error={errors.label}
            />

            <SettingsFormSelect
              label="Network"
              value={formData.network}
              onChange={(value) => setFormData({ ...formData, network: value as NetworkType })}
              options={NETWORK_OPTIONS}
              error={errors.network}
            />

            <div>
              <SettingsFormInput
                label="Address"
                value={formData.address}
                onChange={(value) => setFormData({ ...formData, address: value })}
                placeholder="Enter wallet address"
                error={errors.address}
              />
              <style jsx>{`
                input {
                  font-family: monospace;
                }
              `}</style>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormData({ label: '', network: '', address: '' });
                setErrors({});
              }}
              className="px-4 py-2 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddAddress}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400 mb-2">No saved addresses yet</p>
          <p className="text-sm text-dark-500">Add withdrawal addresses for quick transfers</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <SettingsBadge variant="info" text={addr.network} size="sm" />
                  <span className="font-bold text-white text-sm">{addr.label}</span>
                </div>
                <div className="font-mono text-xs text-dark-400 mb-1">{truncateAddress(addr.address)}</div>
                <div className="text-xs text-dark-500">
                  Added {new Date(addr.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteClick(addr.id)}
                className="ml-4 p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Address?"
        description="This address will be permanently removed from your saved list."
        bulletPoints={['You will need to add it again if you want to use it later']}
        confirmText="Remove Address"
        isDangerous={true}
      />
    </div>
  );
}
