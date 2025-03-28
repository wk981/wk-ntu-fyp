import { ProviderProps } from '@/utils';
import { createContext, MouseEvent, useState } from 'react';
// import { careerPaginationMockData } from '../data';
import { Career, DataProps } from '@/features/questionaire/types';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { useCareerPagination } from '@/features/careers/hooks/useCareerPagination';
import { useSectors } from '@/features/careers/hooks/useSectors';

interface AdminCareerContext {
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedCareer: Career | null;
  careersData: Career[];
  handleEditClick: () => void;
  getLevelColor: (level: string) => string;
  handleRowClick: (career: Career) => void;
  setIsViewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career | null>>;
  sectorFilter: string;
  setSectorFilter: React.Dispatch<React.SetStateAction<string>>;
  levelFilter: string;
  setLevelFilter: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  skillFilters: string;
  setSkillFilters: React.Dispatch<React.SetStateAction<string>>;
  setSearchParams: SetURLSearchParams;
  hasMoreCareerPage: boolean;
  isFetchingCareerPage: boolean;
  totalPages: number | undefined;
  currentPage: number | undefined;
  sectorData: DataProps[] | undefined;
  isSectorLoading: boolean;
  handleSearch: (e: MouseEvent<HTMLButtonElement>) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AdminCareerContext = createContext<AdminCareerContext | undefined>(undefined);

const AdminCareerProvider = ({ children }: ProviderProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  // Allow user to filter using url
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [sectorFilter, setSectorFilter] = useState<string>(searchParams.get('sector') ?? '');
  const [levelFilter, setLevelFilter] = useState<string>(searchParams.get('careerLevel') ?? '');
  const [skillFilters, setSkillFilters] = useState<string>(searchParams.get('skillFilters') ?? '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') ?? '');

  const { careersData, hasMoreCareerPage, isFetchingCareerPage, totalPages, currentPage } = useCareerPagination({
    title: searchParams.get('q') ?? '',
    sector: searchParams.get('sector') ?? '',
    careerLevel: searchParams.get('careerLevel') ?? '',
    skillFilters: searchParams.get('skillFilters') ?? '',
    page: Number(searchParams.get('pageNumber') ?? 1),
  });

  const { sectorsQuery } = useSectors();
  const { data: sectorData, isLoading: isSectorLoading } = sectorsQuery;

  const handleSearch = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (searchQuery === '') {
        newParams.delete('q');
      } else {
        newParams.set('q', searchQuery);
      }
      newParams.set('pageNumber', '1');
      return newParams;
    });
  };

  const handleEditClick = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Entry Level': 'bg-blue-100 text-blue-800',
      'Mid Level': 'bg-purple-100 text-purple-800',
      'Senior Level': 'bg-emerald-100 text-emerald-800',
      Executive: 'bg-orange-100 text-orange-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };
  const handleRowClick = (career: Career) => {
    setSelectedCareer(career);
    setIsViewDialogOpen(true);
  };

  const value = {
    isViewDialogOpen,
    isEditDialogOpen,
    selectedCareer,
    careersData,
    handleEditClick,
    getLevelColor,
    handleRowClick,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setSelectedCareer,
    sectorFilter,
    setSectorFilter,
    levelFilter,
    setLevelFilter,
    searchQuery,
    setSearchQuery,
    hasMoreCareerPage,
    isFetchingCareerPage,
    totalPages,
    currentPage,
    sectorData,
    isSectorLoading,
    handleSearch,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    skillFilters,
    setSkillFilters,
    setSearchParams,
  };

  return <AdminCareerContext.Provider value={value}>{children}</AdminCareerContext.Provider>;
};

export { AdminCareerContext, AdminCareerProvider };
