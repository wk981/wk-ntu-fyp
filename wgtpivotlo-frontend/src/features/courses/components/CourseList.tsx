import { SkillDTO } from '@/features/skills/types';
import { useCourseQueryBySkillPaginated } from '../hook/useCourseQueryBySkillPaginated';
import { CourseDTO } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useInViewPort from '@/hook/useInViewPort';
import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Users } from 'lucide-react';

interface CourseListInterface {
  skill: SkillDTO;
}

interface CourseItemInterface {
  course: CourseDTO;
}

export const CourseList = ({ skill }: CourseListInterface) => {
  const { courses, hasMoreCourses, fetchNextCourses } = useCourseQueryBySkillPaginated(skill.skillId);
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
  }, [isIntersecting]); // Add all necessary dependencies

  return (
    <div>
      {courses &&
        courses.map((course, index) => (
          <CourseItem key={index} ref={courses.length === index + 1 ? elementRef : null} course={course} />
        ))}
    </div>
  );
};

const CourseItem = React.forwardRef<HTMLDivElement, CourseItemInterface>(({ course }, ref) => {
  return (
    <Card className="group hover:shadow-md transition-shadow" ref={ref}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl capitalize">{course.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="bg-secondary/50">
                {course.courseSource}
              </Badge>
            </CardDescription>
          </div>
          <Link
            to={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Visit ${course.name} course on ${course.courseSource}`}
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{new Intl.NumberFormat().format(course.reviews_counts)} reviews</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
