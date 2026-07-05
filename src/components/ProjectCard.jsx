import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, GitFork, ArrowUpRight } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function ProjectCard({
  title,
  description,
  problem,
  contribution,
  stack = [],
  role,
  githubUrl = null,
  liveUrl = null,
  collab = false,
  index = 0,
}) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.article
      variants={shouldReduce ? {} : cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={shouldReduce ? {} : { y: -4, transition: { duration: 0.2 } }}
      className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-surface/80 p-6 transition-colors duration-300 hover:border-accent/30 sm:p-7 lg:p-8"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,189,248,0.05) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {role && (
              <span className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase tracking-widest">
                {role}
              </span>
            )}
            {collab && (
              <span className="font-mono text-[10px] text-muted bg-border/30 border border-border px-2 py-0.5 rounded uppercase tracking-widest">
                Collab
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-xl text-text leading-tight group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={githubUrl || '#'}
            target={githubUrl ? '_blank' : undefined}
            rel={githubUrl ? 'noopener noreferrer' : undefined}
            data-magnetic
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
              githubUrl
                ? 'border-border text-muted hover:text-text hover:border-border/80'
                : 'border-border/40 text-border cursor-default'
            }`}
            aria-label={`GitHub repository for ${title}${!githubUrl ? ' (coming soon)' : ''}`}
            title={!githubUrl ? 'GitHub link coming soon' : undefined}
          >
            <GitFork size={14} />
          </a>
          <a
            href={liveUrl || '#'}
            target={liveUrl ? '_blank' : undefined}
            rel={liveUrl ? 'noopener noreferrer' : undefined}
            data-magnetic
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
              liveUrl
                ? 'border-border text-muted hover:text-accent hover:border-accent/40'
                : 'border-border/40 text-border cursor-default'
            }`}
            aria-label={`Live demo for ${title}${!liveUrl ? ' (coming soon)' : ''}`}
            title={!liveUrl ? 'Live demo coming soon' : undefined}
          >
            {liveUrl ? <ExternalLink size={14} /> : <ArrowUpRight size={14} />}
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed">{description}</p>

      {/* Problem */}
      {problem && (
        <div className="bg-bg/60 border border-border/50 rounded-lg p-4">
          <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1.5">Problem solved</div>
          <p className="text-sm text-muted leading-relaxed">{problem}</p>
        </div>
      )}

      {/* Contribution */}
      {contribution && (
        <div>
          <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">My contribution</div>
          <p className="text-sm text-text leading-relaxed">{contribution}</p>
        </div>
      )}

      {/* Stack */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {stack.map((tech) => (
            <span key={tech} className="font-mono text-xs text-muted bg-bg border border-border/60 px-2.5 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  )
}
