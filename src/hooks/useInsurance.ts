import { toast } from 'react-hot-toast';
import { 
  useInsuranceCompanies,
  useDoctorInsuranceCompanies,
  useAssignInsuranceCompany,
  useRemoveInsuranceCompany,
  usePharmacyInsuranceCompanies,
  useAssignPharmacyInsuranceCompanies,
  type InsuranceCompany,
  type DoctorInsuranceResponse 
} from '../services/insuranceService';
import { getAuthData } from '../services/authService';

// Re-export the hooks from the service for backward compatibility
export {
  useInsuranceCompanies,
  useDoctorInsuranceCompanies,
  useAssignInsuranceCompany,
  useRemoveInsuranceCompany,
  usePharmacyInsuranceCompanies,
  useAssignPharmacyInsuranceCompanies,
  type InsuranceCompany,
  type DoctorInsuranceResponse
};

// Enhanced hooks with toast notifications and additional functionality

// Enhanced hook to assign insurance companies to doctor with toast notifications
export const useAssignInsuranceCompanyWithToast = () => {
  const { user } = getAuthData();
  const mutation = useAssignInsuranceCompany();

  return {
    ...mutation,
    mutateAsync: async (insuranceCompanyIds: number[]) => {
      if (!user?.id) {
        toast.error('Doctor ID not found');
        throw new Error('Doctor ID not found');
      }
      
      try {
        const result = await mutation.mutateAsync({ 
          doctorId: user.id, 
          insuranceCompanyIds 
        });
        toast.success('Insurance companies assigned successfully');
        return result;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to assign insurance companies');
        throw error;
      }
    }
  };
};

// Enhanced hook to remove insurance company from doctor with toast notifications
export const useRemoveInsuranceCompanyWithToast = () => {
  const { user } = getAuthData();
  const mutation = useRemoveInsuranceCompany();

  return {
    ...mutation,
    mutateAsync: async (insuranceCompanyId: number) => {
      if (!user?.id) {
        toast.error('Doctor ID not found');
        throw new Error('Doctor ID not found');
      }
      
      try {
        const result = await mutation.mutateAsync({ 
          doctorId: user.id, 
          insuranceCompanyId 
        });
        toast.success('Insurance company removed successfully');
        return result;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to remove insurance company');
        throw error;
      }
    }
  };
};

// Enhanced hook to assign insurance companies to pharmacy with toast notifications
export const useAssignPharmacyInsuranceCompaniesWithToast = () => {
  const mutation = useAssignPharmacyInsuranceCompanies();

  return {
    ...mutation,
    mutateAsync: async (companyIds: number[]) => {
      const hospitalId = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      if (!hospitalId) {
        toast.error('Hospital ID not found');
        throw new Error('Hospital ID not found');
      }
      
      try {
        const result = await mutation.mutateAsync({ 
          hospitalId, 
          companyIds 
        });
        toast.success('Insurance companies assigned successfully');
        return result;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to assign insurance companies');
        throw error;
      }
    }
  };
};

// Enhanced hook to fetch pharmacy insurance companies with hospital ID from localStorage
export const usePharmacyInsuranceCompaniesWithHospitalId = () => {
  const hospitalId = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  return usePharmacyInsuranceCompanies(hospitalId);
}; 