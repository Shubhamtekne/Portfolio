import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Sun, Moon } from 'lucide-react'
import { useSearch } from '../context/SearchContext'
import { useTheme } from '../context/ThemeContext'
import { useScrollPosition } from '../hooks'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isScrolled } = useScrollPosition()
  const { openSearch } = useSearch()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
          <a href="/" id="nav-logo" className="font-display font-bold text-lg tracking-tight text-text hover:text-accent transition-colors duration-200">
            Shubham<span className="text-accent">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-muted hover:text-text transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent transition-all duration-200 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Search button */}
            <button
              onClick={openSearch}
              data-magnetic
              className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted bg-surface/50 border border-border/60 px-3 py-1.5 rounded-lg hover:text-text hover:border-border transition-all duration-200"
              aria-label="Search (Ctrl+K)"
            >
              <Search size={12} />
              <span>Search</span>
              <kbd className="font-mono text-[9px] text-border bg-bg/50 px-1 rounded">Ctrl+K</kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              data-magnetic
              className="text-muted hover:text-text transition-colors p-1.5 rounded-lg hover:bg-surface/50"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden text-muted hover:text-text transition-colors p-1"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-surface border-b border-border md:hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block font-mono text-sm text-muted hover:text-text py-3 border-b border-border/50 last:border-0 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3 flex gap-3">
                <button
                  onClick={() => { openSearch(); setMenuOpen(false) }}
                  className="font-mono text-sm text-accent flex items-center gap-2"
                >
                  <Search size={14} /> Search
                </button>
                <button
                  onClick={toggleTheme}
                  className="font-mono text-sm text-muted flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} Theme
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
