import { useQuery } from '@tanstack/react-query';
import { getDoctorById } from '../services/authService';

export interface DoctorData {
  id: number;
  name: string;
  email: string;
  specialization: string;
  phone_number: string;
  age: number;
  bio: string;
  image_url: string;
  location: string;
  years_of_experience: number;
  nationality: string;
  languages: string;
  doctor_type: string;
  is_active: boolean;
  profile_complete: number;
  created_at: string;
  updated_at: string;
  availabilities: Array<{
    id: number;
    doctor_id: number;
    start_time: string;
    end_time: string;
    is_booked: boolean;
    user_email: string | null;
    room_id: string | null;
    user_note: string | null;
    doctor_note: string | null;
  }>;
  ratings: Array<{
    id: number;
    doctor_id: number;
    rating: number;
    comment: string;
    reviewer_name: string;
    created_at: string;
  }>;
}

export const useDoctorData = (doctorId: number | undefined) => {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async (): Promise<DoctorData> => {
      if (!doctorId) throw new Error('Doctor ID is required');
      const doctorData = await getDoctorById(doctorId);
      return doctorData as unknown as DoctorData;
    },
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
  });
}; 