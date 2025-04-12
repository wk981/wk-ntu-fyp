import { SkillDTO } from '@/features/skills/types';
import { useCourseQueryBySkillPaginated } from '../hook/useCourseQueryBySkillPaginated';
import useInViewPort from '@/hook/useInViewPort';
import { useEffect, useRef } from 'react';
import { CourseItem } from './Course-list-item';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CourseListInterface {
  skill: SkillDTO;
  careerId: number;
  skillLevelFilter?: string;
}
export const CourseList = ({ skill, careerId, skillLevelFilter }: CourseListInterface) => {
  const { courses, hasMoreCourses, fetchNextCourses, isFetchingCourses } = useCourseQueryBySkillPaginated({
    skillId: skill.skillId,
    careerId: careerId,
    skillLevelFilter: skillLevelFilter,
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useInViewPort(elementRef, {
    root: null, // Use the viewport as the root
    rootMargin: '0px', // No margin around the viewport
    threshold: 0.1, // Trigger when 10% of the target is visible
  });

  useEffect(() => {
    if (isIntersecting && hasMoreCourses) {
      void fetchNextCourses(); // Call the function if it exists
    }
  }, [fetchNextCourses, hasMoreCourses, isIntersecting]); // Add all necessary dependencies

  return (
    <ScrollArea className="h-[calc(100vh-350px)] w-full pr-4">
      <div className="space-y-2 px-12 py-2">
        {courses &&
          courses.map((course, index) => (
            <CourseItem key={index} ref={courses.length === index + 1 ? elementRef : null} course={course} />
          ))}
        {isFetchingCourses && (
          <div className="flex items-center w-full justify-center">
            <LoadingSpinnerComponent />
          </div>
        )}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
