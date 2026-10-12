import { useEffect, useState } from 'react'
import { LogOut, Moon, Sun, Settings, ChevronDown } from 'lucide-react'
import logo from '../services/pictures/Logo_App.png.jpg'
import home01 from '../services/pictures/home01.png.jpg'
import home02 from '../services/pictures/home02.png.jpg'
import home03 from '../services/pictures/home03.png.jpg'
import '../css/Home2.css'

/* fallback pictures — shown until the admin uploads pictures from the database */
const DEFAULT_SLIDES = [
  { src: home01, alt: 'Voice Converter — real-time translation' },
  { src: home02, alt: 'Voice Converter — voice studio' },
  { src: home03, alt: 'Voice Converter — meetings & chat' },
  { src: logo, alt: 'Voice Converter — app' },
]

/* Post-login home / dashboard page */
export default function Home2({ onLogout, user, onOpenCall, onOpenMeeting, onOpenChat, onOpenStudio, onOpenSettings }) {
  const [mode, setMode] = useState('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [slides, setSlides] = useState(DEFAULT_SLIDES)

  /* load slideshow pictures from the database (uploaded via the admin panel) */
  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
    fetch(`${API}/api/homepictures`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data.map((p) => ({ src: p.image, alt: p.alt || 'Voice Converter' })))
          setIndex(0)
        }
      })
      .catch(() => {}) /* keep local fallback if backend is down */
  }, [])

  /* auto-change pictures every 3 seconds (pauses on hover) */
  useEffect(() => {
    if (paused || slides.length === 0) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000)
    return () => clearInterval(id)
  }, [paused, slides.length])
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

  const toggleMode = (m) => {
    setMode(m)
    document.documentElement.setAttribute('data-mode', m)
  }

  return (
    <div className="home2-root">
      {/* ambient glow orbs */}
      <div className="home2-orb home2-orb-1" />
      <div className="home2-orb home2-orb-2" />

      {/* navbar */}
      <nav className="home2-nav">
        <div className="home2-brand">
          <img src={logo} alt="Voice Converter" className="home2-brand-logo" />
          <span className="home2-brand-title">
            Voice <span className="home2-brand-accent">Converter</span>
          </span>
        </div>
        <ul className="home2-links">
          {['Meeting', 'Call', 'Chat Group', 'Voice Studio', 'Settings'].map((label) => (
            <li key={label}>
              <a
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => {
                  e.preventDefault()
                  if (label === 'Call' && onOpenCall) onOpenCall()
                  if (label === 'Meeting' && onOpenMeeting) onOpenMeeting()
                  if (label === 'Chat Group' && onOpenChat) onOpenChat()
                  if (label === 'Voice Studio' && onOpenStudio) onOpenStudio()
                  if (label === 'Settings' && onOpenSettings) onOpenSettings()
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="home2-nav-right">
          <div className="theme-toggle">
            <button className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`} onClick={() => toggleMode('dark')}>
              <Moon size={14} />
            </button>
            <button className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`} onClick={() => toggleMode('light')}>
              <Sun size={14} />
            </button>
          </div>
          <div className="home2-profile-wrap">
            <button className="home2-profile-btn" onClick={() => setMenuOpen((v) => !v)}>
              <span className="home2-pfp">
                {user?.avatar ? <img src={user.avatar} alt={user?.name || 'me'} /> : initial}
              </span>
              <ChevronDown size={14} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {menuOpen && (
              <>
                <div className="home2-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="home2-menu">
                  <div className="home2-menu-head">
                    <span className="home2-pfp big">
                      {user?.avatar ? <img src={user.avatar} alt={user?.name || 'me'} /> : initial}
                    </span>
                    <div className="home2-menu-id">
                      <span className="home2-menu-name">{user?.name || 'Guest User'}</span>
                      <span className="home2-menu-mail">{user?.email || 'user@voiceconverter.app'}</span>
                    </div>
                  </div>
                  <button
                    className="home2-menu-item"
                    onClick={() => { setMenuOpen(false); if (onOpenSettings) onOpenSettings() }}
                  >
                    <Settings size={15} /> Settings & Preferences
                  </button>
                  <button
                    className="home2-menu-item danger"
                    onClick={() => { setMenuOpen(false); onLogout() }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* main — auto-changing picture slideshow box */}
      <main className="home2-main">
        <div
          className="home2-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="home2-slider-window">
            {slides.map((s, i) => (
              <img
                key={i}
                src={s.src}
                alt={s.alt}
                draggable={false}
                className={`home2-slide ${i === index ? 'active' : ''}`}
              />
            ))}
            <div className="home2-slider-shade" />
          </div>
          <div className="home2-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Show picture ${i + 1}`}
                className={`home2-dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

