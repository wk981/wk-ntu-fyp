import { Career } from '@/features/questionaire/types'
import { skillsWithProfiency } from '@/features/skills/types'
import { PageRequest, PageResponse } from '@/types'

export interface CareerWithSkills extends Career {
  skillsWithProfiency: skillsWithProfiency[]
}

export interface CareerWithSimilarityScoreDTO {
  career: Career
  similarityScore: string
}

export interface ChoiceCareerRecommendationResponse extends PageResponse {
  data: CareerWithSimilarityScoreDTO[]
}

export const categoryMap: { [key: string]: string } = {
  aspiration: 'ASPIRATION',
  pathway: 'PATHWAY',
  direct: 'DIRECT_MATCH',
}

type CategoryType = (typeof categoryMap)[keyof typeof categoryMap]

export interface ChoiceCareerRecommendationRequest extends PageRequest {
  type: CategoryType
  sector: string
  careerLevel: string
}
