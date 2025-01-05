import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { CareerRecommendationResponse, Skills } from '../types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { ResultBody, resultPost } from '../api'
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
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([])
  const [results, setResults] = useState<
    CareerRecommendationResponse | undefined
  >(undefined)

  const resultPostMutation = useMutation({
    mutationFn: (
      data: ResultBody
    ): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data)
    },
  })

  const value = {
    userSkillsList,
    setUserSkillsList,
    resultPostMutation,
    setResults,
    results,
  }

  return (
    <QuestionaireContext.Provider value={value}>
      {children}
    </QuestionaireContext.Provider>
  )
}

export { QuestionaireContext, QuestionaireProvider }
