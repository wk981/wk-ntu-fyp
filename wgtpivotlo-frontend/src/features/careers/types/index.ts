import { Career } from '@/features/questionaire/types';
import { skillsWithProfiency } from '@/features/skills/types';
import { PageResponse } from '@/types';

export interface CareerWithSkills extends Career {
  skillsWithProfiency: skillsWithProfiency[];
}

export interface CareerWithSimilarityScoreDTO {
  career: Career;
  similarityScore: string;
}

export interface ChoiceCareerRecommendationResponse extends PageResponse {
  data: CareerWithSimilarityScoreDTO[];
}

export const categoryMap: { [key: string]: string } = {
  aspiration: 'ASPIRATION',
  pathway: 'PATHWAY',
  direct: 'DIRECT_MATCH',
  user: 'USER',
  career: 'CAREER',
};

type CategoryType = (typeof categoryMap)[keyof typeof categoryMap];

export interface ChoiceCareerRecommendationRequest {
  type: CategoryType;
  sector?: string;
  careerLevel?: string;
}

export interface ChoiceCareerRecommendationParams {
  data: ChoiceCareerRecommendationRequest;
  pageNumber: number;
}

export interface ExploreCareerResponse {
  career: ChoiceCareerRecommendationResponse;
  user: ChoiceCareerRecommendationResponse;
}
