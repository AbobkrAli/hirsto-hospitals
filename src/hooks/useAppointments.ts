// Stub implementation for useAppointments hook
export const useCreateAvailability = () => {
  return {
    mutateAsync: async (data: any) => {
      // Stub implementation - just return success
      console.log('useCreateAvailability called with:', data);
      return Promise.resolve();
    },
    isPending: false,
  };
};
