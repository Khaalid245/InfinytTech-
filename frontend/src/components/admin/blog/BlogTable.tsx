import React from 'react';
import { Edit, Trash2, ExternalLink, Star, FileText, Image as ImageIcon, Copy } from 'lucide-react';
import type { BlogPost } from '../../../types/blog';
import { resolveImageUrl } from '../../../utils/imageHelper';

interface BlogTableProps {
  posts: BlogPost[];
  selectedIds: Set<string>;
  onSelect: (ids: Set<string>) => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: BlogPost) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onToggleFeatured: (id: string, currentFeatured: boolean) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({
  posts,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onToggleFeatured,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelect(new Set(posts.map(p => p.id)));
    } else {
      onSelect(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelect(next);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="bg-surface-light border border-border-primary rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-black/2 dark:bg-white/2 border-b border-border-primary text-sm font-medium text-secondary-text">
              <th className="p-4 w-12">
                <input 
                  type="checkbox"
                  className="w-4 h-4 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50 cursor-pointer"
                  checked={posts.length > 0 && selectedIds.size === posts.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 w-16">Media</th>
              <th className="p-4">Post</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Reading Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 w-24">Featured</th>
              <th className="p-4 w-32">Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {posts.map(post => (
              <tr 
                key={post.id} 
                className={`group hover:bg-black/2 dark:hover:bg-white/2 transition-colors ${selectedIds.has(post.id) ? 'bg-accent-primary/5 dark:bg-accent-primary/10' : ''}`}
              >
                <td className="p-4">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50 cursor-pointer"
                    checked={selectedIds.has(post.id)}
                    onChange={(e) => handleSelectOne(post.id, e.target.checked)}
                  />
                </td>
                
                {/* Media */}
                <td className="p-4 w-20">
                  <div className="w-16 h-12 rounded-lg bg-black/5 dark:bg-white/5 border border-border-primary overflow-hidden shrink-0">
                    {post.featured_image ? (
                      <img src={resolveImageUrl(post.featured_image)} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-text">
                        <ImageIcon className="w-4 h-4 opacity-50" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Post Info */}
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary-text line-clamp-1">{post.title}</span>
                    <span className="text-xs text-secondary-text mt-0.5 font-mono">{post.slug}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="p-4">
                  {post.category ? (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 text-primary-text border border-border-primary">
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-sm text-secondary-text italic">-</span>
                  )}
                </td>

                {/* Author */}
                <td className="p-4">
                  {post.author ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {post.author.first_name?.[0] || post.author.email?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <span className="text-sm text-primary-text line-clamp-1">
                        {post.author.first_name || post.author.last_name 
                          ? `${post.author.first_name} ${post.author.last_name}`.trim() 
                          : post.author.email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-secondary-text">-</span>
                  )}
                </td>

                {/* Reading Time */}
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-secondary-text">
                    <FileText className="w-4 h-4" />
                    {post.reading_time} min
                  </div>
                </td>

                {/* Status Toggle */}
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(post.id, post.status)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      post.status === 'published'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20'
                        : post.status === 'archived'
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                        : 'bg-black/5 dark:bg-white/5 text-secondary-text border-border-primary hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </button>
                </td>

                {/* Featured Toggle */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onToggleFeatured(post.id, post.is_featured)}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/star"
                    title={post.is_featured ? "Remove Featured" : "Make Featured"}
                  >
                    <Star className={`w-5 h-5 transition-colors ${
                      post.is_featured 
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
                        : 'text-secondary-text group-hover/star:text-yellow-400/50'
                    }`} />
                  </button>
                </td>

                {/* Updated Date */}
                <td className="p-4 text-sm text-secondary-text">
                  {formatDate(post.updated_at || post.created_at)}
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-secondary-text hover:text-accent-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      title="View Public Post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => onDuplicate(post)}
                      className="p-2 text-secondary-text hover:text-accent-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      title="Duplicate Post"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(post)}
                      className="p-2 text-secondary-text hover:text-accent-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(post.id)}
                      className="p-2 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Post"
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

export default BlogTable;
