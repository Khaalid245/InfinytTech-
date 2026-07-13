import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Checkbox from '../../ui/Checkbox';
import type { Department } from '../../../types/team';
import { useCreateDepartment, useUpdateDepartment } from '../../../hooks/useTeamAdmin';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, department }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const { mutateAsync: createDepartment, isPending: isCreating } = useCreateDepartment();
  const { mutateAsync: updateDepartment, isPending: isUpdating } = useUpdateDepartment();

  useEffect(() => {
    if (department) {
      setName(department.name);
      setSlug(department.slug);
      setDescription(department.description);
      setDisplayOrder(department.display_order);
      setIsActive(department.is_active);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setDisplayOrder(0);
      setIsActive(true);
    }
  }, [department, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        slug,
        description,
        display_order: displayOrder,
        is_active: isActive,
      };

      if (department) {
        await updateDepartment({ id: department.id, data: payload });
      } else {
        await createDepartment(payload);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save department', error);
      // Handle error gracefully in real app (toast)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-light border border-border-primary rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <h2 className="text-xl font-semibold text-primary-text">
            {department ? 'Edit Department' : 'Create Department'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="dept-form" onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Name" 
              required 
              value={name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
              placeholder="e.g. Engineering"
            />
            <Input 
              label="Slug" 
              value={slug} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)} 
              placeholder="Auto-generated if left blank"
            />
            <TextArea 
              label="Description" 
              value={description} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
            />
            <Input 
              label="Display Order" 
              type="number" 
              value={displayOrder.toString()} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayOrder(parseInt(e.target.value) || 0)} 
            />
            <Checkbox 
              label="Active"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </form>
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3 bg-black/2 dark:bg-white/2 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="dept-form"
            isLoading={isCreating || isUpdating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
