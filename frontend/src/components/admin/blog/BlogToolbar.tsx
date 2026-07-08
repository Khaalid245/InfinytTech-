import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import type { AdminBlogFilters } from '../../../types/blog';
import { useBlogCategories } from '../../../hooks/useBlog';

interface BlogToolbarProps {
  filters: AdminBlogFilters;
  onFilterChange: (filters: Partial<AdminBlogFilters>) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

const BlogToolbar: React.FC<BlogToolbarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  isRefetching,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const { data: categories } = useBlogCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFilterChange]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-surface-light p-4 rounded-xl border border-border-primary shadow-sm">
      
      <div className="flex-1 w-full max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
        <input 
          type="text"
          placeholder="Search by title, excerpt, slug..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg text-sm text-primary-text outline-none transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg shadow-sm border border-transparent">
          <Filter className="w-4 h-4 text-secondary-text" />
          
          <select 
            className="bg-transparent text-sm text-primary-text outline-none cursor-pointer"
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Categories</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <select 
          className="bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg text-sm text-primary-text outline-none cursor-pointer shadow-sm border border-transparent"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select 
          className="bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg text-sm text-primary-text outline-none cursor-pointer shadow-sm border border-transparent"
          value={filters.featured === undefined ? '' : filters.featured.toString()}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({ featured: val === '' ? undefined : val === 'true', page: 1 });
          }}
        >
          <option value="">Featured: Any</option>
          <option value="true">Featured Only</option>
          <option value="false">Not Featured</option>
        </select>

        <button 
          onClick={onRefresh}
          disabled={isRefetching}
          className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors shadow-sm border border-transparent ml-auto lg:ml-0"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

    </div>
  );
};

export default BlogToolbar;
