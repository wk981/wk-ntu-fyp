import { ErrorResponse } from '@/types';
import { backendURL } from '@/utils';
import { DashboardDTOResponse } from '../types';

export const getDashboard = async () => {
  const url = backendURL + '/v1/dashboard';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }
  const json = (await response.json()) as DashboardDTOResponse; // Ensure proper return type
  return json;
};
