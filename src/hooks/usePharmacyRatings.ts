import { useQuery } from '@tanstack/react-query';
import { getMyPharmacyRatings } from '../services/pharmacyRatingService';

export const usePharmacyRatings = () => {
  return useQuery({
    queryKey: ['pharmacy-ratings'],
    queryFn: getMyPharmacyRatings,
    gcTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
