import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://histro.replit.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access - clear all auth state
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
//       localStorage.removeItem('histro-app-storage'); // Zustand persisted storage
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api; 