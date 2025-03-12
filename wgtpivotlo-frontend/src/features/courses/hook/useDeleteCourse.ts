import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteCourse } from '@/features/courses/api';

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: number) => {
      return deleteCourse(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['course-pagination'] });
      toast.success('Course successfully deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete course');
    },
  });
  return {
    isDeletingCourse: isPending,
    mutateDeleteCourseAsync: mutateAsync,
  };
};
