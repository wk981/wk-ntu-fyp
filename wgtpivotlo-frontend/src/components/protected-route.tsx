import { useAuth } from '@/features/auth/hook/useAuth';
import { LoadingSpinnerWrapper } from './loading-spinner';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isMeDone } = useAuth();

  if (!isMeDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinnerWrapper />
      </div>
    );
  }

  const isAuthorized = user?.role?.some((role) => allowedRoles.includes(role));

  if (user && isAuthorized) {
    return <Outlet />;
  }

  if (user && !isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/auth/login" replace />;
};
