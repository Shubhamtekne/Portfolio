import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { className = '', type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full bg-bg border border-border rounded-2xl px-4 py-3 text-text text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 ${className}`}
      {...props}
    />
  )
})

export default Input
