import { motion, useReducedMotion } from 'framer-motion'

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'backOut' } },
}

export default function SkillTag({ label, variant = 'secondary', index = 0 }) {
  const shouldReduce = useReducedMotion()

  const variantStyles = {
    primary: 'text-accent bg-accent/10 border-accent/25 hover:bg-accent/20 hover:border-accent/50',
    secondary: 'text-text bg-surface border-border hover:border-border/80',
    learning: 'text-muted bg-transparent border-border/50 hover:border-accent/20 hover:text-accent italic',
  }

  return (
    <motion.span
      variants={shouldReduce ? {} : tagVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.04 }}
      whileHover={shouldReduce ? {} : { scale: 1.05, transition: { duration: 0.15 } }}
      whileTap={shouldReduce ? {} : { scale: 0.97 }}
      className={`font-mono text-xs px-3 py-1.5 rounded border cursor-default transition-colors duration-200 inline-flex items-center gap-1.5 ${variantStyles[variant]}`}
    >
      {variant === 'learning' && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse shrink-0" aria-hidden="true" />
      )}
      {label}
    </motion.span>
  )
}
