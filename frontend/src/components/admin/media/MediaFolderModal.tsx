import React, { useState, useEffect } from 'react';
import { useCreateMediaFolder, useUpdateMediaFolder, useMediaFolders } from '../../../hooks/useMedia';
import type { MediaFolder } from '../../../services/media.service';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { X, Folder, Loader2, Plus } from 'lucide-react';

interface MediaFolderModalProps {
  onClose: (folder?: MediaFolder) => void;
  folderToEdit?: MediaFolder | null;
  defaultParentId?: string;
}

const MediaFolderModal: React.FC<MediaFolderModalProps> = ({ onClose, folderToEdit, defaultParentId }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>(defaultParentId || '');
  const [isNestedCreateOpen, setIsNestedCreateOpen] = useState(false);
  
  const { data: folders } = useMediaFolders();
  const { mutate: createFolder, isPending: isCreating } = useCreateMediaFolder();
  const { mutate: updateFolder, isPending: isUpdating } = useUpdateMediaFolder();

  const isEditing = !!folderToEdit;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setSlug(folderToEdit.slug || '');
      setParentId(folderToEdit.parent || '');
    }
  }, [folderToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      updateFolder(
        { id: folderToEdit.id, data: { name: name.trim(), slug: slug.trim() || undefined, parent: parentId || null } as any },
        { onSuccess: (data) => onClose(data) }
      );
    } else {
      createFolder(
        { name: name.trim(), slug: slug.trim() || undefined, parentId: parentId || undefined },
        { onSuccess: (data) => onClose(data) }
      );
    }
  };

  // Filter out the current folder from parents list to prevent circular references
  const availableParents = folders?.filter(f => !isEditing || f.id !== folderToEdit.id) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-primary-text flex items-center gap-2">
            <Folder className="w-5 h-5 text-secondary-text" />
            {isEditing ? 'Rename Folder' : 'Create Folder'}
          </h2>
          <button type="button" onClick={() => onClose()} className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input 
              label="Folder Name"
              placeholder="e.g. Hero Images"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <Input 
              label="Slug (Optional)"
              placeholder="e.g. hero-images"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-primary-text">Parent Folder (Optional)</label>
              <div className="flex gap-2">
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="flex-1 bg-surface-light border border-border-primary rounded-lg px-3 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                >
                  <option value="">None (Root Level)</option>
                  {availableParents.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsNestedCreateOpen(true)}
                  title="Create New Parent Folder"
                  className="p-2 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg text-secondary-text hover:text-primary-text hover:bg-surface-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-border-primary flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => onClose()} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isPending || !name.trim()} leftIcon={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}>
              {isPending ? 'Saving...' : 'Save Folder'}
            </Button>
          </div>
        </form>

      </div>

      {isNestedCreateOpen && (
        <MediaFolderModal
          onClose={(newFolder) => {
            setIsNestedCreateOpen(false);
            if (newFolder) {
              setParentId(newFolder.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default MediaFolderModal;
