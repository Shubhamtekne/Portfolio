import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import getProfile from '../content/profile'
import { useDashboard } from '../context/DashboardContext'

function TerminalLine({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) { setDisplayed(text); return }
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 38)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [text, delay, shouldReduce])

  const isDone = displayed.length >= text.length

  return (
    <span>
      {displayed}
      {!isDone && (
        <span className="inline-block w-[0.55em] h-[1.1em] bg-accent align-middle ml-0.5 animate-cursor-blink" />
      )}
    </span>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  const shouldReduce = useReducedMotion()
  const { profileData } = useDashboard()
  const profile = profileData || getProfile()
  const { hero } = profile

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 sm:py-24 lg:py-28" aria-label="Hero section">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-100" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-radial-accent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-24 sm:px-8 md:px-10 lg:px-12">
        <motion.div
          variants={shouldReduce ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Terminal prompt */}
          <motion.div variants={shouldReduce ? {} : childVariants} className="font-mono text-xs text-muted mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span className="text-accent">~/portfolio</span>
            <span className="text-border mx-1">$</span>
            <span className="text-muted">
              <TerminalLine text={hero.terminalCommand} delay={0.3} />
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={shouldReduce ? {} : childVariants} className="font-display font-bold text-hero text-text leading-none tracking-tight mb-6">
            {profile.firstName}
            <span className="block text-accent">.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={shouldReduce ? {} : childVariants} className="font-display text-xl md:text-2xl lg:text-3xl text-muted font-medium tracking-tight max-w-2xl mb-10 leading-snug">
            {hero.tagline || profile.tagline}
          </motion.p>

          {/* Terminal card */}
          <motion.div variants={shouldReduce ? {} : childVariants} className="font-mono text-sm bg-surface border border-border rounded-lg p-5 max-w-lg mb-12 relative overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-2 text-[10px] text-muted">shubham@geca:~</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-accent">&rarr;</span> <span className="text-muted">stack:</span> <span className="text-text">{hero.stack}</span></div>
              <div><span className="text-accent">&rarr;</span> <span className="text-muted">currently:</span> <span className="text-text">{hero.currently}</span></div>
              <div><span className="text-accent">&rarr;</span> <span className="text-muted">status:</span> <span className="text-text" style={{ color: hero.statusColor }}>{hero.status}</span></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full" aria-hidden="true" />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={shouldReduce ? {} : childVariants} className="flex flex-wrap gap-4 items-center">
            <a
              href="#projects"
              data-magnetic
              className="inline-flex items-center gap-2 font-display font-semibold text-sm bg-accent text-bg px-6 py-3 rounded hover:bg-accent-dim transition-all duration-200 hover:shadow-[0_0_24px_rgba(56,189,248,0.3)]"
            >
              View my work
              <ArrowDown size={14} />
            </a>
            <a
              href="#contact"
              data-magnetic
              className="inline-flex items-center gap-2 font-display font-semibold text-sm border border-border text-muted px-6 py-3 rounded hover:text-text hover:border-border/80 transition-all duration-200"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        aria-hidden="true"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} className="text-border" />
        </motion.div>
      </motion.div>
    </section>
  )
}