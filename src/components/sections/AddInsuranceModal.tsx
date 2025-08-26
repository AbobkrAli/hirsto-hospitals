import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Building2, Check } from 'lucide-react';
import Button from '../atoms/Button';
import { useAssignPharmacyInsuranceCompaniesWithToast } from '../../hooks/useInsurance';
import type { InsuranceCompany } from '../../services/insuranceService';
import Select from 'react-select';
import type { MultiValue } from 'react-select';

interface InsuranceOption {
  value: number;
  label: string;
  contact_email: string;
  policy_types: string;
}

interface AddInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  insuranceCompanies: InsuranceCompany[];
  assignedCompanyIds: number[];
  isLoading: boolean;
}

const AddInsuranceModal: React.FC<AddInsuranceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  insuranceCompanies,
  assignedCompanyIds,
  isLoading,
}) => {
  const [selectedCompanies, setSelectedCompanies] = useState<MultiValue<InsuranceOption>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignInsuranceMutation = useAssignPharmacyInsuranceCompaniesWithToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCompanies([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Filter out already assigned companies
  const availableCompanies = insuranceCompanies.filter(
    company => !assignedCompanyIds.includes(company.id)
  );

  // Convert to select options
  const selectOptions: InsuranceOption[] = availableCompanies.map(company => ({
    value: company.id,
    label: company.name,
    contact_email: company.contact_email,
    policy_types: company.policy_types,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCompanies.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const companyIds = selectedCompanies.map(company => company.value);
      await assignInsuranceMutation.mutateAsync(companyIds);
      onSuccess();
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const isSubmitDisabled = selectedCompanies.length === 0 || isSubmitting || assignInsuranceMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 h-[100vh] backdrop-blur-sm"
            onClick={handleClose}
            style={{ zIndex: 9998 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 9999 }}
          >
            <div className="w-full max-w-md">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">
                        Add Insurance Companies
                      </h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">
                        Select insurance companies to work with
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Insurance Company Multi-Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">
                      Insurance Companies
                    </label>
                    <Select
                      isMulti
                      value={selectedCompanies}
                      onChange={(newValue) => setSelectedCompanies(newValue || [])}
                      options={selectOptions}
                      placeholder="Select insurance companies..."
                      isDisabled={isLoading || isSubmitting}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: '1px solid #90E0EF',
                          borderRadius: '0.75rem',
                          minHeight: '44px',
                          boxShadow: 'none',
                          '&:hover': {
                            border: '1px solid #90E0EF'
                          }
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#03045E' : state.isFocused ? '#CAF0F8' : 'white',
                          color: state.isSelected ? 'white' : '#1E3E72',
                          '&:hover': {
                            backgroundColor: state.isSelected ? '#03045E' : '#CAF0F8'
                          }
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: '#CAF0F8',
                          borderRadius: '0.5rem',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: '#1E3E72',
                          fontWeight: '500',
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: '#1E3E72',
                          '&:hover': {
                            backgroundColor: '#90E0EF',
                            color: '#1E3E72',
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          border: '1px solid #90E0EF',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        })
                      }}
                    />
                    {availableCompanies.length === 0 && !isLoading && (
                      <p className="text-sm text-[#0077B6] font-paragraphs">
                        All available insurance companies have been assigned.
                      </p>
                    )}
                  </div>

                  {/* Selected Companies Details */}
                  {selectedCompanies.length > 0 && (
                    <div className="bg-[#CAF0F8]/20 rounded-xl p-4 border border-[#90E0EF]/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="w-4 h-4 text-[#0077B6]" />
                        <span className="text-sm font-semibold font-subtitles text-[#1E3E72]">
                          Selected Companies ({selectedCompanies.length})
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedCompanies.map((company) => (
                          <div key={company.value} className="bg-white/50 rounded-lg p-2">
                            <p className="text-sm font-semibold font-headlines text-[#1E3E72]">
                              {company.label}
                            </p>
                            <p className="text-xs text-[#0077B6] font-paragraphs">
                              Contact: {company.contact_email}
                            </p>
                            <p className="text-xs text-[#0077B6] font-paragraphs">
                              Policy Types: {company.policy_types}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitDisabled}
                      loading={isSubmitting || assignInsuranceMutation.isPending}
                      className="flex-1"
                    >
                      Add Insurance{selectedCompanies.length > 1 ? ' Companies' : ' Company'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddInsuranceModal; 