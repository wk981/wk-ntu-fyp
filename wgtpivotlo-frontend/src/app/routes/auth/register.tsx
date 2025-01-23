import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={'/'} replace />;
  }
  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-auto px-4 sm:py-12 py-4 flex justify-center">
      <div className="border-gray-300 py-10 px-6 md:p-12 rounded-xl w-[32rem] max-h-[44rem] h-auto bg-white mx-auto drop-shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
};
