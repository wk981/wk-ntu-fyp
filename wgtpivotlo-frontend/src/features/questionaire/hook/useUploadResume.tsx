import { useMutation } from '@tanstack/react-query';
import { uploadResumePost } from '../api';

export const useUploadResume = () => {
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => {
      return uploadResumePost(file);
    },
    onError: (error) => {
      // Do something with the error
      console.error('Mutation error:', error);
      // Prevent refetching
    },
  });
  return { uploadResumeMutation };
};
