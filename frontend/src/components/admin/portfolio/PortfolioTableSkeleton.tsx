import React from 'react';

const PortfolioTableSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-light border border-border-primary rounded-xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-primary-bg/50 border-b border-border-primary text-xs uppercase tracking-wider text-secondary-text">
            <th className="px-4 py-3 font-medium w-12">
              <div className="w-4 h-4 bg-black/5 dark:bg-white/5 rounded"></div>
            </th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Category / Client</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-4">
                <div className="w-4 h-4 bg-black/5 dark:bg-white/5 rounded"></div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-md bg-black/5 dark:bg-white/5 shrink-0"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-black/5 dark:bg-white/5 rounded"></div>
                    <div className="h-3 w-24 bg-black/5 dark:bg-white/5 rounded"></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded"></div>
                  <div className="h-3 w-24 bg-black/5 dark:bg-white/5 rounded"></div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full"></div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-24 bg-black/5 dark:bg-white/5 rounded"></div>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5"></div>
                  <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTableSkeleton;
