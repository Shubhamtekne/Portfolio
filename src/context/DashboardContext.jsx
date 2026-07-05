import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import LocalStorageService from '../services/LocalStorageService'
import { DASHBOARD_STORAGE_KEY, LEGACY_DASHBOARD_STORAGE_KEY } from '../config/authConfig'
import getProfile from '../content/profile'

const DashboardContext = createContext(null)

function normalizeSkillEntry(skill) {
  if (!skill || typeof skill !== 'object') {
    return { label: String(skill || 'New Skill'), variant: 'secondary' }
  }

  const validVariants = ['primary', 'secondary', 'learning']
  const maybeLabel = String(skill.label || skill.name || skill.title || 'New Skill')
  let maybeVariant = skill.variant || skill.type || 'secondary'

  if (!validVariants.includes(maybeVariant) && validVariants.includes(maybeLabel.toLowerCase())) {
    maybeVariant = maybeLabel.toLowerCase()
  }

  const variant = validVariants.includes(maybeVariant) ? maybeVariant : 'secondary'
  const label = maybeVariant === maybeLabel.toLowerCase() && !validVariants.includes(skill.variant)
    ? String(skill.variant || 'New Skill')
    : maybeLabel

  return {
    ...skill,
    label,
    variant,
  }
}

function normalizeProfileData(profile) {
  if (!profile || typeof profile !== 'object') return profile
  return {
    ...profile,
    skills: {
      ...profile.skills,
      groups: (profile.skills?.groups || []).map((group) => ({
        ...group,
        category: group?.category || 'Untitled',
        description: group?.description || '',
        skills: (group?.skills || []).map(normalizeSkillEntry),
      })),
      dsaPractice: {
        title: profile.skills?.dsaPractice?.title || 'DSA Practice',
        description:
          profile.skills?.dsaPractice?.description ||
          'Practicing data structures and algorithms on LeetCode — arrays, strings, hashmaps, recursion. Building problem-solving consistency before placements.',
      },
    },
  }
}

function getInitialProfileData() {
  const base = normalizeProfileData(getProfile())
  const storedDashboardData = LocalStorageService.getJson(DASHBOARD_STORAGE_KEY, null)
  const legacyDashboardData = LocalStorageService.getJson(LEGACY_DASHBOARD_STORAGE_KEY, null)
  const storedData = normalizeProfileData(storedDashboardData ?? legacyDashboardData)

  if (!storedDashboardData && legacyDashboardData) {
    LocalStorageService.setJson(DASHBOARD_STORAGE_KEY, storedData)
    LocalStorageService.remove(LEGACY_DASHBOARD_STORAGE_KEY)
  }

  const analytics = {
    views: base.analytics?.views || 1426,
    recent: base.analytics?.recent || [
      { label: 'New message received', date: 'Today' },
      { label: 'Profile updated', date: 'Yesterday' },
      { label: 'Project added', date: '3 days ago' },
    ],
    ...base.analytics,
  }

  const defaults = {
    messages: base.messages || [
      { id: 'msg-1', from: 'Recruiter', subject: 'Interview request', status: 'new', date: 'Today' },
      { id: 'msg-2', from: 'Team lead', subject: 'Backend design review', status: 'read', date: 'Yesterday' },
    ],
    certificates: base.certificates || [],
    media: base.media || [],
    analytics,
  }

  const merged = { ...base, ...defaults, ...storedData }
  merged.analytics = { ...analytics, ...(storedData?.analytics || {}) }

  return merged
}

export function DashboardProvider({ children }) {
  const [profileData, setProfileData] = useState(getInitialProfileData)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const saveDashboardData = useCallback((nextProfile) => {
    setProfileData(nextProfile)
    LocalStorageService.setJson(DASHBOARD_STORAGE_KEY, nextProfile)
  }, [])

  const resetDashboardData = useCallback(() => {
    LocalStorageService.remove(DASHBOARD_STORAGE_KEY)
    setProfileData(getProfile())
  }, [])

  const derived = useMemo(() => {
    const projects = profileData.projects || []
    const skills = profileData.skills?.groups?.reduce((count, group) => count + (group.skills?.length || 0), 0) || 0
    const certificates = profileData.certificates?.length || 0
    const messages = profileData.messages?.length || 0
    const views = profileData.analytics?.views || 0
    const skillsByCategory = profileData.skills?.groups?.map((group) => ({ category: group.category, value: group.skills?.length || 0 })) || []

    return {
      projects,
      skills,
      certificates,
      messages,
      views,
      skillsByCategory,
      chartData: [
        { label: 'Jan', value: views * 0.08 || 8 },
        { label: 'Feb', value: views * 0.12 || 12 },
        { label: 'Mar', value: views * 0.18 || 18 },
        { label: 'Apr', value: views * 0.22 || 22 },
        { label: 'May', value: views * 0.28 || 28 },
        { label: 'Jun', value: views * 0.36 || 36 },
      ],
      projectByYear: profileData.projects?.reduce((acc, project) => {
        const year = String(project.year || '2026')
        acc[year] = (acc[year] || 0) + 1
        return acc
      }, {}),
    }
  }, [profileData])

  return (
    <DashboardContext.Provider
      value={{
        profileData,
        saveDashboardData,
        setProfileData,
        resetDashboardData,
        sidebarCollapsed,
        setSidebarCollapsed,
        activeSection,
        setActiveSection,
        ...derived,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
