import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated, user } = useAuth0();
  const userRoles: string[] = user?.["https://your-app.com/roles"] || [];
  console.log("Roles del usuario:", userRoles);
  
  // Comprobamos si el usuario tiene al menos uno de los roles requeridos
  const userHasRequiredRole = user && roles.some(role => userRoles.includes(role));
  console.log("Usuario tiene rol requerido:", userHasRequiredRole);
  if (!isAuthenticated || !userHasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
  
};

export default ProtectedRoute;
