import { Shield, Check, Minus } from 'lucide-react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface PermissionMatrix {
  module: string;
  permissions: Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }>;
}

const ROLES = [
  { id: 'super_admin', label: 'Super Admin', description: 'Unrestricted access.' },
  { id: 'admin', label: 'Administrator', description: 'Full access except roles.' },
  { id: 'content_manager', label: 'Content Manager', description: 'Manages all content.' },
  { id: 'sales', label: 'Sales', description: 'CRM and leads only.' },
  { id: 'editor', label: 'Editor', description: 'Drafts and edits posts.' },
  { id: 'viewer', label: 'Viewer', description: 'Read-only access.' },
];

const MATRIX: PermissionMatrix[] = [
  {
    module: 'Portfolio & Services',
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true },
      admin: { create: true, read: true, update: true, delete: true },
      content_manager: { create: true, read: true, update: true, delete: false },
      sales: { create: false, read: true, update: false, delete: false },
      editor: { create: true, read: true, update: true, delete: false },
      viewer: { create: false, read: true, update: false, delete: false },
    }
  },
  {
    module: 'Blog & Media',
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true },
      admin: { create: true, read: true, update: true, delete: true },
      content_manager: { create: true, read: true, update: true, delete: true },
      sales: { create: false, read: true, update: false, delete: false },
      editor: { create: true, read: true, update: true, delete: false },
      viewer: { create: false, read: true, update: false, delete: false },
    }
  },
  {
    module: 'Leads CRM',
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true },
      admin: { create: true, read: true, update: true, delete: true },
      content_manager: { create: false, read: false, update: false, delete: false },
      sales: { create: true, read: true, update: true, delete: false },
      editor: { create: false, read: false, update: false, delete: false },
      viewer: { create: false, read: true, update: false, delete: false },
    }
  },
  {
    module: 'Users & Roles',
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true },
      admin: { create: true, read: true, update: true, delete: false },
      content_manager: { create: false, read: false, update: false, delete: false },
      sales: { create: false, read: false, update: false, delete: false },
      editor: { create: false, read: false, update: false, delete: false },
      viewer: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'System Settings',
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true },
      admin: { create: false, read: true, update: false, delete: false },
      content_manager: { create: false, read: false, update: false, delete: false },
      sales: { create: false, read: false, update: false, delete: false },
      editor: { create: false, read: false, update: false, delete: false },
      viewer: { create: false, read: false, update: false, delete: false },
    }
  }
];

const PermissionIcon = ({ hasPermission }: { hasPermission: boolean }) => {
  return hasPermission ? (
    <div className="flex justify-center"><Check className="w-4 h-4 text-green-500" /></div>
  ) : (
    <div className="flex justify-center"><Minus className="w-4 h-4 text-secondary-text/30" /></div>
  );
};

export default function AdminRolesPage() {
  return (
    <AdminLayout>
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight mb-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent-primary" /> Roles & Permissions
            </h1>
            <p className="text-secondary-text">Enterprise Role-Based Access Control (RBAC) matrix defining system privileges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {ROLES.map(role => (
            <div key={role.id} className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <h3 className="font-bold text-primary-text mb-1">{role.label}</h3>
              <p className="text-xs text-secondary-text">{role.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface-light rounded-xl border border-border-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-primary bg-black/5 dark:bg-white/5">
                  <th className="py-4 px-6 font-semibold text-sm text-primary-text min-w-[200px]">System Module</th>
                  {ROLES.map(role => (
                    <th key={role.id} className="py-4 px-4 text-center">
                      <span className="font-semibold text-xs text-secondary-text uppercase tracking-wider">{role.label}</span>
                      <div className="flex justify-center gap-4 mt-2 font-medium text-[10px] text-secondary-text/60 tracking-widest">
                        <span title="Create">C</span>
                        <span title="Read">R</span>
                        <span title="Update">U</span>
                        <span title="Delete">D</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {MATRIX.map((moduleItem, idx) => (
                  <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-sm text-primary-text">{moduleItem.module}</span>
                    </td>
                    {ROLES.map(role => {
                      const perms = moduleItem.permissions[role.id];
                      return (
                        <td key={role.id} className="py-4 px-4">
                          <div className="flex justify-center gap-4">
                            <div className="w-2"><PermissionIcon hasPermission={perms?.create} /></div>
                            <div className="w-2"><PermissionIcon hasPermission={perms?.read} /></div>
                            <div className="w-2"><PermissionIcon hasPermission={perms?.update} /></div>
                            <div className="w-2"><PermissionIcon hasPermission={perms?.delete} /></div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Currently, custom roles cannot be dynamically created. To modify the baseline privileges of these enterprise roles, please update the RBAC Middleware settings in the backend repository or contact your engineering team.
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}
