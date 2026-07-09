import React, { useState } from 'react';
import { useUpdateMedia, useMediaFolders } from '../../../hooks/useMedia';
import type { MediaFile } from '../../../services/media.service';
import Button from '../../ui/Button';
import { FolderInput, X, Loader2 } from 'lucide-react';

interface MoveMediaModalProps {
  file: MediaFile;
  onClose: () => void;
  onSuccess: () => void;
}

const MoveMediaModal: React.FC<MoveMediaModalProps> = ({ file, onClose, onSuccess }) => {
  const [folderId, setFolderId] = useState<string>(file.folder || '');
  
  const { data: folders, isLoading: isLoadingFolders } = useMediaFolders();
  const { mutate: updateMedia, isPending } = useUpdateMedia();

  const handleMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderId === (file.folder || '')) {
      onClose();
      return;
    }

    updateMedia(
      { id: file.id, data: { folder: folderId || null } as any },
      { onSuccess: () => {
          onSuccess();
          onClose();
        } 
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-primary-text flex items-center gap-2">
            <FolderInput className="w-5 h-5 text-secondary-text" />
            Move Asset
          </h2>
          <button onClick={onClose} className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleMove}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-secondary-text mb-2">
              Select a new destination folder for <span className="font-medium text-primary-text">{file.title || file.original_filename}</span>.
            </p>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-primary-text">Destination Folder</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                disabled={isLoadingFolders}
                className="w-full bg-surface-light border border-border-primary rounded-lg px-3 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
              >
                <option value="">None (Root Level)</option>
                {folders?.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-border-primary flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isPending || isLoadingFolders} leftIcon={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}>
              {isPending ? 'Moving...' : 'Move File'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default MoveMediaModal;
