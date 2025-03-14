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
  const { sectorFilter, setSectorFilter, levelFilter, setLevelFilter, clearFilter, handleApplyFilters, sectorData } =
    useAdminCareer();
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

      <div className="w-full space-x-2">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={clearFilter}>
          Clear Filters
        </Button>
      </div>
    </FilterLayout>
  );
};
