import api from '../utils/api';

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

// Get all available insurance companies
export const getInsuranceCompanies = async (): Promise<InsuranceCompany[]> => {
  try {
    const response = await api.get('/insurance_companies');
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch insurance companies';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get doctor's assigned insurance companies
export const getDoctorInsuranceCompanies = async (doctorId: number): Promise<DoctorInsuranceResponse> => {
  try {
    const response = await api.get(`/doctors/${doctorId}/insurance-companies`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch doctor insurance companies';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Assign insurance companies to doctor
export const assignInsuranceCompany = async (doctorId: number, insuranceCompanyIds: number[]): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/doctors/${doctorId}/assign-insurance`, {
      insurance_company_ids: insuranceCompanyIds
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to assign insurance companies';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Remove insurance company from doctor
export const removeInsuranceCompany = async (doctorId: number, insuranceCompanyId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/doctors/${doctorId}/remove-insurance/${insuranceCompanyId}`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to remove insurance company';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// ===== PHARMACY INSURANCE FUNCTIONS =====

// Get pharmacy's assigned insurance companies
export const getPharmacyInsuranceCompanies = async (): Promise<InsuranceCompany[]> => {
  try {
    const response = await api.get('/pharmacies/me/insurance-companies');
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch pharmacy insurance companies';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Assign insurance companies to pharmacy
export const assignPharmacyInsuranceCompanies = async (companyIds: number[]): Promise<{ message: string }> => {
  try {
    const response = await api.post('/pharmacies/me/assign-insurance', {
      company_ids: companyIds
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to assign insurance companies to pharmacy';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}; 