import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Clock, Edit2, Save } from 'lucide-react';
import type { Lead, LeadTimelineEvent } from '../../../types/leads';
import { useUpdateLead } from '../../../hooks/useLeadsAdmin';
import { useUsers } from '../../../hooks/useUsers';
import { useAdminServices } from '../../../hooks/useServices';
import Combobox from '../../ui/Combobox';
import Label from '../../ui/Label';
import Input from '../../ui/Input';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function LeadDrawer({ lead, isOpen, onClose }: LeadDrawerProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const updateLead = useUpdateLead();
  const { data: usersData } = useUsers();
  const { data: servicesData } = useAdminServices();

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({});
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (serviceId: string) => {
    setFormData((prev) => {
      const currentServices = prev.services || [];
      if (currentServices.includes(serviceId)) {
        return { ...prev, services: currentServices.filter(id => id !== serviceId) };
      }
      return { ...prev, services: [...currentServices, serviceId] };
    });
  };

  const handleSave = () => {
    if (!lead?.id) return;
    updateLead.mutate({ id: lead.id, data: formData }, {
      onSuccess: () => {
        // Timeline gets re-fetched via react-query invalidation
      }
    });
  };

  const teamOptions = usersData?.map((user: any) => ({
    value: user.id, // Maps to Lead.assigned_to
    label: `${user.first_name} ${user.last_name}`,
    subtitle: user.role || user.email,
  })) || [];

  if (!isOpen || !lead) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface-light border-l border-border-primary shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border-primary bg-surface-light shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary-text">{lead.first_name} {lead.last_name}</h2>
            <p className="text-sm text-secondary-text mt-1">{lead.company || lead.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={updateLead.isPending}
              className="px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:bg-accent-secondary transition-colors flex items-center gap-2"
            >
              {updateLead.isPending ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Attributes */}
          <div className="grid grid-cols-2 gap-4">
            <Combobox
              label="Status"
              options={statusOptions}
              value={formData.status || ''}
              onChange={(val) => setFormData(prev => ({ ...prev, status: val as any }))}
            />
            <Combobox
              label="Priority"
              options={priorityOptions}
              value={formData.priority || ''}
              onChange={(val) => setFormData(prev => ({ ...prev, priority: val as any }))}
            />
          </div>

          <hr className="border-border-primary/50" />

          {/* Contact Information */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input name="first_name" value={formData.first_name || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input name="last_name" value={formData.last_name || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>Country</Label>
                <Input name="country" value={formData.country || ''} onChange={handleChange} />
              </div>
            </div>
          </section>

          <hr className="border-border-primary/50" />

          {/* Company Information */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input name="company" value={formData.company || ''} onChange={handleChange} />
              </div>
              <div>
                <Label>Industry</Label>
                <Input name="industry" value={formData.industry || ''} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <Label>Website</Label>
                <Input type="url" name="website" value={formData.website || ''} onChange={handleChange} />
              </div>
            </div>
          </section>

          <hr className="border-border-primary/50" />

          {/* Interested Services */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Interested Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {servicesData?.results.map((service: any) => (
                <label key={service.id} className="flex items-center gap-3 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-accent-primary bg-transparent border-border-primary rounded focus:ring-accent-primary"
                    checked={formData.services?.includes(service.id) || false}
                    onChange={() => handleServicesChange(service.id)}
                  />
                  <span className="text-sm text-primary-text">{service.title}</span>
                </label>
              ))}
              {!servicesData?.results?.length && (
                <p className="text-sm text-secondary-text">No services found.</p>
              )}
            </div>
          </section>

          <hr className="border-border-primary/50" />

          {/* Assignment */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Assignment
            </h3>
            <Combobox
              label="Assign To"
              options={teamOptions}
              value={formData.assigned_to || ''}
              onChange={(val) => setFormData(prev => ({ ...prev, assigned_to: val }))}
              placeholder="Unassigned"
            />
          </section>

          <hr className="border-border-primary/50" />

          {/* Notes */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-4 flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Internal Notes
            </h3>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Add internal markdown notes here..."
              className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg text-sm text-primary-text focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary transition-colors resize-none"
            />
          </section>

          <hr className="border-border-primary/50" />

          {/* Timeline */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Activity Timeline
            </h3>
            <div className="relative border-l border-border-primary ml-3 space-y-6">
              {lead.timeline?.map((event: LeadTimelineEvent) => (
                <div key={event.id} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent-primary ring-4 ring-surface-light" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-secondary-text uppercase tracking-wider mb-1">
                      {event.action.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-primary-text mb-1">{event.description}</p>
                    <span className="text-xs text-secondary-text/60">
                      {new Date(event.created_at).toLocaleString()} • by {event.created_by_name}
                    </span>
                  </div>
                </div>
              ))}
              {(!lead.timeline || lead.timeline.length === 0) && (
                <p className="text-sm text-secondary-text pl-6">No timeline events recorded yet.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
