import { motion, useReducedMotion } from 'framer-motion'
import { Mail, GitFork, Link, ArrowUpRight } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import getProfile from '../content/profile'
import { useDashboard } from '../context/DashboardContext'

const ICON_MAP = {
  Mail: Mail,
  GitFork: GitFork,
  Link: Link,
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function Contact() {
  const shouldReduce = useReducedMotion()
  const { profileData } = useDashboard()
  const profile = profileData || getProfile()
  const { contact } = profile

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border py-24 sm:py-28 lg:py-32" aria-label="Contact section">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(56,189,248,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <SectionHeading
          label="Contact"
          title={contact.headline}
          description={contact.description}
        />

        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {contact.links.map(({ id, icon, label, value, href, description }) => {
            const Icon = ICON_MAP[icon] || Link
            return (
              <motion.a
                key={id}
                variants={shouldReduce ? {} : fadeUp}
                whileHover={shouldReduce ? {} : { y: -4, transition: { duration: 0.2 } }}
                whileTap={shouldReduce ? {} : { scale: 0.98 }}
                href={href}
                target={href.startsWith('mailto') || href === '#' ? undefined : '_blank'}
                rel={href.startsWith('mailto') || href === '#' ? undefined : 'noopener noreferrer'}
                className="group bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/30 transition-colors duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(56,189,248,0.06) 0%, transparent 70%)' }}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <ArrowUpRight size={14} className="text-border group-hover:text-accent transition-colors duration-200" />
                </div>

                <div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">{label}</div>
                  <div className="font-display font-medium text-text text-sm break-all">{value}</div>
                  <div className="font-mono text-[10px] text-border mt-1">{description}</div>
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          variants={shouldReduce ? {} : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-[#28C840] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-sm text-muted">
            {contact.availability}
            <span className="text-border ml-2 font-mono text-[10px]">&mdash; {contact.availabilityYear}</span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}