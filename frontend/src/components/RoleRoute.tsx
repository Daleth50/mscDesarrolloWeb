import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RoleRouteProps = {
  allow: Array<'admin' | 'seller'>;
};

export default function RoleRoute({ allow }: RoleRouteProps) {
  const location = useLocation();
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
