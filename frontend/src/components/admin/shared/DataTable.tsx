import type React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  draggable?: boolean;
  onDragStart?: (item: T, e: React.DragEvent) => void;
  selectedKeys?: Set<string>;
  onSelectRow?: (item: T, e: React.MouseEvent) => void;
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, draggable, onDragStart, selectedKeys, onSelectRow }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-primary bg-black/2 dark:bg-white/2">
            {onSelectRow && (
              <th className="px-6 py-4 w-12 text-center">
                {/* Optional Select All checkbox can go here */}
              </th>
            )}
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 text-xs font-semibold text-secondary-text uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary">
          {data.map((item) => {
            const isSelected = selectedKeys?.has(keyExtractor(item));
            return (
              <tr 
                key={keyExtractor(item)} 
                draggable={draggable}
                onDragStart={(e) => onDragStart && onDragStart(item, e)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-accent-primary/10' : 'hover:bg-black/2 dark:hover:bg-white/2'}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {onSelectRow && (
                  <td className="px-6 py-4 w-12 text-center" onClick={(e) => onSelectRow(item, e)}>
                    <input 
                      type="checkbox" 
                      checked={isSelected || false}
                      readOnly
                      className="w-4 h-4 rounded border-border-primary text-accent-primary focus:ring-accent-primary cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap">
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
