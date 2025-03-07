import { ErrorResponse, Response } from '@/types';
import { backendURL } from '@/utils';
import {
  CareerPaginationProps,
  CareerPaginationResponse,
  CareerWithSkills,
  ChoiceCareerRecommendationParams,
  ChoiceCareerRecommendationResponse,
  ExploreCareerResponse,
} from '../types';
import { Career } from '@/features/questionaire/types';
import { SkillDTO } from '@/features/skills/types';
import { toast } from 'react-toastify';

interface GetCareerResponse {
  career: Career;
  skills?: SkillDTO[];
}

export const getCareer = async (careerId: number) => {
  try {
    const url = backendURL + `/v1/career-skill-association/career/${careerId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
      const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
      throw new Error(errorMessage); // Throw a new Error with the message
    }

    const json = (await response.json()) as CareerWithSkills; // Ensure proper return type
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const choiceCareerRecommendation = async ({ data, pageNumber = 0 }: ChoiceCareerRecommendationParams) => {
  const url = backendURL + `/v1/career-skill-association/career/recommendations`;
  const body = {
    ...data,
    pageNumber: pageNumber,
    pageSize: 9,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }
  const json = (await response.json()) as ChoiceCareerRecommendationResponse;
  return json;
};

export const selectPreference = async (careerId: string): Promise<Response | undefined> => {
  try {
    const url = backendURL + `/v1/career-skill-association/career/preference/${careerId}`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
      const errorMessage = errorBody.message || 'Something went wrong'; // Extract the error message
      throw new Error(errorMessage); // Throw a new Error with the message
    }

    const json = (await response.json()) as Response;
    return json;
  } catch (error) {
    console.error('Error in selectPreference:', error);
    throw error; // Re-throw the error so it can be handled by React Query
  }
};

export const getPreference = async (includeSkills = false): Promise<GetCareerResponse | undefined> => {
  try {
    const url = backendURL + `/v1/career-skill-association/career/preference?includeSkills=${includeSkills}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
      const errorMessage = errorBody.message || 'Something went wrong'; // Extract the error message
      throw new Error(errorMessage); // Throw a new Error with the message
    }

    const json = (await response.json()) as GetCareerResponse;
    return json;
  } catch (error) {
    console.error('Error in selectPreference:', error);
    throw error; // Re-throw the error so it can be handled by React Query
  }
};

export const exploreCareer = async (pageNumber: number) => {
  const url = backendURL + '/v1/career-skill-association/career/recommendation-exploration';
  const body = {
    pageNumber: pageNumber,
    pageSize: 5,
  };
  const response = await fetch(url, {
    method: 'POST',
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
  const json = response.json() as Promise<ExploreCareerResponse>;
  return json;
};

export const careerPagination = async ({
  pageNumber,
  title,
  sector,
  careerLevel,
  pageSize = 10,
}: CareerPaginationProps) => {
  // console.log(pageNumber);
  let url = backendURL + `/v1/career?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (title !== '' && title !== 'show all' && title !== undefined && title !== null) {
    url += `&title=${title}`;
  }
  if (sector !== '' && sector !== 'show all' && sector !== undefined && sector !== null) {
    url += `&sector=${sector}`;
  }
  if (careerLevel !== '' && careerLevel !== 'show all' && careerLevel !== undefined && careerLevel !== null) {
    url += `&careerLevel=${careerLevel}`;
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
      toast.error('No career found');
    }
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<CareerPaginationResponse>;
  return json;
};
