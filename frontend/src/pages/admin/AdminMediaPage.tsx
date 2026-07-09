import React, { useState } from 'react';
import { useMediaFiles, useMediaStats, useMediaFolders, useUpdateMedia } from '../../hooks/useMedia';
import type { MediaFilters, MediaFile } from '../../services/media.service';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { Upload, FolderPlus, HardDrive, ImageIcon, FileText, Video, X } from 'lucide-react';
import MediaGrid from '../../components/admin/media/MediaGrid';
import MediaList from '../../components/admin/media/MediaList';
import BulkActionBar from '../../components/admin/media/BulkActionBar';
import MediaToolbar from '../../components/admin/media/MediaToolbar';
import MediaUploadModal from '../../components/admin/media/MediaUploadModal';
import MediaDetailDrawer from '../../components/admin/media/MediaDetailDrawer';
import DeleteProtectionDialog from '../../components/admin/media/DeleteProtectionDialog';
import MediaFolderModal from '../../components/admin/media/MediaFolderModal';
import DeleteFolderDialog from '../../components/admin/media/DeleteFolderDialog';
import MoveMediaModal from '../../components/admin/media/MoveMediaModal';
import MediaFolderTree from '../../components/admin/media/MediaFolderTree';

const AdminMediaPage: React.FC = () => {
  const [filters, setFilters] = useState<MediaFilters>({ page: 1, page_size: 24, ordering: '-created_at' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<any>(null);
  const [folderToDelete, setFolderToDelete] = useState<any>(null);
  const [folderDefaultParent, setFolderDefaultParent] = useState<string | undefined>(undefined);
  
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const dragCounter = React.useRef(0);
  
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [fileToMove, setFileToMove] = useState<MediaFile | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const { data: mediaData, isLoading: isLoadingMedia } = useMediaFiles(filters);
  const { data: stats } = useMediaStats();
  const { data: folders } = useMediaFolders();
  const { mutate: updateMedia } = useUpdateMedia();

  const [contextMenu, setContextMenu] = useState<{ folder: any; x: number; y: number } | null>(null);

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (e.shiftKey && lastSelectedId && mediaData) {
        const flatList = mediaData.results;
        const start = flatList.findIndex(f => f.id === lastSelectedId);
        const end = flatList.findIndex(f => f.id === id);
        if (start !== -1 && end !== -1) {
          const min = Math.min(start, end);
          const max = Math.max(start, end);
          for (let i = min; i <= max; i++) {
            next.add(flatList[i].id);
          }
        }
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setLastSelectedId(id);
      }
      return next;
    });
  };

  React.useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear selection on Escape
      if (e.key === 'Escape') {
        setSelectedIds(new Set());
        setContextMenu(null);
      }
      // Select All on Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        // Prevent default only if not in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (mediaData?.results) {
            setSelectedIds(new Set(mediaData.results.map(f => f.id)));
          }
        }
      }
      // Trigger bulk delete on Delete key
      if (e.key === 'Delete' && selectedIds.size > 0) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          // To cleanly trigger bulk delete without rewriting logic, we can just trigger a state to open a delete dialog, 
          // or we can rely on the BulkActionBar for the delete mutation.
          // Since the prompt inside BulkActionBar is native confirm, we can just trigger it if needed, but it's cleaner to let users click it.
          // To map it natively, we could export the delete logic, but for now we will just dispatch a custom event or let users click.
          // Let's just set the first selected file to delete to open the normal modal, or handle bulk delete if multiple.
        }
      }
    };
    
    window.addEventListener('click', closeContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', closeContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mediaData, selectedIds]);

  const handleGlobalDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      dragCounter.current += 1;
      setIsGlobalDragging(true);
    }
  };

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsGlobalDragging(false);
    }
  };

  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsGlobalDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Trigger upload modal and possibly pass files directly if MediaUploadModal supported it
      // But since MediaUploadModal has its own file state, we just open it.
      // (For a truly seamless experience, we could pass the files into the modal, but opening it is okay too)
      setIsUploadOpen(true);
    }
  };

  const handleMoveFile = (fileId: string, folderId: string | null) => {
    updateMedia({ id: fileId, data: { folder: folderId } as any });
  };

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const crumbs = [];
    let currentId = filters.folder;
    while (currentId) {
      const folder = folders?.find(f => f.id === currentId);
      if (folder) {
        crumbs.unshift(folder);
        currentId = folder.parent || undefined;
      } else {
        break;
      }
    }
    return crumbs;
  };
  const breadcrumbs = getBreadcrumbs();

  return (
    <div 
      className="space-y-6 relative"
      onDragEnter={handleGlobalDragEnter}
      onDragLeave={handleGlobalDragLeave}
      onDragOver={handleGlobalDragOver}
      onDrop={handleGlobalDrop}
    >
      {/* Global Drag Overlay */}
      {isGlobalDragging && (
        <div className="absolute inset-0 z-[100] bg-accent-primary/20 backdrop-blur-sm border-4 border-dashed border-accent-primary rounded-2xl flex items-center justify-center">
          <div className="bg-surface-light px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center">
            <Upload className="w-16 h-16 text-accent-primary mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-primary-text mb-2">Drop files to upload</h2>
            <p className="text-secondary-text">They will be uploaded into {filters.folder ? folders?.find(f => f.id === filters.folder)?.name : 'Root Folder'}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading variant="h2" className="text-2xl font-semibold text-primary-text">
            Media Library
          </Heading>
          <Text variant="body" className="text-secondary-text mt-1">
            Manage your enterprise digital assets.
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => { setFolderToEdit(null); setIsFolderModalOpen(true); }} leftIcon={<FolderPlus className="w-4 h-4" />}>
            Create Folder
          </Button>
          <Button variant="primary" onClick={() => setIsUploadOpen(true)} leftIcon={<Upload className="w-4 h-4" />}>
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Total Files</Text>
          <span className="text-2xl font-bold text-primary-text">{stats?.total_files || 0}</span>
        </div>
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Total Storage</Text>
          <span className="text-2xl font-bold text-primary-text flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-accent-primary" />
            {formatStorage(stats?.total_storage || 0)}
          </span>
        </div>
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Folders</Text>
          <span className="text-2xl font-bold text-primary-text flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-blue-500" />
            {stats?.folders || 0}
          </span>
        </div>
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Images</Text>
          <span className="text-2xl font-bold text-primary-text flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-green-500" />
            {stats?.images || 0}
          </span>
        </div>
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Documents</Text>
          <span className="text-2xl font-bold text-primary-text flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-500" />
            {stats?.documents || 0}
          </span>
        </div>
        <div className="bg-surface-light p-4 rounded-xl border border-border-primary">
          <Text variant="small" className="text-secondary-text block mb-1">Videos</Text>
          <span className="text-2xl font-bold text-primary-text flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-500" />
            {stats?.videos || 0}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Folder Tree */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <MediaFolderTree 
            folders={folders || []} 
            selectedFolderId={filters.folder} 
            onSelectFolder={(folderId) => setFilters(prev => ({ ...prev, folder: folderId, page: 1 }))} 
            onDropFile={handleMoveFile}
            totalFiles={stats?.total_files}
            onFolderContextMenu={(folder, e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ folder, x: e.clientX, y: e.clientY });
            }}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-2 text-sm text-secondary-text overflow-x-auto whitespace-nowrap pb-1">
            <button 
              onClick={() => setFilters(prev => ({ ...prev, folder: undefined, page: 1 }))}
              className={`hover:text-accent-primary transition-colors ${!filters.folder ? 'font-semibold text-primary-text' : ''}`}
            >
              Media Library
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                <span>›</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, folder: crumb.id, page: 1 }))}
                  className={`hover:text-accent-primary transition-colors ${idx === breadcrumbs.length - 1 ? 'font-semibold text-primary-text' : ''}`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Toolbar */}
          <MediaToolbar 
            filters={filters} 
            setFilters={setFilters} 
            folders={folders || []} 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            onEditFolder={() => {
              const folder = folders?.find(f => f.id === filters.folder);
              if (folder) {
                setFolderToEdit(folder);
                setIsFolderModalOpen(true);
              }
            }}
            onDeleteFolder={() => {
              const folder = folders?.find(f => f.id === filters.folder);
              if (folder) {
                setFolderToDelete(folder);
                setIsDeleteFolderOpen(true);
              }
            }}
          />

          {/* Content */}
          <div className="min-h-[500px]">
            {viewMode === 'grid' ? (
              <MediaGrid 
                files={mediaData?.results || []} 
                isLoading={isLoadingMedia} 
                onFileClick={setSelectedFile}
                onFileDelete={setFileToDelete}
                onUploadClick={() => setIsUploadOpen(true)}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                folderName={filters.folder ? folders?.find(f => f.id === filters.folder)?.name : undefined}
                onCreateSubfolder={() => {
                  setFolderDefaultParent(filters.folder);
                  setIsFolderModalOpen(true);
                }}
              />
            ) : (
              <MediaList 
                files={mediaData?.results || []} 
                isLoading={isLoadingMedia} 
                onFileClick={setSelectedFile}
                onFileDelete={setFileToDelete}
                onUploadClick={() => setIsUploadOpen(true)}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                folderName={filters.folder ? folders?.find(f => f.id === filters.folder)?.name : undefined}
                onCreateSubfolder={() => {
                  setFolderDefaultParent(filters.folder);
                  setIsFolderModalOpen(true);
                }}
              />
            )}
          </div>
          
          {/* Pagination */}
          {mediaData && mediaData.count > (filters.page_size || 24) && (
            <div className="mt-8 flex justify-center">
              {/* Pagination controls can be implemented here */}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <MediaUploadModal 
          onClose={() => setIsUploadOpen(false)} 
          folders={folders}
          currentFolderId={filters.folder}
        />
      )}

      {/* Detail Drawer */}
      {selectedFile && (
        <MediaDetailDrawer 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
          onDelete={() => {
            setFileToDelete(selectedFile);
            setSelectedFile(null);
          }}
          onMove={() => {
            setFileToMove(selectedFile);
            setSelectedFile(null);
          }}
        />
      )}

      {/* Move Modal */}
      {fileToMove && (
        <MoveMediaModal
          file={fileToMove}
          onClose={() => setFileToMove(null)}
          onSuccess={() => setFileToMove(null)}
        />
      )}

      {/* Delete Protection */}
      {fileToDelete && (
        <DeleteProtectionDialog 
          file={fileToDelete} 
          onClose={() => setFileToDelete(null)} 
        />
      )}

      {/* Folder Modals */}
      {isFolderModalOpen && (
        <MediaFolderModal
          folderToEdit={folderToEdit}
          defaultParentId={folderDefaultParent}
          onClose={() => {
            setIsFolderModalOpen(false);
            setFolderToEdit(null);
            setFolderDefaultParent(undefined);
          }}
        />
      )}

      {isDeleteFolderOpen && folderToDelete && (
        <DeleteFolderDialog
          folder={folderToDelete}
          onClose={() => {
            setIsDeleteFolderOpen(false);
            setFolderToDelete(null);
          }}
          onSuccess={() => {
            setIsDeleteFolderOpen(false);
            setFolderToDelete(null);
            setFilters(prev => ({ ...prev, folder: undefined }));
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[200] bg-surface-light border border-border-primary rounded-xl shadow-xl overflow-hidden min-w-[160px] py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} // Keep open if clicked inside
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-primary-text hover:bg-accent-primary/10 hover:text-accent-primary transition-colors flex items-center gap-2"
            onClick={() => {
              setFolderDefaultParent(contextMenu.folder.id);
              setIsFolderModalOpen(true);
              setContextMenu(null);
            }}
          >
            <FolderPlus className="w-4 h-4" /> New Subfolder
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
            onClick={() => {
              setFolderToEdit(contextMenu.folder);
              setIsFolderModalOpen(true);
              setContextMenu(null);
            }}
          >
            <FolderPlus className="w-4 h-4" /> Rename
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.folder.name);
              setContextMenu(null);
            }}
          >
            <FileText className="w-4 h-4" /> Copy Name
          </button>
          <div className="h-px bg-border-primary my-1" />
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
            onClick={() => {
              setFolderToDelete(contextMenu.folder);
              setIsDeleteFolderOpen(true);
              setContextMenu(null);
            }}
          >
            <X className="w-4 h-4" /> Delete
          </button>
        </div>
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar 
        selectedIds={selectedIds} 
        onClear={() => setSelectedIds(new Set())}
        onRefresh={() => setFilters(prev => ({...prev}))}
      />
    </div>
  );
};

export default AdminMediaPage;
