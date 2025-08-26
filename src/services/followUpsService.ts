import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FollowUpDoctor {
  id: number;
  name: string;
  age: number;
  email: string;
  specialization: string;
  bio: string;
  phone_number: string;
  image_url: string;
  location: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
  doctor_type: string;
  is_active: boolean;
  profile_complete: number;
  created_at?: string;
  updated_at?: string;
}

export type FollowUpSession = Record<string, unknown>;

export interface FollowUpData {
  id: number;
  hospital_id: number;
  doctor_id: number;
  patient_email: string;
  patient_name: string;
  follow_up_type: string;
  related_surgery_id: number | null;
  related_test_id: number | null;
  initial_consultation_date: string;
  next_appointment_date: string;
  status: string;
  priority_level: string; // routine | urgent | etc.
  chief_complaint: string;
  current_symptoms: string;
  vital_signs: string;
  current_medications: string;
  treatment_plan: string;
  progress_notes?: string;
  recommendations?: string;
  next_steps?: string;
  follow_up_frequency: string;
  total_sessions_planned: number;
  sessions_completed?: number;
  improvement_status?: string;
  patient_satisfaction?: number;
  treatment_effectiveness?: string;
  created_at?: string;
  updated_at?: string;
  doctor?: FollowUpDoctor;
  sessions?: FollowUpSession[];
}

export interface CreateFollowUpRequest {
  doctor_id: number;
  patient_email: string;
  patient_name: string;
  follow_up_type: string;
  related_surgery_id: number | null;
  related_test_id: number | null;
  initial_consultation_date: string; // ISO
  next_appointment_date: string; // ISO
  priority_level: string; // routine | urgent | etc.
  chief_complaint: string;
  current_symptoms: string;
  vital_signs: string;
  current_medications: string;
  treatment_plan: string;
  follow_up_frequency: string;
  total_sessions_planned: number;
}

export interface UpdateFollowUpRequest extends CreateFollowUpRequest {}

export const followUpKeys = {
  all: ['follow-ups'] as const,
  hospital: (hospitalId: number) => [...followUpKeys.all, 'hospital', hospitalId] as const,
  list: (
    hospitalId: number,
    params: { status?: string | null; patient_email?: string | null }
  ) => [...followUpKeys.hospital(hospitalId), params.status ?? 'all', params.patient_email ?? 'all'] as const,
};

export const useHospitalFollowUps = (
  hospitalId?: number,
  params?: { status?: string | null; patient_email?: string | null }
) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  const queryParams = params ?? { status: null, patient_email: null };
  return useQuery({
    queryKey: followUpKeys.list(resolvedHospitalId || 0, queryParams),
    queryFn: async (): Promise<FollowUpData[]> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const search = new URLSearchParams();
      if (queryParams.status) search.set('status', String(queryParams.status));
      if (queryParams.patient_email) search.set('patient_email', String(queryParams.patient_email));
      const response = await api.get(`/hospitals/${resolvedHospitalId}/follow-ups${search.toString() ? `?${search.toString()}` : ''}`);
      return response.data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, data }: { hospitalId?: number; data: CreateFollowUpRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.post(`/hospitals/${resolvedHospitalId}/follow-ups`, data);
      return response.data as FollowUpData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: followUpKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, followUpId, data }: { hospitalId?: number; followUpId: number; data: UpdateFollowUpRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.put(`/hospitals/${resolvedHospitalId}/follow-ups/${followUpId}`, data);
      return response.data as FollowUpData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: followUpKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, followUpId }: { hospitalId?: number; followUpId: number }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.delete(`/hospitals/${resolvedHospitalId}/follow-ups/${followUpId}`);
      return response.data as { message?: string };
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: followUpKeys.hospital(resolvedHospitalId) });
    },
  });
};


