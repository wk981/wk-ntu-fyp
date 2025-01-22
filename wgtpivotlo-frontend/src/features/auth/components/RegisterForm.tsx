import { registerFormSchema } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlueAnchorLink } from '@/components/blue-anchor-link';
import { useAuth } from '../hook/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
      if (status) {
        toast('Registered Successfully');
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
        className="w-full flex flex-col gap-16 justify-stretch"
      >
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>Username:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username here" {...field} />
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
                <FormLabel className={inputClassName}>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email here" {...field} />
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
                <FormLabel className={inputClassName}>Password:</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="Enter your password here" {...field} />
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
                <FormLabel className={inputClassName}>Confirm Password:</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="Confirm your password here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-28">
            <BlueAnchorLink toPath={'/auth/login'} name="Login Here" />
          </div>
        </div>
        <Button type="submit" size={'lg'}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
