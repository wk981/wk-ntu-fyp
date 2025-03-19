import { DropdownComponent } from '@/components/badge-with-dropdown';
import { MultiComboxBox } from '@/components/multi-select-combo-box';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataProps } from '@/features/questionaire/types';
import { skillsWithProfiency } from '@/features/skills/types';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { useAdminSkillModification } from '../../hook/useAdminSkillModificationl';
import { useSkills } from '@/features/skills/hook/useSkills';
import { ModifyingProps } from '../../types';

interface EditSkillsDialog {
  editIsSkillsDialogOpen: boolean;
  setEditIsSkillsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  skills: skillsWithProfiency[];
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
  skills,
  category,
  modifyingId,
}: EditSkillsDialog) => {
  const [skillsProfiency, setSkillsProfiency] = useState<undefined | EditSkillsDataProps[]>();
  const { isModifyingSkill, mutateModifySkillAsync } = useAdminSkillModification();
  const { skillsQuery, handleCommandOnChangeCapture, skillsData } = useSkills();

  // Memoize the transformed data
  const transformedSkills = useMemo(() => {
    return skills.map((skill) => ({
      label: skill.name,
      value: String(skill.skillId), // Ensuring it's a string
      profiency: skill.profiency,
      skillId: skill.skillId,
    }));
  }, [skills]); // Recomputes only when `skills` changes

  // Effect to update state when transformed data changes
  useEffect(() => {
    setSkillsProfiency(transformedSkills);
  }, [transformedSkills]); // Updates when transformedSkills changes

  const handleModifying = async ({ skillId, profiency }: ModifyingProps) => {
    try {
      console.log(skillId, profiency);
      await mutateModifySkillAsync({
        category: category,
        modifyingId: modifyingId,
        profiency: profiency,
        requestType: 'PUT',
        skillId: skillId,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
    console.log(newSkill);
    setSkillsProfiency((prev) => {
      if (!prev) return [newSkill]; // If previous state is null or undefined, initialize with newSkill

      // Check if newSkill already exists based on its label
      const skillExists = prev.some((skill) => skill.skillId === newSkill.skillId);

      return skillExists ? prev : [...prev, newSkill];
    });
    await handleModifying({
      skillId: Number(value),
      profiency: 'Beginner',
    });
  };

  const handleSelectValue = async ({ profiency, skillId }: ModifyingProps) => {
    setSkillsProfiency((prev) => {
      if (!prev) return undefined; // If previous state is null or undefined, initialize with newSkill

      return prev.map((skill) => (skill.skillId === Number(skillId) ? { ...skill, profiency } : skill));
    });

    await handleModifying({
      skillId: Number(skillId),
      profiency: profiency,
    });
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
