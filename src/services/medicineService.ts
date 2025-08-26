import api from '../utils/api';

// Helper function to get the appropriate base URL based on user type
const getMedicineBaseUrl = (): string => {
  const userType = localStorage.getItem('userType');
  if (userType === 'branch') {
    console.log('Using branch medicine endpoints: /pharmacy-branches/medicines');
    return '/pharmacy-branches/medicines';
  }
  console.log('Using pharmacy medicine endpoints: /pharmacies/me/medicines');
  return '/pharmacies/me/medicines';
};

export interface MedicineData {
  id: number;
  pharmacy_id: number;
  name: string;
  price: number;
  quantity: number;
  in_stock: boolean;
  active_ingredient: string;
  concentration: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMedicineData {
  name: string;
  price: number;
  quantity: number;
  in_stock: boolean;
  active_ingredient: string;
  concentration: string;
}

// Legacy interfaces for compatibility (to be removed gradually)
export interface CarePackageSchedule {
  day_of_week: number; // 0 is Sunday, 6 is Saturday
  time_hour: number; // 0-23
  time_minute: number; // 0, 15, 30, 45
}

export interface CarePackageData {
  id: number;
  doctor_id: number;
  name: string;
  duration_in_days: number;
  features: string;
  price: number;
  schedules?: CarePackageSchedule[];
  created_at: string;
  updated_at: string;
}

export interface CreateCarePackageData {
  name: string;
  duration_in_days: number;
  features: string;
  price: number;
  schedules: CarePackageSchedule[];
}

export interface DoctorHistoryData {
  id: number;
  start_time: string;
  end_time: string;
  room_id: string;
  user_email: string;
  user_note: string;
  doctor_note: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
}

export interface SendCarePackageRequestData {
  package_id: number;
  user_email: string;
}

// ===== MEDICINE API FUNCTIONS =====

// Get pharmacy medicines
export const getPharmacyMedicines = async (): Promise<MedicineData[]> => {
  try {
    const baseUrl = getMedicineBaseUrl();
    const response = await api.get(baseUrl);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch medicines';
    
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

// Create medicine
export const createMedicine = async (data: CreateMedicineData): Promise<MedicineData> => {
  try {
    const baseUrl = getMedicineBaseUrl();
    const response = await api.post(baseUrl, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to create medicine';
    
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

// Update medicine
export const updateMedicine = async (medicineId: number, data: CreateMedicineData): Promise<MedicineData> => {
  try {
    const baseUrl = getMedicineBaseUrl();
    const response = await api.put(`${baseUrl}/${medicineId}`, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to update medicine';
    
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

// Delete medicine
export const deleteMedicine = async (medicineId: number): Promise<void> => {
  try {
    const baseUrl = getMedicineBaseUrl();
    await api.delete(`${baseUrl}/${medicineId}`);
  } catch (error: unknown) {
    let errorMessage = 'Failed to delete medicine';
    
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

// ===== LEGACY CARE PACKAGE FUNCTIONS (for compatibility) =====

// Get doctor care packages
export const getDoctorCarePackages = async (doctorId: number): Promise<CarePackageData[]> => {
  try {
    const response = await api.get(`/care-packages/doctor/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch care packages';
    
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

// Create care package
export const createCarePackage = async (doctorId: number, data: CreateCarePackageData): Promise<CarePackageData> => {
  try {
    const response = await api.post(`/care-packages?doctor_id=${doctorId}`, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to create care package';
    
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

// Update care package
export const updateCarePackage = async (packageId: number, doctorId: number, data: CreateCarePackageData): Promise<CarePackageData> => {
  try {
    const response = await api.put(`/care-packages/${packageId}?doctor_id=${doctorId}`, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to update care package';
    
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

// Delete care package
export const deleteCarePackage = async (packageId: number, doctorId: number): Promise<void> => {
  try {
    await api.delete(`/care-packages/${packageId}?doctor_id=${doctorId}`);
  } catch (error: unknown) {
    let errorMessage = 'Failed to delete care package';
    
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

// Get doctor history
export const getDoctorHistory = async (doctorId: number): Promise<DoctorHistoryData[]> => {
  try {
    const response = await api.get(`/doctors/history/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch doctor history';
    
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

// Send care package request
export const sendCarePackageRequest = async (doctorId: number, data: SendCarePackageRequestData): Promise<void> => {
  try {
    await api.post(`/care-packages/requests?doctor_id=${doctorId}`, data);
  } catch (error: unknown) {
    let errorMessage = 'Failed to send care package request';
    
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