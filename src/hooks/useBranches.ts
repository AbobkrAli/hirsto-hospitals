import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPharmacyBranches, 
  createBranch, 
  updateBranch, 
  deleteBranch,
  type BranchData,
  type UpdateBranchData
} from '../services/branchService';
import toast from 'react-hot-toast';

// Query keys
export const branchKeys = {
  all: ['branches'] as const,
  pharmacyBranches: () => [...branchKeys.all, 'pharmacy'] as const,
};

// Hook to fetch pharmacy branches
export const usePharmacyBranches = () => {
  return useQuery({
    queryKey: branchKeys.pharmacyBranches(),
    queryFn: getPharmacyBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create branch
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: (data: BranchData) => {
      queryClient.setQueryData(branchKeys.pharmacyBranches(), (old: BranchData[] | undefined) => {
        return old ? [...old, data] : [data];
      });
      toast.success('Branch created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });
};

// Hook to update branch
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchId, data }: { branchId: number; data: UpdateBranchData }) => 
      updateBranch(branchId, data),
    onSuccess: (data: BranchData) => {
      queryClient.setQueryData(branchKeys.pharmacyBranches(), (old: BranchData[] | undefined) => {
        return old ? old.map(branch => branch.id === data.id ? data : branch) : [data];
      });
      toast.success('Branch updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update branch');
    },
  });
};

// Hook to delete branch
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: (_, branchId: number) => {
      queryClient.setQueryData(branchKeys.pharmacyBranches(), (old: BranchData[] | undefined) => {
        return old ? old.filter(branch => branch.id !== branchId) : [];
      });
      toast.success('Branch deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete branch');
    },
  });
};
