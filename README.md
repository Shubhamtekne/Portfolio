# Shubham Tekne — Portfolio

Production-grade portfolio website built with React + Vite + Tailwind CSS.

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 12
- **State:** React Query + Zustand-ready architecture
- **SEO:** react-helmet-async + JSON-LD structured data
- **PWA:** Service Worker + manifest.json
- **Icons:** lucide-react
- **Build:** Code-splitting, lazy loading, CSS minification

## Architecture

```
src/
├── assets/          # Static assets (images, SVGs)
├── components/
│   ├── ui/          # Reusable design system (Button, Card, Badge, Skeleton, etc.)
│   ├── layout/      # Layout components (ErrorBoundary, SEO)
│   ├── animations/  # Animation components
│   └── sections/    # Page sections (Hero, About, Projects, Skills, Contact)
├── config/          # App configuration
├── content/         # Central CMS — edit profile.js to update all content
├── hooks/           # Custom React hooks
├── context/         # React context providers (Theme, Search)
├── utils/           # Utility functions
├── services/        # API services (GitHub, LeetCode)
├── lib/             # Shared libraries (animations)
├── types/           # Type definitions
├── pages/           # Route pages
├── routes/          # Router configuration
├── styles/          # CSS files (theme.css for light/dark modes)
├── constants/       # Constant values
└── data/            # Static data files
```

## Design System

All reusable UI components live in `src/components/ui/`:

| Component     | Description                          |
|---------------|--------------------------------------|
| `Button`      | Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. Supports loading, icons, href. |
| `Card`        | Animated surface card with optional hover lift. |
| `Badge`       | Small status labels. Variants: default, accent, success, warning. |
| `Skeleton`    | Loading placeholders. Variants: text, title, card, button, avatar. |
| `SkeletonCard`| Full card skeleton for project load states. |
| `SectionHeading` | Consistent section headers with label, title, description. |
| `Terminal`    | Retro terminal window frame. |
| `CommandPalette` | Ctrl+K modal with search + Vercel-like commands. |

## Features

### ✅ Completed
- **Dark/Light theme** — persisted in localStorage, respects system preference
- **Command palette** — Ctrl+K, search all content, Vercel-style commands
- **Global search** — searches projects, skills, sections, experience
- **CMS-driven content** — edit `src/content/profile.js` to update everything
- **Code splitting** — manual chunks for React, Framer, Lucide, React Query
- **Lazy loading** — App component is lazy-loaded
- **Error boundary** — catches render errors with recovery UI
- **SEO** — meta tags, OpenGraph, Twitter Cards, JSON-LD Schema.org
- **PWA** — service worker for offline support, manifest.json
- **Security** — meta-equivalent security headers, noopener/noreferrer on external links
- **Accessibility** — skip-to-content link, ARIA labels, keyboard nav, semantic HTML
- **Tailwind integration** — dark mode via `class` strategy
- **Animation library** — centralized `src/lib/animations.js`
- **Reusable hooks** — `useScrollPosition`, `useMediaQuery`
- **CI/CD ready** — `.env.example`, deployment-agnostic static build
- **Responsive** — mobile, tablet, desktop, ultra-wide
- **Reduced motion** — respects `prefers-reduced-motion`
- **Loading skeletons** — skeleton components for async content

### 🔄 In Progress / Planned
- [ ] Blog-ready architecture (MDX support)
- [ ] GitHub API integration (repos, contributions)
- [ ] LeetCode API integration (stats, heatmap)
- [ ] Contact form (EmailJS or Resend)
- [ ] Unit & integration tests (Vitest + Testing Library)
- [ ] Accessibility audit (axe-core / Lighthouse)
- [ ] Blog section with categories/tags/search
- [ ] Analytics integration (GA4 / Umami)
- [ ] Project filtering & pagination

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Deployment

Build output is in `dist/`. Deploy to any static host:

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

## Content Management

Update all content by editing `src/content/profile.js`. This single file controls:

- Personal info (name, role, email, location)
- Hero section (terminal command, tagline, status)
- About section (paragraphs, stats, currently studying)
- Projects (title, description, stack, links)
- Skills (groups, categories, variants)
- Experience/education
- Contact links
- SEO metadata
- Analytics configuration
- Theme preferences

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable           | Description                     |
|--------------------|---------------------------------|
| `VITE_GA_ID`       | Google Analytics 4 ID           |
| `VITE_UMAMI_URL`   | Umami analytics URL             |
| `VITE_SITE_URL`    | Deployment URL                  |
| `VITE_GITHUB_TOKEN`| GitHub API token (optional)     |

## Performance

Build results (with code splitting):

| Chunk               | Size (raw) | Size (gzip) |
|---------------------|-----------|-------------|
| React vendor        | 181.9 kB  | 57.2 kB     |
| Animation vendor    | 133.3 kB  | 43.5 kB     |
| Query vendor        | 26.7 kB   | 8.0 kB      |
| UI vendor           | 5.4 kB    | 2.3 kB      |
| App + sections      | 46.7 kB   | 13.6 kB     |
| CSS                 | 23.6 kB   | 5.6 kB      |

## License

MIT
