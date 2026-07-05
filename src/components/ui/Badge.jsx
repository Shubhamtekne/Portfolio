export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'text-muted bg-border/30 border-border',
    accent: 'text-accent bg-accent/10 border-accent/20',
    success: 'text-green-400 bg-green-500/10 border-green-500/20',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  }

  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
