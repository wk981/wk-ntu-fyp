import { useMutation } from '@tanstack/react-query';
import { UpdatePasswordRequest } from '../types';
import { updatePassword } from '../api';
import { toast } from 'react-toastify';

export const useUpdatePassword = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: UpdatePasswordRequest) => {
      return updatePassword(data);
    },
    onSuccess: () => {
      toast.success('Successfully update password');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
  return {
    isUpdatingPassword: isPending,
    mutateUpdatePasswordAsync: mutateAsync,
  };
};
