import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getInsuranceCompanies, 
  getDoctorInsuranceCompanies, 
  assignInsuranceCompany,
  removeInsuranceCompany,
  getPharmacyInsuranceCompanies,
  assignPharmacyInsuranceCompanies,
  type InsuranceCompany,
  type DoctorInsuranceResponse 
} from '../services/insuranceService';
import { getAuthData } from '../services/authService';

// Query keys
export const insuranceKeys = {
  all: ['insurance'] as const,
  companies: () => [...insuranceKeys.all, 'companies'] as const,
  doctorCompanies: (doctorId: number) => [...insuranceKeys.all, 'doctor', doctorId] as const,
  pharmacyCompanies: () => [...insuranceKeys.all, 'pharmacy'] as const,
};

// Hook to fetch all available insurance companies
export const useInsuranceCompanies = () => {
  return useQuery({
    queryKey: insuranceKeys.companies(),
    queryFn: async (): Promise<InsuranceCompany[]> => {
      console.log('🔄 Making API call to fetch insurance companies...');
      try {
        const result = await getInsuranceCompanies();
        console.log('✅ Insurance companies fetched successfully:', result.length, 'companies');
        return result;
      } catch (error) {
        console.error('❌ Error fetching insurance companies:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to fetch doctor's assigned insurance companies
export const useDoctorInsuranceCompanies = (doctorId: number | undefined) => {
  return useQuery({
    queryKey: insuranceKeys.doctorCompanies(doctorId || 0),
    queryFn: async (): Promise<DoctorInsuranceResponse> => {
      console.log('🔄 Making API call to fetch doctor insurance companies...');
      try {
        const result = await getDoctorInsuranceCompanies(doctorId!);
        console.log('✅ Doctor insurance companies fetched successfully:', result.insurance_companies.length, 'companies');
        return result;
      } catch (error) {
        console.error('❌ Error fetching doctor insurance companies:', error);
        throw error;
      }
    },
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to assign insurance companies to doctor
export const useAssignInsuranceCompany = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: async (insuranceCompanyIds: number[]) => {
      if (!user?.id) {
        throw new Error('Doctor ID not found');
      }
      return assignInsuranceCompany(user.id, insuranceCompanyIds);
    },
    onSuccess: (data) => {
      console.log('✅ Insurance companies assigned successfully:', data);
      toast.success('Insurance companies assigned successfully');
      
      // Invalidate and refetch doctor's insurance companies
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: insuranceKeys.doctorCompanies(user.id),
        });
      }
    },
    onError: (error: Error) => {
      console.error('❌ Error assigning insurance companies:', error);
      toast.error(error.message || 'Failed to assign insurance companies');
    },
  });
}; 

// Hook to remove insurance company from doctor
export const useRemoveInsuranceCompany = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: async (insuranceCompanyId: number) => {
      if (!user?.id) {
        throw new Error('Doctor ID not found');
      }
      return removeInsuranceCompany(user.id, insuranceCompanyId);
    },
    onSuccess: (data) => {
      console.log('✅ Insurance company removed successfully:', data);
      toast.success('Insurance company removed successfully');
      
      // Invalidate and refetch doctor's insurance companies
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: insuranceKeys.doctorCompanies(user.id),
        });
      }
    },
    onError: (error: Error) => {
      console.error('❌ Error removing insurance company:', error);
      toast.error(error.message || 'Failed to remove insurance company');
    },
  });
};

// ===== PHARMACY HOOKS =====

// Hook to fetch pharmacy's assigned insurance companies
export const usePharmacyInsuranceCompanies = () => {
  return useQuery({
    queryKey: insuranceKeys.pharmacyCompanies(),
    queryFn: async (): Promise<InsuranceCompany[]> => {
      console.log('🔄 Making API call to fetch pharmacy insurance companies...');
      try {
        const result = await getPharmacyInsuranceCompanies();
        console.log('✅ Pharmacy insurance companies fetched successfully:', result.length, 'companies');
        return result;
      } catch (error) {
        console.error('❌ Error fetching pharmacy insurance companies:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to assign insurance companies to pharmacy
export const useAssignPharmacyInsuranceCompanies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyIds: number[]) => {
      return assignPharmacyInsuranceCompanies(companyIds);
    },
    onSuccess: (data) => {
      console.log('✅ Insurance companies assigned to pharmacy successfully:', data);
      toast.success('Insurance companies assigned successfully');
      
      // Invalidate and refetch pharmacy's insurance companies
      queryClient.invalidateQueries({
        queryKey: insuranceKeys.pharmacyCompanies(),
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error assigning insurance companies to pharmacy:', error);
      toast.error(error.message || 'Failed to assign insurance companies');
    },
  });
}; 