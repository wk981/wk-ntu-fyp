import { LoadingSpinner } from '@/components/loading-spinner';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  const { user, isRegisteringLoading } = useAuth();
  if (user) {
    return <Navigate to={'/'} replace />;
  }
  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-auto px-4 py-12 flex justify-center">
      <div className="border-gray-300 pt-10 pb-4 px-6 md:p-12 rounded-xl w-[32rem] max-h-[50rem] min-h-[46rem] h-auto bg-white mx-auto drop-shadow-lg">
        <RegisterForm />
        {isRegisteringLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};
