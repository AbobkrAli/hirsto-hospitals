import { useWindowSize, useLocalStorage, useMedia } from 'react-use';
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

// Hook to track responsive breakpoints
export const useResponsive = () => {
  const windowSize = useWindowSize();
  
  const isMobile = useMedia('(max-width: 768px)');
  const isTablet = useMedia('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMedia('(min-width: 1024px)');
  
  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Hook for sidebar state with localStorage persistence
export const useSidebarState = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const [, setLocalSidebarState] = useLocalStorage('sidebar-open', true);
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    setLocalSidebarState(newState);
  };
  
  return {
    isOpen: sidebarOpen,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
  };
};

// Hook for theme state with localStorage persistence
export const useThemeState = () => {
  const { theme, setTheme } = useAppStore();
  const [, setLocalTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setLocalTheme(newTheme);
  };
  
  return {
    theme,
    toggleTheme,
    setTheme: (newTheme: 'light' | 'dark') => {
      setTheme(newTheme);
      setLocalTheme(newTheme);
    },
  };
};

// Hook for debounced search
export const useDebouncedSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);
  
  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}; 