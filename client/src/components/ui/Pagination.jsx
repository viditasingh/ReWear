import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from '../Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* First page */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          className="hidden sm:flex"
        >
          First
        </Button>
      )}

      {/* Previous page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:block">Previous</span>
        </Button>
      )}

      {/* First page number */}
      {showStartEllipsis && (
        <>
          <Button
            variant={1 === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="min-w-[40px]"
          >
            1
          </Button>
          <div className="flex items-center justify-center min-w-[40px] h-8">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="min-w-[40px]"
        >
          {page}
        </Button>
      ))}

      {/* Last page number */}
      {showEndEllipsis && (
        <>
          <div className="flex items-center justify-center min-w-[40px] h-8">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <Button
            variant={totalPages === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="min-w-[40px]"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1"
        >
          <span className="hidden sm:block">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Last page */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:flex"
        >
          Last
        </Button>
      )}
    </div>
  );
};

// Simple pagination info component
export const PaginationInfo = ({ currentPage, totalPages, totalItems, itemsPerPage }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className="text-sm text-gray-600">
      Showing {start} to {end} of {totalItems} items
    </div>
  );
};

export default Pagination;
