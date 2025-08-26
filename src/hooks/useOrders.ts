import { useQuery } from '@tanstack/react-query';
import { 
  getPharmacyOrders,
  getAllPharmacyOrders,
  type Order
} from '../services/ordersService';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  pharmacyOrders: (userEmail?: string, userType?: string) => [...orderKeys.all, 'pharmacy', userEmail, userType] as const,
  allPharmacyOrders: (userType?: string) => [...orderKeys.all, 'pharmacy', 'all', userType] as const,
};

// Hook to fetch pharmacy orders for a specific user
export const usePharmacyOrders = (userEmail: string) => {
  const userType = localStorage.getItem('userType') || 'pharmacy';
  
  return useQuery({
    queryKey: orderKeys.pharmacyOrders(userEmail, userType),
    queryFn: async (): Promise<Order[]> => {
      console.log('🔄 Making API call to fetch pharmacy orders for user:', userEmail);
      try {
        const result = await getPharmacyOrders(userEmail);
        console.log('✅ Orders fetched successfully:', result.length, 'orders');
        return result;
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    enabled: !!userEmail, // Only run query if userEmail is provided
  });
};

// Hook to fetch all pharmacy orders
export const useAllPharmacyOrders = () => {
  const userType = localStorage.getItem('userType') || 'pharmacy';
  
  return useQuery({
    queryKey: orderKeys.allPharmacyOrders(userType),
    queryFn: async (): Promise<Order[]> => {
      console.log('🔄 Making API call to fetch all pharmacy orders...');
      try {
        const result = await getAllPharmacyOrders();
        console.log('✅ All orders fetched successfully:', result.length, 'orders');
        return result;
      } catch (error) {
        console.error('❌ Error fetching all orders:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};
