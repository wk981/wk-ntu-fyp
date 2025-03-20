import { DataProps } from '@/features/questionaire/types';

export interface ModifyingProps {
  skillId: number;
  profiency: string;
}

export interface EditSkillsDataProps extends DataProps {
  profiency: string;
  skillId: number;
}
