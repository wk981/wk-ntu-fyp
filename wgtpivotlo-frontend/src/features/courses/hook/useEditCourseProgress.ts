import { useMutation } from '@tanstack/react-query';
import { EditCourseStatusRequestDTO } from '../types';
import { postChangeCourseStatus } from '../api';

export const useEditCourseProgress = () => {
  const editCourseProgressMutation = useMutation({
    mutationFn: (data: EditCourseStatusRequestDTO) => {
      return postChangeCourseStatus(data);
    },
  });
  return {
    isEditingCourseProgressLoading: editCourseProgressMutation.isPending,
    isEditingCourseProgressSuccess: editCourseProgressMutation.isSuccess,
    isEditingCourseProgressAsyncMutate: editCourseProgressMutation.mutateAsync,
  };
};
