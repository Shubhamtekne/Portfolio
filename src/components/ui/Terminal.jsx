export default function Terminal({ children, className = '' }) {
  return (
    <div className={`font-mono text-sm bg-surface border border-border rounded-lg p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      {children}
    </div>
  )
}
