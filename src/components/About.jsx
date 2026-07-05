import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, Code2, Cpu, Target } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import SVGMaskEffectDemo from './ui/SVGMaskEffectDemo'
import getProfile from '../content/profile'
import { useDashboard } from '../context/DashboardContext'

const ICON_MAP = {
  GraduationCap: GraduationCap,
  Target: Target,
  Code2: Code2,
  Cpu: Cpu,
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

export default function About() {
  const shouldReduce = useReducedMotion()
  const { profileData } = useDashboard()
  const Profile = profileData || getProfile()
  const about = Profile.about

  return (
    <section id="about" className="relative border-t border-border py-24 sm:py-28 lg:py-32" aria-label="About section">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* Left: text */}
          <motion.div
            variants={shouldReduce ? {} : fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <SectionHeading label="About" title={about.headline} description="" />

            <div className="mt-[-1.5rem] space-y-5 text-muted leading-relaxed sm:mt-[-2rem]">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          {/* Right: stat cards */}
          <motion.div
            variants={shouldReduce ? {} : staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {about.stats.map(({ icon, label, value }) => {
              const Icon = ICON_MAP[icon] || Code2
              return (
                <motion.div
                  key={label}
                  variants={shouldReduce ? {} : fadeUp}
                  className="bg-surface border border-border rounded-xl p-6 group hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">{label}</div>
                  <div className="font-display font-semibold text-text text-sm leading-tight">{value}</div>
                </motion.div>
              )
            })}

            <motion.div
              variants={shouldReduce ? {} : fadeUp}
              className="col-span-2 bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors duration-300"
            >
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Currently studying</div>
              <div className="flex flex-wrap gap-2">
                {about.currentlyStudying.map((item) => (
                  <span key={item} className="font-mono text-xs text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
          {/* <motion.div
            variants={shouldReduce ? {} : fadeUp}
            initial="hidde"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="col-span-full"
          >
            <SVGMaskEffectDemo />
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}
