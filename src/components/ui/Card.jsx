import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  border = true,
  glow = false,
  as: Component = motion.div,
  ...props
}) {
  const baseStyles = `bg-surface ${border ? 'border border-border' : ''} rounded-2xl ${padding} transition-colors duration-300 ${glow ? 'glow-accent' : ''} ${className}`

  if (Component === motion.div) {
    return (
      <motion.div
        className={baseStyles}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Component className={baseStyles} {...props}>
      {children}
    </Component>
  )
}
