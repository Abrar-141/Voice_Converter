import { useState, useEffect, useRef } from 'react'
import {
  Upload, Music, Video, X, Languages, Sparkles, ArrowLeft,
  Download, Check, SlidersHorizontal, Mic,
} from 'lucide-react'
import '../css/StudioPage.css'

const LANGS = ['English', 'Hindi', 'Urdu', 'Spanish', 'French', 'Arabic', 'Japanese']

const PERSONAS = [
  { id: 'professional', name: 'Professional Male', emoji: '🎩', desc: 'News anchor jaisi clear, confident voice' },
  { id: 'soft', name: 'Soft Female', emoji: '🌸', desc: 'Narm, friendly aur pleasant tone' },
  { id: 'narrator', name: 'Story Narrator', emoji: '📖', desc: 'Deep, dramatic storytelling voice' },
  { id: 'streamer', name: 'Streamer', emoji: '🎮', desc: 'High-energy, fun aur youthful vibe' },
]

const SPEEDS = [0.75, 1, 1.5]

/* ── Audio & Voice Studio — file dubbing & playground (UI) ── */
export default function StudioPage({ onBack }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [dubLang, setDubLang] = useState('English')
  const [persona, setPersona] = useState('professional')
  const [speed, setSpeed] = useState(1)
  const [pitch, setPitch] = useState(0)
  const [status, setStatus] = useState('idle') // idle | processing | done
  const [progress, setProgress] = useState(0)
  const fileRef = useRef(null)

  /* dubbing progress simulation */
  useEffect(() => {
    if (status !== 'processing') return
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 90)
    return () => clearInterval(t)
  }, [status])

  useEffect(() => {
    if (progress >= 100 && status === 'processing') setStatus('done')
  }, [progress, status])

  const pickFile = (f) => {
    if (!f) return
    const isVideo = f.type.startsWith('video') || f.name.toLowerCase().endsWith('.mp4')
    setFile({
      name: f.name,
      size: f.size > 1e6 ? `${(f.size / 1e6).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      kind: isVideo ? 'video' : 'audio',
    })
    setStatus('idle')
    setProgress(0)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const startDub = () => {
    if (!file) return
    setStatus('processing')
    setProgress(0)
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
  }

  /* real downloadable WAV — tone reflects pitch & speed tuning */
  const downloadWav = () => {
    const sampleRate = 44100
    const seconds = Math.max(0.5, 2 / speed)
    const freq = 440 * Math.pow(2, pitch / 12)
    const n = Math.floor(sampleRate * seconds)
    const buffer = new ArrayBuffer(44 + n * 2)
    const view = new DataView(buffer)
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)) }
    writeStr(0, 'RIFF'); view.setUint32(4, 36 + n * 2, true); writeStr(8, 'WAVE')
    writeStr(12, 'fmt '); view.setUint32(16, 16, true)
    view.setUint16(20, 1, true); view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true); view.setUint16(34, 16, true)
    writeStr(36, 'data'); view.setUint32(40, n * 2, true)
    for (let i = 0; i < n; i++) view.setInt16(44 + i * 2, Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 12000, true)
    const blob = new Blob([buffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const base = file ? file.name.replace(/\.[^.]+$/, '') : 'voice'
    a.href = url
    a.download = `dubbed-${base}-${dubLang.toLowerCase()}.wav`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="vs-root">
      <div className="vs-orb vs-orb-1" />
      <div className="vs-orb vs-orb-2" />

      <div className="vs-wrap">
        <header className="vs-top">
          <button className="vs-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
          <span className="vs-chip"><Sparkles size={13} /> AI Dubbing Lab</span>
        </header>

        <div className="vs-head">
          <h1 className="vs-title">Audio & Voice <span>Studio</span></h1>
          <p className="vs-sub">
            Recorded files aur external audios ko convert karne ka testing studio — MP3/WAV/MP4 upload karo, persona chuno, aur nayi zabaan mein dub suno.
          </p>
        </div>

        {/* ── 1. FILE UPLOAD CONVERTER ── */}
        <div className="vs-card">
          <h3 className="vs-card-title"><Upload size={16} /> File Upload Converter</h3>

          {!file ? (
            <div
              className={`vs-drop ${dragOver ? 'over' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <Upload size={30} />
              <span className="vs-drop-main">Drag & drop file here — ya click karo</span>
              <span className="vs-drop-sub">MP3 · WAV · MP4 video supported</span>
            </div>
          ) : (
            <div className="vs-file">
              {file.kind === 'video' ? <Video size={24} /> : <Music size={24} />}
              <div className="vs-file-info">
                <span className="vs-file-name">{file.name}</span>
                <span className="vs-file-meta">{file.kind === 'video' ? 'Video file' : 'Audio file'} · {file.size}</span>
              </div>
              <button className="vs-file-x" onClick={reset} title="Remove"><X size={14} /></button>
            </div>
          )}
          <input type="file" ref={fileRef} hidden accept=".mp3,.wav,.mp4,audio/*,video/*" onChange={(e) => pickFile(e.target.files?.[0])} />

          <div className="vs-field">
            <label><Languages size={12} /> Dub into language</label>
            <select value={dubLang} onChange={(e) => setDubLang(e.target.value)}>
              {LANGS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <button className="vs-start" onClick={startDub} disabled={!file || status === 'processing'}>
            <Sparkles size={16} /> {status === 'processing' ? 'Dubbing…' : 'Start Dubbing'}
          </button>

          {status === 'processing' && (
            <div className="vs-progress">
              <div className="vs-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
          {status === 'processing' && (
            <p className="vs-progress-note">AI dubbing chal raha hai… {progress}% ({dubLang} · {persona} voice)</p>
          )}
        </div>

        {/* ── 2. AI VOICE TONE & PERSONA PICKER ── */}
        <div className="vs-card">
          <h3 className="vs-card-title"><Mic size={16} /> AI Voice Tone & Persona Picker</h3>
          <div className="vs-personas">
            {PERSONAS.map((p) => (
              <button key={p.id} className={`vs-persona ${persona === p.id ? 'on' : ''}`} onClick={() => setPersona(p.id)}>
                <span className="vs-persona-emoji">{p.emoji}</span>
                <span className="vs-persona-name">{p.name}</span>
                <span className="vs-persona-desc">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. PITCH & SPEED TUNING ── */}
        <div className="vs-card">
          <h3 className="vs-card-title"><SlidersHorizontal size={16} /> Pitch & Speed Tuning</h3>

          <div className="vs-slider-row">
            <div className="vs-slider-labels">
              <span>Playback Speed</span>
              <strong>{speed}x</strong>
            </div>
            <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="vs-range" />
            <div className="vs-presets">
              {SPEEDS.map((s) => (
                <button key={s} className={`vs-preset ${speed === s ? 'on' : ''}`} onClick={() => setSpeed(s)}>{s}x</button>
              ))}
            </div>
          </div>

          <div className="vs-slider-row">
            <div className="vs-slider-labels">
              <span>Voice Pitch</span>
              <strong>{pitch > 0 ? `+${pitch}` : pitch} semitones</strong>
            </div>
            <input type="range" min="-12" max="12" step="1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="vs-range" />
          </div>

          <div className="vs-wave">
            {[...Array(22)].map((_, i) => (
              <div key={i} className="vs-wbar" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
          <p className="vs-hint">Preview wave pitch ke saath live badalta hai — download bhi isi tuning ke saath hoga.</p>
        </div>

        {/* ── 4. EXPORT & DOWNLOAD HUB ── */}
        <div className="vs-card">
          <h3 className="vs-card-title"><Download size={16} /> Export & Download Hub</h3>

          {status === 'done' && file ? (
            <>
              <div className="vs-output">
                <Music size={24} />
                <div className="vs-output-info">
                  <span className="vs-output-name">dubbed-{file.name.replace(/\.[^.]+$/, '')}-{dubLang.toLowerCase()}.wav</span>
                  <span className="vs-output-meta">{dubLang} · {persona} voice · {speed}x · pitch {pitch > 0 ? `+${pitch}` : pitch}</span>
                </div>
                <Check size={18} style={{ color: '#22c55e' }} />
              </div>
              <button className="vs-dl" onClick={downloadWav}><Download size={16} /> Download High-Quality WAV</button>
              <p className="vs-hint">File aapke downloads mein save hogi — real playable audio, pitch/speed tuning ke saath.</p>
            </>
          ) : (
            <p className="vs-hint">
              {status === 'processing'
                ? '⏳ Dubbing complete hone par download ready hoga…'
                : '⬆️ Pehle file upload karo aur "Start Dubbing" dabao — phir yahan download ready milega.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}