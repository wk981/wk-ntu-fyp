import { ErrorResponse, PageRequest } from '@/types';
import { backendURL } from '@/utils';
import { CareerRecommendationResponse } from '../types';
import { SkillDTO } from '@/features/skills/types';

export interface ResultBody extends PageRequest {
  sector: string;
  careerLevel: string;
  skillIdWithProfiencyDTOList: {
    skillId: number;
    profiency: string;
  }[];
}

export const getAllSectors = async () => {
  const url = backendURL + '/v1/questionaire/sectors';
  const response = await fetch(url, {
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
  const json = response.json() as Promise<string[]>;
  return json;
};

export const resultPost = async (data: ResultBody): Promise<CareerRecommendationResponse | void> => {
  try {
    const url = backendURL + '/v1/questionaire/result';
    const body = {
      ...data,
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
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

    const json = (await response.json()) as CareerRecommendationResponse; // Ensure proper return type
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const uploadResumePost = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = backendURL + '/v1/questionaire/upload';
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }

  const json = (await response.json()) as SkillDTO[];
  return json;
};
