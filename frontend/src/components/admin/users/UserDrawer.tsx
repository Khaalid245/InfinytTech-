import React, { useState, useEffect } from 'react';
import { X, UserIcon, Shield, Clock, Key, Save, AlertTriangle } from 'lucide-react';
import { useAdminUser, useCreateUser, useUpdateUser, useAdminUserActivity, useToggleUserStatus, useResetUserPassword, useUnlockUser } from '../../../hooks/useUsersAdmin';
import type { User, UserRole } from '../../../types/users';
import Label from '../../ui/Label';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Combobox from '../../ui/Combobox';
import SkeletonTable from '../shared/SkeletonTable';
import PasswordChecklist from '../../ui/PasswordChecklist';
import ConfirmDialog from '../shared/ConfirmDialog';

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

const MODULE_PERMISSIONS = {
  super_admin: {
    dashboard: true,
    portfolio: true,
    blog: true,
    media: true,
    team: true,
    crm: true,
    testimonials: true,
    settings: true,
    manage_super: true,
  },
  admin: {
    dashboard: true,
    portfolio: true,
    blog: true,
    media: true,
    team: true,
    crm: true,
    testimonials: true,
    settings: false,
    manage_super: false,
  },
  content_manager: {
    dashboard: true,
    portfolio: true,
    blog: true,
    media: true,
    team: true,
    crm: false,
    testimonials: true,
    settings: false,
    manage_super: false,
  },
  editor: {
    dashboard: true,
    portfolio: true,
    blog: true,
    media: true,
    team: false,
    crm: false,
    testimonials: false,
    settings: false,
    manage_super: false,
  },
  sales: {
    dashboard: true,
    portfolio: true,
    blog: false,
    media: false,
    team: false,
    crm: true,
    testimonials: true,
    settings: false,
    manage_super: false,
  },
  hr: {
    dashboard: true,
    portfolio: false,
    blog: false,
    media: false,
    team: true,
    crm: false,
    testimonials: false,
    settings: false,
    manage_super: false,
  },
  viewer: {
    dashboard: true,
    portfolio: false,
    blog: false,
    media: false,
    team: false,
    crm: false,
    testimonials: false,
    settings: false,
    manage_super: false,
  },
};

const PERMISSION_LABELS = {
  dashboard: 'Dashboard Module',
  portfolio: 'Portfolio Projects',
  blog: 'Blog Articles',
  media: 'Media Library',
  team: 'Team Directory',
  crm: 'CRM (Leads Panel)',
  testimonials: 'Testimonials Module',
  settings: 'System Configuration',
  manage_super: 'Manage Super Admins',
};

export default function UserDrawer({ userId, isOpen, onClose }: UserDrawerProps) {
  const isEditing = !!userId;
  const { data: user, isLoading: isUserLoading } = useAdminUser(userId);
  const { data: activities, isLoading: isActivitiesLoading } = useAdminUserActivity(userId);
  
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({ role: 'viewer', is_active: true });
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'security' | 'activity'>('profile');
  
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);
  const [isUnlockConfirmOpen, setIsUnlockConfirmOpen] = useState(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();
  const resetPassword = useResetUserPassword();
  const unlockUser = useUnlockUser();

  useEffect(() => {
    if (user && isEditing) {
      setFormData(user);
    } else if (!isEditing) {
      setFormData({ role: 'viewer', is_active: true });
    }
  }, [user, isEditing]);

  useEffect(() => {
    // Reset mutations when drawer open state or active tab changes,
    // ensuring old validation errors are cleared out
    createUser.reset();
    updateUser.reset();
    resetPassword.reset();
    setIsSaved(false);
  }, [isOpen, userId, activeTab]);

  const renderPasswordErrors = (mutation: any) => {
    const fieldErrors = mutation.error?.response?.data;
    if (mutation.isError && mutation.error?.response?.status === 400 && fieldErrors?.password) {
      return (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400 font-medium animate-fade-in">
          Your password doesn't yet meet the security requirements. Please complete the remaining items below.
        </div>
      );
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing && userId) {
      updateUser.mutate({ id: userId, data: formData }, {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            onClose();
          }, 1500);
        }
      });
    } else {
      createUser.mutate(formData, {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            onClose();
          }, 1500);
        }
      });
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || !userId) return;
    resetPassword.mutate({ id: userId, password: newPassword }, {
      onSuccess: () => setNewPassword('')
    });
  };

  const handleToggleStatusClick = () => {
    if (user?.is_active) {
      setIsDeactivateConfirmOpen(true);
    } else if (userId) {
      // Reactivation is immediate and safe
      toggleStatus.mutate(userId);
    }
  };

  const handleDeactivateConfirm = () => {
    if (userId) {
      toggleStatus.mutate(userId);
    }
    setIsDeactivateConfirmOpen(false);
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-emerald-500 ring-emerald-500/20';
      case 'password_reset':
      case 'password_change':
        return 'bg-amber-500 ring-amber-500/20';
      case 'status_change':
        return 'bg-indigo-500 ring-indigo-500/20';
      case 'account_lock':
        return 'bg-red-500 ring-red-500/20';
      case 'account_unlock':
        return 'bg-emerald-500 ring-emerald-500/20';
      default:
        return 'bg-accent-primary ring-accent-primary/20';
    }
  };


  const now = new Date();
  const isLocked = !!(user?.locked_until && new Date(user.locked_until) > now);

  const getLockedUntilCountdown = (lockedUntil: string) => {
    const diffMs = new Date(lockedUntil).getTime() - now.getTime();
    if (diffMs <= 0) return 'Unlocking...';
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) return `In ${minutes}m ${seconds}s`;
    return `In ${seconds} seconds`;
  };

  const handleUnlockConfirm = () => {
    if (userId) {
      unlockUser.mutate(userId);
    }
    setIsUnlockConfirmOpen(false);
  };

  // Compute dirty state
  const isDirty = !isEditing || JSON.stringify(formData) !== JSON.stringify(user);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border-primary shrink-0 bg-surface-light gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0 border border-accent-primary/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-text leading-tight">
                {isEditing ? formData.full_name || 'Edit User' : 'New User'}
              </h2>
              <p className="text-sm text-secondary-text">
                {isEditing ? formData.email : 'Create a new user profile'}
              </p>
              {isEditing && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-secondary-text/80">
                  <span><strong>Role:</strong> {roleOptions.find(r => r.value === formData.role)?.label || formData.role}</span>
                  <span className="flex items-center gap-1">
                    <strong>Status:</strong> 
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${formData.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {formData.created_at && (
                    <span><strong>Joined:</strong> {new Date(formData.created_at).toLocaleDateString()}</span>
                  )}
                  {formData.last_login && (
                    <span><strong>Last Login:</strong> {new Date(formData.last_login).toLocaleDateString()}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleSave}
              disabled={!isDirty || createUser.isPending || updateUser.isPending || isSaved}
              className="flex items-center gap-2 px-4 py-2 bg-primary-text text-primary-bg rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              {isSaved ? (
                <>Saved ✓</>
              ) : createUser.isPending || updateUser.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-primary px-6 mt-2 shrink-0 overflow-x-auto scrollbar-hide">
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'profile' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon className="w-4 h-4" /> Profile Info
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'permissions' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Shield className="w-4 h-4" /> Roles & Depts
          </button>
          {isEditing && (
            <>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'security' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
                onClick={() => setActiveTab('security')}
              >
                <Key className="w-4 h-4" /> Security
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'activity' ? 'border-primary-text text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
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
                      <PasswordChecklist value={formData.password || ''} />
                      {renderPasswordErrors(createUser)}
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
                    <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 border border-border-primary rounded-xl">
                      <h4 className="text-sm font-bold text-primary-text flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-accent-primary" /> Permissions Preview
                      </h4>
                      <p className="text-xs text-secondary-text mb-4">
                        Users assigned the <strong>{roleOptions.find(r => r.value === formData.role)?.label}</strong> role receive the following baseline permissions:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                          const hasAccess = MODULE_PERMISSIONS[formData.role as UserRole]?.[key as keyof typeof MODULE_PERMISSIONS['viewer']] ?? false;
                          return (
                            <div key={key} className="flex items-center gap-2.5 text-sm">
                              {hasAccess ? (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                                  ✓
                                </span>
                              ) : (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 text-red-500 shrink-0">
                                  ✗
                                </span>
                              )}
                              <span className={hasAccess ? 'text-primary-text font-medium' : 'text-secondary-text/60 line-through'}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && isEditing && (
                <div className="space-y-8 animate-fade-in">

                  {/* Account Lockout Section */}
                  <div className="p-5 border border-border-primary rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-primary-text flex items-center gap-2">
                        🔒 Account Lockout
                      </h3>
                      {isLocked && (
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1.5 h-auto border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                          onClick={() => setIsUnlockConfirmOpen(true)}
                          isLoading={unlockUser.isPending}
                        >
                          🔓 Unlock Account
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <p className="text-xs text-secondary-text mb-1 font-medium uppercase tracking-wider">Current Status</p>
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                            🔒 Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            🟢 Not Locked
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-secondary-text mb-1 font-medium uppercase tracking-wider">Failed Login Attempts</p>
                        <p className="font-semibold text-primary-text">
                          {user?.failed_login_attempts ?? 0}
                          <span className="text-secondary-text font-normal"> / {user?.max_login_attempts ?? '—'}</span>
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-secondary-text mb-1 font-medium uppercase tracking-wider">Locked Until</p>
                        <p className="font-medium text-primary-text">
                          {user?.locked_until
                            ? new Date(user.locked_until).toLocaleString()
                            : <span className="text-secondary-text">—</span>
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-secondary-text mb-1 font-medium uppercase tracking-wider">Automatic Unlock</p>
                        <p className="font-medium text-primary-text">
                          {isLocked && user?.locked_until
                            ? <span className="text-amber-600 dark:text-amber-400">{getLockedUntilCountdown(user.locked_until)}</span>
                            : <span className="text-secondary-text">—</span>
                          }
                        </p>
                      </div>
                    </div>

                    {isLocked && (
                      <div className="pt-2 border-t border-border-primary/50 text-xs text-secondary-text">
                        This account is temporarily locked. The user cannot log in until unlocked manually or the lockout period expires.
                      </div>
                    )}
                  </div>

                  {/* Reset Password Section */}
                  <div className="p-4 border border-border-primary rounded-lg space-y-4">
                    <h3 className="text-sm font-bold text-primary-text">Reset Password</h3>
                    <p className="text-sm text-secondary-text">Force a new password for this user. They will need to use this to log in next.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                       <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1" />
                       <Button variant="secondary" onClick={handleResetPassword} isLoading={resetPassword.isPending} className="shrink-0 whitespace-nowrap">
                         Reset Password
                       </Button>
                    </div>
                    <PasswordChecklist value={newPassword} />
                    {renderPasswordErrors(resetPassword)}
                  </div>

                  {/* Account Deactivation Section */}
                  <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg space-y-4">
                    <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Account Status
                    </h3>
                    <p className="text-sm text-red-500/80">
                      {user?.is_active ? 'Deactivating this user will instantly revoke their access to the system.' : 'This account is currently deactivated and cannot log in.'}
                    </p>
                    <Button 
                      variant="primary" 
                      className={`w-full ${user?.is_active ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600' : 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600'}`}
                      onClick={handleToggleStatusClick}
                      isLoading={toggleStatus.isPending}
                    >
                      {user?.is_active ? 'Deactivate User' : 'Reactivate User'}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && isEditing && (
                <div className="space-y-6 animate-fade-in">
                  {isActivitiesLoading ? (
                    <SkeletonTable columns={1} rows={3} />
                  ) : activities?.length ? (
                    <div className="relative pl-2 space-y-6">
                      {activities.map((activity, idx) => (
                        <div key={activity.id} className="relative pl-8 pb-6 last:pb-0">
                          {idx !== activities.length - 1 && (
                            <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border-primary" />
                          )}
                          <div className={`absolute left-0 top-1.5 w-[20px] h-[20px] rounded-full ring-4 ${getActionColor(activity.action)} flex items-center justify-center shrink-0`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                          </div>
                          
                          <div className="flex flex-col bg-surface-dark/5 dark:bg-white/5 border border-border-primary/50 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5 gap-4">
                              <span className="text-xs font-bold text-primary-text uppercase tracking-wider">
                                {activity.action.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-secondary-text/60 font-medium whitespace-nowrap">
                                {new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-text">{activity.description}</p>
                            {activity.ip_address && (
                              <div className="mt-2 text-[10px] text-secondary-text/40 font-mono">
                                IP: {activity.ip_address}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="w-12 h-12 text-secondary-text/40 mb-4" />
                      <h3 className="text-base font-bold text-primary-text mb-1">Activity Timeline</h3>
                      <p className="text-sm text-secondary-text max-w-sm">
                        No activity has been recorded yet. User actions such as:
                      </p>
                      <ul className="mt-3 space-y-1 text-xs text-secondary-text/80 list-disc list-inside">
                        <li>Login attempts</li>
                        <li>Password resets</li>
                        <li>Status toggle updates</li>
                        <li>Profile updates</li>
                      </ul>
                      <p className="text-xs text-secondary-text/60 mt-3">will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      <ConfirmDialog
        isOpen={isDeactivateConfirmOpen}
        onClose={() => setIsDeactivateConfirmOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate User"
        description="This user will immediately lose access to the platform."
        confirmText="Deactivate User"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={isUnlockConfirmOpen}
        onClose={() => setIsUnlockConfirmOpen(false)}
        onConfirm={handleUnlockConfirm}
        title="Unlock Account"
        description="This will immediately restore this user's ability to log in. Their failed login attempt counter will be reset."
        confirmText="Unlock Account"
        variant="default"
      />
    </>
  );
}
