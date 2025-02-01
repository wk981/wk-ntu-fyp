import { useMutation } from '@tanstack/react-query';
import {
  CareerWithSimilarityScoreDTO,
  categoryMap,
  ChoiceCareerRecommendationParams,
  ChoiceCareerRecommendationRequest,
} from '../types';
import { choiceCareerRecommendation } from '../api';
import { useState } from 'react';
import { FetchChoiceCareerRecommendationParams } from '@/features/questionaire/contexts/QuestionaireProvider';

export const useRecommendationCategory = () => {
  const [categoryResult, setCategoryResult] = useState<CareerWithSimilarityScoreDTO[] | undefined>(undefined);
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

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
      if (totalPage && totalPage === pageNumber) {
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
        setCategoryResult((prevState) => [
          ...(prevState || []),
          ...(Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : []),
        ]);
        if (!totalPage) {
          setTotalPage(response?.totalPage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    categoryResult,
    setCategoryResult,
    totalPage,
    setTotalPage,
    page,
    setPage,
    choiceCareerRecommendationPostMutation,
    fetchChoiceCareerRecommendation,
  };
};
