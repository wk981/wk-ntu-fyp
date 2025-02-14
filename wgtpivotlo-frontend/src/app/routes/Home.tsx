import { useAuth } from '@/features/auth/hook/useAuth';
import { Dashboard } from './Dashboard/Dashboard';
import { Landing } from '@/components/Landing';
import { LoadingSpinner } from '@/components/loading-spinner';
import { BreadcrumbCustom } from '@/components/breadcrumpcustom';

export const Home = () => {
  const { isLoggedIn, meMutation } = useAuth();
  const { isPending } = meMutation;
  if (isPending) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {isLoggedIn ? (
        <div className="max-w-[1920px] w-full mx-auto px-4 md:px-6 lg:px-8 py-5">
          <main className="md:space-y-5 space-y-3">
            <BreadcrumbCustom />
            <Dashboard />
          </main>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
};
