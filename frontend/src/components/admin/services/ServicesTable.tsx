import React from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, Star, ExternalLink, Image as ImageIcon } from 'lucide-react';
import type { Service } from '../../../types/services';
import Text from '../../ui/Text';
import { Link } from 'react-router-dom';

interface ServicesTableProps {
  services: Service[];
  selectedSlugs: Set<string>;
  onSelect: (slugs: Set<string>) => void;
  onEdit: (service: Service) => void;
  onDelete: (slug: string) => void;
  onToggleStatus: (slug: string, currentStatus: boolean) => void;
  onToggleFeatured: (slug: string, currentFeatured: boolean) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  selectedSlugs,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelect(new Set(services.map(s => s.slug)));
    } else {
      onSelect(new Set());
    }
  };

  const handleSelectOne = (slug: string, checked: boolean) => {
    const next = new Set(selectedSlugs);
    if (checked) next.add(slug);
    else next.delete(slug);
    onSelect(next);
  };

  return (
    <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-primary/50 bg-black/5 dark:bg-white/5">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50 ml-2"
                  checked={services.length > 0 && selectedSlugs.size === services.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-medium text-sm text-secondary-text">Service Title</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Category</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Updated Date</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Featured</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Status</th>
              <th className="p-4 font-medium text-sm text-secondary-text text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {services.map((service) => (
              <tr 
                key={service.slug} 
                className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                  selectedSlugs.has(service.slug) ? 'bg-accent-primary/5 dark:bg-accent-primary/10' : ''
                }`}
              >
                <td className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50 ml-2"
                    checked={selectedSlugs.has(service.slug)}
                    onChange={(e) => handleSelectOne(service.slug, e.target.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0 flex items-center justify-center">
                      {service.featured_image ? (
                        <img 
                          src={service.featured_image} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-secondary-text opacity-50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Text className="font-medium text-primary-text">{service.title}</Text>
                      <Text variant="small" className="text-secondary-text truncate max-w-[200px]">
                        /{service.slug}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {service.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-secondary-text border border-border-primary/50">
                      {service.category.name}
                    </span>
                  ) : (
                    <span className="text-secondary-text text-xs italic">Uncategorized</span>
                  )}
                </td>
                <td className="p-4">
                  <Text variant="small" className="text-secondary-text">
                    {new Date(service.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleFeatured(service.slug, service.is_featured)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      service.is_featured 
                        ? 'text-yellow-500 hover:bg-yellow-500/10' 
                        : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 opacity-50 hover:opacity-100'
                    }`}
                    title={service.is_featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`w-5 h-5 ${service.is_featured ? 'fill-current' : ''}`} />
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(service.slug, service.is_active)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                      service.is_active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-black/5 dark:bg-white/5 text-secondary-text border-border-primary hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                    title="Click to toggle status"
                  >
                    {service.is_active ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      to={`/services/${service.slug}`} 
                      target="_blank"
                      className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => onEdit(service)}
                      className="p-2 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(service.slug)}
                      className="p-2 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTable;
