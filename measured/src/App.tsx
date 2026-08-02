import { useState } from 'react'
import Navigation from './components/Navigation'
import MobileMenu from './components/MobileMenu'
import HeroSection from './components/HeroSection'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuOpen = () => {
    setMenuOpen(true)
    document.body.classList.add('menu-open')
  }

  const handleMenuClose = () => {
    setMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  return (
    <div className="bg-white w-full h-full">
      <Navigation onMenuOpen={handleMenuOpen} />
      <MobileMenu isOpen={menuOpen} onClose={handleMenuClose} />
      <HeroSection />
    </div>
  )
}
