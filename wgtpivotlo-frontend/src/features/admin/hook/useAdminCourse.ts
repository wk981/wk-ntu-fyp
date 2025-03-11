import { useContext } from 'react';
import { AdminCourseContext } from '../context/AdminCourseProvider';

export const useAdminCourse = () => {
  const context = useContext(AdminCourseContext);

  if (!context) {
    throw new Error('useAdminCourse must be used within a AdminCourseContext');
  }
  return context;
};
