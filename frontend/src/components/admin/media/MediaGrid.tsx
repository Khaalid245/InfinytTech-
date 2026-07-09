import React from 'react';
import type { MediaFile } from '../../../services/media.service';
import { resolveImageUrl } from '../../../utils/imageHelper';
import { Image as ImageIcon, FileText, Video, Eye, EyeOff } from 'lucide-react';


interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  onFileClick: (file: MediaFile) => void;
  onFileDelete: (file: MediaFile) => void;
  onUploadClick?: () => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  folderName?: string;
  onCreateSubfolder?: () => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ files, isLoading, onFileClick, onUploadClick, selectedIds = new Set(), onSelect, folderName, onCreateSubfolder }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-surface-light rounded-xl animate-pulse border border-border-primary"></div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-light rounded-xl border border-border-primary border-dashed">
        <ImageIcon className="w-12 h-12 text-secondary-text mb-4" />
        <h3 className="text-lg font-medium text-primary-text mb-2">
          {folderName ? `${folderName}` : 'All Media'}
        </h3>
        <p className="text-sm text-secondary-text mb-6">No files in this folder.</p>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {onUploadClick && (
              <button 
                onClick={onUploadClick}
                className="px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Upload Files
              </button>
            )}
            {onCreateSubfolder && (
              <button 
                onClick={onCreateSubfolder}
                className="px-4 py-2 bg-surface-light border border-border-primary text-primary-text text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Create Subfolder
              </button>
            )}
          </div>
          <p className="text-xs text-secondary-text font-medium mt-2">Or drag files here</p>
        </div>
      </div>
    );
  }

  const getIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return null;
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map(file => {
        const isImage = file.mime_type.startsWith('image/');
        const isSelected = selectedIds.has(file.id);
        
        return (
          <div 
            key={file.id} 
            draggable
            onDragStart={(e) => {
              // If dragging a selected item, drag all selected
              if (isSelected) {
                e.dataTransfer.setData('mediaIds', JSON.stringify(Array.from(selectedIds)));
              } else {
                e.dataTransfer.setData('mediaId', file.id);
              }
              e.dataTransfer.effectAllowed = 'move';
              // Set custom drag image? Will do it natively.
            }}
            className={`group relative bg-surface-light border rounded-xl overflow-hidden cursor-pointer transition-all shadow-sm ${
              isSelected ? 'border-accent-primary ring-1 ring-accent-primary' : 'border-border-primary hover:border-accent-primary'
            }`}
            onClick={() => onFileClick(file)}
          >
            {onSelect && (
              <div 
                className={`absolute top-2 left-2 z-10 p-1 rounded transition-opacity ${isSelected ? 'opacity-100 bg-white/90 dark:bg-black/90' : 'opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-black/50'}`}
                onClick={(e) => onSelect(file.id, e)}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="w-4 h-4 rounded border-border-primary text-accent-primary focus:ring-accent-primary cursor-pointer"
                />
              </div>
            )}
            <div className="aspect-square bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
              {isImage ? (
                <img 
                  src={resolveImageUrl(file.file)} 
                  alt={file.alt_text || file.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                getIcon(file.mime_type)
              )}
            </div>
            
            <div className="p-3">
              <p className="text-sm font-medium text-primary-text truncate" title={file.original_filename || file.title}>
                {file.original_filename || file.title}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-secondary-text">{formatSize(file.file_size)}</span>
                {file.is_public ? (
                  <span title="Public"><Eye className="w-3 h-3 text-secondary-text" /></span>
                ) : (
                  <span title="Private"><EyeOff className="w-3 h-3 text-yellow-500" /></span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
