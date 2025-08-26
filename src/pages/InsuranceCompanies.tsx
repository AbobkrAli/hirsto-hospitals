import { useState } from 'react';
import { Plus, Building2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../components/atoms/Button';
import { AddInsuranceModal, DeleteConfirmationModal } from '../components/sections';
import { usePharmacyData } from '../hooks/usePharmacyData';
import {
  usePharmacyInsuranceCompaniesWithHospitalId,
  useInsuranceCompanies
} from '../hooks/useInsurance';
import { InactivePharmacyMessage } from '../components';
import type { InsuranceCompany } from '../services/insuranceService';
import { useRemoveHospitalInsuranceCompany } from '../services/insuranceService';

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'inactive':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

// Loading skeleton for table
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      {/* Table header skeleton */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4">
          {['Company Name', 'Contact Email', 'Policy Types', 'Status', 'Actions'].map((header) => (
            <div key={header} className="h-4 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InsuranceCompanies: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<InsuranceCompany | null>(null);

  // Check pharmacy status
  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  // Fetch pharmacy's insurance companies
  const {
    data: pharmacyInsuranceCompanies,
    isLoading: pharmacyInsuranceLoading,
    error: pharmacyInsuranceError,
    refetch
  } = usePharmacyInsuranceCompaniesWithHospitalId();

  // Fetch all available insurance companies for the modal
  const {
    data: allInsuranceCompanies,
    isLoading: allInsuranceLoading
  } = useInsuranceCompanies();

  // Remove insurance mutation (hospital-specific)
  const removeInsuranceMutation = useRemoveHospitalInsuranceCompany();

  // Show inactive message if pharmacy is not active
  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  const handleAddInsurance = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddModalSuccess = () => {
    setIsAddModalOpen(false);
  };

  const handleRemoveInsurance = (company: InsuranceCompany) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCompanyToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    try {
      const hospitalId = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      if (!hospitalId) {
        throw new Error('Hospital ID not found');
      }
      await removeInsuranceMutation.mutateAsync({ hospitalId, insuranceCompanyId: companyToDelete.id });
      handleDeleteModalClose();
      refetch();
    } catch {
      // Optional: surface error UI/toast if desired
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Get insurance companies data
  const insuranceCompanies: InsuranceCompany[] = Array.isArray(pharmacyInsuranceCompanies)
    ? (pharmacyInsuranceCompanies as InsuranceCompany[])
    : (pharmacyInsuranceCompanies && (pharmacyInsuranceCompanies as any).insurance_companies && Array.isArray((pharmacyInsuranceCompanies as any).insurance_companies)
      ? ((pharmacyInsuranceCompanies as any).insurance_companies as InsuranceCompany[])
      : []);

  // Loading state
  if (pharmacyInsuranceLoading && !insuranceCompanies.length) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Companies</h1>
        <Button
          onClick={handleAddInsurance}
          disabled={allInsuranceLoading}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Insurance
        </Button>
      </div>

      {/* Table */}
      {insuranceCompanies.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Types
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {insuranceCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {company.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.contact_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.policy_types}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status="active" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleRemoveInsurance(company)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Error or Empty State */}
      {pharmacyInsuranceError ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load insurance companies</h3>
          <p className="text-gray-500 mb-4">There was an error loading your insurance companies</p>
          <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      ) : insuranceCompanies.length === 0 && !pharmacyInsuranceLoading ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No insurance companies found</h3>
          <p className="text-gray-500 mb-4">You haven't added any insurance companies yet</p>
          <Button
            onClick={handleAddInsurance}
            disabled={allInsuranceLoading}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Insurance
          </Button>
        </div>
      ) : null}

      {/* Add Insurance Modal */}
      <AddInsuranceModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSuccess={handleAddModalSuccess}
        insuranceCompanies={allInsuranceCompanies || []}
        assignedCompanyIds={insuranceCompanies.map(c => c.id)}
        isLoading={allInsuranceLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Remove Insurance Company"
        message={`Are you sure you want to remove "${companyToDelete?.name}" from your insurance companies? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={removeInsuranceMutation.isPending}
      />
    </div>
  );
};

export default InsuranceCompanies; 