import { motion } from 'framer-motion'

export default function DashboardCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-surface border border-border rounded-3xl p-5 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}
