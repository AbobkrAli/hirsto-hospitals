import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface DoctorData {
  id: number;
  name: string;
  age: number;
  email: string;
  specialization: string;
  bio: string;
  phone_number: string;
  image_url?: string;
  profile_image_url?: string;
  location: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
  doctor_type?: string;
  is_active?: boolean;
  profile_complete?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDoctorRequest {
  name: string;
  age: number;
  email: string;
  specialization: string;
  bio: string;
  phone_number: string;
  profile_image_url: string;
  location: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
  insurance_company_ids: number[];
}

export interface UpdateDoctorRequest {
  name: string;
  age: number;
  email: string;
  specialization: string;
  bio: string;
  phone_number: string;
  profile_image_url: string;
  location: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
}

export const doctorKeys = {
  all: ['doctors'] as const,
  hospital: (hospitalId: number) => [...doctorKeys.all, 'hospital', hospitalId] as const,
  list: (hospitalId: number, params: { skip?: number; limit?: number; is_active?: boolean | null }) => [
    ...doctorKeys.hospital(hospitalId),
    params.skip ?? 0,
    params.limit ?? 0,
    params.is_active ?? 'all',
  ] as const,
};

export const useHospitalDoctors = (
  hospitalId?: number,
  params?: { skip?: number; limit?: number; is_active?: boolean | null }
) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  const queryParams = params ?? { skip: 0, limit: 0, is_active: null };
  return useQuery({
    queryKey: doctorKeys.list(resolvedHospitalId || 0, queryParams),
    queryFn: async (): Promise<DoctorData[]> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const search = new URLSearchParams();
      if (typeof queryParams.skip === 'number') search.set('skip', String(queryParams.skip));
      if (typeof queryParams.limit === 'number' && queryParams.limit > 0) search.set('limit', String(queryParams.limit));
      if (typeof queryParams.is_active !== 'undefined' && queryParams.is_active !== null) {
        search.set('is_active', String(queryParams.is_active));
      }
      const response = await api.get(`/hospitals/${resolvedHospitalId}/doctors${search.toString() ? `?${search.toString()}` : ''}`);
      return response.data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, data }: { hospitalId?: number; data: CreateDoctorRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.post(`/hospitals/${resolvedHospitalId}/doctors`, data);
      return response.data as DoctorData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) {
        queryClient.invalidateQueries({ queryKey: doctorKeys.hospital(resolvedHospitalId) });
      }
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, doctorId, data }: { hospitalId?: number; doctorId: number; data: UpdateDoctorRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.put(`/hospitals/${resolvedHospitalId}/doctors/${doctorId}`, data);
      return response.data as DoctorData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) {
        queryClient.invalidateQueries({ queryKey: doctorKeys.hospital(resolvedHospitalId) });
      }
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, doctorId }: { hospitalId?: number; doctorId: number }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.delete(`/hospitals/${resolvedHospitalId}/doctors/${doctorId}`);
      return response.data as { message?: string };
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) {
        queryClient.invalidateQueries({ queryKey: doctorKeys.hospital(resolvedHospitalId) });
      }
    },
  });
};


