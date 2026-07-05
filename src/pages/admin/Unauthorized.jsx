import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function AdminUnauthorized() {
  const [count, setCount] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    if (count <= 0) {
      navigate('/', { replace: true })
      return
    }
    const timer = window.setTimeout(() => setCount((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [count, navigate])

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold text-text">Unauthorized Access Detected</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">You are not authorized to access this page.</p>
        <div className="mb-4 font-display text-6xl font-bold text-accent">{count}</div>
        <p className="font-mono text-xs text-border">Redirecting to Portfolio...</p>
      </div>
    </div>
  )
}
