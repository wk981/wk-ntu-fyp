import { LoadingSpinnerWrapper } from '@/components/loading-spinner';
import { CourseItem } from '@/features/courses/components/CourseListItem';
import { useCourseHistory } from '@/features/courses/hook/useCourseHistory';

export const CourseHistory = () => {
  const { courseHistoryData, isCourseHistoryLoading, isCourseHistorySuccess } = useCourseHistory();
  if (isCourseHistoryLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)]">
        <LoadingSpinnerWrapper width={50} height={50}>
          <h1 className="mt-2 text-xl">Fetching course history</h1>
        </LoadingSpinnerWrapper>
      </div>
    );
  } else if (isCourseHistorySuccess && courseHistoryData) {
    return (
      <div className="flex-1 overflow-y-auto w-full">
        {courseHistoryData.map((course, index) => (
          <CourseItem key={index} course={course.courseWithProfiencyDTO} status={course.courseStatus} />
        ))}
      </div>
    );
  }
};
