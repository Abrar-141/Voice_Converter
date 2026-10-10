import { useState, useEffect } from 'react'
import {
  Video, Monitor, Copy, Check, Link2, Mail, MessageCircle, Lock, Mic, MicOff,
  Users, Languages, ArrowLeft, Sparkles, Crown, X, Download, FileText, PhoneOff,
} from 'lucide-react'
import '../css/MeetingPage.css'

const LANGS = ['English', 'Hindi', 'Urdu', 'Spanish', 'French', 'Arabic', 'Japanese']

const INITIAL_PARTICIPANTS = [
  { id: 1, name: 'Aarav Sharma', listens: 'Urdu', host: false },
  { id: 2, name: 'Emma Wilson', listens: 'English', host: false },
  { id: 3, name: 'Diego Martín', listens: 'Spanish', host: false },
]

const MINUTES = [
  { en: 'Team reviewed the launch timeline for the voice translation beta.', hi: 'Team ne voice translation beta ke launch timeline par charcha ki.' },
  { en: 'Dual-voice dubbing latency agreed to stay under 1.2 seconds.', hi: 'Dual-voice dubbing latency 1.2 second se kam rakhne par sab raazi hue.' },
  { en: 'Spanish market pilot scheduled for next month with 50 testers.', hi: 'Spanish market pilot agle mahine 50 testers ke saath schedule hua.' },
  { en: 'Design team to finalize the new call UI by Friday.', hi: 'Design team Friday tak nayi call UI final karegi.' },
]

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/* ── Multi-Person Meeting Room — Zoom / Meet style (UI) ── */
export default function MeetingPage({ onBack }) {
  const [stage, setStage] = useState('lobby') // lobby | live | summary
  const [roomId] = useState(() => 'VC-MT-' + Math.floor(1000 + Math.random() * 9000))
  const link = `https://voiceconverter.app/m/${roomId}`
  const [myLang, setMyLang] = useState('English')
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS)
  const [mutedAll, setMutedAll] = useState(false)
  const [locked, setLocked] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [copied, setCopied] = useState('')
  const [speakerIdx, setSpeakerIdx] = useState(0)

  /* meeting timer */
  useEffect(() => {
    if (stage !== 'live') return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [stage])

  /* who is speaking (simulation) */
  useEffect(() => {
    if (stage !== 'live') return
    const t = setInterval(() => setSpeakerIdx((i) => (i + 1) % 4), 3200)
    return () => clearInterval(t)
  }, [stage])

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text) } catch { /* noop */ }
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  const shareWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join my Voice Converter meeting!\nRoom ID: ${roomId}\n${link}`)}`, '_blank')

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent('Meeting Invitation — Voice Converter')}&body=${encodeURIComponent(`Join my meeting!\nRoom ID: ${roomId}\nLink: ${link}`)}`
  }

  const removeParticipant = (id) => setParticipants((p) => p.filter((x) => x.id !== id))
  const endMeeting = () => setStage('summary')

  const downloadMinutes = () => {
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Meeting Minutes ${roomId}</title>
<style>body{font-family:'Segoe UI',Arial,sans-serif;max-width:720px;margin:40px auto;color:#111;line-height:1.6}
h1{font-size:20px}h2{font-size:13px;color:#3B82F6;text-transform:uppercase;letter-spacing:.06em}
li{margin:10px 0}.hi{color:#555;font-style:italic}.meta{color:#666;font-size:13px}</style></head><body>
<h1>Voice Converter — Automated Meeting Minutes</h1>
<p class="meta">Room: ${roomId} &nbsp;|&nbsp; Duration: ${fmt(seconds)} &nbsp;|&nbsp; Participants: ${participants.length + 1}</p>
<h2>Dual-Language Summary (English / Hindi)</h2>
<ol>${MINUTES.map((m) => `<li>${m.en}<br><span class="hi">${m.hi}</span></li>`).join('')}</ol>
<p class="meta">Tip: Open this file and press Ctrl+P → "Save as PDF".</p>
</body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-minutes-${roomId}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-root">
      <div className="mt-orb mt-orb-1" />
      <div className="mt-orb mt-orb-2" />

      {/* ── STAGE 1 — LOBBY: INSTANT LINK & INVITATION CODE ── */}
      {stage === 'lobby' && (
        <div className="mt-wrap">
          <header className="mt-top">
            <button className="mt-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
            <span className="mt-chip"><Sparkles size={13} /> AI Live Dubbing</span>
          </header>

          <div className="mt-head">
            <h1 className="mt-title">Multi-Person <span>Meeting Room</span></h1>
            <p className="mt-sub">
              Official conferences, team meetings aur groups ke liye professional meeting system — Zoom / Google Meet style.
            </p>
            <div className="mt-feats">
              <span className="mt-feat"><Link2 size={13} /> Instant Link & Code</span>
              <span className="mt-feat"><Languages size={13} /> Multi-Channel Languages</span>
              <span className="mt-feat"><Lock size={13} /> Host Controls</span>
              <span className="mt-feat"><Monitor size={13} /> Screen Sharing</span>
              <span className="mt-feat"><FileText size={13} /> Auto Minutes</span>
            </div>
          </div>

          <div className="mt-card">
            <h3 className="mt-card-title"><Link2 size={16} /> Instant Link & Invitation Code</h3>
            <div className="mt-invite-row">
              <Link2 size={15} />
              <code>{link}</code>
              <button className="mt-copy" onClick={() => copy(link, 'link')}>
                {copied === 'link' ? <Check size={13} /> : <Copy size={13} />} {copied === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-invite-row">
              <Users size={15} />
              <code>Room ID: {roomId}</code>
              <button className="mt-copy" onClick={() => copy(roomId, 'room')}>
                {copied === 'room' ? <Check size={13} /> : <Copy size={13} />} {copied === 'room' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-share-row">
              <button className="mt-share" onClick={shareWhatsApp}><MessageCircle size={15} /> WhatsApp</button>
              <button className="mt-share" onClick={shareEmail}><Mail size={15} /> Email Invite</button>
            </div>
          </div>

          <div className="mt-card">
            <h3 className="mt-card-title"><Languages size={16} /> Multi-Channel Language Selection</h3>
            <div className="mt-field">
              <label>Your listening language</label>
              <select value={myLang} onChange={(e) => setMyLang(e.target.value)}>
                {LANGS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <p className="mt-hint" style={{ textAlign: 'left' }}>
              Har participant apni alag sunne ki zabaan choose karta hai — Urdu wala Urdu, English wala English, Spanish wala Spanish sune.
            </p>
          </div>

          <div className="mt-card">
            <h3 className="mt-card-title"><Users size={16} /> Participants ({participants.length + 1})</h3>
            <div className="mt-people">
              <div className="mt-person">
                <div className="mt-pavatar">A</div>
                <div className="mt-person-info">
                  <span className="mt-pname">You <span className="mt-host-tag"><Crown size={9} /> HOST</span></span>
                  <span className="mt-plang"><Languages size={10} /> listens in {myLang}</span>
                </div>
              </div>
              {participants.map((p) => (
                <div key={p.id} className="mt-person">
                  <div className="mt-pavatar">{p.name.charAt(0)}</div>
                  <div className="mt-person-info">
                    <span className="mt-pname">{p.name}</span>
                    <span className="mt-plang"><Languages size={10} /> listens in {p.listens}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-start" onClick={() => setStage('live')}><Video size={17} /> Start Meeting</button>
        </div>
      )}

      {/* ── STAGE 2 — LIVE MEETING ── */}
      {stage === 'live' && (
        <div className="mt-live">
          <header className="mt-live-top">
            <button className="mt-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
            <div className="mt-live-meta">
              <span className="mt-chip"><Link2 size={13} /> {roomId}</span>
              <span className="mt-chip">{fmt(seconds)}</span>
              <span className="mt-chip"><Sparkles size={13} /> E2E Encrypted</span>
            </div>
          </header>

          {/* screen sharing / presentation view */}
          {sharing && (
            <>
              <div className="mt-present">
                <div className="mt-present-title"><Monitor size={16} /> Your Screen — Live Presentation</div>
                <div className="mt-present-bar" style={{ width: '70%' }} />
                <div className="mt-present-bar" style={{ width: '45%' }} />
                <div className="mt-present-bar" style={{ width: '60%' }} />
                <div className="mt-present-bar" style={{ width: '30%' }} />
                <div className="mt-present-note">
                  {participants.length + 1} participants dekh rahe hain · dual-voice dubbing chalu hai
                </div>
              </div>
              <div className="mt-strip">
                <div className="mt-tile">
                  <div className="mt-pavatar">A</div>
                  <span className="mt-tile-name">You</span>
                </div>
                {participants.map((p) => (
                  <div key={p.id} className="mt-tile">
                    <div className="mt-pavatar">{p.name.charAt(0)}</div>
                    <span className="mt-tile-name">{p.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* participant tiles — har apni language mein sun raha hai */}
          {!sharing && (
            <div className="mt-grid">
              <div className={`mt-tile ${speakerIdx === 0 && micOn && !mutedAll ? 'speaking' : ''}`}>
                <div className="mt-pavatar">A</div>
                <span className="mt-tile-name"><Crown size={11} /> You (Host)</span>
                <span className={`mt-tile-mic ${micOn && !mutedAll ? '' : 'off'}`}>
                  {micOn && !mutedAll ? <Mic size={14} /> : <MicOff size={14} />}
                </span>
                <span className="mt-tile-lang"><Languages size={10} /> {myLang}</span>
              </div>
              {participants.map((p, i) => (
                <div key={p.id} className={`mt-tile ${speakerIdx === i + 1 && !mutedAll ? 'speaking' : ''}`}>
                  <button className="mt-remove" onClick={() => removeParticipant(p.id)} title="Remove from meeting"><X size={13} /></button>
                  <div className="mt-pavatar">{p.name.charAt(0)}</div>
                  <span className="mt-tile-name">{p.name}</span>
                  <span className={`mt-tile-mic ${mutedAll ? 'off' : ''}`}>{mutedAll ? <MicOff size={14} /> : <Mic size={14} />}</span>
                  <span className="mt-tile-lang"><Languages size={10} /> {p.listens}</span>
                </div>
              ))}
            </div>
          )}

          {/* host controls */}
          <div className="mt-hostbar">
            <span className="mt-chip"><Crown size={13} /> Host Controls</span>
            <button className={`mt-hostbtn ${mutedAll ? 'on' : ''}`} onClick={() => setMutedAll((v) => !v)}>
              <MicOff size={14} /> {mutedAll ? 'All Muted' : 'Mute All'}
            </button>
            <button className={`mt-hostbtn ${locked ? 'warn' : ''}`} onClick={() => setLocked((v) => !v)}>
              <Lock size={14} /> {locked ? 'Meeting Locked' : 'Lock Meeting'}
            </button>
            <span className="mt-chip"><Users size={13} /> {participants.length + 1} in room</span>
          </div>

          <div className="mt-controls">
            <button className={`mt-ctl ${!micOn || mutedAll ? 'warn' : ''}`} onClick={() => setMicOn((m) => !m)} title="Mic">
              {micOn && !mutedAll ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button className={`mt-ctl ${sharing ? 'on' : ''}`} onClick={() => setSharing((s) => !s)} title="Screen share">
              <Monitor size={20} />
            </button>
            <button className="mt-ctl end" onClick={endMeeting} title="End meeting">
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 3 — AUTOMATED MEETING MINUTES ── */}
      {stage === 'summary' && (
        <div className="mt-wrap mt-wrap-narrow">
          <header className="mt-top">
            <button className="mt-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
            <span className="mt-chip"><Check size={13} /> Meeting Ended</span>
          </header>

          <div className="mt-head">
            <h1 className="mt-title">Meeting <span>Summary</span></h1>
            <p className="mt-sub">
              Automated meeting minutes — poori discussion ka dual-language transcript summary, download ke liye ready.
            </p>
            <div className="mt-feats">
              <span className="mt-feat"><Link2 size={13} /> Room {roomId}</span>
              <span className="mt-feat"><Users size={13} /> {participants.length + 1} participants</span>
              <span className="mt-feat">{fmt(seconds)} duration</span>
            </div>
          </div>

          <div className="mt-card">
            <h3 className="mt-card-title"><FileText size={16} /> Automated Meeting Minutes</h3>
            <ul className="mt-summary">
              {MINUTES.map((m, i) => (
                <li key={i} className="mt-minute">
                  <div className="mt-minute-en"><span className="mt-minute-num">{i + 1}.</span> {m.en}</div>
                  <div className="mt-minute-hi">↳ {m.hi}</div>
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-start" onClick={downloadMinutes}><Download size={17} /> Download Minutes</button>
          <p className="mt-hint">File khol kar Ctrl+P → "Save as PDF" se PDF ban jayega.</p>
        </div>
      )}
    </div>
  )
}