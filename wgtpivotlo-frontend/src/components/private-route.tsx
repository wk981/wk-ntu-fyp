import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingSpinnerWrapper } from './loading-spinner';

const PrivateRoute = () => {
  const { meMutation, user } = useAuth();
  const { isPending: isLoading, error } = meMutation;

  // While checking authentication status, show a global spinner.
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <LoadingSpinnerWrapper width={50} height={50} />
      </div>
    );
  }

  // If authentication fails, redirect to login.
  if (error) {
    return <Navigate to="/auth/login" replace />;
  }

  // Once authenticated, render the child routes.
  if (user) {
    return <Outlet />;
  }

  // Optionally, handle the unexpected case where auth state isn't loading, no error, and no user.
  return null;
};

export default PrivateRoute;
