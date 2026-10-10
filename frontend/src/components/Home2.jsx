import { useState } from 'react'
import { Globe2, Zap, ShieldCheck, Play, Mic, LogOut, Moon, Sun, Star, Settings, ChevronDown } from 'lucide-react'
import logo from '../services/pictures/Logo_App.png.jpg'
import '../css/Home2.css'

const stats = [
  { icon: Globe2, title: '20+ Languages', desc: 'Translate across the globe in real time.' },
  { icon: Zap, title: 'Ultra Low Latency', desc: 'Sub-second responses powered by edge AI.' },
  { icon: ShieldCheck, title: 'Private & Secure', desc: 'End-to-end encrypted. Zero data stored.' },
  { icon: Star, title: '100 Points', desc: 'Member points — earn more with every call you make.' },
]

/* Post-login home / dashboard page */
export default function Home2({ onLogout, user, onOpenCall, onOpenMeeting, onOpenChat, onOpenStudio, onOpenSettings }) {
  const [mode, setMode] = useState('dark')
  const [menuOpen, setMenuOpen] = useState(false)
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

      {/* main */}
      <main className="home2-main">
        <div className="home2-badge">
          <Mic size={14} /> Dashboard
        </div>

        <h1 className="home2-title">
          Welcome back{user?.name ? `, ${user.name}` : ''}{' '}
          <span className="home2-title-accent">👋</span>
        </h1>
        <p className="home2-sub">
          You're all set. Start a real-time translated voice call and break language barriers instantly.
        </p>

        {/* CTA card */}
        <div className="home2-cta">
          <div className="home2-cta-inner">
            <div>
              <h2 className="home2-cta-title">Start a Voice Call</h2>
              <p className="home2-cta-desc">Connect with anyone, in any language, in real time.</p>
            </div>
            <button className="home2-cta-btn" onClick={onOpenCall}>
              <Play size={18} /> New Call
            </button>
          </div>
        </div>

        {/* stat cards */}
        <div className="home2-stats">
          {stats.map((s, i) => (
            <div key={i} className="home2-stat">
              <div className="home2-stat-inner">
                <div className="home2-stat-icon">
                  <s.icon size={20} />
                </div>
                <h3 className="home2-stat-title">{s.title}</h3>
                <p className="home2-stat-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

