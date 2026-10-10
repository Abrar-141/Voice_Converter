import { useState, useEffect, useRef } from 'react'
import {
  User, Mail, Phone, Link2, Monitor, Mic, Volume2, Bell, Shield, FileText,
  Cloud, Search, Download, Trash2, CreditCard, Crown, Palette, AlertTriangle,
  X, Check, ArrowLeft, Sparkles, LogOut,
} from 'lucide-react'
import '../css/SettingsPage.css'

const LANGS = ['Hindi', 'Urdu', 'English', 'Spanish', 'French', 'Arabic', 'Japanese']
const PERSONAS = ['Deep Male', 'Gentle Female', 'Studio Crisp', 'Natural Conversational']
const SPEEDS = [0.8, 1, 1.2]
const THEMES = ['dark', 'neon', 'light', 'system']

const DEVICES_INIT = [
  { id: 1, name: 'Chrome — Windows 11', place: 'Lahore, PK', now: true },
  { id: 2, name: 'Safari — iPhone 15', place: 'Lahore, PK', now: false },
  { id: 3, name: 'Edge — Windows 10', place: 'Dubai, AE', now: false },
]

const LOGS_INIT = [
  { id: 1, date: '09 Oct 2026', time: '08:45 PM', duration: '12:34', name: 'Emma Wilson', pair: 'Hindi ⇄ English' },
  { id: 2, date: '08 Oct 2026', time: '02:10 PM', duration: '05:02', name: 'Diego Martín', pair: 'Hindi ⇄ Spanish' },
  { id: 3, date: '07 Oct 2026', time: '07:30 PM', duration: '21:47', name: 'Sara Khan', pair: 'Urdu ⇄ English' },
  { id: 4, date: '06 Oct 2026', time: '11:15 AM', duration: '03:18', name: 'Yuki Tanaka', pair: 'Hindi ⇄ Japanese' },
]

const RECORDINGS_INIT = [
  { id: 1, name: 'Call with Emma Wilson', date: '09 Oct · 12:34 min', size: '3.4 MB' },
  { id: 2, name: 'Team Meeting — Dev Team', date: '08 Oct · 24:10 min', size: '6.8 MB' },
  { id: 3, name: 'Call with Diego Martín', date: '08 Oct · 05:02 min', size: '1.5 MB' },
]

const SECTIONS = [
  { id: 'st-profile', label: 'Account & Profile' },
  { id: 'st-audio', label: 'Audio & Hardware' },
  { id: 'st-voice', label: 'Voice & Translation' },
  { id: 'st-privacy', label: 'Call & Privacy' },
  { id: 'st-history', label: 'History & Storage' },
  { id: 'st-billing', label: 'Billing & Credits' },
  { id: 'st-appearance', label: 'Appearance & Alerts' },
  { id: 'st-danger', label: 'Danger Zone' },
]

const DEFAULT_PREFS = {
  noiseSuppress: true, echoRemoval: true,
  speakLang: 'Hindi', listenLang: 'English', persona: 'Natural Conversational',
  speed: 1, pitch: 0, blend: 70,
  micDevice: 'Default — System Mic', speaker: 'Default Speakers',
  autoRecord: false, autoTranscript: true, retention: '30 days',
  theme: 'dark',
  sfxRing: true, sfxConnect: true, sfxEnd: true,
  notifyInvites: true, notifyCredits: true, notifyTranscripts: false,
  minutesLeft: 42, minutesTotal: 60, points: 100,
}

const loadPrefs = () => {
  try { return { ...DEFAULT_PREFS, ...(JSON.parse(localStorage.getItem('vc_prefs')) || {}) } }
  catch { return DEFAULT_PREFS }
}

/* ── reusable bits ── */
function Toggle({ on, onChange }) {
  return <button className={`st-switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)}><span className="st-knob" /></button>
}
function Row({ title, desc, children }) {
  return (
    <div className="st-row">
      <div className="st-row-info">
        <span className="st-row-title">{title}</span>
        {desc && <span className="st-row-desc">{desc}</span>}
      </div>
      <div className="st-row-ctl">{children}</div>
    </div>
  )
}
function Sel({ value, onChange, options }) {
  return <select className="st-select" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select>
}

/* ── LOGIC — APPEND MARKER ── */

/* ── Settings & Preferences — enterprise control center ── */
export default function SettingsPage({ onBack }) {
  const [prefs, setPrefs] = useState(loadPrefs)
  const set = (k, v) => setPrefs((p) => ({ ...p, [k]: v }))

  /* persist + theme apply */
  useEffect(() => {
    try { localStorage.setItem('vc_prefs', JSON.stringify(prefs)) } catch { /* noop */ }
    const mode = prefs.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : prefs.theme
    document.documentElement.setAttribute('data-mode', mode)
  }, [prefs])

  /* profile */
  const [avatar, setAvatar] = useState(null)
  const [name, setName] = useState('Abrar Ahmad')
  const [uname, setUname] = useState('@abrar141')
  const [email, setEmail] = useState('abrar@voiceconverter.app')
  const [phone, setPhone] = useState('+92 300 1234567')
  const [emailOk, setEmailOk] = useState(true)
  const [phoneOk, setPhoneOk] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [accounts, setAccounts] = useState({ Google: true, GitHub: false })
  const avatarRef = useRef(null)
  const onAvatar = (e) => {
    const f = e.target.files?.[0]
    if (f) setAvatar(URL.createObjectURL(f))
    e.target.value = ''
  }

  /* devices */
  const [devices, setDevices] = useState(DEVICES_INIT)

  /* live mic test — real Web Audio analyser */
  const [micTest, setMicTest] = useState(false)
  const [level, setLevel] = useState(0)
  useEffect(() => {
    if (!micTest) { setLevel(0); return }
    let stream, ctx, raf
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((s) => {
        stream = s
        ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        ctx.createMediaStreamSource(s).connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        const tick = () => {
          analyser.getByteFrequencyData(data)
          let sum = 0
          for (const v of data) sum += v
          setLevel(Math.min(100, Math.round((sum / data.length) * 1.6)))
          raf = requestAnimationFrame(tick)
        }
        tick()
      })
      .catch(() => {})
    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (ctx) ctx.close()
    }
  }, [micTest])

  const playTestSound = () => {
    try {
      const ctx = new AudioContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = 660; g.gain.value = 0.15
      o.start(); o.stop(ctx.currentTime + 0.4)
      setTimeout(() => ctx.close(), 600)
    } catch { /* noop */ }
  }

  /* history & storage */
  const [logs, setLogs] = useState(LOGS_INIT)
  const [recordings, setRecordings] = useState(RECORDINGS_INIT)
  const [query, setQuery] = useState('')
  const [confirmWipe, setConfirmWipe] = useState('')
  const [delArmed, setDelArmed] = useState(false)
  const filteredLogs = logs.filter((l) => `${l.name} ${l.pair} ${l.date}`.toLowerCase().includes(query.toLowerCase()))

  const wipe = (kind) => {
    if (confirmWipe !== kind) {
      setConfirmWipe(kind)
      setTimeout(() => setConfirmWipe(''), 3000)
      return
    }
    setConfirmWipe('')
    if (kind === 'logs') setLogs([])
    else setRecordings([])
  }

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportTranscripts = (fmt) => {
    const lines = filteredLogs.map((l) => `${l.date} ${l.time} — ${l.name} — ${l.pair} — ${l.duration}`)
    if (fmt === 'pdf') {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Transcripts</title><style>body{font-family:Arial;max-width:700px;margin:40px auto}li{margin:8px 0}</style></head><body><h1>Voice Converter — Call Transcripts</h1><ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>Tip: Ctrl+P → Save as PDF</p></body></html>`
      download(html, 'call-transcripts.html', 'text/html')
    } else {
      download(lines.join('\n'), 'call-transcripts.txt', 'text/plain')
    }
  }

  const redeemPoints = () => {
    if (prefs.points < 100) return
    set('points', prefs.points - 100)
    set('minutesLeft', prefs.minutesLeft + 30)
  }

  const exportData = () =>
    download(JSON.stringify({ profile: { name, uname, email, phone }, prefs, logs, recordings }, null, 2), 'voice-converter-data.json', 'application/json')

  return (
    <div className="st-root">
      <div className="st-orb st-orb-1" />
      <div className="st-orb st-orb-2" />

      <div className="st-layout">
        <aside className="st-sidebar">
          <button className="st-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
          <span className="st-side-title">Settings</span>
          {SECTIONS.map((s) => (
            <button key={s.id} className="st-side-btn" onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}>
              {s.label}
            </button>
          ))}
        </aside>

        <main className="st-main">
          <header className="st-head">
            <h1 className="st-title">Settings & <span>Preferences</span></h1>
            <p className="st-sub">Enterprise-grade controls — sab kuch ek jagah, changes automatically save hote hain.</p>
          </header>

          {/* ── 1. ACCOUNT & PROFILE ── */}
          <section id="st-profile" className="st-sec">
            <h2 className="st-sec-title"><User size={16} /> Account & Profile</h2>
            <div className="st-card">
              <div className="st-profile-head">
                <label className="st-avatar" onClick={() => avatarRef.current?.click()}>
                  {avatar ? <img src={avatar} alt="me" /> : name.charAt(0)}
                  <span className="st-avatar-edit">CHANGE</span>
                </label>
                <input type="file" hidden accept="image/*" ref={avatarRef} onChange={onAvatar} />
                <div className="st-field">
                  <label>Display name</label>
                  <input className="st-input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="st-field">
                  <label>Username</label>
                  <input className="st-input" value={uname} onChange={(e) => setUname(e.target.value)} />
                </div>
              </div>

              <Row title="Email address" desc="Registered email — verification & password reset ke liye">
                <div className="st-inline">
                  <input className="st-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button className={`st-btn small ${emailOk ? 'ok' : ''}`} onClick={() => setEmailOk(!emailOk)}>
                    {emailOk ? <><Check size={12} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </Row>
              <Row title="Phone number" desc="2FA aur call alerts ke liye">
                <div className="st-inline">
                  <input className="st-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <button className={`st-btn small ${phoneOk ? 'ok' : ''}`} onClick={() => setPhoneOk(!phoneOk)}>
                    {phoneOk ? <><Check size={12} /> Verified</> : 'Verify'}
                  </button>
                </div>
              </Row>
              <Row title="Password" desc="Reset link aapke email par jayega">
                <button className="st-btn small" onClick={() => { setResetSent(true); setTimeout(() => setResetSent(false), 2500) }}>
                  {resetSent ? <><Check size={12} /> Reset link sent</> : 'Change / Reset Password'}
                </button>
              </Row>
              <Row title="Google account" desc="Social login se sign-in karna">
                <button className="st-btn small" onClick={() => setAccounts((a) => ({ ...a, Google: !a.Google }))}>
                  <Link2 size={13} /> {accounts.Google ? 'Unlink' : 'Link'}
                </button>
              </Row>
              <Row title="GitHub account" desc="Developer login ke liye">
                <button className="st-btn small" onClick={() => setAccounts((a) => ({ ...a, GitHub: !a.GitHub }))}>
                  <Link2 size={13} /> {accounts.GitHub ? 'Unlink' : 'Link'}
                </button>
              </Row>
              <Row title="Active devices & sessions" desc={`${devices.length} devices logged in`}>
                <button className="st-btn danger small" onClick={() => setDevices(devices.filter((d) => d.now))} disabled={devices.length <= 1}>
                  <LogOut size={13} /> Logout from all devices
                </button>
              </Row>
              {devices.map((d) => (
                <div key={d.id} className="st-devrow">
                  <Monitor size={16} className="st-devicon" />
                  <div className="st-devinfo">
                    <span className="st-devname">{d.name}</span>
                    <span className="st-devmeta">{d.place}</span>
                  </div>
                  {d.now && <span className="st-now-tag">THIS DEVICE</span>}
                </div>
              ))}
            </div>
          </section>

          {/* ── 2. AUDIO & HARDWARE ── */}
          <section id="st-audio" className="st-sec">
            <h2 className="st-sec-title"><Mic size={16} /> Audio & Hardware</h2>
            <div className="st-card">
              <Row title="Microphone input" desc="System ke multiple mics mein se choose karo">
                <Sel value={prefs.micDevice} onChange={(v) => set('micDevice', v)} options={['Default — System Mic', 'USB Condenser Mic', 'Headset Mic', 'Webcam Mic']} />
              </Row>
              <Row title="Live mic input level & test" desc="Bolo aur dekho mic kaam kar raha hai ya nahi">
                <div className="st-inline">
                  <div className="st-meter"><div className="st-meter-fill" style={{ width: `${level}%` }} /></div>
                  <button className={`st-btn small ${micTest ? 'ok' : ''}`} onClick={() => setMicTest(!micTest)}>
                    {micTest ? 'Stop Test' : 'Test Mic'}
                  </button>
                </div>
              </Row>
              <Row title="Speaker / output device" desc="Headphones ya default speakers">
                <div className="st-inline">
                  <Sel value={prefs.speaker} onChange={(v) => set('speaker', v)} options={['Default Speakers', 'Headphones', 'HDMI / Monitor', 'Bluetooth Device']} />
                  <button className="st-btn small" onClick={playTestSound}><Volume2 size={13} /> Play Test Sound</button>
                </div>
              </Row>
              <Row title="AI noise suppression" desc="Fan, traffic jaisa background noise suppress karo">
                <Toggle on={prefs.noiseSuppress} onChange={(v) => set('noiseSuppress', v)} />
              </Row>
              <Row title="Echo removal" desc="Speaker feedback/echo cancel karo">
                <Toggle on={prefs.echoRemoval} onChange={(v) => set('echoRemoval', v)} />
              </Row>
            </div>
          </section>

          {/* ── 3. VOICE & TRANSLATION ENGINE DEFAULTS ── */}
          <section id="st-voice" className="st-sec">
            <h2 className="st-sec-title"><Sparkles size={16} /> Voice & Translation Engine Defaults</h2>
            <div className="st-card">
              <Row title="Default speaking language" desc="App open hote hi aapki bolne ki zabaan">
                <Sel value={prefs.speakLang} onChange={(v) => set('speakLang', v)} options={LANGS} />
              </Row>
              <Row title="Default listening language" desc="Samne wale ki baat kis zabaan mein translate ho">
                <Sel value={prefs.listenLang} onChange={(v) => set('listenLang', v)} options={LANGS} />
              </Row>
              <Row title="AI voice persona (dubbing character)" desc="Translated voice ka default tone">
                <Sel value={prefs.persona} onChange={(v) => set('persona', v)} options={PERSONAS} />
              </Row>
              <div className="st-slider-row">
                <div className="st-slider-top"><span>Speech rate (default speed)</span><strong>{prefs.speed}x</strong></div>
                <input type="range" min="0.5" max="2" step="0.05" value={prefs.speed} onChange={(e) => set('speed', Number(e.target.value))} className="st-range" />
                <div className="st-presets">
                  {SPEEDS.map((s) => (
                    <button key={s} className={`st-preset ${prefs.speed === s ? 'on' : ''}`} onClick={() => set('speed', s)}>{s}x</button>
                  ))}
                </div>
              </div>
              <div className="st-slider-row">
                <div className="st-slider-top"><span>Voice pitch</span><strong>{prefs.pitch > 0 ? `+${prefs.pitch}` : prefs.pitch} semitones</strong></div>
                <input type="range" min="-12" max="12" step="1" value={prefs.pitch} onChange={(e) => set('pitch', Number(e.target.value))} className="st-range" />
              </div>
              <div className="st-slider-row">
                <div className="st-slider-top"><span>Audio mixing blend (Original ↔ Dubbed)</span><strong>{prefs.blend}% dubbed</strong></div>
                <input type="range" min="0" max="100" value={prefs.blend} onChange={(e) => set('blend', Number(e.target.value))} className="st-range" />
                <div className="st-slider-top"><span>0% = sirf original awaz</span><span>100% = sirf translated voice</span></div>
              </div>
            </div>
          </section>

          {/* ── 4. CALL & MEETING PRIVACY ── */}
          <section id="st-privacy" className="st-sec">
            <h2 className="st-sec-title"><Shield size={16} /> Call & Meeting Privacy</h2>
            <div className="st-card">
              <Row title="Auto-record calls" desc="Call connect hote hi audio record aur cloud par save ho">
                <Toggle on={prefs.autoRecord} onChange={(v) => set('autoRecord', v)} />
              </Row>
              <Row title="Auto-generate transcripts" desc="Har call ke baad text transcript automatically save ho">
                <Toggle on={prefs.autoTranscript} onChange={(v) => set('autoTranscript', v)} />
              </Row>
              <Row title="End-to-end encryption" desc="Voice data transit encryption status">
                <span className="st-ok-badge"><Shield size={13} /> Active — TLS 1.3 · AES-256-GCM</span>
              </Row>
              <Row title="Data retention policy" desc="Saved transcripts aur recordings kitne din baad delete hon">
                <Sel value={prefs.retention} onChange={(v) => set('retention', v)} options={['7 days', '30 days', '90 days', 'Never']} />
              </Row>
            </div>
          </section>

          {/* ── 5. CALL LOGS, TRANSCRIPTS & STORAGE MANAGER ── */}
          <section id="st-history" className="st-sec">
            <h2 className="st-sec-title"><FileText size={16} /> Call Logs, Transcripts & Storage</h2>
            <div className="st-card">
              <div className="st-logsearch">
                <Search size={15} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transcripts by keyword, name, language..." />
              </div>

              {filteredLogs.map((l) => (
                <div key={l.id} className="st-logrow">
                  <FileText size={16} className="st-devicon" />
                  <div className="st-devinfo">
                    <span className="st-devname">{l.name} — {l.pair}</span>
                    <span className="st-devmeta">{l.date} · {l.time} · duration {l.duration}</span>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && <p className="st-hint" style={{ textAlign: 'center' }}>No transcripts found</p>}

              <div className="st-inline" style={{ justifyContent: 'flex-end' }}>
                <button className="st-btn small" onClick={() => exportTranscripts('pdf')}><Download size={13} /> Export PDF</button>
                <button className="st-btn small" onClick={() => exportTranscripts('txt')}><Download size={13} /> Export TXT</button>
              </div>
            </div>

            <div className="st-card">
              <h3 className="st-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', margin: 0, fontSize: '0.95rem' }}><Cloud size={15} /> Cloud Audio Playback Hub</h3>
              {recordings.map((r) => (
                <div key={r.id} className="st-recrow">
                  <Cloud size={16} className="st-devicon" />
                  <div className="st-recinfo">
                    <span className="st-recname">{r.name}</span>
                    <span className="st-recmeta">{r.date} · {r.size}</span>
                  </div>
                  <button className="st-btn small" title="Play"><Volume2 size={13} /> Play</button>
                  <button className="st-btn small" title="Download"><Download size={13} /></button>
                  <button className="st-btn danger small" onClick={() => setRecordings((rs) => rs.filter((x) => x.id !== r.id))} title="Delete"><Trash2 size={13} /></button>
                </div>
              ))}
              {recordings.length === 0 && <p className="st-hint" style={{ textAlign: 'center' }}>No cloud recordings</p>}

              <div className="st-inline" style={{ justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button className="st-btn danger small" onClick={() => wipe('logs')}>
                  {confirmWipe === 'logs' ? 'Confirm — Clear All Logs?' : <><Trash2 size={13} /> Clear All Call Logs</>}
                </button>
                <button className="st-btn danger small" onClick={() => wipe('recs')}>
                  {confirmWipe === 'recs' ? 'Confirm — Delete All Recordings?' : <><Trash2 size={13} /> Delete All Cloud Recordings</>}
                </button>
              </div>
            </div>
          </section>

          {/* ── 6. BILLING, SUBSCRIPTION & CREDITS ── */}
          <section id="st-billing" className="st-sec">
            <h2 className="st-sec-title"><CreditCard size={16} /> Billing, Subscription & Credits</h2>
            <div className="st-card">
              <Row title="Current plan" desc="Membership tier">
                <span className="st-plan-badge"><Crown size={14} /> Pro Tier</span>
              </Row>
              <div className="st-slider-row">
                <div className="st-slider-top"><span>Translation calling minutes</span><strong>{prefs.minutesLeft} / {prefs.minutesTotal} mins left</strong></div>
                <div className="st-bar"><div className="st-bar-fill" style={{ width: `${Math.round((prefs.minutesLeft / prefs.minutesTotal) * 100)}%` }} /></div>
                <span className="st-bar-note">Har call minutes use karti hai — low balance par warning milti hai.</span>
              </div>
              <Row title="Points balance" desc={`${prefs.points} points — 100 points = 30 extra minutes`}>
                <button className="st-btn small" onClick={redeemPoints} disabled={prefs.points < 100}>
                  <Sparkles size={13} /> Redeem 100 → +30 mins
                </button>
              </Row>
              <Row title="Billing invoices" desc="Payment history">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                  <div className="st-invoice-row">
                    <span className="st-recname" style={{ flex: 1 }}>Oct 2026 — Pro Monthly</span>
                    <span className="st-recmeta">$12.00 · Paid</span>
                    <button className="st-btn small" onClick={() => download('Invoice Oct 2026 — Pro Monthly — $12.00 — PAID', 'invoice-oct-2026.txt', 'text/plain')}><Download size={13} /></button>
                  </div>
                  <div className="st-invoice-row">
                    <span className="st-recname" style={{ flex: 1 }}>Sep 2026 — Pro Monthly</span>
                    <span className="st-recmeta">$12.00 · Paid</span>
                    <button className="st-btn small" onClick={() => download('Invoice Sep 2026 — Pro Monthly — $12.00 — PAID', 'invoice-sep-2026.txt', 'text/plain')}><Download size={13} /></button>
                  </div>
                </div>
              </Row>
              <Row title="Upgrade plan" desc="Unlimited minutes + premium voices">
                <button className="st-btn primary">Upgrade to Unlimited</button>
              </Row>
            </div>
          </section>

          {/* ── 7. APP APPEARANCE & NOTIFICATIONS ── */}
          <section id="st-appearance" className="st-sec">
            <h2 className="st-sec-title"><Palette size={16} /> App Appearance & Notifications</h2>
            <div className="st-card">
              <Row title="Theme selector" desc="Dark, Neon Glow Dark, Light ya System Default">
                <Sel value={prefs.theme} onChange={(v) => set('theme', v)} options={THEMES} />
              </Row>
              <Row title="Ringtone — incoming call" desc="Call aane par ring sound">
                <Toggle on={prefs.sfxRing} onChange={(v) => set('sfxRing', v)} />
              </Row>
              <Row title="Connected beep" desc="Call connect hone par beep">
                <Toggle on={prefs.sfxConnect} onChange={(v) => set('sfxConnect', v)} />
              </Row>
              <Row title="End call sound" desc="Call khatam hone par alert">
                <Toggle on={prefs.sfxEnd} onChange={(v) => set('sfxEnd', v)} />
              </Row>
              <Row title="New meeting invites" desc="Jab koi invite bheje">
                <Toggle on={prefs.notifyInvites} onChange={(v) => set('notifyInvites', v)} />
              </Row>
              <Row title="Credit low warnings" desc="Minutes khatam hone par alert">
                <Toggle on={prefs.notifyCredits} onChange={(v) => set('notifyCredits', v)} />
              </Row>
              <Row title="Transcript ready alerts" desc="Transcript ban ne par notify karo">
                <Toggle on={prefs.notifyTranscripts} onChange={(v) => set('notifyTranscripts', v)} />
              </Row>
            </div>
          </section>

          {/* ── 8. DANGER ZONE ── */}
          <section id="st-danger" className="st-sec">
            <h2 className="st-sec-title"><AlertTriangle size={16} /> Danger Zone</h2>
            <div className="st-card st-danger-card">
              <Row title="Export personal data" desc="Profile, preferences, logs aur transcripts ek file mein">
                <button className="st-btn small" onClick={exportData}><Download size={13} /> Export My Data</button>
              </Row>
              <Row title="Delete account permanently" desc="Account, recordings aur saara data completely wipe ho jayega — ye wapas nahi aata!">
                <button
                  className={`st-btn small ${delArmed ? 'danger' : ''}`}
                  onClick={() => {
                    if (!delArmed) { setDelArmed(true); setTimeout(() => setDelArmed(false), 5000); return }
                    setDelArmed(false)
                    localStorage.removeItem('vc_token')
                    localStorage.removeItem('vc_user')
                    localStorage.removeItem('vc_prefs')
                    onBack()
                  }}
                >
                  <Trash2 size={13} /> {delArmed ? 'Confirm — Delete Everything?' : 'Delete Account Permanently'}
                </button>
              </Row>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}