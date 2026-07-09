import React, { useState } from 'react';
import type { MediaFolder } from '../../../services/media.service';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

interface MediaFolderTreeProps {
  folders: MediaFolder[];
  selectedFolderId?: string;
  onSelectFolder: (folderId: string | undefined) => void;
  onDropFile?: (fileId: string, folderId: string | null) => void;
  onFolderContextMenu?: (folder: MediaFolder, e: React.MouseEvent) => void;
  totalFiles?: number;
}

interface FolderNode extends MediaFolder {
  children: FolderNode[];
}

const MediaFolderTree: React.FC<MediaFolderTreeProps> = ({ folders, selectedFolderId, onSelectFolder, onDropFile, onFolderContextMenu, totalFiles }) => {
  // Build tree from flat list
  const buildTree = (): FolderNode[] => {
    const nodeMap = new Map<string, FolderNode>();
    const roots: FolderNode[] = [];

    // Initialize all nodes
    folders.forEach(f => {
      nodeMap.set(f.id, { ...f, children: [] });
    });

    // Populate children
    folders.forEach(f => {
      if (f.parent && nodeMap.has(f.parent)) {
        nodeMap.get(f.parent)!.children.push(nodeMap.get(f.id)!);
      } else {
        roots.push(nodeMap.get(f.id)!);
      }
    });

    return roots;
  };

  const tree = buildTree();

  return (
    <div className="bg-surface-light border border-border-primary rounded-xl p-4 min-h-[400px]">
      <h3 className="text-sm font-semibold text-secondary-text uppercase tracking-wider mb-4 px-2">Folders</h3>
      
      <div className="space-y-1">
        <button
          onClick={() => onSelectFolder(undefined)}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => {
            e.preventDefault();
            
            const fileIdsRaw = e.dataTransfer.getData('mediaIds');
            if (fileIdsRaw && onDropFile) {
              try {
                const fileIds = JSON.parse(fileIdsRaw);
                if (Array.isArray(fileIds)) {
                  fileIds.forEach(id => onDropFile(id, null));
                  return;
                }
              } catch (err) {}
            }

            const fileId = e.dataTransfer.getData('mediaId');
            if (fileId && onDropFile) onDropFile(fileId, null);
          }}
          className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            !selectedFolderId 
              ? 'bg-accent-primary/10 text-accent-primary font-medium' 
              : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span className="truncate">All Media</span>
          {totalFiles !== undefined && (
            <span className="ml-auto text-xs opacity-50 shrink-0">({totalFiles})</span>
          )}
        </button>

        {tree.map(node => (
          <TreeNode 
            key={node.id} 
            node={node} 
            selectedId={selectedFolderId} 
            onSelect={onSelectFolder} 
            onDropFile={onDropFile}
            onFolderContextMenu={onFolderContextMenu}
          />
        ))}
        
        {folders.length === 0 && (
          <div className="text-xs text-secondary-text px-2 py-4 italic">
            No folders created yet.
          </div>
        )}
      </div>
    </div>
  );
};

const TreeNode: React.FC<{
  node: FolderNode;
  selectedId?: string;
  onSelect: (id: string) => void;
  onDropFile?: (fileId: string, folderId: string) => void;
  onFolderContextMenu?: (folder: MediaFolder, e: React.MouseEvent) => void;
  depth?: number;
}> = ({ node, selectedId, onSelect, onDropFile, onFolderContextMenu, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
          isSelected || isDragOver
            ? 'bg-accent-primary/10 text-accent-primary font-medium ring-1 ring-accent-primary' 
            : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
        }`}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        onClick={() => onSelect(node.id)}
        onContextMenu={(e) => {
          if (onFolderContextMenu) {
            onFolderContextMenu(node, e);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);

          const fileIdsRaw = e.dataTransfer.getData('mediaIds');
          if (fileIdsRaw && onDropFile) {
            try {
              const fileIds = JSON.parse(fileIdsRaw);
              if (Array.isArray(fileIds)) {
                fileIds.forEach(id => onDropFile(id, node.id));
                return;
              }
            } catch (err) {}
          }

          const fileId = e.dataTransfer.getData('mediaId');
          if (fileId && onDropFile) onDropFile(fileId, node.id);
        }}
      >
        {hasChildren ? (
          <button 
            className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-4.5" /> // Spacer for alignment when no children
        )}
        
        {isExpanded && hasChildren ? (
          <FolderOpen className="w-4 h-4" />
        ) : (
          <Folder className="w-4 h-4" />
        )}
        <span className="truncate">{node.name}</span>
        {node.file_count !== undefined && (
          <span className="ml-auto text-xs opacity-50 shrink-0">({node.file_count})</span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="space-y-1">
          {node.children.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              selectedId={selectedId} 
              onSelect={onSelect}
              onDropFile={onDropFile}
              onFolderContextMenu={onFolderContextMenu}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaFolderTree;
