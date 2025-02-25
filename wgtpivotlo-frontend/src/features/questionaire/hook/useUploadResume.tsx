import { useMutation } from '@tanstack/react-query';
import { uploadResumePost } from '../api';
import { toast } from 'react-toastify';

export const useUploadResume = () => {
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => {
      return uploadResumePost(file);
    },
    onError: (error) => {
      // Do something with the error
      toast.error('Something went wrong with uploading your file, please upload again');
      console.error('Mutation error:', error);
      // Prevent refetching
    },
  });
  return { uploadResumeMutation };
};
