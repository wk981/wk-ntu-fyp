import { ProviderProps } from '@/utils';
import { createContext, useEffect, useState } from 'react';
import { QueryObserverResult, RefetchOptions, UseMutateAsyncFunction } from '@tanstack/react-query';
import { UpdatePasswordRequest, UpdateProfileRequest, User } from '../types';
import { useAuth } from '../hook/useAuth';
import { useUpdateProfile } from '../hook/useUpdateProfile';
import { useUpdatePassword } from '../hook/useUpdatePassword';

export interface AccountContextType {
  isLoading: boolean;
  mutateUpdateProfileAsync: UseMutateAsyncFunction<string, Error, UpdateProfileRequest, unknown>;
  user: User | undefined;
  mutateUpdatePasswordAsync: UseMutateAsyncFunction<string, Error, UpdatePasswordRequest, unknown>;
  getMeAsync: (options?: RefetchOptions) => Promise<QueryObserverResult<User, Error>>;
}

export const EditAccountContext = createContext<AccountContextType | undefined>(undefined);

export const EditAccountProvider = ({ children }: ProviderProps) => {
  const { user, getMeAsync } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isUpdatingProfileLoading, mutateUpdateProfileAsync } = useUpdateProfile();
  const { isUpdatingPassword, mutateUpdatePasswordAsync } = useUpdatePassword();

  useEffect(() => {
    setIsLoading(isUpdatingProfileLoading || isUpdatingPassword);
  }, [isUpdatingProfileLoading, isUpdatingPassword]);

  const value = { isLoading, mutateUpdateProfileAsync, user, mutateUpdatePasswordAsync, getMeAsync };

  return <EditAccountContext.Provider value={value}>{children}</EditAccountContext.Provider>;
};
