import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { CareerRecommendationResponse, Skills } from '../types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { ResultBody, resultPost } from '../api'
import {
  categoryMap,
  ChoiceCareerRecommendationRequest,
  ChoiceCareerRecommendationResponse,
} from '@/features/careers/types'
import { choiceCareerRecommendation } from '@/features/careers/api'

interface SkillsContext {
  userSkillsList: Skills[]
  setUserSkillsList: React.Dispatch<React.SetStateAction<Skills[]>>
  resultPostMutation: UseMutationResult<
    void | CareerRecommendationResponse,
    Error,
    ResultBody,
    unknown
  >
  setResults: React.Dispatch<
    React.SetStateAction<CareerRecommendationResponse | undefined>
  >
  results: CareerRecommendationResponse | undefined
  choiceCareerRecommendationPostMutation: UseMutationResult<
    ChoiceCareerRecommendationResponse | undefined,
    Error,
    ChoiceCareerRecommendationRequest,
    unknown
  >
  questionaireFormResults: ResultBody | undefined
  setQuestionaireFormResults: React.Dispatch<
    React.SetStateAction<ResultBody | undefined>
  >
  fetchChoiceCareerRecommendation: (
    category: string
  ) => Promise<ChoiceCareerRecommendationResponse | undefined>
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([])
  const [results, setResults] = useState<
    CareerRecommendationResponse | undefined
  >(undefined)
  const [questionaireFormResults, setQuestionaireFormResults] = useState<
    ResultBody | undefined
  >()

  const resultPostMutation = useMutation({
    mutationFn: (
      data: ResultBody
    ): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data)
    },
  })

  const choiceCareerRecommendationPostMutation = useMutation({
    mutationFn: (data: ChoiceCareerRecommendationRequest) => {
      return choiceCareerRecommendation(data)
    },
  })

  const fetchChoiceCareerRecommendation = async (category: string) => {
    try {
      if (questionaireFormResults !== undefined) {
        const body: ChoiceCareerRecommendationRequest = {
          careerLevel: questionaireFormResults?.careerLevel,
          pageNumber: 0,
          pageSize: 10,
          sector: questionaireFormResults?.sector,
          type: categoryMap[category],
        }
        const data =
          await choiceCareerRecommendationPostMutation.mutateAsync(body)
        return data
      }
    } catch (error) {
      console.log(error)
    }
  }

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
  }

  return (
    <QuestionaireContext.Provider value={value}>
      {children}
    </QuestionaireContext.Provider>
  )
}

export { QuestionaireContext, QuestionaireProvider }
