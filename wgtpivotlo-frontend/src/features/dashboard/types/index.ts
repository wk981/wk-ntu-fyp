import { SkillDTO, skillsWithProfiency } from '@/features/skills/types';

export interface DashboardDTOResponse {
  careerProgression: number;
  userSkills: skillsWithProfiency[];
  careerTitle: string;
  skillGap: SkillWIthCareerLevelFlowDTO[];
}

interface SkillWIthCareerLevelFlowDTO {
  skillDTO: SkillDTO;
  skillFlow: string[];
  inSkillset: boolean;
}
