import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { CourseList } from '@/features/courses/components/CourseList';
import { capitalizeEveryFirstChar } from '@/utils';
import { useState } from 'react';

export const LearningTimeline = () => {
  // Bug: Show all doesnt trigger intersection
  const { getCareerPreference } = usePreference(true);
  const { data, isLoading } = getCareerPreference;
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [availableDifficulties, setAvailableDifficulties] = useState<Set<string>>(new Set<string>());
  const [skillLevelFilter, setSkillLevelFilter] = useState('');
  const handleShowFiltersClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowFilters((prev) => !prev);
  };
  const handleValueChange = (value: string) => {
    setSkillLevelFilter(value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const skillsData = data?.skills;
  if (skillsData)
    return (
      <div className="md:px-4 h-full mx-auto max-w-[1280px] overflow-hidden">
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
          <Button className="mt-2" variant={'outline'} onClick={handleShowFiltersClick}>
            {!showFilters ? 'Show Filters' : 'Hide Filters'}
          </Button>
          {showFilters && (
            <div className="bg-[#F1F5F9] border-[#E2E8F0] border-2 rounded-lg px-6 py-4 flex flex-col gap-4 mt-2">
              {availableDifficulties.size > 0 && (
                <div>
                  <label className="font-bold text-sm">Course Difficulty:</label>
                  <Select onValueChange={handleValueChange} defaultValue="Show all">
                    <SelectTrigger className="w-[150px] bg-white">
                      <SelectValue placeholder="Select a difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {[...availableDifficulties].map((value) => (
                          <SelectItem value={value} className="px-2 cursor-pointer">
                            {value}
                          </SelectItem>
                        ))}
                        <SelectItem value={'Show all'}>Show All</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {skillsData.map((skill) => (
            <TabsContent className="h-full" key={skill.skillId} value={skill.skillId.toString()}>
              <h2 className="text-lg font-bold mb-2">{capitalizeEveryFirstChar(skill.name)} Courses</h2>
              <CourseList
                skill={skill}
                careerId={data?.career?.careerId}
                setAvailableDifficulties={setAvailableDifficulties}
                skillLevelFilter={skillLevelFilter}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  else {
    return <div>Error</div>;
  }
};
