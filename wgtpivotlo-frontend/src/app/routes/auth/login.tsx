import { LoadingSpinner } from '@/components/loading-spinner';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const { user, isLoginLoading } = useAuth();
  if (user) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-auto px-4 py-12 flex justify-center">
      <div className="border-gray-300 py-10 px-6 md:p-12 rounded-xl w-[32rem] max-h-[32rem] h-auto bg-white mx-auto drop-shadow-lg">
        <LoginForm />
        {isLoginLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};
