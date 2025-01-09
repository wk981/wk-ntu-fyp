import { LoginForm } from '@/features/auth/components/LoginForm';

export const Login = () => {
  return (
    <div className="border-gray-300 p-12 rounded-xl md:max-w-[32rem] max-w-full bg-white flex justify-center mx-auto mt-44">
      <LoginForm />
    </div>
  );
};
