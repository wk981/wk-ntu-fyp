import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import { CourseDTOPaginated, CoursePaginationSkillsRequest, CourseWithSkillsDTO } from '../types';

export const getCourseById = async (course_id: number) => {
  const url = backendURL + `/api/v1/course-skill-association/${course_id}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<CourseWithSkillsDTO>;
  return json;
};

export const getCoursePaginationBasedOnSkillId = async ({ skillId, pageNumber }: CoursePaginationSkillsRequest) => {
  const url =
    backendURL + `/api/v1/course-skill-association/courses?skillId=${skillId}&pageNumber=${pageNumber}&pageSize=5`;
  // console.log(`skillId: ${skillId}, pageNumber: ${pageNumber}`)
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<CourseDTOPaginated>;
  return json;
};
