import { useMutation, useQuery } from '@tanstack/react-query';
import { getPreference, selectPreference } from '../api';
import { useEffect, useState } from 'react';
import { ErrorResponse } from '@/types';

export const usePreference = (includeSkills = false) => {
  const getCareerPreference = useQuery({
    queryKey: ['careerPreference'],
    queryFn: () => getPreference(includeSkills),
  });

  const [checkedId, setCheckedId] = useState<string | null | undefined>();

  useEffect(() => {
    if (getCareerPreference.data) {
      setCheckedId(getCareerPreference.data.career.careerId.toString());
    }
  }, [getCareerPreference.data]);

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
      console.log('Heart button clicked');
      // Await the mutation
      await preferenceMutation.mutateAsync(id);

      // Toggle the checkedId state
      setCheckedId((prevCheckedId) => (id === prevCheckedId ? null : id));
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };
  return { preferenceMutation, getCareerPreference, checkedId, handleHeartButtonClick };
};
