interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us']

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0a0a0a', zIndex: 55 }}
    >
      {/* Close button — top right */}
      <button
        onClick={onClose}
        className="close-btn-animate absolute top-4 right-5 liquid-glass rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
        aria-label="Close menu"
      >
        <span
          className="absolute block w-5 h-[1.5px] bg-white"
          style={{ transform: 'rotate(45deg)' }}
        />
        <span
          className="absolute block w-5 h-[1.5px] bg-white"
          style={{ transform: 'rotate(-45deg)' }}
        />
      </button>

      {/* Nav items — stacked, centered */}
      <div className="flex flex-col items-center gap-6">
        {NAV_ITEMS.map((item, index) => (
          <button
            key={item}
            onClick={onClose}
            className="menu-item-animate text-white/90 text-3xl sm:text-4xl font-medium cursor-pointer hover:text-white transition-colors duration-200"
            style={{ animationDelay: `${100 + index * 60}ms` }}
          >
            {item}
          </button>
        ))}

        {/* Reserve Yours CTA */}
        <div
          className="menu-item-animate mt-4"
          style={{ animationDelay: `${100 + NAV_ITEMS.length * 60}ms` }}
        >
          <button className="liquid-glass rounded-full flex items-center gap-2 px-6 py-3 text-white text-base font-medium cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Reserve Yours
          </button>
        </div>
      </div>
    </div>
  )
}
