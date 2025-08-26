import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorVerificationRequirements, submitVerificationDocument, type DoctorVerificationRequest } from '../services/verificationService';
import { getAuthData } from '../services/authService';
import toast from 'react-hot-toast';

// Get doctor verification requirements
export const useDoctorVerificationRequirements = (doctorId: number) => {
  return useQuery<DoctorVerificationRequest[]>({
    queryKey: ['verificationRequirements', doctorId],
    queryFn: () => getDoctorVerificationRequirements(doctorId),
    enabled: !!doctorId,
  });
};

// Submit verification document mutation
export const useSubmitVerificationDocument = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthData();

  return useMutation({
    mutationFn: ({ requestId, file }: { requestId: number; file: File }) => 
      submitVerificationDocument(user?.id || 0, requestId, file),
    onSuccess: () => {
      // Invalidate and refetch verification requirements
      queryClient.invalidateQueries({ queryKey: ['verificationRequirements', user?.id] });
      toast.success('Verification document submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit verification document');
    },
  });
}; 