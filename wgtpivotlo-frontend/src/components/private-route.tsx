import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingSpinnerWrapper } from './loading-spinner';

const PrivateRoute = () => {
  const { meMutation, user } = useAuth();
  const { isPending: isLoading, error } = meMutation;

  // Show loading spinner while authentication is in progress
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <LoadingSpinnerWrapper width={50} height={50} />
      </div>
    );
  }

  // Redirect to login if authentication fails
  if (error || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user) {
    return <Outlet />;
  }

  // Handle cases where user has an unknown role
  return <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
