// src/components/common/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';

type PrivateRouteProps = {
  children: React.ReactNode;
  allowedUserType: 'passenger' | 'rider' | 'admin' | string[];
};

const PrivateRoute = ({ children, allowedUserType }: PrivateRouteProps) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  const allowedTypes = Array.isArray(allowedUserType) ? allowedUserType : [allowedUserType];
  
  if (!allowedTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'passenger') {
      return <Navigate to="/passenger" />;
    } else if (userType === 'rider') {
      return <Navigate to="/rider" />;
    } else if (userType === 'admin') {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

export default PrivateRoute;