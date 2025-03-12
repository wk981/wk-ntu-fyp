import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminCareer } from '../../hook/useAdminCareer';
import { useDeleteCareer } from '@/features/careers/hooks/useDeleteCareer';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CareerTableDeleteDialogProps {
  isDeleteDiaglogOpen: boolean;
}

export const CareerTableDeleteDialog = ({ isDeleteDiaglogOpen }: CareerTableDeleteDialogProps) => {
  const { setIsDeleteDialogOpen, selectedCareer } = useAdminCareer();
  const { isDeletingCareer, mutateDeleteCareerAsync } = useDeleteCareer();

  const handleDelete = async () => {
    try {
      if (selectedCareer) {
        await mutateDeleteCareerAsync(selectedCareer.careerId);
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
            This action cannot be undone. This will permanently delete the career
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeletingCareer}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeletingCareer}
            onClick={(e) => {
              e.stopPropagation();
              void handleDelete();
            }}
          >
            {isDeletingCareer ? (
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
