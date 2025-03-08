import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditCareerProps } from '../types';
import { editCareer } from '../api';
import { toast } from 'react-toastify';

export const useEditCareer = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: EditCareerProps) => {
      return editCareer(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['career-pagination'] });
      toast.success('Career successfully edited');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to edit career');
    },
  });
  return {
    isEditingCareer: isPending,
    mutateEditCareerAsync: mutateAsync,
  };
};
