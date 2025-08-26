import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const usePharmacyLogo = () => {
  return useQuery({
    queryKey: ['pharmacy-logo'],
    queryFn: async () => {
      const { data } = await api.get<{ logo_url: string }>('/pharmacies/me/logo');
      return data.logo_url;
    },
  });
};
