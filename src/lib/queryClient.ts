import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      detail?: string;
      message?: string;
    };
  };
  message?: string;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        const apiError = error as ApiError;
        // Don't retry for 401/403 errors (authentication issues)
        if (apiError?.response?.status === 401 || apiError?.response?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        // Global error handling for mutations
        const errorMessage = apiError?.response?.data?.detail || 
                            apiError?.response?.data?.message || 
                            apiError?.message || 
                            'An error occurred';
        toast.error(errorMessage);
      },
    },
  },
}); 