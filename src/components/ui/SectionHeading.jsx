import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function SectionHeading({
  label,
  title,
  description,
  className = '',
  align = 'left',
}) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduce ? {} : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 sm:mb-14 lg:mb-16 ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <div className={`mb-6 flex items-center gap-3 sm:mb-8 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">{label}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mb-4 font-display text-3xl font-bold text-text sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {description && (
        <p className={`max-w-2xl leading-relaxed text-muted ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
