import type React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-primary bg-black/2 dark:bg-white/2">
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 text-xs font-semibold text-secondary-text uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
              {columns.map((col, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap">
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
