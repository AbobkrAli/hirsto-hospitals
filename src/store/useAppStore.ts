import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type User } from '../services/authService';

interface AppState {
  // Authentication state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        sidebarOpen: true,
        theme: 'light',
        isLoading: false,

        // Actions
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setTheme: (theme) => set({ theme }),
        setLoading: (isLoading) => set({ isLoading }),
        
        logout: () => set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
        
        login: (user, token) => set({
          user,
          token,
          isAuthenticated: true,
        }),
        
        updateUser: (userData) => set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      }),
      {
        name: 'histro-app-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
        }),
      }
    ),
    { name: 'histro-app-store' }
  )
); 