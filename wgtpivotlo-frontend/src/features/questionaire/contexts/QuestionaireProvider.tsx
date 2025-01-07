import { createContext, useEffect, useState } from 'react';
import { ProviderProps } from '@/utils';
import { CareerRecommendationResponse, Skills } from '../types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ResultBody, resultPost } from '../api';
import {
  CareerWithSimilarityScoreDTO,
  categoryMap,
  ChoiceCareerRecommendationParams,
  ChoiceCareerRecommendationRequest,
  ChoiceCareerRecommendationResponse,
} from '@/features/careers/types';
import { choiceCareerRecommendation } from '@/features/careers/api';

interface SkillsContext {
  userSkillsList: Skills[];
  setUserSkillsList: React.Dispatch<React.SetStateAction<Skills[]>>;
  resultPostMutation: UseMutationResult<void | CareerRecommendationResponse, Error, ResultBody, unknown>;
  setResults: React.Dispatch<React.SetStateAction<CareerRecommendationResponse | undefined>>;
  results: CareerRecommendationResponse | undefined;
  questionaireFormResults: ResultBody | undefined;
  setQuestionaireFormResults: React.Dispatch<React.SetStateAction<ResultBody | undefined>>;
  choiceCareerRecommendationPostMutation: UseMutationResult<
    ChoiceCareerRecommendationResponse | undefined,
    Error,
    ChoiceCareerRecommendationParams,
    unknown
  >;
  fetchChoiceCareerRecommendation: ({ category, pageNumber }: FetchChoiceCareerRecommendationParams) => Promise<void>;
  categoryResult: CareerWithSimilarityScoreDTO[] | undefined;
  setCategoryResult: React.Dispatch<React.SetStateAction<CareerWithSimilarityScoreDTO[] | undefined>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface FetchChoiceCareerRecommendationParams {
  category: string;
  pageNumber?: number;
}
const QuestionaireContext = createContext<SkillsContext | undefined>(undefined);

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([]);
  const [results, setResults] = useState<CareerRecommendationResponse | undefined>(undefined);
  const [questionaireFormResults, setQuestionaireFormResults] = useState<ResultBody | undefined>();
  const [categoryResult, setCategoryResult] = useState<CareerWithSimilarityScoreDTO[] | undefined>(undefined);
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const resultPostMutation = useMutation({
    mutationFn: (data: ResultBody): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data);
    },
  });

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
  }: FetchChoiceCareerRecommendationParams) => {
    try {
      if (totalPage && totalPage === pageNumber) {
        return;
      }
      if (questionaireFormResults !== undefined && category) {
        const data: ChoiceCareerRecommendationRequest = {
          careerLevel: questionaireFormResults?.careerLevel,
          sector: questionaireFormResults?.sector,
          type: categoryMap[category],
        };
        const body = {
          data: data,
          pageNumber: pageNumber,
        };
        const response = await choiceCareerRecommendationPostMutation.mutateAsync(body);
        // console.log(response);
        if (response) {
          setCategoryResult((prevState) => [
            ...(prevState || []),
            ...(Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : []),
          ]);
          if (!totalPage) {
            setTotalPage(response?.totalPage);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(categoryResult);
  }, [categoryResult]);

  const value = {
    userSkillsList,
    setUserSkillsList,
    resultPostMutation,
    setResults,
    results,
    choiceCareerRecommendationPostMutation,
    questionaireFormResults,
    setQuestionaireFormResults,
    fetchChoiceCareerRecommendation,
    categoryResult,
    setCategoryResult,
    page,
    setPage,
  };

  return <QuestionaireContext.Provider value={value}>{children}</QuestionaireContext.Provider>;
};

export { QuestionaireContext, QuestionaireProvider };
