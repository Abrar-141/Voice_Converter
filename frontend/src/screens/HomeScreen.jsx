import { useState, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker, useMapContext } from 'react-simple-maps'
import logo from '../services/pictures/Logo_App.png.jpg'
import '../css/HomeScreen.css'
import '../css/AboutSection.css'
import {
  Zap, Globe, Globe2, Menu, X, ChevronRight, Play,
  Lock, Radio, Moon, Sun, ShieldCheck, BrainCircuit, Sparkles
} from 'lucide-react'

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onSignIn, onSignUp, mode, setMode }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [
    { label: 'Features', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'App / Web', id: 'app-web' },
  ]

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMode = (m) => {
    setMode(m)
    document.documentElement.setAttribute('data-mode', m)
  }

  return (
    <nav className={`vc-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="vc-nav-inner">
        <div className="vc-nav-brand">
          <img src={logo} alt="logo" className="vc-nav-logo" />
          <span className="vc-nav-title">Voice <span>Converter</span></span>
        </div>

        <ul className="vc-nav-links">
          {links.map(l => (
            <li key={l.label}>
              <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="vc-nav-right">
          <div className="theme-toggle">
            <button className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`} onClick={() => toggleMode('dark')}>
              <Moon size={14} />
            </button>
            <button className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`} onClick={() => toggleMode('light')}>
              <Sun size={14} />
            </button>
          </div>
          <button
            onClick={onSignUp}
            className="vc-btn-signup"
          >
            Sign Up
          </button>
        </div>

        <button className="vc-hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="vc-mobile-menu">
          {links.map(l => (
            <a key={l.label} href={`#${l.id}`} onClick={() => { setOpen(false); scrollTo(l.id) }}>{l.label}</a>
          ))}
          <button
            onClick={onSignUp}
            className="vc-btn-signup-full"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}

// ─── WAVEFORM MOCKUP ──────────────────────────────────────────────────────────
function WaveformMockup() {
  return (
    <div className="vc-mockup">
      {/* Sound rings */}
      <div className="vc-sound-rings">
        <div className="vc-ring" />
        <div className="vc-ring" />
        <div className="vc-ring" />
        <div className="vc-ring" />
      </div>

      <div className="vc-mockup-card">
        <div className="vc-callers">
          <div className="vc-caller">
            <div className="vc-avatar blue">हि</div>
            <span>Hindi</span>
          </div>
          <div className="vc-arrow">⇆</div>
          <div className="vc-caller">
            <div className="vc-avatar white">En</div>
            <span>English</span>
          </div>
        </div>
        <div className="vc-wave">
          {[...Array(28)].map((_, i) => (
            <div key={i} className="vc-bar" style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
        <div className="vc-badges">
          <span className="vc-badge cyan">● Translating Live...</span>
          <span className="vc-badge purple">Hindi ⇆ English</span>
        </div>
        <div className="vc-latency">⚡ &lt;1.2s latency</div>
      </div>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onGetStarted }) {
  return (
    <section className="vc-hero" id="hero">
      <div className="vc-hero-left">
        <div className="vc-hero-badge">🎙 Real-Time AI Translation</div>
        <h1 className="vc-hero-heading">
          Translate Your<br />
          <span className="vc-gradient-text">Live Voice Calls</span><br />
          Instantly
        </h1>
        <p className="vc-hero-sub">
          Natural conversations across languages — English, Hindi, Urdu, Spanish and more.
        </p>
        <ul className="vc-bullets">
          {['Instant Two-Way Speech', 'Smart Auto-Detection', 'Minimal Latency', 'End-to-End Encrypted'].map(b => (
            <li key={b}><ChevronRight size={15} className="vc-bullet-icon" />{b}</li>
          ))}
        </ul>
        <div className="vc-hero-btns">
          <button className="vc-btn-primary" onClick={onGetStarted}>Get Started Free</button>
          <button className="vc-btn-ghost"><Play size={14} /> App Demo</button>
        </div>
      </div>
      <div className="vc-hero-right">
        <WaveformMockup />
      </div>
    </section>
  )
}

// ─── METRICS ──────────────────────────────────────────────────────────────────
function Metrics() {
  const stats = [
    { icon: <Zap size={20} />, val: '< 1.2s', label: 'Translation Latency' },
    { icon: <Radio size={20} />, val: '99%',   label: 'Dialect Recognition' },
    { icon: <Lock size={20} />, val: 'E2E',    label: 'Encrypted Calls' },
    { icon: <Globe size={20} />, val: '20+',   label: 'Languages Supported' },
  ]
  return (
    <section className="vc-metrics">
      {stats.map(s => (
        <div key={s.label} className="vc-metric-card">
          <div className="vc-metric-icon">{s.icon}</div>
          <div className="vc-metric-val">{s.val}</div>
          <div className="vc-metric-label">{s.label}</div>
        </div>
      ))}
    </section>
  )
}

// ─── AUTH PANEL ───────────────────────────────────────────────────────────────
function AuthPanel({ defaultTab = 'signin' }) {
  const [tab, setTab] = useState(defaultTab)
  const langs = ['English', 'Hindi', 'Urdu', 'Spanish', 'French']

  return (
    <section className="vc-auth-section" id="security">
      <div className="vc-auth-card">
        <h2 className="vc-auth-title">Quick Access <span className="vc-gradient-text">Portal</span></h2>
        <div className="vc-tabs">
          <button className={`vc-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>Sign In</button>
          <button className={`vc-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>
        <button className="vc-google-btn">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>
        <div className="vc-divider"><span>or</span></div>
        <form className="vc-form" onSubmit={e => e.preventDefault()}>
          {tab === 'signup' && <input className="vc-input" type="text" placeholder="Full Name" />}
          <input className="vc-input" type="email" placeholder="Email Address" />
          <input className="vc-input" type="password" placeholder="Password" />
          {tab === 'signup' && (
            <select className="vc-input vc-select">
              <option value="">Preferred Language</option>
              {langs.map(l => <option key={l}>{l}</option>)}
            </select>
          )}
          <button type="submit" className="vc-btn-primary w-full">
            {tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </section>
  )
}

// ─── FEATURES SECTION ────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function Features() {
  const [features, setFeatures] = useState([])

  useEffect(() => {
    fetch(`${API}/api/features`)
      .then(r => r.json())
      .then(data => setFeatures(data))
      .catch(() => {})
  }, [])

  return (
    <section className="vc-features" id="how-it-works">
      {features.map((f, i) => (
        <div key={f.order} className={`vc-feature-row ${i % 2 !== 0 ? 'reverse' : ''}`}>
          <div className="vc-feature-img-wrap">
            <div className="vc-feature-img-glow" />
            <div className="vc-feature-img-shape">
              <img src={f.img || logo} alt={f.heading} />
            </div>
          </div>
          <div className="vc-feature-text">
            <span className="vc-feature-num">0{f.order}</span>
            <h3 className="vc-feature-title">{f.heading}</h3>
            <p className="vc-feature-desc">
              <span className="vc-desc-corner tl"/>
              <span className="vc-desc-corner br"/>
              {f.description}
            </p>
            <div className="vc-tags">
              {f.tags.map(t => <span key={t} className="vc-tag">{t}</span>)}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

// ─── WORLD MAP ───────────────────────────────────────────────────────────────
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const PINS = [
  { id: 'pk', coords: [67.0,  30.4], flag: '🇵🇰', label: 'Karachi, PK',   color: '#3b82f6' },
  { id: 'us', coords: [-74.0, 40.7], flag: '🇺🇸', label: 'New York, US',  color: '#8b5cf6' },
  { id: 'uk', coords: [-0.1,  51.5], flag: '🇬🇧', label: 'London, UK',    color: '#06b6d4' },
  { id: 'in', coords: [72.8,  19.0], flag: '🇮🇳', label: 'Mumbai, IN',    color: '#f59e0b' },
  { id: 'ae', coords: [55.3,  25.2], flag: '🇦🇪', label: 'Dubai, AE',     color: '#10b981' },
  { id: 'jp', coords: [139.7, 35.7], flag: '🇯🇵', label: 'Tokyo, JP',     color: '#ec4899' },
  { id: 'br', coords: [-46.6,-23.5], flag: '🇧🇷', label: 'Sao Paulo, BR', color: '#f97316' },
  { id: 'de', coords: [13.4,  52.5], flag: '🇩🇪', label: 'Berlin, DE',    color: '#a78bfa' },
]

const ARCS = [
  { from: 'pk', to: 'us', color: '#3b82f6' },
  { from: 'uk', to: 'in', color: '#06b6d4' },
  { from: 'ae', to: 'br', color: '#10b981' },
  { from: 'jp', to: 'de', color: '#ec4899' },
]

function AnimatedLineInner({ fromCoords, toCoords, color, delay }) {
  const { projection } = useMapContext()
  const pathRef = useRef(null)
  const dotRef  = useRef(null)

  const [f, t] = [projection(fromCoords), projection(toCoords)]
  if (!f || !t) return null

  const d = `M ${f[0]} ${f[1]} Q ${(f[0]+t[0])/2} ${Math.min(f[1],t[1])-40} ${t[0]} ${t[1]}`

  useEffect(() => {
    const path = pathRef.current
    const dot  = dotRef.current
    if (!path || !dot) return
    const len = path.getTotalLength()
    path.style.strokeDasharray  = len
    path.style.strokeDashoffset = len
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 2s ease'
      path.style.strokeDashoffset = 0
    }, delay)
    let frame, start = null
    const dur = 3200
    const tick = (ts) => {
      if (!start) start = ts
      const progress = ((ts - start) % dur) / dur
      const pt = path.getPointAtLength(progress * len)
      dot.setAttribute('cx', pt.x)
      dot.setAttribute('cy', pt.y)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [d, delay])

  return (
    <g>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.55}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <circle ref={dotRef} cx={f[0]} cy={f[1]} r={0} fill={color}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      >
        <animate attributeName="r" values="2.5;4;2.5" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  )
}

function WorldMap() {
  const [hover, setHover] = useState(null)
  const pinMap = Object.fromEntries(PINS.map(p => [p.id, p]))

  return (
    <section className="wmap-section">
      <div className="wmap-header">
        <span className="wmap-badge">🌍 GLOBAL REACH</span>
        <h2 className="wmap-title">Connecting the <span className="wmap-gradient">World in Real-Time</span></h2>
        <p className="wmap-sub">Live voice translation across 20+ countries — every call, every language.</p>
      </div>

      <div className="wmap-wrap">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140, center: [15, 25] }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="1" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </radialGradient>
          </defs>

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(59,130,246,0.1)"
                  stroke="rgba(99,102,241,0.45)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { fill: 'rgba(99,102,241,0.3)', outline: 'none', cursor: 'default' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Animated arcs */}
          {ARCS.map((arc, i) => (
            <AnimatedLineInner
              key={arc.from + arc.to}
              fromCoords={pinMap[arc.from].coords}
              toCoords={pinMap[arc.to].coords}
              color={arc.color}
              delay={i * 500}
            />
          ))}

          {/* Pins */}
          {PINS.map(pin => (
            <Marker
              key={pin.id}
              coordinates={pin.coords}
              onMouseEnter={() => setHover(pin.id)}
              onMouseLeave={() => setHover(null)}
            >
              {/* outer pulse */}
              <circle r={10} fill="none" stroke={pin.color} strokeWidth={0.8}>
                <animate attributeName="r" values="7;16;7" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite" />
              </circle>
              {/* inner pulse */}
              <circle r={5} fill="none" stroke={pin.color} strokeWidth={1}>
                <animate attributeName="r" values="4;9;4" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              {/* pin core */}
              <circle
                r={5}
                fill={pin.color}
                stroke="#0f172a"
                strokeWidth={1.5}
                style={{ cursor: 'pointer', filter: `drop-shadow(0 0 6px ${pin.color})` }}
              />
              <text textAnchor="middle" y={-1} fontSize={6} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {pin.flag}
              </text>

              {/* Chat bubble tooltip */}
              {hover === pin.id && (
                <g transform="translate(-44, -50)">
                  <rect rx={7} ry={7} width={88} height={26}
                    fill="rgba(10,15,30,0.96)"
                    stroke={pin.color}
                    strokeWidth={0.6}
                    style={{ filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.8))` }}
                  />
                  <polygon points="38,26 44,34 50,26" fill="rgba(10,15,30,0.96)" />
                  <polygon points="38,26 44,34 50,26" fill="none" stroke={pin.color} strokeWidth={0.6}
                    style={{ clipPath: 'inset(0 0 50% 0)' }}
                  />
                  <text x={44} y={11} textAnchor="middle" fontSize={5} fill={pin.color} fontWeight="800">
                    {pin.flag} {pin.label}
                  </text>
                  <circle cx={80} cy={18} r={2.5} fill="#22c55e" />
                  <text x={74} y={21} textAnchor="end" fontSize={4} fill="#22c55e" fontWeight="700">Live</text>
                </g>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="wmap-stats">
        <div className="wmap-stat"><span className="wmap-stat-val">20+</span><span>Languages</span></div>
        <div className="wmap-stat"><span className="wmap-stat-val">150+</span><span>Countries</span></div>
        <div className="wmap-stat"><span className="wmap-stat-val">&lt;1.2s</span><span>Latency</span></div>
        <div className="wmap-stat"><span className="wmap-stat-val">99%</span><span>Uptime</span></div>
      </div>
    </section>
  )
}

// ─── SIMULATOR ───────────────────────────────────────────────────────────────
const MODES = [
  {
    label: 'Hindi → English',
    inputLang: 'Hindi', outputLang: 'English',
    inputText: 'नमस्कार! कैसे हैं आप? क्या हम आज का प्रोजेक्ट शुरू करें?',
    outputText: 'Hello! How are you? Shall we start today\'s project?',
    inputFlag: '🇮🇳', outputFlag: '🇬🇧',
  },
  {
    label: 'Spanish → Urdu',
    inputLang: 'Spanish', outputLang: 'Urdu',
    inputText: '¡Hola! ¿Cómo estás? ¿Podemos comenzar la reunión ahora?',
    outputText: 'ہیلو! آپ کیسے ہیں؟ کیا ہم ابھی میٹنگ شروع کر سکتے ہیں؟',
    inputFlag: '🇪🇸', outputFlag: '🇵🇰',
  },
  {
    label: 'English → Arabic',
    inputLang: 'English', outputLang: 'Arabic',
    inputText: 'Good morning! Let\'s discuss the project timeline and deliverables.',
    outputText: 'صباح الخير! دعنا نناقش الجدول الزمني للمشروع والمخرجات.',
    inputFlag: '🇬🇧', outputFlag: '🇸🇦',
  },
]

function SimWave({ color, bars = 18, active }) {
  return (
    <div className="sim-wave">
      {[...Array(bars)].map((_, i) => (
        <div key={i} className={`sim-bar ${active ? 'active' : ''}`}
          style={{
            '--clr': color,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.8 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

function TypeWriter({ text, speed = 35 }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const t = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text])
  return <span>{displayed}<span className="sim-cursor">|</span></span>
}

function Simulator() {
  const [modeIdx, setModeIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const mode = MODES[modeIdx]

  const start = () => {
    setRunning(true)
    setDone(false)
    setTimeout(() => setDone(true), 1400)
  }

  const switchMode = (i) => {
    setModeIdx(i)
    setRunning(false)
    setDone(false)
  }

  return (
    <section className="sim-section" id="features">
      {/* Header */}
      <div className="sim-header">
        <span className="sim-badge">⚡ EXPERIENCE THE LIVE DUB</span>
        <h2 className="sim-title">Real-Time Speech &amp; <span className="sim-gradient">Conversion Simulator</span></h2>
      </div>

      {/* Dashboard */}
      <div className="sim-dashboard">

        {/* LEFT */}
        <div className="sim-panel">
          <div className="sim-panel-header">
            <div className="sim-avatar blue">{mode.inputFlag}</div>
            <div>
              <div className="sim-panel-name">User A — {mode.inputLang}</div>
              <div className={`sim-status ${running ? 'active' : ''}`}>
                <span className="sim-dot" /> {running ? 'Recording...' : 'Idle'}
              </div>
            </div>
          </div>
          <SimWave color="#3b82f6" active={running} />
          <div className={`sim-bubble left ${running ? 'show' : ''}`}>
            {running && <TypeWriter text={mode.inputText} speed={40} />}
          </div>
          <button className="sim-trigger" onClick={start} disabled={running}>
            🎙 {running ? 'Translating...' : 'Start Simulation'}
          </button>
        </div>

        {/* CENTER */}
        <div className="sim-center">
          <div className="sim-rotate-arrow">⇆</div>
          <div className="sim-lang-badge">
            {mode.inputFlag} {mode.inputLang} ⇄ {mode.outputLang} {mode.outputFlag}
          </div>
          <div className="sim-latency">⚡ &lt;1.2s Latency</div>
          <div className="sim-particles">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`sim-particle ${running ? 'active' : ''}`}
                style={{ animationDelay: `${i * 0.22}s` }} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="sim-panel">
          <div className="sim-panel-header">
            <div className="sim-avatar purple">{mode.outputFlag}</div>
            <div>
              <div className="sim-panel-name">User B — {mode.outputLang}</div>
              <div className={`sim-status ${done ? 'active' : ''}`}>
                <span className="sim-dot purple" /> {done ? 'Speaking...' : 'Waiting...'}
              </div>
            </div>
          </div>
          <SimWave color="#8b5cf6" active={done} />
          <div className={`sim-bubble right ${done ? 'show' : ''}`}>
            {done && <TypeWriter text={mode.outputText} speed={45} />}
          </div>
          <div className="sim-chip">🤖 AI Natural Pitch Active</div>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="sim-switchers">
        {MODES.map((m, i) => (
          <button key={i} className={`sim-switch ${modeIdx === i ? 'active' : ''}`} onClick={() => switchMode(i)}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="sim-stats">
        <div className="sim-stat">✦ 99.4% Accurate Dialect Interpretation</div>
        <div className="sim-stat">✦ Real-Time Neural Tone Matching</div>
        <div className="sim-stat">✦ End-To-End Security Enabled</div>
      </div>
    </section>
  )
}

// ─── REVIEWS ───────────────────────────────────────────────────────────────────
function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then(r => r.json())
      .then(data => setReviews(data))
      .catch(() => {})
  }, [])

  if (!reviews.length) return null

  const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // duplicate for seamless loop
  const list = [...reviews, ...reviews]

  return (
    <section className="vc-reviews">
      <div className="vc-reviews-header">
        <div className="vc-reviews-label">What people say</div>
        <h2 className="vc-reviews-title">Loved by users <span className="vc-gradient-text">worldwide</span></h2>
      </div>
      <div className="vc-reviews-track-wrap">
        <div className="vc-reviews-track">
          {list.map((r, i) => (
            <div key={i} className="vc-review-card">
              <div className="vc-review-top">
                <div className="vc-review-avatar">{initials(r.name)}</div>
                <div>
                  <div className="vc-review-name">{r.name}</div>
                  <div className="vc-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
              </div>
              <p className="vc-review-comment">“{r.comment}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT SECTION ──────────────────────────────────────────────────────────
const highlights = [
  {
    icon: Zap,
    title: 'Real-Time Translation',
    desc: 'Speak naturally and hear the translation instantly — powered by low-latency AI built for live conversation.',
  },
  {
    icon: Globe2,
    title: '20+ Languages',
    desc: 'From Hindi and Urdu to Spanish and Japanese — communicate fluently across the globe.',
  },
  {
    icon: ShieldCheck,
    title: 'End-to-End Encrypted',
    desc: 'Your voice is processed on the fly and never stored. Privacy is built into every single call.',
  },
  {
    icon: BrainCircuit,
    title: 'Context-Aware AI',
    desc: 'Our model understands meaning, slang and tone — not just words — for truly natural dialogue.',
  },
]

function AboutSection() {
  return (
    <section id="app-web" className="about-section">

      {/* ambient glow blobs — theme-aware */}
      <div className="about-blob about-blob-left" />
      <div className="about-blob about-blob-right" />

      <div className="about-inner">

        {/* label */}
        <div className="about-label-row">
          <span className="about-badge">
            <Sparkles size={14} /> About Us
          </span>
        </div>

        {/* heading */}
        <h2 className="about-title">
          Bridging Languages,{' '}
          <span className="about-title-accent">
            One Conversation
          </span>{' '}
          at a Time
        </h2>

        {/* description */}
        <p className="about-desc">
          Voice Converter is a real-time AI voice translation platform built to erase language
          barriers from every call. Speak in your own language, and let our intelligent engine
          translate your voice into your listener's language — with natural tone, sub-second speed
          and complete privacy. Whether it's a business call across the world or a chat with
          someone new, Voice Converter makes every conversation feel effortless.
        </p>

        {/* stats row */}
        <div className="about-stats">
          {[
            { icon: Radio, value: '99.4%', label: 'Accuracy' },
            { icon: Globe2, value: '20+', label: 'Languages' },
            { icon: Zap, value: '<1s', label: 'Latency' },
          ].map((s, i) => (
            <div key={i} className="about-stat">
              <span className="about-stat-icon">
                <s.icon size={18} />
              </span>
              <div className="about-stat-text">
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* highlight cards */}
        <div className="about-cards">
          {highlights.map((h, i) => (
            <div key={i} className="about-card-frame">
              <div className="about-card-inner">
                <div className="about-card-icon">
                  <h.icon size={20} />
                </div>
                <h3 className="about-card-title">{h.title}</h3>
                <p className="about-card-desc">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}


// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="vc-footer">
      <div className="vc-footer-brand">
        <img src={logo} alt="logo" className="vc-nav-logo" />
        <span className="vc-nav-title">Voice <span>Converter</span></span>
      </div>
      <p className="vc-footer-copy">© 2025 Voice Converter. All rights reserved.</p>
      <div className="vc-footer-links">
        <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
      </div>
    </footer>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HomeScreen({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('dark')

  return (
    <div className="vc-root">
      <div className="vc-mesh-blob top" />
      <div className="vc-mesh-blob bottom" />
      <Navbar onSignIn={onSignIn} onSignUp={onSignUp} mode={mode} setMode={setMode} />
      <Hero onGetStarted={onSignUp} />
      <Metrics />
      <Features />
      <WorldMap />
      <Simulator />
      <Reviews />
      <AboutSection />
      <Footer />
    </div>
  )
}
