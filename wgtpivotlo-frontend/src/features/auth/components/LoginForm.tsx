import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../types';
import { useAuth } from '../hook/useAuth';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { loginBody } from '../api';

export const LoginForm = () => {
  const inputClassName = 'text-base font-normal';
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const body: loginBody = {
        username: values.username,
        password: values.password,
      };
      const status = await loginUser(body);
      if (status) {
        toast.success('Logged In Successfully');
        await navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form
            .handleSubmit(onSubmit)()
            .catch((error) => {
              console.error('Form submission error:', error);
            });
        }}
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="flex flex-col gap-3 h-full flex-grow">
          <h1 className="text-center pb-4">Login</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>
                  Username <span className="text-blue-anchor">*</span>
                </FormLabel>
                <FormControl>
                  <Input required className="bg-accent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>
                  Password <span className="text-blue-anchor">*</span>
                </FormLabel>
                <FormControl>
                  <Input required className="bg-accent" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col flex-grow gap-8">
          <Button className={'h-12 text-lg flex-shrink'} type="submit" size={'lg'}>
            Login
          </Button>
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Link to={'/auth/register'} className="text-blue-anchor hover:bg-accent">
              Register Here!
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
