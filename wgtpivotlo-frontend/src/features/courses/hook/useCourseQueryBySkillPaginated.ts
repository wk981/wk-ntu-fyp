import { useInfiniteQuery } from '@tanstack/react-query';
import { getCoursePaginationBasedOnSkillId } from '../api';
import { TimelineCouseDTO } from '../types';
import { useEffect } from 'react';

interface UseCourseQueryBySkillPaginatedProps {
  skillId: number;
  careerId: number;
  skillLevelFilter?: string;
}

export const useCourseQueryBySkillPaginated = ({
  skillId,
  careerId,
  skillLevelFilter,
}: UseCourseQueryBySkillPaginatedProps) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isError, refetch } = useInfiniteQuery<
    TimelineCouseDTO,
    Error
  >({
    queryKey: ['course-timeline', skillId],
    queryFn: async ({ pageParam = 1 }) =>
      getCoursePaginationBasedOnSkillId({
        skillId: skillId,
        careerId: careerId,
        pageNumber: Number(pageParam),
        pageSize: 5,
        skillLevelFilter: skillLevelFilter,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pageDTO.pageNumber < lastPage.pageDTO.totalPage ? lastPage.pageDTO.pageNumber + 1 : undefined;
    },
  });

  const resetToPageZero = () => {
    void refetch(); // Only refetch the first page
  };

  useEffect(() => {
    void resetToPageZero();
  }, [skillLevelFilter]);

  return {
    courses: data?.pages.flatMap((page) => page.pageDTO.data), // Flatten pages into a single list of recommended careers
    fetchNextCourses: fetchNextPage, // Trigger fetching the next page of careers
    hasMoreCourses: hasNextPage, // Indicates if there are more pages to fetch
    isFetchingCourses: isFetching, // Indicates if data is currently being fetched
    error: error,
    isError: isError,
    availableFilters: data?.pages.flatMap((page) => page.availableSkillLevels),
  };
};
