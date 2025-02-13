import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import {
  CourseDTOWithStatus,
  CoursePaginationSkillsRequest,
  CourseWithSkillsDTO,
  EditCourseStatusRequestDTO,
  TimelineCouseDTO,
} from '../types';

const courseStatusMap = {
  'In Progress': 'IN_PROGRESS',
  Completed: 'COMPLETED',
  'Not Done': 'NOT_DONE',
} as const; // Makes the object readonly with exact keys;

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
  skillLevelFilter,
}: CoursePaginationSkillsRequest) => {
  let url =
    backendURL +
    `/v1/course-skill-association/courses/timeline?skillId=${skillId}&pageNumber=${pageNumber}&pageSize=5&careerId=${careerId}`;
  if (
    skillLevelFilter !== '' &&
    skillLevelFilter !== 'Show all' &&
    skillLevelFilter !== undefined &&
    skillLevelFilter !== null
  ) {
    url += `&skillLevelFilter=${skillLevelFilter}`;
  }
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
  const json = response.json() as Promise<TimelineCouseDTO>;
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
  const json = response.text();
  return json;
};

export const getCourseHistory = async (filter?: string): Promise<CourseDTOWithStatus[]> => {
  let url = backendURL + '/v1/course-skill-association/courses/history';
  if (filter) {
    const mappedFilter: string = courseStatusMap[filter as keyof typeof courseStatusMap];
    url += `?courseStatus=${mappedFilter}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: CourseDTOWithStatus[] = await response.json();
  return json;
};
