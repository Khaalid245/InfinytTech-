import React from 'react';
import { useDeleteMedia, useMediaUsage } from '../../../hooks/useMedia';
import type { MediaFile } from '../../../services/media.service';
import Button from '../../ui/Button';
import { AlertTriangle, Trash2, Loader2, Link2 } from 'lucide-react';

interface DeleteProtectionDialogProps {
  file: MediaFile;
  onClose: () => void;
}

const DeleteProtectionDialog: React.FC<DeleteProtectionDialogProps> = ({ file, onClose }) => {
  const { data: usageData, isLoading: isLoadingUsage } = useMediaUsage(file.id, { enabled: !!file.id });
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia();

  const isUsed = usageData && Object.keys(usageData).length > 0;

  const handleDelete = () => {
    deleteMedia(file.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${isUsed ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary-text">
                {isUsed ? 'Asset is Currently in Use' : 'Delete Asset?'}
              </h3>
              
              <div className="text-sm text-secondary-text">
                {isLoadingUsage ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />
                    Inspecting usage across CMS...
                  </div>
                ) : isUsed ? (
                  <div className="space-y-4">
                    <p>
                      This asset (<span className="font-medium text-primary-text">{file.title || file.original_filename}</span>) is currently used by other modules.
                    </p>
                    <div className="bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg p-4">
                      <ul className="space-y-2">
                        {Object.entries(usageData).map(([moduleName, count]) => (
                          <li key={moduleName} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-primary-text font-medium">
                              <Link2 className="w-3.5 h-3.5 text-secondary-text" />
                              {moduleName}
                            </span>
                            <span className="bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded text-xs font-bold">
                              {count}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-orange-500 font-medium">Deleting it will result in broken media links.</p>
                  </div>
                ) : (
                  <p>
                    Are you sure you want to delete <span className="font-medium text-primary-text">{file.title || file.original_filename}</span>? This action cannot be undone.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-border-primary flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDelete} 
            disabled={isDeleting || isLoadingUsage}
            className={isUsed ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500/20' : 'bg-red-500 hover:bg-red-600 focus:ring-red-500/20'}
            leftIcon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          >
            {isDeleting ? 'Deleting...' : isUsed ? 'Force Delete Anyway' : 'Delete Asset'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DeleteProtectionDialog;
