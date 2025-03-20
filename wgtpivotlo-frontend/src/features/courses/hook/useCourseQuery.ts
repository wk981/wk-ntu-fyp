import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../api';
import { CourseWithSkillsDTO } from '../types';
import { useEffect, useState } from 'react';

export const useCourseQuery = (id: number | null) => {
  const [courseWithSkills, setCourseWithSkills] = useState<CourseWithSkillsDTO | undefined>();

  const courseQuery = useQuery({
    queryKey: ['course', id],
    queryFn: () => {
      if (id) {
        return getCourseById(id);
      }
    },
    enabled: false, // Disable automatic query execution
  });

  useEffect(() => {
    if (courseQuery.isSuccess) {
      setCourseWithSkills(courseQuery.data);
    }
  }, [courseQuery]);

  return { courseWithSkills, courseQuery, refetch: courseQuery.refetch };
};
