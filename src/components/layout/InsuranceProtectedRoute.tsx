import { Navigate } from 'react-router-dom';
import { usePharmacyData } from '../../hooks/usePharmacyData';

interface InsuranceProtectedRouteProps {
  children: React.ReactNode;
}

const InsuranceProtectedRoute: React.FC<InsuranceProtectedRouteProps> = ({ children }) => {
  const userType = localStorage.getItem('userType');
  const { isLoading } = usePharmacyData();

  // If user is a branch, redirect to branch dashboard
  if (userType === 'branch') {
    return <Navigate to="/dashboard/branch" replace />;
  }

  // Defer rendering children until pharmacy data is loaded, so page-level skeletons show
  if (isLoading) {
    return <></>;
  }

  // For pharmacies, insurance is always available (no restrictions like doctor types)
  return <>{children}</>;
};

export default InsuranceProtectedRoute;
