import api from '../utils/api';

export interface RegisterData {
  name: string;
  age: number;
  email: string;
  password: string;
  specialization: string;
  bio: string;
  phone_number: string;
  profile_image?: File; // Changed from base64 string to File object
  profile_image_url?: string; // Keep for backward compatibility
  image_url?: string;
  location?: string;
  years_of_experience?: number;
  nationality?: string;
  languages?: string;
  doctor_type?: string; // Added doctor type field
}

export interface PharmacyRegisterData {
  name: string;
  email: string;
  password: string;
  location?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  logo?: File | null;
  insurance_company_ids?: number[];
}

export interface Pharmacy {
  id: number;
  name: string;
  email: string;
  location?: string;
  pharmacy_type: 'chain' | 'separate';
  number_of_branches?: number;
  bio?: string;
  phone_number?: string;
  logo_url?: string;
  logo_image?: string | null; // Added for API response compatibility
  insurance_company_ids?: number[];
  is_active?: boolean; // Added for API response
  created_at: string;
  updated_at?: string; // Made optional
}

export interface Branch {
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

export interface LoginData {
  email: string;
  password: string;
}

export interface BranchLoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  specialization: string;
  bio: string;
  phone_number: string;
  profile_image_url: string;
  image_url?: string;
  location?: string;
  years_of_experience?: number;
  nationality?: string;
  languages?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  age: number;
  specialization: string;
  bio: string;
  phone_number: string;
  profile_image_url?: string;
  location?: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  access_token: string;
  pharmacy?: Pharmacy;
  branch?: Branch;
  doctor?: Doctor; // Doctor data for doctor registration
  is_branch_active?: boolean;
  is_parent_pharmacy_active?: boolean;
  can_access?: boolean;
  message?: string;
  // Legacy properties for backward compatibility
  token?: string;
  user?: User;
}

// Register a new doctor
export const registerDoctor = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Create FormData object
    const formData = new FormData();
    
    // Add all text fields
    formData.append('name', data.name);
    formData.append('age', data.age.toString());
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('specialization', data.specialization);
    formData.append('bio', data.bio);
    formData.append('phone_number', data.phone_number);
    
    // Add optional fields if they exist
    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.years_of_experience) {
      formData.append('years_of_experience', data.years_of_experience.toString());
    }
    if (data.nationality) {
      formData.append('nationality', data.nationality);
    }
    if (data.languages) {
      formData.append('languages', data.languages);
    }
    if (data.doctor_type) {
      formData.append('doctor_type', data.doctor_type);
    }
    
    // Handle profile image
    if (data.profile_image) {
      // If we have a File object, append it directly
      formData.append('profile_image', data.profile_image);
    }
    
    // Make the API call with FormData
    const response = await api.post('/doctors/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Registration failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      
      // Handle the specific error format with "detail" field
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Register a new pharmacy
export const registerPharmacy = async (data: PharmacyRegisterData): Promise<AuthResponse> => {
  try {
    // Make the API call with JSON data
    const response = await api.post('/hospitals/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Pharmacy registration failed';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };

      // Handle the specific error format with "detail" field
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    }

    throw new Error(errorMessage);
  }
};

// Login doctor
export const loginDoctor = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/doctors/login', data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      
      // Handle the specific error format with "detail" field
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Login pharmacy
export const loginPharmacy = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/pharmacies/login', data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      
      // Handle the specific error format with "detail" field
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Login pharmacy branch
export const loginPharmacyBranch = async (data: BranchLoginData): Promise<AuthResponse> => {
  try {
    // Only send username and password
    const response = await api.post('/pharmacy-branches/login', {
      username: data.username,
      password: data.password,
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Branch login failed';
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

// Logout doctor
export const logoutDoctor = (): void => {
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Clear any other auth-related data
  localStorage.removeItem('histro-app-storage'); // Zustand persisted storage
};

// Global logout function that can be called from anywhere
export const performLogout = (): void => {
  try {
    // Clear all authentication data
    logoutDoctor();
    
    // Clear all related storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('histro-app-storage');
    
    // Force redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Force redirect even if there's an error
    window.location.href = '/login';
  }
};

// Save auth data to localStorage
export const saveAuthData = (token: string | null, user: User): void => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
  localStorage.setItem('user', JSON.stringify(user));
};

// Get auth data from localStorage
export const getAuthData = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const userStr = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!userStr) return false;
    
    // Try to parse the user data to ensure it's valid
    const user = JSON.parse(userStr);
    
    // For branches, we don't require email since they don't have one
    if (userType === 'branch') {
      return !!(user && user.id && user.name);
    }
    
    // For pharmacies, we require email
    return !!(user && user.id && user.email);
  } catch (error) {
    // If there's an error parsing, clear the corrupted data
    console.error('Error checking authentication:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    return false;
  }
};

// Update doctor profile
export const updateDoctor = async (doctorId: number, data: Partial<RegisterData>): Promise<User> => {
  try {
    // Remove profile_image_url from the update data since image upload is handled separately
    const updateData = { ...data };
    delete updateData.profile_image_url;
    
    const response = await api.put(`/doctors/${doctorId}`, updateData);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Update failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      
      // Handle validation errors with detail array
      if (axiosError.response?.data?.detail && Array.isArray(axiosError.response.data.detail)) {
        const validationErrors = axiosError.response.data.detail as Array<{
          type: string;
          loc: string[];
          msg: string;
          input: unknown;
        }>;
        const fieldErrors = validationErrors.map((err) => {
          const field = err.loc?.[err.loc.length - 1] || 'unknown';
          return `${field}: ${err.msg}`;
        });
        errorMessage = fieldErrors.join(', ');
      } else {
        // Handle other error formats
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Upload profile image separately
export const uploadProfileImage = async (doctorId: number, imageFile: File): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post(`/doctors/${doctorId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Image upload failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      
      // Handle validation errors with detail array
      if (axiosError.response?.data?.detail && Array.isArray(axiosError.response.data.detail)) {
        const validationErrors = axiosError.response.data.detail as Array<{
          type: string;
          loc: string[];
          msg: string;
          input: unknown;
        }>;
        const fieldErrors = validationErrors.map((err) => {
          const field = err.loc?.[err.loc.length - 1] || 'unknown';
          return `${field}: ${err.msg}`;
        });
        errorMessage = fieldErrors.join(', ');
      } else if (axiosError.response?.data?.detail && typeof axiosError.response.data.detail === 'string') {
        // Handle string detail errors (like file type validation)
        errorMessage = axiosError.response.data.detail;
      } else {
        // Handle other error formats
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Availability interfaces and functions
export interface AvailabilityData {
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  user_email: string;
}

export interface AvailabilityResponse {
  message: string;
}

// Add edit availability interface
export interface EditAvailabilityData {
  start_time: string;
  end_time: string;
}

// Add care package appointment interface
export interface CarePackageAppointment {
  id: number;
  request_id: number;
  package_id: number;
  doctor_id: number;
  user_email: string;
  appointment_datetime: string;
  status: string;
  room_id?: string;
  user_note?: string;
  doctor_note?: string;
  care_package_id?: number;
  care_package_name?: string;
}

// Add appointment interfaces
export interface Appointment {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  user_email: string;
  room_id?: string;
  user_note?: string;
  care_package_id?: number;
  care_package_name?: string;
  is_care_package?: boolean;
}

export interface GetAvailabilityParams {
  doctorId: number;
  fromDate?: string;
  toDate?: string;
  onlyAvailable?: boolean;
}

// Create doctor availability slot
export const createAvailability = async (data: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const response = await api.post('/doctors/availability', data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to create availability';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      // Check for 'detail' field first (your API format), then 'message' field as fallback
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get doctor availability
export const getDoctorAvailability = async (params: GetAvailabilityParams): Promise<Appointment[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.fromDate) {
      queryParams.append('from_date', params.fromDate);
    }
    
    if (params.toDate) {
      queryParams.append('to_date', params.toDate);
    }
    
    if (params.onlyAvailable !== undefined) {
      queryParams.append('only_available', params.onlyAvailable.toString());
    }

    const url = `/doctors/availability/${params.doctorId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch availability';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
      // Check for 'detail' field first (your API format), then 'message' field as fallback
      errorMessage = axiosError.response?.data?.detail || 
                   axiosError.response?.data?.message || 
                   errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}; 

// Delete doctor availability slot
export const deleteAvailability = async (availabilityId: number): Promise<AvailabilityResponse> => {
  try {
    const response = await api.delete(`/doctors/availability/${availabilityId}`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to delete availability';
    
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

// Edit doctor availability slot
export const editAvailability = async (availabilityId: number, data: EditAvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const response = await api.put(`/doctors/availability/${availabilityId}`, data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to edit availability';
    
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

export interface DoctorRating {
  doctor_id: number;
  doctor_name: string;
  average_rating: number;
  total_ratings: number;
}

export interface DoctorReview {
  id: number;
  doctor_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Get doctor's average rating
export const getDoctorRating = async (doctorId: number): Promise<DoctorRating | null> => {
  try {
    const response = await api.get(`/doctors/rating/average/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    // If no ratings found, return null instead of throwing error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    
    let errorMessage = 'Failed to fetch doctor rating';
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
        errorMessage = (axiosError.response.data as { message: string }).message;
      } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data) {
        errorMessage = (axiosError.response.data as { error: string }).error;
      } else if (typeof axiosError.response?.data === 'string') {
        errorMessage = axiosError.response.data;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get all doctor reviews
export const getDoctorReviews = async (doctorId: number): Promise<DoctorReview[]> => {
  try {
    const response = await api.get(`/doctors/rating/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    // If no reviews found, return empty array instead of throwing error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      if (axiosError.response?.status === 404) {
        return [];
      }
    }
    
    let errorMessage = 'Failed to fetch doctor reviews';
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
        errorMessage = (axiosError.response.data as { message: string }).message;
      } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data) {
        errorMessage = (axiosError.response.data as { error: string }).error;
      } else if (typeof axiosError.response?.data === 'string') {
        errorMessage = axiosError.response.data;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}; 

// Get doctor data by ID
export const getDoctorById = async (doctorId: number): Promise<User> => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
};

// Verification types and interfaces
export interface VerificationStatus {
  status: 'pending' | 'cancelled' | 'verified' | 'none';
  note?: string; // For cancelled status - reason for rejection
}

export interface VerificationFile {
  name: string;
  file: File;
}

export interface UploadVerificationFilesData {
  authorization_document: VerificationFile;
  studies_document: VerificationFile;
}

// Get verification status
export const getVerificationStatus = async (doctorId: number): Promise<VerificationStatus> => {
  try {
    const response = await api.get(`/doctors/${doctorId}/verification`);
    return response.data;
  } catch (error) {
    console.error('Error fetching verification status:', error);
    // Return 'none' if verification endpoint doesn't exist or fails
    return { status: 'none' };
  }
};

// Upload verification files
export const uploadVerificationFiles = async (doctorId: number, data: UploadVerificationFilesData): Promise<{ message: string }> => {
  try {
    const formData = new FormData();
    
    // Add authorization document
    formData.append('name', 'authorization_document');
    formData.append('file', data.authorization_document.file);
    
    // Add studies document
    formData.append('name', 'studies_document');
    formData.append('file', data.studies_document.file);
    
    const response = await api.post(`/doctors/${doctorId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading verification files:', error);
    throw error;
  }
};

// Get care package appointments for doctor
export const getCarePackageAppointments = async (doctorId: number): Promise<CarePackageAppointment[]> => {
  try {
    const response = await api.get(`/care-packages/appointments/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching care package appointments:', error);
    throw error;
  }
};

// Pharmacy-specific interfaces and functions
export interface PharmacyData {
  id: number;
  name: string;
  email: string;
  location: string;
  number_of_branches: number;
  bio: string;
  logo_image: string;
  phone_number: string;
  pharmacy_type: string;
  is_active: boolean;
  created_at: string;
  files: Array<unknown>;
  ratings: Array<unknown>;
  medicines: Array<unknown>;
  insurance_companies: Array<unknown>;
}

export interface PharmacyUpdateData {
  name: string;
  email: string;
  password?: string;
  location: string;
  number_of_branches: number;
  bio: string;
  logo_image?: string;
  phone_number: string;
  insurance_company_ids: number[];
  pharmacy_type: 'chain' | 'separate';
}

// Get pharmacy profile data
export const getPharmacyProfile = async (): Promise<PharmacyData> => {
  try {
    const response = await api.get('/pharmacies/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching pharmacy profile:', error);
    throw error;
  }
};

// Update pharmacy profile
export const updatePharmacyProfile = async (data: PharmacyUpdateData): Promise<PharmacyData> => {
  try {
    const response = await api.put('/pharmacies/me', data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Update failed';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      
      // Handle validation errors with detail array
      if (axiosError.response?.data?.detail && Array.isArray(axiosError.response.data.detail)) {
        const validationErrors = axiosError.response.data.detail as Array<{
          type: string;
          loc: string[];
          msg: string;
          input: unknown;
        }>;
        const fieldErrors = validationErrors.map((err) => {
          const field = err.loc?.[err.loc.length - 1] || 'unknown';
          return `${field}: ${err.msg}`;
        });
        errorMessage = fieldErrors.join(', ');
      } else {
        // Handle other error formats
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};