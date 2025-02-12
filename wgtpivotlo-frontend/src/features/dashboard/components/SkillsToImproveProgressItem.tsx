import { Progress } from '@/components/ui/progress';

interface SkillsToImproveProgressItemProps {
  skillFlowList: string[];
}

export const SkillsToImproveProgressItem = ({ skillFlowList }: SkillsToImproveProgressItemProps) => {
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
  const progressValue = (startLevel / targetLevel) * 100;

  return <Progress value={progressValue} className="w-1/3" />;
};
