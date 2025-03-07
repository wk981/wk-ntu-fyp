import { Career } from '@/features/questionaire/types';
import { skillsWithProfiency } from '@/features/skills/types';
import { PageRequest, PageResponse } from '@/types';

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

export interface PreviewProps extends PreviewListProps {
  category: string;
  onClick: (category: string) => void;
  backButtonOnClick: () => void;
  back?: boolean;
  seeMore?: boolean;
  layout?: 'flex' | 'grid';
  checkedId?: string | null | undefined;
  handleHeartButtonClick?: (id: string) => Promise<void>;
}

export interface PreviewListProps {
  data: CareerWithSimilarityScoreDTO[];
  intersectionAction?: () => void;
  layout?: 'flex' | 'grid';
  checkedId?: string | null | undefined;
  handleHeartButtonClick?: (id: string) => Promise<void>;
}

export interface PreviewItemProps {
  item: CareerWithSimilarityScoreDTO;
  ref?: React.RefObject<HTMLDivElement> | null;
  heartBadgeOnClick?: (id: string) => Promise<void>;
  heartBadgeCheckedId?: string | null;
}

export interface CareerPaginationProps extends PageRequest{
  title?: string
  sector?: string
  careerLevel?: string
}

export interface CareerPaginationResponse extends PageResponse{
  data: Career[]
}