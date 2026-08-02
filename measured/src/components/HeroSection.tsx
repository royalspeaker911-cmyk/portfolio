import { useEffect, useRef } from 'react'

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85'

const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4'

const OVERLAY_IMAGE =
  'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png'

const SPOTLIGHT_RADIUS = 260

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskDivRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Smooth cursor state (using refs for RAF loop — no re-renders)
  const cursorTarget = useRef({ x: -9999, y: -9999 })
  const cursorSmooth = useRef({ x: -9999, y: -9999 })
  // Grid parallax smooth state
  const gridSmooth = useRef({ x: 0, y: 0 })
  const gridTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const maskDiv = maskDivRef.current
    const grid = gridRef.current
    if (!canvas || !maskDiv || !section || !grid) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas to match window
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse position relative to window
    const onMouseMove = (e: MouseEvent) => {
      cursorTarget.current = { x: e.clientX, y: e.clientY }

      // Grid parallax: offset relative to section center * 16
      const rect = section.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      gridTarget.current = {
        x: ((e.clientX - cx) / rect.width) * 16,
        y: ((e.clientY - cy) / rect.height) * 16,
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    let rafId: number

    const drawSpotlight = () => {
      // Lerp cursor smooth → target (factor 0.1)
      cursorSmooth.current.x +=
        (cursorTarget.current.x - cursorSmooth.current.x) * 0.1
      cursorSmooth.current.y +=
        (cursorTarget.current.y - cursorSmooth.current.y) * 0.1

      // Lerp grid parallax (factor 0.06)
      gridSmooth.current.x +=
        (gridTarget.current.x - gridSmooth.current.x) * 0.06
      gridSmooth.current.y +=
        (gridTarget.current.y - gridSmooth.current.y) * 0.06

      // Apply grid parallax transform
      grid.style.transform = `translate(${gridSmooth.current.x}px, ${gridSmooth.current.y}px)`

      // Draw radial gradient mask on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const x = cursorSmooth.current.x
      const y = cursorSmooth.current.y

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_RADIUS)
      // Center: full white 0–40%
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
      // Feather out
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Export canvas as dataURL → apply as CSS mask
      const dataURL = canvas.toDataURL()
      maskDiv.style.webkitMaskImage = `url(${dataURL})`
      maskDiv.style.maskImage = `url(${dataURL})`
      maskDiv.style.webkitMaskSize = `${canvas.width}px ${canvas.height}px`
      maskDiv.style.maskSize = `${canvas.width}px ${canvas.height}px`
      maskDiv.style.webkitMaskRepeat = 'no-repeat'
      maskDiv.style.maskRepeat = 'no-repeat'

      rafId = requestAnimationFrame(drawSpotlight)
    }

    rafId = requestAnimationFrame(drawSpotlight)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="font-helvetica-neue relative w-full h-screen overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* LAYER 1 — Grid Background (z-0, opacity 0.1) */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 0.1 }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#64748b"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* LAYER 2 — Background Image (z-10) */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          zIndex: 10,
          backgroundImage: `url('${BG_IMAGE_1}')`,
        }}
      />

      {/* LAYER 3 — Hero Text "MEASURED" (z-20) */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none"
        style={{
          zIndex: 20,
          top: 'clamp(5rem, 10vw, 8rem)',
        }}
      >
        <h1
          className="text-white text-center leading-[0.9] uppercase select-none"
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(4.5rem, 14vw, 16rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Measured
        </h1>
      </div>

      {/* LAYER 4 — Overlay Image (z-25) */}
      <img
        src={OVERLAY_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 25 }}
        aria-hidden="true"
      />

      {/* LAYER 5 — Spotlight Reveal + Video (z-30) */}
      {/* Hidden canvas for drawing the mask gradient */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Masked video div — cursor spotlight reveals video here */}
      <div
        ref={maskDivRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 30 }}
      >
        <video
          src={FRONT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            clipPath: 'inset(40% 0 0 0)',
          }}
        />
      </div>
    </section>
  )
}
