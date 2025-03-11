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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { z } from 'zod';
import { useRef } from 'react';
import { AddCourseProps, addCourseSchema } from '@/features/courses/types';
import { useAdminCourse } from '../../hook/useAdminCourse';
import { useAddCourse } from '@/features/courses/hook/useAddCourse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CareerTableEditDialogProps {
  isAddDialogOpen: boolean;
}

export const CourseTableAddDialog = ({ isAddDialogOpen }: CareerTableEditDialogProps) => {
  const { setIsAddDialogOpen, courseSourceOptions } = useAdminCourse();
  const { mutateAddCourseAsync, isAddingCourse } = useAddCourse();
  // Use a ref to track if we're currently interacting with a ComboBox
  const isInteractingWithComboBox = useRef(false);

  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      name: '',
      courseSource: '',
      link: '',
      rating: 0,
      reviews_count: '0',
    },
  });

  const onSubmit = async (values: z.infer<typeof addCourseSchema>) => {
    try {
      const body: AddCourseProps = {
        name: values.name,
        courseSource: values.courseSource,
        link: values.link,
        rating: Number(values.rating),
        reviews_count: Number(values.courseSource),
      };

      await mutateAddCourseAsync(body);
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
        onPointerDownOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[role="combobox"]') || target.closest('[cmdk-root]') || target.closest('[cmdk-item]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>Add a new course to the database</DialogDescription>
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
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Enter course name" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Course Link</FormLabel>
                    <FormControl>
                      <Input id="link" placeholder="https://example.com/course" type="url" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="courseSource"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Course Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseSourceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          id="rating"
                          type="number"
                          {...field}
                          onChange={(event) => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reviews_count"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Reviews Count</FormLabel>
                    <FormControl>
                      <Input id="reviews_count" {...field} />
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
              <Button type="submit" disabled={isAddingCourse}>
                {isAddingCourse ? 'Adding...' : 'Add Course'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
