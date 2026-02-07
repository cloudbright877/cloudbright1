'use client';

import { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import { SettingsFormInput } from '../SettingsFormInput';
import { SettingsFormSelect, type SelectOption } from '../SettingsFormSelect';
import { useToast } from '@/context/ToastContext';
import {
  getKYCData,
  saveKYCData,
  submitKYCForReview,
  mockApproveKYC,
} from '@/lib/settings/settingsService';
import type { KYCData, KYCStatus } from '@/lib/settings/settingsTypes';

interface KYCSectionProps {
  onClose?: () => void;
  onSaved?: () => void;
}

const KYC_STEPS = [
  { label: 'Personal', description: 'Basic info' },
  { label: 'Documents', description: 'ID upload' },
  { label: 'Selfie', description: 'Face check' },
  { label: 'Review', description: 'Verification' },
];

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select country' },
  { value: 'United States', label: 'United States' },
  { value: 'Russia', label: 'Russia' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Other', label: 'Other' },
];

export function KYCSection({ onSaved }: KYCSectionProps) {
  const toast = useToast();
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [formData, setFormData] = useState<Partial<KYCData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getKYCData();
    setKycData(data);
    setFormData(data);
  };

  const getCurrentStep = (): number => {
    if (!kycData) return 1;
    const statusMap: Record<KYCStatus, number> = {
      not_started: 1,
      personal_info: 1,
      documents: 2,
      selfie: 3,
      under_review: 4,
      approved: 5,
      rejected: 1,
    };
    return statusMap[kycData.status];
  };

  const handleStep1Continue = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date must be in YYYY-MM-DD format';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      saveKYCData({ ...formData, status: 'documents' });
      toast.info('Step completed', 'Moving to next step');
      loadData();
      onSaved?.();
    }
  };

  const handleStep2Continue = () => {
    if (!formData.documentType) {
      toast.error('Please select a document type');
      return;
    }
    if (!formData.documentUploaded) {
      toast.error('Please upload your document');
      return;
    }

    saveKYCData({ ...formData, status: 'selfie' });
    toast.info('Step completed', 'Moving to next step');
    loadData();
    onSaved?.();
  };

  const handleStep3Submit = () => {
    if (!formData.selfieUploaded) {
      toast.error('Please upload your selfie');
      return;
    }

    const result = submitKYCForReview();
    setKycData(result);
    setFormData(result);
    toast.success('Documents submitted', "We'll review your documents within 1-3 days");
    onSaved?.();
  };

  const handleMockUploadDocument = () => {
    setFormData({ ...formData, documentUploaded: true });
    toast.success('Document uploaded');
  };

  const handleMockUploadSelfie = () => {
    setFormData({ ...formData, selfieUploaded: true });
    toast.success('Selfie uploaded');
  };

  const handleCheckStatus = () => {
    const result = mockApproveKYC();
    setKycData(result);
    setFormData(result);
    toast.success('Identity verified', 'Your account is now fully verified');
    onSaved?.();
  };

  const handleTryAgain = () => {
    saveKYCData({
      status: 'not_started',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      documentType: '',
      documentUploaded: false,
      selfieUploaded: false,
      submittedAt: null,
      reviewedAt: null,
      rejectionReason: null,
    });
    loadData();
    onSaved?.();
  };

  if (!kycData) {
    return <div className="text-white">Loading...</div>;
  }

  const currentStep = getCurrentStep();

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8">
        <Stepper steps={KYC_STEPS} currentStep={currentStep} />
      </div>

      {/* Step 1: Personal Info */}
      {(kycData.status === 'not_started' || kycData.status === 'personal_info') && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>

          <div className="space-y-4 mb-6">
            <SettingsFormInput
              label="First Name"
              value={formData.firstName || ''}
              onChange={(value) => setFormData({ ...formData, firstName: value })}
              error={errors.firstName}
            />

            <SettingsFormInput
              label="Last Name"
              value={formData.lastName || ''}
              onChange={(value) => setFormData({ ...formData, lastName: value })}
              error={errors.lastName}
            />

            <SettingsFormInput
              label="Date of Birth"
              value={formData.dateOfBirth || ''}
              onChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
              placeholder="YYYY-MM-DD"
              error={errors.dateOfBirth}
            />

            <SettingsFormSelect
              label="Country"
              value={formData.country || ''}
              onChange={(value) => setFormData({ ...formData, country: value })}
              options={COUNTRY_OPTIONS}
              error={errors.country}
            />
          </div>

          <button
            type="button"
            onClick={handleStep1Continue}
            className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Documents */}
      {kycData.status === 'documents' && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Identity Document</h3>

          <p className="text-sm text-dark-400 mb-4">Select your document type</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: 'passport', label: 'Passport' },
              { value: 'id_card', label: 'ID Card' },
              { value: 'drivers_license', label: "Driver's License" },
            ].map((doc) => (
              <button
                key={doc.value}
                type="button"
                onClick={() => setFormData({ ...formData, documentType: doc.value as any })}
                className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                  formData.documentType === doc.value
                    ? 'bg-primary-500/20 border-2 border-primary-500/30 text-white'
                    : 'bg-dark-800/50 border-2 border-dark-700 text-dark-400 hover:text-white'
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>

          {formData.documentType && (
            <div className="mb-6">
              {!formData.documentUploaded ? (
                <button
                  type="button"
                  onClick={handleMockUploadDocument}
                  className="w-full border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                  <p className="text-sm text-dark-300 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-dark-500">PNG, JPG up to 10MB</p>
                </button>
              ) : (
                <div className="border-2 border-green-500/50 rounded-xl p-8 text-center bg-green-500/10">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-400 font-semibold">Document uploaded</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                saveKYCData({ ...formData, status: 'personal_info' });
                loadData();
              }}
              className="px-4 py-3 border border-dark-600 rounded-xl text-dark-300 hover:text-white hover:border-dark-500 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStep2Continue}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Selfie */}
      {kycData.status === 'selfie' && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Selfie Verification</h3>

          <p className="text-sm text-dark-400 mb-4">Take a selfie holding your document</p>

          <div className="mb-6">
            {!formData.selfieUploaded ? (
              <button
                type="button"
                onClick={handleMockUploadSelfie}
                className="w-full border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                <p className="text-sm text-dark-300 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-dark-500">PNG, JPG up to 10MB</p>
              </button>
            ) : (
              <div className="border-2 border-green-500/50 rounded-xl p-8 text-center bg-green-500/10">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-400 font-semibold">Selfie uploaded</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                saveKYCData({ ...formData, status: 'documents' });
                loadData();
              }}
              className="px-4 py-3 border border-dark-600 rounded-xl text-dark-300 hover:text-white hover:border-dark-500 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStep3Submit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              Submit for Review
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review - Under Review */}
      {kycData.status === 'under_review' && (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Your documents are being reviewed</h3>
          <p className="text-sm text-dark-400 mb-6">This usually takes 1-3 business days</p>
          <button
            type="button"
            onClick={handleCheckStatus}
            className="px-6 py-3 bg-primary-500/20 border border-primary-500/30 rounded-xl text-primary-400 font-semibold hover:bg-primary-500/30 transition-all"
          >
            Check Status
          </button>
        </div>
      )}

      {/* Step 4: Review - Approved */}
      {kycData.status === 'approved' && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Identity Verified</h3>
          <p className="text-sm text-dark-400">
            Verified on {kycData.reviewedAt ? new Date(kycData.reviewedAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      )}

      {/* Step 4: Review - Rejected */}
      {kycData.status === 'rejected' && (
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Verification Rejected</h3>
          <p className="text-sm text-dark-400 mb-6">
            {kycData.rejectionReason || 'Document quality was insufficient'}
          </p>
          <button
            type="button"
            onClick={handleTryAgain}
            className="px-6 py-3 bg-primary-500/20 border border-primary-500/30 rounded-xl text-primary-400 font-semibold hover:bg-primary-500/30 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
