export default function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseClasses = 'animate-pulse bg-border/40 rounded'

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    badge: 'h-6 w-20 rounded',
    button: 'h-10 w-32 rounded-lg',
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4" aria-hidden="true">
      <div className="flex items-center gap-2">
        <Skeleton variant="badge" />
        <Skeleton variant="badge" className="w-16" />
      </div>
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
        <Skeleton variant="badge" className="w-16" />
      </div>
    </div>
  )
}
