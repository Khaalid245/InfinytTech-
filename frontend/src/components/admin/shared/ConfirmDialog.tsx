import Button from '../../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  variant?: 'danger' | 'primary' | 'default';
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', variant = 'danger' }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-light border border-border-primary rounded-xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-primary-text mb-2">{title}</h3>
        <p className="text-sm text-secondary-text mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              variant === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : variant === 'default'
                ? 'bg-primary-text hover:opacity-90 text-primary-bg'
                : 'bg-accent-primary hover:bg-accent-secondary text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
