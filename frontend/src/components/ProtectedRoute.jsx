import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getRole, ROLE_ROUTES } from '../utils/auth';

/**
 * ProtectedRoute — wraps dashboard routes.
 *
 * @param {React.ReactNode} children
 * @param {string|null}     requiredRole  FARMER | AGENT | BUYER | ADMIN (or null = any authenticated)
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const role = getRole();
    if (role !== requiredRole) {
      // Redirect to the correct dashboard for their actual role
      const correct = ROLE_ROUTES[role] || '/login';
      return <Navigate to={correct} replace />;
    }
  }

  return children;
}
