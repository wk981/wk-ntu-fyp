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
import { useEffect, useRef } from 'react';
import { useAdminCourse } from '../../hook/useAdminCourse';
import { useEditCourse } from '@/features/courses/hook/useEditCourse';
import { editCourseSchema } from '@/features/courses/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CourseTableEditDialogProps {
  isEditDialogOpen: boolean;
}

export const CourseTableEditDialog = ({ isEditDialogOpen }: CourseTableEditDialogProps) => {
  const { setIsEditDialogOpen, selectedCourse, courseSourceOptions } = useAdminCourse();
  const { mutateEditCourseAsync, isEditingCourse } = useEditCourse();
  // Use a ref to track if we're currently interacting with a ComboBox
  const isInteractingWithComboBox = useRef(false);

  const form = useForm<z.infer<typeof editCourseSchema>>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      name: '',
      courseSource: '',
      link: '',
      rating: 0,
      reviews_count: '0',
    },
  });

  // Initialize form with selected career data when dialog opens or selected career changes
  useEffect(() => {
    if (selectedCourse && isEditDialogOpen) {
      form.reset({
        name: selectedCourse.name || '',
        courseSource: selectedCourse.courseSource || '',
        link: selectedCourse.link || '',
        rating: selectedCourse.rating || 0,
        reviews_count: selectedCourse.reviews_counts.toString() || '0',
      });
    }
  }, [selectedCourse, isEditDialogOpen, form]);

  const onSubmit = async (values: z.infer<typeof editCourseSchema>) => {
    try {
      if (selectedCourse) {
        const body = {
          id: selectedCourse.course_id.toString(),
          name: values.name ?? undefined,
          courseSource: values.courseSource ?? undefined,
          link: values.link ?? undefined,
          rating: Number(values.rating),
          reviews_count: Number(values.reviews_count),
        };

        await mutateEditCourseAsync(body);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  // Custom handler for dialog open change
  const handleOpenChange = (open: boolean) => {
    // Only close the dialog if we're not interacting with a ComboBox
    if (!open && !isInteractingWithComboBox.current) {
      setIsEditDialogOpen(false);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleOpenChange}>
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
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Edit an existing course</DialogDescription>
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
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isEditingCourse}>
                {isEditingCourse ? 'Editing...' : 'Edit Course'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
