import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import {
  AddCourseProps,
  CourseDTOWithStatus,
  CoursePaginationProps,
  CoursePaginationResponse,
  CoursePaginationSkillsRequest,
  CourseWithSkillsDTO,
  EditCourseProps,
  EditCourseStatusRequestDTO,
  TimelineCouseDTO,
} from '../types';
import { toast } from 'react-toastify';

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
    if (pageNumber == 1) {
      toast.error('No courses found');
    }
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

export const coursePagination = async ({
  pageNumber,
  name,
  rating,
  reviewsCounts,
  courseSource,
  ratingOperator,
  reviewCountsOperator,
  skillFilters,
  pageSize = 10,
}: CoursePaginationProps) => {
  let url = backendURL + `/v1/course?pageNumber=${pageNumber}&pageSize=${pageSize}`;

  // Append the course name if provided and not 'show all'
  if (name && name !== '' && name !== 'show all') {
    url += `&name=${encodeURIComponent(name)}`;
  }

  // Append the course source if provided and not 'show all'
  if (courseSource && courseSource !== '' && courseSource !== 'show all') {
    url += `&courseSource=${encodeURIComponent(courseSource)}`;
  }

  // Append rating operator and rating value if provided and not 'show all'
  if (rating !== undefined && rating !== null && rating !== 'show all') {
    if (ratingOperator && ratingOperator !== '' && ratingOperator !== 'show all') {
      url += `&ratingOperator=${encodeURIComponent(ratingOperator)}`;
    }
    url += `&rating=${rating}`;
  }

  // Append review counts operator and reviewsCounts value if provided and not 'show all'
  if (reviewsCounts !== undefined && reviewsCounts !== null && reviewsCounts !== 'show all') {
    if (reviewCountsOperator && reviewCountsOperator !== '' && reviewCountsOperator !== 'show all') {
      url += `&reviewCountsOperator=${encodeURIComponent(reviewCountsOperator)}`;
    }
    url += `&reviewsCounts=${reviewsCounts}`;
  }

  if (skillFilters !== '' && skillFilters !== undefined && skillFilters !== null) {
    url += `&skillFilters=${skillFilters}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse;
    const errorMessage: string = errorBody.message || 'Something went wrong';
    if (pageNumber === 1) {
      toast.error('No courses found');
    }
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as CoursePaginationResponse;
  return json;
};

export const addCourse = async ({ name, courseSource, link, rating, reviews_count }: AddCourseProps) => {
  const formdata = new FormData();
  const emptyBlob = new Blob([], { type: 'application/octet-stream' });
  formdata.append('thumbnail', emptyBlob, 'empty.png');
  const jsonBlob = new Blob(
    [
      JSON.stringify({
        name: name,
        link: link,
        courseSource: courseSource,
        rating: rating,
        reviews_count: reviews_count,
      }),
    ],
    { type: 'application/json' }
  );
  formdata.append('courseBody', jsonBlob); // Append as JSON Blob
  const url = backendURL + `/v1/course/`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formdata,
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};

export const editCourse = async ({ name, courseSource, link, rating, reviews_count, id }: EditCourseProps) => {
  const formdata = new FormData();
  const emptyBlob = new Blob([], { type: 'application/octet-stream' });
  formdata.append('thumbnail', emptyBlob, 'empty.png');
  const jsonBlob = new Blob(
    [
      JSON.stringify({
        name: name,
        link: link,
        courseSource: courseSource,
        rating: rating,
        reviews_count: reviews_count,
      }),
    ],
    { type: 'application/json' }
  );
  formdata.append('courseBody', jsonBlob); // Append as JSON Blob
  const url = backendURL + `/v1/course/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: formdata,
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};

export const deleteCourse = async (id: number) => {
  const url = backendURL + `/v1/course/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};
