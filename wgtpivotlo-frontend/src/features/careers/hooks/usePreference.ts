import { useMutation, useQuery } from '@tanstack/react-query';
import { getPreference, selectPreference } from '../api';
import { useEffect, useState } from 'react';
import { ErrorResponse } from '@/types';
import { useAuth } from '@/features/auth/hook/useAuth';

export const usePreference = (includeSkills = false) => {
  const getCareerPreference = useQuery({
    queryKey: ['careerPreference'],
    queryFn: () => getPreference(includeSkills),
  });

  const [checkedId, setCheckedId] = useState<string | null | undefined>();
  const { setUser, user } = useAuth();

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
      if (id !== checkedId) {
        // Await the mutation
        await preferenceMutation.mutateAsync(id);
        setCheckedId((prevCheckedId) => (id === prevCheckedId ? null : id));
      }

      if (user !== undefined && !user.isCareerPreferenceSet) {
        setUser((prevUser) => {
          if (!prevUser) {
            // If prevUser is undefined, return a valid User object with default values
            return undefined;
          }
          // Return a new object with all required fields from prevUser and the updated field
          return {
            ...prevUser,
            isCareerPreferenceSet: true, // Update only the specific attribute
          };
        });
      }
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };
  return { preferenceMutation, getCareerPreference, checkedId, handleHeartButtonClick };
};
