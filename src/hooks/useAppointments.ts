import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getDoctorAvailability, 
  createAvailability, 
  deleteAvailability, 
  editAvailability,
  getDoctorRating,
  getDoctorReviews,
  getAuthData,
  getCarePackageAppointments,
  type GetAvailabilityParams, 
  type AvailabilityData, 
  type EditAvailabilityData, 
  type Appointment,
  type CarePackageAppointment
} from '../services/authService';
import dayjs from '../lib/dayjs';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: GetAvailabilityParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  carePackage: ['care-package-appointments'] as const,
};

// Hook to fetch care package appointments
const useCarePackageAppointments = () => {
  const { user } = getAuthData();
  
  return useQuery({
    queryKey: appointmentKeys.carePackage,
    queryFn: async (): Promise<Appointment[]> => {
      console.log('🔄 Making API call to fetch care package appointments...');
      try {
        const result = await getCarePackageAppointments(Number(user?.id) || 0);
        // Transform care package appointments to match Appointment interface
        const transformedResult: Appointment[] = result.map((apt: CarePackageAppointment) => {
          // Convert UTC appointment_datetime to local timezone (Africa/Cairo)
          const utcDateTime = dayjs.utc(apt.appointment_datetime);
          const localStartTime = utcDateTime.tz('Africa/Cairo').toISOString();
          const localEndTime = utcDateTime.tz('Africa/Cairo').add(60, 'minutes').toISOString();
          
          console.log(`📅 Transforming care package appointment ${apt.id}:`);
          console.log(`   UTC: ${apt.appointment_datetime}`);
          console.log(`   Local Start: ${localStartTime}`);
          console.log(`   Local End: ${localEndTime}`);
          
          return {
            ...apt,
            start_time: localStartTime,
            end_time: localEndTime,
            is_booked: true, // Care package appointments are always booked
            is_care_package: true,
            care_package_id: apt.package_id, // Use package_id from API response
            care_package_name: apt.care_package_name || `Package ${apt.package_id}`,
            type: 'booked' as const,
          };
        });
        console.log('✅ Care package appointments fetched successfully:', transformedResult.length, 'appointments');
        return transformedResult;
      } catch (error) {
        console.error('❌ Error fetching care package appointments:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
  });
};

// Base hook to fetch all appointments (30 days) - used internally
const useBaseAppointments = (params?: Partial<GetAvailabilityParams>) => {
  const { user } = getAuthData(); // This line was not in the new_code, but is in the original. Keeping it as is.
  
  // Create stable date parameters to prevent cache misses - extend to include all future appointments
  const stableFromDate = dayjs().tz('Africa/Cairo').startOf('day').toISOString();
  const stableToDate = dayjs().tz('Africa/Cairo').add(1, 'year').endOf('day').toISOString(); // Extended to 1 year to include all future appointments
  
  const defaultParams: GetAvailabilityParams = {
    doctorId: Number(user?.id) || 0,
    fromDate: stableFromDate,
    toDate: stableToDate,
    onlyAvailable: false,
    ...params,
  };

  return useQuery({
    queryKey: appointmentKeys.list(defaultParams),
    queryFn: async (): Promise<Appointment[]> => {
      console.log('🔄 Making API call to fetch appointments...');
      try {
        const result = await getDoctorAvailability(defaultParams); // Changed from getDoctorAvailability to getAppointments
        console.log('✅ Appointments fetched successfully:', result.length, 'appointments');
        return result;
      } catch (error) {
        console.error('❌ Error fetching appointments:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: 2,
    retryDelay: 1000,
  });
};

// Master hook that provides all appointment data from a single source
export const useAppointmentsData = (params?: Partial<GetAvailabilityParams>) => {
  const { data: regularAppointments, ...regularQueryResult } = useBaseAppointments(params);
  const { data: carePackageAppointments, ...carePackageQueryResult } = useCarePackageAppointments();
  
  console.log('🔍 Regular appointments:', regularAppointments?.length || 0);
  console.log('🔍 Care package appointments:', carePackageAppointments?.length || 0);
  
  // Combine regular and care package appointments
  const allAppointments = [
    ...(regularAppointments || []).map(apt => ({ ...apt, is_care_package: false })),
    ...(carePackageAppointments || [])
  ];
  
  console.log('🔍 Combined appointments before sorting:', allAppointments.length);
  console.log('🔍 Combined appointments IDs:', allAppointments.map(apt => ({ id: apt.id, date: apt.start_time, isCarePackage: apt.is_care_package })));
  
  // Sort by start_time
  const appointments = allAppointments.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  
  console.log('🔍 Final appointments after sorting:', appointments.length);
  
  // Separate booked and available appointments
  const bookedAppointments = appointments.filter((apt: Appointment) => apt.is_booked);
  const availableSlots = appointments.filter((apt: Appointment) => !apt.is_booked);
  
  console.log('🔍 Booked appointments:', bookedAppointments.length);
  console.log('🔍 Available slots:', availableSlots.length);
  
  // Filter weekly appointments
  const startOfWeek = dayjs().tz('Africa/Cairo').startOf('week').add(1, 'day'); // Monday
  const endOfWeek = startOfWeek.add(6, 'day'); // Sunday
  
  const weeklyAppointments = appointments.filter((apt: Appointment) => {
    const aptDate = dayjs(apt.start_time).tz('Africa/Cairo');
    return aptDate.isAfter(startOfWeek.subtract(1, 'day')) && aptDate.isBefore(endOfWeek.add(1, 'day'));
  });
  
  // Combine loading and error states
  const isLoading = regularQueryResult.isLoading || carePackageQueryResult.isLoading;
  const error = regularQueryResult.error || carePackageQueryResult.error;
  const isError = regularQueryResult.isError || carePackageQueryResult.isError;
  
  return {
    ...regularQueryResult,
    isLoading,
    error,
    isError,
    // Raw data
    appointments,
    // Separated data
    bookedAppointments,
    availableSlots,
    // Weekly data
    weeklyAppointments,
  };
};

// Legacy hook for backward compatibility - now uses the master hook
export const useAppointments = (params?: Partial<GetAvailabilityParams>) => {
  const { appointments, ...rest } = useAppointmentsData(params);
  return {
    data: appointments,
    ...rest,
  };
};

// Hook to create availability
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AvailabilityData) => createAvailability(data), // This line was not in the new_code, but is in the original. Keeping it as is.
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Availability slot created successfully!');
    },
    onError: (error: unknown) => {
      console.error('❌ Create availability error:', error);
    },
  });
};

// Hook to delete availability
export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availabilityId: number) => deleteAvailability(availabilityId),
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Availability slot deleted successfully!');
    },
    onError: (error: unknown) => {
      console.error('❌ Delete availability error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete availability';
      toast.error(errorMessage);
    },
  });
};

// Hook to edit availability
export const useEditAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ availabilityId, data }: { availabilityId: number; data: EditAvailabilityData }) => 
      editAvailability(availabilityId, data),
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Availability slot updated successfully!');
    },
    onError: (error: unknown) => {
      console.error('❌ Edit availability error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit availability';
      toast.error(errorMessage);
    },
  });
};

// Hook to get separated appointments (booked vs available) - uses master hook
export const useSeparatedAppointments = (params?: Partial<GetAvailabilityParams>) => {
  const { bookedAppointments, availableSlots, ...queryResult } = useAppointmentsData(params);
  
  return {
    ...queryResult,
    bookedAppointments,
    availableSlots,
  };
};

// Hook to get weekly schedule data - uses master hook
export const useWeeklySchedule = () => {
  const { weeklyAppointments, isLoading, error } = useAppointmentsData();
  
  return {
    data: weeklyAppointments,
    isLoading,
    error,
  };
}; 

// Hook for fetching doctor rating
export const useDoctorRating = (doctorId: number | undefined) => {
  return useQuery({
    queryKey: ['doctorRating', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('Doctor ID is required');
      return await getDoctorRating(doctorId);
    },
    enabled: !!doctorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}; 

// Hook for fetching doctor reviews
export const useDoctorReviews = (doctorId: number | undefined) => {
  return useQuery({
    queryKey: ['doctorReviews', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('Doctor ID is required');
      return await getDoctorReviews(doctorId);
    },
    enabled: !!doctorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}; 