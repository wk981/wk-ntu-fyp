import { useQuery } from '@tanstack/react-query';
import { exploreCareer } from '../api';

export const useExploreCareer = () => {
  const exploreCareerQuery = useQuery({
    queryKey: ['expolore-career'],
    queryFn: () => exploreCareer(1),
  });
  return {
    isLoading: exploreCareerQuery.isLoading,
    data: exploreCareerQuery.data,
    error: exploreCareerQuery.error,
    isError: exploreCareerQuery.isError,
  };
};
