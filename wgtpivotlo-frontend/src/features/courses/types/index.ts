import { SkillDTO } from '@/features/skills/types';
import { PageRequest, PageResponse } from '@/types';

export interface CoursePaginationSkillsRequest extends PageRequest {
  skillId: number;
  careerId: number;
}

export interface CourseDTOPaginated extends PageResponse {
  data: CourseDTO[];
}

export interface CourseWithSkillsDTO {
  courseDTO: CourseDTO;
  skillDTOList: SkillDTO[];
  profiency: string;
}

export interface CourseDTO {
  courseSource: string;
  course_id: number;
  name: string;
  link: string;
  rating: number;
  reviews_counts: number;
  privatcourseSource: string;
  profiency?: string;
}
