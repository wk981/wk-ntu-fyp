import { useQuery } from '@tanstack/react-query';
import { getCourseHistory } from '../api';

export const useCourseHistory = () => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['course-history'],
    queryFn: () => getCourseHistory(),
  });
  return {
    courseHistoryData: data,
    isCourseHistoryLoading: isLoading,
    isCourseHistorySuccess: isSuccess,
  };
};
