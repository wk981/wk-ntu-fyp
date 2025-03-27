import { loginBody, loginPost, logoutPost, meGet, registerBody, registerPost } from '@/features/auth/api';
import { User } from '@/features/auth/types';
import { Response } from '@/types';
import { ProviderProps } from '@/utils';
import { QueryObserverResult, RefetchOptions, useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface AuthContextInterface {
  user: User | undefined;
  loginUser: (body: loginBody) => Promise<boolean>;
  registerUser: (body: registerBody) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  logoutMutation: UseMutationResult<void, Error, void, unknown>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isLoginLoading: boolean;
  isRegisteringLoading: boolean;
  getMeAsync: (options?: RefetchOptions) => Promise<QueryObserverResult<User, Error>>;
  isMeLoading: boolean;
  isMeError: boolean;
  isMeSuccess: boolean;
  isMeDone: boolean;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isMeDone, setIsMeDone] = useState(false);

  const {
    data,
    isLoading: isMeLoading,
    isError: isMeError,
    isSuccess: isMeSuccess,
    refetch: meRefetch,
  } = useQuery({
    queryKey: ['me'],
    queryFn: meGet,
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Set user in state when query succeeds
  useEffect(() => {
    if (isMeSuccess && data) {
      setUser(data);
      setIsMeDone(true); // Mark auth as done
    }

    if (isMeError) {
      setIsMeDone(true); // Also mark as done in error case
    }
  }, [isMeSuccess, isMeError, data]);

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
      await meRefetch();
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
      setIsMeDone(false);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
    logoutMutation,
    setUser,
    isLoginLoading: loginMutation.isPending,
    isRegisteringLoading: registerMutation.isPending,
    getMeAsync: meRefetch,
    isMeLoading,
    isMeError,
    isMeSuccess,
    isMeDone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
