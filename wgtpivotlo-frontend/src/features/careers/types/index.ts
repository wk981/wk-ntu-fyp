import { Career } from '@/features/questionaire/types'
import { skillsWithProfiency } from '@/features/skills/types'

export interface CareerWithSkills extends Career {
  skillsWithProfiency: skillsWithProfiency[]
}
