import React, { useState, useRef, useCallback } from 'react';
import { useUploadMedia } from '../../../hooks/useMedia';
import Button from '../../ui/Button';
import { X, UploadCloud, File as FileIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { MediaFolder } from '../../../services/media.service';

interface MediaUploadModalProps {
  onClose: () => void;
  folders?: MediaFolder[];
  currentFolderId?: string;
}

interface UploadJob {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  previewUrl?: string;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ onClose, folders = [], currentFolderId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [destinationFolderId, setDestinationFolderId] = useState<string>(currentFolderId || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadMedia } = useUploadMedia();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const newJobs = files.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'pending' as const,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined
      };
    });
    setJobs(prev => [...prev, ...newJobs]);
    newJobs.forEach(job => startUpload(job));
  };

  const startUpload = async (job: UploadJob) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'uploading' } : j));
    
    try {
      await uploadMedia({
        file: job.file,
        folderId: destinationFolderId || undefined,
        onProgress: (p) => {
          setJobs(prev => prev.map(j => j.id === job.id ? { ...j, progress: p } : j));
        }
      });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success', progress: 100 } : j));
    } catch (err: any) {
      const errorMsg = err.response?.data?.data?.file?.[0] || err.message || 'Upload failed';
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'error', error: errorMsg } : j));
    }
  };

  const removeJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const isUploading = jobs.some(j => j.status === 'uploading');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-border-primary shrink-0">
          <h2 className="text-lg font-semibold text-primary-text">Upload Media</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-secondary-text whitespace-nowrap">Destination:</label>
              <select
                value={destinationFolderId}
                onChange={(e) => setDestinationFolderId(e.target.value)}
                disabled={isUploading}
                className="bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-2 py-1.5 text-sm text-primary-text focus:border-accent-primary outline-none transition-colors max-w-[200px]"
              >
                <option value="">Root Folder</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            {!isUploading && (
              <button onClick={onClose} className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dropzone */}
          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors
              ${isDragging ? 'border-accent-primary bg-accent-primary/5' : 'border-border-primary hover:border-secondary-text'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-accent-primary' : 'text-secondary-text'}`} />
            <h3 className="text-lg font-medium text-primary-text mb-2">Drag and drop files here</h3>
            <p className="text-sm text-secondary-text mb-4">Or click to browse from your computer</p>
            <div className="text-xs text-secondary-text/70">
              Supports Images, Videos, and PDF Documents up to 50MB
            </div>
          </div>

          {/* Job List */}
          {jobs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary-text uppercase tracking-wider mb-2">Upload Queue</h4>
              {jobs.map(job => (
                <div key={job.id} className="bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg p-3 flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-light rounded-md border border-border-primary overflow-hidden flex items-center justify-center shrink-0">
                    {job.previewUrl ? (
                      <img src={job.previewUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <FileIcon className="w-5 h-5 text-secondary-text" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-primary-text truncate pr-4">{job.file.name}</span>
                      {job.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                      {job.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      {job.status === 'uploading' && <Loader2 className="w-4 h-4 text-accent-primary animate-spin shrink-0" />}
                    </div>
                    
                    {job.status === 'error' ? (
                      <span className="text-xs text-red-500">{job.error}</span>
                    ) : (
                      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${job.status === 'success' ? 'bg-green-500' : 'bg-accent-primary'}`} 
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {job.status !== 'uploading' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeJob(job.id); }}
                      className="p-1.5 text-secondary-text hover:text-red-500 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-primary bg-black/5 dark:bg-white/5 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isUploading}>
            {jobs.length > 0 && !isUploading ? 'Close' : 'Cancel'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default MediaUploadModal;
