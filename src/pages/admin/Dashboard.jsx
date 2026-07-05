import { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Download, LogOut, Plus, Trash2, Edit3, GripVertical,
  User, Briefcase, Code2, GraduationCap, Mail, Eye, Settings, X, Check,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDashboard } from '../../context/DashboardContext'
import getProfile from '../../content/profile'

// ─── Helper: generate unique ID ─────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }

// ─── Tabs ───────────────────────────────────────────────
const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'seo', label: 'SEO', icon: Settings },
]

// ─── Field wrapper ──────────────────────────────────────
function Field({ label, id, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  )
}

const Input = forwardRef(function Input(
  { id, value, onChange, placeholder, type = 'text', className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-body outline-none focus:border-accent transition-colors ${className}`}
      {...props}
    />
  )
})

function Textarea({ id, value, onChange, placeholder, rows = 3, className = '' }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-body outline-none focus:border-accent transition-colors resize-vertical ${className}`}
    />
  )
}

function LoadingSpinner({ size = 18, className = '' }) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function Modal({ open, title, onClose, children, footer, size = 'md' }) {
  const modalRef = useRef(null)
  const firstInputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    firstInputRef.current?.focus()
  }, [open])

  if (!open) return null

  const widthClass = size === 'lg' ? 'max-w-[700px]' : 'max-w-[600px]'

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6 overflow-y-auto overflow-x-hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`w-full ${widthClass} max-h-[90dvh] overflow-y-auto bg-surface border border-border rounded-3xl shadow-2xl text-left`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 id="modal-title" className="font-display text-lg text-text font-bold">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-text transition-colors rounded-full p-2"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border bg-bg">{footer}</div>}
      </motion.div>
    </div>
  )
}

function SkillBadge({ label, variant = 'secondary', className = '' }) {
  const variantStyles = {
    primary: 'text-accent bg-accent/10 border-accent/25',
    secondary: 'text-text bg-surface border-border',
    learning: 'text-muted bg-transparent border-border/50 italic',
  }

  return (
    <span className={`font-mono text-xs px-3 py-1.5 rounded-full border ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  )
}

function ConfirmationDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto text-muted border border-border rounded-lg px-4 py-2 hover:text-text hover:border-border/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-500 text-bg rounded-lg px-4 py-2 hover:bg-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      }
    >
      <p className="text-text text-sm leading-relaxed">{message}</p>
    </Modal>
  )
}

function SkillModal({ open, initialGroup, onClose, onSave }) {
  const [draft, setDraft] = useState({ category: '', description: '', skills: [] })
  const [skillInput, setSkillInput] = useState('')
  const [skillVariant, setSkillVariant] = useState('primary')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)
  const skillInputRef = useRef(null)

  const normalizeSkillLabel = (value) => String(value || '').trim()

  useEffect(() => {
    if (!open) return
    setDraft({
      id: initialGroup?.id || uid(),
      category: initialGroup?.category || '',
      description: initialGroup?.description || '',
      skills: (initialGroup?.skills || []).map((skill) => ({
        id: skill.id || uid(),
        label: skill.label || '',
        variant: skill.variant || 'secondary',
      })),
    })
    setSkillInput('')
    setSkillVariant('primary')
    setErrors({})
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open, initialGroup])

  const validate = () => {
    const nextErrors = {}
    if (!draft.category.trim()) nextErrors.category = 'Category is required.'
    if (!draft.description.trim()) nextErrors.description = 'Description is required.'
    if (!draft.skills.length) nextErrors.skills = 'Add at least one skill.'
    if (draft.skills.some((skill) => !skill.label.trim())) nextErrors.skills = 'Skill labels cannot be empty.'
    const duplicate = draft.skills
      .map((skill) => skill.label.trim().toLowerCase())
      .filter((label, index, arr) => arr.indexOf(label) !== index)
    if (duplicate.length) nextErrors.skills = 'Duplicate skills are not allowed.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const addSkill = () => {
    const labels = normalizeSkillLabel(skillInput)
      .split(',')
      .map((entry) => normalizeSkillLabel(entry))
      .filter(Boolean)

    if (!labels.length) {
      setErrors((prev) => ({ ...prev, skills: undefined }))
      return
    }

    const existingLabels = new Set(draft.skills.map((skill) => normalizeSkillLabel(skill.label).toLowerCase()))
    const nextSkills = []
    let duplicateFound = false

    labels.forEach((label) => {
      const normalizedLabel = normalizeSkillLabel(label)
      if (!normalizedLabel) return
      if (existingLabels.has(normalizedLabel.toLowerCase())) {
        duplicateFound = true
        return
      }
      existingLabels.add(normalizedLabel.toLowerCase())
      nextSkills.push({ id: uid(), label: normalizedLabel, variant: skillVariant })
    })

    if (!nextSkills.length) {
      if (duplicateFound) {
        setErrors((prev) => ({ ...prev, skills: 'Duplicate skill ignored.' }))
      }
      return
    }

    setDraft((prev) => ({
      ...prev,
      skills: [...prev.skills, ...nextSkills],
    }))
    setSkillInput('')
    setErrors((prev) => ({ ...prev, skills: undefined }))
    skillInputRef.current?.focus()
  }

  const updateSkill = (index, field, value) => {
    setDraft((prev) => {
      const skills = [...prev.skills]
      skills[index] = { ...skills[index], [field]: value }
      return { ...prev, skills }
    })
    setErrors((prev) => ({ ...prev, skills: undefined }))
  }

  const removeSkill = (index) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
    setErrors((prev) => ({ ...prev, skills: undefined }))
    skillInputRef.current?.focus()
  }

  const handleSkillInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addSkill()
      return
    }

    if (event.key === 'Backspace' && !skillInput.trim() && draft.skills.length) {
      event.preventDefault()
      removeSkill(draft.skills.length - 1)
    }
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    onSave({
      ...draft,
      category: draft.category.trim(),
      description: draft.description.trim(),
      skills: draft.skills
        .map((skill) => ({
          ...skill,
          label: normalizeSkillLabel(skill.label),
          variant: skill.variant || 'secondary',
        }))
        .filter((skill) => normalizeSkillLabel(skill.label)),
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      title={initialGroup ? 'Edit Skill Group' : 'Add New Skill Group'}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto text-muted border border-border rounded-lg px-4 py-2 hover:text-text hover:border-border/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto bg-accent text-bg rounded-lg px-4 py-2 hover:bg-accent-dim transition-colors"
          >
            {saving ? <LoadingSpinner size={16} className="inline-block mr-2" /> : null}
            Save
          </button>
        </div>
      }
    >
      <div className="grid gap-4">
        <Field label="Category" id="skill-group-category">
          <Input
            id="skill-group-category"
            value={draft.category}
            onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="e.g. Languages"
            ref={inputRef}
          />
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </Field>

        <Field label="Description" id="skill-group-description">
          <Input
            id="skill-group-description"
            value={draft.description}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="e.g. Programming Languages"
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
        </Field>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
          <div>
            <label htmlFor="skill-input" className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1.5 block">
              Skill Input
            </label>
            <Input
              id="skill-input"
              ref={skillInputRef}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
              placeholder="Type a skill and press Enter or comma"
            />
          </div>
          <div>
            <label htmlFor="skill-variant" className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1.5 block">
              Variant
            </label>
            <select
              id="skill-variant"
              value={skillVariant}
              onChange={(e) => setSkillVariant(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-body outline-none focus:border-accent transition-colors"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="learning">Learning</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {draft.skills.map((skill, index) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => removeSkill(index)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-3 py-1.5 text-xs font-mono text-text transition-colors hover:border-red-400 hover:text-red-400"
              aria-label={`Remove ${skill.label}`}
            >
              <span>{skill.label}</span>
              <X size={12} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center justify-center gap-2 text-xs font-mono text-accent bg-accent/10 px-4 py-2 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all"
        >
          <Plus size={12} /> Add Skill
        </button>

        {errors.skills && <p className="text-red-400 text-xs">{errors.skills}</p>}

        <div className="space-y-3">
          {draft.skills.length === 0 ? (
            <p className="text-muted text-sm">No skills added yet. Add multiple skills here.</p>
          ) : (
            draft.skills.map((skill, index) => (
              <div key={skill.id} className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_110px_40px] sm:items-center bg-bg border border-border rounded-xl px-3 py-2">
                <Input
                  id={`draft-skill-label-${skill.id}`}
                  value={skill.label}
                  onChange={(e) => updateSkill(index, 'label', e.target.value)}
                  className="bg-bg"
                />
                <select
                  id={`draft-skill-variant-${skill.id}`}
                  value={skill.variant}
                  onChange={(e) => updateSkill(index, 'variant', e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-body outline-none focus:border-accent transition-colors"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="learning">Learning</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-muted hover:text-red-400 transition-colors self-end sm:self-auto"
                  aria-label="Remove skill"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

function Select({ id, value, onChange, options, className = '' }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-body outline-none focus:border-accent transition-colors ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

// ─── Array editor (tags / stack) ────────────────────────
function ArrayEditor({ items, onChange, placeholder = 'Add item...' }) {
  const [input, setInput] = useState('')

  const add = () => {
    const val = input.trim()
    if (!val) return
    onChange([...items, val])
    setInput('')
  }

  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 font-mono text-xs text-muted bg-border/30 border border-border/50 px-2 py-0.5 rounded">
            {item}
            <button onClick={() => remove(i)} className="text-muted hover:text-red-400 transition-colors" aria-label={`Remove ${item}`}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="flex-1 bg-bg border border-border rounded-lg px-3 py-1.5 text-sm text-text font-body outline-none focus:border-accent transition-colors"
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="px-3 py-1.5 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-dim transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  )
}

// ─── Toast notification ─────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-xl border shadow-2xl font-mono text-sm ${
        type === 'success'
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? <Check size={16} /> : <X size={16} />}
        {message}
      </div>
    </motion.div>
  )
}

// ─── Export helper ──────────────────────────────────────
function generateProfileJS(data) {
  const json = JSON.stringify(data, null, 2)
  return `/**\n * Auto-generated profile from Admin Dashboard\n * Edit via /admin — do not edit manually\n */\n\nexport const profile = ${json}\n\nexport default profile\n`
}

// ═══════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════
function normalizeProfileData(profile) {
  if (!profile?.skills?.groups) return profile
  return {
    ...profile,
    skills: {
      ...profile.skills,
      groups: profile.skills.groups.map((group) => ({
        ...group,
        id: group.id || uid(),
        skills: group.skills?.map((skill) => ({
          ...skill,
          id: skill.id || uid(),
        })) || [],
      })),
    },
  }
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { profileData, saveDashboardData } = useDashboard()
  const data = profileData

  // Initialize form data from stored data or profile defaults
  const [form, setForm] = useState(() => normalizeProfileData(JSON.parse(JSON.stringify(data || getProfile()))))
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [skillModalGroup, setSkillModalGroup] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, index: null })

  // Persist form to admin data immediately to enable live preview
  useEffect(() => {
    // avoid saving initial null
    if (form) saveDashboardData(form)
  }, [form, saveDashboardData])

  // Track changes
  const update = useCallback((path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
    setDirty(true)
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() })
  }, [])

  // Save to localStorage
  const handleSave = useCallback(() => {
    saveDashboardData(form)
    setDirty(false)
    showToast('Changes saved to localStorage')
  }, [form, saveDashboardData, showToast])

  // Export profile.js
  const handleExport = useCallback(() => {
    const code = generateProfileJS(form)
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profile.js'
    a.click()
    URL.revokeObjectURL(url)
    showToast('profile.js exported successfully')
  }, [form, showToast])

  // ── Projects CRUD ──
  const addProject = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: uid(),
          title: 'New Project',
          role: 'Solo Developer',
          collab: false,
          description: 'Add a description...',
          problem: null,
          contribution: null,
          stack: [],
          githubUrl: null,
          liveUrl: null,
          featured: false,
          year: new Date().getFullYear(),
        },
      ],
    }))
    setDirty(true)
  }, [])

  const updateProject = useCallback((id, field, value) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
    setDirty(true)
  }, [])

  const deleteProject = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }))
    setDirty(true)
    showToast('Project deleted')
  }, [showToast])

  // ── Skills CRUD ──
  const openAddSkillGroup = useCallback(() => {
    setSkillModalGroup(null)
    setSkillModalOpen(true)
  }, [])

  const openEditSkillGroup = useCallback((index) => {
    setSkillModalGroup({ ...form.skills.groups[index], index })
    setSkillModalOpen(true)
  }, [form.skills.groups])

  const saveSkillGroup = useCallback(
    (group) => {
      const draft = { ...group }
      const index = draft.index
      delete draft.index
      setForm((prev) => {
        const groups = [...prev.skills.groups]
        const updatedGroup = {
          ...draft,
          skills: (draft.skills || []).filter((skill) => skill.label.trim()).map((skill) => ({
            ...skill,
            id: skill.id || uid(),
            label: skill.label.trim(),
            variant: skill.variant || 'secondary',
          })),
        }

        if (typeof index === 'number') {
          groups[index] = updatedGroup
        } else {
          groups.push({ ...updatedGroup, id: uid() })
        }

        return { ...prev, skills: { ...prev.skills, groups } }
      })
      setDirty(true)
      showToast(index >= 0 ? 'Skill group updated' : 'Skill group added')
    },
    [showToast],
  )

  const requestDeleteGroup = useCallback((index) => {
    setConfirmDelete({ open: true, index })
  }, [])

  const confirmDeleteGroup = useCallback(() => {
    setForm((prev) => {
      const groups = prev.skills.groups.filter((_, i) => i !== confirmDelete.index)
      return { ...prev, skills: { ...prev.skills, groups } }
    })
    setDirty(true)
    showToast('Skill group deleted')
    setConfirmDelete({ open: false, index: null })
  }, [confirmDelete.index, showToast])

  const cancelDeleteGroup = useCallback(() => {
    setConfirmDelete({ open: false, index: null })
  }, [])

  const updateSkillGroup = useCallback((index, field, value) => {
    setForm((prev) => {
      const groups = [...prev.skills.groups]
      groups[index] = { ...groups[index], [field]: value }
      return { ...prev, skills: { ...prev.skills, groups } }
    })
    setDirty(true)
  }, [])

  const deleteSkillGroup = useCallback((index) => {
    requestDeleteGroup(index)
  }, [requestDeleteGroup])

  const addSkill = useCallback((groupIndex) => {
    setForm((prev) => {
      const groups = [...prev.skills.groups]
      groups[groupIndex] = {
        ...groups[groupIndex],
        skills: [...groups[groupIndex].skills, { id: uid(), label: 'New Skill', variant: 'secondary' }],
      }
      return { ...prev, skills: { ...prev.skills, groups } }
    })
    setDirty(true)
  }, [])

  const updateSkill = useCallback((groupIndex, skillIndex, field, value) => {
    setForm((prev) => {
      const groups = [...prev.skills.groups]
      const skills = [...groups[groupIndex].skills]
      skills[skillIndex] = { ...skills[skillIndex], [field]: value }
      groups[groupIndex] = { ...groups[groupIndex], skills }
      return { ...prev, skills: { ...prev.skills, groups } }
    })
    setDirty(true)
  }, [])

  const deleteSkill = useCallback((groupIndex, skillIndex) => {
    setForm((prev) => {
      const groups = [...prev.skills.groups]
      groups[groupIndex] = {
        ...groups[groupIndex],
        skills: groups[groupIndex].skills.filter((_, i) => i !== skillIndex),
      }
      return { ...prev, skills: { ...prev.skills, groups } }
    })
    setDirty(true)
  }, [])

  // ── Education CRUD ──
  const addEducation = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { type: 'education', institution: '', degree: '', year: '', description: '' },
      ],
    }))
    setDirty(true)
  }, [])

  const updateEducation = useCallback((index, field, value) => {
    setForm((prev) => {
      const exp = [...prev.experience]
      exp[index] = { ...exp[index], [field]: value }
      return { ...prev, experience: exp }
    })
    setDirty(true)
  }, [])

  const deleteEducation = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
    setDirty(true)
    showToast('Education entry deleted')
  }, [showToast])

  // ── Contact links CRUD ──
  const addContactLink = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        links: [
          ...prev.contact.links,
          { id: uid(), icon: 'Link', label: '', value: '', href: '', description: '' },
        ],
      },
    }))
    setDirty(true)
  }, [])

  const updateContactLink = useCallback((id, field, value) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        links: prev.contact.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      },
    }))
    setDirty(true)
  }, [])

  const deleteContactLink = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        links: prev.contact.links.filter((l) => l.id !== id),
      },
    }))
    setDirty(true)
    showToast('Contact link deleted')
  }, [showToast])

  // ── SEO keywords ──
  const updateKeywords = useCallback((keywords) => {
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords },
    }))
    setDirty(true)
  }, [])

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-text">
              Admin<span className="text-accent">.</span>
            </span>
            <span className="font-mono text-[10px] text-muted bg-border/30 px-2 py-0.5 rounded hidden sm:inline">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="text-muted hover:text-text transition-colors p-2 rounded-lg hover:bg-border/30"
              aria-label="View portfolio"
              title="View portfolio"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border hover:border-border/80 transition-all"
            >
              <Download size={12} />
              Export
            </button>
            {dirty && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all"
              >
                <Save size={12} />
                Save
              </button>
            )}
            <button
              onClick={logout}
              className="text-muted hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-48 lg:shrink-0 hidden lg:block">
          <nav className="sticky top-20 space-y-1" aria-label="Admin sections">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-muted hover:text-text hover:bg-border/30 border border-transparent'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile tabs */}
          <div className="flex md:hidden gap-1 mb-4 overflow-x-auto pb-2">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-muted hover:text-text border border-transparent'
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'profile' && <ProfileTab form={form} update={update} />}
              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={form.projects}
                  addProject={addProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                />
              )}
              {activeTab === 'skills' && (
                <SkillsTab
                  skills={form.skills}
                  openAddSkillGroup={openAddSkillGroup}
                  openEditSkillGroup={openEditSkillGroup}
                  deleteSkillGroup={deleteSkillGroup}
                />
              )}
              {activeTab === 'education' && (
                <EducationTab
                  experience={form.experience}
                  addEducation={addEducation}
                  updateEducation={updateEducation}
                  deleteEducation={deleteEducation}
                />
              )}
              {activeTab === 'contact' && (
                <ContactTab
                  contact={form.contact}
                  update={update}
                  addContactLink={addContactLink}
                  updateContactLink={updateContactLink}
                  deleteContactLink={deleteContactLink}
                />
              )}
              {activeTab === 'seo' && (
                <SEOTab form={form} update={update} updateKeywords={updateKeywords} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SkillModal
        open={skillModalOpen}
        initialGroup={skillModalGroup}
        onClose={() => setSkillModalOpen(false)}
        onSave={saveSkillGroup}
      />

      <ConfirmationDialog
        open={confirmDelete.open}
        title="Delete skill group"
        message={`Are you sure you want to delete "${form.skills.groups[confirmDelete.index]?.category || 'this group'}"? This cannot be undone.`}
        onConfirm={confirmDeleteGroup}
        onCancel={cancelDeleteGroup}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function ProfileTab({ form, update }) {
  return (
    <Section title="Profile" description="Edit your personal information and social links.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" id="name">
          <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="First name (for hero)" id="firstName">
          <Input id="firstName" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
        </Field>
        <Field label="Role / Title" id="role">
          <Input id="role" value={form.role} onChange={(e) => update('role', e.target.value)} />
        </Field>
        <Field label="Tagline" id="tagline">
          <Input id="tagline" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
        </Field>
        <Field label="Email" id="email">
          <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </Field>
        <Field label="Phone" id="phone">
          <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
        <Field label="Location" id="location">
          <Input id="location" value={form.location} onChange={(e) => update('location', e.target.value)} />
        </Field>
        <Field label="Resume URL" id="resumeUrl">
          <Input id="resumeUrl" value={form.resumeUrl || ''} onChange={(e) => update('resumeUrl', e.target.value || null)} placeholder="Google Drive / Dropbox link" />
        </Field>
      </div>

      <div className="mt-6">
        <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Social Links</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {['github', 'leetcode', 'linkedin', 'twitter'].map((key) => (
            <Field key={key} label={form.socials[key]?.label || key} id={`social-${key}`}>
              <Input
                id={`social-${key}`}
                value={form.socials[key]?.url || ''}
                onChange={(e) => update(`socials.${key}.url`, e.target.value || null)}
                placeholder={`${key}.com/your-profile`}
              />
            </Field>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Hero Section</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Terminal command" id="terminalCommand">
            <Input id="terminalCommand" value={form.hero.terminalCommand} onChange={(e) => update('hero.terminalCommand', e.target.value)} />
          </Field>
          <Field label="Stack display" id="heroStack">
            <Input id="heroStack" value={form.hero.stack} onChange={(e) => update('hero.stack', e.target.value)} />
          </Field>
          <Field label="Status" id="heroStatus">
            <Input id="heroStatus" value={form.hero.status} onChange={(e) => update('hero.status', e.target.value)} />
          </Field>
          <Field label="Status color" id="statusColor">
            <Input id="statusColor" type="color" value={form.hero.statusColor} onChange={(e) => update('hero.statusColor', e.target.value)} className="h-9" />
          </Field>
          <Field label="Currently" id="heroCurrently" className="sm:col-span-2">
            <Input id="heroCurrently" value={form.hero.currently} onChange={(e) => update('hero.currently', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">About Section</h3>
        <Field label="Headline" id="headline">
          <Input id="headline" value={form.about.headline} onChange={(e) => update('about.headline', e.target.value)} />
        </Field>
        {form.about.paragraphs.map((p, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`} id={`paragraph-${i}`} className="mt-3">
            <Textarea id={`paragraph-${i}`} value={p} onChange={(e) => {
              const next = [...form.about.paragraphs]
              next[i] = e.target.value
              update('about.paragraphs', next)
            }} rows={3} />
          </Field>
        ))}
        <Field label="Currently studying (comma-separated)" id="currentlyStudying" className="mt-3">
          <Input
            id="currentlyStudying"
            value={form.about.currentlyStudying.join(', ')}
            onChange={(e) => update('about.currentlyStudying', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
      </div>
    </Section>
  )
}

function ProjectsTab({ projects, addProject, updateProject, deleteProject }) {
  return (
    <Section
      title="Projects"
      description="Add, edit, or remove portfolio projects."
      action={
        <button onClick={addProject} className="flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all">
          <Plus size={12} /> Add Project
        </button>
      }
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <Field label="Title" id={`project-title-${project.id}`}>
                  <Input id={`project-title-${project.id}`} value={project.title} onChange={(e) => updateProject(project.id, 'title', e.target.value)} />
                </Field>
                <Field label="Role" id={`project-role-${project.id}`}>
                  <Input id={`project-role-${project.id}`} value={project.role} onChange={(e) => updateProject(project.id, 'role', e.target.value)} />
                </Field>
                <Field label="Year" id={`project-year-${project.id}`}>
                  <Input id={`project-year-${project.id}`} type="number" value={project.year} onChange={(e) => updateProject(project.id, 'year', parseInt(e.target.value) || 2026)} />
                </Field>
                <Field label="GitHub URL" id={`project-gh-${project.id}`}>
                  <Input id={`project-gh-${project.id}`} value={project.githubUrl || ''} onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value || null)} />
                </Field>
                <Field label="Live URL" id={`project-live-${project.id}`}>
                  <Input id={`project-live-${project.id}`} value={project.liveUrl || ''} onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value || null)} />
                </Field>
                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={project.collab} onChange={(e) => updateProject(project.id, 'collab', e.target.checked)} className="w-4 h-4 accent-accent" />
                    <span className="font-mono text-xs text-muted">Collab</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={project.featured} onChange={(e) => updateProject(project.id, 'featured', e.target.checked)} className="w-4 h-4 accent-accent" />
                    <span className="font-mono text-xs text-muted">Featured</span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-muted hover:text-red-400 transition-colors p-1.5 shrink-0"
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <Field label="Description" id={`project-desc-${project.id}`}>
              <Textarea id={`project-desc-${project.id}`} value={project.description} onChange={(e) => updateProject(project.id, 'description', e.target.value)} rows={2} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <Field label="Problem" id={`project-problem-${project.id}`}>
                <Textarea id={`project-problem-${project.id}`} value={project.problem || ''} onChange={(e) => updateProject(project.id, 'problem', e.target.value || null)} rows={2} />
              </Field>
              <Field label="Contribution" id={`project-contrib-${project.id}`}>
                <Textarea id={`project-contrib-${project.id}`} value={project.contribution || ''} onChange={(e) => updateProject(project.id, 'contribution', e.target.value || null)} rows={2} />
              </Field>
            </div>
            <Field label="Tech stack" id={`project-stack-${project.id}`} className="mt-3">
              <ArrayEditor
                items={project.stack}
                onChange={(items) => updateProject(project.id, 'stack', items)}
                placeholder="Add technology..."
              />
            </Field>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted text-sm text-center py-8 font-mono">No projects yet. Click "Add Project" to get started.</p>
        )}
      </div>
    </Section>
  )
}

function SkillsTab({ skills, openAddSkillGroup, openEditSkillGroup, deleteSkillGroup }) {
  return (
    <Section
      title="Skills"
      description="Manage skill groups and individual skills."
      action={
        <button onClick={openAddSkillGroup} className="flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all">
          <Plus size={12} /> Add Skill Group
        </button>
      }
    >
      <div className="space-y-4">
        {skills.groups.map((group, gi) => (
          <div key={group.id || gi} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="min-w-0">
                <h3 className="font-display text-lg text-text font-semibold truncate">{group.category || 'Untitled group'}</h3>
                <p className="text-sm text-muted mt-1">{group.description || 'No description provided.'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditSkillGroup(gi)}
                  className="text-xs font-mono text-muted border border-border rounded-lg px-3 py-1.5 hover:text-text hover:border-border/80 transition-all"
                >
                  <Edit3 size={14} className="inline-block" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteSkillGroup(gi)}
                  className="text-xs font-mono text-muted border border-border rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-300 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.skills.filter((skill) => skill.label.trim()).map((skill) => (
                <SkillBadge key={skill.id || skill.label} label={skill.label} variant={skill.variant} />
              ))}
            </div>
            {group.skills.filter((skill) => skill.label.trim()).length === 0 && (
              <p className="text-sm text-muted mt-3">No skills in this group yet. Use Edit to add some.</p>
            )}
          </div>
        ))}

        <div className="mt-6 bg-surface border border-border rounded-xl p-4">
          <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">DSA Practice Blurb</h3>
          <Field label="Title" id="dsa-title">
            <Input id="dsa-title" value={skills.dsaPractice.title} onChange={() => {}} disabled />
          </Field>
          <Field label="Description" id="dsa-desc" className="mt-3">
            <Textarea id="dsa-desc" value={skills.dsaPractice.description} onChange={() => {}} rows={2} disabled />
          </Field>
        </div>
      </div>
    </Section>
  )
}

function EducationTab({ experience, addEducation, updateEducation, deleteEducation }) {
  return (
    <Section
      title="Education"
      description="Manage your education and experience entries."
      action={
        <button onClick={addEducation} className="flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all">
          <Plus size={12} /> Add Entry
        </button>
      }
    >
      <div className="space-y-4">
        {experience.map((entry, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <Field label="Institution" id={`exp-inst-${i}`}>
                  <Input id={`exp-inst-${i}`} value={entry.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                </Field>
                <Field label="Degree" id={`exp-degree-${i}`}>
                  <Input id={`exp-degree-${i}`} value={entry.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                </Field>
                <Field label="Year" id={`exp-year-${i}`}>
                  <Input id={`exp-year-${i}`} value={entry.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
                </Field>
                <Field label="Type" id={`exp-type-${i}`}>
                  <Select
                    id={`exp-type-${i}`}
                    value={entry.type}
                    onChange={(e) => updateEducation(i, 'type', e.target.value)}
                    options={[
                      { value: 'education', label: 'Education' },
                      { value: 'work', label: 'Work' },
                    ]}
                  />
                </Field>
              </div>
              <button onClick={() => deleteEducation(i)} className="text-muted hover:text-red-400 transition-colors p-1.5 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
            <Field label="Description" id={`exp-desc-${i}`}>
              <Textarea id={`exp-desc-${i}`} value={entry.description} onChange={(e) => updateEducation(i, 'description', e.target.value)} rows={2} />
            </Field>
          </div>
        ))}
        {experience.length === 0 && (
          <p className="text-muted text-sm text-center py-8 font-mono">No education entries yet.</p>
        )}
      </div>
    </Section>
  )
}

function ContactTab({ contact, update, addContactLink, updateContactLink, deleteContactLink }) {
  return (
    <Section
      title="Contact"
      description="Edit contact section content and links."
      action={
        <button onClick={addContactLink} className="flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/20 transition-all">
          <Plus size={12} /> Add Link
        </button>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Headline" id="contact-headline">
          <Input id="contact-headline" value={contact.headline} onChange={(e) => update('contact.headline', e.target.value)} />
        </Field>
        <Field label="Availability" id="contact-avail">
          <Input id="contact-avail" value={contact.availability} onChange={(e) => update('contact.availability', e.target.value)} />
        </Field>
        <Field label="Availability year" id="contact-avail-year">
          <Input id="contact-avail-year" value={contact.availabilityYear} onChange={(e) => update('contact.availabilityYear', e.target.value)} />
        </Field>
        <Field label="Description" id="contact-desc" className="sm:col-span-2">
          <Textarea id="contact-desc" value={contact.description} onChange={(e) => update('contact.description', e.target.value)} rows={2} />
        </Field>
      </div>

      <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Contact Links</h3>
      <div className="space-y-3">
        {contact.links.map((link) => (
          <div key={link.id} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <Field label="Label" id={`cl-label-${link.id}`}>
                  <Input id={`cl-label-${link.id}`} value={link.label} onChange={(e) => updateContactLink(link.id, 'label', e.target.value)} />
                </Field>
                <Field label="Icon" id={`cl-icon-${link.id}`}>
                  <Input id={`cl-icon-${link.id}`} value={link.icon} onChange={(e) => updateContactLink(link.id, 'icon', e.target.value)} />
                </Field>
                <Field label="Value (display)" id={`cl-value-${link.id}`}>
                  <Input id={`cl-value-${link.id}`} value={link.value} onChange={(e) => updateContactLink(link.id, 'value', e.target.value)} />
                </Field>
                <Field label="URL" id={`cl-href-${link.id}`}>
                  <Input id={`cl-href-${link.id}`} value={link.href} onChange={(e) => updateContactLink(link.id, 'href', e.target.value)} />
                </Field>
                <Field label="Description" id={`cl-desc-${link.id}`} className="sm:col-span-2">
                  <Input id={`cl-desc-${link.id}`} value={link.description} onChange={(e) => updateContactLink(link.id, 'description', e.target.value)} />
                </Field>
              </div>
              <button onClick={() => deleteContactLink(link.id)} className="text-muted hover:text-red-400 transition-colors p-1.5 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function SEOTab({ form, update, updateKeywords }) {
  return (
    <Section title="SEO & Metadata" description="Control how your site appears in search results and social shares.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Site title" id="seo-title">
          <Input id="seo-title" value={form.seo.title} onChange={(e) => update('seo.title', e.target.value)} />
        </Field>
        <Field label="Site URL" id="seo-url">
          <Input id="seo-url" value={form.seo.siteUrl} onChange={(e) => update('seo.siteUrl', e.target.value)} />
        </Field>
        <Field label="OG Image path" id="seo-og">
          <Input id="seo-og" value={form.seo.ogImage} onChange={(e) => update('seo.ogImage', e.target.value)} />
        </Field>
        <Field label="Twitter handle" id="seo-twitter">
          <Input id="seo-twitter" value={form.seo.twitterHandle || ''} onChange={(e) => update('seo.twitterHandle', e.target.value || null)} />
        </Field>
        <Field label="Meta description" id="seo-desc" className="sm:col-span-2">
          <Textarea id="seo-desc" value={form.seo.description} onChange={(e) => update('seo.description', e.target.value)} rows={2} />
        </Field>
        <Field label="Keywords (comma-separated)" id="seo-keywords" className="sm:col-span-2">
          <Input
            id="seo-keywords"
            value={form.seo.keywords.join(', ')}
            onChange={(e) => updateKeywords(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
      </div>

      <div className="mt-6">
        <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Analytics</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Google Analytics ID" id="ga-id">
            <Input id="ga-id" value={form.analytics.googleAnalyticsId || ''} onChange={(e) => update('analytics.googleAnalyticsId', e.target.value || null)} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Umami URL" id="umami-url">
            <Input id="umami-url" value={form.analytics.umamiUrl || ''} onChange={(e) => update('analytics.umamiUrl', e.target.value || null)} />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Theme</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Default mode" id="theme-default">
            <Select
              id="theme-default"
              value={form.theme.defaultMode}
              onChange={(e) => update('theme.defaultMode', e.target.value)}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'system', label: 'System preference' },
              ]}
            />
          </Field>
        </div>
      </div>
    </Section>
  )
}

// ─── Section wrapper ────────────────────────────────────
function Section({ title, description, children, action }) {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-text">{title}</h2>
          {description && <p className="text-muted text-sm mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
