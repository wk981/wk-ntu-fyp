import { SkillDTO } from '@/features/skills/types';
import { useCourseQueryBySkillPaginated } from '../hook/useCourseQueryBySkillPaginated';
import { CourseDTO, EditCourseStatusRequestDTO } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useInViewPort from '@/hook/useInViewPort';
import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Users } from 'lucide-react';
import { useCourseQuery } from '../hook/useCourseQuery';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { capitalizeEveryFirstChar } from '@/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { useEditCourseProgress } from '../hook/useEditCourseProgress';
import { toast } from 'react-toastify';

interface CourseListInterface {
  skill: SkillDTO;
  careerId: number;
}

interface CourseItemInterface {
  course: CourseDTO;
}

interface PreviewDialogProps {
  courseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseList = ({ skill, careerId }: CourseListInterface) => {
  const { courses, hasMoreCourses, fetchNextCourses } = useCourseQueryBySkillPaginated({
    skillId: skill.skillId,
    careerId: careerId,
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
  }, [isIntersecting]); // Add all necessary dependencies

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-100px)] w-full">
      {courses &&
        courses.map((course, index) => (
          <CourseItem key={index} ref={courses.length === index + 1 ? elementRef : null} course={course} />
        ))}
    </div>
  );
};

const CourseItem = React.forwardRef<HTMLDivElement, CourseItemInterface>(({ course }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const { isEditingCourseProgressAsyncMutate, isEditingCourseProgressLoading } = useEditCourseProgress();
  const handleCardClick = () => {
    setOpen(true);
  };
  const handleSelectValueChange = async (value: string) => {
    try {
      if (!['In Progress', 'Completed', 'Not Done'].includes(value)) {
        console.error('Invalid course status:', value);
        return;
      }
      const payload = {
        courseStatus: value as EditCourseStatusRequestDTO['courseStatus'],
        courseId: course.course_id,
      };
      const response = await isEditingCourseProgressAsyncMutate(payload);
      if (response.toLowerCase() === 'success') {
        toast.success('Course status changed successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isEditingCourseProgressLoading && <LoadingSpinner />}
      <Card
        className="group hover:shadow-md cursor-pointer scale-95 hover:scale-100 transform transition duration-100 z-40"
        ref={ref}
      >
        <CardHeader className="space-y-2">
          <div className="flex gap-2 items-center md:items-start justify-between">
            <div className="space-y-2" onClick={handleCardClick}>
              <CardTitle className="text-xl capitalize">{course.name}</CardTitle>
              <CardDescription>
                <Badge className="w-[90px]">{course.profiency}</Badge>
                <Badge variant="secondary" className="bg-secondary w-[90px] text-center items-center justify-center">
                  {course.courseSource}
                </Badge>
              </CardDescription>
            </div>
            <Select
              onValueChange={(value) => {
                void handleSelectValueChange(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Course Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Not Done" className="px-2 cursor-pointer">
                    Not Done
                  </SelectItem>
                  <SelectItem value="In Progress" className="px-2 cursor-pointer">
                    In Progress
                  </SelectItem>
                  <SelectItem value="Completed" className="px-2 cursor-pointer">
                    Completed
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent onClick={handleCardClick}>
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
      <PreviewCourseDialog open={open} courseId={course.course_id} onOpenChange={setOpen} />
    </>
  );
});

const PreviewCourseDialog = ({ courseId, onOpenChange, open }: PreviewDialogProps) => {
  const { getCourse } = useCourseQuery(courseId);
  if (getCourse.isLoading) {
    return <LoadingSpinner />;
  }
  if (getCourse.isSuccess && getCourse.data !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[600px]"
          onClick={(e) => e.stopPropagation()}
          aria-describedby={'course-content'}
        >
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {capitalizeEveryFirstChar(getCourse.data.courseDTO.name)}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{capitalizeEveryFirstChar(getCourse.data.courseDTO.courseSource)}</Badge>
                  <Badge variant="secondary">{capitalizeEveryFirstChar(getCourse.data.profiency)}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="ml-1 mr-1">{getCourse.data.courseDTO.rating}</span>
                    <span className="text-muted-foreground">
                      ({new Intl.NumberFormat().format(getCourse.data.courseDTO.reviews_counts)} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
          <CardContent className="grid gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Key Skills You&apos;ll Learn</h3>
              <div className="grid grid-cols-2 gap-2 overflow-auto h-[200px]">
                {getCourse.data.skillDTOList.map((skill) => (
                  <div key={skill.skillId} className="flex items-center rounded-md border px-3 py-2 text-sm">
                    {capitalizeEveryFirstChar(skill.name)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <a href={getCourse.data.courseDTO.link} target="_blank">
              <Button>
                Go to Course
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardFooter>
        </DialogContent>
      </Dialog>
    );
  }
};
