import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MedicalTestData {
  id: number;
  hospital_id: number;
  name: string;
  description: string;
  test_type: string;
  department: string;
  cost: number;
  duration_minutes: number;
  preparation_instructions: string;
  fasting_required: boolean;
  fasting_hours: number;
  sample_type: string;
  normal_range: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicalTestRequest {
  name: string;
  description: string;
  test_type: string;
  department: string;
  cost: number;
  duration_minutes: number;
  preparation_instructions: string;
  fasting_required: boolean;
  fasting_hours: number;
  sample_type: string;
  normal_range: string;
}

export interface UpdateMedicalTestRequest extends CreateMedicalTestRequest {}

export const medicalTestKeys = {
  all: ['medical-tests'] as const,
  hospital: (hospitalId: number) => [...medicalTestKeys.all, 'hospital', hospitalId] as const,
  list: (
    hospitalId: number,
    params: { test_type?: string | null; department?: string | null; is_active?: boolean | null }
  ) => [...medicalTestKeys.hospital(hospitalId), params.test_type ?? 'all', params.department ?? 'all', params.is_active ?? 'all'] as const,
  bookings: (hospitalId: number) => [...medicalTestKeys.hospital(hospitalId), 'bookings'] as const,
};

export const useHospitalMedicalTests = (
  hospitalId?: number,
  params?: { test_type?: string | null; department?: string | null; is_active?: boolean | null }
) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  const queryParams = params ?? { test_type: null, department: null, is_active: null };
  return useQuery({
    queryKey: medicalTestKeys.list(resolvedHospitalId || 0, queryParams),
    queryFn: async (): Promise<MedicalTestData[]> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const search = new URLSearchParams();
      if (queryParams.test_type) search.set('test_type', String(queryParams.test_type));
      if (queryParams.department) search.set('department', String(queryParams.department));
      if (typeof queryParams.is_active !== 'undefined' && queryParams.is_active !== null) search.set('is_active', String(queryParams.is_active));
      const response = await api.get(`/hospitals/${resolvedHospitalId}/medical-tests${search.toString() ? `?${search.toString()}` : ''}`);
      return response.data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export interface TestBookingData {
  id: number;
  medical_test_id: number;
  hospital_id: number;
  ordering_doctor_id: number;
  patient_email: string;
  patient_name: string;
  patient_phone: string;
  scheduled_date: string;
  status: string;
  urgency_level: string;
  special_instructions: string;
  test_results: string;
  result_values: string;
  result_interpretation: string;
  abnormal_findings: string;
  technician_notes: string;
  report_file_path: string;
  result_date: string;
  insurance_approved: boolean;
  total_cost: number;
  created_at?: string;
  updated_at?: string;
  medical_test?: MedicalTestData;
  ordering_doctor?: {
    id: number; name: string; age: number; email: string; specialization: string; bio: string; phone_number: string; image_url: string; location: string; years_of_experience: number; nationality: string; languages: string; doctor_type: string; is_active: boolean; profile_complete: number; created_at?: string; updated_at?: string;
  };
}

export const useHospitalTestBookings = (hospitalId?: number) => {
  const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
  const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
  return useQuery({
    queryKey: medicalTestKeys.bookings(resolvedHospitalId || 0),
    queryFn: async (): Promise<TestBookingData[]> => {
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.get(`/hospitals/${resolvedHospitalId}/test-bookings`);
      return response.data;
    },
    enabled: !!resolvedHospitalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateMedicalTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, data }: { hospitalId?: number; data: CreateMedicalTestRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.post(`/hospitals/${resolvedHospitalId}/medical-tests`, data);
      return response.data as MedicalTestData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: medicalTestKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useUpdateMedicalTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, testId, data }: { hospitalId?: number; testId: number; data: UpdateMedicalTestRequest }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.put(`/hospitals/${resolvedHospitalId}/medical-tests/${testId}`, data);
      return response.data as MedicalTestData;
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: medicalTestKeys.hospital(resolvedHospitalId) });
    },
  });
};

export const useDeleteMedicalTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hospitalId, testId }: { hospitalId?: number; testId: number }) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = hospitalId ?? hospitalIdLocal;
      if (!resolvedHospitalId) throw new Error('Hospital ID is required');
      const response = await api.delete(`/hospitals/${resolvedHospitalId}/medical-tests/${testId}`);
      return response.data as { message?: string };
    },
    onSuccess: (_data, variables) => {
      const hospitalIdLocal = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
      const resolvedHospitalId = variables.hospitalId ?? hospitalIdLocal;
      if (resolvedHospitalId) queryClient.invalidateQueries({ queryKey: medicalTestKeys.hospital(resolvedHospitalId) });
    },
  });
};


