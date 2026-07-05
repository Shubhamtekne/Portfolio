import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import getProfile from '../content/profile'
import LocalStorageService from '../services/LocalStorageService'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme() {
  const profile = getProfile()
  if (typeof window === 'undefined') return profile.theme.defaultMode
  const stored = LocalStorageService.get(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  if (profile.theme.defaultMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return profile.theme.defaultMode
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  const setTheme = useCallback((mode) => {
    setThemeState(mode)
    LocalStorageService.set(STORAGE_KEY, mode)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  // Listen for system changes if default is 'system'
  useEffect(() => {
    const profile = getProfile()
    if (profile.theme.defaultMode !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e) => {
      const stored = LocalStorageService.get(STORAGE_KEY)
      if (!stored) {
        setThemeState(e.matches ? 'light' : 'dark')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
