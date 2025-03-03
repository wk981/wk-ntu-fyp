import { useInfiniteQuery } from '@tanstack/react-query';
import { getCoursePaginationBasedOnSkillId } from '../api';
import { TimelineCouseDTO } from '../types';

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
  const { data, error, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery<TimelineCouseDTO, Error>({
    // Include skillLevelFilter in the query key
    queryKey: ['course-timeline', skillId, skillLevelFilter],
    queryFn: async ({ pageParam = 1 }) =>
      getCoursePaginationBasedOnSkillId({
        skillId,
        careerId,
        pageNumber: Number(pageParam),
        pageSize: 5,
        skillLevelFilter,
      }),
    initialPageParam: 1,
    retry: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageDTO.pageNumber < lastPage.pageDTO.totalPage ? lastPage.pageDTO.pageNumber + 1 : undefined,
  });

  return {
    courses: data?.pages.flatMap((page) => page.pageDTO.data),
    fetchNextCourses: fetchNextPage,
    hasMoreCourses: hasNextPage,
    isFetchingCourses: isFetching,
    error,
    isError,
  };
};
