export interface Skills {
  skillId: number
  name: string
  description: string
  pic: string
  profiency: string
}

export interface SkillsAbstract {
  skillId: number
  profiency: string
}

interface Career {
  careerId: number
  title: string
  sector: string
  responsibility: string
  careerLevel: string
  pic_url: string
}

interface CareerWithSimilarityScore extends Career {
  averageWeightage: number
}

export interface CareerRecommendationResponse {
  directMaches: CareerWithSimilarityScore[]
  pathwayMatches: CareerWithSimilarityScore[]
  aspirationMatches: CareerWithSimilarityScore[]
}
