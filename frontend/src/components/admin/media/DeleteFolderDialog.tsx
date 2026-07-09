import React from 'react';
import { useDeleteMediaFolder, useMediaFiles } from '../../../hooks/useMedia';
import type { MediaFolder } from '../../../services/media.service';
import Button from '../../ui/Button';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteFolderDialogProps {
  folder: MediaFolder;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteFolderDialog: React.FC<DeleteFolderDialogProps> = ({ folder, onClose, onSuccess }) => {
  // Check if folder contains any files
  const { data: filesData, isLoading: isLoadingFiles } = useMediaFiles({ folder: folder.id, page_size: 1 });
  const { mutate: deleteFolder, isPending: isDeleting } = useDeleteMediaFolder();

  const fileCount = filesData?.count || 0;
  const hasFiles = fileCount > 0;

  const handleDelete = () => {
    deleteFolder(folder.id, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${hasFiles ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary-text">
                {hasFiles ? 'Folder Not Empty' : 'Delete Folder?'}
              </h3>
              
              <div className="text-sm text-secondary-text">
                {isLoadingFiles ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />
                    Checking folder contents...
                  </div>
                ) : hasFiles ? (
                  <div className="space-y-4">
                    <p>
                      The folder <span className="font-medium text-primary-text">{folder.name}</span> contains <strong className="text-primary-text">{fileCount} files</strong>.
                    </p>
                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg p-3">
                      <p>You cannot delete a folder that contains files. Please move or delete the files inside it first.</p>
                    </div>
                  </div>
                ) : (
                  <p>
                    Are you sure you want to delete <span className="font-medium text-primary-text">{folder.name}</span>? This action cannot be undone.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-border-primary flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            {hasFiles ? 'Close' : 'Cancel'}
          </Button>
          {!hasFiles && (
            <Button 
              variant="primary" 
              onClick={handleDelete} 
              disabled={isDeleting || isLoadingFiles}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500/20"
              leftIcon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            >
              {isDeleting ? 'Deleting...' : 'Delete Folder'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DeleteFolderDialog;
