import { Career } from '@/features/questionaire/types';
import { SkillDTO, skillsWithProfiency } from '@/features/skills/types';

export interface DashboardDTOResponse {
  username: string;
  pic: string;
  careerProgression: number;
  userSkills: skillsWithProfiency[];
  career: Career;
  skillGap: SkillWIthCareerLevelFlowDTO[];
}

interface SkillWIthCareerLevelFlowDTO {
  skillDTO: SkillDTO;
  skillFlow: string[];
}
