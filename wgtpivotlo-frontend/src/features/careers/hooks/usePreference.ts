import { useMutation } from '@tanstack/react-query';
import { selectPreference } from '../api';
import { useState } from 'react';
import { ErrorResponse } from '@/types';

export const usePreference = () => {
  const [checkedId, setCheckedId] = useState<string | null>(null);
  const preferenceMutation = useMutation({
    mutationFn: (id: string) => {
      return selectPreference(id);
    },
    onError: (error: ErrorResponse) => {
      // Handle the error globally
      console.error('Error selecting preference:', error.message);
    },
  });

  const handleHeartButtonClick = async (id: string) => {
    try {
      // Await the mutation
      await preferenceMutation.mutateAsync(id);

      // Toggle the checkedId state
      setCheckedId((prevCheckedId) => (id === prevCheckedId ? null : id));
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };
  return { preferenceMutation, checkedId, handleHeartButtonClick };
};
