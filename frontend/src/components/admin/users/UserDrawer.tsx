import React, { useState, useEffect } from 'react';
import { X, UserIcon, Shield, Clock, Key, Save, AlertTriangle } from 'lucide-react';
import { useAdminUser, useCreateUser, useUpdateUser, useAdminUserActivity, useToggleUserStatus, useResetUserPassword } from '../../../hooks/useUsersAdmin';
import type { User, UserRole } from '../../../types/users';
import Label from '../../ui/Label';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Combobox from '../../ui/Combobox';
import SkeletonTable from '../shared/SkeletonTable';

interface UserDrawerProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

export default function UserDrawer({ userId, isOpen, onClose }: UserDrawerProps) {
  const isEditing = !!userId;
  const { data: user, isLoading: isUserLoading } = useAdminUser(userId);
  const { data: activities, isLoading: isActivitiesLoading } = useAdminUserActivity(userId);
  
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({ role: 'viewer', is_active: true });
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'security' | 'activity'>('profile');
  
  const [newPassword, setNewPassword] = useState('');

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();
  const resetPassword = useResetUserPassword();

  useEffect(() => {
    if (user && isEditing) {
      setFormData(user);
    } else if (!isEditing) {
      setFormData({ role: 'viewer', is_active: true });
    }
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing && userId) {
      updateUser.mutate({ id: userId, data: formData }, {
        onSuccess: () => onClose()
      });
    } else {
      createUser.mutate(formData, {
        onSuccess: () => onClose()
      });
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || !userId) return;
    resetPassword.mutate({ id: userId, password: newPassword }, {
      onSuccess: () => setNewPassword('')
    });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 right-0 h-screen w-full max-w-xl bg-surface-light border-l border-border-primary z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-primary shrink-0 bg-surface-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0 border border-accent-primary/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-text">
                {isEditing ? formData.full_name || 'Edit User' : 'New User'}
              </h2>
              <p className="text-sm text-secondary-text">
                {isEditing ? formData.email : 'Create a new user profile'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={createUser.isPending || updateUser.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-text text-primary-bg rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-primary px-6 mt-2 shrink-0 overflow-x-auto scrollbar-hide">
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon className="w-4 h-4" /> Profile Info
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'permissions' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Shield className="w-4 h-4" /> Roles & Depts
          </button>
          {isEditing && (
            <>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'security' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
                onClick={() => setActiveTab('security')}
              >
                <Key className="w-4 h-4" /> Security
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'activity' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
                onClick={() => setActiveTab('activity')}
              >
                <Clock className="w-4 h-4" /> Activity
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isUserLoading ? (
            <SkeletonTable columns={1} rows={4} />
          ) : (
            <>
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input name="first_name" value={formData.first_name || ''} onChange={handleChange} />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input name="last_name" value={formData.last_name || ''} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                  </div>
                  
                  {!isEditing && (
                    <div>
                      <Label>Initial Password</Label>
                      <Input type="password" name="password" value={formData.password || ''} onChange={handleChange} />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'permissions' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label>Role</Label>
                    <Combobox
                      label=""
                      options={roleOptions}
                      value={formData.role || ''}
                      onChange={(val) => setFormData(prev => ({ ...prev, role: val as UserRole }))}
                      placeholder="Select Role"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input name="department" value={formData.department || ''} onChange={handleChange} placeholder="e.g. Engineering, Sales" />
                  </div>

                  {formData.role && (
                    <div className="mt-8 p-4 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg">
                      <h4 className="text-sm font-bold text-primary-text flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4" /> Permissions Preview
                      </h4>
                      <p className="text-xs text-secondary-text mb-4">
                        Users assigned the <strong>{roleOptions.find(r => r.value === formData.role)?.label}</strong> role receive the following baseline permissions:
                      </p>
                      <ul className="space-y-2 text-sm text-secondary-text">
                        {formData.role === 'super_admin' && <li>✓ Full unrestricted access to all modules and system settings.</li>}
                        {formData.role === 'admin' && <li>✓ Access to all modules, cannot manage other Admins or System Settings.</li>}
                        {formData.role === 'editor' && <li>✓ Create, edit, and delete Blog Posts, Portfolio items, and Media.</li>}
                        {formData.role === 'sales' && <li>✓ Full access to Leads CRM, read-only access to Portfolio.</li>}
                        {formData.role === 'viewer' && <li>✓ Read-only access to basic dashboards.</li>}
                        {['hr', 'content_manager'].includes(formData.role) && <li>✓ Standard department-specific permissions applied.</li>}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && isEditing && (
                <div className="space-y-8 animate-fade-in">
                  <div className="p-4 border border-border-primary rounded-lg space-y-4">
                    <h3 className="text-sm font-bold text-primary-text">Reset Password</h3>
                    <p className="text-sm text-secondary-text">Force a new password for this user. They will need to use this to log in next.</p>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <Button variant="secondary" onClick={handleResetPassword} isLoading={resetPassword.isPending}>Reset</Button>
                    </div>
                  </div>

                  <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg space-y-4">
                    <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Account Status
                    </h3>
                    <p className="text-sm text-red-500/80">
                      {user?.is_active ? 'Deactivating this user will instantly revoke their access to the system.' : 'This account is currently deactivated and cannot log in.'}
                    </p>
                    <Button 
                      variant="primary" 
                      className={`w-full ${user?.is_active ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      onClick={() => userId && toggleStatus.mutate(userId)}
                      isLoading={toggleStatus.isPending}
                    >
                      {user?.is_active ? 'Deactivate User' : 'Reactivate User'}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && isEditing && (
                <div className="space-y-6 animate-fade-in">
                  <div className="relative border-l border-border-primary ml-3 space-y-6">
                    {isActivitiesLoading ? (
                      <SkeletonTable columns={1} rows={3} />
                    ) : activities?.length ? (
                      activities.map(activity => (
                        <div key={activity.id} className="relative pl-6">
                          <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent-primary ring-4 ring-surface-light" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-secondary-text uppercase tracking-wider mb-1">
                              {activity.action.replace('_', ' ')}
                            </span>
                            <p className="text-sm text-primary-text mb-1">{activity.description}</p>
                            <span className="text-xs text-secondary-text/60">
                              {new Date(activity.created_at).toLocaleString()} • IP: {activity.ip_address || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-secondary-text pl-6">No activity recorded for this user.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
