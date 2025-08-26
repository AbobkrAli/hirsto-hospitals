import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  // Medicine functions
  getPharmacyMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  type MedicineData,
  type CreateMedicineData,
  // Legacy care package functions
  getDoctorCarePackages, 
  createCarePackage, 
  updateCarePackage, 
  deleteCarePackage,
  getDoctorHistory,
  sendCarePackageRequest,
  type CarePackageData,
  type CreateCarePackageData,
  type DoctorHistoryData,
  type SendCarePackageRequestData
} from '../services/medicineService';
import { getAuthData } from '../services/authService';
import toast from 'react-hot-toast';

// ===== MEDICINE HOOKS =====

// Get pharmacy medicines
export const usePharmacyMedicines = () => {
  const userType = localStorage.getItem('userType') || 'pharmacy';
  
  return useQuery<MedicineData[]>({
    queryKey: ['medicines', userType],
    queryFn: () => getPharmacyMedicines(),
  });
};

// Create medicine mutation
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  const userType = localStorage.getItem('userType') || 'pharmacy';

  return useMutation({
    mutationFn: (data: CreateMedicineData) => createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', userType] });
      toast.success('Medicine created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create medicine');
    },
  });
};

// Update medicine mutation
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  const userType = localStorage.getItem('userType') || 'pharmacy';

  return useMutation({
    mutationFn: ({ medicineId, data }: { medicineId: number; data: CreateMedicineData }) => 
      updateMedicine(medicineId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', userType] });
      toast.success('Medicine updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update medicine');
    },
  });
};

// Delete medicine mutation
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  const userType = localStorage.getItem('userType') || 'pharmacy';

  return useMutation({
    mutationFn: (medicineId: number) => deleteMedicine(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', userType] });
      toast.success('Medicine deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete medicine');
    },
  });
};

// ===== LEGACY CARE PACKAGE HOOKS (for compatibility) =====

// Get doctor care packages
export const useDoctorCarePackages = (doctorId: number) => {
  return useQuery<CarePackageData[]>({
    queryKey: ['carePackages', doctorId],
    queryFn: () => getDoctorCarePackages(doctorId),
    enabled: !!doctorId,
  });
};

// Create care package mutation
export const useCreateCarePackage = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: (data: CreateCarePackageData) => createCarePackage(user?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carePackages', user?.id] });
      toast.success('Care package created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create care package');
    },
  });
};

// Update care package mutation
export const useUpdateCarePackage = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: ({ packageId, data }: { packageId: number; data: CreateCarePackageData }) => 
      updateCarePackage(packageId, user?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carePackages', user?.id] });
      toast.success('Care package updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update care package');
    },
  });
};

// Delete care package mutation
export const useDeleteCarePackage = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: (packageId: number) => deleteCarePackage(packageId, user?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carePackages', user?.id] });
      toast.success('Care package deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete care package');
    },
  });
};

// Get doctor history
export const useDoctorHistory = (doctorId: number) => {
  return useQuery<DoctorHistoryData[]>({
    queryKey: ['doctorHistory', doctorId],
    queryFn: () => getDoctorHistory(doctorId),
    enabled: !!doctorId,
  });
};

// Send care package request mutation
export const useSendCarePackageRequest = () => {
  const { user } = getAuthData();

  return useMutation({
    mutationFn: (data: SendCarePackageRequestData) => sendCarePackageRequest(user?.id || 0, data),
    onSuccess: () => {
      toast.success('Care package request sent successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send care package request');
    },
  });
}; 