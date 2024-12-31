import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { CareerRecommendationResponse, DataProps, Skills } from '../types'
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import { getAllSectors, ResultBody, resultPost } from '../api'
import { toast } from 'react-toastify'
import { Response } from '@/types'

interface SkillsContext {
  userSkillsList: Skills[]
  setUserSkillsList: React.Dispatch<React.SetStateAction<Skills[]>>
  sectorsQuery: UseQueryResult<DataProps[], Error>
  resultPostMutation: UseMutationResult<
    void | CareerRecommendationResponse,
    Error,
    ResultBody,
    unknown
  >
  sendQuestionaire: (body: ResultBody) => Promise<void>
  results: CareerRecommendationResponse | undefined
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([])
  const [results, setResults] = useState<CareerRecommendationResponse>()
  // const [sector, setSector] = useState<string[]>([]);

  const sectorsQuery = useQuery({
    queryKey: ['sector'],
    queryFn: () => getAllSectors(),
    select: (data) => {
      const res = data.map((d) => ({
        label: d,
        value: d,
      }))
      return res as DataProps[]
    },
    retry: false,
  })

  const resultPostMutation = useMutation({
    mutationFn: (
      data: ResultBody
    ): Promise<CareerRecommendationResponse | void> => {
      return resultPost(data)
    },
  })

  const sendQuestionaire = async (body: ResultBody) => {
    try {
      await resultPostMutation.mutateAsync(body)
      if (resultPostMutation.isSuccess && resultPostMutation.data) {
        setResults(resultPostMutation.data)
      }
    } catch (error) {
      console.log(error)
      const err = error as Response // Cast error to responseMessage
      toast(err?.message || 'An error occurred') // Show error message
    }
  }

  const value = {
    userSkillsList,
    setUserSkillsList,
    sectorsQuery,
    resultPostMutation,
    sendQuestionaire,
    results,
  }

  return (
    <QuestionaireContext.Provider value={value}>
      {children}
    </QuestionaireContext.Provider>
  )
}

export { QuestionaireContext, QuestionaireProvider }
