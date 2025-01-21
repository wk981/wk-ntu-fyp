import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useEffect, useRef } from 'react';

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
          // Use href to navigate after logout
          window.location.href = '/auth/login';
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
      performLogout().catch((error) => console.log(error));
      ref.current = true;
    }
  }, [logoutUser]);

  if (isPending) {
    return <LoadingSpinner />;
  } else {
    return null;
  }
};
