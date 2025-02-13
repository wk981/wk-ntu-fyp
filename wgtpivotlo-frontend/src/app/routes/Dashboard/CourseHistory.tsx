import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { CourseItem } from '@/features/courses/components/CourseListItem';
import { useCourseHistory } from '@/features/courses/hook/useCourseHistory';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const CourseHistory = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [courseStatus, setCourseStatus] = useState<undefined | string>();
  const { courseHistoryData, isCourseHistoryLoading, isCourseHistorySuccess } = useCourseHistory(courseStatus);
  const handleShowFiltersClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowFilters((prev) => !prev);
  };
  const handleValueChange = (value: string) => {
    setCourseStatus(value);
  };
  return (
    <div>
      <>
        <div>
          <Button className="mb-2" variant={'outline'} onClick={handleShowFiltersClick}>
            {!showFilters ? 'Show Filters' : 'Hide Filters'}
          </Button>
          {showFilters && (
            <div className="bg-[#F1F5F9] border-[#E2E8F0] border-2 rounded-lg px-6 py-4 flex flex-col gap-4 my-2">
              <div>
                <label className="font-bold text-sm">Course Difficulty:</label>
                <Select onValueChange={handleValueChange} value={courseStatus}>
                  <SelectTrigger className="w-[200px] bg-white">
                    <SelectValue placeholder="Select a course status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['Not Done', 'In Progress', 'Completed'].map((value) => (
                        <SelectItem value={value} className="px-2 cursor-pointer">
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        {isCourseHistorySuccess && courseHistoryData && (
          <div className="flex-1 overflow-y-auto w-full">
            {courseHistoryData.map((course, index) => (
              <CourseItem key={index} course={course.courseWithProfiencyDTO} status={course.courseStatus} />
            ))}
          </div>
        )}
        {isCourseHistoryLoading && (
          <div className="flex flex-col items-center justify-center my-12">
            <LoadingSpinnerComponent width={40} height={40} />
            <h1 className="mt-2 text-xl">Fetching course history</h1>
          </div>
        )}
        {courseHistoryData?.length === 0 && (
          <div className="flex flex-col items-center justify-center my-12">
            <h1 className="mt-2 text-xl">No course found</h1>
          </div>
        )}
      </>
    </div>
  );
};
