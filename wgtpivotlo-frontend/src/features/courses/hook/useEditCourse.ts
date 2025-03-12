import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditCourseProps } from '../types';
import { editCourse } from '../api';
import { toast } from 'react-toastify';

export const useEditCourse = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: EditCourseProps) => {
      return editCourse(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['course-pagination'] });
      toast.success('Course successfully edited');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to edit course');
    },
  });
  return {
    isEditingCourse: isPending,
    mutateEditCourseAsync: mutateAsync,
  };
};
