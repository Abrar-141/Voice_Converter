import { useState, useEffect, useRef } from 'react'
import {
  Phone, PhoneOff, Mic, MicOff, Volume2, Search, ArrowLeft,
  Languages, MessageSquare, Sparkles, Globe2,
} from 'lucide-react'
import '../css/CallPage.css'

const CONTACTS = [
  { id: 1, name: 'Aarav Sharma', speaks: 'Hindi', online: true },
  { id: 2, name: 'Sara Khan', speaks: 'Urdu', online: true },
  { id: 3, name: 'Diego Martín', speaks: 'Spanish', online: false },
  { id: 4, name: 'Yuki Tanaka', speaks: 'Japanese', online: true },
  { id: 5, name: 'Omar Ali', speaks: 'Arabic', online: false },
  { id: 6, name: 'Emma Wilson', speaks: 'English', online: true },
]

const LANGS = ['English', 'Hindi', 'Urdu', 'Spanish', 'French', 'Arabic', 'Japanese']

const CAPTIONS = [
  { who: 'them', text: 'Hey! How are you doing today?' },
  { who: 'you', text: 'Main theek hoon, tum sunao?' },
  { who: 'them', text: "I am great — ready for tonight's plan?" },
  { who: 'you', text: 'Haan bilkul, bas pahunchta hoon.' },
  { who: 'them', text: 'Perfect, see you in twenty minutes!' },
]

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/* ── 1-on-1 Voice Call — direct call with live translation (UI) ── */
export default function CallPage({ onBack }) {
  const [stage, setStage] = useState('contacts') // contacts | lock | live
  const [query, setQuery] = useState('')
  const [contact, setContact] = useState(null)
  const [speakLang, setSpeakLang] = useState('Hindi')
  const [listenLang, setListenLang] = useState('English')
  const [muted, setMuted] = useState(false)
  const [aiMix, setAiMix] = useState(70) // % of AI translated voice
  const [seconds, setSeconds] = useState(0)
  const [captions, setCaptions] = useState([])
  const capIdx = useRef(0)

  const filtered = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
  const firstName = contact ? contact.name.split(' ')[0] : ''

  /* call timer */
  useEffect(() => {
    if (stage !== 'live') return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [stage])

  /* live subtitles stream */
  useEffect(() => {
    if (stage !== 'live') return
    setCaptions([])
    capIdx.current = 0
    const t = setInterval(() => {
      const cap = CAPTIONS[capIdx.current % CAPTIONS.length]
      capIdx.current += 1
      setCaptions((prev) => [...prev.slice(-3), { ...cap, id: Date.now() }])
    }, 2800)
    return () => clearInterval(t)
  }, [stage])

  const openLock = (c) => {
    setContact(c)
    setListenLang(c.speaks)
    setStage('lock')
  }

  const startCall = () => {
    setSeconds(0)
    setCaptions([])
    capIdx.current = 0
    setStage('live')
  }

  return (
    <div className="call-root">
      <div className="call-orb call-orb-1" />
      <div className="call-orb call-orb-2" />

      {/* ── STAGE 1 — CONTACT LIST & DIALING ── */}
      {stage === 'contacts' && (
        <div className="call-wrap">
          <header className="call-top">
            <button className="call-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
            <span className="call-chip"><Sparkles size={13} /> AI Live Dubbing</span>
          </header>

          <div className="call-head">
            <h1 className="call-title">1-on-1 <span>Voice Call</span></h1>
            <p className="call-sub">
              Direct call with live translation — jaise normal phone call, par har zabaan samajh aati hai.
            </p>
            <div className="call-feats">
              <span className="call-feat"><Languages size={13} /> Dual-Voice Dubbing</span>
              <span className="call-feat"><Volume2 size={13} /> Original ↔ AI Slider</span>
              <span className="call-feat"><MessageSquare size={13} /> Live Captions</span>
            </div>
          </div>

          <div className="call-card">
            <div className="call-search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contacts..." />
            </div>
            <ul className="call-list">
              {filtered.map((c) => (
                <li key={c.id} className="call-contact">
                  <div className={`call-avatar ${c.online ? 'online' : ''}`}>{c.name.charAt(0)}</div>
                  <div className="call-contact-info">
                    <span className="call-contact-name">{c.name}</span>
                    <span className="call-contact-lang">speaks {c.speaks}</span>
                  </div>
                  <span className={`call-status ${c.online ? 'on' : 'off'}`}>{c.online ? 'Online' : 'Offline'}</span>
                  <button className="call-dial" onClick={() => openLock(c)}><Phone size={15} /> Call</button>
                </li>
              ))}
              {filtered.length === 0 && <li className="call-empty">No contacts found</li>}
            </ul>
          </div>
        </div>
      )}

      {/* ── STAGE 2 — PRE-CALL LANGUAGE LOCK ── */}
      {stage === 'lock' && contact && (
        <div className="call-wrap call-wrap-narrow">
          <header className="call-top">
            <button className="call-back" onClick={() => setStage('contacts')}><ArrowLeft size={16} /> Contacts</button>
          </header>

          <div className="call-card call-lock">
            <div className="call-lock-user">
              <div className="call-avatar big">{contact.name.charAt(0)}</div>
              <div>
                <h2 className="call-lock-name">{contact.name}</h2>
                <span className="call-lock-lang">speaks {contact.speaks}</span>
              </div>
            </div>

            <h3 className="call-lock-title"><Languages size={16} /> Pre-Call Language Lock</h3>
            <p className="call-lock-sub">
              Call connect hone se pehle languages lock karo — AI dono taraf live dub karega.
            </p>

            <div className="call-lock-row">
              <div className="call-lock-field">
                <label>You speak</label>
                <select value={speakLang} onChange={(e) => setSpeakLang(e.target.value)}>
                  {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <button
                className="call-swap"
                onClick={() => { const a = speakLang; setSpeakLang(listenLang); setListenLang(a) }}
                title="Swap languages"
              >⇄</button>
              <div className="call-lock-field">
                <label>{firstName} hears</label>
                <select value={listenLang} onChange={(e) => setListenLang(e.target.value)}>
                  {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="call-lock-note">
              <Sparkles size={14} />
              <span>Aap {speakLang} mein bolenge — {firstName} ko live AI voice mein {listenLang} sunai degi.</span>
            </div>

            <button className="call-start" onClick={startCall}><Phone size={17} /> Start Call</button>
          </div>
        </div>
      )}

      {/* ── STAGE 3 — LIVE CALL ── */}
      {stage === 'live' && contact && (
        <div className="call-live">
          <header className="call-top">
            <button className="call-back" onClick={() => setStage('contacts')}><ArrowLeft size={16} /> Dashboard</button>
            <span className="call-chip"><Sparkles size={13} /> E2E Encrypted</span>
          </header>

          <div className="call-live-center">
            <div className="call-live-avatar-wrap">
              <div className="call-ring" /><div className="call-ring r2" /><div className="call-ring r3" />
              <div className="call-avatar xl">{contact.name.charAt(0)}</div>
            </div>
            <h2 className="call-live-name">{contact.name}</h2>
            <span className="call-timer">{fmt(seconds)}</span>
            <div className="call-dub-chip"><Globe2 size={14} /> Dubbing Live: {speakLang} → {listenLang}</div>

            <div className="call-wave">
              {[...Array(24)].map((_, i) => (
                <div key={i} className={`call-bar ${muted ? 'off' : ''}`} style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>

            {/* Original vs AI audio balance */}
            <div className="call-slider-card">
              <div className="call-slider-labels">
                <span>Original Voice</span>
                <span>AI Translated</span>
              </div>
              <input
                type="range" min="0" max="100" value={aiMix}
                onChange={(e) => setAiMix(Number(e.target.value))}
                className="call-range"
              />
              <div className="call-slider-val">AI {aiMix}% · Original {100 - aiMix}%</div>
            </div>

            {/* live subtitles */}
            <div className="call-captions">
              <div className="call-captions-head"><MessageSquare size={14} /> Live Subtitles</div>
              <div className="call-captions-body">
                {captions.length === 0 && <span className="call-caption-empty">Listening…</span>}
                {captions.map((c) => (
                  <p key={c.id} className={`call-caption ${c.who}`}>
                    <span className="call-caption-who">{c.who === 'you' ? 'You' : firstName}</span>
                    {c.text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="call-controls">
            <button className={`call-ctl ${muted ? 'warn' : ''}`} onClick={() => setMuted((m) => !m)} title="Mute">
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button className="call-ctl" title="Speaker"><Volume2 size={20} /></button>
            <button className="call-ctl end" onClick={() => setStage('contacts')} title="End call">
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}