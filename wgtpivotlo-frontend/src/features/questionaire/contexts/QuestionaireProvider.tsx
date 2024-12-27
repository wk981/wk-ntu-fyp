import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { DataProps, Skills } from '../types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getAllSectors } from '../api'

interface SkillsContext {
  userSkillsList: Skills[]
  setUserSkillsList: React.Dispatch<React.SetStateAction<Skills[]>>
  sectorsQuery: UseQueryResult<DataProps[], Error>
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [userSkillsList, setUserSkillsList] = useState<Skills[]>([])
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

  const value = { userSkillsList, setUserSkillsList, sectorsQuery }

  return (
    <QuestionaireContext.Provider value={value}>
      {children}
    </QuestionaireContext.Provider>
  )
}

export { QuestionaireContext, QuestionaireProvider }
