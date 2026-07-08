import React from 'react';
import { Trash2, Globe, Lock, Star, StarOff, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onPublish: () => void;
  onDraft: () => void;
  onDelete: () => void;
  onFeature: () => void;
  onUnfeature: () => void;
  isProcessing: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClear,
  onPublish,
  onDraft,
  onDelete,
  onFeature,
  onUnfeature,
  isProcessing
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="bg-surface-light border border-accent-primary/30 shadow-2xl rounded-full px-4 py-3 flex items-center gap-4">
        
        {/* Count & Clear */}
        <div className="flex items-center gap-2 pr-4 border-r border-border-primary">
          <span className="bg-accent-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {selectedCount}
          </span>
          <span className="text-sm font-medium text-primary-text hidden sm:inline">Selected</span>
          <button 
            onClick={onClear}
            disabled={isProcessing}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors disabled:opacity-50"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={onPublish}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-secondary-text hover:text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </button>

          <button 
            onClick={onDraft}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-secondary-text hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Draft</span>
          </button>

          <div className="w-px h-5 bg-border-primary mx-1" />

          <button 
            onClick={onFeature}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-secondary-text hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Feature</span>
          </button>
          
          <button 
            onClick={onUnfeature}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-secondary-text hover:text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <StarOff className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-border-primary mx-1" />

          <button 
            onClick={onDelete}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-secondary-text hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkActionsBar;
