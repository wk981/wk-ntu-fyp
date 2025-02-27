import { loginBody, loginPost, logoutPost, meGet, registerBody, registerPost } from '@/features/auth/api';
import { User } from '@/features/auth/types';
import { Response } from '@/types';
import { ProviderProps } from '@/utils';
import { UseMutateAsyncFunction, useMutation, UseMutationResult } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface AuthContextInterface {
  user: User | undefined;
  isLoggedIn: boolean;
  loginUser: (body: loginBody) => Promise<boolean>;
  registerUser: (body: registerBody) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  logoutMutation: UseMutationResult<void, Error, void, unknown>;
  meMutation: UseMutationResult<User, Error, void, unknown>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isLoginLoading: boolean;
  isRegisteringLoading: boolean;
  getMeAsync: UseMutateAsyncFunction<User, Error, void, unknown>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const meMutation = useMutation({
    mutationFn: meGet, // Directly reference `meGet`
    onError: (error: Error) => {
      console.error('Mutation error:', error.message);
    },
    onSuccess: (data) => {
      // Create the logged-in user object
      const loggedInUser: User = {
        id: data?.id,
        email: data?.email,
        username: data?.username,
        pic: data?.pic,
        role: data?.role,
        isCareerPreferenceSet: data?.isCareerPreferenceSet,
      };

      // Update state with user data
      setUser(loggedInUser);
      setIsLoggedIn(true);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: loginBody) => {
      return loginPost(data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: registerBody) => {
      return registerPost(data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      return logoutPost();
    },
  });

  const loginUser = async (body: loginBody): Promise<boolean> => {
    try {
      // Attempt the login mutation
      await loginMutation.mutateAsync(body);

      // Attempt to fetch user data
      await meMutation.mutateAsync();
      // Return true on success
      return true;
    } catch (error) {
      // Handle any errors from either login or fetching user data
      console.log(error);
      const err = error as Response; // Cast error to responseMessage
      toast.error(err?.message || 'An error occurred'); // Show error message
      return false;
    }
  };

  const registerUser = async (body: registerBody): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync(body);
      return true;
    } catch (error) {
      // Handle any errors from either login or fetching user data
      console.log(error);
      const err = error as Response; // Cast error to responseMessage
      toast.error(err?.message || 'An error occurred'); // Show error message
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(undefined);
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    meMutation.mutate();
  }, []);

  const value = {
    user,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    logoutMutation,
    meMutation,
    setUser,
    isLoginLoading: loginMutation.isPending,
    isRegisteringLoading: registerMutation.isPending,
    getMeAsync: meMutation.mutateAsync,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
