import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCareerProps } from '../types';
import { addCareer } from '../api';
import { toast } from 'react-toastify';

export const useAddCareer = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: AddCareerProps) => {
      return addCareer(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['career-pagination'] });
      toast.success('Career successfully added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add career');
    },
  });
  return {
    isAddingCareer: isPending,
    mutateAddCareerAsync: mutateAsync,
  };
};
