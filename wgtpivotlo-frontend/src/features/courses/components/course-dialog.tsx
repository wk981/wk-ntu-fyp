import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { capitalizeEveryFirstChar } from '@/utils';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CourseWithSkillsDTO } from '../types';

interface PreviewDialogProps {
  course: CourseWithSkillsDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}
export const CourseDialog = ({ course, onOpenChange, open }: PreviewDialogProps) => {
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
                {capitalizeEveryFirstChar(course.courseDTO.name)}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{capitalizeEveryFirstChar(course.courseDTO.courseSource)}</Badge>
                <Badge variant="secondary">{capitalizeEveryFirstChar(course.profiency)}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-1 mr-1">{course.courseDTO.rating}</span>
                  <span className="text-muted-foreground">
                    ({new Intl.NumberFormat().format(course.courseDTO.reviews_counts)} reviews)
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
              {course.skillDTOList.map((skill) => (
                <div key={skill.skillId} className="flex items-center rounded-md border px-3 py-2 text-sm">
                  {capitalizeEveryFirstChar(skill.name)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <a href={course.courseDTO.link} target="_blank">
            <Button>
              Go to Course
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};
