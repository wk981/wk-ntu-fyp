import { useQuery } from '@tanstack/react-query';
import { getCareer } from '../api';
import { CareerWithSkills } from '../types';
import { useEffect, useState } from 'react';

export const useCareers = (careerId: number | null) => {
  const [careerWithSkills, setCareerWithSkills] = useState<CareerWithSkills | undefined>();

  const careerQuery = useQuery({
    queryKey: ['career', careerId],
    queryFn: () => {
      if (careerId) {
        return getCareer(careerId);
      }
    },
    enabled: false, // Disable automatic query execution
  });

  useEffect(() => {
    if (careerQuery.isSuccess) {
      setCareerWithSkills(careerQuery.data);
    }
  }, [careerQuery]);

  // Create a function to manually trigger the query.

  return { careerQuery, careerWithSkills, refetch: careerQuery.refetch };
};
