import { loginBody, loginPost, logoutPost, meGet, registerBody, registerPost } from '@/features/auth/api';
import { User } from '@/features/auth/types';
import { Response } from '@/types';
import { ProviderProps } from '@/utils';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export interface AuthContextInterface {
  user: User | undefined;
  isLoggedIn: boolean;
  loginUser: (body: loginBody) => Promise<boolean>;
  registerUser: (body: registerBody) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  logoutMutation: UseMutationResult<void, Error, void, unknown>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const meMutation = useMutation({
    mutationFn: () => {
      return meGet();
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
      const data = await meMutation.mutateAsync();

      // Create the logged-in user object
      const loggedInUser: User = {
        id: data?.id,
        email: data?.email,
        username: data?.username,
        pic: data?.pic,
        role: data?.role,
      };

      // Update state with user data
      setUser(loggedInUser);
      setIsLoggedIn(true);

      // Return true on success
      return true;
    } catch (error) {
      // Handle any errors from either login or fetching user data
      console.log(error);
      const err = error as Response; // Cast error to responseMessage
      toast(err?.message || 'An error occurred'); // Show error message
      return false;
    }
  };

  const registerUser = async (body: registerBody) => {
    try {
      await registerMutation.mutateAsync(body);
      return true;
    } catch (error) {
      // Handle any errors from either login or fetching user data
      console.log(error);
      const err = error as Response; // Cast error to responseMessage
      toast(err?.message || 'An error occurred'); // Show error message
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
  const value = { user, isLoggedIn, loginUser, registerUser, logoutUser, logoutMutation };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
