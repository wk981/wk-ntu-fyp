import { useMutation } from '@tanstack/react-query';
import { UpdateProfileRequest } from '../types';
import { updateProfile } from '../api';
import { toast } from 'react-toastify';

export const useUpdateProfile = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      return updateProfile(data);
    },
    onSuccess: () => {
      toast.success('Successfully update profile');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
  return {
    isUpdatingProfileLoading: isPending,
    mutateUpdateProfileAsync: mutateAsync,
  };
};
