import React, { useState } from 'react';
import { X, Search, Image as ImageIcon, FileText } from 'lucide-react';
import { useMediaFiles } from '../../../hooks/useMedia';
import type { MediaFile } from '../../../services/media.service';
import Button from '../../ui/Button';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFile | MediaFile[]) => void;
  title?: string;
  multiple?: boolean;
}

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  multiple = false
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<MediaFile[]>([]);

  const { data, isLoading, isError } = useMediaFiles({ page, page_size: 20, search });

  if (!isOpen) return null;

  const handleSelect = () => {
    if (multiple) {
      if (selectedMultiple.length > 0) {
        onSelect(selectedMultiple);
        onClose();
        // Reset state after close
        setTimeout(() => setSelectedMultiple([]), 200);
      }
    } else {
      if (selectedMedia) {
        onSelect(selectedMedia);
        onClose();
        setTimeout(() => setSelectedMedia(null), 200);
      }
    }
  };

  const handleToggleMultiple = (file: MediaFile) => {
    setSelectedMultiple(prev => {
      if (prev.find(f => f.id === file.id)) {
        return prev.filter(f => f.id !== file.id);
      }
      return [...prev, file];
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <h2 className="text-xl font-bold text-primary-text">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Grid */}
          <div className="flex-1 flex flex-col border-r border-border-primary overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border-primary bg-black/2 dark:bg-white/2">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-surface-light border border-border-primary rounded-lg pl-9 pr-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-primary-bg/30">
              {isLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="aspect-square bg-black/5 dark:bg-white/5 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <p>Failed to load media library.</p>
                </div>
              ) : data?.results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-secondary-text">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                  <p>No media found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {data?.results.map((file) => {
                    const isSelected = multiple 
                      ? selectedMultiple.some(f => f.id === file.id)
                      : selectedMedia?.id === file.id;

                    return (
                      <button
                        key={file.id}
                        onClick={() => {
                          if (multiple) {
                            handleToggleMultiple(file);
                          } else {
                            setSelectedMedia(file);
                          }
                        }}
                        className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-accent-primary shadow-[0_0_0_2px_rgba(var(--color-accent-primary),0.3)]' 
                            : 'border-transparent hover:border-border-primary hover:shadow-md'
                        }`}
                      >
                        {file.mime_type?.startsWith('image/') ? (
                          <img 
                            src={file.file} 
                            alt={file.alt_text || file.title}
                            className="w-full h-full object-cover bg-black/5 dark:bg-white/5"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 text-secondary-text group-hover:text-primary-text transition-colors">
                            <FileText className="w-8 h-8 mb-2" />
                            <span className="text-[10px] uppercase font-bold break-all px-2 text-center line-clamp-1">{file.mime_type.split('/')[1] || 'FILE'}</span>
                          </div>
                        )}
                        
                        {/* Checkbox overlay for multiple mode */}
                        {multiple && (
                          <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-accent-primary border-accent-primary text-white' 
                              : 'bg-black/50 border-white/50 opacity-0 group-hover:opacity-100'
                          }`}>
                            {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        )}
                        
                        {/* Hover Info */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs truncate" title={file.title}>{file.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {data && data.count > 0 && (
              <div className="p-4 border-t border-border-primary bg-surface-light flex items-center justify-between">
                <span className="text-xs text-secondary-text">
                  Showing {data.results.length} of {data.count} items
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data.next}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="w-80 bg-surface-light p-6 overflow-y-auto flex flex-col">
            <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider mb-6">Attachment Details</h3>
            
            {multiple ? (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="text-sm text-secondary-text">
                  <span className="font-bold text-primary-text">{selectedMultiple.length}</span> items selected
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px]">
                  {selectedMultiple.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-2 border border-border-primary rounded-lg bg-black/2 dark:bg-white/2">
                      {file.mime_type?.startsWith('image/') ? (
                        <img src={file.file} alt="Preview" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <FileText className="w-10 h-10 p-2 text-secondary-text" />
                      )}
                      <span className="text-xs font-medium text-primary-text truncate flex-1">{file.title}</span>
                      <button onClick={() => handleToggleMultiple(file)} className="p-1 hover:text-red-500 text-secondary-text">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedMedia ? (
              <div className="space-y-6 flex-1">
                <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden border border-border-primary flex items-center justify-center">
                  {selectedMedia.mime_type?.startsWith('image/') ? (
                    <img 
                      src={selectedMedia.file} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-secondary-text" />
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-xs font-medium text-secondary-text mb-0.5">Title</span>
                    <span className="block text-primary-text truncate font-medium">{selectedMedia.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-medium text-secondary-text mb-0.5">Size</span>
                      <span className="block text-primary-text">{formatSize(selectedMedia.file_size)}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-secondary-text mb-0.5">Date</span>
                      <span className="block text-primary-text">{new Date(selectedMedia.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <span className="block text-xs font-medium text-secondary-text mb-0.5">Dimensions</span>
                      <span className="block text-primary-text">{selectedMedia.width} x {selectedMedia.height} pixels</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-medium text-secondary-text mb-0.5">Alt Text</span>
                    <span className="block text-primary-text italic">{selectedMedia.alt_text || 'None'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-secondary-text text-sm">
                Select an image to view its details.
              </div>
            )}

            <div className="pt-6 border-t border-border-primary mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => {
                onClose();
                setTimeout(() => {
                  setSelectedMedia(null);
                  setSelectedMultiple([]);
                }, 200);
              }}>Cancel</Button>
              <Button 
                variant="primary" 
                className="flex-1" 
                disabled={multiple ? selectedMultiple.length === 0 : !selectedMedia} 
                onClick={handleSelect}
              >
                {multiple ? `Select ${selectedMultiple.length || ''}` : 'Select Image'}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MediaPickerModal;
