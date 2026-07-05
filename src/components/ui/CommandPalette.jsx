import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sun, Moon, Home, Briefcase, User, Mail, FileText, ExternalLink, ArrowUpRight } from 'lucide-react'
import { useSearch } from '../../context/SearchContext'
import { useTheme } from '../../context/ThemeContext'

const COMMANDS = [
  { id: 'home', label: 'Home', icon: Home, action: () => scrollToSection('#hero'), shortcut: 'G H' },
  { id: 'projects', label: 'Projects', icon: Briefcase, action: () => scrollToSection('#projects'), shortcut: 'G P' },
  { id: 'skills', label: 'Skills', icon: User, action: () => scrollToSection('#skills'), shortcut: 'G S' },
  { id: 'about', label: 'About', icon: FileText, action: () => scrollToSection('#about'), shortcut: 'G A' },
  { id: 'contact', label: 'Contact', icon: Mail, action: () => scrollToSection('#contact'), shortcut: 'G C' },
  { id: 'resume', label: 'Resume', icon: FileText, action: () => window.open('#', '_blank'), shortcut: 'G R' },
  { id: 'github', label: 'Open GitHub', icon: ExternalLink, action: () => window.open('https://github.com/Shubhamtekne', '_blank'), shortcut: 'G G' },
]

function scrollToSection(href) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  closePalette()
}

let closePalette = () => {}

export default function CommandPalette() {
  const { isOpen, openSearch, closeSearch, query, setQuery, results } = useSearch()
  const { theme, toggleTheme } = useTheme()
  const inputRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mode, setMode] = useState('search')
  const itemsRef = useRef([])

  closePalette = useCallback(() => {
    closeSearch()
    setMode('search')
  }, [closeSearch])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) closePalette()
        else openSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, openSearch, closePalette])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50)
    }
    setActiveIndex(0)
  }, [isOpen])

  const filteredCommands = mode === 'commands'
    ? COMMANDS.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()))
    : []

  const items = mode === 'commands' ? filteredCommands : results
  const totalItems = items.length

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        if (mode === 'commands') {
          setMode('search')
          setQuery('')
        } else {
          closePalette()
        }
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % Math.max(totalItems, 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1))
        return
      }
      if (e.key === 'Enter' && items[activeIndex]) {
        if (mode === 'commands') {
          items[activeIndex].action()
        } else {
          const item = items[activeIndex]
          if (item.url) {
            const el = document.querySelector(item.url)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
            closePalette()
          }
        }
        return
      }
      if (e.key === '>' && mode === 'search') {
        setMode('commands')
        setQuery('')
      }
      if (e.key === 'Backspace' && query === '' && mode === 'commands') {
        setMode('search')
      }
    },
    [mode, query, items, activeIndex, totalItems, closePalette, setQuery],
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closePalette() }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              {mode === 'commands' ? (
                  <span className="font-mono text-xs text-accent font-bold">{'>'}</span>
              ) : (
                <Search size={16} className="text-muted shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'commands' ? 'Type a command...' : 'Search projects, skills, sections...'}
                className="flex-1 bg-transparent text-text font-body text-sm outline-none placeholder:text-border"
                aria-label="Search"
              />
              <kbd className="font-mono text-[10px] text-muted bg-border/30 px-1.5 py-0.5 rounded hidden sm:inline">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {mode === 'commands' && query === '' && (
                <div className="px-4 py-2">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Commands</div>
                  {COMMANDS.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => { cmd.action(); closePalette() }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-text hover:bg-border/30 transition-colors text-left"
                    >
                      <cmd.icon size={15} className="text-accent shrink-0" />
                      <span className="flex-1">{cmd.label}</span>
                      <span className="font-mono text-[10px] text-border">{cmd.shortcut}</span>
                    </button>
                  ))}
                </div>
              )}
              {mode === 'commands' && filteredCommands.length > 0 && (
                <div className="px-4 py-2">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Commands</div>
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => { cmd.action(); closePalette() }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                        i === activeIndex ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text hover:bg-border/30'
                      }`}
                    >
                      <cmd.icon size={15} className="shrink-0" />
                      <span className="flex-1">{cmd.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {mode === 'search' && items.length === 0 && query && (
                <div className="px-5 py-8 text-center">
                  <p className="text-muted text-sm">No results for &ldquo;{query}&rdquo;</p>
                  <button
                    onClick={() => { setMode('commands'); setQuery('') }}
                    className="mt-2 text-xs text-accent hover:underline"
                  >
                    Try commands instead (type {">"})
                  </button>
                </div>
              )}
              {mode === 'search' && items.length > 0 && (
                <div className="px-4 py-2">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Results</div>
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.url) {
                          const el = document.querySelector(item.url)
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                          closePalette()
                        }
                      }}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                        i === activeIndex ? 'bg-accent/10' : 'hover:bg-border/30'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <ArrowUpRight size={14} className={i === activeIndex ? 'text-accent' : 'text-muted'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${i === activeIndex ? 'text-accent' : 'text-text'}`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted truncate">{item.description}</div>
                      </div>
                      <span className="font-mono text-[10px] text-border shrink-0">{item.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-bg/50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted">
                  <kbd className="bg-border/30 px-1 rounded">&uarr;&darr;</kbd> navigate
                </span>
                <span className="font-mono text-[10px] text-muted hidden sm:inline">
                  <kbd className="bg-border/30 px-1 rounded">&crarr;</kbd> select
                </span>
                <span className="font-mono text-[10px] text-muted hidden sm:inline">
                  <kbd className="bg-border/30 px-1 rounded">{'>'}</kbd> commands
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="text-muted hover:text-text transition-colors p-1"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
