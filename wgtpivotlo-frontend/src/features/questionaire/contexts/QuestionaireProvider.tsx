import { createContext, useState } from 'react';
import { ProviderProps } from '@/utils';
import { CareerRecommendationResponse, Skills } from '../types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ResultBody, resultPost } from '../api';
import {
  CareerWithSimilarityScoreDTO,
  ChoiceCareerRecommendationParams,
  ChoiceCareerRecommendationResponse,
} from '@/features/careers/types';
import { useRecommendationCategory } from '@/features/careers/hooks/useRecommendationCategory';

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
  questionaireFormResults?: ResultBody;
}
const QuestionaireContext = createContext<SkillsContext | undefined>(undefined);

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([]);
  const [results, setResults] = useState<CareerRecommendationResponse | undefined>(undefined);
  const [questionaireFormResults, setQuestionaireFormResults] = useState<ResultBody | undefined>();
  const {
    categoryResult,
    setCategoryResult,
    page,
    setPage,
    choiceCareerRecommendationPostMutation,
    fetchChoiceCareerRecommendation,
  } = useRecommendationCategory();

  const resultPostMutation = useMutation({
    mutationFn: (data: ResultBody): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data);
    },
  });

  const value = {
    userSkillsList,
    setUserSkillsList,
    resultPostMutation,
    setResults,
    results,
    choiceCareerRecommendationPostMutation,
    questionaireFormResults,
    setQuestionaireFormResults,
    categoryResult,
    setCategoryResult,
    page,
    setPage,
    fetchChoiceCareerRecommendation,
  };

  return <QuestionaireContext.Provider value={value}>{children}</QuestionaireContext.Provider>;
};

export { QuestionaireContext, QuestionaireProvider };
