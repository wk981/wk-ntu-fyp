import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../types';
import { useAuth } from '../hook/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BlueAnchorLink } from '@/components/blue-anchor-link';

export const LoginForm = () => {
  const inputClassName = 'text-base font-normal';
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const status = await loginUser(values);
      if (status) {
        toast('Logged In Successfully');
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={inputClassName}>Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password here" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-28">
            <BlueAnchorLink toPath={'/auth/register'} name="Register Here" />
          </div>
        </div>

        <Button type="submit" size={'lg'}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
