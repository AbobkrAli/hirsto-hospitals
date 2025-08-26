import api from '../utils/api';

export interface Requirement {
  id: number;
  file_name: string;
  description: string;
  file_type: string;
  is_required: boolean;
  is_active: boolean;
}

export interface DoctorVerificationRequest {
  id: number;
  doctor_id: number;
  requirement_id: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  admin_notes: string;
  custom_description: string | null;
  file_url: string | null;
  sent_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  requirement: Requirement;
}

// Get doctor verification requirements
export const getDoctorVerificationRequirements = async (doctorId: number): Promise<DoctorVerificationRequest[]> => {
  try {
    const response = await api.get(`/doctor-verification/doctor/${doctorId}/requirements`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch verification requirements';
    
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

// Submit verification document
export const submitVerificationDocument = async (doctorId: number, requestId: number, file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post(`/doctor-verification/doctor/${doctorId}/submit/${requestId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Failed to submit verification document';
    
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