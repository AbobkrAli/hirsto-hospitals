import api from '../utils/api';

export interface VerificationRequirement {
  id: number;
  file_name: string;
  description: string;
  file_type: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PharmacyVerificationRequest {
  id: number;
  pharmacy_id: number;
  requirement_id: number;
  status: string;
  admin_notes: string;
  custom_description: string;
  file_url: string;
  sent_at: string;
  submitted_at: string;
  reviewed_at: string;
  requirement: VerificationRequirement;
}

export const getMyVerificationRequests = async (): Promise<PharmacyVerificationRequest[]> => {
  const response = await api.get('/pharmacy-verification/my-requests');
  return response.data;
};

export const getAvailableRequirements = async (): Promise<VerificationRequirement[]> => {
  const response = await api.get('/pharmacy-verification/requirements');
  return response.data;
};

export const submitVerificationFile = async (requestId: number, file: File): Promise<PharmacyVerificationRequest> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/pharmacy-verification/my-requests/${requestId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createVerificationRequest = async (requirementId: number): Promise<PharmacyVerificationRequest> => {
  const response = await api.post('/pharmacy-verification/my-requests', {
    requirement_id: requirementId
  });
  return response.data;
};

// Now expects the requirementId to be the requestId, and just submits the file
export const submitVerificationForRequirement = async (requestId: number, file: File): Promise<PharmacyVerificationRequest> => {
  return await submitVerificationFile(requestId, file);
};
