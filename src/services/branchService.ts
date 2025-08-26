import api from '../utils/api';

export interface BranchData {
  id: number;
  parent_pharmacy_id: number;
  branch_name: string;
  username: string;
  location: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBranchData {
  branch_name: string;
  username: string;
  password: string;
  location: string;
  phone_number: string;
}

export interface UpdateBranchData {
  branch_name: string;
  username: string;
  password?: string;
  location: string;
  phone_number: string;
  is_active: boolean;
}

// Get pharmacy branches
export const getPharmacyBranches = async (): Promise<BranchData[]> => {
  try {
    const response = await api.get('/pharmacy-branches/my-branches');
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch branches';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Create branch
export const createBranch = async (data: CreateBranchData): Promise<BranchData> => {
  try {
    const response = await api.post('/pharmacy-branches/create', data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to create branch';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Update branch
export const updateBranch = async (branchId: number, data: UpdateBranchData): Promise<BranchData> => {
  try {
    const response = await api.put(`/pharmacy-branches/branches/${branchId}`, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to update branch';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Delete branch
export const deleteBranch = async (branchId: number): Promise<void> => {
  try {
    await api.delete(`/pharmacy-branches/branches/${branchId}`);
  } catch (error: unknown) {
    let errorMessage = 'Failed to delete branch';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};
