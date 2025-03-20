import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Plus, Search, X } from 'lucide-react';
import { FilterLayout } from '@/components/FilterLayout';
import { useState } from 'react';
import { PaginationImpl } from '@/components/pagination-impl';
import { useAdminCourse } from '../hook/useAdminCourse';
import { CourseTable } from './tables/course-table';
import { CourseTableDialog } from './dialogs/course-table-view-dialog';
import { CourseTableAddDialog } from './dialogs/course-table-add-dialog';
import { CourseTableEditDialog } from './dialogs/course-table-edit-dialog';
import { CourseTableDeleteDialog } from './dialogs/course-table-delete-dialog';
import { useSkills } from '@/features/skills/hook/useSkills';
import { EditSkillsDataProps, ModifyingProps } from '../types';
import { MultiComboxBox } from '@/components/multi-select-combo-box';
import { DropdownComponent } from '@/components/badge-with-dropdown';
import { DataProps } from '@/features/questionaire/types';

export const CourseContent = () => {
  const {
    searchQuery,
    setSearchQuery,
    isEditDialogOpen,
    isViewDialogOpen,
    coursesData,
    hasMoreCoursePage,
    isFetchingCoursePage,
    totalPages,
    currentPage,
    handleSearch,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
  } = useAdminCourse();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="px-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" size="icon" onClick={handleSearch} className="shrink-0">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search careers</span>
          </Button>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant={'ghost'}
            className="flex gap-2 items-center justify-center text-sm font-medium border"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? (
              <X width={18} height={18} className="transition-transform duration-200" />
            ) : (
              <Filter width={18} height={18} className="transition-transform duration-200" />
            )}
            Show Filters
          </Button>
          <Button
            className="flex gap-2 items-center justify-center text-sm font-medium border border-black"
            onClick={(e) => {
              e.preventDefault();
              setIsAddDialogOpen(true);
            }}
          >
            <Plus width={20} height={20} />
            Add New Entry
          </Button>
        </div>
      </div>
      {showFilters && <CourseFilter />}
      {coursesData && <CourseTable data={coursesData} />}
      {totalPages && currentPage && (
        <PaginationImpl
          hasNextPage={hasMoreCoursePage}
          isFetching={isFetchingCoursePage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
      {/* View Dialog */}
      <CourseTableDialog isViewDialogOpen={isViewDialogOpen} />

      {/* Edit Dialog */}
      <CourseTableEditDialog isEditDialogOpen={isEditDialogOpen} />

      {/* Add Dialog  */}
      <CourseTableAddDialog isAddDialogOpen={isAddDialogOpen} />

      {/* Delete Dialog */}
      <CourseTableDeleteDialog isDeleteDiaglogOpen={isDeleteDialogOpen} />
    </div>
  );
};

const selectOptions: DataProps[] = [
  {
    label: 'Beginner',
    value: 'Beginner',
  },
  {
    label: 'Intermediate',
    value: 'Intermediate',
  },
  {
    label: 'Advanced',
    value: 'Advanced',
  },
  {
    label: 'Show All',
    value: 'Show All',
  },
];

const CourseFilter = () => {
  const {
    courseSourceFilter,
    setCourseSourceFilter,
    ratingOperatorFilter,
    setRatingOperatorFilter,
    ratingFilter,
    setRatingFilter,
    reviewCountsOperatorFilter,
    setReviewCountsOperatorFilter,
    reviewCountsFilter,
    setReviewCountsFilter,
    courseSourceOptions,
    isFetchingCoursePage,
    setSearchQuery,
    setSearchParams,
  } = useAdminCourse();
  const operatorOptions = [
    { value: 'ge', label: '≥ (Greater than or equal to)' },
    { value: 'le', label: '≤ (Less than or equal to)' },
    { value: 'gt', label: '> (Greater than)' },
    { value: 'lt', label: '< (Less than)' },
  ];
  const { skillsQuery, handleCommandOnChangeCapture, skillsData } = useSkills();
  const [skillsProfiency, setSkillsProfiency] = useState<undefined | EditSkillsDataProps[]>();

  const handleComboxBoxChangeValue = (value: string) => {
    const matchedSkill = skillsData.find((item) => item.value === value);
    if (!matchedSkill) {
      console.error('Skill not found in dataMap');
      return;
    }
    const newSkill: EditSkillsDataProps = {
      skillId: Number(matchedSkill.value),
      label: matchedSkill.label,
      value: matchedSkill.value,
      profiency: 'Beginner',
    };
    setSkillsProfiency((prev) => {
      if (!prev) return [newSkill]; // If previous state is null or undefined, initialize with newSkill

      // Check if newSkill already exists based on its label
      const skillExists = prev.some((skill) => skill.skillId === newSkill.skillId);

      return skillExists ? prev : [...prev, newSkill];
    });
  };

  const handleDelete = (skillId: number) => {
    setSkillsProfiency((prev) => {
      if (!prev) return undefined; // Handle case where previous state is null or undefined

      return prev.filter((skill) => skill.skillId !== Number(skillId)); // Remove skill by filtering it out
    });
  };

  const handleSelectValue = ({ profiency, skillId }: ModifyingProps) => {
    setSkillsProfiency((prev) => {
      if (!prev) return undefined; // If previous state is null or undefined, initialize with newSkill

      return prev.map((skill) => (skill.skillId === Number(skillId) ? { ...skill, profiency } : skill));
    });
  };

  const clearFilter = () => {
    setRatingFilter('');
    setRatingOperatorFilter('');
    setReviewCountsFilter('');
    setReviewCountsOperatorFilter('');
    setCourseSourceFilter('');
    setSearchQuery('');
    setSkillsProfiency(undefined);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('rating');
      newParams.delete('ratingOperatorFilter');
      newParams.delete('reviewCounts');
      newParams.delete('reviewCountsOperatorFilter');
      newParams.delete('courseSource');
      newParams.delete('skillFilters');
      return newParams;
    });
  };

  const handleApplyFilters = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (ratingFilter === '' || ratingFilter === 'show all') {
        newParams.delete('rating');
      } else {
        newParams.set('rating', ratingFilter);
      }

      if (ratingOperatorFilter === '' || ratingOperatorFilter === 'show all') {
        newParams.delete('ratingOperatorFilter');
      } else {
        newParams.set('ratingOperatorFilter', ratingOperatorFilter);
      }

      if (reviewCountsFilter === '' || reviewCountsFilter === 'show all') {
        newParams.delete('reviewCounts');
      } else {
        newParams.set('reviewCounts', reviewCountsFilter);
      }

      if (reviewCountsOperatorFilter === '' || reviewCountsOperatorFilter === 'show all') {
        newParams.delete('reviewCountsOperatorFilter');
      } else {
        newParams.set('reviewCountsOperatorFilter', reviewCountsOperatorFilter);
      }

      if (courseSourceFilter === '' || courseSourceFilter === 'show all') {
        newParams.delete('courseSource');
      } else {
        newParams.set('courseSource', courseSourceFilter);
      }
      if (skillsProfiency && skillsProfiency?.length > 0) {
        let queryString = '';
        for (let i = 0; i < skillsProfiency.length; i++) {
          const profiency =
            skillsProfiency[i].profiency.toLowerCase() === 'show all' ? '' : skillsProfiency[i].profiency;
          queryString += `${skillsProfiency[i].skillId}:${profiency}`;
          if (i < skillsProfiency.length - 1) {
            queryString += ',';
          }
        }
        newParams.set('skillFilters', queryString);
      } else {
        newParams.delete('skillFilters');
      }
      newParams.set('pageNumber', '1');
      return newParams;
    });
  };

  return (
    <FilterLayout>
      {/* Course Source Filter */}
      <div>
        <label className="font-bold text-sm">Course Source:</label>
        <Select value={courseSourceFilter} onValueChange={setCourseSourceFilter}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="show all">All Sources</SelectItem>
            {courseSourceOptions.map((source, index) => (
              <SelectItem key={index} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="font-bold text-sm">Rating:</label>
        <div className="flex gap-2">
          <Select value={ratingOperatorFilter} onValueChange={setRatingOperatorFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map((op, index) => (
                <SelectItem key={index} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value);
            }}
          >
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show all">Show All</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="2">2 Star</SelectItem>
              <SelectItem value="3">3 Star</SelectItem>
              <SelectItem value="4">4 Star</SelectItem>
              <SelectItem value="5">5 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Review Counts Filter */}
      <div>
        <label className="font-bold text-sm">Review Counts:</label>
        <div className="flex gap-2">
          <Select value={reviewCountsOperatorFilter} onValueChange={setReviewCountsOperatorFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map((op, index) => (
                <SelectItem key={index} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Count"
            value={reviewCountsFilter}
            onChange={(e) => {
              setReviewCountsFilter(e.target.value);
            }}
            className="w-[150px] bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="font-bold text-sm">Filter by skills:</label>
        <MultiComboxBox
          data={skillsData}
          isLoading={skillsQuery.isLoading}
          isSuccess={skillsQuery.isSuccess}
          commandOnChangeCapture={handleCommandOnChangeCapture}
          extraSetValueFn={handleComboxBoxChangeValue}
          placeholder="Select a skill"
        />
      </div>

      {skillsProfiency && skillsProfiency?.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500">Selected Skills:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsProfiency.map((sp, index) => (
              <DropdownComponent
                key={index}
                options={selectOptions}
                title={sp.label}
                onValueChange={(value: string) => handleSelectValue({ profiency: value, skillId: sp.skillId })}
                selectValue={sp.profiency}
                onRedCrossClick={() => handleDelete(sp.skillId)}
                isLoading={isFetchingCoursePage}
                selectClassName="bg-white"
                blueBorder={true}
              />
            ))}
          </div>
        </>
      )}

      <div className="w-full space-x-2">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={clearFilter}>
          Clear Filters
        </Button>
      </div>
    </FilterLayout>
  );
};
