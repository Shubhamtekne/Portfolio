import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import * as AuthService from '../../services/AuthService'
import { ADMIN_DASHBOARD_ROUTE } from '../../config/authConfig'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, authenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const remembered = AuthService.getRememberedUsername()
    if (remembered) {
      setUsername(remembered)
      setRemember(true)
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      navigate(ADMIN_DASHBOARD_ROUTE, { replace: true })
    }
  }, [authenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const success = login(username.trim(), password, remember)
      if (!success) {
        setError('Invalid username or password.')
        setPassword('')
      }
      setLoading(false)
    }, 250)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Lock size={24} className="text-accent" />
          </div>
          <h1 className="font-display font-bold text-2xl text-text">Admin Access</h1>
          <p className="text-muted text-sm mt-1">Enter the admin credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="admin-username" className="font-mono text-xs text-muted uppercase tracking-widest mb-2 block">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors"
              autoComplete="username"
              aria-invalid={!!error}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="font-mono text-xs text-muted uppercase tracking-widest mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors pr-10"
                autoComplete="current-password"
                aria-invalid={!!error}
                aria-describedby={error ? 'auth-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p id="auth-error" className="text-red-400 text-xs mt-1.5 font-mono" role="alert">
                {error}
              </p>
            )}
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Remember username
          </label>

          <button
            type="submit"
            disabled={!username.trim() || !password || loading}
            className="w-full inline-flex items-center justify-center gap-2 font-display font-semibold text-sm bg-accent text-bg px-6 py-2.5 rounded-lg hover:bg-accent-dim transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="font-mono text-xs text-muted hover:text-accent transition-colors">
            &larr; Back to portfolio
          </a>
        </p>
      </motion.div>
    </div>
  )
}
