import React from 'react';
import type { MediaFilters, MediaFolder } from '../../../services/media.service';
import { Search, Grid, List as ListIcon, Edit2, Trash2 } from 'lucide-react';

interface MediaToolbarProps {
  filters: MediaFilters;
  setFilters: React.Dispatch<React.SetStateAction<MediaFilters>>;
  folders: MediaFolder[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onEditFolder: () => void;
  onDeleteFolder: () => void;
}

const MediaToolbar: React.FC<MediaToolbarProps> = ({ filters, setFilters, folders, viewMode, setViewMode, onEditFolder, onDeleteFolder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="bg-surface-light p-4 rounded-xl border border-border-primary flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex-1 w-full md:max-w-md relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text"
          name="search"
          placeholder="Search by filename, alt text, or caption..."
          className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 pl-9 pr-3 text-primary-text outline-none transition-all"
          value={filters.search || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <select 
          name="folder"
          className="bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all text-sm"
          value={filters.folder || ''}
          onChange={handleChange}
        >
          <option value="">All Folders</option>
          {folders.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        {filters.folder && (
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 border border-border-primary">
            <button 
              type="button"
              title="Rename Folder"
              onClick={onEditFolder}
              className="p-1.5 rounded-md text-secondary-text hover:text-primary-text hover:bg-surface-light transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              type="button"
              title="Delete Folder"
              onClick={onDeleteFolder}
              className="p-1.5 rounded-md text-secondary-text hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <select 
          name="type"
          className="bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all text-sm"
          value={filters.type || ''}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents (PDF)</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
        </select>

        <select 
          name="ordering"
          className="bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all text-sm"
          value={filters.ordering || '-created_at'}
          onChange={handleChange}
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-file_size">Largest File</option>
          <option value="file_size">Smallest File</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
        </select>

        <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 border border-border-primary">
          <button 
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-surface-light text-primary-text shadow-sm' : 'text-secondary-text hover:text-primary-text'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-surface-light text-primary-text shadow-sm' : 'text-secondary-text hover:text-primary-text'}`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaToolbar;
