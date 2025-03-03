import { useMutation } from '@tanstack/react-query';
import {
  CareerWithSimilarityScoreDTO,
  categoryMap,
  ChoiceCareerRecommendationParams,
  ChoiceCareerRecommendationRequest,
} from '../types';
import { choiceCareerRecommendation } from '../api';
import { useEffect, useState } from 'react';
import { FetchChoiceCareerRecommendationParams } from '@/features/questionaire/contexts/QuestionaireProvider';
import { ResultBody } from '@/features/questionaire/api';

interface UseRecommendationCategoryInterface {
  category: string | undefined;
  questionaireFormResults?: ResultBody;
}

export const useRecommendationCategory = ({
  category,
  questionaireFormResults,
}: UseRecommendationCategoryInterface) => {
  const [categoryResult, setCategoryResult] = useState<CareerWithSimilarityScoreDTO[] | undefined>(undefined);
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const choiceCareerRecommendationPostMutation = useMutation({
    mutationFn: ({ data, pageNumber }: ChoiceCareerRecommendationParams) => {
      return choiceCareerRecommendation({ data, pageNumber });
    },
    onError: (error) => {
      // Do something with the error
      console.error('Mutation error:', error);
      // Prevent refetching
      // Optionally reset any affected state
    },
  });

  const fetchChoiceCareerRecommendation = async ({
    category,
    pageNumber = 1,
    questionaireFormResults,
  }: FetchChoiceCareerRecommendationParams) => {
    try {
      if (totalPage && totalPage <= pageNumber) {
        setHasMore(false);
        return;
      }
      const data: ChoiceCareerRecommendationRequest = {
        type: categoryMap[category],
      };

      if (category && categoryMap[category]) {
        data.type = categoryMap[category];
      }

      if (questionaireFormResults !== undefined && category) {
        data.careerLevel = questionaireFormResults?.careerLevel;
        data.sector = questionaireFormResults?.sector;
      }

      const body = {
        data: data,
        pageNumber: pageNumber,
      };
      const response = await choiceCareerRecommendationPostMutation.mutateAsync(body);

      if (response) {
        setCategoryResult((prevState) => {
          const prevItems = prevState || [];
          const newItems = Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : [];
          // Filter out items that are already in the state (based on a unique id)
          const filteredNewItems = newItems.filter(
            (newItem) => !prevItems.some((prevItem) => prevItem.career.careerId === newItem.career.careerId)
          );
          return [...prevItems, ...filteredNewItems];
        });

        // Update totalPage only if it actually changed
        if (response?.totalPage && response.totalPage !== totalPage) {
          setTotalPage(response.totalPage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!category) return;
    if (!hasMore) return;
    // For instance, if you do need to check totalPage here:
    const params = {
      category,
      pageNumber: page,
      questionaireFormResults: questionaireFormResults ?? undefined,
    };
    void fetchChoiceCareerRecommendation(params);
  }, [page, category]);

  return {
    categoryResult,
    setCategoryResult,
    totalPage,
    setTotalPage,
    page,
    setPage,
    choiceCareerRecommendationPostMutation,
    fetchChoiceCareerRecommendation,
    isCategoryLoading: choiceCareerRecommendationPostMutation.isPending,
    hasMore,
  };
};
