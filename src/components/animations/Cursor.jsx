// import { motion, useMotionValue, useSpring, animate } from 'framer-motion'
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// const PREMIUM_EASE = [0.25, 0.1, 0.25, 1]
// const FADE_EASE = [0.4, 0, 0.2, 1]

// export default function Cursor() {
//   const mouseX = useMotionValue(-100)
//   const mouseY = useMotionValue(-100)
//   const cursorScale = useMotionValue(1)
//   const viewOpacity = useMotionValue(0)

//   const dotX = useSpring(mouseX, { stiffness: 1100, damping: 18, mass: 0.2 })
//   const dotY = useSpring(mouseY, { stiffness: 1100, damping: 18, mass: 0.2 })
//   const circleX = useSpring(mouseX, { stiffness: 700, damping: 22, mass: 0.35 })
//   const circleY = useSpring(mouseY, { stiffness: 700, damping: 22, mass: 0.35 })
//   const glowX = useSpring(mouseX, { stiffness: 350, damping: 28, mass: 0.7 })
//   const glowY = useSpring(mouseY, { stiffness: 350, damping: 28, mass: 0.7 })

//   const scale = useSpring(cursorScale, { stiffness: 900, damping: 22, mass: 0.45 })

//   const [magneticTarget, setMagneticTarget] = useState(null)
//   const moveTimeoutRef = useRef(null)
//   const isStableRef = useRef(false)
//   const isHoveringRef = useRef(false)

//   const interactiveSelector = useMemo(
//     () => 'a, button, input, textarea, select, [role="button"], [data-cursor-hover], article, [data-magnetic], p, span, div, h1, h2, h3, h4, h5, h6',
//     [],
//   )

//   const smoothFadeIn = useCallback(() => {
//     isHoveringRef.current = true
//     isStableRef.current = false

//     animate(viewOpacity, 1, { duration: 0.35, ease: PREMIUM_EASE })
//     animate(cursorScale, 1, { duration: 0.35, ease: PREMIUM_EASE })
//   }, [viewOpacity, cursorScale])

//   const handleMove = useCallback(
//     (event) => {
//       mouseX.set(event.clientX)
//       mouseY.set(event.clientY)

//       if (isStableRef.current || !isHoveringRef.current) {
//         smoothFadeIn()
//         isStableRef.current = false
//       }

//       if (moveTimeoutRef.current) {
//         clearTimeout(moveTimeoutRef.current)
//       }
//       moveTimeoutRef.current = setTimeout(() => {
//         if (!magneticTarget && isHoveringRef.current) {
//           isStableRef.current = true
//           animate(viewOpacity, 0, { duration: 1.2, ease: FADE_EASE })
//           animate(cursorScale, 1, { duration: 1.2, ease: FADE_EASE })
//         }
//       }, 1800)

//       if (magneticTarget) {
//         const rect = magneticTarget.getBoundingClientRect()
//         const centerX = rect.left + rect.width / 2
//         const centerY = rect.top + rect.height / 2
//         const maxDist = 10

//         const distX = event.clientX - centerX
//         const distY = event.clientY - centerY

//         if (Math.abs(distX) < maxDist * 3 && Math.abs(distY) < maxDist * 3) {
//           const pullX = (distX / maxDist) * maxDist * 0.3
//           const pullY = (distY / maxDist) * maxDist * 0.3
//           magneticTarget.style.transform = `translate(${pullX}px, ${pullY}px)`
//         } else {
//           magneticTarget.style.transform = ''
//         }
//       }
//     },
//     [mouseX, mouseY, magneticTarget, smoothFadeIn, viewOpacity, cursorScale],
//   )

//   const handleEnterInteractive = useCallback((event) => {
//     const target = event.target
//     if (!(target instanceof Element)) return

//     const element = target.closest(interactiveSelector)
//     if (!element) return

//     if (moveTimeoutRef.current) {
//       clearTimeout(moveTimeoutRef.current)
//     }
//     isStableRef.current = false

//     smoothFadeIn()

//     if (element.hasAttribute('data-magnetic')) {
//       setMagneticTarget(element)
//       element.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
//     }

//     const isProjectCard = element.tagName === 'ARTICLE' || element.closest('article')

//     if (isProjectCard) {
//       animate(viewOpacity, 1, { duration: 0.3, ease: PREMIUM_EASE })
//       animate(cursorScale, 2.2, { duration: 0.4, ease: PREMIUM_EASE })
//     } else {
//       animate(viewOpacity, 1, { duration: 0.3, ease: PREMIUM_EASE })
//       animate(cursorScale, 1.16, { duration: 0.35, ease: PREMIUM_EASE })
//     }
//   }, [interactiveSelector, smoothFadeIn, viewOpacity, cursorScale])

//   const handleLeaveInteractive = useCallback((event) => {
//     const target = event.target

//     if (!(target instanceof Element)) return

//     const element = target.closest(interactiveSelector)
//     if (!element) return

//     if (element.hasAttribute('data-magnetic')) {
//       setMagneticTarget(null)
//       element.style.transform = ''
//       element.style.transition = ''
//     }

//     animate(viewOpacity, 0, { duration: 0.3, ease: PREMIUM_EASE })
//     animate(cursorScale, 1, { duration: 0.35, ease: PREMIUM_EASE })

//     if (moveTimeoutRef.current) {
//       clearTimeout(moveTimeoutRef.current)
//     }
//     moveTimeoutRef.current = setTimeout(() => {
//       if (!magneticTarget) {
//         isStableRef.current = true
//         isHoveringRef.current = false
//       }
//     }, 1800)
//   }, [interactiveSelector, cursorScale, viewOpacity, magneticTarget])

//   const handlePointerDown = useCallback(() => {
//     animate(cursorScale, 0.84, { duration: 0.15, ease: PREMIUM_EASE })
//   }, [cursorScale])

//   const handlePointerUp = useCallback(() => {
//     animate(cursorScale, 1, { duration: 0.2, ease: PREMIUM_EASE })
//   }, [cursorScale])

//   const handleMouseLeave = useCallback(() => {
//     isStableRef.current = false
//     isHoveringRef.current = false
//     if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
//   }, [])

//   useEffect(() => {
//     const isPointerFine = window.matchMedia('(pointer: fine)').matches
//     const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

//     if (!isPointerFine || prefersReduced) {
//       document.body.style.cursor = ''
//       return
//     }

//     document.body.style.cursor = 'none'

//     const handlePointerOver = (event) => {
//       const target = event.target
//       if (!(target instanceof Element)) return
//       if (target.closest(interactiveSelector)) {
//         handleEnterInteractive(event)
//       }
//     }

//     const handlePointerOut = (event) => {
//       const target = event.target
//       const relatedTarget = event.relatedTarget
//       if (!(target instanceof Element)) return

//       if (!relatedTarget || !(relatedTarget instanceof Element)) {
//         handleLeaveInteractive(event)
//         return
//       }

//       if (relatedTarget && relatedTarget instanceof Element && !relatedTarget.closest(interactiveSelector)) {
//         handleLeaveInteractive(event)
//       }
//     }

//     window.addEventListener('mousemove', handleMove)
//     window.addEventListener('mousedown', handlePointerDown)
//     window.addEventListener('mouseup', handlePointerUp)
//     window.addEventListener('mouseleave', handleMouseLeave)
//     window.addEventListener('mouseenter', () => {
//       isStableRef.current = false
//     })
//     window.addEventListener('pointerover', handlePointerOver)
//     window.addEventListener('pointerout', handlePointerOut)

//     return () => {
//       document.body.style.cursor = ''
//       if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
//       window.removeEventListener('mousemove', handleMove)
//       window.removeEventListener('mousedown', handlePointerDown)
//       window.removeEventListener('mouseup', handlePointerUp)
//       window.removeEventListener('mouseleave', handleMouseLeave)
//       window.removeEventListener('pointerover', handlePointerOver)
//       window.removeEventListener('pointerout', handlePointerOut)
//     }
//   }, [handleEnterInteractive, handleLeaveInteractive, handleMove, handlePointerDown, handlePointerUp, handleMouseLeave, interactiveSelector, magneticTarget])

//   return (
//     <div
//       className="pointer-events-none fixed inset-0 z-[100000] hidden sm:block"
//       aria-hidden="true"
//       data-premium-cursor
//     >
//       {/* Glow Layer - 150-180px with cyan glow */}
//       <motion.div
//         className="absolute left-0 top-0 h-0 w-0"
//         style={{ x: glowX, y: glowY, opacity: viewOpacity }}
//       >
//         <motion.div
//           className="absolute left-[-90px] top-[-90px] h-44 w-44 rounded-full"
//           style={{
//             scale,
//             background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0) 70%)',
//             filter: 'blur(40px)',
//           }}
//         />
//       </motion.div>

//       {/* Main Glass Circle - 40px with glassmorphism */}
//       <motion.div
//         className="absolute left-0 top-0 h-0 w-0"
//         style={{ x: circleX, y: circleY, opacity: viewOpacity }}
//       >
//         <motion.div
//           className="absolute left-[-22px] top-[-22px] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)]"
//           style={{ scale }}
//         />
//       </motion.div>

//       {/* Center Dot - 4-6px white */}
//       <motion.div
//         className="absolute left-0 top-0 h-0 w-0"
//         style={{ x: dotX, y: dotY, opacity: viewOpacity }}
//       >
//         <motion.div
//           className="absolute left-[-4px] top-[-4px] h-3 w-3 rounded-full bg-white shadow-[0_0_24px_rgba(56,189,248,0.8)]"
//           style={{ scale }}
//         />
//       </motion.div>

//       {/* Hover Radius indicator - smooth morph for text/content */}
//       <motion.div
//         className="absolute left-0 top-0 h-0 w-0"
//         style={{ x: circleX, y: circleY, opacity: viewOpacity }}
//       >
//         <motion.div
//           className="absolute left-[-10px] top-[-10px] h-5 w-5 rounded-full border border-accent/40"
//           style={{ scale }}
//         />
//       </motion.div>

//       {/* VIEW Text for project cards */}
//       <motion.div
//         className="absolute left-0 top-0 h-0 w-0 pointer-events-none"
//         style={{ x: circleX, y: circleY, opacity: viewOpacity }}
//       >
//         <motion.div
//           className="absolute left-[-22px] top-[-22px] flex h-11 w-11 items-center justify-center rounded-full"
//           style={{ scale }}
//         >
//           <span className="font-mono text-xs font-bold text-accent tracking-widest">VIEW</span>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }


import { motion, useMotionValue, useSpring, animate, useMotionValueEvent } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

const HIDE_DISTANCE = 10

export default function MagneticCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const opacity = useMotionValue(0)

  const realCursor = useRef({ x: -100, y: -100 })

  const dotX = useSpring(mouseX, {
    stiffness: 22,
    damping: 18,
    mass: 3.5,
  })

  const dotY = useSpring(mouseY, {
    stiffness: 22,
    damping: 18,
    mass: 3.5,
  })

  const checkDistance = useCallback(() => {
    const dx = realCursor.current.x - dotX.get()
    const dy = realCursor.current.y - dotY.get()
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= HIDE_DISTANCE) {
      animate(opacity, 0, { duration: 0.25 })
    }
  }, [dotX, dotY, opacity])

  useMotionValueEvent(dotX, 'change', checkDistance)
  useMotionValueEvent(dotY, 'change', checkDistance)

  const handleMouseMove = useCallback(
    (event) => {
      realCursor.current = {
        x: event.clientX,
        y: event.clientY,
      }

      mouseX.set(event.clientX)
      mouseY.set(event.clientY)

      const dx = event.clientX - dotX.get()
      const dy = event.clientY - dotY.get()
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > HIDE_DISTANCE) {
        animate(opacity, 1, { duration: 0.35 })
      }
    },
    [mouseX, mouseY, dotX, dotY, opacity],
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-0 w-0 sm:block"
      style={{
        x: dotX,
        y: dotY,
        opacity,
      }}
      aria-hidden="true"
    >
      <div className="absolute left-[-3px] top-[-3px] h-[6px] w-[6px] rounded-full bg-white mix-blend-difference" />
    </motion.div>
  )
}