import React from 'react';
import { Edit2, Trash2, Eye, Star, StarOff, Globe, Lock } from 'lucide-react';
import type { ProjectListItem } from '../../../types/portfolio';
import { resolveImageUrl } from '../../../utils/imageHelper';

interface PortfolioTableProps {
  projects: ProjectListItem[];
  selectedSlugs: Set<string>;
  onSelect: (slugs: Set<string>) => void;
  onEdit: (project: ProjectListItem) => void;
  onDelete: (slug: string) => void;
  onToggleStatus: (project: ProjectListItem) => void;
  onToggleFeatured: (project: ProjectListItem) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({
  projects,
  selectedSlugs,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured
}) => {

  if (projects.length === 0) {
    return (
      <div className="bg-surface-light border border-border-primary rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-secondary-text">
          <Globe className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-primary-text mb-1">No Projects Found</h3>
        <p className="text-secondary-text text-sm max-w-md">
          There are no projects matching your current filters. Try adjusting your search or create a new project.
        </p>
      </div>
    );
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelect(new Set(projects.map(p => p.slug)));
    } else {
      onSelect(new Set());
    }
  };

  const handleSelectRow = (slug: string) => {
    const newSelected = new Set(selectedSlugs);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    onSelect(newSelected);
  };

  return (
    <div className="bg-surface-light border border-border-primary rounded-xl shadow-sm overflow-hidden overflow-x-auto relative">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead className="sticky top-0 bg-surface-light z-10 shadow-sm">
          <tr className="bg-primary-bg/50 border-b border-border-primary text-xs uppercase tracking-wider text-secondary-text">
            <th className="px-4 py-3 font-medium w-12 text-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-accent-primary border-border-primary focus:ring-accent-primary bg-black/5 dark:bg-white/5 cursor-pointer"
                checked={projects.length > 0 && selectedSlugs.size === projects.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Category / Client</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-center">Featured</th>
            <th className="px-4 py-3 font-medium">Created / Updated</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary">
          {projects.map((project) => {
            const isSelected = selectedSlugs.has(project.slug);
            return (
            <tr 
              key={project.id} 
              className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${isSelected ? 'bg-accent-primary/5' : ''}`}
            >
              {/* Checkbox */}
              <td className="px-4 py-3 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-accent-primary border-border-primary focus:ring-accent-primary bg-black/5 dark:bg-white/5 cursor-pointer"
                  checked={isSelected}
                  onChange={() => handleSelectRow(project.slug)}
                />
              </td>
              
              {/* Project Info */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-md overflow-hidden bg-black/10 dark:bg-white/10 shrink-0 border border-border-primary relative">
                    {project.featured_image ? (
                      <img 
                        src={resolveImageUrl(project.featured_image)} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-secondary-text/50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-primary-text text-sm truncate max-w-[200px]" title={project.title}>
                      {project.title}
                    </div>
                    <div className="text-xs text-secondary-text truncate max-w-[200px]" title={project.slug}>
                      /{project.slug}
                    </div>
                  </div>
                </div>
              </td>

              {/* Category / Client */}
              <td className="px-4 py-3">
                <div className="text-sm text-primary-text">{project.category?.name || 'Uncategorized'}</div>
                <div className="text-xs text-secondary-text">{project.client_name || 'N/A'}</div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <button 
                  onClick={() => onToggleStatus(project)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    project.status === 'published' 
                      ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' 
                      : project.status === 'draft'
                      ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20'
                      : 'bg-secondary-text/10 text-secondary-text border-secondary-text/20 hover:bg-secondary-text/20'
                  }`}
                  title="Click to toggle status"
                >
                  {project.status === 'published' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span className="capitalize">{project.status}</span>
                </button>
              </td>

              {/* Featured */}
              <td className="px-4 py-3 text-center">
                <button 
                  onClick={() => onToggleFeatured(project)}
                  className={`p-1.5 rounded-md transition-colors ${
                    project.is_featured 
                      ? 'text-yellow-500 hover:bg-yellow-500/10' 
                      : 'text-secondary-text/30 hover:text-secondary-text hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  title={project.is_featured ? "Unfeature" : "Feature"}
                >
                  {project.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                </button>
              </td>

              {/* Created / Updated */}
              <td className="px-4 py-3">
                <div className="text-sm text-primary-text">
                  {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-xs text-secondary-text">
                  Updated: {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={`/work/${project.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded transition-colors"
                    title="View public page"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => onEdit(project)}
                    className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded transition-colors"
                    title="Edit project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(project.slug)}
                    className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>

            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
