/**
 * Utility for conditionally joining class names.
 * Simple replacement for clsx/classnames — no dependency needed.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
