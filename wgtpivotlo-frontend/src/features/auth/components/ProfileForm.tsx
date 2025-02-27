import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { optionalUserEmailFormSchema } from '../types';
import { useEditAccountSettings } from '../hook/useEditAccountSettings';
import { Button } from '@/components/ui/button';

export const ProfileForm = () => {
  const { user, mutateUpdateProfileAsync, getMeAsync } = useEditAccountSettings();
  const form = useForm<z.infer<typeof optionalUserEmailFormSchema>>({
    resolver: zodResolver(optionalUserEmailFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof optionalUserEmailFormSchema>) => {
    try {
      if (user && mutateUpdateProfileAsync) {
        const body = {
          userId: user?.id,
          newEmail: values.email ?? '',
          newUsername: values.username ?? '',
        };
        await mutateUpdateProfileAsync(body);
        await getMeAsync();
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
        className="space-y-6" // Add space between form sections
      >
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your new username" {...field} />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your new email" {...field} />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" disabled={!form.formState.isValid}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
