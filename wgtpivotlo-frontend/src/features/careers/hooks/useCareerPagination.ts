import { useInfiniteQuery } from '@tanstack/react-query';
import { CareerPaginationResponse } from '../types';
import { careerPagination } from '../api';

interface CareerPaginationProps {
  title?: string;
  sector?: string;
  careerLevel?: string;
  page: number;
}

export const useCareerPagination = ({ title, sector, careerLevel, page = 1 }: CareerPaginationProps) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery<
    CareerPaginationResponse,
    Error
  >({
    queryKey: ['career-pagination', title, sector, careerLevel, page], // ✅ Include page number in queryKey
    queryFn: async () => {
      // console.log("Fetching API with Page Number:", page); // ✅ Log when calling API
      return careerPagination({
        pageNumber: Number(page), // Ensure pageParam is correctly passed
        title,
        sector,
        careerLevel,
        pageSize: 10,
      });
    },
    initialPageParam: page,
    retry: 1,
    getNextPageParam: (lastPage) => (lastPage?.pageNumber < lastPage?.totalPage ? lastPage.pageNumber + 1 : undefined),
  });

  return {
    careersData: data?.pages.flatMap((page) => page.data) ?? [],
    fetchNextCareerPage: fetchNextPage,
    hasMoreCareerPage: hasNextPage,
    isFetchingCareerPage: isFetching,
    error,
    isCareerError: isError,
    totalPages: data?.pages[data.pages.length - 1]?.totalPage ?? 1,
    currentPage: data?.pages[data.pages.length - 1]?.pageNumber ?? 1,
  };
};
