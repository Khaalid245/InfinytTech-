import React from 'react';

const ServicesTableSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-primary/50 bg-black/5 dark:bg-white/5">
              <th className="p-4 w-12 text-center">
                <div className="w-4 h-4 bg-black/10 dark:bg-white/10 rounded ml-2"></div>
              </th>
              <th className="p-4 font-medium text-sm text-secondary-text">Service Title</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Category</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Updated Date</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Featured</th>
              <th className="p-4 font-medium text-sm text-secondary-text">Status</th>
              <th className="p-4 font-medium text-sm text-secondary-text text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <td className="p-4 w-12 text-center">
                  <div className="w-4 h-4 bg-black/10 dark:bg-white/10 rounded ml-2"></div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-32"></div>
                      <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-24"></div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="h-5 bg-black/5 dark:bg-white/5 rounded-full w-24"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-20"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-8"></div>
                </td>
                <td className="p-4">
                  <div className="h-6 bg-black/10 dark:bg-white/10 rounded-full w-20"></div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                    <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                    <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTableSkeleton;
