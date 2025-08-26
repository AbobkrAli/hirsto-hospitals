import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface InsuranceCompany {
  id: number;
  name: string;
  contact_email: string;
  policy_types: string;
}

export interface DoctorInsuranceResponse {
  doctor_id: number;
  doctor_name: string;
  insurance_companies: InsuranceCompany[];
}

export interface PharmacyInsuranceResponse {
  pharmacy_id: number;
  pharmacy_name: string;
  insurance_companies: InsuranceCompany[];
}

// Query keys
export const insuranceKeys = {
  all: ['insurance'] as const,
  companies: () => [...insuranceKeys.all, 'companies'] as const,
  doctorCompanies: (doctorId: number) => [...insuranceKeys.all, 'doctor', doctorId] as const,
  pharmacyCompanies: (hospitalId: number) => [...insuranceKeys.all, 'pharmacy', hospitalId] as const,
};

// ===== REACT QUERY HOOKS =====

// Hook to fetch all available insurance companies
export const useInsuranceCompanies = () => {
  return useQuery({
    queryKey: insuranceKeys.companies(),
    queryFn: async (): Promise<InsuranceCompany[]> => {
      console.log('🔄 Making API call to fetch insurance companies...');
      try {
        const response = await api.get('/insurance_companies');
        console.log('✅ Insurance companies fetched successfully:', response.data.length, 'companies');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error fetching insurance companies:', error);
        let errorMessage = 'Failed to fetch insurance companies';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
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
        const response = await api.get(`/doctors/${doctorId}/insurance-companies`);
        console.log('✅ Doctor insurance companies fetched successfully:', response.data.insurance_companies.length, 'companies');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error fetching doctor insurance companies:', error);
        let errorMessage = 'Failed to fetch doctor insurance companies';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
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

  return useMutation({
    mutationFn: async ({ doctorId, insuranceCompanyIds }: { doctorId: number; insuranceCompanyIds: number[] }) => {
      console.log('🔄 Making API call to assign insurance companies to doctor...');
      try {
        const response = await api.post(`/doctors/${doctorId}/assign-insurance`, {
          insurance_company_ids: insuranceCompanyIds
        });
        console.log('✅ Insurance companies assigned to doctor successfully');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error assigning insurance companies to doctor:', error);
        let errorMessage = 'Failed to assign insurance companies';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, { doctorId }) => {
      console.log('✅ Insurance companies assigned successfully:', data);
      
      // Invalidate and refetch doctor's insurance companies
      queryClient.invalidateQueries({
        queryKey: insuranceKeys.doctorCompanies(doctorId),
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error assigning insurance companies:', error);
    },
  });
};

// Hook to remove insurance company from doctor
export const useRemoveInsuranceCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctorId, insuranceCompanyId }: { doctorId: number; insuranceCompanyId: number }) => {
      console.log('🔄 Making API call to remove insurance company from doctor...');
      try {
        const response = await api.delete(`/doctors/${doctorId}/remove-insurance/${insuranceCompanyId}`);
        console.log('✅ Insurance company removed from doctor successfully');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error removing insurance company from doctor:', error);
        let errorMessage = 'Failed to remove insurance company';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, { doctorId }) => {
      console.log('✅ Insurance company removed successfully:', data);
      
      // Invalidate and refetch doctor's insurance companies
      queryClient.invalidateQueries({
        queryKey: insuranceKeys.doctorCompanies(doctorId),
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error removing insurance company:', error);
    },
  });
};

// Hook to remove insurance company from hospital (pharmacy)
export const useRemoveHospitalInsuranceCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ hospitalId, insuranceCompanyId }: { hospitalId: number; insuranceCompanyId: number }) => {
      console.log('🔄 Making API call to remove insurance company from hospital...');
      try {
        const response = await api.delete(`/hospitals/${hospitalId}/remove-insurance/${insuranceCompanyId}`);
        console.log('✅ Insurance company removed from hospital successfully');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error removing insurance company from hospital:', error);
        let errorMessage = 'Failed to remove insurance company from hospital';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, { hospitalId }) => {
      console.log('✅ Insurance company removed from hospital successfully:', data);
      
      // Invalidate and refetch hospital's insurance companies
      queryClient.invalidateQueries({
        queryKey: insuranceKeys.pharmacyCompanies(hospitalId),
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error removing insurance company from hospital:', error);
    },
  });
};

// ===== PHARMACY INSURANCE HOOKS =====

// Hook to fetch pharmacy's assigned insurance companies
export const usePharmacyInsuranceCompanies = (hospitalId: number | undefined) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  return useQuery({
    queryKey: insuranceKeys.pharmacyCompanies((hospitalId ?? hospitalIdLocal) || 0),
    queryFn: async (): Promise<InsuranceCompany[]> => {
      console.log('🔄 Making API call to fetch pharmacy insurance companies...');
      try {
        const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
        if (!resolvedHospitalId) {
          throw new Error('Hospital ID is required');
        }
        const response = await api.get(`/hospitals/${resolvedHospitalId}/insurance-companies`);
        console.log('✅ Pharmacy insurance companies fetched successfully:', response.data.length, 'companies');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error fetching pharmacy insurance companies:', error);
        let errorMessage = 'Failed to fetch pharmacy insurance companies';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    enabled: !!(hospitalId ?? hospitalIdLocal),
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
    mutationFn: async ({ hospitalId, companyIds }: { hospitalId?: number; companyIds: number[] }) => {
      console.log('🔄 Making API call to assign insurance companies to pharmacy...');
      try {
        const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
        const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
        if (!resolvedHospitalId) {
          throw new Error('Hospital ID is required');
        }
        const response = await api.post(`/hospitals/${resolvedHospitalId}/assign-insurance`, {
          insurance_company_ids: companyIds
        });
        console.log('✅ Insurance companies assigned to pharmacy successfully');
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error assigning insurance companies to pharmacy:', error);
        let errorMessage = 'Failed to assign insurance companies to pharmacy';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data, { hospitalId }) => {
      console.log('✅ Insurance companies assigned to pharmacy successfully:', data);
      
      // Invalidate and refetch pharmacy's insurance companies
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) {
        queryClient.invalidateQueries({
          queryKey: insuranceKeys.pharmacyCompanies(resolvedHospitalId),
        });
      }
    },
    onError: (error: Error) => {
      console.error('❌ Error assigning insurance companies to pharmacy:', error);
    },
  });
};

// ===== LEGACY FUNCTIONS (for backward compatibility) =====

// Get all available insurance companies (legacy)
// (Removed unused legacy request functions)