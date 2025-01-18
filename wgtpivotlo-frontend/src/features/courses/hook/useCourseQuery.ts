import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../api';

export const useCourseQuery = (id: number) => {
  const getCourse = useQuery({
    queryKey: ['course'],
    queryFn: () => getCourseById(id),
  });

  return { getCourse };
};
