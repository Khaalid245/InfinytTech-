import React, { useState } from 'react';
import type { MediaFile } from '../../../services/media.service';
import { resolveImageUrl } from '../../../utils/imageHelper';
import { X, ExternalLink, Link as LinkIcon, FileText, Eye, EyeOff, FolderInput, Loader2 } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { useMediaUsage, useMediaFolders } from '../../../hooks/useMedia';

interface MediaDetailDrawerProps {
  file: MediaFile;
  onClose: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const MediaDetailDrawer: React.FC<MediaDetailDrawerProps> = ({ file, onClose, onDelete, onMove }) => {
  const [copied, setCopied] = useState(false);
  const { data: usageData, isLoading: isLoadingUsage } = useMediaUsage(file.id);
  const { data: folders } = useMediaFolders();

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fileUrl = resolveImageUrl(file.file);
  const isImage = file.mime_type.startsWith('image/');

  const handleCopyUrl = () => {
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBreadcrumbs = () => {
    const crumbs = [];
    let currentId: string | null | undefined = file.folder;
    while (currentId) {
      const folder = folders?.find(f => f.id === currentId);
      if (folder) {
        crumbs.unshift(folder.name);
        currentId = folder.parent;
      } else {
        break;
      }
    }
    return crumbs.join(' › ');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-light border-l border-border-primary z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-primary-text">Asset Details</h2>
          <button onClick={onClose} className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Preview Area */}
          <div className="bg-black/5 dark:bg-white/5 aspect-video w-full flex items-center justify-center border-b border-border-primary relative">
            {isImage ? (
              <img src={fileUrl} alt={file.alt_text || file.title} className="w-full h-full object-contain" />
            ) : file.mime_type.startsWith('video/') ? (
              <video src={fileUrl} controls className="w-full h-full" />
            ) : (
              <FileText className="w-16 h-16 text-secondary-text" />
            )}
          </div>

          <div className="p-6 space-y-8">
            {/* Title & Basics */}
            <div>
              <h3 className="text-xl font-bold text-primary-text break-words leading-tight mb-2">
                {file.title || file.original_filename}
              </h3>
              <p className="text-sm text-secondary-text break-all">{file.original_filename}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Uploaded</span>
                <span className="text-primary-text">{new Date(file.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">File Size</span>
                <span className="text-primary-text">{formatSize(file.file_size)}</span>
              </div>
              {isImage && file.width && file.height && (
                <div>
                  <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Dimensions</span>
                  <span className="text-primary-text">{file.width} × {file.height}</span>
                </div>
              )}
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Extension</span>
                <span className="text-primary-text uppercase">{file.extension}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">MIME Type</span>
                <span className="text-primary-text truncate">{file.mime_type}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Visibility</span>
                <span className="flex items-center gap-1.5 text-primary-text">
                  {file.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-yellow-500" />}
                  {file.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Text Metadata */}
            <div className="space-y-4 pt-4 border-t border-border-primary">
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Location</span>
                <span className="text-sm text-primary-text px-3 py-1 bg-black/5 dark:bg-white/5 rounded-md inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {file.folder ? getBreadcrumbs() : 'All Media'}
                </span>
              </div>
              {file.alt_text && (
                <div>
                  <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Alt Text</span>
                  <p className="text-sm text-primary-text bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-border-primary">{file.alt_text}</p>
                </div>
              )}
              {file.caption && (
                <div>
                  <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Caption</span>
                  <p className="text-sm text-primary-text bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-border-primary">{file.caption}</p>
                </div>
              )}
              <div>
                <span className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Usage in CMS</span>
                <div className="text-sm text-primary-text bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-border-primary">
                  {isLoadingUsage ? (
                    <div className="flex items-center gap-2 text-secondary-text"><Loader2 className="w-4 h-4 animate-spin" /> Checking usage...</div>
                  ) : usageData && Object.keys(usageData).length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-secondary-text">
                      {Object.entries(usageData).map(([model, count]) => (
                        <li key={model}>
                          Used in <span className="font-medium text-primary-text">{model}</span> ({count} times)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-secondary-text">Not currently linked anywhere.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border-primary">
              <Button variant="secondary" className="w-full justify-center" onClick={handleCopyUrl} leftIcon={<LinkIcon className="w-4 h-4" />}>
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
              <Button variant="secondary" className="w-full justify-center" onClick={onMove} leftIcon={<FolderInput className="w-4 h-4" />}>
                Move File
              </Button>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="w-full col-span-2">
                <Button variant="secondary" className="w-full justify-center" leftIcon={<ExternalLink className="w-4 h-4" />}>
                  Open Target in New Tab
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-primary bg-black/2 dark:bg-white/2 flex justify-between items-center">
          <Button variant="secondary" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-transparent" onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete Asset
          </Button>
        </div>
      </div>
    </>
  );
};

export default MediaDetailDrawer;
