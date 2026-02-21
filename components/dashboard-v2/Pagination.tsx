'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (perPage: number) => void;
  itemsPerPageOptions?: number[];
  showInfo?: boolean;
  showJumpToPage?: boolean | 'auto';
  maxPageButtons?: number;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number, maxButtons: number): (number | 'ellipsis')[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  // Always include first page
  pages.push(1);

  // Calculate window around current page
  // We need to fit: [1] [...] [window] [...] [last]
  // Available slots for window = maxButtons - 2 (first + last) - up to 2 ellipses
  const windowSize = maxButtons - 2; // slots excluding first and last
  const halfWindow = Math.floor((windowSize - 1) / 2); // -1 for possible ellipsis on each side

  let windowStart = currentPage - halfWindow;
  let windowEnd = currentPage + halfWindow;

  // Adjust if near the beginning
  if (windowStart <= 2) {
    windowStart = 2;
    windowEnd = Math.min(windowStart + windowSize - 1, totalPages - 1);
  }

  // Adjust if near the end
  if (windowEnd >= totalPages - 1) {
    windowEnd = totalPages - 1;
    windowStart = Math.max(windowEnd - windowSize + 1, 2);
  }

  // Left ellipsis
  if (windowStart > 2) {
    pages.push('ellipsis');
  }

  // Window pages
  for (let i = windowStart; i <= windowEnd; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Right ellipsis
  if (windowEnd < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  showInfo = true,
  showJumpToPage = 'auto',
  maxPageButtons = 7,
  className = '',
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Auto-clamp: if currentPage > totalPages, fire onPageChange
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const shouldShowJump =
    showJumpToPage === true || (showJumpToPage === 'auto' && totalPages > 10);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const desktopPages = useMemo(
    () => getPageNumbers(currentPage, totalPages, maxPageButtons),
    [currentPage, totalPages, maxPageButtons],
  );
  const mobilePages = useMemo(
    () => getPageNumbers(currentPage, totalPages, 3),
    [currentPage, totalPages],
  );

  const handleJump = useCallback(() => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpValue('');
    }
  }, [jumpValue, totalPages, onPageChange]);

  // Don't render if only 1 page and no per-page selector
  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  const btnBase =
    'flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 rounded-lg text-sm text-gray-900 dark:text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none';
  const activeBtnClass =
    'bg-primary-500 text-white border-primary-500 hover:bg-primary-600';

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {/* Left: Info + Per-page selector */}
      <div className="flex items-center gap-3">
        {showInfo && (
          <div className="text-xs sm:text-sm text-gray-600 dark:text-dark-400">
            <span className="hidden sm:inline">Showing </span>
            {startItem.toLocaleString()}-{endItem.toLocaleString()} of{' '}
            {totalItems.toLocaleString()}
          </div>
        )}
        {onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="hidden sm:block bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white cursor-pointer"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Right: Page buttons + Jump */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={btnBase}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Desktop page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {desktopPages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 py-2 text-sm text-gray-500 dark:text-dark-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`min-w-[36px] px-2 py-2 rounded-lg text-sm font-medium transition-all border focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${
                  currentPage === page
                    ? activeBtnClass
                    : 'bg-gray-100 dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-700 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Mobile page numbers */}
        <div className="flex sm:hidden items-center gap-1">
          {mobilePages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`m-ellipsis-${idx}`}
                className="px-1 py-2 text-xs text-gray-500 dark:text-dark-400 select-none"
              >
                ..
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`min-w-[32px] px-1.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${
                  currentPage === page
                    ? activeBtnClass
                    : 'bg-gray-100 dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-700 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={btnBase}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Jump to page */}
        {shouldShowJump && (
          <div className="hidden sm:flex items-center gap-1 ml-1">
            <span className="text-xs text-gray-500 dark:text-dark-400">Go</span>
            <input
              type="text"
              inputMode="numeric"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJump();
              }}
              placeholder="#"
              className="w-12 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white text-center placeholder:text-gray-400 dark:placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
