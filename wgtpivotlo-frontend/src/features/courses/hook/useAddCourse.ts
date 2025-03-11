import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AddCourseProps } from '@/features/courses/types';
import { addCourse } from '@/features/courses/api';

export const useAddCourse = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: AddCourseProps) => {
      return addCourse(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['course-pagination'] });
      toast.success('Course successfully added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add course');
    },
  });
  return {
    isAddingCourse: isPending,
    mutateAddCourseAsync: mutateAsync,
  };
};
