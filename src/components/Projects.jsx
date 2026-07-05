import { motion, useReducedMotion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import SectionHeading from './ui/SectionHeading'
import getProfile from '../content/profile'
import { useDashboard } from '../context/DashboardContext'

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function Projects() {
  const shouldReduce = useReducedMotion()
  const { profileData } = useDashboard()
  const profile = profileData || getProfile()
  const projects = profile.projects

  return (
    <section id="projects" className="relative border-t border-border py-24 sm:py-28 lg:py-32" aria-label="Projects section">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <SectionHeading
          label="Work"
          title="What I've built"
          description="Real projects — built to work, not to demo. Each one has a backend that actually connects to a database and returns real data."
        />

        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-6 md:grid-cols-2"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
        </motion.div>

        <motion.p
          initial={shouldReduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-mono text-xs text-border mt-10 text-center"
        >
          More projects in progress — check{' '}
          <a
            href={profile.socials.github?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors underline underline-offset-2"
          >
            GitHub
          </a>{' '}
          for latest activity.
        </motion.p>
      </div>
    </section>
  )
}
