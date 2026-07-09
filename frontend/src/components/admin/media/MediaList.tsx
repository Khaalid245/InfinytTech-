import React from 'react';
import type { MediaFile } from '../../../services/media.service';
import DataTable from '../shared/DataTable';
import { resolveImageUrl } from '../../../utils/imageHelper';
import { FileText, Video, Eye, EyeOff } from 'lucide-react';
import type { ColumnDef } from '../shared/DataTable';
import SkeletonTable from '../shared/SkeletonTable';

interface MediaListProps {
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

const MediaList: React.FC<MediaListProps> = ({ files, isLoading, onFileClick, onUploadClick, selectedIds = new Set(), onSelect, folderName, onCreateSubfolder }) => {
  if (isLoading) {
    return <SkeletonTable columns={6} rows={10} />;
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-light rounded-xl border border-border-primary border-dashed mt-4">
        <FileText className="w-12 h-12 text-secondary-text mb-4" />
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const columns: ColumnDef<MediaFile>[] = [
    {
      header: 'Preview',
      accessor: (file: MediaFile) => {
        const isImage = file.mime_type.startsWith('image/');
        return (
          <div className="w-12 h-12 rounded-lg border border-border-primary bg-surface-light flex items-center justify-center overflow-hidden">
            {isImage ? (
              <img src={resolveImageUrl(file.file)} alt="" className="w-full h-full object-cover" />
            ) : file.mime_type.startsWith('video/') ? (
              <Video className="w-5 h-5 text-purple-500" />
            ) : (
              <FileText className="w-5 h-5 text-blue-500" />
            )}
          </div>
        );
      },
    },
    {
      header: 'Filename',
      accessor: (file: MediaFile) => (
        <div>
          <span className="font-medium text-primary-text block">{file.original_filename || file.title}</span>
          {file.folder_details && (
            <span className="text-xs text-secondary-text">{file.folder_details.name}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (file: MediaFile) => (
        <span className="text-sm text-secondary-text uppercase tracking-wider">{file.extension}</span>
      ),
    },
    {
      header: 'Dimensions / Size',
      accessor: (file: MediaFile) => (
        <div className="text-sm text-secondary-text">
          {file.width && file.height ? <span className="block">{file.width} × {file.height}</span> : null}
          <span>{formatSize(file.file_size)}</span>
        </div>
      ),
    },
    {
      header: 'Visibility',
      accessor: (file: MediaFile) => (
        <div className="flex items-center gap-1.5 text-sm text-secondary-text">
          {file.is_public ? (
            <><Eye className="w-4 h-4" /> Public</>
          ) : (
            <><EyeOff className="w-4 h-4 text-yellow-500" /> Private</>
          )}
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: (file: MediaFile) => (
        <span className="text-sm text-secondary-text block min-w-max">
          {new Date(file.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <DataTable<MediaFile>
      data={files} 
      columns={columns} 
      onRowClick={onFileClick}
      keyExtractor={(f) => f.id}
      draggable={true}
      onDragStart={(item, e) => {
        const isSelected = selectedIds.has(item.id);
        if (isSelected) {
          e.dataTransfer.setData('mediaIds', JSON.stringify(Array.from(selectedIds)));
        } else {
          e.dataTransfer.setData('mediaId', item.id);
        }
        e.dataTransfer.effectAllowed = 'move';
      }}
      selectedKeys={selectedIds}
      onSelectRow={onSelect ? (item, e) => onSelect(item.id, e) : undefined}
    />
  );
};

export default MediaList;
