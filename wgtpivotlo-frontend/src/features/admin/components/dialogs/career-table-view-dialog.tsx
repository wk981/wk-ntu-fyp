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
import { useCareers } from '@/features/careers/hooks/useCareers';
import { useEffect, useMemo, useState } from 'react';
import { BadgeWithTooltip } from '@/components/BadgeWithPopUpInfo';
import { Edit } from 'lucide-react';
import { EditSkillsDialog } from './edit-skills-dialog';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { EditSkillsDataProps } from '../../types';

interface CareerTableDialogProps {
  isViewDialogOpen: boolean;
}

export const CareerTableDialog = ({ isViewDialogOpen }: CareerTableDialogProps) => {
  const { setIsViewDialogOpen, selectedCareer, handleEditClick, getLevelColor } = useAdminCareer();
  const { careerQuery, careerWithSkills, refetch } = useCareers(selectedCareer?.careerId ?? null);
  const [editIsSkillsDialogOpen, setEditIsSkillsDialogOpen] = useState(false);
  const { isLoading, isError } = careerQuery;

  // Refetch data when the dialog opens
  useEffect(() => {
    if (isViewDialogOpen && selectedCareer) {
      void refetch();
    }
  }, [isViewDialogOpen, selectedCareer, refetch]);

  const [skillsProfiency, setSkillsProfiency] = useState<undefined | EditSkillsDataProps[]>();

  // Memoize the transformed data
  const transformedSkills = useMemo(() => {
    return careerWithSkills?.skillsWithProfiency.map((skill) => ({
      label: skill.name,
      value: String(skill.skillId), // Ensuring it's a string
      profiency: skill.profiency,
      skillId: skill.skillId,
    }));
  }, [careerWithSkills?.skillsWithProfiency]); // Recomputes only when `skills` changes

  // Effect to update state when transformed data changes
  useEffect(() => {
    setSkillsProfiency(transformedSkills);
  }, [transformedSkills]); // Updates when transformedSkills changes

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      {careerWithSkills && (
        <DialogContent className="sm:max-w-[600px]">
          {isLoading && <LoadingSpinnerComponent />}
          {isError && <div>Error loading career data.</div>}
          <DialogHeader>
            <DialogTitle>Career Details</DialogTitle>
            <DialogDescription>
              Detailed information about {capitalizeEveryFirstChar(careerWithSkills.title)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-bold text-xl">{capitalizeEveryFirstChar(careerWithSkills.title)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-black transition-colors`}>
                  {capitalizeEveryFirstChar(careerWithSkills.sector)}
                </Badge>
                <Badge variant="secondary" className={getLevelColor(careerWithSkills.careerLevel)}>
                  {capitalizeFirstChar(careerWithSkills.careerLevel)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <h4 className="text-sm font-medium text-muted-foreground">Responsibilities</h4>
              <p className="text-sm">{capitalizeFirstChar(careerWithSkills.responsibility)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                <p className="text-sm">{format(new Date(careerWithSkills.created_on), 'PPP')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="text-sm">{format(new Date(careerWithSkills.updated_on), 'PPP')}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-muted-foreground">Skills</h4>
                <Edit
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => {
                    setEditIsSkillsDialogOpen(true);
                  }}
                />
              </div>
              {skillsProfiency &&
                skillsProfiency.map((skill, index) => (
                  <BadgeWithTooltip
                    key={index}
                    badgeStyle={{
                      className: 'h-[30px] rounded-full py-2 px-4 mx-1 my-1 text-xs cursor-pointer font-normal',
                    }}
                    text={capitalizeEveryFirstChar(skill.label)}
                    tooltipContent={capitalizeFirstChar(skill.profiency)}
                  />
                ))}
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

      {skillsProfiency && selectedCareer && (
        <EditSkillsDialog
          editIsSkillsDialogOpen={editIsSkillsDialogOpen}
          setEditIsSkillsDialogOpen={setEditIsSkillsDialogOpen}
          skillsProfiency={skillsProfiency}
          setSkillsProfiency={setSkillsProfiency}
          category="career"
          modifyingId={selectedCareer?.careerId}
        />
      )}
    </Dialog>
  );
};
