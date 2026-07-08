
export default function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number, columns?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="flex bg-black/5 dark:bg-white/5 p-4 rounded-t-lg mb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/4 mr-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex p-4 border-b border-border-primary">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-4 bg-black/5 dark:bg-white/5 rounded w-1/4 mr-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
