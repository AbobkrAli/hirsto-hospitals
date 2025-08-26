import { useQuery } from '@tanstack/react-query';
import { getDoctorHistory, type AppointmentHistory } from '../services/historyService';

// Query keys
export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (doctorId: number, limit: number, skip: number) => [...historyKeys.lists(), doctorId, limit, skip] as const,
};

// Hook to fetch doctor's appointment history
export const useDoctorHistory = (doctorId: number | undefined, limit: number = 50, skip: number = 0) => {
  return useQuery({
    queryKey: historyKeys.list(doctorId || 0, limit, skip),
    queryFn: async (): Promise<AppointmentHistory[]> => {
      console.log('🔄 Making API call to fetch appointment history...');
      try {
        const result = await getDoctorHistory(doctorId!, limit, skip);
        
        // Handle both response formats:
        // 1. { appointments: [...], total: number, limit: number, skip: number }
        // 2. [...] (direct array)
        const appointments = Array.isArray(result) ? result : (result.appointments || []);
        
        console.log('✅ Appointment history fetched successfully:', appointments.length, 'appointments');
        return appointments;
      } catch (error) {
        console.error('❌ Error fetching appointment history:', error);
        throw error;
      }
    },
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
}; 