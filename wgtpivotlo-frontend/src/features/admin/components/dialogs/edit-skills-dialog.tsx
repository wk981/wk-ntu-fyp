import { DropdownComponent } from '@/components/badge-with-dropdown';
import { MultiComboxBox } from '@/components/multi-select-combo-box';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataProps } from '@/features/questionaire/types';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useAdminSkillModification } from '../../hook/useAdminSkillModificationl';
import { useSkills } from '@/features/skills/hook/useSkills';
import { ModifyingProps } from '../../types';

interface EditSkillsDialog {
  editIsSkillsDialogOpen: boolean;
  setEditIsSkillsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  skillsProfiency: EditSkillsDataProps[];
  setSkillsProfiency: React.Dispatch<React.SetStateAction<EditSkillsDataProps[] | undefined>>;
  category: 'course' | 'career';
  modifyingId: number;
}

const selectOptions: DataProps[] = [
  {
    label: 'Beginner',
    value: 'Beginner',
  },
  {
    label: 'Intermediate',
    value: 'Intermediate',
  },
  {
    label: 'Advanced',
    value: 'Advanced',
  },
];

interface EditSkillsDataProps extends DataProps {
  profiency: string;
  skillId: number;
}

export const EditSkillsDialog = ({
  editIsSkillsDialogOpen,
  setEditIsSkillsDialogOpen,
  skillsProfiency, 
  setSkillsProfiency,
  category,
  modifyingId,
}: EditSkillsDialog) => {
  const { isModifyingSkill, mutateModifySkillAsync } = useAdminSkillModification();
  const { skillsQuery, handleCommandOnChangeCapture, skillsData } = useSkills();


  const handleModifying = async ({ skillId, profiency }: ModifyingProps) => {
    try {
      await mutateModifySkillAsync({
        category: category,
        modifyingId: modifyingId,
        profiency: profiency,
        requestType: 'PUT',
        skillId: skillId,
      });
      return true
    } catch (error) {
      console.log(error);
      return false
    }
  };

  const handleAdding = async ({ skillId, profiency }: ModifyingProps) => {
    try {
      await mutateModifySkillAsync({
        category: category,
        modifyingId: modifyingId,
        profiency: profiency,
        requestType: 'POST',
        skillId: skillId,
      });
      return true
    } catch (error) {
      console.log(error);
      return false
    }
  }

  const handleDelete = async (skillId: number) => {
    try {
      await mutateModifySkillAsync({
        category: category,
        modifyingId: modifyingId,
        requestType: 'DELETE',
        skillId: skillId,
        profiency: undefined,
      });
      setSkillsProfiency((prev) => {
        if (!prev) return undefined; // Handle case where previous state is null or undefined

        return prev.filter((skill) => skill.skillId !== Number(skillId)); // Remove skill by filtering it out
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleComboxBoxChangeValue = async (value: string) => {
    const matchedSkill = skillsData.find((item) => item.value === value);
    if (!matchedSkill) {
      console.error('Skill not found in dataMap');
      return;
    }
    const newSkill: EditSkillsDataProps = {
      skillId: Number(matchedSkill.value),
      label: matchedSkill.label,
      value: matchedSkill.value,
      profiency: 'Beginner',
    };
    const res = await handleAdding({
      skillId: Number(value),
      profiency: 'Beginner',
    });
    if(res){
      setSkillsProfiency((prev) => {
        if (!prev) return [newSkill]; // If previous state is null or undefined, initialize with newSkill
  
        // Check if newSkill already exists based on its label
        const skillExists = prev.some((skill) => skill.skillId === newSkill.skillId);
  
        return skillExists ? prev : [...prev, newSkill];
      });
    }

  };

  const handleSelectValue = async ({ profiency, skillId }: ModifyingProps) => {
    const res = await handleModifying({
      skillId: Number(skillId),
      profiency: profiency,
    });
    if(res){
      setSkillsProfiency((prev) => {
        if (!prev) return undefined; // If previous state is null or undefined, initialize with newSkill
  
        return prev.map((skill) => (skill.skillId === Number(skillId) ? { ...skill, profiency } : skill));
      });
    }
  };

  return (
    <Dialog open={editIsSkillsDialogOpen} onOpenChange={setEditIsSkillsDialogOpen}>
      <DialogContent className="max-w-3xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <DialogHeader>
              <DialogTitle>Add skills</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Add skills by searching for skill.
              </DialogDescription>
            </DialogHeader>
            <MultiComboxBox
              data={skillsData}
              isLoading={skillsQuery.isLoading}
              isSuccess={skillsQuery.isSuccess}
              commandOnChangeCapture={handleCommandOnChangeCapture}
              extraSetValueFn={handleComboxBoxChangeValue}
              placeholder="Select a skill"
            />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>Edit skills</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Edit skills here by clicking the red cross to delete or change the proficiency.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 overflow-y-auto max-h-[350px] mt-2 p-2">
              {skillsProfiency &&
                skillsProfiency.map((sp, index) => (
                  <DropdownComponent
                    key={index}
                    options={selectOptions}
                    title={sp.label}
                    onValueChange={(value: string) => handleSelectValue({ profiency: value, skillId: sp.skillId })}
                    selectValue={sp.profiency}
                    onRedCrossClick={() => handleDelete(sp.skillId)}
                    isLoading={isModifyingSkill}
                  />
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
