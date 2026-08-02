interface NavigationProps {
  onMenuOpen: () => void
}

const NAV_ITEMS = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us']

// Exact SVG logo path from spec
const LogoSVG = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z"
      fill="white"
    />
  </svg>
)

export default function Navigation({ onMenuOpen }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:py-5">
      {/* Logo — top left */}
      <div className="flex items-center">
        <LogoSVG />
      </div>

      {/* Center pill nav — desktop only */}
      <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className="text-white/70 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Desktop CTA — top right */}
      <div className="hidden md:flex items-center">
        <button className="liquid-glass rounded-full flex items-center gap-2 px-4 py-2 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors duration-200">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Reserve Yours
        </button>
      </div>

      {/* Mobile hamburger — top right, mobile only */}
      <div className="flex md:hidden items-center">
        <button
          onClick={onMenuOpen}
          className="liquid-glass rounded-full flex flex-col items-center justify-center gap-[5px] px-4 py-3 cursor-pointer"
          aria-label="Open menu"
        >
          <span className="block w-5 h-[1.5px] bg-white" />
          <span className="block w-3.5 h-[1.5px] bg-white" />
        </button>
      </div>
    </nav>
  )
}
