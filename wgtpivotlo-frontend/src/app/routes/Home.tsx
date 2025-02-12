// import { Landing } from '@/components/Landing';
// import { useAuth } from '@/features/auth/hook/useAuth';
import { Dashboard } from '@/features/dashboard/components/Dashboard';

export const Home = () => {
  // const { isLoggedIn } = useAuth();
  // if (!isLoggedIn) {
  //   return <Landing />;
  // }

  return <Dashboard />;
};
