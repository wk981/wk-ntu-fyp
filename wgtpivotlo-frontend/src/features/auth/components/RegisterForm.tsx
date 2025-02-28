import { registerFormSchema } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hook/useAuth';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const inputClassName = 'text-base font-normal';
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const body = {
        username: values.username,
        password: values.password,
        email: values.email,
      };
      const status = await registerUser(body);
      console.log(status);
      if (status) {
        toast.success('Registered Successfully');
        await navigate('/auth/login');
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
        className="w-full h-full flex flex-col gap-16 justify-between"
      >
        <div className="flex flex-col gap-3 flex-grow">
          <h1 className="text-center pb-4">Registration</h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>
                  Email <span className="text-blue-anchor">*</span>
                </FormLabel>
                <FormControl>
                  <Input required className="bg-accent" type="email" {...field} />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>
                  Confirm Password <span className="text-blue-anchor">*</span>
                </FormLabel>
                <FormControl>
                  <Input required className="bg-accent" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col h-8 flex-grow gap-8">
          <Button className={'h-12 text-lg flex-shrink'} type="submit" size={'lg'}>
            Sign up
          </Button>
          <p className='text-sm text-center flex-shrink"'>
            Already have an account?{' '}
            <Link to={'/auth/login'} className="text-blue-anchor hover:bg-accent">
              Sign in here!
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
