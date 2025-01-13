import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';

export const Logout = () => {
  const { logoutUser, logoutMutation } = useAuth();
  const ref = useRef<boolean>();
  const { isPending } = logoutMutation;

  useEffect(() => {
    if (!ref.current) {
      // Call the logout function asynchronously
      const performLogout = async () => {
        try {
          await logoutUser();
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
      performLogout().catch((error) => console.log(error));
      ref.current = true;
    }
  }, [logoutUser]); // Dependency array ensures this runs only once or when logoutUser changes

  if (isPending) {
    return <LoadingSpinner />;
  } else {
    return <Navigate to="/auth/login" replace />; // Redirects to "/dashboard"
  }
};
