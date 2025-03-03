import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { useEditCourseProgress } from '../hook/useEditCourseProgress';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { CourseDTO, EditCourseStatusRequestDTO } from '../types';
import { CourseDialog } from './course-dialog';
import { useCourseQuery } from '../hook/useCourseQuery';
interface CourseItemInterface {
  course: CourseDTO;
  status?: string;
}

export const CourseItem = React.forwardRef<HTMLDivElement, CourseItemInterface>(({ course, status }, ref) => {
  const { courseQuery, courseWithSkills, refetch } = useCourseQuery(course.course_id);
  const [open, setOpen] = useState<boolean>(false);
  const { isEditingCourseProgressAsyncMutate, isEditingCourseProgressLoading } = useEditCourseProgress();
  const handleCardClick = async () => {
    try {
      console.log('button click');
      await refetch();
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectValueChange = async (value: string) => {
    try {
      if (!['In Progress', 'Completed', 'Not Done'].includes(value) && value !== status) {
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
      {isEditingCourseProgressLoading && <LoadingSpinnerComponent />}
      <Card
        className="hover:shadow-md cursor-pointer scale-100 hover:scale-105 transform transition duration-100 z-40"
        ref={ref}
        onClick={() => {
          void handleCardClick();
        }}
      >
        <CardHeader className="space-y-2">
          <div className="flex gap-2 items-center md:items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl capitalize">{course.name}</CardTitle>
              <CardDescription>
                <Badge className="w-[90px]">{course.profiency}</Badge>
                <Badge variant="secondary" className="bg-secondary w-[90px] text-center items-center justify-center">
                  {course.courseSource}
                </Badge>
              </CardDescription>
            </div>
            <div className="w-auto" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <Select
                defaultValue={status}
                onValueChange={(value) => {
                  void handleSelectValueChange(value);
                }}
              >
                <SelectTrigger className="w-auto">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">
                {course.rating.toString() !== 'NaN' ? course.rating.toFixed(1) + '/5' : 'NaN'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {course.reviews_counts.toString() !== 'NaN'
                  ? new Intl.NumberFormat().format(course.reviews_counts)
                  : 'NaN'}{' '}
                reviews
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      {courseWithSkills && (
        <CourseDialog open={open} course={courseWithSkills} onOpenChange={setOpen} isLoading={courseQuery.isLoading} />
      )}
    </>
  );
});
