import { useInfiniteQuery } from '@tanstack/react-query';
import { ChoiceCareerRecommendationRequest, ChoiceCareerRecommendationResponse } from '../types';
import { choiceCareerRecommendation } from '../api';

export const useRecommendationCategory = (search_query: ChoiceCareerRecommendationRequest) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery<
    ChoiceCareerRecommendationResponse,
    Error
  >({
    queryKey: ['recommendedCategory', search_query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await choiceCareerRecommendation({
        data: search_query,
        pageNumber: Number(pageParam),
      });

      // Ensure the response is valid
      if (!response) {
        throw new Error('Failed to fetch data');
      }

      return response; // Now guaranteed to match ChoiceCareerRecommendationResponse
    },
    initialPageParam: 1, // Match the default `pageParam` value in `queryFn`
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1 || null, // Ensure null is returned when no next page
  });

  return {
    recommendedCareers: data?.pages.flatMap((page) => page.data), // Flatten pages into a single list of recommended careers
    fetchNextRecommendedCareers: fetchNextPage, // Trigger fetching the next page of careers
    hasMoreRecommendedCareers: hasNextPage, // Indicates if there are more pages to fetch
    isFetchingRecommendedCareers: isFetching, // Indicates if data is currently being fetched
    error: error,
    isError: isError,
  };
};
