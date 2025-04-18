import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminModifyingCareerSkill, adminModifyingCourseSkill } from '../api';

interface AdminSkillModificationProps {
  category: 'course' | 'career';
  modifyingId: number;
  skillId: number;
  profiency: string | undefined;
  requestType: 'POST' | 'PUT' | 'DELETE';
}

export const useAdminSkillModification = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: ({ category, modifyingId, skillId, profiency, requestType }: AdminSkillModificationProps) => {
      switch (category) {
        case 'career':
          return adminModifyingCareerSkill({
            careerId: modifyingId,
            skillId: skillId,
            profiency: profiency,
            requestType: requestType,
          });
        case 'course':
          return adminModifyingCourseSkill({
            courseId: modifyingId,
            skillId: skillId,
            profiency: profiency,
            requestType: requestType,
          });
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['career'] });
      toast.success('Skill successfully added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add skill');
    },
  });
  return {
    isModifyingSkill: isPending,
    mutateModifySkillAsync: mutateAsync,
  };
};
