
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded-md text-sm border border-border-primary disabled:opacity-50 text-secondary-text hover:text-primary-text hover:bg-black/5"
      >
        Prev
      </button>
      <span className="text-sm font-medium text-primary-text">
        {currentPage} / {totalPages}
      </span>
      <button 
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded-md text-sm border border-border-primary disabled:opacity-50 text-secondary-text hover:text-primary-text hover:bg-black/5"
      >
        Next
      </button>
    </div>
  );
}
