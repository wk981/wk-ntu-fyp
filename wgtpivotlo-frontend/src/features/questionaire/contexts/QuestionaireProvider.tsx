import { createContext, useState } from 'react'
import { ProviderProps } from '@/utils'
import { Skills } from '../types'

interface SkillsContext {
  skills: Skills[]
}

const QuestionaireContext = createContext<SkillsContext | undefined>(undefined)

const QuestionaireProvider = ({ children }: ProviderProps) => {
  const [skills, setSkills] = useState<Skills[]>([])
  const [sectors, setSectors] = useState<string[]>([])

  const value = { skills, setSkills, sectors, setSectors }
  return (
    <QuestionaireContext.Provider value={value}>
      {children}
    </QuestionaireContext.Provider>
  )
}

export { QuestionaireContext, QuestionaireProvider }
