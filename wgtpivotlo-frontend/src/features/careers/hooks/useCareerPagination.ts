import { useQuery } from '@tanstack/react-query';
import { CareerPaginationResponse } from '../types';
import { careerPagination } from '../api';

interface CareerPaginationProps {
  title?: string;
  sector?: string;
  careerLevel?: string;
  page: number;
}

export const useCareerPagination = ({ title, sector, careerLevel, page = 1 }: CareerPaginationProps) => {
  const { data, error, isFetching, isError } = useQuery<CareerPaginationResponse, Error>({
    queryKey: ['career-pagination', title, sector, careerLevel, page],
    queryFn: () =>
      careerPagination({
        pageNumber: page,
        title,
        sector,
        careerLevel,
        pageSize: 10,
      }),
    retry: 1,
  });

  return {
    careersData: data?.data ?? [], // The list of items for the current page
    totalPages: data?.totalPage ?? 1, // Total number of pages
    currentPage: data?.pageNumber ?? 1, // Current page
    hasMoreCareerPage: data?.pageNumber && data?.totalPage ? data.pageNumber < data.totalPage : false,
    isFetchingCareerPage: isFetching,
    error,
    isCareerError: isError,
  };
};
