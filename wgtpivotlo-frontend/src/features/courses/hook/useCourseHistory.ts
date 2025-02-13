import { useQuery } from '@tanstack/react-query';
import { getCourseHistory } from '../api';

export const useCourseHistory = (filter?: string) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['course-history', filter],
    queryFn: () => getCourseHistory(filter),
  });
  return {
    courseHistoryData: data,
    isCourseHistoryLoading: isLoading,
    isCourseHistorySuccess: isSuccess,
  };
};
