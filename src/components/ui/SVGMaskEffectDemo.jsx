import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function SVGMaskEffectDemo() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 25 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 25 })

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          mouseX.set(e.clientX - rect.left)
          mouseY.set(e.clientY - rect.top)
        }
      }}
      className="flex h-[40rem] w-full items-center justify-center overflow-hidden rounded-md border border-border bg-surface px-6 py-16"
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="black" />
            <motion.circle
              r="120"
              fill="white"
              style={{
                x: smoothX,
                y: smoothY,
                filter: 'blur(2px)',
              }}
            />
          </mask>
        </defs>

        <g mask="url(#text-mask)">
          <rect width="100%" height="100%" fill="transparent" />
          <text
            x="50%"
            y="35%"
            textAnchor="middle"
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: 700,
              fill: 'currentColor',
              color: 'var(--text)',
            }}
          >
            Java Backend Developer
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
              fontWeight: 400,
              fill: 'currentColor',
              color: 'var(--muted)',
            }}
          >
            Building systems that actually run in production
          </text>
        </g>
      </svg>

      <div className="relative z-10 text-center">
        <div className="font-display text-2xl font-bold text-muted sm:text-4xl">
          Built with React + Vite
        </div>
        <div className="mt-4 font-mono text-sm text-border">
          Move your cursor to reveal
        </div>
      </div>
    </div>
  )
}