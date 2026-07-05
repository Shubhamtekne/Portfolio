import { Suspense, lazy, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import CommandPalette from './components/ui/CommandPalette'
import SEO from './components/layout/SEO'
import getProfile from './content/profile'
import { useAuth } from './context/AuthContext'
import { useDashboard } from './context/DashboardContext'
import { ADMIN_DASHBOARD_ROUTE, ADMIN_LOGIN_ROUTE } from './config/authConfig'
import Cursor from './components/animations/Cursor'
// import { Analytics } from "@vercel/analytics/react"

const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUnauthorized = lazy(() => import('./pages/admin/Unauthorized'))

export default function App() {
  useEffect(() => {
    const profile = getProfile()
    if (profile.analytics.googleAnalyticsId) {
      // Google Analytics 4 would be initialized here
      // window.gtag?.('config', profile.analytics.googleAnalyticsId)
    }
  }, [])

  return (
    <>
      <Cursor />

      <Router>
        <Routes>
          <Route path={ADMIN_LOGIN_ROUTE} element={<AdminAuthRoute />} />
          <Route path={ADMIN_DASHBOARD_ROUTE} element={<ProtectedAdminRoute />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute />} />
          <Route path="*" element={<PortfolioWithFooter />} />
        </Routes>
      </Router>
    </>
  )
}



function AdminAuthRoute() {
  const { authenticated, checking } = useAuth()

  if (checking) return null
  if (authenticated) return <Navigate to={ADMIN_DASHBOARD_ROUTE} replace />

  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  )
}

function ProtectedAdminRoute() {
  const { authenticated, checking } = useAuth()

  if (checking) return null

  return authenticated ? (
    <Suspense fallback={null}>
      <AdminDashboard />
    </Suspense>
  ) : (
    <Suspense fallback={null}>
      <AdminUnauthorized />
    </Suspense>
  )
}

function PortfolioWithFooter() {
  const location = useLocation()
  const isPortfolioHome = location.pathname === '/' || location.pathname === ''

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text font-body">
      <SEO />
      <NavBar />
      <CommandPalette />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="overflow-x-hidden">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {isPortfolioHome && (
        <footer className="relative border-t border-border px-6 py-10 text-center sm:px-8 lg:px-10">
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <FooterContent />
        </footer>
      )}
    </div>
  )
}

function FooterContent() {
  const { profileData } = useDashboard()
  const profile = useMemo(() => profileData || getProfile(), [profileData])

  return (
    <>
      <p className="font-mono text-xs tracking-wider text-muted">
        &copy; {new Date().getFullYear()} {profile.name} &mdash; Built with React + Vite
      </p>
      <p className="mt-1 font-mono text-[10px] text-border">
        Java backend developer &middot; MCA @ GECA &middot; {profile.location}
      </p>
    </>
  )
}