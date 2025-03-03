import { createContext, useState } from 'react';
import { ProviderProps } from '@/utils';
import { CareerRecommendationResponse, Skills } from '../types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ResultBody, resultPost } from '../api';
import { toast } from 'react-toastify';

interface SkillsContext {
  userSkillsList: Skills[];
  setUserSkillsList: React.Dispatch<React.SetStateAction<Skills[]>>;
  resultPostMutation: UseMutationResult<void | CareerRecommendationResponse, Error, ResultBody, unknown>;
  setResults: React.Dispatch<React.SetStateAction<CareerRecommendationResponse | undefined>>;
  results: CareerRecommendationResponse | undefined;
  questionaireFormResults: ResultBody | undefined;
  setQuestionaireFormResults: React.Dispatch<React.SetStateAction<ResultBody | undefined>>;
  isResultLoading: boolean;
  isResulterror: boolean;
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

  const resultPostMutation = useMutation({
    mutationFn: (data: ResultBody): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data);
    },
    onError: (error) => {
      // Do something with the error
      toast.error('Something went wrong with submitting the questionaire, please upload again');
      console.error('Mutation error:', error);
      // Prevent refetching
    },
  });

  const value = {
    userSkillsList,
    setUserSkillsList,
    resultPostMutation,
    setResults,
    results,
    questionaireFormResults,
    setQuestionaireFormResults,
    isResultLoading: resultPostMutation.isPending,
    isResulterror: resultPostMutation.isError,
  };

  return <QuestionaireContext.Provider value={value}>{children}</QuestionaireContext.Provider>;
};

export { QuestionaireContext, QuestionaireProvider };
