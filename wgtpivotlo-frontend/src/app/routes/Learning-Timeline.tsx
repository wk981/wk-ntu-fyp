import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { CourseList } from '@/features/courses/components/Course-list';
import { capitalizeEveryFirstChar } from '@/utils';
import { useState } from 'react';

export const LearningTimeline = () => {
  const { getCareerPreference } = usePreference(true);
  const { data, isLoading } = getCareerPreference;
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [skillLevelFilter, setSkillLevelFilter] = useState('Show all');

  const handleShowFiltersClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowFilters((prev) => !prev);
  };

  const handleValueChange = (value: string) => {
    setSkillLevelFilter(value);
  };

  const skillsData = data?.skills;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full mx-auto h-full">
      <h1 className="text-2xl font-bold tracking-tight pb-3">Learning Timeline</h1>
      {skillsData && skillsData.length > 0 ? (
        <Tabs defaultValue={skillsData[0].skillId.toString()} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <TabsList className="inline-flex h-10 items-center justify-start p-1 w-full">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button className="my-2" variant="outline" onClick={handleShowFiltersClick}>
            {!showFilters ? 'Show Filters' : 'Hide Filters'}
          </Button>
          {showFilters && (
            <FilterSection
              availableDifficulties={['Beginner', 'Intermediate', 'Advanced']}
              onValueChange={handleValueChange}
            />
          )}
          {skillsData.map((skill) => (
            <TabsContent key={skill.skillId} value={skill.skillId.toString()} className="mt-1">
              <h2 className="text-2xl font-semibold">{capitalizeEveryFirstChar(skill.name)} Courses</h2>
              <CourseList skill={skill} careerId={data?.career?.careerId} skillLevelFilter={skillLevelFilter} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p>No skills data available.</p>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

interface FilterSectionProps {
  availableDifficulties: string[];
  onValueChange: (value: string) => void;
}

const FilterSection = ({ availableDifficulties, onValueChange }: FilterSectionProps) => (
  <div className="bg-[#F1F5F9] border-[#E2E8F0] border-2 rounded-lg px-6 py-4 flex flex-col gap-4">
    {availableDifficulties.length > 0 && (
      <div>
        <label className="font-bold text-sm">Course Difficulty:</label>
        <Select onValueChange={onValueChange} defaultValue="Show all">
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Select a difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[...availableDifficulties].map((value) => (
                <SelectItem key={value} value={value} className="px-2 cursor-pointer">
                  {value}
                </SelectItem>
              ))}
              <SelectItem value="Show all">Show All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )}
  </div>
);
