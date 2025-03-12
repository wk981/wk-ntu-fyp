import { ProviderProps } from '@/utils';
import { createContext, MouseEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course } from '@/features/courses/types';
import { useCoursePagination } from '@/features/courses/hook/useCoursePagination';
import { DataProps } from '@/features/questionaire/types';

interface AdminCourseContext {
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;

  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;

  handleEditClick: () => void;
  getLevelColor: (level: string) => string;
  handleRowClick: (course: Course) => void;

  ratingFilter: string;
  setRatingFilter: React.Dispatch<React.SetStateAction<string>>;
  ratingOperatorFilter: string;
  setRatingOperatorFilter: React.Dispatch<React.SetStateAction<string>>;
  reviewCountsFilter: string;
  setReviewCountsFilter: React.Dispatch<React.SetStateAction<string>>;
  reviewCountsOperatorFilter: string;
  setReviewCountsOperatorFilter: React.Dispatch<React.SetStateAction<string>>;
  courseSourceFilter: string;
  setCourseSourceFilter: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  clearFilter: () => void;
  handleApplyFilters: () => void;
  coursesData: Course[];
  hasMoreCoursePage: boolean;
  isFetchingCoursePage: boolean;
  totalPages: number | undefined;
  currentPage: number | undefined;
  handleSearch: (e: MouseEvent<HTMLButtonElement>) => void;
  courseSourceOptions: DataProps[];
}

const AdminCourseContext = createContext<AdminCourseContext | undefined>(undefined);

const AdminCourseProvider = ({ children }: ProviderProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Allow user to filter using url
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  // New filter states
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') ?? '');
  const [ratingOperatorFilter, setRatingOperatorFilter] = useState(searchParams.get('ratingOperatorFilter') ?? '');
  const [reviewCountsFilter, setReviewCountsFilter] = useState(searchParams.get('reviewCounts') ?? '');
  const [reviewCountsOperatorFilter, setReviewCountsOperatorFilter] = useState(
    searchParams.get('reviewCountsOperatorFilter') ?? ''
  );
  const [courseSourceFilter, setCourseSourceFilter] = useState(searchParams.get('courseSource') ?? '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') ?? '');

  const courseSourceOptions = [{ value: 'Coursera', label: 'Coursera' }];
  const { coursesData, hasMoreCoursePage, isFetchingCoursePage, totalPages, currentPage } = useCoursePagination({
    name: searchParams.get('q') ?? '',
    rating: searchParams.get('rating') ?? undefined,
    reviewsCounts: searchParams.get('reviewCounts') ?? undefined,
    courseSource: searchParams.get('courseSource') ?? undefined,
    ratingOperator: searchParams.get('ratingOperatorFilter') ?? undefined,
    reviewCountsOperator: searchParams.get('reviewCountsOperatorFilter') ?? undefined,
    page: Number(searchParams.get('pageNumber') ?? 1),
  });

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
      newParams.set('pageNumber', '1');
      return newParams;
    });
  };

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
      Coursera: 'bg-blue-100 text-blue-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const handleRowClick = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };

  const clearFilter = () => {
    setRatingFilter('');
    setRatingOperatorFilter('');
    setReviewCountsFilter('');
    setReviewCountsOperatorFilter('');
    setCourseSourceFilter('');
    setSearchQuery('');
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('rating');
      newParams.delete('ratingOperatorFilter');
      newParams.delete('reviewCounts');
      newParams.delete('reviewCountsOperatorFilter');
      newParams.delete('courseSource');
      return newParams;
    });
  };

  const value = {
    isViewDialogOpen,
    isEditDialogOpen,
    selectedCourse,
    coursesData,
    handleEditClick,
    getLevelColor,
    handleRowClick,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setSelectedCourse,
    searchQuery,
    setSearchQuery,
    clearFilter,
    handleApplyFilters,
    hasMoreCoursePage,
    isFetchingCoursePage,
    totalPages,
    currentPage,
    handleSearch,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    ratingFilter,
    setRatingFilter,
    ratingOperatorFilter,
    setRatingOperatorFilter,
    reviewCountsFilter,
    setReviewCountsFilter,
    reviewCountsOperatorFilter,
    setReviewCountsOperatorFilter,
    courseSourceFilter,
    setCourseSourceFilter,
    courseSourceOptions,
  };

  return <AdminCourseContext.Provider value={value}>{children}</AdminCourseContext.Provider>;
};

export { AdminCourseContext, AdminCourseProvider };
