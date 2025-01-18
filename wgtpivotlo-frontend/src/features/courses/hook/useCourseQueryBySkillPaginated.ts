import { useInfiniteQuery } from '@tanstack/react-query';
import { getCoursePaginationBasedOnSkillId } from '../api';
import { CourseDTOPaginated } from '../types';

export const useCourseQueryBySkillPaginated = (skillId: number) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery<CourseDTOPaginated, Error>({
    queryKey: ['courses', skillId],
    queryFn: async ({ pageParam = 1 }) =>
      getCoursePaginationBasedOnSkillId({
        skillId: skillId,
        pageNumber: Number(pageParam),
        pageSize: 5,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pageNumber < lastPage.totalPage ? lastPage.pageNumber + 1 : undefined;
    },
  });

  return {
    courses: data?.pages.flatMap((page) => page.data), // Flatten pages into a single list of recommended careers
    fetchNextCourses: fetchNextPage, // Trigger fetching the next page of careers
    hasMoreCourses: hasNextPage, // Indicates if there are more pages to fetch
    isFetchingCourses: isFetching, // Indicates if data is currently being fetched
    error: error,
    isError: isError,
  };
};
