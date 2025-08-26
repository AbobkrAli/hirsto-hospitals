import { Navigate } from 'react-router-dom';

interface PharmacyOnlyRouteProps {
  children: React.ReactNode;
}

const PharmacyOnlyRoute: React.FC<PharmacyOnlyRouteProps> = ({ children }) => {
  const userType = localStorage.getItem('userType');

  // If user is a branch, redirect to branch dashboard
  if (userType === 'branch') {
    return <Navigate to="/dashboard/branch" replace />;
  }

  return <>{children}</>;
};

export default PharmacyOnlyRoute;
