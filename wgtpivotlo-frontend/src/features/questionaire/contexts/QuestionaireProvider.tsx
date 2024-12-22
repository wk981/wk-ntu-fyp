import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { Skills } from '../types'

interface SkillsContext {
  skills: Skills[]
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [skills, setSkills] = useState<Skills[]>([])
  const value = { skills, setSkills }
  ;<QuestionaireContext.Provider value={value}>
    {children}
  </QuestionaireContext.Provider>
}

export { QuestionaireContext, QuestionaireProvider }
