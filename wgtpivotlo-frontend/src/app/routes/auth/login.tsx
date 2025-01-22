import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={'/'} replace />;
  }
  return (
    <div className="border-gray-300 p-12 rounded-xl md:max-w-[32rem] max-w-full bg-white flex justify-center mx-auto mt-44">
      <LoginForm />
    </div>
  );
};
