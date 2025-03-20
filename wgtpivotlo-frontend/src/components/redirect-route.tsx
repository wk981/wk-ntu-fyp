import { useAuth } from '@/features/auth/hook/useAuth';
import { LoadingSpinnerWrapper } from './loading-spinner';
import { Navigate, Outlet } from 'react-router-dom';

export const RedirectRoute = () => {
  const { meMutation, user } = useAuth();
  const { isPending: isLoading } = meMutation;

  // Show loading spinner while authentication is in progress
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <LoadingSpinnerWrapper width={50} height={50} />
      </div>
    );
  }

  // Redirect to login if authentication fails
  if (user?.role.some((role) => ['ROLE_ADMIN'].includes(role))) {
    return <Navigate to="/admin/careers" replace />;
  }
  return <Outlet />;
};
