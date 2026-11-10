function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-line/70 ${className}`}
    />
  );
}

export function TaskCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="grid gap-3 rounded-xl border border-line bg-surface p-6"
    >
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-1 flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </article>
  );
}

export default Skeleton;
