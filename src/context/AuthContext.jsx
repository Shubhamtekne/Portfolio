import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as AuthService from '../services/AuthService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setAuthenticated(AuthService.getStoredAuth())
    setChecking(false)
  }, [])

  const login = useCallback((username, password, remember = false) => {
    const valid = AuthService.validateCredentials(username, password)
    if (valid) {
      AuthService.saveAuth(remember, username)
      setAuthenticated(true)
    }
    return valid
  }, [])

  const logout = useCallback(() => {
    AuthService.clearAuth()
    setAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ authenticated, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
