import { useQuery } from '@tanstack/react-query';
import { CoursePaginationResponse } from '../types';
import { coursePagination } from '../api';

interface UseCareerPaginationProps {
  name?: string;
  rating?: string;
  reviewsCounts?: string;
  courseSource?: string;
  ratingOperator?: string;
  reviewCountsOperator?: string;
  skillFilters?: string;
  page: number;
}

export const useCoursePagination = ({
  name,
  rating,
  reviewsCounts,
  courseSource,
  ratingOperator,
  reviewCountsOperator,
  page,
  skillFilters,
}: UseCareerPaginationProps) => {
  const { data, error, isFetching, isError } = useQuery<CoursePaginationResponse, Error>({
    queryKey: [
      'course-pagination',
      name,
      rating,
      reviewsCounts,
      courseSource,
      ratingOperator,
      reviewCountsOperator,
      skillFilters,
      page,
    ],
    queryFn: () =>
      coursePagination({
        pageNumber: page,
        name: name,
        courseSource: courseSource,
        rating: rating,
        ratingOperator: ratingOperator,
        reviewsCounts: reviewsCounts,
        reviewCountsOperator: reviewCountsOperator,
        skillFilters,
        pageSize: 10,
      }),
    retry: 1,
  });

  return {
    coursesData: data?.data ?? [], // The list of items for the current page
    totalPages: data?.totalPage ?? 1, // Total number of pages
    currentPage: data?.pageNumber ?? 1, // Current page
    hasMoreCoursePage: data?.pageNumber && data?.totalPage ? data.pageNumber < data.totalPage : false,
    isFetchingCoursePage: isFetching,
    error,
    isCourseError: isError,
  };
};
