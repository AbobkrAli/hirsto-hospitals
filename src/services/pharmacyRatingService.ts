import api from '../utils/api';

export interface PharmacyRating {
  id: number;
  pharmacy_id: number;
  user_id: number;
  delivery_speed: number;
  response_speed: number;
  comment: string;
  created_at: string;
}

export const getMyPharmacyRatings = async (): Promise<PharmacyRating[]> => {
  const response = await api.get('/pharmacies/me/ratings');
  return response.data;
};
