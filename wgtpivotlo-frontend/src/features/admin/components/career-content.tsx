import { Button } from '@/components/ui/button';
import { CareerTable } from './tables/career-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Plus, Search, X } from 'lucide-react';
import { useAdminCareer } from '../hook/useAdminCareer';
import { capitalizeEveryFirstChar } from '@/utils';
import { CareerTableDialog } from './dialogs/career-table-view-dialog';
import { CareerTableEditDialog } from './dialogs/career-table-edit-dialog';
import { FilterLayout } from '@/components/FilterLayout';
import { useState } from 'react';
import { PaginationImpl } from '@/components/pagination-impl';
import { CareerTableAddDialog } from './dialogs/career-table-add-dialog';
import { CareerTableDeleteDialog } from './dialogs/career-table-delete-dialog';
import { useSkills } from '@/features/skills/hook/useSkills';
import { MultiComboxBox } from '@/components/multi-select-combo-box';
import { EditSkillsDataProps, ModifyingProps } from '../types';
import { DropdownComponent } from '@/components/badge-with-dropdown';
import { DataProps } from '@/features/questionaire/types';

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

export const CareerContent = () => {
  const {
    searchQuery,
    setSearchQuery,
    isEditDialogOpen,
    isViewDialogOpen,
    careersData,
    hasMoreCareerPage,
    isFetchingCareerPage,
    totalPages,
    currentPage,
    handleSearch,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
  } = useAdminCareer();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search careers..."
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
      {showFilters && <CareerFilter />}
      {careersData && <CareerTable data={careersData} />}
      {totalPages && currentPage && (
        <PaginationImpl
          hasNextPage={hasMoreCareerPage}
          isFetching={isFetchingCareerPage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
      {/* View Dialog */}
      <CareerTableDialog isViewDialogOpen={isViewDialogOpen} />

      {/* Edit Dialog */}
      <CareerTableEditDialog isEditDialogOpen={isEditDialogOpen} />

      {/* Add Dialog  */}
      <CareerTableAddDialog isAddDialogOpen={isAddDialogOpen} />

      {/* Delete Dialog */}
      <CareerTableDeleteDialog isDeleteDiaglogOpen={isDeleteDialogOpen} />
    </div>
  );
};

const CareerFilter = () => {
  const {
    sectorFilter,
    setSectorFilter,
    levelFilter,
    setLevelFilter,
    setSearchQuery,
    setSkillFilters,
    setSearchParams,
    sectorData,
    isFetchingCareerPage,
  } = useAdminCareer();
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
    setLevelFilter('');
    setSectorFilter('');
    setSearchQuery('');
    setSkillFilters('');
    setSkillsProfiency(undefined);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('sector');
      newParams.delete('careerLevel');
      newParams.delete('skillFilters');
      return newParams;
    });
  };

  const handleApplyFilters = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (sectorFilter === '' || sectorFilter === 'show all') {
        newParams.delete('sector');
      } else {
        newParams.set('sector', sectorFilter);
      }

      if (levelFilter === '' || levelFilter === 'show all') {
        newParams.delete('careerLevel');
      } else {
        newParams.set('careerLevel', levelFilter);
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
      {sectorData && (
        <div>
          <label className="font-bold text-sm">Sector:</label>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show all">All Sectors</SelectItem>
              {sectorData.map((sector, index) => (
                <SelectItem key={index} value={sector.value}>
                  {capitalizeEveryFirstChar(sector.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="font-bold text-sm">Career Level:</label>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="show all">All Levels</SelectItem>
            {['Entry Level', 'Mid Level', 'Senior Level'].map((level, index) => (
              <SelectItem key={index} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                isLoading={isFetchingCareerPage}
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
