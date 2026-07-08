import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';
import { useCategories } from '../../../hooks/usePortfolio';
import type { ProjectFilters } from '../../../services/portfolio.service';

interface PortfolioToolbarProps {
  filters: ProjectFilters;
  onFilterChange: (newFilters: Partial<ProjectFilters>) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

const PortfolioToolbar: React.FC<PortfolioToolbarProps> = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  isRefetching 
}) => {
  const { data: categories } = useCategories();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || '')) {
        onFilterChange({ search: localSearch || undefined, page: 1 });
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, onFilterChange]);

  // Sync local search if filters change from outside (e.g. clear filters)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-light p-4 rounded-xl border border-border-primary shadow-sm mb-6">
      
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
        <input 
          type="text" 
          placeholder="Search projects by title or client..." 
          className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary focus:bg-transparent rounded-lg py-2 pl-10 pr-4 text-sm text-primary-text outline-none transition-all"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-secondary-text hidden sm:block" />
          <select 
            className="bg-black/5 dark:bg-white/5 border border-transparent rounded-lg py-2 px-3 text-sm text-primary-text outline-none focus:border-accent-primary transition-all appearance-none cursor-pointer"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Category Filter */}
        <select 
          className="bg-black/5 dark:bg-white/5 border border-transparent rounded-lg py-2 px-3 text-sm text-primary-text outline-none focus:border-accent-primary transition-all appearance-none cursor-pointer"
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ category: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Categories</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        {/* Refresh Button */}
        <button 
          onClick={onRefresh}
          disabled={isRefetching}
          className="p-2 ml-auto sm:ml-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default PortfolioToolbar;
