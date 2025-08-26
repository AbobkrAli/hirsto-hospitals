import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface SurgeryData {
  id: number;
  hospital_id: number;
  name: string;
  description: string;
  specialization_required: string;
  estimated_duration_hours: number;
  cost: number;
  preparation_instructions: string;
  post_surgery_care: string;
  risk_level: string; // low | medium | high
  is_emergency_surgery: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSurgeryRequest {
  name: string;
  description: string;
  specialization_required: string;
  estimated_duration_hours: number;
  cost: number;
  preparation_instructions: string;
  post_surgery_care: string;
  risk_level: string; // low | medium | high
  is_emergency_surgery: boolean;
}

export interface UpdateSurgeryRequest extends CreateSurgeryRequest {}

export const surgeryKeys = {
  all: ['surgeries'] as const,
  hospital: (hospitalId: number) => [...surgeryKeys.all, 'hospital', hospitalId] as const,
  list: (
    hospitalId: number,
    params: { skip?: number; limit?: number; risk_level?: string | null; is_active?: boolean | null }
  ) => [...surgeryKeys.hospital(hospitalId), params.skip ?? 0, params.limit ?? 0, params.risk_level ?? 'all', params.is_active ?? 'all'] as const,
};

export const useHospitalSurgeries = (
  hospitalId?: number,
  params?: { skip?: number; limit?: number; risk_level?: string | null; is_active?: boolean | null }
) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  const queryParams = params ?? { skip: 0, limit: 0, risk_level: null, is_active: null };
  return useQuery({
    queryKey: surgeryKeys.list(resolvedHospitalId || 0, queryParams),
    queryFn: async (): Promise<SurgeryData[]> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const search = new URLSearchParams();
      if (typeof queryParams.skip === 'number') search.set('skip', String(queryParams.skip));
      if (typeof queryParams.limit === 'number' && queryParams.limit > 0) search.set('limit', String(queryParams.limit));
      if (queryParams.risk_level) search.set('risk_level', String(queryParams.risk_level));
      if (typeof queryParams.is_active !== 'undefined' && queryParams.is_active !== null) search.set('is_active', String(queryParams.is_active));
      const response = await api.get(`/hospitals/${resolvedHospitalId}/surgeries${search.toString() ? `?${search.toString()}` : ''}`);
      return response.data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateSurgery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, data }: { hospitalId?: number; data: CreateSurgeryRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.post(`/hospitals/${resolvedHospitalId}/surgeries`, data);
      return response.data as SurgeryData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: surgeryKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useUpdateSurgery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, surgeryId, data }: { hospitalId?: number; surgeryId: number; data: UpdateSurgeryRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.put(`/hospitals/${resolvedHospitalId}/surgeries/${surgeryId}`, data);
      return response.data as SurgeryData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: surgeryKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useDeleteSurgery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, surgeryId }: { hospitalId?: number; surgeryId: number }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.delete(`/hospitals/${resolvedHospitalId}/surgeries/${surgeryId}`);
      return response.data as { message?: string };
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: surgeryKeys.hospital(resolvedHospitalId) });
    },
  });
};


