import React from 'react';

const BlogTableSkeleton: React.FC = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="bg-surface-light border border-border-primary rounded-xl shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-black/2 dark:bg-white/2 border-b border-border-primary">
              <th className="p-4 w-12"><div className="w-4 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4 w-16"><div className="w-12 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-24 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-20 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-20 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-24 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-16 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4 w-24"><div className="w-12 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4 w-32"><div className="w-20 h-4 bg-black/10 dark:bg-white/10 rounded"></div></th>
              <th className="p-4"><div className="w-16 h-4 bg-black/10 dark:bg-white/10 rounded ml-auto"></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {skeletonRows.map((_, idx) => (
              <tr key={idx} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                <td className="p-4"><div className="w-4 h-4 bg-black/5 dark:bg-white/5 rounded"></div></td>
                <td className="p-4"><div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-lg"></div></td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="w-48 h-4 bg-black/5 dark:bg-white/5 rounded"></div>
                    <div className="w-32 h-3 bg-black/5 dark:bg-white/5 rounded"></div>
                  </div>
                </td>
                <td className="p-4"><div className="w-24 h-6 bg-black/5 dark:bg-white/5 rounded-full"></div></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black/5 dark:bg-white/5 rounded-full"></div>
                    <div className="w-20 h-4 bg-black/5 dark:bg-white/5 rounded"></div>
                  </div>
                </td>
                <td className="p-4"><div className="w-16 h-4 bg-black/5 dark:bg-white/5 rounded"></div></td>
                <td className="p-4"><div className="w-20 h-6 bg-black/5 dark:bg-white/5 rounded-full"></div></td>
                <td className="p-4 text-center"><div className="w-6 h-6 bg-black/5 dark:bg-white/5 rounded-full mx-auto"></div></td>
                <td className="p-4"><div className="w-20 h-4 bg-black/5 dark:bg-white/5 rounded"></div></td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="w-8 h-8 bg-black/5 dark:bg-white/5 rounded-lg"></div>
                    <div className="w-8 h-8 bg-black/5 dark:bg-white/5 rounded-lg"></div>
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

export default BlogTableSkeleton;
