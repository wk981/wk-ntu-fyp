import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAdminCareer } from '../../hook/useAdminCareer';

interface CareerTableEditDialogProps {
  isEditDialogOpen: boolean;
}

export const CareerTableEditDialog = ({ isEditDialogOpen }: CareerTableEditDialogProps) => {
  const { setIsEditDialogOpen, editForm, handleEditChange, handleSave } = useAdminCareer();

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      {editForm && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Career</DialogTitle>
            <DialogDescription>Make changes to the career information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input id="title" value={editForm.title} onChange={(e) => handleEditChange('title', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="sector">Sector</label>
                <Select value={editForm.sector} onValueChange={(value) => handleEditChange('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="sales and marketing">Sales and Marketing</SelectItem>
                    <SelectItem value="arts and culture">Arts and Culture</SelectItem>
                    <SelectItem value="public relations">Public Relations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="careerLevel">Career Level</label>
                <Select value={editForm.careerLevel} onValueChange={(value) => handleEditChange('careerLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="responsibility">Responsibilities</label>
              <Textarea
                id="responsibility"
                rows={4}
                value={editForm.responsibility}
                onChange={(e) => handleEditChange('responsibility', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
