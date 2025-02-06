import { useMutation } from '@tanstack/react-query';
import { EditCourseStatusRequestDTO } from '../types';
import { postChangeCourseStatus } from '../api';
import { toast } from 'react-toastify';

export const useEditCourseProgress = () => {
  const editCourseProgressMutation = useMutation({
    mutationFn: (data: EditCourseStatusRequestDTO) => {
      return postChangeCourseStatus(data);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  return {
    isEditingCourseProgressLoading: editCourseProgressMutation.isPending,
    isEditingCourseProgressSuccess: editCourseProgressMutation.isSuccess,
    isEditingCourseProgressAsyncMutate: editCourseProgressMutation.mutateAsync,
  };
};
