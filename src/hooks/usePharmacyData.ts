import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPharmacyProfile, updatePharmacyProfile, type PharmacyData } from '../services/authService';
import toast from 'react-hot-toast';

export const usePharmacyData = () => {
  return useQuery<PharmacyData>({
    queryKey: ['pharmacy-profile'],
    queryFn: getPharmacyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdatePharmacyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePharmacyProfile,
    onSuccess: (data: PharmacyData) => {
      queryClient.setQueryData(['pharmacy-profile'], data);
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};
