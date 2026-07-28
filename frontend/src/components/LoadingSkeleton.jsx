export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
      ))}
    </div>
  )
}
