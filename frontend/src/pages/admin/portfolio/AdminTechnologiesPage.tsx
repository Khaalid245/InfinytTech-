import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Cpu, 
  Code2, 
  Cloud, 
  Database, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Server, 
  Globe, 
  Braces, 
  Boxes,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import DataTable, { type ColumnDef } from '../../../components/admin/shared/DataTable';
import ConfirmDialog from '../../../components/admin/shared/ConfirmDialog';
import { 
  useAdminTechnologies, 
  useCreateTechnology, 
  useUpdateTechnology, 
  useDeleteTechnology 
} from '../../../hooks/usePortfolio';
import type { Technology } from '../../../types/portfolio';

// Dynamic Icon Mapper for UI display
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  nextjs: Code2,
  go: Server,
  python: Braces,
  pytorch: Sparkles,
  kubernetes: Boxes,
  terraform: Cloud,
  postgresql: Database,
  flutter: Smartphone,
  react: Layers,
  typescript: Braces,
  aws: Cloud,
  django: Server,
  nodejs: Globe,
  docker: Boxes,
  graphql: Cpu,
  cpu: Cpu,
  layers: Layers,
  sparkles: Sparkles,
  cloud: Cloud,
  database: Database,
  smartphone: Smartphone,
  server: Server,
  globe: Globe,
  braces: Braces,
  boxes: Boxes,
  code: Code2,
};

const CATEGORIES = [
  { value: 'runtime', label: 'Languages & Runtimes', icon: Code2, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { value: 'ai', label: 'AI & Machine Learning', icon: Sparkles, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { value: 'cloud', label: 'Cloud & Scaling', icon: Cloud, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { value: 'db', label: 'Databases & APIs', icon: Database, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
];

export default function AdminTechnologiesPage() {
  const { data: technologies = [], isLoading } = useAdminTechnologies();
  const createMutation = useCreateTechnology();
  const updateMutation = useUpdateTechnology();
  const deleteMutation = useDeleteTechnology();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'runtime',
    description: '',
    icon_name: 'react',
    display_order: 0,
    is_active: true,
  });

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    tech?: Technology;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  // KPI Metrics
  const stats = useMemo(() => {
    const total = technologies.length;
    const active = technologies.filter(t => t.is_active).length;
    const runtime = technologies.filter(t => (t.category || 'runtime') === 'runtime').length;
    const ai = technologies.filter(t => t.category === 'ai').length;
    const cloud = technologies.filter(t => t.category === 'cloud').length;
    const db = technologies.filter(t => t.category === 'db').length;
    return { total, active, runtime, ai, cloud, db };
  }, [technologies]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTech(null);
    setFormData({
      name: '',
      slug: '',
      category: 'runtime',
      description: '',
      icon_name: 'react',
      display_order: technologies.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tech: Technology) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      slug: tech.slug,
      category: tech.category || 'runtime',
      description: tech.description || '',
      icon_name: tech.icon_name || 'react',
      display_order: tech.display_order ?? 0,
      is_active: tech.is_active,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug on name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingTech) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, name, slug }));
    } else {
      setFormData(prev => ({ ...prev, name }));
    }
  };

  // Submit Create or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Please provide both a Name and Slug.');
      return;
    }

    try {
      if (editingTech) {
        await updateMutation.mutateAsync({
          slug: editingTech.slug,
          data: formData,
        });
        toast.success(`Updated "${formData.name}" successfully.`);
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(`Created "${formData.name}" successfully.`);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed.';
      toast.error(errorMsg);
    }
  };

  // Toggle active status inline
  const handleToggleActive = async (tech: Technology) => {
    try {
      await updateMutation.mutateAsync({
        slug: tech.slug,
        data: { is_active: !tech.is_active },
      });
      toast.success(`${tech.name} is now ${!tech.is_active ? 'Active' : 'Inactive'}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (tech: Technology) => {
    setDeleteDialog({
      isOpen: true,
      tech,
      title: 'Delete Technology',
      description: `Are you sure you want to delete "${tech.name}"? It will be removed from all projects and the live Tech Stack showcase.`,
    });
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteDialog.tech) return;
    try {
      await deleteMutation.mutateAsync(deleteDialog.tech.slug);
      toast.success(`Deleted "${deleteDialog.tech.name}".`);
      setDeleteDialog({ isOpen: false, title: '', description: '' });
    } catch {
      toast.error('Failed to delete technology.');
    }
  };

  // Filtered List
  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      const matchesSearch = 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const techCategory = tech.category || 'runtime';
      const matchesCategory = selectedCategory === 'all' || techCategory === selectedCategory;
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && tech.is_active) ||
        (statusFilter === 'inactive' && !tech.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [technologies, searchQuery, selectedCategory, statusFilter]);

  // Table Columns
  const columns: ColumnDef<Technology>[] = [
    {
      header: 'Technology',
      accessor: (tech: Technology) => {
        const IconComponent = ICON_MAP[tech.icon_name?.toLowerCase()] || Code2;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                {tech.name}
                {!tech.is_active && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-medium">
                    Inactive
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {tech.slug}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessor: (tech: Technology) => {
        const cat = CATEGORIES.find(c => c.value === (tech.category || 'runtime')) || CATEGORIES[0];
        const CatIcon = cat.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cat.color}`}>
            <CatIcon className="w-3.5 h-3.5" />
            {cat.label}
          </span>
        );
      },
    },
    {
      header: 'Description',
      accessor: (tech: Technology) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 max-w-md">
          {tech.description || 'No description provided.'}
        </p>
      ),
    },
    {
      header: 'Order',
      accessor: (tech: Technology) => (
        <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          #{tech.display_order ?? 0}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (tech: Technology) => (
        <button
          type="button"
          onClick={() => handleToggleActive(tech)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            tech.is_active
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'
          }`}
          title="Click to toggle status"
        >
          {tech.is_active ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Active (Live)
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" /> Inactive
            </>
          )}
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: (tech: Technology) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(tech)}
            className="text-slate-600 hover:text-amber-500 dark:text-slate-300"
            title="Edit technology"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDelete(tech)}
            className="text-slate-600 hover:text-rose-500 dark:text-slate-300"
            title="Delete technology"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Cpu className="w-7 h-7 text-amber-500" />
            Tech Stack Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your technology pillars, live descriptions, categories, and icon associations displayed on the public website.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Techs</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-emerald-500">Live Active</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-amber-500">Runtimes</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.runtime}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-purple-500">AI / ML</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.ai}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-blue-500">Cloud / Infra</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.cloud}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs font-medium text-emerald-500">Databases / API</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.db}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories ({technologies.length})</option>
            <option value="runtime">Languages & Runtimes ({stats.runtime})</option>
            <option value="ai">AI & Machine Learning ({stats.ai})</option>
            <option value="cloud">Cloud & Scaling ({stats.cloud})</option>
            <option value="db">Databases & APIs ({stats.db})</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only ({stats.active})</option>
            <option value="inactive">Inactive Only ({stats.total - stats.active})</option>
          </select>
        </div>
      </div>

      {/* Main DataTable */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredTechnologies}
          keyExtractor={(tech) => tech.id}
        />
        {!isLoading && filteredTechnologies.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No technologies match your filter criteria.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                {editingTech ? 'Edit Technology' : 'Add New Technology'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 15, Golang, PyTorch"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTech}
                    placeholder="e.g. nextjs, go, pytorch"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lucide Icon Key
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. react, python, pytorch, kubernetes, aws, database"
                    value={formData.icon_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Description (Showcased on Landing Page)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why and how this technology delivers enterprise value..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 dark:border-slate-700"
                    />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Active (Display in Public Stack)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingTech
                    ? 'Update Technology'
                    : 'Create Technology'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        description={deleteDialog.description}
        confirmText="Delete Technology"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ isOpen: false, title: '', description: '' })}
      />
    </div>
  );
}
