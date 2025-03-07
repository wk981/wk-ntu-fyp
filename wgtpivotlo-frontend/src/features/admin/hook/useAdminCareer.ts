import { useContext } from 'react';
import { AdminCareerContext } from '../context/AdminCareerProvider';

export const useAdminCareer = () => {
  const context = useContext(AdminCareerContext);

  if (!context) {
    throw new Error('useAdminCareer must be used within a AdminCareerContext');
  }
  return context;
};
