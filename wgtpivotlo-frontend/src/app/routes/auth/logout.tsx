import { LoadingSpinnerComponent } from '@/components/loading-spinner';
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

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
      <h1 className="text-4xl font-bold">Logging you out</h1>
      <p className="text-gray-500">Please wait...</p>
      {isPending && <LoadingSpinnerComponent />}
    </div>
  );
};
