/**
 * Core type definitions for the portfolio.
 * These serve as documentation of the data shapes used across the app.
 * When migrating to TypeScript, rename to .ts and add interfaces.
 */

/** @typedef {{ name: string, firstName: string, tagline: string, role: string, email: string, phone: string, location: string, resumeUrl: string|null }} Personal */

/** @typedef {{ github: SocialLink, leetcode: SocialLink, linkedin: SocialLink, twitter: SocialLink }} Socials */

/** @typedef {{ url: string|null, label: string }} SocialLink */

/** @typedef {{ title: string, description: string, keywords: string[], ogImage: string, siteUrl: string, twitterHandle: string|null }} SEO */

/** @typedef {{ terminalCommand: string, stack: string, status: string, statusColor: string, currently: string }} Hero */

/** @typedef {{ headline: string, paragraphs: string[], stats: Stat[], currentlyStudying: string[] }} About */

/** @typedef {{ icon: string, label: string, value: string }} Stat */

/** @typedef {{ id: string, title: string, role: string, collab: boolean, description: string, problem: string|null, contribution: string|null, stack: string[], githubUrl: string|null, liveUrl: string|null, featured: boolean, year: number }} Project */

/** @typedef {{ category: string, description: string, skills: Skill[] }} SkillGroup */

/** @typedef {{ label: string, variant: 'primary'|'secondary'|'learning' }} Skill */

/** @typedef {{ type: 'education'|'work', institution: string, degree: string, year: string, description: string }} Experience */

/** @typedef {{ id: string, icon: string, label: string, value: string, href: string, description: string }} ContactLink */

/** @typedef {{ headline: string, description: string, availability: string, availabilityYear: string, links: ContactLink[] }} Contact */

/** @typedef {{ googleAnalyticsId: string|null, umamiUrl: string|null }} Analytics */

/** @typedef {{ defaultMode: 'dark'|'light'|'system', allowToggle: boolean }} Theme */

/** @typedef {{ name: string, personal: Personal, socials: Socials, seo: SEO, hero: Hero, about: About, projects: Project[], skills: { groups: SkillGroup[], dsaPractice: { title: string, description: string } }, experience: Experience[], contact: Contact, analytics: Analytics, theme: Theme }} Profile */

export {}
