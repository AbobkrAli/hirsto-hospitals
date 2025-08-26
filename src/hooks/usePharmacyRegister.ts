import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerPharmacy } from '../services/authService';
import type { PharmacyRegisterData, AuthResponse } from '../services/authService';
import { useAppStore } from '../store/useAppStore';

export const usePharmacyRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const setUser = useAppStore(state => state.setUser);

  const registerMutation = useMutation<AuthResponse, Error, PharmacyRegisterData>({
    mutationFn: registerPharmacy,
    onSuccess: (data) => {
      setError(null);
      
      // Handle successful registration
      if (data.pharmacy) {
        // Convert pharmacy data to user format for store compatibility
        const userFromPharmacy = {
          id: data.pharmacy.id,
          name: data.pharmacy.name,
          email: data.pharmacy.email,
          age: 0, // Not applicable for pharmacy
          specialization: 'Pharmacy', // Default for pharmacy
          bio: data.pharmacy.bio || '',
          phone_number: data.pharmacy.phone_number || '',
          profile_image_url: data.pharmacy.logo_url || '',
          location: data.pharmacy.location || '',
          years_of_experience: 0, // Not applicable for pharmacy
          nationality: '', // Not applicable for pharmacy
          languages: '', // Not applicable for pharmacy
          created_at: data.pharmacy.created_at,
          updated_at: data.pharmacy.updated_at || data.pharmacy.created_at,
        };
        
        setUser(userFromPharmacy);
        
        // Save auth data to localStorage
        if (data.access_token) {
          localStorage.setItem('authToken', data.access_token);
          localStorage.setItem('user', JSON.stringify(userFromPharmacy));
          localStorage.setItem('userType', 'pharmacy');
        }
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const register = async (data: PharmacyRegisterData) => {
    setError(null);
    return registerMutation.mutateAsync(data);
  };

  return {
    register,
    isLoading: registerMutation.isPending,
    error,
    isSuccess: registerMutation.isSuccess,
    clearError: () => setError(null),
  };
};
