import { Navigate } from 'react-router-dom';
import { usePharmacyData } from '../../hooks/usePharmacyData';

interface ChainPharmacyOnlyRouteProps {
  children: React.ReactNode;
}

const ChainPharmacyOnlyRoute: React.FC<ChainPharmacyOnlyRouteProps> = ({ children }) => {
  const userType = localStorage.getItem('userType');
  const { data: pharmacyData, isLoading } = usePharmacyData();

  // If user is a branch, redirect to branch dashboard
  if (userType === 'branch') {
    return <Navigate to="/dashboard/branch" replace />;
  }

  // Defer rendering children until pharmacy data is loaded, so page-level skeletons show
  if (isLoading) {
    return <></>;
  }

  // If pharmacy is not a chain pharmacy, redirect to main dashboard
  if (pharmacyData && pharmacyData.pharmacy_type !== 'chain') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ChainPharmacyOnlyRoute;
