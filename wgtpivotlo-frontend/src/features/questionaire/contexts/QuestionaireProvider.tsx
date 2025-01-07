import { createContext, useState } from 'react';
import { ProviderProps } from '@/utils';
import { CareerRecommendationResponse, Skills } from '../types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ResultBody, resultPost } from '../api';
import {
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
  fetchChoiceCareerRecommendation: ({
    category,
    pageNumber,
  }: FetchChoiceCareerRecommendationParams) => Promise<ChoiceCareerRecommendationResponse | undefined>;
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

  const resultPostMutation = useMutation({
    mutationFn: (data: ResultBody): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data);
    },
  });

  const choiceCareerRecommendationPostMutation = useMutation({
    mutationFn: ({ data, pageNumber }: ChoiceCareerRecommendationParams) => {
      return choiceCareerRecommendation({ data, pageNumber });
    },
  });

  const fetchChoiceCareerRecommendation = async ({
    category,
    pageNumber = 1,
  }: FetchChoiceCareerRecommendationParams) => {
    try {
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
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  };

  return <QuestionaireContext.Provider value={value}>{children}</QuestionaireContext.Provider>;
};

export { QuestionaireContext, QuestionaireProvider };
