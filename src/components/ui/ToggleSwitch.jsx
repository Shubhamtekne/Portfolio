import { motion } from 'framer-motion'

export default function ToggleSwitch({ checked, onChange, label, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <span className="font-mono text-xs text-muted">{label}</span>
      <motion.div
        className={`relative w-12 h-7 rounded-full border border-border transition-colors ${checked ? 'bg-accent/30 border-accent' : 'bg-border'}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onChange(!checked)
          }
        }}
      >
        <motion.span
          layout
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-bg shadow-md`}
          animate={{ x: checked ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </label>
  )
}
