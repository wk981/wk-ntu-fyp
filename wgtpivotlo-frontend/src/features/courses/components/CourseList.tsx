import { SkillDTO } from '@/features/skills/types';
import { useCourseQueryBySkillPaginated } from '../hook/useCourseQueryBySkillPaginated';
import useInViewPort from '@/hook/useInViewPort';
import { useEffect, useRef } from 'react';
import { CourseItem } from './CourseListItem';
import { areSetsEqual } from '@/utils';

interface CourseListInterface {
  skill: SkillDTO;
  careerId: number;
  skillLevelFilter?: string;
  setAvailableDifficulties: React.Dispatch<React.SetStateAction<Set<string>>>;
}
export const CourseList = ({ skill, careerId, skillLevelFilter, setAvailableDifficulties }: CourseListInterface) => {
  const { courses, hasMoreCourses, fetchNextCourses, availableFilters } = useCourseQueryBySkillPaginated({
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

  useEffect(() => {
    if (availableFilters && availableFilters.length > 0) {
      console.log(availableFilters);
      setAvailableDifficulties((prev) => {
        const newSet = new Set(availableFilters);
        return areSetsEqual(prev, newSet) ? prev : newSet;
      });
    }
  }, [availableFilters]);

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-150px)] w-full">
      {courses &&
        courses.map((course, index) => (
          <CourseItem key={index} ref={courses.length === index + 1 ? elementRef : null} course={course} />
        ))}
    </div>
  );
};
