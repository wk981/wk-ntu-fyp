import { backendURL } from '@/utils';
import { UpdatePasswordRequest, UpdateProfileRequest, User } from '../types';
import { ErrorResponse, Response } from '@/types';

export interface loginBody {
  username: string;
  password: string;
}

export interface registerBody extends loginBody {
  email: string;
}

export const loginPost = async (data: loginBody) => {
  const url = backendURL + '/login';
  const body = {
    username: data.username,
    password: data.password,
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
  const json = response.json() as Promise<Response>;
  return json;
};

export const registerPost = async (data: registerBody) => {
  const url = backendURL + '/register';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<Response>;
  return json;
};

export const meGet = async () => {
  const url = backendURL + '/me';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const json = response.json() as Promise<User>;
  return json;
};

export const logoutPost = async () => {
  const url = backendURL + '/logout';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw new Error(errorMessage); // Throw a new Error with the message
  }
};

export const updateProfile = async ({ userId, newEmail, newUsername }: UpdateProfileRequest) => {
  const url = backendURL + '/v1/user/update-profile';
  const body: UpdateProfileRequest = {
    userId: userId,
    newEmail: newEmail,
    newUsername: newUsername,
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
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const msg = response.text();
  return msg;
};

export const updatePassword = async ({
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword,
}: UpdatePasswordRequest) => {
  const url = backendURL + '/v1/user/update-password';
  const body: UpdatePasswordRequest = {
    userId: userId,
    currentPassword: currentPassword,
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword,
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
    const errorBody: ErrorResponse = (await response.json()) as ErrorResponse; // Parse the error response
    const errorMessage: string = errorBody.message || 'Something went wrong'; // Extract the error message
    throw Error(errorMessage); // Throw a new Error with the message
  }
  const msg = response.text();
  return msg;
};
