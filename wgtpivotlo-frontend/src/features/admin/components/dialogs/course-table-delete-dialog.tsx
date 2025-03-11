import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminCourse } from '../../hook/useAdminCourse';
import { useDeleteCourse } from '@/features/courses/hook/useDeleteCourse';

interface CourseTableDeleteDialogProps {
  isDeleteDiaglogOpen: boolean;
}

export const CourseTableDeleteDialog = ({ isDeleteDiaglogOpen }: CourseTableDeleteDialogProps) => {
  const { setIsDeleteDialogOpen, selectedCourse } = useAdminCourse();
  const { isDeletingCourse, mutateDeleteCourseAsync } = useDeleteCourse();

  const handleDelete = async () => {
    try {
      if (selectedCourse) {
        await mutateDeleteCourseAsync(selectedCourse.course_id);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog open={isDeleteDiaglogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeletingCourse}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeletingCourse}
            onClick={(e) => {
              e.stopPropagation();
              void handleDelete();
            }}
          >
            {isDeletingCourse ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
