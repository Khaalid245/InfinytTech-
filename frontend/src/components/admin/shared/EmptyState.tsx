import type { LucideIcon } from 'lucide-react';
import Button from '../../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-text" />
      </div>
      <h3 className="text-lg font-bold text-primary-text mb-2">{title}</h3>
      <p className="text-sm text-secondary-text mb-6 max-w-md">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
