import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAdminCareer } from '../../hook/useAdminCareer';
import { useForm } from 'react-hook-form';
import { AddCareerProps, addCareerSchema } from '@/features/careers/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ComboBox } from '@/components/combo-box';
import type { z } from 'zod';
import { useRef } from 'react';
import { useAddCareer } from '@/features/careers/hooks/useAddCareer';

interface CareerTableEditDialogProps {
    isAddDialogOpen: boolean;
}

export const CareerTableAddDialog = ({ isAddDialogOpen }: CareerTableEditDialogProps) => {
  const { setIsAddDialogOpen, sectorData, isSectorLoading } = useAdminCareer();
  const { mutateAddCareerAsync, isAddingCareer } = useAddCareer();
  // Use a ref to track if we're currently interacting with a ComboBox
  const isInteractingWithComboBox = useRef(false);

  const form = useForm<z.infer<typeof addCareerSchema>>({
    resolver: zodResolver(addCareerSchema),
    defaultValues: {
      title: '',
      sector: '',
      responsibility: '',
      careerLevel: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof addCareerSchema>) => {
    try {
        const body: AddCareerProps = {
          title: values.title,
          sector: values.sector,
          responsibility: values.responsibility,
          careerLevel: values.careerLevel,
        };

        await mutateAddCareerAsync(body);
        setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error updating career:', error);
    }
  };

  // Custom handler for dialog open change
  const handleOpenChange = (open: boolean) => {
    // Only close the dialog if we're not interacting with a ComboBox
    if (!open && !isInteractingWithComboBox.current) {
        setIsAddDialogOpen(false);
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        // Prevent clicks inside from closing the dialog
        onPointerDownOutside={(e) => {
          // Check if the click is on a ComboBox or its children
          const target = e.target as HTMLElement;
          if (target.closest('[role="combobox"]') || target.closest('[cmdk-root]') || target.closest('[cmdk-item]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Career</DialogTitle>
          <DialogDescription>Add a new career</DialogDescription>
        </DialogHeader>

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
            className="space-y-4"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 relative">
                      <FormLabel>Sector</FormLabel>
                      <FormControl>
                        <ComboBox {...field} data={sectorData} setValue={form.setValue} isLoading={isSectorLoading} />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careerLevel"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 relative">
                      <FormLabel>Career Level</FormLabel>
                      <FormControl>
                        <ComboBox
                          {...field}
                          data={[
                            { label: 'entry level', value: 'entry level' },
                            { label: 'mid level', value: 'mid level' },
                            { label: 'senior Level', value: 'senior level' },
                          ]}
                          setValue={form.setValue}
                          isLoading={false}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="responsibility"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea id="responsibility" rows={4} {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingCareer}>
                {isAddingCareer ? 'Adding...' : 'Add career'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
