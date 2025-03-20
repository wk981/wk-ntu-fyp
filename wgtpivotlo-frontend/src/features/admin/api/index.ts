import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';

interface EditSkillProps {
  skillId: number;
  profiency: string | undefined;
  requestType: 'PUT' | 'DELETE' | 'POST';
}

interface EditCareerSkillProps extends EditSkillProps {
  careerId: number;
}

interface EditCourseSkillProps extends EditSkillProps {
  courseId: number;
}

export const adminModifyingCareerSkill = async ({
  careerId,
  skillId,
  profiency,
  requestType,
}: EditCareerSkillProps) => {
  const body = {
    careerId,
    skillId,
    ...(requestType === 'PUT' || requestType === 'POST' ? { profiency } : {}), // Include only if requestType is "PUT"
  };

  const url = backendURL + `/v1/career-skill-association/`;

  const response = await fetch(url, {
    method: requestType,
    credentials: 'include',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};

export const adminModifyingCourseSkill = async ({
  courseId,
  skillId,
  profiency,
  requestType,
}: EditCourseSkillProps) => {
  const body = {
    courseId,
    skillId,
    ...(requestType === 'PUT' ? { profiency } : {}), // Include only if requestType is "PUT"
  };

  const url = backendURL + `/v1/course-skill-association/`;

  const response = await fetch(url, {
    method: requestType,
    credentials: 'include',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};
