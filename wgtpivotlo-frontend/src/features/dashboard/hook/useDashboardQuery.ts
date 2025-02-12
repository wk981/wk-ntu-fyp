import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api';

export const useDashboardQuery = () => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard(),
  });
  return {
    dashboardData: data,
    isDashboardLoading: isLoading,
    isDashBoardSuccess: isSuccess,
  };
};
