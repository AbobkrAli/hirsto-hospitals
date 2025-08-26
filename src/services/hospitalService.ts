import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface HospitalData {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  location: string;
  bio: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  insurance_companies?: Array<{ id: number; name: string }>;
  doctors?: Array<{ id: number; name: string }>;
}

export interface UpdateHospitalRequest {
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  location?: string;
  bio?: string;
  insurance_company_ids?: number[];
}

export const hospitalKeys = {
  all: ['hospital'] as const,
  byId: (hospitalId: number) => [...hospitalKeys.all, hospitalId] as const,
};

export const useGetHospital = (hospitalId?: number) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  return useQuery({
    queryKey: hospitalKeys.byId(resolvedHospitalId || 0),
    queryFn: async (): Promise<HospitalData> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const { data } = await api.get(`/hospitals/${resolvedHospitalId}`);
      return data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, data }: { hospitalId?: number; data: UpdateHospitalRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.put(`/hospitals/${resolvedHospitalId}`, data);
      return response.data as HospitalData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: hospitalKeys.byId(resolvedHospitalId) });
    },
  });
};


export interface HospitalRegisterData {
  name: string;
  email: string;
  password: string;
  location?: string;
  phone_number?: string;
  logo?: File | null;
  bio?: string;
}

export const registerHospital = async (data: HospitalRegisterData) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  if (data.location) formData.append('location', data.location);
  if (data.phone_number) formData.append('phone_number', data.phone_number);
  if (data.bio) formData.append('bio', data.bio);
  if (data.logo) formData.append('logo', data.logo);

  const response = await api.post('/hospitals/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
