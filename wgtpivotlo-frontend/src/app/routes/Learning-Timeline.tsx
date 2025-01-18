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
      <div className="mt-12 h-full mx-auto max-w-[1280px]">
        <h1 className="text-3xl font-bold mb-6 text-primary">Learning Timeline</h1>
        <Tabs defaultValue={skillsData[0].skillId.toString()} className="w-full">
          <TabsList className="">
            {skillsData.map((skill) => (
              <TabsTrigger key={skill.skillId} value={skill.skillId.toString()}>
                {capitalizeEveryFirstChar(skill.name)}
              </TabsTrigger>
            ))}
          </TabsList>
          {skillsData.map((skill) => (
            <TabsContent key={skill.skillId} value={skill.skillId.toString()}>
              <h2 className="text-2xl font-bold mb-4">{capitalizeEveryFirstChar(skill.name)} Courses</h2>
              <CourseList skill={skill} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  else {
    return <div>Error</div>;
  }
};
