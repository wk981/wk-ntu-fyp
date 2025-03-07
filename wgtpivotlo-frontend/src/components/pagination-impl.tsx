import { PaginationEllipsis } from '@/components/ui/pagination';

import { useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { useSearchParams } from 'react-router-dom';

interface PaginationImplProps {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetching: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export const PaginationImpl = ({
  fetchNextPage,
  hasNextPage = false,
  isFetching,
  totalPages,
  currentPage,
  onPageChange,
}: PaginationImplProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract the latest values from the arrays

  // Get current page from URL or fallback to the latest from the query
  const urlPageNumber = searchParams.get('pageNumber');
  const activePageNumber = urlPageNumber ? Number.parseInt(urlPageNumber, 10) : currentPage;

  const handlePageChange = useCallback(
    (page: number) => {
      // Update URL search params
      searchParams.set('pageNumber', page.toString());
      setSearchParams(searchParams);

      // Call the callback if provided
      if (onPageChange) {
        onPageChange(page);
      }
    },
    [searchParams, setSearchParams, onPageChange]
  );

  const handleNext = useCallback(() => {
    if (!isFetching && hasNextPage && activePageNumber) {
      fetchNextPage();

      // Update URL to next page
      const nextPage = activePageNumber + 1;
      searchParams.set('pageNumber', nextPage.toString());
      setSearchParams(searchParams);
    }
  }, [fetchNextPage, isFetching, hasNextPage, activePageNumber, searchParams, setSearchParams]);

  // Generate page numbers to display - FIXED VERSION
  const getPageNumbers = () => {
    if (!totalPages || totalPages <= 1) return [1];

    // For simplicity, show up to 5 page numbers
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a window around the current page
      let startPage = Math.max(1, activePageNumber - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // Add first page if not in range
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('ellipsis');
      }

      // Add middle pages - FIXED: Don't exclude page 1
      for (let i = startPage; i <= endPage; i++) {
        // Remove the condition that was excluding page 1
        if (i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      // Add last page if not in range
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (activePageNumber > 1) {
                handlePageChange(activePageNumber - 1);
              }
            }}
            className={activePageNumber <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={activePageNumber <= 1}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?pageNumber=${page}`}
                isActive={page === activePageNumber}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={!hasNextPage || isFetching ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={!hasNextPage || isFetching}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
