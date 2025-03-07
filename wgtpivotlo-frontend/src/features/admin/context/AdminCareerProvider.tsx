import { ProviderProps } from '@/utils';
import { createContext, useState } from 'react';
// import { careerPaginationMockData } from '../data';
import { Career } from '@/features/questionaire/types';
import { useSearchParams } from 'react-router-dom';
import { useCareerPagination } from '@/features/careers/hooks/useCareerPagination';
import { useQueryClient } from '@tanstack/react-query';

interface AdminCareerContext {
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  editForm: Career | null;
  selectedCareer: Career | null;
  careersData: Career[];
  handleEditClick: () => void
  getLevelColor: (level: string) => string;
  handleRowClick: (career: Career) => void;
  setEditForm: React.Dispatch<React.SetStateAction<Career | null>>;
  handleSave: () => void;
  setIsViewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditChange: (field: keyof Career, value: any) => void;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career | null>>;
  sectorFilter: string;
  setSectorFilter: React.Dispatch<React.SetStateAction<string>>;
  levelFilter: string;
  setLevelFilter: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  clearFilter: () => void;
  handleApplyFilters: () => void
  fetchNextCareerPage: () => void
   hasMoreCareerPage: boolean
    isFetchingCareerPage: boolean
    totalPages:number | undefined
    currentPage: number | undefined
}

const AdminCareerContext = createContext<AdminCareerContext | undefined>(undefined);

const AdminCareerProvider = ({ children }: ProviderProps) => {
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Career | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  
  // Allow user to filter using url
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [sectorFilter, setSectorFilter] = useState<string>(searchParams.get('sector') ?? '' );
  const [levelFilter, setLevelFilter] = useState<string>(searchParams.get('careerLevel') ?? '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') ?? '' );
  const page = Number(searchParams.get("pageNumber")); // Default to page 1

  const { 
    careersData, 
    fetchNextCareerPage, 
    hasMoreCareerPage, 
    isFetchingCareerPage, 
    totalPages,
    currentPage
  } = useCareerPagination({
    title: searchParams.get("q") ?? "",
    sector: searchParams.get("sector") ?? "",
    careerLevel: searchParams.get("careerLevel") ?? "",
    page: page
  });

  const handleApplyFilters = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
  
      if (sectorFilter === "" || sectorFilter === "show all") {
        newParams.delete("sector");
      } else {
        newParams.set("sector", sectorFilter);
      }
  
      if (levelFilter === "" || levelFilter === "show all") {
        newParams.delete("careerLevel");
      } else {
        newParams.set("careerLevel", levelFilter);
      }

      if (searchQuery === ""){
        newParams.delete("q")
      }
      else{
        newParams.set("q", searchQuery);
      }
      newParams.set("pageNumber", "1");
      return newParams;
    });
  };
  
  const handleEditClick = () => {
    setIsViewDialogOpen(false);
    setEditForm(selectedCareer);
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

  const handleSave = async () => {
    if (editForm && careersData) {
      await queryClient.invalidateQueries({ queryKey: ["career-pagination"] });
      setSelectedCareer(editForm);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditChange = (field: keyof Career, value: any) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [field]: value,
      });
    }
  };

  const clearFilter = () => {
    setLevelFilter('');
    setSectorFilter('');
    setSearchQuery('');
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('sector');
      newParams.delete('careerLevel');
      return newParams;
    });
  };

  const value = {
    isViewDialogOpen,
    isEditDialogOpen,
    editForm,
    selectedCareer,
    careersData,
    handleEditClick,
    getLevelColor,
    handleRowClick,
    setEditForm,
    handleSave,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    handleEditChange,
    setSelectedCareer,
    sectorFilter,
    setSectorFilter,
    levelFilter,
    setLevelFilter,
    searchQuery,
    setSearchQuery,
    clearFilter,
    handleApplyFilters,
    fetchNextCareerPage, hasMoreCareerPage, isFetchingCareerPage, totalPages, currentPage
  };

  return <AdminCareerContext.Provider value={value}>{children}</AdminCareerContext.Provider>;
};

export { AdminCareerContext, AdminCareerProvider };
