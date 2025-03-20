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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAdminCourse } from '../../hook/useAdminCourse';
import { Edit, Star } from 'lucide-react';
import { useCourseQuery } from '@/features/courses/hook/useCourseQuery';
import { useEffect, useMemo, useState } from 'react';
import { EditSkillsDataProps } from '../../types';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { BadgeWithTooltip } from '@/components/BadgeWithPopUpInfo';
import { EditSkillsDialog } from './edit-skills-dialog';

interface CourseTableDialogProps {
  isViewDialogOpen: boolean;
}

export const CourseTableDialog = ({ isViewDialogOpen }: CourseTableDialogProps) => {
  const { setIsViewDialogOpen, selectedCourse, handleEditClick, getLevelColor } = useAdminCourse();
  const { courseQuery, courseWithSkills, refetch } = useCourseQuery(selectedCourse?.course_id ?? null);
  const [editIsSkillsDialogOpen, setEditIsSkillsDialogOpen] = useState(false);
  const { isLoading, isError } = courseQuery;

  // Refetch data when the dialog opens
  useEffect(() => {
    if (isViewDialogOpen && selectedCourse) {
      void refetch();
    }
  }, [isViewDialogOpen, selectedCourse, refetch]);

  const [skillsProfiency, setSkillsProfiency] = useState<undefined | EditSkillsDataProps[]>();

  // Memoize the transformed data
  const transformedSkills = useMemo(() => {
    return courseWithSkills?.skillDTOList.map((skill) => ({
      label: skill.name,
      value: String(skill.skillId), // Ensuring it's a string
      profiency: courseWithSkills.profiency,
      skillId: skill.skillId,
    }));
  }, [courseWithSkills?.skillDTOList]); // Recomputes only when `skills` changes

  // Effect to update state when transformed data changes
  useEffect(() => {
    setSkillsProfiency(transformedSkills);
  }, [transformedSkills]); // Updates when transformedSkills changes
  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      {selectedCourse && (
        <DialogContent className="sm:max-w-[600px]">
          {isLoading && <LoadingSpinnerComponent />}
          {isError && <div>Error loading course data.</div>}
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              Detailed information about {capitalizeEveryFirstChar(selectedCourse.name)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-bold text-xl">{capitalizeEveryFirstChar(selectedCourse.name)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Badge
                    variant="secondary"
                    className={`${getLevelColor(selectedCourse.rating.toString())} transition-colors mr-1`}
                  >
                    {selectedCourse.rating.toFixed(1)}
                  </Badge>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
                <Badge variant="outline">{capitalizeFirstChar(selectedCourse.courseSource)}</Badge>
                <Badge variant="secondary">{selectedCourse.reviews_counts.toLocaleString()} reviews</Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <h4 className="text-sm font-medium text-muted-foreground">Course Link</h4>
              <a
                href={selectedCourse.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {selectedCourse.link}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                <p className="text-sm">{format(new Date(selectedCourse.created_on), 'PPP')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="text-sm">{format(new Date(selectedCourse.updated_on), 'PPP')}</p>
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
            <Button onClick={handleEditClick}>Edit Course</Button>
          </DialogFooter>
        </DialogContent>
      )}
      {skillsProfiency && selectedCourse && (
        <EditSkillsDialog
          editIsSkillsDialogOpen={editIsSkillsDialogOpen}
          setEditIsSkillsDialogOpen={setEditIsSkillsDialogOpen}
          skillsProfiency={skillsProfiency}
          setSkillsProfiency={setSkillsProfiency}
          category="course"
          modifyingId={selectedCourse?.course_id}
        />
      )}
    </Dialog>
  );
};
