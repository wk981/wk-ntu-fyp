import { LoadingSpinner } from '@/components/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { CourseList } from '@/features/courses/components/CourseList';
import { capitalizeEveryFirstChar } from '@/utils';

export const LearningTimeline = () => {
  const { getCareerPreference } = usePreference(true);
  const { data, isLoading } = getCareerPreference;

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const skillsData = data?.skills;
  if (skillsData)
    return (
      <div className="px-4 py-3 h-full mx-auto max-w-[1280px] min-h-[calc(100vh-65px)] overflow-hidden">
        <h1 className="text-2xl font-bold pb-3 text-primary">Learning Timeline</h1>
        <Tabs defaultValue={skillsData[0].skillId.toString()} className="w-full overflow-auto">
          <TabsList className="overflow-x-auto overflow-y-hidden w-full flex justify-start">
            {skillsData.map((skill) => (
              <TabsTrigger
                key={skill.skillId}
                value={skill.skillId.toString()}
                className="px-3 py-1.5 text-sm font-medium transition-all"
              >
                {capitalizeEveryFirstChar(skill.name)}
              </TabsTrigger>
            ))}
          </TabsList>
          {skillsData.map((skill) => (
            <TabsContent className="h-full" key={skill.skillId} value={skill.skillId.toString()}>
              <h2 className="text-lg font-bold mb-2">{capitalizeEveryFirstChar(skill.name)} Courses</h2>
              <CourseList skill={skill} careerId={data?.career?.careerId} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  else {
    return <div>Error</div>;
  }
};
