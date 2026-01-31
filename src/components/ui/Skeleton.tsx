import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-stone-200 dark:bg-stone-700', className)} />
  );
}

// Pre-built skeleton patterns for common UI elements

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800',
        className
      )}
    >
      {children ?? (
        <>
          <Skeleton className="mb-4 h-6 w-1/2" />
          <SkeletonText lines={3} />
        </>
      )}
    </div>
  );
}

export function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn('h-6 w-16 rounded-full', className)} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-11 w-full rounded-lg', className)} />;
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />;
}

// Page-level skeleton layouts

export function SkeletonWeekDetail() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      {/* Header Card */}
      <SkeletonCard>
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </SkeletonCard>

      {/* Readings Card */}
      <SkeletonCard>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
              <div className="flex items-start gap-3">
                <SkeletonBadge />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Questions Card */}
      <SkeletonCard>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border-l-4 border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-800"
            >
              <div className="flex gap-3">
                <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Attendance Card */}
      <SkeletonCard>
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-4 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <Skeleton className="mt-4 h-20 w-full rounded-lg" />
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <SkeletonBadge key={i} />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      {/* Hero Card */}
      <SkeletonCard className="text-center">
        <Skeleton className="mx-auto mb-2 h-5 w-32" />
        <Skeleton className="mx-auto mb-4 h-8 w-48" />
        <Skeleton className="mx-auto mb-4 h-5 w-56" />
        <SkeletonButton className="mx-auto w-40" />
      </SkeletonCard>

      {/* Week Preview */}
      <SkeletonCard>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <SkeletonBadge />
        </div>
        <Skeleton className="mb-2 h-7 w-3/4" />
        <Skeleton className="mb-4 h-5 w-1/2" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard>
          <Skeleton className="mb-2 h-8 w-12" />
          <Skeleton className="h-4 w-20" />
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton className="mb-2 h-8 w-12" />
          <Skeleton className="h-4 w-24" />
        </SkeletonCard>
      </div>
    </div>
  );
}
