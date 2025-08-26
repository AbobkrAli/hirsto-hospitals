import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Import components from the new structure
import { DashboardLayout, ProtectedRoute, PharmacyOnlyRoute, ChainPharmacyOnlyRoute } from './components';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardOverview from './pages/DashboardOverview';
import InsuranceCompanies from './pages/InsuranceCompanies';
import Doctors from './pages/Doctors';
import Surgeries from './pages/Surgeries';
import MedicalTests from './pages/MedicalTests';
import FollowUps from './pages/FollowUps';
import { isAuthenticated } from './services/authService';
import { queryClient } from './lib/queryClient';
import './lib/dayjs';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication status on app load
    setIsAuthChecked(true);
  }, []);

  // Show loading or nothing while checking auth
  if (!isAuthChecked) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root: show Home if not authenticated, otherwise redirect to dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                localStorage.getItem('userType') === 'branch' ?
                  <Navigate to="/dashboard/branch" replace /> :
                  <Navigate to="/dashboard" replace />
              ) : (
                <Home />
              )
            }
          />

          {/* Auth Routes - redirect to dashboard if already authenticated */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                localStorage.getItem('userType') === 'branch' ?
                  <Navigate to="/dashboard/branch" replace /> :
                  <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated() ? (
                localStorage.getItem('userType') === 'branch' ?
                  <Navigate to="/dashboard/branch" replace /> :
                  <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="/dashboard/insurance" element={<InsuranceCompanies />} />
            <Route path="/dashboard/doctors" element={<Doctors />} />
            <Route path="/dashboard/surgeries" element={<Surgeries />} />
            <Route path="/dashboard/medical-tests" element={<MedicalTests />} />
            <Route path="/dashboard/follow-ups" element={<FollowUps />} />
          </Route>
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              color: 'var(--color-primary)',
              border: '1px solid rgba(144, 224, 239, 0.3)',
              borderRadius: '16px',
              padding: '16px 20px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              minWidth: '300px',
              maxWidth: '420px',
            },
            success: {
              style: {
                background: 'rgba(202, 240, 248, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 183, 216, 0.3)',
                color: 'var(--color-accent-2)',
              },
              iconTheme: {
                primary: 'var(--color-accent-2)',
                secondary: 'var(--color-accent-5)',
              },
            },
            error: {
              style: {
                background: 'rgba(254, 242, 242, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fef2f2',
              },
            },
            loading: {
              style: {
                background: 'rgba(202, 240, 248, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 183, 216, 0.3)',
                color: 'var(--color-accent-2)',
              },
              iconTheme: {
                primary: 'var(--color-accent-2)',
                secondary: 'var(--color-accent-5)',
              },
            },
          }}
        />
      </Router>

      {/* React Query Devtools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
