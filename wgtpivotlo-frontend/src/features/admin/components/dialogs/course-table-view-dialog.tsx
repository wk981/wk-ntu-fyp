import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAdminCourse } from '../../hook/useAdminCourse';
import { Star } from 'lucide-react';

interface CourseTableDialogProps {
  isViewDialogOpen: boolean;
}

export const CourseTableDialog = ({ isViewDialogOpen }: CourseTableDialogProps) => {
  const { setIsViewDialogOpen, selectedCourse, handleEditClick, getLevelColor } = useAdminCourse();
  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      {selectedCourse && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              Detailed information about {capitalizeEveryFirstChar(selectedCourse.name)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-bold text-xl">{capitalizeEveryFirstChar(selectedCourse.name)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Badge
                    variant="secondary"
                    className={`${getLevelColor(selectedCourse.rating.toString())} transition-colors mr-1`}
                  >
                    {selectedCourse.rating.toFixed(1)}
                  </Badge>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
                <Badge variant="outline">{capitalizeFirstChar(selectedCourse.courseSource)}</Badge>
                <Badge variant="secondary">{selectedCourse.reviews_counts.toLocaleString()} reviews</Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <h4 className="text-sm font-medium text-muted-foreground">Course Link</h4>
              <a
                href={selectedCourse.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {selectedCourse.link}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                <p className="text-sm">{format(new Date(selectedCourse.created_on), 'PPP')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="text-sm">{format(new Date(selectedCourse.updated_on), 'PPP')}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleEditClick}>Edit Course</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
