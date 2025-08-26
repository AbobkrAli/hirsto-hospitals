import api from '../utils/api';

// Helper function to get the appropriate base URL based on user type
const getOrdersBaseUrl = (): string => {
  const userType = localStorage.getItem('userType');
  if (userType === 'branch') {
    console.log('Using branch orders endpoints: /pharmacy-branches/orders');
    return '/pharmacy-branches/orders';
  }
  console.log('Using pharmacy orders endpoints: /pharmacies/me/orders');
  return '/pharmacies/me/orders';
};

export interface Medicine {
  id: number;
  pharmacy_id: number;
  name: string;
  price: number;
  quantity: number;
  in_stock: boolean;
  active_ingredient: string;
  concentration: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_email: string;
  medicine_id: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  medicine: Medicine;
}

// Get pharmacy's orders for a specific user
export const getPharmacyOrders = async (userEmail: string): Promise<Order[]> => {
  try {
    const baseUrl = getOrdersBaseUrl();
    const response = await api.get(`${baseUrl}/${userEmail}`);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch orders';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get all pharmacy orders (if needed)
export const getAllPharmacyOrders = async (): Promise<Order[]> => {
  try {
    const baseUrl = getOrdersBaseUrl();
    const response = await api.get(baseUrl);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch all orders';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: unknown; message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};
