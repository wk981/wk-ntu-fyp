import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import {
  CourseDTOPaginated,
  CoursePaginationSkillsRequest,
  CourseWithSkillsDTO,
  EditCourseStatusRequestDTO,
} from '../types';

export const getCourseById = async (course_id: number) => {
  const url = backendURL + `/v1/course-skill-association/courses/${course_id}`;
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

export const getCoursePaginationBasedOnSkillId = async ({
  skillId,
  careerId,
  pageNumber,
}: CoursePaginationSkillsRequest) => {
  const url =
    backendURL +
    `/v1/course-skill-association/courses/timeline?skillId=${skillId}&pageNumber=${pageNumber}&pageSize=5&careerId=${careerId}`;
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

export const postChangeCourseStatus = async ({ courseStatus, courseId }: EditCourseStatusRequestDTO) => {
  const url = backendURL + '/v1/course-skill-association/courses/change-status';
  const body = JSON.stringify({
    courseStatus: courseStatus,
    courseId: courseId,
  });
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: body,
  });

  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<string>;
  return json;
};
