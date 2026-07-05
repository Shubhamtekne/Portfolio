import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useDashboard } from './DashboardContext'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => { setIsOpen(true); setQuery('') }, [])
  const closeSearch = useCallback(() => { setIsOpen(false); setQuery('') }, [])

  const { profileData } = useDashboard()
  const profile = profileData
  const items = []

  // Projects
  profile.projects.forEach((p) => {
    items.push({
      id: `project-${p.id}`,
      title: p.title,
      description: p.description || '',
      category: 'Project',
      url: '#projects',
      keywords: p.stack || [],
    })
  })

  // Skills
  profile.skills.groups.forEach((g) => {
    g.skills.forEach((s) => {
      items.push({
        id: `skill-${s.label}`,
        title: s.label,
        description: `${g.category} — ${g.description}`,
        category: 'Skill',
        url: '#skills',
        keywords: [g.category],
      })
    })
  })

  // Sections
  const sections = [
    { id: 'about', title: 'About', description: profile.about.headline, category: 'Section', url: '#about', keywords: ['about', 'bio'] },
    { id: 'projects', title: 'Projects', description: "What I've built", category: 'Section', url: '#projects', keywords: ['work', 'portfolio'] },
    { id: 'skills', title: 'Skills', description: 'Technologies I work with', category: 'Section', url: '#skills', keywords: ['stack', 'technologies'] },
    { id: 'contact', title: 'Contact', description: 'Get in touch', category: 'Section', url: '#contact', keywords: ['email', 'hire'] },
  ]
  sections.forEach((s) => items.push(s))

  // Experience
  profile.experience.forEach((e) => {
    items.push({
      id: `exp-${e.institution}`,
      title: e.degree,
      description: `${e.institution} — ${e.year}`,
      category: 'Education',
      url: '#about',
      keywords: [e.institution],
    })
  })

  const searchIndex = items

  const results = useMemo(() => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lower)),
    ).slice(0, 12)
  }, [query, searchIndex])

  return (
    <SearchContext.Provider value={{ query, setQuery, isOpen, openSearch, closeSearch, results }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
