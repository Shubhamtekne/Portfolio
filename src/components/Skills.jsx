import { motion, useReducedMotion } from 'framer-motion'
import SkillTag from './SkillTag'
import SectionHeading from './ui/SectionHeading'
import getProfile from '../content/profile'
import { useDashboard } from '../context/DashboardContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

export default function Skills() {
  const shouldReduce = useReducedMotion()
  const { profileData } = useDashboard()
  const profile = profileData || getProfile()
  const { skills } = profile
  let globalIndex = 0

  return (
    <section id="skills" className="relative border-t border-border py-24 sm:py-28 lg:py-32" aria-label="Skills section">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <SectionHeading
          label="Stack"
          title="What I work with"
          description="Only what I've actually used. No inflated skill bars, no percentages — those don't mean anything anyway."
        />

        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {skills.groups.map((group, groupIndex) => {
            const groupStartIndex = globalIndex
            globalIndex += group.skills.length

            return (
              <motion.div
                key={group.category}
                variants={shouldReduce ? {} : { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                transition={{ delay: groupIndex * 0.08 }}
                className={group.category === 'Currently learning' ? 'md:col-span-2 xl:col-span-3' : ''}
              >
                <div className="mb-4 flex items-baseline gap-3">
                  <h3 className="font-display font-semibold text-text text-sm">{group.category}</h3>
                  <span className="font-mono text-[10px] text-border uppercase tracking-widest">{group.description}</span>
                </div>

                {group.category === 'Currently learning' ? (
                  <div className="bg-surface border border-border/50 rounded-xl p-5">
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, i) => (
                        <SkillTag key={skill.label} label={skill.label} variant={skill.variant} index={groupStartIndex + i} />
                      ))}
                    </div>
                    <p className="font-mono text-[10px] text-border mt-4">
                      &uarr; Actively studying &mdash; not yet production-experienced
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, i) => (
                      <SkillTag key={skill.label} label={skill.label} variant={skill.variant} index={groupStartIndex + i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          variants={shouldReduce ? {} : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 flex items-start gap-4 bg-surface border border-border rounded-xl p-6 max-w-xl"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="font-mono text-accent text-sm font-bold">{`{}`}</span>
          </div>
          <div>
            <div className="font-display font-semibold text-text text-sm mb-1">{skills.dsaPractice.title}</div>
            <p className="font-mono text-xs text-muted leading-relaxed">{skills.dsaPractice.description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
