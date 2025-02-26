import { useAuth } from '@/features/auth/hook/useAuth';
// import { LoadingSpinner } from './loading-spinner';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingSpinnerWrapper } from './loading-spinner';

const PrivateRoute = () => {
  const { meMutation, user } = useAuth();
  const { isPending, error } = meMutation;

  // Show a loading spinner while checking the authentication status
  if (isPending) {
        return (
          <div className="min-h-[calc(100vh-65px)]">
            <LoadingSpinnerWrapper width={50} height={50}>
            </LoadingSpinnerWrapper>
          </div>
    );
  }

  // Redirect to login if the user is not authenticated
  if (error) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user) {
    return <Outlet />;
  }
};

export default PrivateRoute;
