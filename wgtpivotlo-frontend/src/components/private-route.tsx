import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingSpinnerWrapper } from './loading-spinner';

export const PrivateRoute = () => {
  const { user, isMeDone } = useAuth();

  // While checking auth, show loading spinner
  if (!isMeDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinnerWrapper />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
