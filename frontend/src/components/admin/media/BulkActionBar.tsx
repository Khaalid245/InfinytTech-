import React, { useState } from 'react';
import { X, FolderInput, Trash2, Loader2 } from 'lucide-react';
import { useDeleteMedia, useUpdateMedia } from '../../../hooks/useMedia';

interface BulkActionBarProps {
  selectedIds: Set<string>;
  onClear: () => void;
  onRefresh: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedIds, onClear, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  
  const { mutateAsync: deleteMedia } = useDeleteMedia();
  const { mutateAsync: updateMedia } = useUpdateMedia();

  if (selectedIds.size === 0) return null;

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} items? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteMedia(id)));
      onClear();
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkMove = async () => {
    const targetFolderId = prompt('Enter Destination Folder ID (or leave blank for Root):');
    if (targetFolderId === null) return; // cancelled
    
    setIsMoving(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => updateMedia({ id, data: { folder: targetFolderId || null } as any })));
      onClear();
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-slide-up">
      <div className="bg-primary-text text-surface-light px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm bg-accent-primary text-white px-2 py-0.5 rounded-md">
            {selectedIds.size}
          </span>
          <span className="text-sm font-medium">items selected</span>
        </div>
        
        <div className="w-px h-6 bg-white/20" />

        <div className="flex items-center gap-2">
          <button 
            disabled={isMoving || isDeleting}
            onClick={handleBulkMove}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-sm disabled:opacity-50"
            title="Move Selected"
          >
            {isMoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderInput className="w-4 h-4" />}
            Move
          </button>
          <button 
            disabled={isMoving || isDeleting}
            onClick={handleBulkDelete}
            className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center gap-1.5 text-sm disabled:opacity-50"
            title="Delete Selected"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>

        <div className="w-px h-6 bg-white/20" />
        
        <button 
          onClick={onClear}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          title="Clear Selection (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};

export default BulkActionBar;
