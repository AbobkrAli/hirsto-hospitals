import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMyVerificationRequests, 
  getAvailableRequirements, 
  submitVerificationFile,
  submitVerificationForRequirement
} from '../services/pharmacyVerificationService';

export const usePharmacyVerificationRequests = () => {
  return useQuery({
    queryKey: ['pharmacy-verification-requests'],
    queryFn: getMyVerificationRequests,
    gcTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAvailableVerificationRequirements = () => {
  return useQuery({
    queryKey: ['available-verification-requirements'],
    queryFn: getAvailableRequirements,
    gcTime: 30 * 60 * 1000, // 30 minutes
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSubmitVerificationFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, file }: { requestId: number; file: File }) =>
      submitVerificationFile(requestId, file),
    onSuccess: () => {
      // Invalidate and refetch verification requests
      queryClient.invalidateQueries({ queryKey: ['pharmacy-verification-requests'] });
      queryClient.invalidateQueries({ queryKey: ['available-verification-requirements'] });
    },
  });
};

export const useSubmitVerificationForRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requirementId, file }: { requirementId: number; file: File }) =>
      submitVerificationForRequirement(requirementId, file),
    onSuccess: () => {
      // Invalidate and refetch verification requests
      queryClient.invalidateQueries({ queryKey: ['pharmacy-verification-requests'] });
      queryClient.invalidateQueries({ queryKey: ['available-verification-requirements'] });
    },
  });
};
