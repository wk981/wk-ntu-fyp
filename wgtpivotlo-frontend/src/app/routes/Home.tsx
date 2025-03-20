import { useAuth } from '@/features/auth/hook/useAuth';
import { Dashboard } from './Dashboard/Dashboard';
import { Landing } from '@/components/Landing';
import { LoadingSpinner } from '@/components/loading-spinner';
import { BreadcrumbCustom } from '@/components/breadcrumpcustom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { isLoggedIn, meMutation, user } = useAuth();
  const { isPending } = meMutation;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user?.role.some((role) => role === 'ROLE_ADMIN')) {
      void navigate('/admin/careers', { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Landing />;
  }

  return (
    <div className="max-w-[1920px] w-full mx-auto px-4 md:px-6 lg:px-8 py-5">
      <main className="md:space-y-5 space-y-3">
        <BreadcrumbCustom />
        <Dashboard />
      </main>
    </div>
  );
};
