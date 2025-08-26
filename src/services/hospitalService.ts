import api from '../../utils/api';

export interface HospitalRegisterData {
  name: string;
  email: string;
  password: string;
  location?: string;
  phone_number?: string;
  logo?: File | null;
  bio?: string;
}

export const registerHospital = async (data: HospitalRegisterData) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  if (data.location) formData.append('location', data.location);
  if (data.phone_number) formData.append('phone_number', data.phone_number);
  if (data.bio) formData.append('bio', data.bio);
  if (data.logo) formData.append('logo', data.logo);

  const response = await api.post('/hospitals/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
