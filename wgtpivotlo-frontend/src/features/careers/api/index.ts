import { ErrorResponse, Response } from '@/types';
import { backendURL } from '@/utils';
import { CareerWithSkills, ChoiceCareerRecommendationParams, ChoiceCareerRecommendationResponse } from '../types';

interface GetCareerResponse {
  careerId: number;
}

export const getCareer = async (careerId: number) => {
  try {
    const url = backendURL + `/api/v1/career-skill-association/career/${careerId}`;
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
  try {
    const url = backendURL + `/api/v1/career-skill-association/career/recommendations`;
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
  } catch (error) {
    console.log(error);
  }
};

export const selectPreference = async (careerId: string): Promise<Response | undefined> => {
  try {
    const url = backendURL + `/api/v1/career-skill-association/career/preference/${careerId}`;
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

export const getPreference = async (): Promise<GetCareerResponse | undefined> => {
  try {
    const url = backendURL + `/api/v1/career-skill-association/career/preference`;
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
