import { AuthContext, AuthContextInterface } from '@/contexts/AuthProvider';
import { useContext } from 'react';

export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
