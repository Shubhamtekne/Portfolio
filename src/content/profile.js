import { DASHBOARD_STORAGE_KEY, LEGACY_DASHBOARD_STORAGE_KEY } from '../config/authConfig'

/**
 * Central Content Management System
 * ====================================
 * Edit this single file to update all content across the portfolio.
 * No component-level hardcoding — everything is data-driven.
 */

export const profile = {
  // ─── Personal ───────────────────────────────────────────
  name: 'Shubham Arun Tekne',
  firstName: 'शुभम टेकणे',
  tagline: 'Java backend developer building systems that actually run in production.',
  role: 'Java Backend Developer',
  email: 'shubhamtekne.dev@gmail.com',
  phone: '+91-8007029001',
  location: 'Aurangabad, Maharashtra, India',
  resumeUrl: null, // Replace with Google Drive / Dropbox link

  // ─── Social ─────────────────────────────────────────────
  socials: {
    github: { url: 'https://github.com/Shubhamtekne', label: 'GitHub' },
    leetcode: { url: 'https://leetcode.com/u/tekneshubham/', label: 'LeetCode' },
    linkedin: { url: null, label: 'LinkedIn' },
    twitter: { url: null, label: 'Twitter / X' },
  },

  // ─── SEO ────────────────────────────────────────────────
  seo: {
    title: 'Shubham Tekne — Java Backend Developer',
    description:
      'Java backend developer and MCA student at GECA. Building REST APIs and Spring Boot applications.',
    keywords: [
      'Shubham Tekne',
      'Java developer',
      'Spring Boot',
      'backend developer',
      'GECA',
      'MCA',
      'portfolio',
      'campus placement',
    ],
    ogImage: '/og-image.png',
    siteUrl: 'https://tekneshubham.vercel.app',
    twitterHandle: null,
  },

  // ─── Hero ───────────────────────────────────────────────
  hero: {
    terminalCommand: 'java -jar shubham.jar --mode=production',
    stack: 'Java · Spring Boot · MySQL · REST APIs',
    status: 'Available for opportunities',
    statusColor: '#28C840',
    currently: 'MCA @ GECA · Preparing for placements 2027',
  },

  // ─── About ──────────────────────────────────────────────
  about: {
    headline: 'I build backends, not slides.',
    paragraphs: [
      "I'm a second-year MCA student at Government Engineering College Aurangabad — one of Maharashtra's top government engineering colleges. My focus is backend development: writing the server logic, designing the database schema, and getting the API to actually respond correctly.",
      'My foundation is Core Java — not just the syntax, but the object model, collections, and exception handling that make real applications work. I use Spring Boot to build RESTful services and MySQL for data storage and query design. I practice DSA on LeetCode regularly because writing working code under constraints matters.',
      
    ],
    stats: [
      { icon: 'GraduationCap', label: 'Programme', value: 'MCA' },
      { icon: 'Target', label: 'College', value: 'GECA' },
      { icon: 'Code2', label: 'Core Stack', value: 'Java / Spring Boot' },
      { icon: 'Cpu', label: 'Focus', value: 'Backend Systems' },
    ],
    currentlyStudying: ['DSA (LeetCode)', 'System Design basics', 'Spring Security', 'Microservices concepts'],
  },

  // ─── Projects ───────────────────────────────────────────
projects: [
  {
    id: 'coming-soon',
    title: 'Projects Coming Soon',
    role: 'Currently Building',
    collab: false,
    description:
      'I am currently building production-ready Java backend and full-stack projects. This section will be updated with detailed case studies, source code, and live demos as they are completed.',
    problem: null,
    contribution: null,
    stack: ['Java', 'Spring Boot', 'React', 'MySQL'],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    year: 2026,
  },
],
  // ─── Skills ─────────────────────────────────────────────
  skills: {
    groups: [
      {
        category: 'Languages',
        description: 'Fluent',
        skills: [
          { label: 'Java', variant: 'primary' },
          { label: 'C', variant: 'primary' },
          { label: 'C++', variant: 'primary' },
          { label: 'Python (basics)', variant: 'primary' },
          { label: 'SQL', variant: 'primary' },
        ],
      },
      {
        category: 'Backend',
        description: 'Working knowledge',
        skills: [
          { label: 'Spring Boot', variant: 'primary' },
           { label: 'JPA / Hibernate', variant: 'primary' },
          { label: 'REST APIs', variant: 'secondary' },
          { label: 'Spring MVC', variant: 'secondary' },
          { label: 'Maven', variant: 'secondary' },
        ],
      },
      {
        category: 'Database',
        description: 'Working knowledge',
        skills: [
          { label: 'MySQL', variant: 'primary' },
          { label: 'PostgreSQL', variant: 'secondary' },
          { label: 'MongoDB', variant: 'secondary' },
        ],
      },
      {
        category: 'Tools',
        description: 'Daily use',
        skills: [
          { label: 'Leetcode', variant: 'primary' },
          { label: 'Git', variant: 'secondary' },
          { label: 'GitHub', variant: 'secondary' },
          { label: 'IntelliJ IDEA', variant: 'secondary' },
          { label: 'VS Code', variant: 'secondary' },
          { label: 'Postman', variant: 'secondary' }
        ],
      },
      {
        category: 'Currently learning',
        description: 'In progress',
        skills: [
          { label: 'DSA', variant: 'learning' },
          { label: 'System Design basics', variant: 'learning' },
          { label: 'Spring Security', variant: 'learning' },
          { label: 'Microservices', variant: 'learning' },
          { label: 'Docker basics', variant: 'learning' },
        ],
      },
    ],
    dsaPractice: {
      title: 'DSA Practice',
      description:
        'Practicing data structures and algorithms on LeetCode — Building problem-solving consistency before placements.',
    },
  },

  // ─── Experience / Education ─────────────────────────────
  experience: [
    {
      type: 'education',
      institution: 'Government Engineering College Aurangabad (GECA)',
      degree: 'Master of Computer Applications (MCA)',
      year: '2025 – 2027',
      description: 'Second-year student. Focused on backend engineering, DSA, and placement preparation.',
    },
  ],

  // ─── Contact ────────────────────────────────────────────
  contact: {
    headline: "Let's talk.",
    description:
      "If you're a recruiter or hiring manager looking for a Java backend developer who's ready to contribute from day one — reach out. I respond within 24 hours.",
    availability: 'Available for campus placements and internship opportunities',
    availabilityYear: '2026',
    links: [
      {
        id: 'contact-email',
        icon: 'Mail',
        label: 'Email',
        value: 'shubhamtekne.dev@gmail.com',
        href: 'mailto:shubhamtekne.dev@gmail.com',
        description: 'Best for recruiter enquiries',
      },
      {
        id: 'contact-github',
        icon: 'GitFork',
        label: 'GitHub',
        value: 'github.com/Shubhamtekne',
        href: 'https://github.com/Shubhamtekne',
        description: 'Projects and code activity',
      },
      {
        id: 'contact-leetcode',
        icon: 'Link',
        label: 'LeetCode',
        value: 'leetcode.com/u/tekneshubham',
        href: 'https://leetcode.com/u/tekneshubham',
        description: 'DSA practice profile',
      },
    ],
  },

  // ─── Analytics ──────────────────────────────────────────
  analytics: {
    googleAnalyticsId: null, // Set to 'G-XXXXXXXXXX' when ready
    umamiUrl: null, // Set to your Umami instance URL for self-hosted analytics
  },

  // ─── Theme ──────────────────────────────────────────────
  theme: {
    defaultMode: 'dark', // 'dark' | 'light' | 'system'
    allowToggle: true,
  },
}

const DATA_KEY = DASHBOARD_STORAGE_KEY
const LEGACY_DATA_KEY = LEGACY_DASHBOARD_STORAGE_KEY

function normalizeSkillEntry(skill) {
  if (!skill || typeof skill !== 'object') {
    return { label: String(skill || 'New Skill'), variant: 'secondary' }
  }

  const validVariants = ['primary', 'secondary', 'learning']
  const label = String(skill.label || skill.name || skill.title || 'New Skill')
  let variant = String(skill.variant || skill.type || 'secondary').toLowerCase()

  if (!validVariants.includes(variant) && validVariants.includes(label.toLowerCase())) {
    variant = label.toLowerCase()
  }

  if (!validVariants.includes(variant)) {
    variant = 'secondary'
  }

  return {
    ...skill,
    label,
    variant,
  }
}

function normalizeProfileData(profileData) {
  if (!profileData || typeof profileData !== 'object') return profileData
  return {
    ...profileData,
    skills: {
      ...profileData.skills,
      groups: (profileData.skills?.groups || []).map((group) => ({
        ...group,
        category: group?.category || 'Untitled',
        description: group?.description || '',
        skills: (group?.skills || []).map(normalizeSkillEntry),
      })),
      dsaPractice: {
        title: profileData.skills?.dsaPractice?.title || 'DSA Practice',
        description:
          profileData.skills?.dsaPractice?.description ||
          'Practicing data structures and algorithms on LeetCode — arrays, strings, hashmaps, recursion. Building problem-solving consistency before placements.',
      },
    },
  }
}

function loadOverride() {
  try {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(DATA_KEY) || localStorage.getItem(LEGACY_DATA_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (e) {
    return null
  }
}

// Cache last-read storage string and merged result to avoid recomputing
let _lastRaw = null
let _lastMerged = profile

export function getProfile() {
  try {
    if (typeof window === 'undefined') return profile
    const raw = localStorage.getItem(DATA_KEY) || localStorage.getItem(LEGACY_DATA_KEY)
    if (raw === _lastRaw) return _lastMerged
    _lastRaw = raw
    if (!raw) {
      _lastMerged = profile
      return _lastMerged
    }
    const parsed = JSON.parse(raw)
    _lastMerged = normalizeProfileData(Object.assign({}, profile, parsed))
    return _lastMerged
  } catch (e) {
    return profile
  }
}

export default getProfile
