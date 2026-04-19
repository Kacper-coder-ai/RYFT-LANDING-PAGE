import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/** Thin gradient bar at the top of the viewport; fills as the page scrolls. */
export function LandingScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 38,
    mass: 0.2,
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 left-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-primary via-violet-400 to-secondary shadow-[0_0_14px_rgba(139,92,246,0.4)]"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  )
}

/** Shared props for main landing sections (fade + rise on scroll). */
export function landingSectionReveal(reducedMotion: boolean | null) {
  const off = reducedMotion === true
  return {
    initial: { opacity: off ? 1 : 0, y: off ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.14, margin: '0px 0px -8% 0px' },
    transition: {
      duration: off ? 0 : 0.58,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }
}
