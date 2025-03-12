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
import { useAdminCareer } from '../../hook/useAdminCareer';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CareerTableDialogProps {
  isViewDialogOpen: boolean;
}

export const CareerTableDialog = ({ isViewDialogOpen }: CareerTableDialogProps) => {
  const { setIsViewDialogOpen, selectedCareer, handleEditClick, getLevelColor } = useAdminCareer();
  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      {selectedCareer && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Career Details</DialogTitle>
            <DialogDescription>
              Detailed information about {capitalizeEveryFirstChar(selectedCareer.title)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-bold text-xl">{capitalizeEveryFirstChar(selectedCareer.title)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-black transition-colors`}>
                  {capitalizeEveryFirstChar(selectedCareer.sector)}
                </Badge>
                <Badge variant="secondary" className={getLevelColor(selectedCareer.careerLevel)}>
                  {capitalizeFirstChar(selectedCareer.careerLevel)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <h4 className="text-sm font-medium text-muted-foreground">Responsibilities</h4>
              <p className="text-sm">{capitalizeFirstChar(selectedCareer.responsibility)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                <p className="text-sm">{format(new Date(selectedCareer.created_on), 'PPP')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="text-sm">{format(new Date(selectedCareer.updated_on), 'PPP')}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleEditClick}>Edit Career</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
