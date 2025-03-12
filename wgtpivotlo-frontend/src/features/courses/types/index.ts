import { SkillDTO } from '@/features/skills/types';
import { PageRequest, PageResponse } from '@/types';
import { z } from 'zod';

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

export interface Course extends CourseDTO {
  created_on: string; // ISO string for date
  updated_on: string; // ISO string for date
}

export interface EditCourseStatusRequestDTO {
  courseStatus: 'In Progress' | 'Completed' | 'Not Done';
  courseId: number;
}

export interface CourseDTOWithStatus {
  courseWithProfiencyDTO: CourseDTO;
  courseStatus: string;
}

export interface CoursePaginationProps extends PageRequest {
  name?: string;
  rating?: string;
  reviewsCounts?: string;
  courseSource?: string;
  ratingOperator?: string;
  reviewCountsOperator?: string;
}

export interface CoursePaginationResponse extends PageResponse {
  data: Course[];
}

export interface CourseBase {
  name: string;
  link: string;
  rating: number;
  reviews_count: number;
  courseSource: string;
}

export type AddCourseProps = CourseBase;

export interface EditCourseProps extends Partial<CourseBase> {
  id: string;
}
export const addCourseSchema = z.object({
  name: z.string().nonempty('Name cannot be empty'),
  link: z.string().nonempty('Link cannot be empty'),
  courseSource: z.string().nonempty('Rating cannot be empty'),
  reviews_count: z.string().min(1, 'Reviews count must be at least 1').nonempty('Reviews cannot be empty'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
});

export const editCourseSchema = addCourseSchema.partial();
