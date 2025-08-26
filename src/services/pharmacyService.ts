import api from '../utils/api';

// Upload pharmacy logo
export const uploadPharmacyLogo = async (logo: File): Promise<{ logo_image: string }> => {
  const formData = new FormData();
  formData.append('logo', logo);
  const response = await api.put('/pharmacies/me/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
