import { SkillDTO } from '@/features/skills/types';
import { PageRequest, PageResponse } from '@/types';

export interface CoursePaginationSkillsRequest extends PageRequest {
  skillId: number;
  careerId: number;
  skillLevelFilter?: string;
}

export interface CoursePageDTO extends PageResponse {
  data: CourseDTO[];
}

export interface TimelineCouseDTO {
  availableSkillLevels: string[];
  pageDTO: CoursePageDTO;
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

export interface EditCourseStatusRequestDTO {
  courseStatus: 'In Progress' | 'Completed' | 'Not Done';
  courseId: number;
}
