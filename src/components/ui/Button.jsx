import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-accent text-bg border-accent hover:bg-accent-dim hover:shadow-[0_0_24px_rgba(56,189,248,0.3)]',
  secondary:
    'border-border text-muted hover:text-text hover:border-border/80',
  ghost:
    'border-transparent text-muted hover:text-text hover:bg-surface/50',
  danger:
    'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 rounded',
  md: 'text-sm px-5 py-2.5 rounded',
  lg: 'text-base px-7 py-3 rounded-lg',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    href,
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    type = 'button',
    ariaLabel,
    ...props
  },
  ref,
) {
  const baseStyles = `inline-flex items-center justify-center gap-2 font-display font-semibold border transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} ${className}`

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon size={14} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon size={14} aria-hidden="true" />}
    </>
  )

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={baseStyles}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        aria-label={ariaLabel}
        {...props}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={baseStyles}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {content}
    </motion.button>
  )
})

export default Button
