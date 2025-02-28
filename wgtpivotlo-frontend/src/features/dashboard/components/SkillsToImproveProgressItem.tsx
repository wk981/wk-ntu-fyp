import { Progress } from '@/components/ui/progress';

interface SkillsToImproveProgressItemProps {
  skillFlowList: string[];
  inSkillSet: boolean;
}

export const SkillsToImproveProgressItem = ({ skillFlowList, inSkillSet }: SkillsToImproveProgressItemProps) => {
  const proficiencyToNumber = (proficiency: string) => {
    switch (proficiency) {
      case 'Beginner':
        return 0;
      case 'Intermediate':
        return 50;
      case 'Advanced':
        return 100;
      default:
        return 0; // Default fallback
    }
  };

  const startLevel = proficiencyToNumber(skillFlowList[0]);
  const targetLevel = proficiencyToNumber(skillFlowList[skillFlowList.length - 1]);

  // Normalize progress relative to the target
  const computeSkillGapProgress = (startLevel: number, targetLevel: number, inSkillSet: boolean) =>{
    if (startLevel === targetLevel && inSkillSet){
      return 100
    }
    else{
      return (startLevel / targetLevel) * 100;
    }
  }

  return <Progress value={computeSkillGapProgress(startLevel, targetLevel,inSkillSet)} className="w-1/3" />;
};
